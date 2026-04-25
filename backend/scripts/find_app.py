import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication

def find_specific_app():
    app_id = 'CMR-2026-8FRAJFNM'
    app = VisaApplication.objects.filter(application_number=app_id).first()
    if app:
        print(f"App found: {app.application_number}")
        print(f"Nationality: {app.nationality}")
        print(f"Status: {app.status}")
        print(f"Assigned Agent: {app.assigned_agent.email if app.assigned_agent else 'NONE'}")
        print(f"Residence Country: {app.residence_country}")
    else:
        print(f"App {app_id} NOT FOUND in database.")

if __name__ == "__main__":
    find_specific_app()
