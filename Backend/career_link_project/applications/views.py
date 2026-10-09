import logging

from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import JobseekerProfile  # change if needed
from jobs.models import JobPosting
from notifications.models import Notification
from notifications.utils import notify_user

from .models import Application, ApplicationNote, SavedJob
from .permissions import IsJobSeeker
from .serializers import ApplicationNoteSerializer, ApplicationSerializer, SavedJobSerializer

logger = logging.getLogger(__name__)

VALID_TRANSITIONS = {
    Application.Status.APPLIED: [Application.Status.UNDER_REVIEW, Application.Status.REJECTED],
    Application.Status.UNDER_REVIEW: [Application.Status.SHORTLISTED, Application.Status.REJECTED],
    Application.Status.SHORTLISTED: [Application.Status.INTERVIEW, Application.Status.REJECTED],
    Application.Status.INTERVIEW: [Application.Status.ACCEPTED, Application.Status.REJECTED],
    Application.Status.ACCEPTED: [],
    Application.Status.REJECTED: [],
}

STATUS_MESSAGES = {
    Application.Status.UNDER_REVIEW: "Your application is now under review.",
    Application.Status.SHORTLISTED: "You've been shortlisted!",
    Application.Status.INTERVIEW: "You've been invited to an interview.",
    Application.Status.ACCEPTED: "Congratulations! Your application has been accepted.",
    Application.Status.REJECTED: "Your application was not successful this time.",
}


def get_jobseeker_profile_or_error(user):
    try:
        return JobseekerProfile.objects.get(user=user)
    except JobseekerProfile.DoesNotExist:
        raise ValidationError({"detail": "Jobseeker profile not found for this user."})


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
            return Application.objects.filter(job_seeker=jobseeker_profile).order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, "role") and user.role != "js" and not user.is_superuser:
            raise ValidationError({"detail": "Only job seekers can apply for jobs."})

        jobseeker_profile = get_jobseeker_profile_or_error(user)

        job = serializer.validated_data.get("job")

        if Application.objects.filter(job_seeker=jobseeker_profile, job=job).exists():
            raise ValidationError({"detail": "You have already applied for this job."})

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
            return Application.objects.filter(job_seeker=jobseeker_profile)

    def perform_update(self, serializer):
        user = self.request.user
        application = serializer.instance
        old_status = application.status
        new_status = serializer.validated_data.get("status", old_status)

        # Only the owning employer (or staff) can change status.
        if new_status != old_status:
            is_owning_employer = (
                hasattr(user, "role")
                and user.role == "ep"
                and getattr(user, "employer_profile", None) == application.job.employer
            )
            if not (is_owning_employer or user.is_staff or user.is_superuser):
                raise PermissionDenied("You are not authorized to change this application's status.")

            allowed = VALID_TRANSITIONS.get(old_status, [])
            if new_status not in allowed:
                raise ValidationError(
                    {"status": f"Cannot transition from {old_status} to {new_status}."}
                )

        application = serializer.save()

        if new_status != old_status and new_status in STATUS_MESSAGES:
            try:
                notify_user(
                    user=application.job_seeker.user,
                    message=STATUS_MESSAGES[new_status],
                    type=Notification.NotificationType.STATUS_UPDATE,
                       link="/dashboard/applications",
                )
            except Exception:
                logger.exception("Failed to send notification for application %s", application.id)


class SavedJobViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
        IsJobSeeker,
    ]
    serializer_class = SavedJobSerializer

    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        queryset = (
            SavedJob.objects.filter(job_seeker=self.request.job_seeker)
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
        context["job_seeker"] = getattr(self.request, "job_seeker", None)
        return context

    def perform_create(self, serializer):
        serializer.save(job_seeker=self.request.job_seeker)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"job_id": ["You have already saved this job."]},
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
                {"detail": "A valid job_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved = self.get_queryset().filter(job_id=job_id).exists()

        return Response({"job_id": job_id, "saved": saved}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="toggle")
    def toggle(self, request):
        raw_job_id = request.data.get("job_id")

        try:
            job_id = int(raw_job_id)
        except (TypeError, ValueError):
            return Response(
                {"detail": "A valid job_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved_job = self.get_queryset().filter(job_id=job_id).first()

        if saved_job:
            saved_job.delete()
            return Response(
                {"job_id": job_id, "saved": False, "detail": "Job removed from saved jobs."},
                status=status.HTTP_200_OK,
            )

        data = {"job_id": job_id}

        if "note" in request.data:
            data["note"] = request.data.get("note")

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(job_seeker=self.request.job_seeker)
        except IntegrityError:
            return Response(
                {"job_id": ["You have already saved this job."]},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {"job_id": job_id, "saved": True, "detail": "Job saved.", "data": serializer.data},
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