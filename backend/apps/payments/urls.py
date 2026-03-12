# apps/payments/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.payments.views import (
    PaymentViewSet,
    InitiatePaymentView,
    PaymentWebhookView,
    CheckPaymentStatusView
)

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    # Initier un paiement
    path('initiate/', InitiatePaymentView.as_view(), name='payment-initiate'),
    
    # Webhook (appelé par la passerelle)
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    
    # Vérifier le statut
    path('<str:transaction_id>/status/', CheckPaymentStatusView.as_view(), name='payment-status'),
    
    # Routes du router
    path('', include(router.urls)),
]