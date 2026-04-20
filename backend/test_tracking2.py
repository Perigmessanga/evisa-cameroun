import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.evisa.models import BorderCrossing
from apps.visa_applications.models import VisaApplication
from apps.users.models import User
from django.utils import timezone

# 1. Grab an application and an admin
admin_user = User.objects.filter(role='ADMIN').first()
app = VisaApplication.objects.first()

if not app:
    print("NO APP")
    exit()

# 2. Create a DENIED entry
entry = BorderCrossing.objects.create(
    application=app,
    evisa=None,
    border_agent=admin_user,
    crossing_type='DENIED',
    location='Test Station',
    notes='Test Note'
)
print("CREATED DENIED ENTRY:", entry.id)

# 3. Call the tracking endpoint
from apps.evisa.views import BorderCrossingViewSet
from rest_framework.test import APIRequestFactory, force_authenticate

factory = APIRequestFactory()
request = factory.get('/api/border-crossings/tracking/')
force_authenticate(request, user=admin_user)

view = BorderCrossingViewSet.as_view({'get': 'tracking'})
try:
    response = view(request)
    print("STATUS:", response.status_code)
    print("DATA:", response.data)
except Exception as e:
    import traceback
    traceback.print_exc()
