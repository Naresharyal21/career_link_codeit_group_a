from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import EmployerProfile, JobseekerProfile
from jobs.models import JobPosting
from notifications.models import Notification

from .models import Application


User = get_user_model()


class ApplicationContactAndReviewTests(APITestCase):
    def setUp(self):
        self.job_seeker = User.objects.create_user(
            username="applicant",
            email="applicant@example.com",
            password="test-password-123",
            role=User.Role.JOBSEEKERS,
        )
        self.job_seeker_profile = JobseekerProfile.objects.create(
            user=self.job_seeker,
            full_name="Example Applicant",
            phone="9800000000",
            location="Kathmandu",
        )
        self.employer = User.objects.create_user(
            username="employer",
            email="employer@example.com",
            password="test-password-123",
            role=User.Role.EMPLOYEERS,
        )
        employer_profile = EmployerProfile.objects.create(
            user=self.employer,
            company_name="Example Company",
            location="Kathmandu",
        )
        self.job = JobPosting.objects.create(
            employer=employer_profile,
            title="Software Engineer",
            description="Build software.",
            location="Kathmandu",
        )

    def create_application(self):
        self.client.force_authenticate(user=self.job_seeker)
        response = self.client.post(
            "/api/v1/applications/",
            {
                "job": self.job.pk,
                "contact_email": "reply@example.com",
                "contact_phone": "+9779800000000",
                "cover_letter": "I would like to apply.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return Application.objects.get(pk=response.data["id"])

    def test_job_seeker_can_submit_application_contact_details(self):
        application = self.create_application()

        self.assertEqual(application.contact_email, "reply@example.com")
        self.assertEqual(application.contact_phone, "+9779800000000")

    def test_application_contact_details_are_available_to_the_receiving_employer(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.employer)

        response = self.client.get(f"/api/v1/applications/{application.pk}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["contact_email"], "reply@example.com")
        self.assertEqual(response.data["contact_phone"], "+9779800000000")

    def test_job_seeker_must_submit_email_and_phone(self):
        self.client.force_authenticate(user=self.job_seeker)

        response = self.client.post(
            "/api/v1/applications/",
            {"job": self.job.pk},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("contact_email", response.data)
        self.assertIn("contact_phone", response.data)

    def test_employer_can_approve_application_and_applicant_is_notified(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            f"/api/v1/applications/{application.pk}/",
            {"status": Application.Status.ACCEPTED},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        application.refresh_from_db()
        self.assertEqual(application.status, Application.Status.ACCEPTED)
        notification = Notification.objects.get(user=self.job_seeker)
        self.assertIn("accepted", notification.message.lower())
        self.assertEqual(notification.link, "/dashboard/applications")

    def test_employer_can_reject_application_and_applicant_is_notified(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            f"/api/v1/applications/{application.pk}/",
            {"status": Application.Status.REJECTED},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        application.refresh_from_db()
        self.assertEqual(application.status, Application.Status.REJECTED)
        notification = Notification.objects.get(user=self.job_seeker)
        self.assertIn("not successful", notification.message.lower())
        self.assertEqual(notification.link, "/dashboard/applications")

    def test_other_user_cannot_change_application_status(self):
        application = self.create_application()
        other_employer = User.objects.create_user(
            username="other-employer",
            email="other-employer@example.com",
            password="test-password-123",
            role=User.Role.EMPLOYEERS,
        )
        self.client.force_authenticate(user=other_employer)

        response = self.client.patch(
            f"/api/v1/applications/{application.pk}/",
            {"status": Application.Status.ACCEPTED},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        application.refresh_from_db()
        self.assertEqual(application.status, Application.Status.APPLIED)

# Create your tests here.
