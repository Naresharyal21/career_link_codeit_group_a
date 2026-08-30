from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import LoginSerializer

from .services import create_and_send_otp, verify_otp


from .serializers import (
    RegistrationSerializer,
    JobseekerProfileSerializer,
    EmployerProfileSerializer,
)
from .models import (
    JobseekerProfile,
    EmployerProfile,
    User,
    EmailOTP,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        create_and_send_otp(user=user, purpose="emv")


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

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
                "profile": data,
            }
        )
    def put(self, request):
        user = request.user

        if user.role == User.Role.JOBSEEKERS:
            profile = JobseekerProfile.objects.filter(user=user).first()

            if not profile:
                return Response(
                    {"error": "Jobseeker profile not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = JobseekerProfileSerializer(
                profile,
                data=request.data,
                partial=True,
            )

            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Profile picture upload is only available for jobseekers"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    


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
            return Response({"error": "Email, OTP, and purpose  are required"})

        try:

            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"})

        success, message = verify_otp(user=user, otp=otp, purpose=purpose)
        if not success:
            return Response(
                {"error": message},
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
            return Response({"error": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST)
        user = request.user
      

        if not user.check_password(password):
            return Response({"error": "Password does not match"},
                status=status.HTTP_400_BAD_REQUEST)

        
        return Response({"message": "Password confirmed sucess"},
            status=status.HTTP_200_OK)

    
class SendNewEmailOTPView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        new_email = request.data.get("email")

        if not new_email:
            return Response({"error": "Email is required"})


        if User.objects.filter(email=new_email).exclude(id=request.user.id).exists():
              return Response(
                {"error": "This email is already in use"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user =request.user


        

        create_and_send_otp(user=user, purpose="cev",
        email=new_email)

        return Response({"message": "Verification OTP sent successfully"})
    
class ChangeEmail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        new_email = request.data.get("email")

        if not new_email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_email = new_email.strip().lower()

        if User.objects.filter(email=new_email).exclude(
            id=request.user.id
        ).exists():
            return Response(
                {"error": "This email is already in use"},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.email = new_email
        request.user.email_verified = True

        request.user.save(
            update_fields=["email", "email_verified"]
        )

        return Response(
            {
                "message": "Email changed successfully",
                "email": request.user.email,
                "email_verified": request.user.email_verified,
            },
            status=status.HTTP_200_OK
        )

