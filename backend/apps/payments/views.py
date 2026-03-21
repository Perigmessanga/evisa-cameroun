from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import uuid

from apps.payments.models import Payment
from apps.payments.serializers import (
    PaymentSerializer,
    PaymentInitiateSerializer,
    PaymentStatusSerializer
)
from apps.visa_applications.models import VisaApplication


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les paiements.
    GET /api/payments/           - Liste mes paiements
    GET /api/payments/{id}/      - Détails d'un paiement
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Les demandeurs voient leurs paiements
        if user.is_applicant:
            return Payment.objects.filter(application__applicant=user)
        
        # Les admins voient tout
        elif user.is_admin:
            return Payment.objects.all()
        
        return Payment.objects.none()


class InitiatePaymentView(generics.CreateAPIView):
    """
    Initier un paiement pour une demande.
    POST /api/payments/initiate/
    Body: {
        "application_id": "uuid",
        "payment_method": "CARD" | "MOBILE_MONEY_MTN" | ...
    }
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentInitiateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        application_id = serializer.validated_data['application_id']
        payment_method = serializer.validated_data['payment_method']
        
        # Récupérer la demande
        try:
            application = VisaApplication.objects.get(id=application_id)
        except VisaApplication.DoesNotExist:
            return Response({
                'error': 'Demande introuvable.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Vérifier que c'est bien le demandeur
        if application.applicant != request.user:
            return Response({
                'error': 'Vous ne pouvez pas payer pour cette demande.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Créer ou récupérer le paiement
        payment, created = Payment.objects.get_or_create(
            application=application,
            defaults={
                'amount': application.visa_type.fee,
                'currency': 'XAF',
                'payment_method': payment_method,
                'status': 'PENDING'
            }
        )
        
        if not created and payment.status == 'COMPLETED':
            return Response({
                'error': 'Cette demande a déjà été payée.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Générer un ID de transaction unique
        payment.transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        payment.payment_method = payment_method
        payment.status = 'PROCESSING'
        payment.save()
        
        # TODO: Intégrer avec la vraie passerelle de paiement
        # Pour le moment, on simule un paiement
        payment_url = self._generate_payment_url(payment)
        
        return Response({
            'payment': PaymentSerializer(payment).data,
            'payment_url': payment_url,
            'message': 'Paiement initié. Veuillez compléter le paiement.'
        }, status=status.HTTP_201_CREATED)
    
    def _generate_payment_url(self, payment):
        """Générer l'URL de paiement (à remplacer par vraie intégration)."""
        # Simulation
        return f"https://payment-gateway.example.com/pay/{payment.transaction_id}"


class PaymentWebhookView(generics.GenericAPIView):
    """
    Webhook pour recevoir les notifications de paiement.
    POST /api/payments/webhook/
    (Appelé par la passerelle de paiement)
    """
    permission_classes = []  # Pas d'auth car appelé par service externe
    
    def post(self, request):
        """
        Recevoir la notification de paiement.
        Body dépend de la passerelle utilisée.
        """
        # TODO: Vérifier la signature de la requête
        # TODO: Parser les données selon la passerelle
        
        transaction_id = request.data.get('transaction_id')
        status_payment = request.data.get('status')  # 'success', 'failed', etc.
        
        if not transaction_id:
            return Response({
                'error': 'transaction_id manquant'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment = Payment.objects.get(transaction_id=transaction_id)
        except Payment.DoesNotExist:
            return Response({
                'error': 'Paiement introuvable'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Mettre à jour le statut
        if status_payment == 'success':
            payment.status = 'COMPLETED'
            payment.paid_at = timezone.now()
            payment.save()
            
            # TODO: Envoyer notification au demandeur
            
        elif status_payment == 'failed':
            payment.status = 'FAILED'
            payment.save()
        
        return Response({'message': 'Webhook reçu'}, status=status.HTTP_200_OK)


class ConfirmPaymentMockView(generics.GenericAPIView):
    """
    Mock endpoint pour confirmer un paiement (test uniquement).
    POST /api/payments/confirm/
    Body: { "transaction_id": "..." }
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        transaction_id = request.data.get('transaction_id')
        if not transaction_id:
            return Response({'error': 'transaction_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment = Payment.objects.get(transaction_id=transaction_id, application__applicant=request.user)
            payment.status = 'COMPLETED'
            payment.paid_at = timezone.now()
            payment.save()
            return Response({'message': 'Paiement confirmé (mock)', 'payment': PaymentSerializer(payment).data})
        except Payment.DoesNotExist:
            return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)


class CheckPaymentStatusView(generics.RetrieveAPIView):
    """
    Vérifier le statut d'un paiement.
    GET /api/payments/{transaction_id}/status/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentStatusSerializer
    lookup_field = 'transaction_id'
    
    def get_queryset(self):
        return Payment.objects.filter(
            application__applicant=self.request.user
        )
# Create your views here.
