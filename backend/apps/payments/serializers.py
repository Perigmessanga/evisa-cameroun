from rest_framework import serializers
from apps.payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher les informations d'un paiement.
    """
    is_completed = serializers.BooleanField(read_only=True)
    application_number = serializers.CharField(
        source='application.application_number',
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            'id', 'application', 'application_number',
            'amount', 'currency', 'payment_method',
            'status', 'transaction_id', 'external_reference',
            'paid_at', 'created_at', 'is_completed'
        ]
        read_only_fields = [
            'id', 'transaction_id', 'status',
            'paid_at', 'created_at'
        ]


class PaymentInitiateSerializer(serializers.Serializer):
    """
    Serializer pour initier un paiement.
    """
    application_id = serializers.UUIDField()
    payment_method = serializers.ChoiceField(
        choices=[
            'CARD',
            'MOBILE_MONEY_MTN',
            'MOBILE_MONEY_ORANGE',
            'PAYPAL',
        ]
    )

    def validate_application_id(self, value):
        """Vérifier que la demande existe et est dans le bon statut."""
        from apps.visa_applications.models import VisaApplication
        
        try:
            application = VisaApplication.objects.get(id=value)
        except VisaApplication.DoesNotExist:
            raise serializers.ValidationError("Demande introuvable.")
        
        if application.status != 'DRAFT':
            raise serializers.ValidationError(
                "Cette demande a déjà été soumise."
            )
        
        # Vérifier qu'il n'y a pas déjà un paiement
        if hasattr(application, 'payment'):
            if application.payment.status == 'COMPLETED':
                raise serializers.ValidationError(
                    "Cette demande a déjà été payée."
                )
        
        return value


class PaymentStatusSerializer(serializers.ModelSerializer):
    """
    Serializer léger pour vérifier le statut d'un paiement.
    """
    class Meta:
        model = Payment
        fields = ['id', 'status', 'transaction_id', 'paid_at']
        read_only_fields = fields