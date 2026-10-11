import logging

from django.db import transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from notifications.models import Notification
from notifications.utils import notify_user

from .models import Application

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Application)
def notify_employer_on_apply(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        job = instance.job
        employer_user = job.employer.user

        seeker_user = getattr(instance.job_seeker, "user", None)
        seeker_name = ""
        if seeker_user is not None:
            seeker_name = seeker_user.get_full_name() or seeker_user.email
        seeker_name = seeker_name or str(instance.job_seeker)

        message = f"New application: {seeker_name} applied for {job.title}"

        transaction.on_commit(lambda: notify_user(
            user=employer_user,
            message=message,
            type=Notification.NotificationType.SYSTEM,
            link="/employer/jobs",
            send_email=False,
        ))
    except Exception:
        logger.exception("Could not create application notification")


@receiver(pre_save, sender=Application)
def remember_old_status(sender, instance, **kwargs):
    if instance.pk:
        instance._old_status = (
            Application.objects.filter(pk=instance.pk)
            .values_list("status", flat=True)
            .first()
        )
    else:
        instance._old_status = None


@receiver(post_save, sender=Application)
def notify_seeker_on_status_change(sender, instance, created, **kwargs):
    if created:
        return

    old_status = getattr(instance, "_old_status", None)
    new_status = instance.status
    if old_status is None or old_status == new_status:
        return

    try:
        from .views import STATUS_MESSAGES

        message = STATUS_MESSAGES.get(new_status)
        if not message:
            return

        seeker_user = instance.job_seeker.user
        transaction.on_commit(lambda: notify_user(
            user=seeker_user,
            message=message,
            type=Notification.NotificationType.STATUS_UPDATE,
            link="/dashboard/applications",
        ))
    except Exception:
        logger.exception("Could not create status notification")