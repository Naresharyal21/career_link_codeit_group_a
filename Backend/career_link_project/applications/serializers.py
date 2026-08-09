import os
from rest_framework import serializers
from .models import Application
"""
Serializers usage for normal users
CanDo -> create application, update cover letter, update resume

Cannot Do -> change user, change status, change job after creating applicaiton

"""
class ApplicationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    status_display = serializers.CharField(
        source = "get_status_display",
        read_only=True
    )
    class Meta:
        model = Application
        fields=["id", "user", "job", "cover_letter", "resume", "status", "status_display", "created_at", "updated_at"]

        read_only_fields =["id", "user", "status", "status_display", "created_at", "updated_at"]

    def get_fields(self):
        # Not allowing to change job, after application is created
        fields = super().get_fields()

        if self.instance:
            fields["job"].read_only= True
        
        return fields

    def validate_job(self, job):
        # Optional validation : this will check is_active field of Job Model
        if hasattr(job, "is_active") and not job.is_active:
            raise serializers.ValidationError("This job is not active")
        return job

    def validate_resume(self, value):
        # Optional resume file validation.
        # Allowed filetypes : Pdf, DOC, DOCX
        # max size : 5mb
        if value and hasattr(value, "size"):
            max_size = 5 * 1024 * 1024  # 5 MB

            if value.size > max_size:
                raise serializers.ValidationError(
                    "Resume file size cannot be more than 5 mb"
                )
            allowed_extensions = [".pdf", ".doc", "docx"]
            ext = os.path.splitext(value.name)[1].lower()

            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    "Resume must be a PDF, DOC or DOCX file."
                )
        return value

    def validate(self, attrs):
        """
        Prevent user from applying to same job twice.
        """
        request = self.context.get("request")
        user = getattr(request, "user", None)
        job = attrs.get("job")

        if user and job:
            queryset = Application.objects.filter(
                user=user,
                job=job
            )

            # During update, exclude current application
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError(
                    "You have already applied for this job."
                )

        return attrs
