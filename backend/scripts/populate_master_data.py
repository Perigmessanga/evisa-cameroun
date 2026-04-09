
import os
import django
import sys
import uuid

# Ajouter le dossier backend au path pour trouver evisa_backend et apps
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.visa_applications.models import VisaType
from apps.notifications.models import EmailTemplate

def populate_visa_types():
    print("Populating Visa Types...")
    visa_types = [
        {
            "name": "Visa de Tourisme (Court Séjour)",
            "code": "TOURIST-SHORT",
            "description": "Pour les séjours touristiques, visites familiales ou privées au Cameroun.",
            "validity_days": 180,
            "max_stay_days": 90,
            "fee": 100000,
            "processing_time_days": 3,
            "required_documents": ["Passeport Valide", "Photo d'identité", "Billet d'avion", "Justificatif d'hébergement"]
        },
        {
            "name": "Visa d'Affaires (Court Séjour)",
            "code": "BUSINESS-SHORT",
            "description": "Pour les missions professionnelles, conférences ou rendez-vous d'affaires.",
            "validity_days": 180,
            "max_stay_days": 90,
            "fee": 150000,
            "processing_time_days": 3,
            "required_documents": ["Passeport Valide", "Photo d'identité", "Lettre d'invitation professionnelle", "Ordre de mission"]
        },
        {
            "name": "Visa Long Séjour",
            "code": "LONG-STAY",
            "description": "Pour les séjours de longue durée (Études, Travail, Regroupement familial).",
            "validity_days": 365,
            "max_stay_days": 180,
            "fee": 200000,
            "processing_time_days": 10,
            "required_documents": ["Passeport Valide", "Photo d'identité", "Certificat de scolarité ou Contrat de travail", "Casier judiciaire"]
        },
        {
            "name": "Visa de Transit",
            "code": "TRANSIT",
            "description": "Pour un passage par le territoire camerounais vers une destination tierce.",
            "validity_days": 5,
            "max_stay_days": 5,
            "fee": 50000,
            "processing_time_days": 1,
            "required_documents": ["Passeport Valide", "Visa destination finale", "Billet d'avion continuation"]
        }
    ]

    for vt_data in visa_types:
        vt, created = VisaType.objects.update_or_create(
            code=vt_data["code"],
            defaults={
                "name": vt_data["name"],
                "description": vt_data["description"],
                "validity_days": vt_data["validity_days"],
                "max_stay_days": vt_data["max_stay_days"],
                "fee": vt_data["fee"],
                "processing_time_days": vt_data["processing_time_days"],
                "required_documents": vt_data["required_documents"],
                "is_active": True
            }
        )
        status = "Created" if created else "Updated"
        print(f" - {vt.name} ({vt.code}): {status}")

def populate_email_templates():
    print("\nPopulating Email Templates...")
    templates = [
        {
            "name": "Bienvenue & Activation",
            "code": "AUTH_WELCOME",
            "type": EmailTemplate.TemplateType.AUTH,
            "subject": "Bienvenue sur e-Visa Cameroun - Activez votre compte",
            "body_text": """Bonjour {user_name},

Bienvenue sur la plateforme officielle de demande de e-Visa pour la République du Cameroun.

Pour finaliser la création de votre compte et commencer vos démarches, veuillez cliquer sur le lien ci-dessous :
{verification_link}

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.

L'équipe e-Visa Cameroun.""",
            "language": "FR"
        },
        {
            "name": "Confirmation de Soumission",
            "code": "APP_SUBMIT",
            "type": EmailTemplate.TemplateType.APPLICATION,
            "subject": "Demande {application_number} — Soumise avec succès",
            "body_text": """Bonjour {user_name},

Votre demande de visa n° {application_number} a été soumise avec succès sur la plateforme e-Visa Cameroun.

Votre dossier est actuellement en cours de traitement par nos services. Vous pouvez suivre l'évolution de votre demande en cliquant sur le lien suivant :
{lien_demande_visa}

Vous recevrez une notification dès qu'une décision sera prise ou si des informations complémentaires sont requises.

Cordialement,
L'équipe e-Visa Cameroun.""",
            "language": "FR"
        },
        {
            "name": "Visa Approuvé",
            "code": "APP_APPROVE",
            "type": EmailTemplate.TemplateType.APPLICATION,
            "subject": "Demande {application_number} — APPROUVÉE ✅",
            "body_text": """Bonjour {user_name},

Félicitations ! Votre demande de visa n° {application_number} a été approuvée par les autorités camerounaises.

Votre autorisation e-Visa est désormais disponible. Vous pouvez la télécharger en cliquant sur le lien ci-dessous :
{lien_telechargement_evisa}

Veuillez imprimer ce document et le présenter lors de votre embarquement et à votre arrivée au poste frontière au Cameroun.

Bon voyage !
L'équipe e-Visa Cameroun.""",
            "language": "FR"
        },
        {
            "name": "Visa Rejeté",
            "code": "APP_REJECT",
            "type": EmailTemplate.TemplateType.APPLICATION,
            "subject": "Demande {application_number} — Refusée",
            "body_text": """Bonjour {user_name},

Nous avons le regret de vous informer que votre demande de visa n° {application_number} a été refusée après examen par nos services.

Motif du refus : {rejection_reason}

Conformément à la réglementation en vigueur, vous pouvez soumettre une nouvelle demande en tenant compte des motifs mentionnés ci-dessus.

Cordialement,
L'équipe e-Visa Cameroun.""",
            "language": "FR"
        },
        {
            "name": "Documents Supplémentaires Requis",
            "code": "DOC_REQUEST",
            "type": EmailTemplate.TemplateType.APPLICATION,
            "subject": "Action Requise : Documents supplémentaires — Dossier {application_number}",
            "body_text": """Bonjour {user_name},

L'examen de votre demande de visa n° {application_number} nécessite des informations ou documents complémentaires.

Veuillez nous fournir les éléments suivants :
{liste_documents_requis}

Vous pouvez téléverser ces documents directement sur votre espace personnel via ce lien :
{lien_soumission_documents}

Votre demande restera en attente jusqu'à réception de ces éléments.

Cordialement,
L'équipe e-Visa Cameroun.""",
            "language": "FR"
        },
        {
            "name": "Confirmation de Paiement",
            "code": "PAYMENT_SUCCESS",
            "type": EmailTemplate.TemplateType.PAYMENT,
            "subject": "Confirmation de paiement — e-Visa Cameroun",
            "body_text": """Bonjour {user_name},

Nous vous confirmons la bonne réception de votre paiement relatif à votre demande de visa.

Montant : {amount} FCFA
Référence : {transaction_id}
Date : {date}

Conservez cet email comme preuve de paiement.

L'équipe e-Visa Cameroun.""",
            "language": "FR"
        }
    ]

    for tpl_data in templates:
        tpl, created = EmailTemplate.objects.update_or_create(
            code=tpl_data["code"],
            defaults={
                "name": tpl_data["name"],
                "type": tpl_data["type"],
                "subject": tpl_data["subject"],
                "body_text": tpl_data["body_text"],
                "language": tpl_data["language"],
                "is_active": True
            }
        )
        status = "Created" if created else "Updated"
        print(f" - {tpl.name} ({tpl.code}): {status}")

if __name__ == "__main__":
    populate_visa_types()
    populate_email_templates()
    print("\nPopulation finished successfully!")
