from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    
    list_display = (
        "id",
        "reported_by",
        "status",
        "reported_at",
    )