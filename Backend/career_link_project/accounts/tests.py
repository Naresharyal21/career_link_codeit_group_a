from django.core import mail
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from unittest.mock import patch

from .models import Auth0Identity, EmailOTP, JobseekerProfile, User


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


class MeIdentityUpdateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="profile-user",
            email="profile@example.com",
            password="correct-horse-battery-staple",
            role=User.Role.JOBSEEKERS,
            email_verified=True,
        )
        self.profile = JobseekerProfile.objects.create(
            user=self.user,
            full_name="Profile User",
            location="Kathmandu",
        )
        self.client.force_authenticate(user=self.user)
        self.url = "/api/v1/accounts/me/"

    def test_email_change_requires_the_verified_email_flow(self):
        response = self.client.put(
            self.url,
            {"email": "new@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "profile@example.com")
        self.assertTrue(self.user.email_verified)

    def test_role_change_is_rejected_without_changing_the_profile(self):
        response = self.client.put(
            self.url,
            {"role": User.Role.EMPLOYEERS},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.profile.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.JOBSEEKERS)
        self.assertEqual(self.profile.full_name, "Profile User")


class Auth0LoginTests(APITestCase):
    identity = {
        "issuer": "https://careerlink-test.auth0.com/",
        "subject": "google-oauth2|test-user",
        "email": "social@example.com",
        "name": "Social User",
    }

    def setUp(self):
        self.url = "/api/v1/accounts/oauth/auth0/"
        self.onboarding_url = "/api/v1/accounts/oauth/auth0/onboarding/"
        self.client = APIClient()

    @patch("accounts.views.verify_auth0_id_token", return_value=identity)
    def test_new_social_login_requests_role_profile_before_creating_account(self, _verify):
        response = self.client.post(
            self.url,
            {"id_token": "verified-token", "role": User.Role.JOBSEEKERS},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["profile_required"])
        self.assertFalse(User.objects.filter(email=self.identity["email"]).exists())

    @patch("accounts.views.verify_auth0_id_token", return_value=identity)
    def test_existing_verified_account_gets_tokens_for_matching_role(self, _verify):
        user = User.objects.create_user(
            username="Social User",
            email=self.identity["email"],
            password="unused",
            role=User.Role.JOBSEEKERS,
            email_verified=True,
        )
        JobseekerProfile.objects.create(
            user=user,
            full_name=user.username,
            location="Kathmandu",
        )

        response = self.client.post(
            self.url,
            {"id_token": "verified-token", "role": User.Role.JOBSEEKERS},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertTrue(
            Auth0Identity.objects.filter(user=user, subject=self.identity["subject"]).exists()
        )

    @patch("accounts.views.verify_auth0_id_token", return_value=identity)
    def test_social_login_does_not_change_existing_account_role(self, _verify):
        user = User.objects.create_user(
            username="Social Employer",
            email=self.identity["email"],
            password="unused",
            role=User.Role.EMPLOYEERS,
            email_verified=True,
        )
        response = self.client.post(
            self.url,
            {"id_token": "verified-token", "role": User.Role.JOBSEEKERS},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        user.refresh_from_db()
        self.assertEqual(user.role, User.Role.EMPLOYEERS)

    @patch("accounts.views.verify_auth0_id_token", return_value=identity)
    def test_onboarding_creates_profile_and_unusable_password(self, _verify):
        response = self.client.post(
            self.onboarding_url,
            {
                "id_token": "verified-token",
                "role": User.Role.JOBSEEKERS,
                "username": self.identity["name"],
                "location": "Kathmandu",
                "phone": "9800000000",
                "date_of_birth": "1995-01-01",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=self.identity["email"])
        self.assertTrue(user.email_verified)
        self.assertFalse(user.has_usable_password())
        self.assertTrue(
            Auth0Identity.objects.filter(user=user, subject=self.identity["subject"]).exists()
        )
