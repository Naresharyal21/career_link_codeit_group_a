from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/v1/",
        include(
            [
                path("accounts/", include("accounts.urls")),
                path("applications/", include("applications.urls")),
                path("jobs/", include("jobs.urls")),
                path("moderator/", include("moderator.urls")),
                path("notifications/", include("notifications.urls")),
            ]
        ),
    ),
]
