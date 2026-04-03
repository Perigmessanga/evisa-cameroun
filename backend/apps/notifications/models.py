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
from django.template import Context, Template as DjangoTemplate

class NotificationService:
    """Service centralisé pour l'envoi de toutes les notifications, utilisant les Modèles d'Email (EmailTemplate) si existants."""

    @classmethod
    def _render_template(cls, email_template, context_dict):
        """Rend le sujet et le corps avec le dictionnaire de contexte."""
        # Support pour les placeholders à accolades simples {var} en les convertissant en {{var}}
        import re
        subject_content = email_template.subject
        body_content = email_template.body_text
        
        # Regex pour trouver {variable} mais pas {{variable}}
        pattern = r'(?<!\{)\{([a-zA-Z0-9_]+)\}(?!\})'
        subject_content = re.sub(pattern, r'{{\1}}', subject_content)
        body_content = re.sub(pattern, r'{{\1}}', body_content)
        
        subject_template = DjangoTemplate(subject_content)
        body_template = DjangoTemplate(body_content)
        context = Context(context_dict)
        return subject_template.render(context), body_template.render(context)

    @classmethod
    def _get_template_and_render(cls, template_code, context_dict, fallback_subject, fallback_message):
        """Cherche un EmailTemplate actif par code. S'il n'existe pas, utilise le fallback."""
        from apps.notifications.models import EmailTemplate
        try:
            template = EmailTemplate.objects.get(code=template_code, is_active=True)
            return cls._render_template(template, context_dict)
        except EmailTemplate.DoesNotExist:
            return fallback_subject, fallback_message

    @classmethod
    def send_application_submitted(cls, application):
        user = application.applicant
        base_url = "http://localhost:3001"
        context = {
            'user_name': user.get_full_name(),
            'nom_demandeur': user.get_full_name(),
            'application_number': application.application_number,
            'lien_demande_visa': f"{base_url}/applicant/tracking/{application.id}",
        }
        subject, message = cls._get_template_and_render(
            'APP_SUBMIT', context,
            f'Demande {application.application_number} — Soumise avec succès',
            f'Bonjour {user.get_full_name()},\n\nVotre demande de visa n° {application.application_number} a été soumise avec succès.\nVous serez notifié(e) de l\'avancement de votre dossier.\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_application_approved(cls, application):
        user = application.applicant
        base_url = "http://localhost:3001"
        context = {
            'user_name': user.get_full_name(),
            'nom_demandeur': user.get_full_name(),
            'application_number': application.application_number,
            'lien_telechargement_evisa': f"{base_url}/applicant/download-visa/{application.id}",
        }
        subject, message = cls._get_template_and_render(
            'APP_APPROVE', context,
            f'Demande {application.application_number} — APPROUVÉE ✅',
            f'Bonjour {user.get_full_name()},\n\nFélicitations ! Votre demande de visa n° {application.application_number} a été approuvée.\nVotre e-visa est disponible en téléchargement sur la plateforme.\n\nBon voyage au Cameroun !\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_application_rejected(cls, application):
        user = application.applicant
        context = {
            'user_name': user.get_full_name(),
            'nom_demandeur': user.get_full_name(),
            'application_number': application.application_number,
            'rejection_reason': getattr(application, 'rejection_reason', 'Non spécifié'),
            'raison_refus': getattr(application, 'rejection_reason', 'Non spécifié'),
        }
        subject, message = cls._get_template_and_render(
            'APP_REJECT', context,
            f'Demande {application.application_number} — Refusée',
            f'Bonjour {user.get_full_name()},\n\nNous avons le regret de vous informer que votre demande de visa n° {application.application_number} a été refusée.\n\nMotif : {context["rejection_reason"]}\n\nPour toute question, contactez-nous.\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_documents_requested(cls, application, agent_message):
        user = application.applicant
        base_url = "http://localhost:3000"  # Correction pour le lien frontend typique
        context = {
            'nom_demandeur': user.get_full_name(),
            'application_number': application.application_number,
            'liste_documents_requis': agent_message,
            'lien_soumission_documents': f"{base_url}/applicant/tracking/{application.id}",
        }
        subject, message = cls._get_template_and_render(
            'DOC_REQUEST', context,
            f'Documents supplémentaires requis — Dossier {application.application_number}',
            f"Bonjour {context['nom_demandeur']},\n\nNous avons examiné votre demande de visa pour le Cameroun et nous avons besoin de documents supplémentaires pour compléter votre dossier.\nVeuillez fournir les documents suivants :\n{agent_message}\n\nVous pouvez les télécharger et les soumettre en cliquant sur ce lien : {context['lien_soumission_documents']}\n\nCordialement,\n\nL'équipe de traitement des visas e-Visa Cameroun"
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_account_created(cls, user, verification_link=""):
        context = {
            'user_name': user.get_full_name(),
            'verification_link': verification_link,
        }
        subject, message = cls._get_template_and_render(
            'AUTH_WELCOME', context,
            'Bienvenue sur e-Visa Cameroun',
            f'Bonjour {user.get_full_name()},\n\nVotre compte a été créé avec succès.\n{verification_link}\n\nCordialement,\nL\'équipe e-Visa Cameroun'
        )
        cls._send(user, subject, message)

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


# ─────────────────────────────────────────────────────────────────
# MODÈLES D'EMAILS
# ─────────────────────────────────────────────────────────────────
class EmailTemplate(models.Model):
    """
    Modèles d'emails éditables par l'administrateur.
    Chaque template correspond à un type d'email envoyé par le système.
    """
    class TemplateType(models.TextChoices):
        AUTH        = 'AUTH',        'Authentification'
        APPLICATION = 'APPLICATION', 'Dossier Visa'
        SECURITY    = 'SECURITY',    'Sécurité'
        PAYMENT     = 'PAYMENT',     'Paiement'
        SYSTEM      = 'SYSTEM',      'Système'

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name        = models.CharField(max_length=200, verbose_name="Nom du modèle")
    code        = models.SlugField(max_length=100, unique=True, verbose_name="Code unique")
    type        = models.CharField(max_length=20, choices=TemplateType.choices, default=TemplateType.SYSTEM)
    subject     = models.CharField(max_length=255, verbose_name="Sujet de l'email")
    body_text   = models.TextField(verbose_name="Corps de l'email (texte brut)")
    body_html   = models.TextField(blank=True, verbose_name="Corps de l'email (HTML)")
    language    = models.CharField(max_length=10, default='FR', verbose_name="Langue")
    is_active   = models.BooleanField(default=True, verbose_name="Actif")
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'email_template'
        verbose_name = "Modèle d'email"
        verbose_name_plural = "Modèles d'emails"
        ordering = ['type', 'name']

    def __str__(self):
        return f"[{self.type}] {self.name}"