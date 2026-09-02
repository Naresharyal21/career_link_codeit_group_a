from django.conf import settings
from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        STATUS_UPDATE = "status_update", "Status Update"
        NEW_JOB_MATCH = "new_job_match", "New Job Match"
        JOB_APPROVAL_UPDATE = "job_approval_update", "Job Approval Update"
        SYSTEM = "system", "System"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    message = models.CharField(max_length=255)
    type = models.CharField(
        max_length=32,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
          models.Index(fields=["user", "is_read"]),
          models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.user} — {self.get_type_display()} — {self.message[:30]}"