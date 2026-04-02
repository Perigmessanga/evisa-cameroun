import os
import django
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication
from apps.payments.models import Payment

def inspect():
    apps = VisaApplication.objects.all()
    print(f"Total Applications: {apps.count()}")
    for app in apps:
        pay = getattr(app, 'payment', None)
        print(f"[{app.application_number}] Status: {app.status} | Agent: {app.assigned_agent} | Payment: {pay.status if pay else 'MISSING'}")

if __name__ == "__main__":
    inspect()
