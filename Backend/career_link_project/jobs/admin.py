from django.contrib import admin
from .models import JobPosting, JobCategory, Skill


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ("title", "employer", "job_type", "location", "is_active", "created_at")
    list_filter = ("job_type", "experience_level", "is_active", "is_featured", "is_urgent")
    search_fields = ("title", "employer__company_name", "location")


@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
