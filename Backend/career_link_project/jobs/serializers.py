from rest_framework import serializers
from .models import JobPosting, JobCategory, Skill


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ["id", "name"]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


class JobPostingListSerializer(serializers.ModelSerializer):
    """Lighter serializer for the Browse Jobs list view."""
    employer_name = serializers.CharField(source="employer.company_name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    skills = SkillSerializer(many=True, read_only=True)
    job_type_display = serializers.CharField(source="get_job_type_display", read_only=True)

    class Meta:
        model = JobPosting
        fields = [
            "id", "title", "employer_name", "location",
            "salary_min", "salary_max", "job_type", "job_type_display",
            "experience_level", "category_name", "skills",
            "is_urgent", "is_featured", "created_at",
        ]


class JobPostingDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the Job Detail view."""
    employer_name = serializers.CharField(source="employer.company_name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    skills = SkillSerializer(many=True, read_only=True)
    job_type_display = serializers.CharField(source="get_job_type_display", read_only=True)
    experience_level_display = serializers.CharField(source="get_experience_level_display", read_only=True)
    applicant_count = serializers.SerializerMethodField()

    def get_applicant_count(self, obj):
        return obj.applications.count()

    class Meta:
        model = JobPosting
        fields = [
            "id", "title", "employer_name", "description",
            "responsibilities", "requirements", "benefits",
            "location", "salary_min", "salary_max",
            "job_type", "job_type_display",
            "experience_level", "experience_level_display",
            "category_name", "skills",
            "is_urgent", "is_featured", "is_active",
            "deadline", "created_at", "applicant_count"
        ]
