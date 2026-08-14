from django.contrib import admin
from moderator.models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "reported_job",
        "reported_by",
        "report_reason",
        "status",
        "reviewed_by",
        "reported_at",
        "reviewed_at",
    )

    list_filter = (
        "status",
        "report_reason",
        "reported_at",
    )

    search_fields = (
        "reported_job__title",
        "reported_by__username",
        "reviewed_by__username",
        "report_description",
    )

    readonly_fields = (
        "reported_by",
        "reviewed_by",
        "reported_at",
        "reviewed_at",
        "created_at",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if not change and not obj.reported_by_id:
            obj.reported_by = request.user

        super().save_model(request, obj, form, change)