from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed


from .models import JobseekerProfile, EmployerProfile

User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:

            data = super().validate(attrs)

        except AuthenticationFailed:
            raise serializers.ValidationError({"detail": "Invalid email or password."})
        if not self.user.email_verified:
            raise serializers.ValidationError(
                {"email": "Please verify your email before logging in"}
            )

        return data


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]
        read_only_fields = ["email", "role"]

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
            "company_name",
            # Jobseeker
            "phone",
            "resume_file",
            "profile_pictur",
            "date_of_birth",
            # Employer
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
            if not attrs.get("username"):
                raise serializers.ValidationError(
                    {"username": "Full name is required for jobseekers."}
                )

        elif role == User.Role.EMPLOYEERS:
            company_name = attrs.get("company_name") or attrs.get("username")
            if not company_name:
                raise serializers.ValidationError(
                    {"company_name": "Company name is required for employers."}
                )
            if not attrs.get("location"):
                raise serializers.ValidationError(
                    {"location": "Location is required for employers."}
                )
            attrs["company_name"] = company_name
            attrs["username"] = company_name

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
        company_name = validated_data.pop("company_name", validated_data.get("username", ""))
        company_description = validated_data.pop("company_description", "")
        website = validated_data.pop("website", "")
        logo = validated_data.pop("logo", None)

        role = validated_data.get("role")

        if role == User.Role.EMPLOYEERS:
            validated_data["username"] = company_name

        user = User.objects.create_user(**validated_data)

        if role == User.Role.JOBSEEKERS:
            JobseekerProfile.objects.create(
                user=user,
                full_name=user.username,
                phone=phone,
                resume_file=resume_file,
                location=location,
                profile_pictur=profile_pictur,
                date_of_birth=date_of_birth,
            )

        elif role == User.Role.EMPLOYEERS:
            EmployerProfile.objects.create(
                user=user,
                company_name=company_name,
                company_description=company_description,
                website=website,
                location=location,
                phone=phone,
                logo=logo,
            )

        return user


class SocialOnboardingSerializer(RegistrationSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(required=False, max_length=150)

    def validate(self, attrs):
        identity = self.context["auth0_identity"]
        attrs["email"] = identity["email"]
        attrs["username"] = (
            attrs.get("username") or identity.get("name") or identity["email"].split("@")[0]
        )
        return super().validate(attrs)


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
            "location",
            "phone",
            "logo",
            "is_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["is_verified"]
