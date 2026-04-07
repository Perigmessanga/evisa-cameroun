import os
import django
import urllib.request
import json
import sys
import ssl

# Configuration de Django pour accéder aux settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()
from django.conf import settings

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc0MTkzOTQ4LCJpYXQiOjE3NzQxOTAzNDgsImp0aSI6IjI0NWMzNTYzZTU0ODRlYjE5NDM3N2U0NGVjNDY2YWJlIiwidXNlcl9pZCI6IjVkOTYzODNhLWQ1ZmQtNGMyYi04YWZlLWZjOWU1OWUyYzFmMSJ9.FiY1FNpnzmWRgVNqWJR_vzL_FibENR7tOuexxJJqhvo"

base_backend_url = settings.BASE_BACKEND_URL

# 1. Récupérer les types de visa
try:
    req = urllib.request.Request(f'{base_backend_url}/api/v1/visa_applications/types/', headers={'Accept': 'application/json'})
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        
    if 'data' in data and 'results' in data['data']:
        visa_type_id = data['data']['results'][0]['id']
    elif 'data' in data and isinstance(data['data'], list):
        visa_type_id = data['data'][0]['id']
    elif 'results' in data:
        visa_type_id = data['results'][0]['id']
    else:
        visa_type_id = data[0]['id']
except Exception as e:
    print("Error fetching types:", e)
    sys.exit(1)

# 2. Créer une demande de visa
payload = {
  "visa_type": visa_type_id,
  "full_name": "TEST USER",
  "date_of_birth": "1990-01-01",
  "place_of_birth": "France",
  "nationality": "France",
  "gender": "MALE",
  "passport_number": "AB12345",
  "passport_issue_date": "2020-01-01",
  "passport_expiry_date": "2030-01-01",
  "passport_country": "France",
  "purpose_of_visit": "Tourisme",
  "arrival_date": "2026-04-01",
  "departure_date": "2026-05-01",
  "address_in_cameroon": "Hotel XYZ"
}

try:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        f'{base_backend_url}/api/v1/visa_applications/applications/', 
        data=data, 
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method='POST'
    )
    with urllib.request.urlopen(req, context=ctx) as response:
        print("POST STATUS:", response.status)
        print("POST BODY:", json.dumps(json.loads(response.read().decode()), indent=2))
except urllib.error.HTTPError as e:
    print("POST STATUS:", e.code)
    try:
        err_body = json.loads(e.read().decode())
        print("POST ERROR BODY:")
        print(json.dumps(err_body, indent=2))
    except (json.JSONDecodeError, AttributeError):
        print("Raw error:", e.read().decode())
except Exception as e:
    print("Other error:", e)
