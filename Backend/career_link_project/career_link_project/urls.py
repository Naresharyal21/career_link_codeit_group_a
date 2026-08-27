from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT Authtentication URLS
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/v1/auth/logout/", TokenBlacklistView.as_view(), name="token_blacklist"),
    path(
        "api/v1/",
        include(
            [
                path("accounts/", include("accounts.urls")),
                path("applications/", include("applications.urls")),
                path("jobs/", include("jobs.urls")),
                path("reports/", include("moderator.urls")),
                path("notifications/", include("notifications.urls")),
            ]
        ),
    ),
]
