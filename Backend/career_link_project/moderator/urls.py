from django.urls import path

from .views import AdminRegistrationView,AdminLoginView

urlpatterns = [
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