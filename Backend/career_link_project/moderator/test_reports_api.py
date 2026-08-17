from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class ReportAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="reporter",
            password="testpassword123",
        )

        self.moderator = User.objects.create_user(
            username="moderator",
            password="testpassword123",
            is_staff=True,
        )

        self.report_url = "/api/moderator/reports/"

    def test_unauthenticated_user_cannot_create_report(self):
        response = self.client.post(
            self.report_url,
            {
                "report_reason": "Spam",
                "report_description": "This is a test report.",
            },
            format="json",
        )
        
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_authenticated_user_can_create_report(self):
        self.client.force_authenticate(
            user=self.user
        )

        response = self.client.post(
            self.report_url,
            {
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
            self.user.username,
        )

    def test_normal_user_cannot_list_reports(self):
        self.client.force_authenticate(
            user=self.user
        )

        response = self.client.get(
            self.report_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_moderator_can_list_reports(self):
        self.client.force_authenticate(
            user=self.moderator
        )

        response = self.client.get(
            self.report_url
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )