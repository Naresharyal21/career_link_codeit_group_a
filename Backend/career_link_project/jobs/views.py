from rest_framework import generics, permissions
from .models import JobPosting, JobCategory, Skill
from .serializers import (
    JobPostingListSerializer,
    JobPostingDetailSerializer,
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
