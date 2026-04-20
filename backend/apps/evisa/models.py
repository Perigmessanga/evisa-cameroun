import uuid
from django.db import models
from django.utils import timezone


class EVisa(models.Model):
    """
    e-Visa généré après approbation d'une demande.
    Contient le QR code et le fichier PDF téléchargeable.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Un seul e-visa par demande approuvée
    application = models.OneToOneField(
        'visa_applications.VisaApplication',
        on_delete=models.CASCADE,
        related_name='evisa',
        verbose_name="Demande de visa"
    )

    # Numéro unique du visa (ex: CM-VISA-2026-000001)
    visa_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Numéro de visa"
    )

    # Dates de validité
    issue_date = models.DateField(
        verbose_name="Date d'émission"
    )
    expiry_date = models.DateField(
        verbose_name="Date d'expiration"
    )

    # QR Code en base64 (pour vérification aux frontières)
    qr_code = models.TextField(
        verbose_name="QR Code"
    )

    # Chemin vers le fichier PDF généré
    pdf_file_path = models.CharField(
        max_length=500,
        verbose_name="Chemin du PDF"
    )

    # Révocation (si le visa doit être annulé après émission)
    is_revoked = models.BooleanField(
        default=False,
        verbose_name="Révoqué"
    )
    revocation_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de révocation"
    )
    revocation_reason = models.TextField(
        blank=True,
        null=True,
        verbose_name="Motif de révocation"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'e_visa'
        verbose_name = 'e-Visa'
        verbose_name_plural = 'e-Visas'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['visa_number']),
            models.Index(fields=['expiry_date']),
        ]

    def __str__(self):
        return f"e-Visa {self.visa_number} - {self.application.full_name}"

    def save(self, *args, **kwargs):
        """Générer automatiquement le numéro de visa à la création."""
        if not self.visa_number:
            year = timezone.now().year
            count = EVisa.objects.filter(
                created_at__year=year
            ).count() + 1
            self.visa_number = f"CM-VISA-{year}-{count:06d}"
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        """Vérifier si le visa est encore valide (non expiré et non révoqué)."""
        if self.is_revoked:
            return False
        return self.expiry_date >= timezone.now().date()

    @property
    def days_until_expiry(self):
        """Nombre de jours avant expiration."""
        delta = self.expiry_date - timezone.now().date()
        return delta.days


class BorderCrossing(models.Model):
    """
    Enregistrement des entrées/sorties du territoire
    effectuées par les agents aux frontières.
    """

    CROSSING_TYPE_CHOICES = [
        ('ENTRY', 'Entrée'),
        ('EXIT',  'Sortie'),
        ('DENIED', 'Refus Entrée'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    evisa = models.ForeignKey(
        EVisa,
        on_delete=models.CASCADE,
        related_name='crossings',
        null=True,
        blank=True,
        verbose_name="e-Visa"
    )
    application = models.ForeignKey(
        'visa_applications.VisaApplication',
        on_delete=models.CASCADE,
        related_name='border_crossings',
        null=True,
        blank=True,
        verbose_name="Demande de visa"
    )
    border_agent = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        related_name="evisa_border_crossings",
        verbose_name="Agent frontière"
    )

    crossing_type = models.CharField(
        max_length=10,
        choices=CROSSING_TYPE_CHOICES,
        verbose_name="Type (Entrée/Sortie/Refus)"
    )
    location = models.CharField(
        max_length=200,
        verbose_name="Point de passage"
    )
    crossing_date = models.DateTimeField(
        default=timezone.now,
        verbose_name="Date et heure"
    )
    
    # Nouveaux champs pour le suivi
    expected_exit_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date de sortie prévue"
    )
    linked_exit = models.OneToOneField(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='linked_entry',
        verbose_name="Sortie liée"
    )

    notes = models.TextField(
        blank=True,
        verbose_name="Notes"
    )

    class Meta:
        db_table = 'border_crossing'
        verbose_name = 'Passage Frontière'
        verbose_name_plural = 'Passages Frontière'
        ordering = ['-crossing_date']

    def __str__(self):
        return f"{self.crossing_type} - {self.evisa.visa_number} - {self.location}"


class SystemSetting(models.Model):
    """
    Paramètres globaux du système configurables par les administrateurs.
    """
    
    CATEGORY_CHOICES = [
        ('GENERAL', 'Général'),
        ('EMAIL', 'Serveur Email'),
        ('PAYMENT', 'Paiement'),
        ('SECURITY', 'Sécurité'),
    ]

    key = models.CharField(
        max_length=100, 
        primary_key=True, 
        verbose_name="Clé de configuration"
    )
    value = models.TextField(
        blank=True, 
        verbose_name="Valeur"
    )
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='GENERAL', 
        verbose_name="Catégorie"
    )
    description = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name="Description"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'system_setting'
        verbose_name = 'Paramètre Système'
        verbose_name_plural = 'Paramètres Système'
        ordering = ['category', 'key']

    def __str__(self):
        return f"[{self.category}] {self.key} = {self.value}"


class ContactMessage(models.Model):
    """
    Message de contact envoyé depuis le header public par un utilisateur lambda.
    Permet à l'Administrateur de lire et répondre.
    """
    STATUS_CHOICES = [
        ('UNREAD', 'Non lu'),
        ('READ', 'Lu'),
        ('REPLIED', 'Répondu'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email de contact")
    subject = models.CharField(max_length=255, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")

    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='UNREAD', 
        verbose_name="Statut"
    )
    
    replied_by = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="replied_messages",
        verbose_name="Répondu par"
    )
    reply_message = models.TextField(blank=True, null=True, verbose_name="Message de réponse")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")
    replied_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de réponse")

    class Meta:
        db_table = 'contact_message'
        verbose_name = 'Message de Contact'
        verbose_name_plural = 'Messages de Contact'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} par {self.email} ({self.status})"