from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import EmployerProfile
from jobs.models import JobPosting
from moderator.models import Report


User = get_user_model()


class ReportAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="reporter",
            email="reporter@example.com",
            password="testpassword123",
            role="js",
        )

        self.other_job_seeker = User.objects.create_user(
            username="other_reporter",
            email="other_reporter@example.com",
            password="testpassword123",
            role="js",
        )

        self.moderator = User.objects.create_user(
            username="moderator",
            email="moderator@example.com",
            password="testpassword123",
            is_staff=True,
        )

        self.employer_user = User.objects.create_user(
            username="employer",
            email="employer@example.com",
            password="testpassword123",
            role="ep",
        )
        self.other_employer_user = User.objects.create_user(
            username="other_employer",
            email="other_employer@example.com",
            password="testpassword123",
            role="ep",
        )

        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            company_name="Test Company",
        )
        self.other_employer = EmployerProfile.objects.create(
            user=self.other_employer_user,
            company_name="Other Company",
        )

        self.job = JobPosting.objects.create(
            employer=self.employer,
            title="Backend Developer",
            description="Test job.",
        )
        self.other_job = JobPosting.objects.create(
            employer=self.other_employer,
            title="Frontend Developer",
            description="Another test job.",
        )

        self.report_url = "/api/v1/reports/"

    def test_unauthenticated_user_cannot_create_report(self):
        response = self.client.post(
            self.report_url,
            {
                "report_reason": "Spam",
                "report_description": "This is a test report.",
            },
            format="json",
        )
        
        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_authenticated_user_can_create_report(self):
        self.client.force_authenticate(
            user=self.user
        )

        response = self.client.post(
            self.report_url,
            {
                "reported_job": self.job.id,
                "report_reason": "Spam",
                "report_description": "This is a test report.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["reported_by"],
            self.user.id,
        )

    def test_moderator_can_create_report(self):
        self.client.force_authenticate(
            user=self.moderator
        )

        response = self.client.post(
            self.report_url,
            {
                "reported_job": self.job.id,
                "report_reason": "Fake Job",
                "report_description": "Moderator flagged fake job.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            response.data["reported_by"],
            self.moderator.id,
        )

    def test_moderator_sees_all_reports(self):
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
        )
        Report.objects.create(
            reported_job=self.other_job,
            reported_by=self.other_job_seeker,
            report_reason="Scam",
        )

        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(self.report_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_job_seeker_only_sees_own_reports(self):
        own_report = Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
        )
        Report.objects.create(
            reported_job=self.other_job,
            reported_by=self.other_job_seeker,
            report_reason="Scam",
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.report_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["id"], own_report.id
        )

    def test_employer_only_sees_reports_on_own_jobs(self):
        own_job_report = Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
        )
        Report.objects.create(
            reported_job=self.other_job,
            reported_by=self.other_job_seeker,
            report_reason="Scam",
        )

        self.client.force_authenticate(user=self.employer_user)
        response = self.client.get(self.report_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["id"],
            own_job_report.id,
        )

    def test_job_seeker_cannot_update_own_report(self):
        report = Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            f"{self.report_url}{report.id}/",
            {"report_description": "Trying to edit"},
            format="json",
        )

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )

    def test_employer_cannot_view_report_on_someone_elses_job(self):
        report = Report.objects.create(
            reported_job=self.other_job,
            reported_by=self.other_job_seeker,
            report_reason="Scam",
        )

        self.client.force_authenticate(user=self.employer_user)
        response = self.client.get(
            f"{self.report_url}{report.id}/"
        )

        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND
        )

    def test_status_filter_returns_only_matching_statuses(self):
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
            status="Pending",
        )
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Scam",
            status="Under Review",
        )
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Duplicate",
            status="Resolved",
        )

        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(
            self.report_url,
            {"status": "Pending,Under Review"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        self.assertEqual(len(results), 2)
        self.assertTrue(
            all(
                report["status"] in ("Pending", "Under Review")
                for report in results
            )
        )

    def test_status_filter_ignores_invalid_values(self):
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
            status="Pending",
        )
        Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Scam",
            status="Resolved",
        )

        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(
            self.report_url,
            {"status": "NotARealStatus"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # No valid status survives filtering, so no status filter
        # is applied — behaves like no ?status= was given at all.
        self.assertEqual(len(response.data["results"]), 2)

    def test_status_filter_combines_with_role_scoping(self):
        own_report = Report.objects.create(
            reported_job=self.job,
            reported_by=self.user,
            report_reason="Spam",
            status="Pending",
        )
        Report.objects.create(
            reported_job=self.other_job,
            reported_by=self.other_job_seeker,
            report_reason="Scam",
            status="Pending",
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            self.report_url, {"status": "Pending"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], own_report.id)


class ReportReviewWorkflowAPITests(APITestCase):
    """
    Covers the review/resolve/reject action endpoints, which delegate
    their status transitions to moderator/services.py.
    """

    def setUp(self):
        self.moderator = User.objects.create_user(
            username="workflow_moderator",
            email="workflow_moderator@example.com",
            password="testpassword123",
            is_staff=True,
        )
        self.reporter = User.objects.create_user(
            username="workflow_reporter",
            email="workflow_reporter@example.com",
            password="testpassword123",
            role="js",
        )
        self.employer_user = User.objects.create_user(
            username="workflow_employer",
            email="workflow_employer@example.com",
            password="testpassword123",
            role="ep",
        )
        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            company_name="Workflow Test Company",
        )
        self.job = JobPosting.objects.create(
            employer=self.employer,
            title="QA Engineer",
            description="Test job.",
        )
        self.report_url = "/api/v1/reports/"

    def _make_report(self, status="Pending"):
        return Report.objects.create(
            reported_job=self.job,
            reported_by=self.reporter,
            report_reason="Spam",
            status=status,
        )

    def test_start_review_moves_pending_to_under_review(self):
        report = self._make_report(status="Pending")

        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}{report.id}/review/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        report.refresh_from_db()
        self.assertEqual(report.status, "Under Review")
        self.assertEqual(report.reviewed_by, self.moderator)
        self.assertIsNotNone(report.reviewed_at)

    def test_start_review_rejects_non_pending_report(self):
        report = self._make_report(status="Under Review")

        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}{report.id}/review/"
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_resolve_moves_under_review_to_resolved(self):
        report = self._make_report(status="Under Review")

        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}{report.id}/resolve/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        report.refresh_from_db()
        self.assertEqual(report.status, "Resolved")
        self.assertEqual(report.reviewed_by, self.moderator)

    def test_reject_moves_under_review_to_rejected(self):
        report = self._make_report(status="Under Review")

        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}{report.id}/reject/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        report.refresh_from_db()
        self.assertEqual(report.status, "Rejected")
        self.assertEqual(report.reviewed_by, self.moderator)

    def test_non_admin_cannot_start_review(self):
        report = self._make_report(status="Pending")

        self.client.force_authenticate(user=self.employer_user)
        response = self.client.post(
            f"{self.report_url}{report.id}/review/"
        )

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )

    def test_review_nonexistent_report_returns_404(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}999999/review/"
        )

        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND
        )

    def test_resolve_nonexistent_report_returns_404(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}999999/resolve/"
        )

        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND
        )

    def test_reject_nonexistent_report_returns_404(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            f"{self.report_url}999999/reject/"
        )

        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND
        )


