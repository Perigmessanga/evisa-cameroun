import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole
from apps.visa_applications.models import VisaApplication, VisaType, ApplicationStatus
from django.utils import timezone

def simulate_belgium_submission():
    print("--- Simulation d'une soumission Belgique ---")
    
    # 1. Get a user
    applicant = User.objects.filter(role=UserRole.APPLICANT).first()
    if not applicant:
        # Create one if needed
        applicant = User.objects.create_user(email='test_belgium@evisa.cm', password='password123', first_name='Test', last_name='Belgium')
    
    # 2. Get a visa type
    vt = VisaType.objects.filter(is_active=True).first()
    
    # 3. Create application
    app = VisaApplication.objects.create(
        applicant=applicant,
        visa_type=vt,
        full_name='TEST BELGIUM',
        date_of_birth='1990-01-01',
        place_of_birth='Bruxelles',
        nationality='Belgique',
        residence_country='Belgique',
        gender='MALE',
        passport_number='BE123456',
        passport_issue_date='2020-01-01',
        passport_expiry_date='2030-01-01',
        passport_country='Belgique',
        arrival_date='2026-05-01',
        departure_date='2026-05-15',
        address_in_cameroon='Hotel Hilton',
        status=ApplicationStatus.SUBMITTED,
        submitted_at=timezone.now()
    )
    print(f"Demande cre : {app.application_number} avec nationalit {app.nationality}")
    
    # 4. Run assignment
    if app.assign_best_agent():
        print(f"Assignation RUSSIE ! Assign  : {app.assigned_agent.email} (Pays: {app.assigned_agent.embassy_country})")
    else:
        print("Assignation ECHOUE (aucun agent trouv)")

    # 5. Check visibility for the embassy
    embassy_user = User.objects.filter(email='ambassade.belgium@evisa.cm').first()
    if embassy_user:
        # Check queryset like the view does
        from django.db.models import Q
        query = Q(assigned_agent=embassy_user) | Q(residence_country=embassy_user.embassy_country)
        visible_apps = VisaApplication.objects.filter(query).exclude(status='DRAFT')
        if app in visible_apps:
            print(f"SUCCES : La demande est VISIBLE pour {embassy_user.email}")
        else:
            print(f"ECHEC : La demande n'est PAS visible pour {embassy_user.email}")
    else:
        print("Compte ambassade.belgium@evisa.cm introuvable pour le test.")

if __name__ == "__main__":
    simulate_belgium_submission()
