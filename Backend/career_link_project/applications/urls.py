from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SavedJobViewSet
from .views import (
    ApplicationListCreateView,
    ApplicationDetailView,
)

router=DefaultRouter()
router.register(r"saved-jobs", SavedJobViewSet, basename="savedjob",)

urlpatterns = [
    path("", ApplicationListCreateView.as_view(), 
         name="application_list_create_url"),
    path("<int:pk>/", ApplicationDetailView.as_view(),
         name="application_detail_url")
]+router.urls