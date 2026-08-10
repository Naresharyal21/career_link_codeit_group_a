from django.urls import path

from .views import ReportListCreateAPIView, ReportDetailAPIView,ReportRejectView, ReportResolveView, ReportReviewView

app_name = "moderator"

urlpatterns = [
    path("api/reports/", ReportListCreateAPIView.as_view(), name="report-list-create" ),
    path("api/reports/<int:id>/", ReportDetailAPIView.as_view(), name="report-detail" ),
    path(
        "api/reports/<int:id>/review/",
        ReportReviewView.as_view(),
        name="report-review",
    ),

    path(
        "api/reports/<int:id>/resolve/",
        ReportResolveView.as_view(),
        name="report-resolve",
    ),

    path(
        "api/reports/<int:id>/reject/",
        ReportRejectView.as_view(),
        name="report-reject",
    ),
]