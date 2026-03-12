"""
App Notifications — Modèle, Service, View
"""
import uuid
from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from evisa_backend.utils import api_response


# ─── MODÈLE ───────────────────────────────────────────────────────
class Notification(models.Model):
    class Type(models.TextChoices):
        EMAIL  = 'EMAIL',  'Email'
        SMS    = 'SMS',    'SMS'
        SYSTEM = 'SYSTEM', 'Système'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        SENT    = 'SENT',    'Envoyé'
        FAILED  = 'FAILED',  'Échoué'

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                         related_name='notifications')
    application      = models.ForeignKey('visa_applications.VisaApplication',
                                          on_delete=models.CASCADE, null=True, blank=True,
                                          related_name='notifications')
    notification_type = models.CharField(max_length=10, choices=Type.choices)
    subject          = models.CharField(max_length=255, blank=True)
    message          = models.TextField()
    status           = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    sent_at          = models.DateTimeField(null=True, blank=True)
    read_at          = models.DateTimeField(null=True, blank=True)
    retry_count      = models.PositiveIntegerField(default=0)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evisa_notification'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.notification_type}] {self.subject or self.message[:50]}'


# ─── SERVICE ──────────────────────────────────────────────────────
class NotificationService:
    """Service centralisé pour l'envoi de toutes les notifications."""

    @classmethod
    def send_application_submitted(cls, application):
        user    = application.applicant
        subject = f'Demande {application.application_number} — Soumise avec succès'
        message = (
            f'Bonjour {user.get_full_name()},\n\n'
            f'Votre demande de visa n° {application.application_number} a été soumise avec succès.\n'
            f'Vous serez notifié(e) de l\'avancement de votre dossier.\n\n'
            f'Cordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_application_approved(cls, application):
        user    = application.applicant
        subject = f'Demande {application.application_number} — APPROUVÉE ✅'
        message = (
            f'Bonjour {user.get_full_name()},\n\n'
            f'Félicitations ! Votre demande de visa n° {application.application_number} a été approuvée.\n'
            f'Votre e-visa est disponible en téléchargement sur la plateforme.\n\n'
            f'Bon voyage au Cameroun !\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_application_rejected(cls, application):
        user    = application.applicant
        subject = f'Demande {application.application_number} — Refusée'
        message = (
            f'Bonjour {user.get_full_name()},\n\n'
            f'Nous avons le regret de vous informer que votre demande de visa '
            f'n° {application.application_number} a été refusée.\n\n'
            f'Motif : {application.rejection_reason}\n\n'
            f'Pour toute question, contactez-nous.\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_documents_requested(cls, application, agent_message):
        user    = application.applicant
        subject = f'Demande {application.application_number} — Documents complémentaires requis'
        message = (
            f'Bonjour {user.get_full_name()},\n\n'
            f'Des documents complémentaires sont nécessaires pour votre demande '
            f'n° {application.application_number}.\n\n'
            f'Message de l\'agent : {agent_message}\n\n'
            f'Connectez-vous à la plateforme pour les fournir.\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def _send(cls, user, subject, message, application=None):
        """Envoie l'email et crée le log de notification."""
        notification = Notification.objects.create(
            user=user,
            application=application,
            notification_type=Notification.Type.EMAIL,
            subject=subject,
            message=message,
            status=Notification.Status.PENDING,
        )

        try:
            from django.utils import timezone
            send_mail(
                subject      = subject,
                message      = message,
                from_email   = settings.DEFAULT_FROM_EMAIL,
                recipient_list = [user.email],
                fail_silently  = False,
            )
            notification.status  = Notification.Status.SENT
            notification.sent_at = timezone.now()
        except Exception:
            notification.status      = Notification.Status.FAILED
            notification.retry_count += 1
        finally:
            notification.save(update_fields=['status', 'sent_at', 'retry_count'])


# ─── SERIALIZER ───────────────────────────────────────────────────
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ['id', 'notification_type', 'subject', 'message', 'status',
                  'sent_at', 'read_at', 'created_at']
        read_only_fields = fields


# ─── VIEW ─────────────────────────────────────────────────────────
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer les notifications de l'utilisateur connecté."""
        notifications = Notification.objects.filter(user=request.user)
        serializer    = NotificationSerializer(notifications, many=True)
        unread_count  = notifications.filter(read_at__isnull=True).count()
        return api_response(data={
            'notifications': serializer.data,
            'unread_count':  unread_count,
        })


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Marquer une notification comme lue."""
        from django.utils import timezone
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
            notif.read_at = timezone.now()
            notif.save(update_fields=['read_at'])
            return api_response(message='Notification marquée comme lue.')
        except Notification.DoesNotExist:
            return api_response(message='Notification introuvable.', status_code=404)