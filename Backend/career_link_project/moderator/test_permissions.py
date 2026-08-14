from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


User = get_user_model()


class ReportPermissionTests(APITestCase):

    def test_unauthenticated_user_cannot_create_report(self):
        response = self.client.post(
            "/moderator/api/reports/",
            {
                "report_reason": "Spam",
                "report_description": "Test report",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 403)