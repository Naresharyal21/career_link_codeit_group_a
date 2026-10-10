import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.utils import timezone
from django.conf import settings
from jwt import PyJWKClient
from .serializers import LoginSerializer, SocialOnboardingSerializer

from .services import create_and_send_otp, verify_otp


from .serializers import (
    RegistrationSerializer,
    JobseekerProfileSerializer,
    EmployerProfileSerializer,
    UserSerializer,
   
)
from .models import (
    JobseekerProfile,
    EmployerProfile,
    User,
    EmailOTP,
    Auth0Identity,
)


def verify_auth0_id_token(id_token):
    domain = settings.AUTH0_DOMAIN
    client_id = settings.AUTH0_CLIENT_ID
    if not domain or not client_id:
        raise AuthenticationFailed("Auth0 login is not configured on the server.")

    issuer = f"https://{domain.rstrip('/')}/"
    jwks_client = PyJWKClient(f"{issuer}.well-known/jwks.json", timeout=5)
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(id_token)
        claims = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=client_id,
            issuer=issuer,
            options={"require": ["exp", "iat", "sub", "email", "email_verified"]},
        )
    except jwt.PyJWKClientError as error:
        raise AuthenticationFailed("Could not verify the Auth0 identity token.") from error
    except jwt.PyJWTError as error:
        raise AuthenticationFailed("Auth0 identity token is invalid or expired.") from error

    if not claims.get("email_verified"):
        raise AuthenticationFailed("Verify your email with your identity provider first.")
    return {
        "issuer": issuer,
        "subject": claims["sub"],
        "email": claims["email"].strip().lower(),
        "name": claims.get("name", "").strip(),
    }


def role_from_request(request):
    role = request.data.get("role")
    if role not in (User.Role.JOBSEEKERS, User.Role.EMPLOYEERS):
        return None
    return role


