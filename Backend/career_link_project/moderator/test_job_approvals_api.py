from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import EmployerProfile
from jobs.models import JobPosting
from moderator.models import JobApproval


User = get_user_model()


class JobApprovalAPITests(APITestCase):

    def setUp(self):
        self.moderator = User.objects.create_user(
            username="ja_moderator",
            email="ja_moderator@example.com",
            password="testpassword123",
            is_staff=True,
        )
        self.employer_user = User.objects.create_user(
            username="ja_employer",
            email="ja_employer@example.com",
            password="testpassword123",
            role="ep",
        )
        self.job_seeker = User.objects.create_user(
            username="ja_job_seeker",
            email="ja_job_seeker@example.com",
            password="testpassword123",
            role="js",
        )
        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            company_name="Job Approval Test Co",
        )

        self.pending_job = JobPosting.objects.create(
            employer=self.employer,
            title="Pending Job",
            description="x",
        )
        # A JobApproval is auto-created (status="Pending") by a
        # post_save signal on JobPosting — use that instead of
        # creating a second one (job has a OneToOne to JobApproval).
        self.pending_approval = self.pending_job.moderation_approval

        self.approved_job = JobPosting.objects.create(
            employer=self.employer,
            title="Already Approved Job",
            description="x",
        )
        self.approved_approval = self.approved_job.moderation_approval
        self.approved_approval.status = "Approved"
        self.approved_approval.reviewed_by = self.moderator
        self.approved_approval.save()

        self.list_url = "/api/v1/reports/job-approvals/"

    def _approve_url(self, pk):
        return f"/api/v1/reports/job-approvals/{pk}/approve/"

    def _reject_url(self, pk):
        return f"/api/v1/reports/job-approvals/{pk}/reject/"

    # --- list ---

    def test_list_defaults_to_pending_only(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], self.pending_approval.id)

    def test_list_with_status_query_param(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(
            self.list_url, {"status": "Approved"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], self.approved_approval.id)

    def test_list_with_invalid_status_falls_back_to_pending(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.get(
            self.list_url, {"status": "NotARealStatus"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], self.pending_approval.id)

    def test_non_moderator_cannot_list(self):
        self.client.force_authenticate(user=self.employer_user)
        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )

    def test_unauthenticated_cannot_list(self):
        response = self.client.get(self.list_url)

        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    # --- approve ---

    def test_approve_moves_status_to_approved(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            self._approve_url(self.pending_approval.id)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pending_approval.refresh_from_db()
        self.assertEqual(self.pending_approval.status, "Approved")
        self.assertEqual(
            self.pending_approval.reviewed_by, self.moderator
        )
        self.assertIsNotNone(self.pending_approval.reviewed_at)

    def test_approve_nonexistent_returns_404(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(self._approve_url(999999))

        self.assertEqual(
            response.status_code, status.HTTP_404_NOT_FOUND
        )

    def test_non_moderator_cannot_approve(self):
        self.client.force_authenticate(user=self.job_seeker)
        response = self.client.post(
            self._approve_url(self.pending_approval.id)
        )

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )

    # --- reject ---

    def test_reject_moves_status_to_rejected_with_reason(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            self._reject_url(self.pending_approval.id),
            {"rejection_reason": "Missing required documents."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pending_approval.refresh_from_db()
        self.assertEqual(self.pending_approval.status, "Rejected")
        self.assertEqual(
            self.pending_approval.rejection_reason,
            "Missing required documents.",
        )
        self.assertEqual(
            self.pending_approval.reviewed_by, self.moderator
        )

    def test_reject_without_reason_defaults_to_empty_string(self):
        self.client.force_authenticate(user=self.moderator)
        response = self.client.post(
            self._reject_url(self.pending_approval.id)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pending_approval.refresh_from_db()
        self.assertEqual(self.pending_approval.status, "Rejected")
        self.assertEqual(self.pending_approval.rejection_reason, "")

    def test_non_moderator_cannot_reject(self):
        self.client.force_authenticate(user=self.employer_user)
        response = self.client.post(
            self._reject_url(self.pending_approval.id)
        )

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )