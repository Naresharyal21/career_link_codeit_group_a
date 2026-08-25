from rest_framework import generics, permissions, viewsets
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


class IsEmployerOrReadOnly(permissions.BasePermission):
    """Anyone can read; only an authenticated employer can write, and only
    to their own job postings."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and hasattr(request.user, "employer_profile")

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.employer.user == request.user


class JobPostingViewSet(viewsets.ModelViewSet):
    """/api/v1/jobs/manage/ - CRUD for the logged-in employer's own job
    postings. Uses the writable serializer so category/skills/etc. are
    accepted as input, not just displayed."""
    serializer_class = JobPostingWriteSerializer
    permission_classes = [IsEmployerOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, "employer_profile"):
            return JobPosting.objects.filter(employer=self.request.user.employer_profile)
        return JobPosting.objects.none()

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user.employer_profile)
