from django.contrib import admin
from .models import Report, JobApproval

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



@admin.register(JobApproval)
class JobApprovalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "job",
        "status",
        "reviewed_by",
        "reviewed_at",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
        "reviewed_at",
    )

    search_fields = (
        "job__title",
        "job__employer__company_name",
        "reviewed_by__username",
        "reviewed_by__email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "reviewed_at",
    )

    ordering = ("-created_at",)