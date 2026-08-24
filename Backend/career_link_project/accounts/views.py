from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

from .services import create_and_send_otp , verify_otp




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

    def perform_create(self , serializer):
        user=serializer.save()

        create_and_send_otp(
            user=user,
            purpose="emv"
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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
            create_and_send_otp(
                user=user,
                purpose="prv"
            )
            return Response({
            "message": "OTP sent successfully"
        })

          


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

        success , message =verify_otp(
            user=user,
            otp=otp,
            purpose=purpose
        )
        if not success:
            return Response(
                {"error":message},
            
            )
        if purpose=="emv":
            user.email_verified=True
            user.save(update_fields=["email_verified"])

        return Response({
            "message":message
        })



class ResetPasswordView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self, request):
        email=request.data.get("email")
        new_password=request.data.get("new_password")

        if not email or not new_password:
            return Response({
                "error":"Email and password are required "
            })

        try:
         user=User.objects.get(email=email)
        except User.DoesNotExist:
         return Response(
           {"error":"user does not exist"}
         )



        try:
         email_otp=EmailOTP.objects.filter(
            user=user,
            purpose="prv",
            is_verified=True,
        ).latest("created_at")
        except EmailOTP.DoesNotExist:
            return Response(
                {"error":"OTP verification required"}
            )
        user.set_password(new_password)
        user.save()

        email_otp.is_verified=False
        email_otp.save(update_fields=["is_verified"])

        return Response(
            {"message":"Password reset sucessfully"}
        )
