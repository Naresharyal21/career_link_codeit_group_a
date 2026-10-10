# CHANGED: added "import threading" (used to send emails in the background)
import logging
import threading

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction

from .models import Notification

logger = logging.getLogger(__name__)

EMAIL_TYPES = {
    Notification.NotificationType.STATUS_UPDATE,
    Notification.NotificationType.JOB_APPROVAL_UPDATE,
    Notification.NotificationType.NEW_JOB_MATCH,
}

SUBJECTS = {
    Notification.NotificationType.STATUS_UPDATE: "CareerLink: Your application status changed",
    Notification.NotificationType.JOB_APPROVAL_UPDATE: "CareerLink: Job approval update",
    Notification.NotificationType.NEW_JOB_MATCH: "CareerLink: New job matches your profile",
}


def send_notification_email(user, notification):
    if not user.email:
        return False

    try:
        body = notification.message
        base_url = getattr(settings, "FRONTEND_URL", "").rstrip("/")
        if notification.link and base_url:
            body += f"\n\nView it here: {base_url}/{notification.link.lstrip('/')}"
        body += "\n\nThe CareerLink Team"

        send_mail(
            subject=SUBJECTS.get(notification.type, "CareerLink notification"),
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception:
        logger.exception("Failed to send notification email to user %s", user.pk)
        return False


# CHANGED: new helper. Sends the email in a background thread so a slow or
# blocked Gmail connection can never freeze the web request. The thread is a
# daemon, so it never blocks the server from shutting down.
def _send_in_background(user, notification):
    threading.Thread(
        target=send_notification_email,
        args=(user, notification),
        daemon=True,
    ).start()


def notify_user(user, message, type=Notification.NotificationType.SYSTEM, link="", send_email=True):
    notification = Notification.objects.create(
        user=user, message=message, type=type, link=link
    )
    if send_email and type in EMAIL_TYPES:
        # CHANGED: was send_notification_email(...), now runs in the background
        transaction.on_commit(lambda: _send_in_background(user, notification))
    return notification


# Notify the employer when their job is approved or rejected
def notify_job_approval_update(job_approval):
    job = job_approval.job

    if job_approval.status == "Approved":
        message = f"Your job posting '{job.title}' has been approved."
        link = f"/jobs/{job.pk}"
    elif job_approval.status == "Rejected":
        reason = (
            f" Reason: {job_approval.rejection_reason}"
            if job_approval.rejection_reason
            else ""
        )
        message = f"Your job posting '{job.title}' was rejected.{reason}"
        link = ""  
    else:
        return None

    return notify_user(
        job.employer.user,
        message,
        type=Notification.NotificationType.JOB_APPROVAL_UPDATE,
        link=link,
    )


# Notify job seekers in the same location about an approved job.
# Uses bulk_create and sends no email, so it never hits Gmail's daily limit.
def notify_matching_job_seekers(job):
    from accounts.models import JobseekerProfile  # local import avoids circular imports

    if not job.location:
        return 0

    seekers = JobseekerProfile.objects.filter(
        location__iexact=job.location
    ).select_related("user")

    notifications = [
        Notification(
            user=seeker.user,
            message=f"New job match: {job.title} at {job.employer.company_name}",
            type=Notification.NotificationType.NEW_JOB_MATCH,
            link=f"/jobs/{job.pk}",
        )
        for seeker in seekers
    ]
    if not notifications:
        return 0

    Notification.objects.bulk_create(notifications)
    return len(notifications)