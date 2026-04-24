import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication

def list_recent_apps():
    print("--- Toutes les demandes de visa (triées par date) ---")
    apps = VisaApplication.objects.all().order_by('-created_at')
    for app in apps:
        print(f"ID: {app.application_number} | Country: {app.nationality} | Status: {app.status} | Created: {app.created_at}")

if __name__ == "__main__":
    list_recent_apps()
