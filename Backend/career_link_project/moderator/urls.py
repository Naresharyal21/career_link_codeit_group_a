from django.urls import path

from .views import (
    ModeratorDashboardAPIView,
    ReportListCreateAPIView,
    ReportDetailAPIView,
    ReportRejectView,
    ReportResolveView,
    ReportReviewView,
)

app_name = "moderator"

urlpatterns = [
    path("dashboard/", ModeratorDashboardAPIView.as_view(), name="dashboard"),
    path("reports/", ReportListCreateAPIView.as_view(), name="report-list-create" ),
    path("reports/<int:id>/", ReportDetailAPIView.as_view(), name="report-detail" ),
    path(
        "reports/<int:id>/review/",
        ReportReviewView.as_view(),
        name="report-review",
    ),

    path(
        "reports/<int:id>/resolve/",
        ReportResolveView.as_view(),
        name="report-resolve",
    ),

    path(
        "reports/<int:id>/reject/",
        ReportRejectView.as_view(),
        name="report-reject",
    ),
]