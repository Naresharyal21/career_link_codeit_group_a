from django.urls import path
from moderator.views import DashboardView

app_name = "moderator"

urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
]