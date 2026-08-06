from django.urls import path
from .views import (
    DashboardView,
    ModeratorReportCreateView,
    ModeratorReportListView,
    ModeratorReportUpdateView,
    ModeratorReportDeleteView,
)

app_name = "moderator"

urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
    path("reports/", ModeratorReportListView.as_view(), name="report-list"),
    path("reports/create/", ModeratorReportCreateView.as_view(), name="report-create"),
    path("reports/<int:pk>/update/", ModeratorReportUpdateView.as_view(), name="report-update"),
    path("reports/<int:pk>/delete/", ModeratorReportDeleteView.as_view(), name="report-delete"),
]