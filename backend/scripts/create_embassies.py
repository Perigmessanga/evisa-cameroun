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
    ('USA', 'ambassade.usa@evisa.cm'),
    ('UK', 'ambassade.uk@evisa.cm'),
    ('Germany', 'ambassade.germany@evisa.cm'),
    ('China', 'ambassade.china@evisa.cm'),
    ('Belgium', 'ambassade.belgium@evisa.cm'),
    ('Nigeria', 'ambassade.nigeria@evisa.cm'),
    ('South Africa', 'ambassade.southafrica@evisa.cm'),
    ('Ivory Coast', 'ambassade.ivorycoast@evisa.cm'),
    ('Canada', 'ambassade.canada@evisa.cm'),
    ('Italy', 'ambassade.italy@evisa.cm'),
    ('Spain', 'ambassade.spain@evisa.cm'),
    ('Brazil', 'ambassade.brazil@evisa.cm'),
    ('Russia', 'ambassade.russia@evisa.cm'),
    ('Japan', 'ambassade.japan@evisa.cm'),
    ('Switzerland', 'ambassade.switzerland@evisa.cm'),
    ('Netherlands', 'ambassade.netherlands@evisa.cm'),
    ('Morocco', 'ambassade.morocco@evisa.cm'),
    ('Tunisia', 'ambassade.tunisia@evisa.cm'),
    ('Egypt', 'ambassade.egypt@evisa.cm'),
    ('Turkey', 'ambassade.turkey@evisa.cm'),
    ('UAE', 'ambassade.uae@evisa.cm'),
    ('Saudi Arabia', 'ambassade.saudiarabia@evisa.cm'),
    ('Senegal', 'ambassade.senegal@evisa.cm'),
    ('Gabon', 'ambassade.gabon@evisa.cm'),
    ('Congo', 'ambassade.congo@evisa.cm'),
    ('Ethiopia', 'ambassade.ethiopia@evisa.cm'),
    ('India', 'ambassade.india@evisa.cm'),
    ('South Korea', 'ambassade.southkorea@evisa.cm'),
    ('Algeria', 'ambassade.algeria@evisa.cm'),
    ('Equatorial Guinea', 'ambassade.equatorialguinea@evisa.cm'),
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
