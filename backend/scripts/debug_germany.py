import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole
from apps.visa_applications.models import VisaApplication

def debug_germany():
    print("--- Debugging Germany Issue ---")
    
    # 1. Check Germany Embassy User
    germany_embassy = User.objects.filter(role=UserRole.EMBASSY, embassy_country__icontains='Allemagne').first()
    if germany_embassy:
        print(f"Ambassade Allemagne trouvée : {germany_embassy.email} (Pays: {germany_embassy.embassy_country})")
    else:
        print("Ambassade Allemagne NON trouvée !")
        # Try finding by name or email
        backup = User.objects.filter(email='ambassade.germany@evisa.cm').first()
        if backup:
            print(f"Backup trouvé par email : {backup.email} (Pays: {backup.embassy_country})")
        else:
            print("Aucun compte avec l'email ambassade.germany@evisa.cm")

    # 2. Check ALL Applications
    all_apps = VisaApplication.objects.all()
    print(f"\nTotal des demandes en base : {all_apps.count()}")
    for app in all_apps:
        agent = app.assigned_agent.email if app.assigned_agent else "Non assigné"
        print(f"- App: {app.application_number} | Nationalité: {app.nationality} | Statut: {app.status} | Agent assigné: {agent}")
        
    print("\n--- Fin Debug ---")

if __name__ == "__main__":
    debug_germany()
