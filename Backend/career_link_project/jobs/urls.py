from django.urls import path
from .views import (
    JobPostingListView,
    JobPostingDetailView,
    JobCategoryListView,
    SkillListView,
)

urlpatterns = [
    path("", JobPostingListView.as_view(), name="job-list"),
    path("<int:pk>/", JobPostingDetailView.as_view(), name="job-detail"),
    path("categories/", JobCategoryListView.as_view(), name="job-category-list"),
    path("skills/", SkillListView.as_view(), name="skill-list"),
]
