from django.urls import path
from .views import (
    ApplicationListCreateView,
    ApplicationDetailView,
)

urlpatterns = [
    path("", ApplicationListCreateView.as_view(), 
         name="application_list_create_url"),
    path("<int:pk>/", ApplicationDetailView.as_view(),
         name="application_detail_url")
]