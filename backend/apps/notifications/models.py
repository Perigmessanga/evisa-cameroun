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
        base_url = settings.BASE_FRONTEND_URL
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'lien_demande_visa': f"{base_url}/applicant/tracking/{application.id}",
        }
        subject, message = cls._get_template_and_render(
            'APP_SUBMIT', context,
            f'Demande {application.application_number} — Soumise avec succès',
            f'Bonjour {user.get_full_name()},\n\nVotre demande de visa n° {application.application_number} a été soumise avec succès.\nVous serez notifié(e) de l\'avancement de votre dossier.\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_application_approved(cls, application):
        user = application.applicant
        base_url = settings.BASE_FRONTEND_URL
        context = {
            'user_name': user.get_full_name(),
            'nom_demandeur': user.get_full_name(),
            'application_number': application.application_number,
            'lien_telechargement_evisa': f"{base_url}/applicant/download-visa/{application.id}",
        }
        subject, message = cls._get_template_and_render(
            'APP_APPROVE', context,
            f'Demande {application.application_number} — APPROUVÉE ✅',
            f'Bonjour {user.get_full_name()},\n\nFélicitations ! Votre demande de visa n° {application.application_number} a été approuvée.\nVotre e-visa est disponible en téléchargement sur la plateforme.\n\nBon voyage au Cameroun !\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_payment_success(cls, payment):
        application = payment.application
        user = application.applicant
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'amount': f"{payment.amount} {payment.currency}",
            'processing_type': "Express" if application.processing_type == 'EXPRESS' else "Standard",
            'transaction_id': payment.transaction_id,
            'date': payment.paid_at.strftime('%d/%m/%Y à %H:%M') if payment.paid_at else "Aujourd'hui",
        }
        subject, message = cls._get_template_and_render(
            'PAYMENT_SUCCESS', context,
            f'Paiement Réussi — Demande {application.application_number}',
            f'Bonjour {user.get_full_name()},\n\nNous vous confirmons la réception de votre paiement d\'un montant de {context["amount"]} pour la demande de visa n° {application.application_number}.\n\nDétails de la transaction :\n- N° de transaction : {context["transaction_id"]}\n- Type de traitement : {context["processing_type"]}\n- Date : {context["date"]}\n\nVotre demande est maintenant soumise et en cours de traitement.\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_application_rejected(cls, application):
        user = application.applicant
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'rejection_reason': getattr(application, 'rejection_reason', 'Non spécifié'),
        }
        subject, message = cls._get_template_and_render(
            'APP_REJECT', context,
            f'Demande {application.application_number} — Refusée',
            f'Bonjour {user.get_full_name()},\n\nNous avons le regret de vous informer que votre demande de visa n° {application.application_number} a été refusée.\n\nMotif : {context["rejection_reason"]}\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_border_entry(cls, application, crossing):
        """Notifie le demandeur que son entrée sur le territoire a été enregistrée."""
        user = application.applicant
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'passport_number': application.passport_number,
            'location': crossing.location,
            'entry_date': crossing.crossing_date.strftime('%d/%m/%Y à %H:%M'),
            'expected_exit_date': crossing.expected_exit_date.strftime('%d/%m/%Y') if crossing.expected_exit_date else "Non spécifiée",
            'visa_type': application.visa_type.name if application.visa_type else 'Visa',
        }
        subject, message = cls._get_template_and_render(
            'BORDER_ENTRY', context,
            f'Bienvenue au Cameroun — Entrée enregistrée ({application.application_number})',
            f'Bonjour {user.get_full_name()},\n\n'
            f'Nous vous confirmons que votre entrée sur le territoire camerounais a été enregistrée avec succès.\n\n'
            f'Détails du passage :\n'
            f'- Point de passage : {context["location"]}\n'
            f'- Date et heure : {context["entry_date"]}\n'
            f'- Date de sortie recommandée : {context["expected_exit_date"]}\n\n'
            f'Nous vous souhaitons un excellent séjour au Cameroun.\n\n'
            f'Cordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_border_exit(cls, application, crossing):
        """Notifie le demandeur que sa sortie du territoire a été enregistrée."""
        user = application.applicant
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'passport_number': application.passport_number,
            'location': crossing.location,
            'exit_date': crossing.crossing_date.strftime('%d/%m/%Y à %H:%M'),
        }
        subject, message = cls._get_template_and_render(
            'BORDER_EXIT', context,
            f'Confirmation de sortie du territoire — e-Visa Cameroun',
            f'Bonjour {user.get_full_name()},\n\n'
            f'Nous vous informons que votre sortie du territoire camerounais a été enregistrée le {context["exit_date"]} au point de passage : {context["location"]}.\n\n'
            f'Nous espérons que votre séjour s\'est bien déroulé et vous remercions d\'avoir utilisé nos services.\n\n'
            f'Cordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_border_denial_email(cls, application, border_agent, location):
        """Notifie le demandeur que l'accès au territoire lui a été refusé."""
        user = application.applicant
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'passport_number': application.passport_number,
            'location': location,
            'agent_name': border_agent.get_full_name(),
        }
        subject, message = cls._get_template_and_render(
            'BORDER_DENIED', context,
            f'Alerte de Contrôle — Refus d\'entrée au poste frontière',
            f'Bonjour {user.get_full_name()},\n\nNous vous informons que l\'accès au territoire vous a été refusé lors de votre contrôle au point de passage suivant : {location}.\n\nRaison : Votre document de voyage ou votre demande de visa (N° {application.application_number}) a été jugé invalide par les autorités compétentes lors du contrôle frontière.\n\nSi vous estimez qu\'il s\'agit d\'une erreur, veuillez contacter nos services consulaires.\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
        )
        cls._send(user, subject, message, application)

    @classmethod
    def send_documents_requested(cls, application, agent_message):
        user = application.applicant
        base_url = settings.BASE_FRONTEND_URL
        context = {
            'user_name': user.get_full_name(),
            'application_number': application.application_number,
            'liste_documents_requis': agent_message,
            'lien_soumission_documents': f"{base_url}/applicant/tracking/{application.id}",
        }
        subject, message = cls._get_template_and_render(
            'DOC_REQUEST', context,
            f'Documents supplémentaires requis — Dossier {application.application_number}',
            f"Bonjour {user.get_full_name()},\n\nNous avons examiné votre demande de visa pour le Cameroun et nous avons besoin de documents supplémentaires pour compléter votre dossier.\nVeuillez fournir les documents suivants :\n{agent_message}\n\nVous pouvez les télécharger et les soumettre en cliquant sur ce lien : {context['lien_soumission_documents']}\n\nCordialement,\n\n© 2026 Ing.concept MESSANGA Charles Perig"
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
            f'Bonjour {user.get_full_name()},\n\nVotre compte a été créé avec succès.\n{verification_link}\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig'
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
