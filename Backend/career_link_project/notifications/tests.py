"""
Tests for the notifications app.
Save as notifications/tests.py, then run:
    python manage.py test notifications -v 2
"""

from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from accounts.models import EmployerProfile, JobseekerProfile
from jobs.models import JobPosting

from .models import Notification
from .utils import (
    notify_job_approval_update,
    notify_matching_job_seekers,
    notify_user,
    send_notification_email,
)

User = get_user_model()
NT = Notification.NotificationType


# ---------------------------------------------------------------- helpers
def make_user(email, role="js"):
    return User.objects.create_user(
        username=email.split("@")[0],
        email=email,
        password="pass12345",
        role=role,
    )


def make_seeker(email, location):
    user = make_user(email, "js")
    JobseekerProfile.objects.create(user=user, full_name="Test Seeker", location=location)
    return user


def make_employer_profile(email):
    user = make_user(email, "ep")
    profile = EmployerProfile.objects.create(
        user=user, company_name="Acme Pvt Ltd", location="Dharan"
    )
    return user, profile


def make_job(employer_profile, location="Dharan"):
    return JobPosting.objects.create(
        employer=employer_profile,
        title="Backend Developer",
        description="Test job",
        location=location,
    )


# ------------------------------------------------------------- API tests
class NotificationApiTests(TestCase):
    def setUp(self):
        self.alice = make_user("alice@test.com")
        self.bob = make_user("bob@test.com")

        self.api = APIClient()
        self.api.force_authenticate(self.alice)

        self.a_unread = Notification.objects.create(
            user=self.alice, message="A unread", type=NT.STATUS_UPDATE
        )
        self.a_read = Notification.objects.create(
            user=self.alice, message="A read", is_read=True
        )
        self.b_unread = Notification.objects.create(user=self.bob, message="B unread")

    def _ids(self, response):
        return {item["id"] for item in response.data["results"]}

    # 1
    def test_login_required(self):
        response = APIClient().get(reverse("notification-list"))
        self.assertEqual(response.status_code, 401)

    # 2
    def test_list_returns_only_own_notifications(self):
        response = self.api.get(reverse("notification-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self._ids(response), {self.a_unread.id, self.a_read.id})

    # 3
    def test_filter_unread(self):
        response = self.api.get(reverse("notification-list") + "?is_read=false")
        self.assertEqual(self._ids(response), {self.a_unread.id})

    # 4
    def test_invalid_is_read_value_returns_400(self):
        response = self.api.get(reverse("notification-list") + "?is_read=maybe")
        self.assertEqual(response.status_code, 400)

    # 5
    def test_filter_by_type(self):
        response = self.api.get(reverse("notification-list") + "?type=status_update")
        self.assertEqual(self._ids(response), {self.a_unread.id})

    # 6
    def test_invalid_type_returns_400(self):
        response = self.api.get(reverse("notification-list") + "?type=banana")
        self.assertEqual(response.status_code, 400)

    # 7
    def test_unread_count(self):
        response = self.api.get(reverse("notification-unread-count"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"unread_count": 1})

    # 8
    def test_mark_read(self):
        url = reverse("notification-mark-read", args=[self.a_unread.pk])
        response = self.api.patch(url)
        self.assertEqual(response.status_code, 200)
        self.a_unread.refresh_from_db()
        self.assertTrue(self.a_unread.is_read)

    # 9
    def test_cannot_mark_other_users_notification_read(self):
        url = reverse("notification-mark-read", args=[self.b_unread.pk])
        response = self.api.patch(url)
        self.assertEqual(response.status_code, 404)
        self.b_unread.refresh_from_db()
        self.assertFalse(self.b_unread.is_read)

    # 10
    def test_mark_all_read_only_affects_own(self):
        response = self.api.patch(reverse("notification-mark-all-read"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["updated"], 1)
        self.a_unread.refresh_from_db()
        self.b_unread.refresh_from_db()
        self.assertTrue(self.a_unread.is_read)
        self.assertFalse(self.b_unread.is_read)

    # 11
    def test_clear_read_only_deletes_own_read_notifications(self):
        b_read = Notification.objects.create(user=self.bob, message="B read", is_read=True)
        response = self.api.delete(reverse("notification-clear-read"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["deleted"], 1)
        self.assertFalse(Notification.objects.filter(pk=self.a_read.pk).exists())
        self.assertTrue(Notification.objects.filter(pk=self.a_unread.pk).exists())
        self.assertTrue(Notification.objects.filter(pk=b_read.pk).exists())

    # 12
    def test_delete_own_notification(self):
        url = reverse("notification-delete", args=[self.a_read.pk])
        response = self.api.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Notification.objects.filter(pk=self.a_read.pk).exists())

    # 13
    def test_cannot_delete_other_users_notification(self):
        url = reverse("notification-delete", args=[self.b_unread.pk])
        response = self.api.delete(url)
        self.assertEqual(response.status_code, 404)
        self.assertTrue(Notification.objects.filter(pk=self.b_unread.pk).exists())


# ----------------------------------------------- helper and email tests
class NotificationHelperTests(TestCase):
    def setUp(self):
        self.user = make_user("emp@test.com", "ep")

    # 14
    def test_notify_user_creates_notification(self):
        n = notify_user(self.user, "Hello", type=NT.SYSTEM, link="/x", send_email=False)
        self.assertEqual(n.user, self.user)
        self.assertEqual(n.message, "Hello")
        self.assertEqual(n.link, "/x")
        self.assertFalse(n.is_read)

    # 15
    def test_email_is_scheduled_only_for_email_types(self):
        with self.captureOnCommitCallbacks(execute=False) as callbacks:
            notify_user(self.user, "m", type=NT.STATUS_UPDATE)
        self.assertEqual(len(callbacks), 1)

        with self.captureOnCommitCallbacks(execute=False) as callbacks:
            notify_user(self.user, "m", type=NT.SYSTEM)
        self.assertEqual(len(callbacks), 0)

        with self.captureOnCommitCallbacks(execute=False) as callbacks:
            notify_user(self.user, "m", type=NT.STATUS_UPDATE, send_email=False)
        self.assertEqual(len(callbacks), 0)

    # 16
    @override_settings(FRONTEND_URL="http://localhost:5173")
    def test_email_contains_message_and_full_link(self):
        n = Notification.objects.create(
            user=self.user,
            message="Your job was approved.",
            type=NT.JOB_APPROVAL_UPDATE,
            link="/jobs/5",
        )
        self.assertTrue(send_notification_email(self.user, n))
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "CareerLink: Job approval update")
        self.assertIn("Your job was approved.", mail.outbox[0].body)
        self.assertIn("http://localhost:5173/jobs/5", mail.outbox[0].body)

    # 17
    def test_email_failure_never_raises(self):
        n = Notification.objects.create(user=self.user, message="m", type=NT.STATUS_UPDATE)
        with patch("notifications.utils.send_mail", side_effect=Exception("smtp down")):
            with self.assertLogs("notifications.utils", level="ERROR"):
                result = send_notification_email(self.user, n)
        self.assertFalse(result)


class JobApprovalNotificationTests(TestCase):
    def setUp(self):
        self.employer_user, self.employer_profile = make_employer_profile("boss@test.com")
        self.job = make_job(self.employer_profile)
        self.approval = self.job.moderation_approval  # created by the signal

    # 18
    def test_signal_creates_pending_approval(self):
        self.assertEqual(self.approval.status, "Pending")

    # 19
    def test_approved_job_notifies_employer(self):
        self.approval.status = "Approved"
        self.approval.save()
        n = notify_job_approval_update(self.approval)
        self.assertEqual(n.user, self.employer_user)
        self.assertEqual(n.type, NT.JOB_APPROVAL_UPDATE)
        self.assertEqual(n.link, f"/jobs/{self.job.pk}")
        self.assertIn("approved", n.message)

    # 20
    def test_rejected_job_includes_reason_and_no_link(self):
        self.approval.status = "Rejected"
        self.approval.rejection_reason = "Missing salary details"
        self.approval.save()
        n = notify_job_approval_update(self.approval)
        self.assertIn("Missing salary details", n.message)
        self.assertEqual(n.link, "")

    # 21
    def test_pending_status_sends_nothing(self):
        self.assertIsNone(notify_job_approval_update(self.approval))
        self.assertEqual(Notification.objects.count(), 0)

    # 22
    def test_matching_seekers_by_location_without_email(self):
        s1 = make_seeker("s1@test.com", "Dharan")
        s2 = make_seeker("s2@test.com", "dharan")  # different case still matches
        s3 = make_seeker("s3@test.com", "Kathmandu")

        with self.captureOnCommitCallbacks(execute=True):
            count = notify_matching_job_seekers(self.job)

        self.assertEqual(count, 2)
        self.assertEqual(Notification.objects.filter(type=NT.NEW_JOB_MATCH).count(), 2)
        self.assertTrue(Notification.objects.filter(user=s1).exists())
        self.assertTrue(Notification.objects.filter(user=s2).exists())
        self.assertFalse(Notification.objects.filter(user=s3).exists())
        self.assertEqual(len(mail.outbox), 0)  # bulk path never emails

    # 23
    def test_job_without_location_notifies_nobody(self):
        make_seeker("s4@test.com", "Dharan")
        self.job.location = ""
        self.assertEqual(notify_matching_job_seekers(self.job), 0)
        self.assertEqual(Notification.objects.count(), 0)