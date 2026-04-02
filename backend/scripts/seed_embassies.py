import os
import django
import sys

# Ajouter le chemin du projet au sys.path pour pouvoir importer les apps
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole

def create_embassy_account(country_name, email, password):
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'first_name': f'Ambassade du Cameroun en',
            'last_name': country_name,
            'role': UserRole.EMBASSY,
            'embassy_country': country_name,
            'is_email_verified': True,
        }
    )
    if created or not user.check_password(password):
        user.set_password(password)
        user.save()
        print(f"Compte créé/mis à jour pour l'ambassade en {country_name}: {email}")
    else:
        print(f"Le compte pour l'ambassade en {country_name} existe déjà.")

def run():
    countries = [
        "France", "Allemagne", "Belgique", "Espagne", "Italie", "Pays-Bas", 
        "Royaume-Uni", "Russie", "Suisse", "États-Unis", "Canada", "Brésil", 
        "Chine", "Japon", "Arabie Saoudite", "Émirats Arabes Unis", "Turquie",
        "Afrique du Sud", "Algérie", "Congo", "Côte d'Ivoire", "Égypte", 
        "Éthiopie", "Gabon", "Guinée équatoriale", "Maroc", "Nigéria", 
        "RDC", "Sénégal", "Tunisie", "Tchad", "Centrafrique"
    ]
    
    password = "EmbassyPass123!"
    
    for country in countries:
        # Créer un slug simple pour l'email
        slug = country.lower().replace(" ", "").replace("-", "").replace("é", "e").replace("è", "e").replace("à", "a").replace("ç", "c").replace("ô", "o").replace("û", "u").replace("ï", "i")
        email = f"ambassade.{slug}@evisa.cm"
        create_embassy_account(country, email, password)

if __name__ == "__main__":
    run()
