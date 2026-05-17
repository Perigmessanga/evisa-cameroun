"""
URLs principales de l'API e-Visa Cameroun
"""
from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

def home(request):
    return JsonResponse({
        "message": "API EVISA CAMEROON running successfully 🚀"
    })

urlpatterns = [
    # Admin Django
     path('', home),
     path('grappelli/', include('grappelli.urls')),
    path('admin/', admin.site.urls),
    
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='v1_token_refresh'),
    
    # API endpoints par app
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/visa_applications/', include('apps.visa_applications.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/biometrics/', include('apps.biometrics.urls')),
    path('api/v1/', include('apps.evisa.urls')),
    path('api/', include('apps.evisa.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/audit-logs/', include('apps.audit.urls')),

    # ── OpenAPI / Swagger (Interopérabilité) ──────────────────────
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Servir les fichiers media en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)