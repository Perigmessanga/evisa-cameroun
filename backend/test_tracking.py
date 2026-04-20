import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.evisa.views import BorderCrossingViewSet
from apps.users.models import User
from rest_framework.test import APIRequestFactory, force_authenticate

admin_user = User.objects.filter(role='ADMIN').first()
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