class ReportPaginationAPITests(APITestCase):
    """
    Confirms GET /reports/ is paginated via ModeratorResultsPagination
    (page_size=10, PageNumberPagination response shape).
    """

    def test_reports_list_is_paginated(self):
        moderator = User.objects.create_user(
            username="pagination_check_moderator",
            email="pagination_check_moderator@example.com",
            password="testpassword123",
            is_staff=True,
        )
        reporter = User.objects.create_user(
            username="pagination_check_reporter",
            email="pagination_check_reporter@example.com",
            password="testpassword123",
            role="js",
        )
        employer_user = User.objects.create_user(
            username="pagination_check_employer",
            email="pagination_check_employer@example.com",
            password="testpassword123",
            role="ep",
        )
        employer = EmployerProfile.objects.create(
            user=employer_user,
            company_name="Pagination Check Co",
        )
        job = JobPosting.objects.create(
            employer=employer,
            title="Pagination Check Job",
            description="x",
        )

        for _ in range(15):
            Report.objects.create(
                reported_job=job,
                reported_by=reporter,
                report_reason="Spam",
            )

        self.client.force_authenticate(user=moderator)
        response = self.client.get("/api/v1/reports/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # PageNumberPagination response shape.
        self.assertIn("count", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 15)
        self.assertEqual(len(response.data["results"]), 10)
        self.assertIsNotNone(response.data["next"])