def token_response(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        create_and_send_otp(user=user, purpose="emv")


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class Auth0LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        id_token = request.data.get("id_token")
        role = role_from_request(request)
        if not id_token or not role:
            return Response(
                {"detail": "An Auth0 identity token and a valid role are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        identity = verify_auth0_id_token(id_token)
        social_identity = Auth0Identity.objects.select_related("user").filter(
            issuer=identity["issuer"],
            subject=identity["subject"],
        ).first()

        user = social_identity.user if social_identity else None
        if user is None:
            user = User.objects.filter(email__iexact=identity["email"]).first()
            if user and not user.email_verified:
                return Response(
                    {"detail": "Verify this email address before using social sign-in."},
                    status=status.HTTP_409_CONFLICT,
                )

        if user is None:
            return Response(
                {
                    "profile_required": True,
                    "email": identity["email"],
                    "username": identity["name"] or identity["email"].split("@")[0],
                    "role": role,
                },
                status=status.HTTP_200_OK,
            )

        if user.role != role:
            return Response(
                {
                    "detail": (
                        f"This account uses the {user.get_role_display()} role. "
                        "Choose that role to continue."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        if not user.is_active:
            raise AuthenticationFailed("This account is inactive.")

        if social_identity is None:
            Auth0Identity.objects.create(
                user=user,
                issuer=identity["issuer"],
                subject=identity["subject"],
            )

        return Response(token_response(user), status=status.HTTP_200_OK)


class Auth0OnboardingView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        id_token = request.data.get("id_token")
        if not id_token:
            return Response(
                {"detail": "An Auth0 identity token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        identity = verify_auth0_id_token(id_token)
        if Auth0Identity.objects.filter(
            issuer=identity["issuer"],
            subject=identity["subject"],
        ).exists():
            return Response(
                {"detail": "This Auth0 account is already linked."},
                status=status.HTTP_409_CONFLICT,
            )
        if User.objects.filter(email__iexact=identity["email"]).exists():
            return Response(
                {"detail": "An account already exists for this email. Sign in instead."},
                status=status.HTTP_409_CONFLICT,
            )

        serializer = SocialOnboardingSerializer(
            data=request.data,
            context={"auth0_identity": identity},
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            user = serializer.save()
            user.email_verified = True
            user.save(update_fields=["email_verified"])
            Auth0Identity.objects.create(
                user=user,
                issuer=identity["issuer"],
                subject=identity["subject"],
            )

        return Response(token_response(user), status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        user = request.user
        if user.role == User.Role.JOBSEEKERS:
            profile = JobseekerProfile.objects.filter(user=user).first()
            data = JobseekerProfileSerializer(profile).data if profile else None
        elif user.role == User.Role.EMPLOYEERS:
            profile = EmployerProfile.objects.filter(user=user).first()
            data = EmployerProfileSerializer(profile).data if profile else None
        else:
            data = None

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "role_display": user.get_role_display(),
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "profile": data,
            }
        )


    def put(self, request):
        user = request.user

        protected_changes = {}
        if (
            "email" in request.data
            and request.data["email"] != user.email
        ):
            protected_changes["email"] = (
                "Use the email verification flow to change your email."
            )
        if (
            "role" in request.data
            and request.data["role"] != user.role
        ):
            protected_changes["role"] = (
                "Account roles cannot be changed from profile settings."
            )
        if protected_changes:
            return Response(
                protected_changes,
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Determine profile based on role
        if user.role == User.Role.JOBSEEKERS:
            profile = JobseekerProfile.objects.filter(user=user).first()
            if not profile: return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = JobseekerProfileSerializer(profile, data=request.data, partial=True)
        elif user.role == User.Role.EMPLOYEERS:
            profile = EmployerProfile.objects.filter(user=user).first()
            if not profile: return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = EmployerProfileSerializer(profile, data=request.data, partial=True)
        else:
            return Response({"error": "Role not supported"}, status=status.HTTP_400_BAD_REQUEST)

        # Update User details (username, email)
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid() and user_serializer.is_valid():
            serializer.save()
            user_serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        errors = serializer.errors
        errors.update(user_serializer.errors)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)



class ForgetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"})

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response({"error": "User doesnot exist "})
        create_and_send_otp(user=user, purpose="prv")
        return Response({"message": "OTP sent successfully"})


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        purpose = request.data.get("purpose")

        if not email or not otp or not purpose:
            return Response(
                {"error": "Email, OTP, and purpose are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if purpose == "cev":
            if not request.user.is_authenticated:
                return Response(
                    {"error": "Authentication is required to change your email"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            user = request.user
            email = email.strip().lower()
        else:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "User does not exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        success, message = verify_otp(
            user=user,
            otp=otp,
            purpose=purpose,
            email=email if purpose == "cev" else None,
        )
        if not success:
            return Response(
                {"error": message},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if purpose == "emv":
            user.email_verified = True
            user.save(update_fields=["email_verified"])

        return Response({"message": message})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response({"error": "Email and password are required "})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "user does not exist"})

        try:
            email_otp = EmailOTP.objects.filter(
                user=user,
                purpose="prv",
                is_verified=True,
            ).latest("created_at")
        except EmailOTP.DoesNotExist:
            return Response({"error": "OTP verification required"})
        user.set_password(new_password)
        user.save()

        email_otp.is_verified = False
        email_otp.save(update_fields=["is_verified"])

        return Response({"message": "Password reset sucessfully"})


class SendDeleteOTPView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user

        create_and_send_otp(user=user, purpose="dav")

        return Response({"message": "Delete account OTP sent successfully"})


class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        otp = request.data.get("otp")
        purpose = request.data.get("purpose")

        if not otp or not purpose:
            return Response(
                {"error": "OTP and purpose are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if purpose != "dav":
            return Response(
                {"error": "Invalid deletion purpose"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        success, message = verify_otp(user=user, otp=otp, purpose="dav")

        if not success:
            return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()

        return Response({"message": "Account deleted permanently"})


class ResendVerificationOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"})
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"})

        if user.email_verified:
            return Response({"error": "Email is already verified"})

        create_and_send_otp(user=user, purpose="emv")

        return Response({"message": "Verification OTP sent successfully"})


class confirmPasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        user = request.user

        if not user.check_password(password):
            return Response(
                {"error": "Password does not match"}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Password confirmed sucess"}, status=status.HTTP_200_OK
        )


class SendNewEmailOTPView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        new_email = request.data.get("email")

        if not new_email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        new_email = new_email.strip().lower()

        if User.objects.filter(email=new_email).exclude(id=request.user.id).exists():
            return Response(
                {"error": "This email is already in use"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = request.user

        create_and_send_otp(user=user, purpose="cev", email=new_email)

        return Response({"message": "Verification OTP sent successfully"})


class ChangeEmail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        new_email = request.data.get("email")

        if not new_email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        new_email = new_email.strip().lower()

        if User.objects.filter(email=new_email).exclude(id=request.user.id).exists():
            return Response(
                {"error": "This email is already in use"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email_otp = (
            EmailOTP.objects.filter(user=request.user, purpose="cev")
            .order_by("-created_at")
            .first()
        )
        if (
            email_otp is None
            or email_otp.email != new_email
            or not email_otp.is_verified
            or email_otp.expires_at <= timezone.now()
        ):
            return Response(
                {"error": "A valid email verification OTP is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            request.user.email = new_email
            request.user.email_verified = True
            request.user.save(update_fields=["email", "email_verified"])
            email_otp.is_verified = False
            email_otp.save(update_fields=["is_verified"])

        return Response(
            {
                "message": "Email changed successfully",
                "email": request.user.email,
                "email_verified": request.user.email_verified,
            },
            status=status.HTTP_200_OK,
        )
