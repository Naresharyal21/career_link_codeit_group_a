from rest_framework import serializers
from .models import Report


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