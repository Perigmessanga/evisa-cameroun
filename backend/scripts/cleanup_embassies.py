import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole

def cleanup_duplicates():
    print("--- Nettoyage des comptes ambassades en doublon ---")
    
    countries_seen = {}
    embassies = User.objects.filter(role=UserRole.EMBASSY).order_by('created_at')
    
    to_delete = []
    
    for embassy in embassies:
        country = embassy.embassy_country
        if country in countries_seen:
            # On a dj un compte pour ce pays. 
            # Le compte prcdent (countries_seen[country]) est le premier cr.
            # Cependant, l'utilisateur semble prfrer les emails en anglais (germany, belgium).
            
            existing = countries_seen[country]
            
            # Si le nouveau compte a un email en anglais et l'ancien en franais, on garde l'anglais.
            french_keywords = ['allemagne', 'belgique', 'royaumeuni', 'etatsunis', 'chine', 'italie', 'espagne']
            
            is_new_english = not any(k in embassy.email.lower() for k in french_keywords)
            is_old_french = any(k in existing.email.lower() for k in french_keywords)
            
            if is_new_english and is_old_french:
                print(f"Remplacement : On prfre {embassy.email}  {existing.email} pour {country}")
                to_delete.append(existing)
                countries_seen[country] = embassy
            else:
                print(f"Doublon ignor : On supprime {embassy.email} car on a dj {existing.email} pour {country}")
                to_delete.append(embassy)
        else:
            countries_seen[country] = embassy

    print(f"\nSuppression de {len(to_delete)} comptes en doublon...")
    for u in to_delete:
        u.delete()
        print(f"Supprim : {u.email}")

    print("\n--- Nettoyage termin ---")

if __name__ == "__main__":
    cleanup_duplicates()
