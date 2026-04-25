from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.evisa.views import (
    EVisaViewSet,
    VerifyEVisaView,
    BorderCrossingViewSet,
    SystemSettingViewSet,
    ContactMessageViewSet,
    PublicVerifyEVisaView,
    WatchlistViewSet
)

router = DefaultRouter()
router.register(r'evisas', EVisaViewSet, basename='evisa')
router.register(r'border-crossings', BorderCrossingViewSet, basename='border-crossing')
router.register(r'system-settings', SystemSettingViewSet, basename='system-setting')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')
router.register(r'national-watchlist', WatchlistViewSet, basename='watchlist')

urlpatterns = [
    # Vérifier un e-visa
    path('evisas/verify/', VerifyEVisaView.as_view(), name='evisa-verify'),
    path('evisas/public-verify/', PublicVerifyEVisaView.as_view(), name='evisa-public-verify'),
    
    # Routes du router
    path('', include(router.urls)),
]