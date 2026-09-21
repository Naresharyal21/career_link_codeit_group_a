from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class ReportPermissionTests(APITestCase):

    def test_unauthenticated_user_cannot_create_report(self):
        response = self.client.post(
            "/api/v1/reports/",
            {
                "report_reason": "Spam",
                "report_description": "Test report",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )