from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import EmailOTP, User


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="no-reply@example.com",
)
class EmailChangeOTPTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="otp-user",
            email="current@example.com",
            password="secure-password-123",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_email_change_otp_is_sent_to_and_bound_to_requested_address(self):
        response = self.client.post(
            "/api/v1/accounts/send/emailchange/otp/",
            {"email": " New.Address@Example.com "},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(mail.outbox[0].to, ["new.address@example.com"])
        email_otp = EmailOTP.objects.get(user=self.user, purpose="cev")
        self.assertEqual(email_otp.email, "new.address@example.com")

        response = self.client.post(
            "/api/v1/accounts/verify/otp/",
            {
                "email": "different@example.com",
                "otp": mail.outbox[0].body.split("Your OTP is ")[1].split(".")[0],
                "purpose": "cev",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(EmailOTP.objects.get(pk=email_otp.pk).is_verified)

    def test_email_change_requires_authenticated_verified_otp_and_consumes_it(self):
        self.client.post(
            "/api/v1/accounts/send/emailchange/otp/",
            {"email": "new@example.com"},
            format="json",
        )
        otp = mail.outbox[0].body.split("Your OTP is ")[1].split(".")[0]

        anonymous_client = APIClient()
        response = anonymous_client.post(
            "/api/v1/accounts/verify/otp/",
            {
                "email": "new@example.com",
                "otp": otp,
                "purpose": "cev",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 401)

        response = self.client.put(
            "/api/v1/accounts/update/email/",
            {"email": "new@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            "/api/v1/accounts/verify/otp/",
            {
                "email": "new@example.com",
                "otp": otp,
                "purpose": "cev",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.put(
            "/api/v1/accounts/update/email/",
            {"email": "new@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "new@example.com")
        self.assertFalse(
            EmailOTP.objects.get(user=self.user, purpose="cev").is_verified
        )
