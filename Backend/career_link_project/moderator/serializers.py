from rest_framework import serializers
from .models import Report, JobApproval


class ReportSerializer(serializers.ModelSerializer):
    reported_job_title = serializers.CharField(
        source="reported_job.title",
        read_only=True
    )

    reported_by_name = serializers.CharField(
        source="reported_by.username",
        read_only=True
    )

    reviewed_by_name = serializers.CharField(
        source="reviewed_by.username",
        read_only=True
    )

    class Meta:
        model = Report

        fields = [
            "id",
            "reported_job",
            "reported_job_title",
            "reported_by",
            "reported_by_name",
            "reviewed_by",
            "reviewed_by_name",
            "report_reason",
            "report_description",
            "status",
            "reported_at",
            "reviewed_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "reported_by",
            "reviewed_by",
            "reported_at",
            "reviewed_at",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return attrs

        reported_job = attrs.get("reported_job")

        if reported_job:
            open_reports = Report.objects.filter(
                reported_by=request.user,
                reported_job=reported_job,
                status__in=["Pending", "Under Review"],
            )

            if self.instance is not None:
                open_reports = open_reports.exclude(
                    pk=self.instance.pk
                )

            if open_reports.exists():
                raise serializers.ValidationError({
                    "reported_job": (
                        "You already have an open report for "
                        "this job."
                    )
                })

        return attrs



class JobApprovalSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    company_name = serializers.CharField(
        source="job.employer.company_name",
        read_only=True,
    )

    employer_id = serializers.IntegerField(
        source="job.employer.user.id",
        read_only=True,
    )

    reviewed_by_username = serializers.CharField(
        source="reviewed_by.username",
        read_only=True,
    )

    class Meta:
        model = JobApproval
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "employer_id",
            "status",
            "reviewed_by",
            "reviewed_by_username",
            "reviewed_at",
            "rejection_reason",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "reviewed_by",
            "reviewed_at",
            "created_at",
            "updated_at",
        ]