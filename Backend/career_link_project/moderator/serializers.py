from rest_framework import serializers

from moderator.models import Report


class ReportSerializer(serializers.ModelSerializer):
    reported_by = serializers.ReadOnlyField(source="reported_by.username")
    reviewed_by = serializers.ReadOnlyField(source="reviewed_by.username")

    class Meta:
        model = Report
        fields = [
            "id",
            "reported_by",
            "reviewed_by",
            "report_reason",
            "report_description",
            "reported_at",
            "status",
            "created_at",
            "updated_at",
            "reviewed_at",
        ]
        read_only_fields = [
            "id",
            "reported_by",
            "reviewed_by",
            "reported_at",
            "created_at",
            "updated_at",
            "reviewed_at",
        ]