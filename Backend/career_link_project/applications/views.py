from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import SavedJob
from .permissions import IsJobSeeker
from .serializers import SavedJobSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from jobs.models import JobPosting

from .models import Application, ApplicationNote
from .serializers import ApplicationSerializer, ApplicationNoteSerializer
from accounts.models import JobseekerProfile  # change if needed


def get_jobseeker_profile_or_error(user):
    try:
        return JobseekerProfile.objects.get(user=user)

    except JobseekerProfile.DoesNotExist:
        raise ValidationError(
            {
                "detail": "Jobseeker profile not found for this user."
            }
        )


class ApplicationListCreateView(generics.ListCreateAPIView):
    """
    GET: Get all applications of logged-in user (jobs applied to for seeker, received for employer)
    POST: Create new application for logged-in job seeker
    """

    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Application.objects.none()

        if hasattr(user, "role") and user.role == "ep":
            try:
                employer_profile = user.employer_profile
                return Application.objects.filter(job__employer=employer_profile).order_by("-created_at")
            except Exception:
                return Application.objects.none()
        elif user.is_staff or user.is_superuser:
            return Application.objects.all().order_by("-created_at")
        else:
            jobseeker_profile = get_jobseeker_profile_or_error(user)
            return Application.objects.filter(
                job_seeker=jobseeker_profile
            ).order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, "role") and user.role != "js" and not user.is_superuser:
            raise ValidationError(
                {
                    "detail": "Only job seekers can apply for jobs."
                }
            )

        jobseeker_profile = get_jobseeker_profile_or_error(
            user
        )

        job = serializer.validated_data.get("job")

        if Application.objects.filter(
            job_seeker=jobseeker_profile,
            job=job
        ).exists():
            raise ValidationError(
                {
                    "detail": "You have already applied for this job."
                }
            )

        serializer.save(job_seeker=jobseeker_profile)


class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Get one application
    PUT/PATCH: Update application
    DELETE: Delete application
    """

    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "id"

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Application.objects.none()

        if hasattr(user, "role") and user.role == "ep":
            try:
                employer_profile = user.employer_profile
                return Application.objects.filter(job__employer=employer_profile)
            except Exception:
                return Application.objects.none()
        elif user.is_staff or user.is_superuser:
            return Application.objects.all()
        else:
            jobseeker_profile = get_jobseeker_profile_or_error(user)
            return Application.objects.filter(
                job_seeker=jobseeker_profile
            )

class SavedJobViewSet(viewsets.ModelViewSet):
    permission_classes =[
        permissions.IsAuthenticated,
        IsJobSeeker,
    ]
    serializer_class = SavedJobSerializer

    http_method_names = ["get", "post","patch", "delete",]

    def get_queryset(self):
        queryset = (
            SavedJob.objects.filter(
                job_seeker=self.request.job_seeker,
            )
            .select_related("job")
            .order_by("-saved_at")
        )

        raw_job_id = self.request.query_params.get("job_id")

        if raw_job_id:
            try:
                job_id = int(raw_job_id)
                queryset = queryset.filter(job_id=job_id)
            except (TypeError, ValueError):
                queryset = queryset.none()

        return queryset
    def get_serializer_context(self):
        context = super().get_serializer_context()

        context["job_seeker"] = getattr(
            self.request,
            "job_seeker",
            None,
        )

        return context

    def perform_create(self, serializer):
        serializer.save(job_seeker=self.request.job_seeker)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {
                    "job_id": [
                        "You have already saved this job."
                    ]
                },
                status=status.HTTP_409_CONFLICT,
            )

    @action(detail=False, methods=["get"], url_path="check")
    def check(self, request):
        """
        Check whether the logged-in job seeker has saved a job.

        Example:
            GET /api/applications/saved-jobs/check/?job_id=1
        """

        raw_job_id = request.query_params.get("job_id")

        try:
            job_id = int(raw_job_id)
        except (TypeError, ValueError):
            return Response(
                {
                    "detail": "A valid job_id query parameter is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved = self.get_queryset().filter(job_id=job_id).exists()

        return Response(
            {
                "job_id": job_id,
                "saved": saved,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="toggle")
    def toggle(self, request):
        raw_job_id = request.data.get("job_id")

        try:
            job_id = int(raw_job_id)
        except (TypeError, ValueError):
            return Response(
                {
                    "detail": "A valid job_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved_job = self.get_queryset().filter(job_id=job_id).first()

        if saved_job:
            saved_job.delete()

            return Response(
                {
                    "job_id": job_id,
                    "saved": False,
                    "detail": "Job removed from saved jobs.",
                },
                status=status.HTTP_200_OK,
            )

        data = {
            "job_id": job_id,
        }

        if "note" in request.data:
            data["note"] = request.data.get("note")

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(job_seeker=self.request.job_seeker)
        except IntegrityError:
            return Response(
                {
                    "job_id": [
                        "You have already saved this job."
                    ]
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "job_id": job_id,
                "saved": True,
                "detail": "Job saved.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    
class ApplicationNoteViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, "employer_profile"):
            return ApplicationNote.objects.filter(application__job__employer=self.request.user.employer_profile)
        return ApplicationNote.objects.none()

    def perform_create(self, serializer):
        application = serializer.validated_data.get("application")
        if application.job.employer.user == self.request.user:
            serializer.save(employer=self.request.user.employer_profile)
        else:
            raise permissions.PermissionDenied("You are not authorized to add notes to this application.")
