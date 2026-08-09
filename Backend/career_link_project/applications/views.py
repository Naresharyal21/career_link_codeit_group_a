from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Application
from .serializers import ApplicationSerializer
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
    GET: Get all applications of logged-in job seeker
    POST: Create new application for logged-in job seeker
    """

    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        jobseeker_profile = get_jobseeker_profile_or_error(
            self.request.user
        )

        return Application.objects.filter(
            job_seeker=jobseeker_profile
        ).order_by("-created_at")

    def perform_create(self, serializer):
        jobseeker_profile = get_jobseeker_profile_or_error(
            self.request.user
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

    def get_queryset(self):
        jobseeker_profile = get_jobseeker_profile_or_error(
            self.request.user
        )

        return Application.objects.filter(
            job_seeker=jobseeker_profile
        )