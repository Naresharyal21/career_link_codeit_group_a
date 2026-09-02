import logging

from django.db import transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from applications.models import Application
from accounts.models import JobseekerProfile
from moderator.models import JobApproval
from .models import Notification

logger = logging.getLogger(__name__)

STATUS_MESSAGES = {
    "UNDER_REVIEW": "Your application for {job} is now under review.",
    "SHORTLISTED": "Good news — you've been shortlisted for {job}.",
    "INTERVIEW": "You've been invited to interview for {job}.",
    "ACCEPTED": "Congratulations — you've been hired for {job}!",
    "REJECTED": "Your application for {job} was not selected this time.",
}


# ---------- Application status -> job seeker ----------

@receiver(pre_save, sender=Application)
def _stash_previous_application_status(sender, instance, **kwargs):
    if instance.pk:
        instance._previous_status = (
            Application.objects.filter(pk=instance.pk)
            .values_list("status", flat=True)
            .first()
        )
    else:
        instance._previous_status = None


@receiver(post_save, sender=Application)
def create_status_notification(sender, instance, created, **kwargs):
    if created:
        return

    previous_status = getattr(instance, "_previous_status", None)
    if previous_status == instance.status:
        return

    template = STATUS_MESSAGES.get(instance.status)
    if not template:
        logger.warning(
            "No notification template for application status: %s (application id=%s)",
            instance.status,
            instance.pk,
        )
        return

    message = template.format(job=instance.job.title)
    user = instance.job_seeker.user  # job_seeker is a JobseekerProfile — need the actual User

    def _create_notification():
        try:
            Notification.objects.create(
                user=user,
                message=message,
                type=Notification.NotificationType.STATUS_UPDATE,
            )
        except Exception:
            logger.exception(
                "Failed to create status notification for application id=%s",
                instance.pk,
            )

    transaction.on_commit(_create_notification)


# ---------- JobApproval status -> employer + matching job seekers ----------

@receiver(pre_save, sender=JobApproval)
def _stash_previous_approval_status(sender, instance, **kwargs):
    if instance.pk:
        instance._previous_status = (
            JobApproval.objects.filter(pk=instance.pk)
            .values_list("status", flat=True)
            .first()
        )
    else:
        instance._previous_status = None


@receiver(post_save, sender=JobApproval)
def notify_job_approval_update(sender, instance, created, **kwargs):
    """Notify the employer when their job posting is approved or rejected."""
    if created:
        return

    previous_status = getattr(instance, "_previous_status", None)
    if previous_status == instance.status:
        return

    if instance.status == "Approved":
        message = f"Your job posting '{instance.job.title}' has been approved."
    elif instance.status == "Rejected":
        reason = f" Reason: {instance.rejection_reason}" if instance.rejection_reason else ""
        message = f"Your job posting '{instance.job.title}' was rejected.{reason}"
    else:
        return

    user = instance.job.employer.user

    def _create_notification():
        try:
            Notification.objects.create(
                user=user,
                message=message,
                type=Notification.NotificationType.JOB_APPROVAL_UPDATE,
            )
        except Exception:
            logger.exception(
                "Failed to create job_approval_update notification for JobApproval id=%s",
                instance.pk,
            )

    transaction.on_commit(_create_notification)


@receiver(post_save, sender=JobApproval)
def notify_matching_job_seekers_on_approval(sender, instance, created, **kwargs):
    """Notify job seekers in the same location once a job is approved — not before."""
    if created:
        return

    previous_status = getattr(instance, "_previous_status", None)
    if previous_status == instance.status:
        return

    if instance.status != "Approved":
        return

    job = instance.job
    matching_seekers = JobseekerProfile.objects.filter(
        location__iexact=job.location
    ).select_related("user")

    def _create_notifications():
        notifications = [
            Notification(
                user=seeker.user,
                message=f"New job match: {job.title} at {job.employer.company_name}",
                type=Notification.NotificationType.NEW_JOB_MATCH,
            )
            for seeker in matching_seekers
        ]
        if notifications:
            try:
                Notification.objects.bulk_create(notifications)
            except Exception:
                logger.exception(
                    "Failed to bulk-create new_job_match notifications for job id=%s",
                    job.pk,
                )

    transaction.on_commit(_create_notifications)