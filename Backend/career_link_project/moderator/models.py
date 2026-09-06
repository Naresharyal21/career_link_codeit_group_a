from django.db import models
from django.conf import settings
from jobs.models import JobPosting


class Report(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Under Review", "Under Review"),
        ("Resolved", "Resolved"),
        ("Rejected", "Rejected"),
    ]

    REASON_CHOICES = [
        ("Spam", "Spam"),
        ("Fake Job", "Fake Job"),
        ("Scam", "Scam"),
        ("Misleading Information", "Misleading Information"),
        ("Duplicate", "Duplicate"),
        ("Offensive Content", "Offensive Content"),
        ("Expired Job", "Expired Job"),
        ("Other", "Other"),
    ]

    reported_job = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="reports"
    )

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_reports"
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_reports"
    )

    report_reason = models.CharField(
        max_length=50,
        choices=REASON_CHOICES
    )

    report_description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    reported_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-reported_at"]
        verbose_name = "Report"
        verbose_name_plural = "Reports"

    def __str__(self):
        return f"{self.reported_job} - {self.status}"





class JobApproval(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    job = models.OneToOneField(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="moderation_approval",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending",
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="job_approvals_reviewed",
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    rejection_reason = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.job.title} - {self.status}"