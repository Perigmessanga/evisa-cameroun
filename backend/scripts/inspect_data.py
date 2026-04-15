import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication
from apps.notifications.models import Notification

print("--- APP APPLICATIONS ---")
apps = VisaApplication.objects.all()
for app in apps:
    print(f"ID: {app.application_number}, Applicant: {app.applicant.email}, Status: {app.status}")

print("\n--- NOTIFICATIONS ---")
notifs = Notification.objects.all()
for n in notifs:
    print(f"Subject: {n.subject}, User: {n.user.email}")
