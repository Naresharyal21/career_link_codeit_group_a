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

    # -------------------------
    # Jobseeker fields
    # -------------------------

    phone = serializers.CharField(required=False, allow_blank=True)

    resume_file = serializers.FileField(required=False, allow_null=True)

    location = serializers.CharField(required=False, allow_blank=True)

    profile_pictur = serializers.ImageField(required=False, allow_null=True)

    date_of_birth = serializers.DateField(required=False, allow_null=True)

    # -------------------------
    # Employer fields
    # -------------------------

    company_name = serializers.CharField(required=False, allow_blank=True)

    company_description = serializers.CharField(required=False, allow_blank=True)

    website = serializers.URLField(required=False, allow_blank=True)

    logo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
            "location",
            # Jobseeker
            "phone",
            "resume_file",
            "profile_pictur",
            "date_of_birth",
            # Employer
            "company_name",
            "company_description",
            "website",
            "logo",
        ]

    # -------------------------
    # Role validation
    # -------------------------

    def validate(self, attrs):

        role = attrs.get("role")
        location = attrs.get("location")

        if not location:
            raise serializers.ValidationError(
                {"location": "Location is required for all users."}
            )

        if role == User.Role.JOBSEEKERS:

            if not attrs.get("location"):
                raise serializers.ValidationError(
                    {"location": "Location is required for jobseekers."}
                )

        elif role == User.Role.EMPLOYEERS:

            if not attrs.get("company_name"):
                raise serializers.ValidationError(
                    {"company_name": "Company name is required for employers."}
                )

        return attrs

    # -------------------------
    # Create User + Profile
    # -------------------------

    def create(self, validated_data):

        phone = validated_data.pop("phone", "")
        location = validated_data.pop("location", "")

        # Jobseeker fields
        resume_file = validated_data.pop("resume_file", None)
        profile_pictur = validated_data.pop("profile_pictur", None)
        date_of_birth = validated_data.pop("date_of_birth", None)

        # Employer fields
        company_name = validated_data.pop("company_name", "")
        company_description = validated_data.pop("company_description", "")
        website = validated_data.pop("website", "")
        logo = validated_data.pop("logo", None)

        # Get role
        role = validated_data.get("role")
        company_name = validated_data.pop("company_name", "")
        company_description = validated_data.pop("company_description", "")
        website = validated_data.pop("website", "")
        logo = validated_data.pop("logo", None)

        # Get role
        role = validated_data.get("role")
        # Create User
        user = User.objects.create_user(**validated_data)

        # Jobseeker Profile Creation

        if role == User.Role.JOBSEEKERS:

            JobseekerProfile.objects.create(
                user=user,
                phone=phone,
                resume_file=resume_file,
                location=location,
                profile_pictur=profile_pictur,
                # location=location,
                date_of_birth=date_of_birth,
            )

        # Employer Profile Creation

        elif role == User.Role.EMPLOYEERS:

            EmployerProfile.objects.create(
                user=user,
                company_name=company_name,
                company_description=company_description,
                website=website,
                # location=location,
                phone=phone,
                logo=logo,
            )

        return user


class JobseekerProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = JobseekerProfile

        fields = [
            "id",
            "user",
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
            "location" "phone",
            "logo",
            "is_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["is_verified"]
