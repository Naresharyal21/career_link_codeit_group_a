from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import JobseekerProfile , EmployerProfile

User= get_user_model()

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model=User
    fields=['id','username','email','role']

class RegistrationSerializer(serializers.ModelSerializer):
  password=serializers.CharField(write_only=True,min_length=8)
  class Meta:
    model =User
    fields=['id','username','email','password','role']


class EmployerProfileSerializer(serializers.ModelSerializer):
  user=UserSerializer(read_only=True)

  class Meta:
    model=EmployerProfile
    fields=[
      'id','user','company_name','company_description','website','phone','logo','is_varified','created_at','updated_at'
    ]