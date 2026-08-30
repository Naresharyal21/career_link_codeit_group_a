from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobPostingListView,
    JobPostingDetailView,
    JobCategoryListView,
    SkillListView,
    JobPostingViewSet,
)

router = DefaultRouter()
router.register(r"manage", JobPostingViewSet, basename="job-manage")

urlpatterns = [
    path("", JobPostingListView.as_view(), name="job-list"),
    path("<int:id>/", JobPostingDetailView.as_view(), name="job-detail"),
    path("categories/", JobCategoryListView.as_view(), name="job-category-list"),
    path("skills/", SkillListView.as_view(), name="skill-list"),
    path("", include(router.urls)),
]
