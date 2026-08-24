from django.urls import path
from .views import (
    JobPostingListView,
    JobPostingDetailView,
    JobPostingCreateView,
    JobPostingUpdateDeleteView,
    JobCategoryListView,
    SkillListView,
)

urlpatterns = [
    path("", JobPostingListView.as_view(), name="job-list"),
    path("create/", JobPostingCreateView.as_view(), name="job-create"),
    path("<int:pk>/", JobPostingDetailView.as_view(), name="job-detail"),
    path("<int:pk>/manage/", JobPostingUpdateDeleteView.as_view(), name="job-manage"),
    path("categories/", JobCategoryListView.as_view(), name="job-category-list"),
    path("skills/", SkillListView.as_view(), name="skill-list"),
]
