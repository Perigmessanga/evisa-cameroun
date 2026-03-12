"""
App Payments — Modèle, Serializer, View
"""
import uuid
from django.db import models
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from evisa_backend.utils import api_response


# ─── MODÈLE ───────────────────────────────────────────────────────
class PaymentMethod(models.TextChoices):
    CARD                = 'CARD',                'Carte bancaire'
    MOBILE_MONEY_MTN    = 'MOBILE_MONEY_MTN',    'MTN Mobile Money'
    MOBILE_MONEY_ORANGE = 'MOBILE_MONEY_ORANGE', 'Orange Money'
    PAYPAL              = 'PAYPAL',              'PayPal'


class PaymentStatus(models.TextChoices):
    PENDING    = 'PENDING',    'En attente'
    PROCESSING = 'PROCESSING', 'En cours'
    COMPLETED  = 'COMPLETED',  'Réussi'
    FAILED     = 'FAILED',     'Échoué'
    REFUNDED   = 'REFUNDED',   'Remboursé'


class Payment(models.Model):
    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application        = models.OneToOneField(
        'visa_applications.VisaApplication',
        on_delete=models.CASCADE, related_name='payment'
    )
    amount             = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Montant')
    currency           = models.CharField(max_length=3, default='XAF', verbose_name='Devise')
    payment_method     = models.CharField(max_length=30, choices=PaymentMethod.choices)
    status             = models.CharField(max_length=20, choices=PaymentStatus.choices,
                                          default=PaymentStatus.PENDING)
    transaction_id     = models.CharField(max_length=100, unique=True, null=True, blank=True)
    external_reference = models.CharField(max_length=255, blank=True)
    paid_at            = models.DateTimeField(null=True, blank=True)
    refunded_at        = models.DateTimeField(null=True, blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_payment'
        verbose_name = 'Paiement'

    def __str__(self):
        return f'Paiement {self.application.application_number} — {self.amount} {self.currency}'


# ─── SERIALIZER ───────────────────────────────────────────────────
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = [
            'id', 'amount', 'currency', 'payment_method', 'status',
            'transaction_id', 'paid_at', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'transaction_id', 'paid_at', 'created_at']


class InitiatePaymentSerializer(serializers.Serializer):
    application_id = serializers.UUIDField()
    payment_method = serializers.ChoiceField(choices=PaymentMethod.choices)


class ConfirmPaymentSerializer(serializers.Serializer):
    transaction_id = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=PaymentMethod.choices)


# ─── VIEWS ────────────────────────────────────────────────────────
class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='initiate')
    def initiate(self, request):
        """
        Initier un paiement pour une demande.
        En dev : simule l'initialisation du paiement.
        En prod : appelle l'API Stripe/PayPal/Mobile Money.
        """
        from apps.visa_applications.models import VisaApplication

        serializer = InitiatePaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        app_id = serializer.validated_data['application_id']
        try:
            application = VisaApplication.objects.get(pk=app_id, applicant=request.user)
        except VisaApplication.DoesNotExist:
            return api_response(message='Demande introuvable.', status_code=status.HTTP_404_NOT_FOUND)

        if application.status != 'DRAFT':
            return api_response(message='Paiement non autorisé pour cette demande.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        # Créer ou récupérer le paiement
        payment, created = Payment.objects.get_or_create(
            application=application,
            defaults={
                'amount':         application.visa_type.fee,
                'currency':       'XAF',
                'payment_method': serializer.validated_data['payment_method'],
                'status':         PaymentStatus.PENDING,
            }
        )

        # En production, appeler la gateway de paiement ici
        # payment_url = stripe_service.create_checkout(payment)
        # Pour l'instant : retourner les infos du paiement
        return api_response(
            data={
                'payment_id':     str(payment.id),
                'amount':         str(payment.amount),
                'currency':       payment.currency,
                'payment_method': payment.payment_method,
                # En prod : 'payment_url': payment_url
                'status':         payment.status,
            },
            message='Paiement initié. Procédez au règlement.',
            status_code=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'], url_path='confirm')
    def confirm(self, request):
        """
        Confirmer un paiement après retour de la gateway.
        En production, ce endpoint serait un webhook sécurisé.
        """
        from django.utils import timezone

        serializer = ConfirmPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.get(
                application__applicant=request.user,
                status=PaymentStatus.PENDING
            )
        except Payment.DoesNotExist:
            return api_response(message='Paiement introuvable.', status_code=status.HTTP_404_NOT_FOUND)

        # En production : vérifier le transaction_id auprès de la gateway
        payment.status         = PaymentStatus.COMPLETED
        payment.transaction_id = serializer.validated_data['transaction_id']
        payment.paid_at        = timezone.now()
        payment.save(update_fields=['status', 'transaction_id', 'paid_at'])

        return api_response(
            data=PaymentSerializer(payment).data,
            message='Paiement confirmé avec succès.'
        )

    @action(detail=False, methods=['get'], url_path='my-payments')
    def my_payments(self, request):
        """Liste des paiements du demandeur connecté."""
        payments = Payment.objects.filter(application__applicant=request.user)
        return api_response(data=PaymentSerializer(payments, many=True).data)