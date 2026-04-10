import os, sys, django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()
from apps.visa_applications.models import VisaApplication
from django.contrib.auth import get_user_model

print("=== Liste des demandes en base ===")
for app in VisaApplication.objects.all().order_by('-created_at')[:10]:
    print(f"ID: {app.id} | Num: {app.application_number} | Status: {app.status} | Applicant: {app.applicant.email}")

User = get_user_model()
print("\n=== Derniers utilisateurs ===")
for u in User.objects.all().order_by('-date_joined')[:5]:
    print(f"Email: {u.email} | Role: {u.role}")
