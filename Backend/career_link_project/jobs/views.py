from rest_framework import generics, permissions
from .models import JobPosting, JobCategory, Skill
from .serializers import (
    JobPostingListSerializer,
    JobPostingDetailSerializer,
    JobPostingWriteSerializer,
    JobCategorySerializer,
    SkillSerializer,
)


class JobPostingListView(generics.ListAPIView):
    """GET /api/jobs/ - list all active job postings."""
    queryset = JobPosting.objects.filter(is_active=True)
    serializer_class = JobPostingListSerializer
    permission_classes = [permissions.AllowAny]


class JobPostingDetailView(generics.RetrieveAPIView):
    """GET /api/jobs/<id>/ - single job posting detail."""
    queryset = JobPosting.objects.filter(is_active=True)
    serializer_class = JobPostingDetailSerializer
    permission_classes = [permissions.AllowAny]


class JobCategoryListView(generics.ListAPIView):
    """GET /api/jobs/categories/ - list all job categories."""
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]


class SkillListView(generics.ListAPIView):
    """GET /api/jobs/skills/ - list all skills."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]


class IsOwnerEmployer(permissions.BasePermission):
    """Only the employer who owns this job posting can update or delete it."""

    def has_object_permission(self, request, view, obj):
        return (
            hasattr(request.user, "employer_profile")
            and obj.employer_id == request.user.employer_profile.id
        )


class JobPostingCreateView(generics.CreateAPIView):
    """POST /api/v1/jobs/create/ - create a new job posting. Requires login
    and an employer profile on the logged-in user."""
    serializer_class = JobPostingWriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user.employer_profile)


class JobPostingUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE /api/v1/jobs/<id>/manage/ - view, update, or delete
    a job posting. Only the owning employer can update or delete it."""
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingWriteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerEmployer]
