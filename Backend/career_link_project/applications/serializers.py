import os

from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    job_seeker = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "job_seeker",
            "job",
            "cover_letter",
            "resume",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "job_seeker",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_fields(self):
        """
        After application is created, do not allow changing job.
        """
        fields = super().get_fields()

        if self.instance:
            fields["job"].read_only = True

        return fields

    def validate_resume(self, value):
        """
        Optional resume validation.
        """
        if value and hasattr(value, "size"):
            max_size = 5 * 1024 * 1024  # 5 MB

            if value.size > max_size:
                raise serializers.ValidationError(
                    "Resume file size cannot be more than 5 MB."
                )

            allowed_extensions = [".pdf", ".doc", ".docx"]
            ext = os.path.splitext(value.name)[1].lower()

            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    "Resume must be a PDF, DOC or DOCX file."
                )

        return value

    def validate(self, attrs):
        """
        Prevent one user from applying to same job twice.
        """
        request = self.context.get("request")
        job_seeker = getattr(request, "user", None)
        job = attrs.get("job")

        if job_seeker and job:
            queryset = Application.objects.filter(
                job_seeker=job_seeker,
                job=job
            )

            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError(
                    "You have already applied for this job."
                )

        return attrs
    