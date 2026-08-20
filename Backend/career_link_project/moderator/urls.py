from django.urls import path

from .views import (
    ModeratorDashboardView,
    ReportListCreateAPIView,
    ReportDetailAPIView,
    StartReviewAPIView,
    ResolveReportAPIView,
    RejectReportAPIView,
)


app_name = "moderator"


urlpatterns = [
    path(
        "dashboard/",
        ModeratorDashboardView.as_view(),
        name="dashboard",
    ),

    path(
        "reports/",
        ReportListCreateAPIView.as_view(),
        name="report-list-create",
    ),

    path(
        "reports/<int:id>/",
        ReportDetailAPIView.as_view(),
        name="report-detail",
    ),

    path(
        "reports/<int:id>/review/",
        StartReviewAPIView.as_view(),
        name="report-start-review",
    ),

    path(
        "reports/<int:id>/resolve/",
        ResolveReportAPIView.as_view(),
        name="report-resolve",
    ),

    path(
        "reports/<int:id>/reject/",
        RejectReportAPIView.as_view(),
        name="report-reject",
    ),
]