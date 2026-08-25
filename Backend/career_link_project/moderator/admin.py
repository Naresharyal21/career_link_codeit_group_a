from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "reported_job",
        "reported_by",
        "report_reason",
        "status",
        "reported_at",
    )

    search_fields = (
        "reported_job__title",
        "reported_by__username",
    )

    list_filter = (
        "status",
        "report_reason",
        "reported_at",
    )

    readonly_fields = (
        "reported_at",
        "created_at",
        "updated_at",
        "reviewed_at",
    )

    ordering = ("-reported_at",)