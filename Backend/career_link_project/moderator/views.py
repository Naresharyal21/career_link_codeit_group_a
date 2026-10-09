from django.shortcuts import render
from rest_framework import status

from django.contrib.auth import  login

# importing serializers here.
from .serializers import AdminRegistrationSerializer, AdminLoginSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# Create your views here.


class AdminRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Admin registration sucessfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            print("SESSION KEY:", request.session.session_key)
            print("SESSION DATA:", dict(request.session))
            

            return Response(
                {
                    "message": "Admin login sucessful",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                  
                },
                status=status.HTTP_200_OK,
            )
        return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
