from rest_framework import serializers
from accounts.models import User
from django.contrib.auth import authenticate



class AdminRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
        ]

    def create(self, validate_data):
        user = User.objects.create_user(
            username=validate_data["username"],
            email=validate_data["email"],
            password=validate_data["password"],
            first_name=validate_data.get("first_name", ""),
            last_name=validate_data.get("last_name", ""),
        )
        user.is_staff = True
        user.is_active = True
        user.save()
        return user

class AdminLoginSerializer(serializers.Serializer):
 email=serializers.EmailField()
 password=serializers.CharField(write_only=True)

 def validate(self, attrs):
     email=attrs["email"]
     password=attrs["password"]

     user=authenticate(
        username=email,
        password=password
     )

     if not user:
        raise serializers.ValidationError(
           "Invalid email or password"
        )
     if not user.is_staff:
        raise serializers.ValidationError(
           "You are not authorized as an admin"
        )
     if not user.is_active:
        raise serializers.ValidationError(
           "You account is inactive"
        )

     attrs["user"]=user
     return attrs
