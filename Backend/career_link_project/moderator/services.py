from django.utils import timezone

from moderator.models import Report


class ReportModerationService:

    @staticmethod
    def update_status(report, moderator, new_status):
        valid_statuses = {
            choice[0]
            for choice in Report.STATUS_CHOICES
        }

        if new_status not in valid_statuses:
            raise ValueError("Invalid report status.")

        report.status = new_status
        report.reviewed_by = moderator
        report.reviewed_at = timezone.now()
        report.save(
            update_fields=[
                "status",
                "reviewed_by",
                "reviewed_at",
                "updated_at",
            ]
        )

        return report