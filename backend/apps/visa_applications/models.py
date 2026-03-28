"""
Modèles — App visa_applications
"""
import uuid
from django.db import models
from django.conf import settings


# ─────────────────────────────────────────────────────────────────
# CHOIX (Enums)
# ─────────────────────────────────────────────────────────────────
class ApplicationStatus(models.TextChoices):
    DRAFT           = 'DRAFT',           'Brouillon'
    SUBMITTED       = 'SUBMITTED',       'Soumise'
    PROCESSING      = 'PROCESSING',      'En traitement'
    PENDING_DOCS    = 'PENDING_DOCS',    'Attente documents'
    PENDING_REVIEW  = 'PENDING_REVIEW',  'Attente avis consulaire'
    APPROVED        = 'APPROVED',        'Approuvée'
    REJECTED        = 'REJECTED',        'Rejetée'
    CANCELLED       = 'CANCELLED',       'Annulée'

class EmbassyOpinion(models.TextChoices):
    NONE         = 'NONE',         'Aucun avis'
    FAVORABLE    = 'FAVORABLE',    'Favorable'
    UNFAVORABLE  = 'UNFAVORABLE',  'Défavorable'

class BorderCheckStatus(models.TextChoices):
    NOT_CHECKED = 'NOT_CHECKED', 'Non vérifié'
    ENTERED     = 'ENTERED',     'Entrée enregistrée'
    EXITED      = 'EXITED',      'Sortie enregistrée'
    DENIED      = 'DENIED',      'Entrée refusée'

class DocumentType(models.TextChoices):
# ... (same as before)
    PASSPORT             = 'PASSPORT',             'Passeport'
    PHOTO                = 'PHOTO',                'Photo d\'identité'
    TRAVEL_ITINERARY     = 'TRAVEL_ITINERARY',     'Itinéraire de voyage'
    ACCOMMODATION_PROOF  = 'ACCOMMODATION_PROOF',  'Justificatif d\'hébergement'
    FINANCIAL_PROOF      = 'FINANCIAL_PROOF',      'Justificatif financier'
    INVITATION_LETTER    = 'INVITATION_LETTER',    'Lettre d\'invitation'
    OTHER                = 'OTHER',                'Autre'

class Gender(models.TextChoices):
# ... (same as before)
    MALE   = 'MALE',   'Masculin'
    FEMALE = 'FEMALE', 'Féminin'
    OTHER  = 'OTHER',  'Autre'


# ─────────────────────────────────────────────────────────────────
# TYPE DE VISA
# ─────────────────────────────────────────────────────────────────
class VisaType(models.Model):
    id                   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name                 = models.CharField(max_length=100, verbose_name='Nom')
    code                 = models.CharField(max_length=20, unique=True, verbose_name='Code')
    description          = models.TextField(blank=True, verbose_name='Description')
    validity_days        = models.PositiveIntegerField(verbose_name='Validité (jours)')
    max_stay_days        = models.PositiveIntegerField(verbose_name='Durée séjour max (jours)')
    fee                  = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Frais (XAF)')
    required_documents   = models.JSONField(default=list, verbose_name='Documents requis')
    processing_time_days = models.PositiveIntegerField(default=7, verbose_name='Délai traitement (jours)')
    is_active            = models.BooleanField(default=True, verbose_name='Actif')
    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_visa_type'
        verbose_name = 'Type de visa'
        verbose_name_plural = 'Types de visa'
        ordering     = ['name']

    def __str__(self):
        return f'{self.name} ({self.code})'


# ─────────────────────────────────────────────────────────────────
# DEMANDE DE VISA
# ─────────────────────────────────────────────────────────────────
class VisaApplication(models.Model):
    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_number = models.CharField(max_length=50, unique=True, verbose_name='Numéro de demande')
    applicant          = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='applications', verbose_name='Demandeur'
    )
    visa_type          = models.ForeignKey(
        VisaType, on_delete=models.PROTECT,
        related_name='applications', verbose_name='Type de visa'
    )
    assigned_agent     = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_applications',
        verbose_name='Agent assigné'
    )
    processed_by       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='processed_applications',
        verbose_name='Traité par'
    )
    status             = models.CharField(
        max_length=20, choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT, verbose_name='Statut'
    )

    # ── Informations personnelles ──────────────────────────────
    full_name        = models.CharField(max_length=200, verbose_name='Nom complet')
    date_of_birth    = models.DateField(verbose_name='Date de naissance')
    place_of_birth   = models.CharField(max_length=100, verbose_name='Lieu de naissance')
    nationality      = models.CharField(max_length=100, verbose_name='Nationalité')
    residence_country = models.CharField(max_length=100, verbose_name='Pays de résidence', default='Autre')
    gender           = models.CharField(max_length=10, choices=Gender.choices, verbose_name='Genre')

    # ── Informations passeport ─────────────────────────────────
    passport_number      = models.CharField(max_length=50, verbose_name='Numéro passeport')
    passport_issue_date  = models.DateField(verbose_name='Date émission passeport')
    passport_expiry_date = models.DateField(verbose_name='Date expiration passeport')
    passport_country     = models.CharField(max_length=100, verbose_name='Pays émission')

    # ── Informations voyage ────────────────────────────────────
    purpose_of_visit    = models.TextField(verbose_name='Motif de visite')
    arrival_date        = models.DateField(verbose_name='Date d\'arrivée prévue')
    departure_date      = models.DateField(verbose_name='Date de départ prévue')
    address_in_cameroon = models.TextField(verbose_name='Adresse au Cameroun')

    # ── Avis Ambassade ─────────────────────────────────────────
    embassy_opinion = models.CharField(
        max_length=20, choices=EmbassyOpinion.choices,
        default=EmbassyOpinion.NONE, verbose_name='Avis ambassade'
    )
    embassy_comment = models.TextField(blank=True, verbose_name='Commentaire ambassade')

    # ── Contrôle Frontière ─────────────────────────────────────
    border_check_status = models.CharField(
        max_length=20, choices=BorderCheckStatus.choices,
        default=BorderCheckStatus.NOT_CHECKED, verbose_name='Statut frontière'
    )
    border_agent        = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='border_checks',
        verbose_name='Agent frontière'
    )
    border_checked_at   = models.DateTimeField(null=True, blank=True, verbose_name='Date vérification frontière')

    # ── Traitement ─────────────────────────────────────────────
    has_biometrics   = models.BooleanField(default=False, verbose_name='Biométrie vérifiée')
    submitted_at     = models.DateTimeField(null=True, blank=True, verbose_name='Soumis le')
    processed_at     = models.DateTimeField(null=True, blank=True, verbose_name='Traité le')
    rejection_reason = models.TextField(blank=True, verbose_name='Motif de rejet')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_application'
        verbose_name = 'Demande de visa'
        verbose_name_plural = 'Demandes de visa'
        ordering     = ['-created_at']
        indexes      = [
            models.Index(fields=['applicant', 'status']),
            models.Index(fields=['application_number']),
            models.Index(fields=['status', 'submitted_at']),
            models.Index(fields=['residence_country']),
        ]

    def __str__(self):
        return f'{self.application_number} — {self.full_name} ({self.status})'

    def save(self, *args, **kwargs):
        if not self.application_number:
            import random
            import string
            from django.utils import timezone
            year    = timezone.now().year
            suffix  = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            self.application_number = f'CMR-{year}-{suffix}'
        super().save(*args, **kwargs)


