from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.biometrics.views import BiometricDataViewSet

router = DefaultRouter()
router.register(r'', BiometricDataViewSet, basename='biometrics')

urlpatterns = [
    path('', include(router.urls)),
]