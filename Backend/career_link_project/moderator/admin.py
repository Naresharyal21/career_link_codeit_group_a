from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "reported_job_display",
        "reported_by",
        "report_reason",
        "status",
        "reported_at",
    )

    def reported_job_display(self, obj):
        return obj.job.title   # assuming Report has a ForeignKey 'job'
    reported_job_display.short_description = "Reported Job"
