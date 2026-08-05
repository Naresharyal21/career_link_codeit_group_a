from django.db import models
from django.conf import settings

# Create your models here.
class Report(models.Model):
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='submitted_reports'
    )
    
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_reports"
    )

    report_reason = models.CharField(max_length=255)
    report_description = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)
    reported_job = models.ForeignKey(
        'jobs.Job',
        on_delete=models.CASCADE,
        related_name='reports'
    )

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Under Review", "Under Review"),
        ("Resolved", "Resolved"),
        ("Rejected", "Rejected"),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)   

    def __str__(self):
        return f"Report #{self.id} - {self-reported_job}"
    class Meta:
        ordering = ["-reported_at"]