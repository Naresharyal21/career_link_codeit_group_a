from django.urls import path

from .views import ReportListCreateAPIView, ReportDetailAPIView

app_name = "moderator"

urlpatterns = [
    path("api/reports/", ReportListCreateAPIView.as_view(), name="report-list-create" ),
    path("api/reports/<int:pk>/", ReportDetailAPIView.as_view(), name="report-detail" ),
]