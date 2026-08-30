from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

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
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
