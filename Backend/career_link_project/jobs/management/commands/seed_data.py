import random
from django.core.management.base import BaseCommand
from jobs.models import JobCategory, Skill, JobPosting
from accounts.models import EmployerProfile

class Command(BaseCommand):
    help = 'Seeds the database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # Create Categories
        categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing']
        for cat in categories:
            JobCategory.objects.get_or_create(name=cat)
        
        # Create Skills
        skills = ['Python', 'Django', 'React', 'JavaScript', 'SQL', 'CSS', 'HTML']
        for skill in skills:
            Skill.objects.get_or_create(name=skill)
        
        # Ensure we have at least one employer
        employer = EmployerProfile.objects.first()
        if not employer:
            self.stdout.write(self.style.ERROR("No employer found. Please create an employer first."))
            return

        # Create Job Postings
        for i in range(5):
            category = JobCategory.objects.order_by('?').first()
            job = JobPosting.objects.create(
                employer=employer,
                title=f"Dummy Job {i+1}",
                description="This is a dummy job description.",
                category=category,
                job_type=random.choice([choice[0] for choice in JobPosting.JobType.choices]),
                experience_level=random.choice([choice[0] for choice in JobPosting.ExperienceLevel.choices]),
                location="Remote",
                salary_min=50000,
                salary_max=100000
            )
            job.skills.set(Skill.objects.order_by('?')[:3])
            
        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
