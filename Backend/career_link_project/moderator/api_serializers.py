from rest_framework import serializers

from accounts.models import EmployerProfile, User
from jobs.models import JobPosting

from .models import JobApproval, Report
from .permissions import has_moderator_access


class ModeratorUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
        ]


class ModeratorEmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ["id", "company_name", "location", "website"]


class ModeratorJobSerializer(serializers.ModelSerializer):
    employer = ModeratorEmployerSerializer(read_only=True)
    employer_name = serializers.CharField(
        source="employer.company_name",
        read_only=True,
    )
    company_name = serializers.CharField(
        source="employer.company_name",
        read_only=True,
    )
    job_type_display = serializers.CharField(
        source="get_job_type_display",
        read_only=True,
    )

    class Meta:
        model = JobPosting
        fields = [
            "id",
            "title",
            "description",
            "location",
            "job_type",
            "job_type_display",
            "experience_level",
            "salary_min",
            "salary_max",
            "deadline",
            "is_active",
            "employer",
            "employer_name",
            "company_name",
        ]


class ReportReadSerializer(serializers.ModelSerializer):
    reported_job = ModeratorJobSerializer(read_only=True)
    reported_by = ModeratorUserSerializer(read_only=True)
    reviewed_by = ModeratorUserSerializer(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "reported_job",
            "reported_by",
            "reviewed_by",
            "report_reason",
            "report_description",
            "status",
            "reported_at",
            "reviewed_at",
            "created_at",
            "updated_at",
        ]


class ReportWriteSerializer(serializers.ModelSerializer):
    reported_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "reported_job",
            "reported_by",
            "report_reason",
            "report_description",
            "status",
            "reviewed_by",
            "reviewed_at",
            "reported_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "reviewed_by",
            "reviewed_at",
            "reported_at",
            "created_at",
            "updated_at",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if (
            self.instance is not None
            and request is not None
            and not has_moderator_access(request.user)
        ):
            self.fields["reported_job"].read_only = True


class JobApprovalSerializer(serializers.ModelSerializer):
    job = ModeratorJobSerializer(read_only=True)
    reviewed_by = ModeratorUserSerializer(read_only=True)

    class Meta:
        model = JobApproval
        fields = [
            "id",
            "job",
            "status",
            "reviewed_by",
            "reviewed_at",
            "rejection_reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
