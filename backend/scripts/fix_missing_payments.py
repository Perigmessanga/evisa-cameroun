import os
import django
import sys
from django.utils import timezone

# Add the project path to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaApplication
from apps.payments.models import Payment

def fix_payments():
    # Only for submitted/processed apps without a recorded payment
    apps = VisaApplication.objects.exclude(status='DRAFT').filter(payment__isnull=True)
    count = 0
    for app in apps:
        Payment.objects.create(
            application=app,
            amount=app.visa_type.fee if app.visa_type else 50000,
            currency='XAF',
            transaction_id=f"TXN-{app.application_number}",
            payment_method='CARD',
            status='COMPLETED',
            paid_at=timezone.now()
        )
        count += 1
        print(f"Mock payment created for {app.application_number}")
    print(f"Total {count} mock payments created.")

if __name__ == "__main__":
    fix_payments()
