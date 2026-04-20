import os
import sys
import django

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication, ApplicationStatus
from apps.visa_applications.services import EVisa_service
from apps.evisa.models import EVisa

def fix_missing_evisas():
    print("--- Démarrage de la réparation des e-visas manquants ---")
    
    # Trouver toutes les applications approuvées
    approved_apps = VisaApplication.objects.filter(status=ApplicationStatus.APPROVED)
    
    count_fixed = 0
    count_already_exists = 0
    count_errors = 0
    
    total = approved_apps.count()
    print(f"Total des demandes APPROVED : {total}")
    
    for app in approved_apps:
        # Vérifier si l'e-visa existe
        if hasattr(app, 'evisa'):
             count_already_exists += 1
             continue
        
        # Sinon, on génère
        try:
            print(f"Génération e-visa pour : {app.application_number} ({app.full_name})...")
            evisa = EVisa_service.generate_evisa(app)
            if evisa:
                print(f"  [OK] Visa généré : {evisa.visa_number}")
                count_fixed += 1
            else:
                print(f"  [ERREUR] Échec silencieux pour {app.application_number}")
                count_errors += 1
        except Exception as e:
            print(f"  [ERREUR] Exception pour {app.application_number} : {e}")
            count_errors += 1
            
    print("\n--- Résumé ---")
    print(f"Traités : {total}")
    print(f"Déjà existants : {count_already_exists}")
    print(f"Réparés : {count_fixed}")
    print(f"Erreurs : {count_errors}")
    print("----------------")

if __name__ == "__main__":
    fix_missing_evisas()
