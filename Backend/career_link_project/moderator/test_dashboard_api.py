from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import EmployerProfile
from jobs.models import JobPosting
from moderator.models import Report


User = get_user_model()


class ModeratorDashboardAPITests(APITestCase):
    def setUp(self):
        self.moderator = User.objects.create_user(
            username="dashboard_moderator",
            password="testpassword123",
            is_staff=True,
        )
        self.reporter = User.objects.create_user(
            username="dashboard_reporter",
            password="testpassword123",
            role="js",
        )
        self.employer_user = User.objects.create_user(
            username="dashboard_employer",
            password="testpassword123",
            role="ep",
        )
        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            company_name="Dashboard Test Company",
        )
        self.job = JobPosting.objects.create(
            employer=self.employer,
            title="Backend Developer",
            description="Test job for dashboard metrics.",
            location="Kathmandu",
        )
        self.url = "/api/v1/reports/dashboard/"

    def test_dashboard_requires_moderator(self):
        self.client.force_authenticate(user=self.reporter)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_returns_report_metrics_and_queue(self):
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.reporter,
            report_reason=Report.Reason.SCAM,
            report_description="Possible scam listing.",
            status=Report.Status.PENDING,
        )

        resolved = Report.objects.create(
            reported_job=self.job,
            reported_by=self.moderator,
            report_reason=Report.Reason.SPAM,
            report_description="Spam report.",
            status=Report.Status.RESOLVED,
            reviewed_by=self.moderator,
            reviewed_at=timezone.now() - timedelta(hours=1),
        )

        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["stats"]["review_queue"]["count"], 1)
        self.assertEqual(
            response.data["stats"]["review_queue"]["critical_priority"],
            1,
        )
        self.assertEqual(response.data["stats"]["reported_content"]["count"], 2)
        self.assertEqual(len(response.data["queue"]), 1)
        self.assertEqual(response.data["queue"][0]["item_type"], "Job Post")
        self.assertEqual(response.data["queue"][0]["item_id"], self.job.id)
        self.assertEqual(response.data["performance"]["today_reviews"], 1)
        self.assertEqual(response.data["stats"]["pending_job_approvals"], None)
        self.assertEqual(response.data["stats"]["flagged_companies"], None)
