from django.utils import timezone

from moderator.models import Report


def review_report(report, moderator):
    report.status = "Under Review"
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


def resolve_report(report, moderator):
    report.status = "Resolved"
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


def reject_report(report, moderator):
    report.status = "Rejected"
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