
import os
import sys
import django

# Configuration de l'environnement Django
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.models import User
from apps.visa_applications.models import VisaApplication

def inspect(app_id, user_id):
    with open('backend/scripts/inspect_results.txt', 'w', encoding='utf-8') as f:
        try:
            user = User.objects.get(id=user_id)
            f.write(f"USER: ID={user.id}, Email={user.email}, Role={user.role}, Country={repr(user.embassy_country)}\n")
        except User.DoesNotExist:
            f.write(f"User {user_id} not found.\n")
            return

        try:
            app = VisaApplication.objects.get(id=app_id)
            f.write(f"APP: ID={app.id}, Num={app.application_number}, Status={app.status}, Residence={repr(app.residence_country)}, AssignedAgent={app.assigned_agent_id}\n")
        except VisaApplication.DoesNotExist:
            f.write(f"Application {app_id} not found.\n")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--app-id', required=True)
    parser.add_argument('--user-id', required=True)
    args = parser.parse_args()
    inspect(args.app_id, args.user_id)
