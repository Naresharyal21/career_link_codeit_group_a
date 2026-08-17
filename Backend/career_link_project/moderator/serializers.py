from rest_framework import serializers

from moderator.models import Report
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CareerLinkTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_staff"] = user.is_staff
        return token

        

class ReportSerializer(serializers.ModelSerializer):

    reported_by = serializers.ReadOnlyField(
        source="reported_by.username"
    )

    reviewed_by = serializers.ReadOnlyField(
        source="reviewed_by.username"
    )

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

        read_only_fields = [
            "id",
            "reported_by",
            "reviewed_by",
            "status",
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

        if not reported_job:
            return attrs

        if self.instance is not None and reported_job == self.instance.reported_job:
            return attrs

        already_reported = Report.objects.filter(
            reported_by=request.user,
            reported_job=reported_job,
            status__in=[
                Report.Status.PENDING,
                Report.Status.UNDER_REVIEW,
            ],
        ).exclude(
            pk=self.instance.pk if self.instance else None
        ).exists()

        if already_reported:
            raise serializers.ValidationError({
                "reported_job": (
                    "You have already reported this job "
                    "and that report is still being reviewed."
                )
            })

        return attrs


