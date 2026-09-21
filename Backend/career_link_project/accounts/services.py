import secrets
from datetime import timedelta

from django.db import connection
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings

from .models import EmailOTP


def ensure_emailotp_table():
    table_name = EmailOTP._meta.db_table

    if table_name in connection.introspection.table_names():
        return

    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(EmailOTP)


def create_and_send_otp(user, purpose, email=None,expiry_minutes=3):
    ensure_emailotp_table()

    otp = str(secrets.randbelow(900000) + 100000)

    expires_at = timezone.now() + timedelta(minutes=expiry_minutes)

    # Invalidate previous unused OTPs
    EmailOTP.objects.filter(
        user=user,
        purpose=purpose,
        is_verified=False
    ).update(
        is_verified=True
    )

    # Create new OTP
    email_otp = EmailOTP.objects.create(
        user=user,
        otp=otp,
        expires_at=expires_at,
        purpose=purpose,
    )


    recipient_email = email or user.email
    send_mail(
        f"Your Verification OTP for {purpose}",
        f"Your OTP is {otp}. It will expire in {expiry_minutes} minutes.",
        settings.DEFAULT_FROM_EMAIL,
        [recipient_email],
    )

    return email_otp


# verification otp part


def verify_otp(user, otp, purpose):
    ensure_emailotp_table()

    try:
        email_otp = EmailOTP.objects.filter(
            user=user,
            otp=otp,
            purpose=purpose,
            is_verified=False,
        ).latest("created_at")

    except EmailOTP.DoesNotExist:
        return False, "Invalid OTP"

    if email_otp.expires_at < timezone.now():
        return False, "OTP has expired"

    email_otp.is_verified = True
    email_otp.save(update_fields=["is_verified"])

    return True, "OTP verified successfully"
