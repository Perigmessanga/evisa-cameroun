# apps/biometrics/urls.py
from django.urls import path
from apps.biometrics.models import CaptureBiometricView, VerifyBiometricView

urlpatterns = [
    path('capture/',                          CaptureBiometricView.as_view(),  name='biometric-capture'),
    path('verify/<uuid:application_id>/',     VerifyBiometricView.as_view(),   name='biometric-verify'),
]