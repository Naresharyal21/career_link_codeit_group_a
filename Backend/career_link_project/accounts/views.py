from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

import secrets
from datetime import timedelta
from django.utils import timezone


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
        parser_classes = [permissions.AllowAny]

        def post(self, request):
            email = request.data.get("email")

            if not email:
                return Response({"error": "Email is required"})


            try:
                user=User.objects.get(email=email)

            except User.DoesNotExist:
                return Response(
                    {"error":"User doesnot exist "}
                )

            otp=str(secrets.randbelow(900000)+100000)
            expires_at=timezone.now()+timedelta(minutes=1)


            EmailOTP.objects.create(
                user=user,
                otp=otp,
                expires_at=expires_at,
                purpose="password_reset"
            )
            return Response(
                {"message":"OTP generated sucessfully"}
            )
