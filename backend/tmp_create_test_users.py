import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole
from apps.visa_applications.models import VisaApplication, ApplicationStatus

def create_test_user(email, password, role, first_name, last_name):
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'first_name': first_name,
            'last_name': last_name,
            'role': role,
            'is_email_verified': True,
            'is_staff': role == UserRole.ADMIN,
            'is_superuser': role == UserRole.ADMIN,
        }
    )
    if created or not user.check_password(password):
        user.set_password(password)
        user.save()
        print(f"User {email} created/updated.")
    else:
        print(f"User {email} already exists.")

def update_applications():
    # Mettre à jour des demandes en 'SUBMITTED' pour que l'agent puisse les voir
    apps = VisaApplication.objects.filter(status=ApplicationStatus.DRAFT)[:5]
    for app in apps:
        app.status = ApplicationStatus.SUBMITTED
        app.save()
        print(f"Application {app.application_number} updated to SUBMITTED.")

if __name__ == "__main__":
    create_test_user('admin@test.com', 'AdminPass123!', UserRole.ADMIN, 'Admin', 'Test')
    create_test_user('agent@test.com', 'AgentPass123!', UserRole.AGENT, 'Agent', 'Test')
    create_test_user('frontiere@test.com', 'BorderPass123!', UserRole.BORDER, 'Frontiere', 'Test')
    create_test_user('applicant@test.com', 'ApplicantPass123!', UserRole.APPLICANT, 'Applicant', 'Test')
    update_applications()
