import os
import sys
import django

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.evisa.models import EVisa

def list_evisas():
    print("--- Liste des e-visas existants ---")
    evisas = EVisa.objects.all()
    for ev in evisas:
        print(f"Visa: {ev.visa_number} | App: {ev.application.application_number} | Passport: {ev.application.passport_number} | Valid: {ev.is_valid}")
    print("-----------------------------------")

if __name__ == "__main__":
    list_evisas()
