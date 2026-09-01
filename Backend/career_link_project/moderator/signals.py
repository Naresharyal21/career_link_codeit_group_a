from django.db.models.signals import post_save
from django.dispatch import receiver

from jobs.models import JobPosting
from .models import JobApproval


@receiver(post_save, sender=JobPosting)
def create_job_approval(sender, instance, created, **kwargs):
    if created:
        JobApproval.objects.get_or_create(
            job=instance,
            defaults={
                "status": "Pending",
            },
        )