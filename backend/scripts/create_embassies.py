import os
import sys

# Ajouter le dossier backend au path pour trouver evisa_backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User, UserRole

embassies = [
    ('France', 'ambassade.france@evisa.cm'),
    ('États-Unis', 'ambassade.usa@evisa.cm'),
    ('Royaume-Uni', 'ambassade.uk@evisa.cm'),
    ('Allemagne', 'ambassade.germany@evisa.cm'),
    ('Chine', 'ambassade.china@evisa.cm'),
    ('Belgique', 'ambassade.belgium@evisa.cm'),
    ('Nigeria', 'ambassade.nigeria@evisa.cm'),
    ('Afrique du Sud', 'ambassade.southafrica@evisa.cm'),
    ('Côte d\'Ivoire', 'ambassade.ivorycoast@evisa.cm'),
    ('Canada', 'ambassade.canada@evisa.cm'),
    ('Italie', 'ambassade.italy@evisa.cm'),
    ('Espagne', 'ambassade.spain@evisa.cm'),
    ('Brésil', 'ambassade.brazil@evisa.cm'),
    ('Russie', 'ambassade.russia@evisa.cm'),
    ('Japon', 'ambassade.japan@evisa.cm'),
    ('Suisse', 'ambassade.switzerland@evisa.cm'),
    ('Pays-Bas', 'ambassade.netherlands@evisa.cm'),
    ('Maroc', 'ambassade.morocco@evisa.cm'),
    ('Tunisie', 'ambassade.tunisia@evisa.cm'),
    ('Égypte', 'ambassade.egypt@evisa.cm'),
    ('Turquie', 'ambassade.turkey@evisa.cm'),
    ('Émirats Arabes Unis', 'ambassade.uae@evisa.cm'),
    ('Arabie Saoudite', 'ambassade.saudiarabia@evisa.cm'),
    ('Sénégal', 'ambassade.senegal@evisa.cm'),
    ('Gabon', 'ambassade.gabon@evisa.cm'),
    ('Congo (Brazzaville)', 'ambassade.congo@evisa.cm'),
    ('Éthiopie', 'ambassade.ethiopia@evisa.cm'),
    ('Inde', 'ambassade.india@evisa.cm'),
    ('Corée du Sud', 'ambassade.southkorea@evisa.cm'),
    ('Algérie', 'ambassade.algeria@evisa.cm'),
    ('Guinée Équatoriale', 'ambassade.equatorialguinea@evisa.cm'),
]

password = "EmbassyPass123!"

for country, email in embassies:
    if not User.objects.filter(email=email).exists():
        User.objects.create_user(
            email=email,
            password=password,
            first_name="Ambassade",
            last_name=country,
            role=UserRole.EMBASSY,
            embassy_country=country,
            is_email_verified=True
        )
        print(f"Created: {country} ({email})")
    else:
        print(f"Exists: {country} ({email})")
