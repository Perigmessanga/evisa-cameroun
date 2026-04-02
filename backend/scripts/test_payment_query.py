import os
import django
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication
from apps.payments.models import Payment
from apps.users.models import User

def test_query():
    user = User.objects.get(email='ambassade.france@evisa.cm')
    print(f"User: {user.email} | Role: {user.role} | is_embassy: {user.is_embassy}")
    
    payments = Payment.objects.filter(application__assigned_agent=user)
    print(f"Payments found for this user: {payments.count()}")
    for p in payments:
        print(f"- Payment {p.id} for App {p.application.application_number} (Agent: {p.application.assigned_agent.email})")

if __name__ == "__main__":
    test_query()
