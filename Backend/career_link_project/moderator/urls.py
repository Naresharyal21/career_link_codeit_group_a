from django.urls import path

from .views import (
    AdminLoginView,
    AdminRegistrationView,
    ApproveJobView,
    JobApprovalListView,
    ModeratorDashboardView,
    RejectJobView,
    RejectReportView,
    ReportDetailView,
    ReportListCreateView,
    ResolveReportView,
    StartReportReviewView,
)

urlpatterns = [
    path("", ReportListCreateView.as_view(), name="report-list"),
    path(
        "dashboard/",
        ModeratorDashboardView.as_view(),
        name="moderator-dashboard",
    ),
    path(
        "job-approvals/",
        JobApprovalListView.as_view(),
        name="job-approval-list",
    ),
    path(
        "job-approvals/<int:pk>/approve/",
        ApproveJobView.as_view(),
        name="job-approval-approve",
    ),
    path(
        "job-approvals/<int:pk>/reject/",
        RejectJobView.as_view(),
        name="job-approval-reject",
    ),
    path(
        "<int:pk>/review/",
        StartReportReviewView.as_view(),
        name="report-review",
    ),
    path(
        "<int:pk>/resolve/",
        ResolveReportView.as_view(),
        name="report-resolve",
    ),
    path(
        "<int:pk>/reject/",
        RejectReportView.as_view(),
        name="report-reject",
    ),
    path("<int:pk>/", ReportDetailView.as_view(), name="report-detail"),
    path(
        "register/",
        AdminRegistrationView.as_view(),
        name="adminregisterview",
    ),
    path(
        "admin/login/",
        AdminLoginView.as_view(),
        name="adminloginview",
    ),
]