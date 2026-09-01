from rest_framework.permissions import BasePermission

# Update this import according to your project structure
from accounts.models import JobseekerProfile as JobSeekerProfile


def get_job_seeker_for_user(user):
    """
    Return the JobSeekerProfile linked to the given user.

    Adjust this function based on your actual relation between
    User and JobSeekerProfile.
    """

    # Common related_name values
    for attr in (
        "seeker_profile",
        "jobseekerprofile",
        "job_seeker",
        "jobseeker",
    ):
        profile = getattr(user, attr, None)
        if profile:
            return profile

    # Fallback if JobseekerProfile has a field named `user`
    return JobSeekerProfile.objects.get(user=user)


class IsJobSeeker(BasePermission):
    message = "A job seeker profile is required for this action."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        try:
            request.job_seeker = get_job_seeker_for_user(request.user)
        except JobSeekerProfile.DoesNotExist:
            return False

        return True