# ─────────────────────────────────────────────────────────────────
# DOCUMENT
# ─────────────────────────────────────────────────────────────────
def document_upload_path(instance, filename):
    return f'documents/{instance.application.id}/{filename}'

class Document(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application   = models.ForeignKey(
        VisaApplication, on_delete=models.CASCADE,
        related_name='documents', verbose_name='Demande'
    )
    document_type = models.CharField(max_length=30, choices=DocumentType.choices, verbose_name='Type de document')
    file          = models.FileField(upload_to=document_upload_path, verbose_name='Fichier')
    file_name     = models.CharField(max_length=255, verbose_name='Nom du fichier')
    file_size     = models.PositiveIntegerField(verbose_name='Taille (octets)')
    mime_type     = models.CharField(max_length=100, blank=True, verbose_name='Type MIME')
    is_verified   = models.BooleanField(default=False, verbose_name='Vérifié')
    uploaded_at   = models.DateTimeField(auto_now_add=True)
    verified_at   = models.DateTimeField(null=True, blank=True)
    verified_by   = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verified_documents'
    )

    class Meta:
        db_table     = 'evisa_document'
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'

    def __str__(self):
        return f'{self.document_type} — {self.application.application_number}'


# ─────────────────────────────────────────────────────────────────
# E-VISA (Le document final)
# ─────────────────────────────────────────────────────────────────
class EVisa(models.Model):
    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application        = models.OneToOneField(VisaApplication, on_delete=models.CASCADE, related_name='e_visa')
    visa_number        = models.CharField(max_length=50, unique=True)
    issue_date         = models.DateField()
    expiry_date        = models.DateField()
    qr_code_data       = models.TextField()
    pdf_file           = models.FileField(upload_to='e_visas/', null=True, blank=True)
    
    created_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evisa_issued'
        verbose_name = 'E-Visa émis'

    def __str__(self):
        return f'E-Visa {self.visa_number} ({self.application.full_name})'


# ─────────────────────────────────────────────────────────────────
# HISTORIQUE DES ACTIONS
# ─────────────────────────────────────────────────────────────────
class VisaHistory(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(VisaApplication, on_delete=models.CASCADE, related_name='history')
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action      = models.CharField(max_length=100)
    details     = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evisa_history'
        verbose_name = 'Historique'
        ordering = ['-created_at']


# ─────────────────────────────────────────────────────────────────
# ALERTE DE SÉCURITÉ
# ─────────────────────────────────────────────────────────────────
class SecurityAlert(models.Model):
    class AlertType(models.TextChoices):
        HIGH   = 'HIGH',   'Haute'
        MEDIUM = 'MEDIUM', 'Moyenne'
        LOW    = 'LOW',    'Basse'

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(VisaApplication, on_delete=models.CASCADE, related_name='security_alerts', null=True, blank=True)
    type        = models.CharField(max_length=20, choices=AlertType.choices, default=AlertType.MEDIUM)
    title       = models.CharField(max_length=200)
    description = models.TextField()
    location    = models.CharField(max_length=200)
    is_resolved = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evisa_security_alert'
        verbose_name = 'Alerte de sécurité'
        verbose_name_plural = 'Alertes de sécurité'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.type}] {self.title} - {self.location}'


# ─────────────────────────────────────────────────────────────────
# COMMENTAIRE SUR LA DEMANDE
# ─────────────────────────────────────────────────────────────────
class ApplicationComment(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        VisaApplication, on_delete=models.CASCADE,
        related_name='comments', verbose_name='Demande'
    )
    author      = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='comments', verbose_name='Auteur'
    )
    content     = models.TextField(verbose_name='Contenu')
    is_internal = models.BooleanField(default=True, verbose_name='Commentaire interne')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_comment'
        verbose_name = 'Commentaire'
        verbose_name_plural = 'Commentaires'
        ordering     = ['created_at']

    def __str__(self):
        return f'Commentaire de {self.author.get_full_name()} sur {self.application.application_number}'