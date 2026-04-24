import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole
from apps.visa_applications.models import VisaApplication, ApplicationStatus

mapping = {
    'USA': 'États-Unis',
    'UK': 'Royaume-Uni',
    'Germany': 'Allemagne',
    'China': 'Chine',
    'Belgium': 'Belgique',
    'South Africa': 'Afrique du Sud',
    'Ivory Coast': 'Côte d\'Ivoire',
    'Italy': 'Italie',
    'Spain': 'Espagne',
    'Brazil': 'Brésil',
    'Russia': 'Russie',
    'Japan': 'Japon',
    'Switzerland': 'Suisse',
    'Netherlands': 'Pays-Bas',
    'Morocco': 'Maroc',
    'Tunisia': 'Tunisie',
    'Egypt': 'Égypte',
    'Turkey': 'Turquie',
    'UAE': 'Émirats Arabes Unis',
    'Saudi Arabia': 'Arabie Saoudite',
    'Senegal': 'Sénégal',
    'Congo': 'Congo (Brazzaville)',
    'Ethiopia': 'Éthiopie',
    'India': 'Inde',
    'South Korea': 'Corée du Sud',
    'Algeria': 'Algérie',
    'Equatorial Guinea': 'Guinée Équatoriale',
}

def fix_data():
    print("--- Début de la correction des noms de pays ---")
    
    # 1. Correction des ambassades
    embassies = User.objects.filter(role=UserRole.EMBASSY)
    for embassy in embassies:
        old_name = embassy.embassy_country
        if old_name in mapping:
            new_name = mapping[old_name]
            embassy.embassy_country = new_name
            embassy.save()
            print(f"Ambassade mise à jour : {old_name} -> {new_name} ({embassy.email})")
        else:
            print(f"Ambassade déjà correcte ou non mappée : {old_name} ({embassy.email})")

    # 2. Correction des demandes existantes (si elles étaient en anglais)
    applications = VisaApplication.objects.all()
    for app in applications:
        updated = False
        if app.nationality in mapping:
            old_nat = app.nationality
            app.nationality = mapping[old_nat]
            updated = True
            print(f"Application {app.application_number} : Nationalité corrigée {old_nat} -> {app.nationality}")
        
        if app.residence_country in mapping:
            old_res = app.residence_country
            app.residence_country = mapping[old_res]
            updated = True
            print(f"Application {app.application_number} : Pays de résidence corrigé {old_res} -> {app.residence_country}")
            
        if updated:
            app.save()

    # 3. Ré-assignation des demandes
    print("\n--- Ré-assignation des demandes aux ambassades ---")
    # On ne ré-assigne que les demandes qui ne sont pas encore finalisées
    pending_apps = VisaApplication.objects.exclude(status__in=[ApplicationStatus.APPROVED, ApplicationStatus.REJECTED, ApplicationStatus.CANCELLED])
    
    for app in pending_apps:
        old_agent = app.assigned_agent.email if app.assigned_agent else "Aucun"
        if app.assign_best_agent():
            new_agent = app.assigned_agent.email if app.assigned_agent else "Aucun"
            if old_agent != new_agent:
                print(f"Application {app.application_number} ré-assignée : {old_agent} -> {new_agent}")
            else:
                print(f"Application {app.application_number} reste avec {old_agent}")
        else:
            print(f"Application {app.application_number} n'a pas pu être ré-assignée.")

    print("\n--- Correction terminée ---")

if __name__ == "__main__":
    fix_data()
