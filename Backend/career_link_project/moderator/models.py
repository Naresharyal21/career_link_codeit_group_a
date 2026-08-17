from django.db import models
from django.conf import settings

from jobs.models import JobPosting
from accounts.models import TimeStamp


class Report(TimeStamp):

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        UNDER_REVIEW = "Under Review", "Under Review"
        RESOLVED = "Resolved", "Resolved"
        REJECTED = "Rejected", "Rejected"

    class Reason(models.TextChoices):
        SPAM = "Spam", "Spam"
        FAKE_JOB = "Fake Job", "Fake Job"
        SCAM = "Scam", "Scam"
        MISLEADING = "Misleading Information", "Misleading Information"
        DUPLICATE = "Duplicate", "Duplicate"
        OFFENSIVE = "Offensive Content", "Offensive Content"
        EXPIRED = "Expired Job", "Expired Job"
        OTHER = "Other", "Other"


    reported_job = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="reports",
    )

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_reports",
    )


    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_reports",
    )


    report_reason = models.CharField(
        max_length=50,
        choices=Reason.choices,
    )


    report_description = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    reported_at = models.DateTimeField(
        auto_now_add=True,
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-reported_at"]

        verbose_name = "Report"
        verbose_name_plural = "Reports"

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "reported_by",
                    "reported_job",
                ],
                condition=models.Q(
                    status__in=[
                        "Pending",
                        "Under Review",
                    ]
                ),
                name="one_open_report_per_user_per_job",
            )
        ]

    def __str__(self):
        return f"{self.reported_job} - {self.status}"



# class JobModeration(TimeStamp):

#     class Status(models.TextChoices):
#         PENDING = "Pending", "Pending"
#         APPROVED = "Approved", "Approved"
#         REJECTED = "Rejected", "Rejected"
#         REMOVED = "Removed", "Removed"

#     job = models.OneToOneField(
#         JobPosting,
#         on_delete=models.CASCADE,
#         related_name="moderation",
#     )

#     status = models.CharField(
#         max_length=20,
#         choices=Status.choices,
#         default=Status.PENDING,
#     )

#     reviewed_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="moderated_jobs",
#     )

#     review_reason = models.TextField(
#         blank=True,
#     )

#     reviewed_at = models.DateTimeField(
#         null=True,
#         blank=True,
#     )

#     def __str__(self):
#         return f"{self.job} - {self.status}"

