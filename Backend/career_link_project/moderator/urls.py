from django.urls import path

from .views import (
    ModeratorDashboardView,
    ReportListCreateAPIView,
    ReportDetailAPIView,
    StartReviewAPIView,
    ResolveReportAPIView,
    RejectReportAPIView,
    JobApprovalListAPIView,
    JobApprovalApproveAPIView,
    JobApprovalRejectAPIView,
)



urlpatterns = [
    path(
        "dashboard/",
        ModeratorDashboardView.as_view(),
        name="dashboard",
    ),

    path(
        "",
        ReportListCreateAPIView.as_view(),
        name="report-list-create",
    ),

    path(
        "<int:id>/",
        ReportDetailAPIView.as_view(),
        name="report-detail",
    ),

    path(
        "<int:id>/review/",
        StartReviewAPIView.as_view(),
        name="report-start-review",
    ),

    path(
        "<int:id>/resolve/",
        ResolveReportAPIView.as_view(),
        name="report-resolve",
    ),

    path(
        "<int:id>/reject/",
        RejectReportAPIView.as_view(),
        name="report-reject",
    ),
    
    path(
    "job-approvals/",
    JobApprovalListAPIView.as_view(),
    name="job-approval-list",
    ),

    path(
        "job-approvals/<int:pk>/approve/",
        JobApprovalApproveAPIView.as_view(),
        name="job-approval-approve",
    ),

    path(
        "job-approvals/<int:pk>/reject/",
        JobApprovalRejectAPIView.as_view(),
        name="job-approval-reject",
    ),
]