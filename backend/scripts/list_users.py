import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole

def list_users():
    print("--- Liste des utilisateurs Ambassade ---")
    users = User.objects.filter(role=UserRole.EMBASSY)
    for u in users:
        print(f"Email: {u.email} | Pays: {u.embassy_country}")
        
    print("\n--- Liste des Agents Immigration ---")
    agents = User.objects.filter(role=UserRole.AGENT)
    for a in agents:
        print(f"Email: {a.email}")

if __name__ == "__main__":
    list_users()
