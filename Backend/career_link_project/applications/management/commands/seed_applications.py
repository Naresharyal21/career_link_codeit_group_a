import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import JobseekerProfile
from jobs.models import JobPosting
from applications.models import Application, SavedJob

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with dummy application and saved job data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding applications and saved jobs...")

        # Get or create a Job Seeker user and profile
        seeker_user, _ = User.objects.get_or_create(
            username='dummy_seeker',
            defaults={'email': 'seeker@example.com', 'role': 'js'}
        )
        seeker_profile, _ = JobseekerProfile.objects.get_or_create(
            user=seeker_user,
            defaults={'full_name': 'Dummy Seeker', 'location': 'Remote'}
        )

        jobs = JobPosting.objects.all()
        if not jobs.exists():
            self.stdout.write(self.style.ERROR("No job postings found. Seed jobs first."))
            return

        # Create Applications
        for job in random.sample(list(jobs), min(3, jobs.count())):
            Application.objects.get_or_create(
                job=job,
                job_seeker=seeker_profile,
                defaults={'status': 'APPLIED', 'cover_letter': 'I am very interested in this position.'}
            )
            self.stdout.write(f"Applied to {job.title}")

        # Create Saved Jobs
        for job in random.sample(list(jobs), min(2, jobs.count())):
            SavedJob.objects.get_or_create(
                job_seeker=seeker_profile,
                job=job,
                defaults={'note': 'Look into this later.'}
            )
            self.stdout.write(f"Saved {job.title}")
            
        self.stdout.write(self.style.SUCCESS("Applications and saved jobs seeded successfully!"))
