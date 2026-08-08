from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import JobseekerProfile, EmployerProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class JobseekerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = JobseekerProfile
        fields = [
            "id",
            "user",
            "full_name",
            "phone",
            "resume_file",
            "location",
            "profile_pictur",
            "date_of_birth",
            "created_at",
            "updated_at",
        ]


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = [
            "id",
            "user",
            "company_name",
            "company_description",
            "website",
            "phone",
            "logo",
            "is_varified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["is_verified"]
