from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.evisa.views import (
    EVisaViewSet,
    VerifyEVisaView,
    BorderCrossingViewSet
)

router = DefaultRouter()
router.register(r'evisas', EVisaViewSet, basename='evisa')
router.register(r'border-crossings', BorderCrossingViewSet, basename='border-crossing')

urlpatterns = [
    # Vérifier un e-visa
    path('evisas/verify/', VerifyEVisaView.as_view(), name='evisa-verify'),
    
    # Routes du router
    path('', include(router.urls)),
]