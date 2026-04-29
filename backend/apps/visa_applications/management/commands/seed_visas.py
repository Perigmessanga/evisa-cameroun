from django.core.management.base import BaseCommand
from apps.visa_applications.models import VisaType

class Command(BaseCommand):
    help = 'Seed visa types and required documents'

    def handle(self, *args, **options):
        # Definition des types de visa
        visa_types = [
            {
                'name': 'Visa de Transit',
                'code': 'TRANSIT',
                'description': 'Pour les escales techniques ou continuations de voyage.',
                'validity_days': 5,
                'max_stay_days': 5,
                'fee': 50000,
                'required_documents': [
                    {'type': 'PASSPORT', 'label': 'Passeport (validité 6 mois min)'},
                    {'type': 'TRAVEL_ITINERARY', 'label': 'Billet d\'avion pour destination finale'},
                    {'type': 'DESTINATION_VISA', 'label': 'Visa pays destination finale'},
                    {'type': 'VACCINATION_CERT', 'label': 'Certificat de vaccination'}
                ]
            },
            {
                'name': 'Visa Court Séjour',
                'code': 'SHORT_STAY',
                'description': 'Tourisme, affaires ou visite familiale (moins de 6 mois).',
                'validity_days': 180,
                'max_stay_days': 90,
    'fee': 100000,
                'required_documents': [
                    {'type': 'PASSPORT', 'label': 'Passeport (validité 6 mois min)'},
                    {'type': 'TRAVEL_ITINERARY', 'label': 'Billet d\'avion Aller/Retour'},
                    {'type': 'VACCINATION_CERT', 'label': 'Certificats internationaux de vaccination'},
                    {'type': 'FINANCIAL_PROOF', 'label': 'Justificatif objet visite et moyens de subsistance'},
                    {'type': 'ACCOMMODATION_PROOF', 'label': 'Certificat d\'hébergement (visé maire) ou réservation hôtel'},
                    {'type': 'MISSION_ORDER', 'label': 'Ordre de mission (le cas échéant)'},
                    {'type': 'RESIDENCE_CERT', 'label': 'Certificat de domicile du demandeur'},
                    {'type': 'PROFESSION_PROOF', 'label': 'Justificatif de la profession'}
                ]
            },
            {
                'name': 'Visa Long Séjour',
                'code': 'LONG_STAY',
                'description': 'Études, travail ou regroupement familial (plus de 6 mois).',
                'validity_days': 365,
                'max_stay_days': 365,
                'fee': 200000,
                'required_documents': [
                    {'type': 'PASSPORT', 'label': 'Passeport (validité plus de 6 mois)'},
                    {'type': 'TRAVEL_ITINERARY', 'label': 'Billet d\'avion valable jusqu\'au Cameroun'},
                    {'type': 'VACCINATION_CERT', 'label': 'Certificats internationaux de vaccination'},
                    {'type': 'REPATRIATION_GUAR', 'label': 'Garantie de rapatriement'},
                    {'type': 'STUDENT_REG', 'label': 'Attestation d\'inscription scolaires (étudiants)'},
                    {'type': 'INTERNSHIP_ATT', 'label': 'Attestation de mise en stage (stagiaires)'},
                    {'type': 'WORK_CONTRACT', 'label': 'Contrat de travail visé (salariés)'},
                    {'type': 'PROFESSION_AUTH', 'label': 'Autorisation d\'exercer ou promouvoir (indépendants)'},
                    {'type': 'FAMILY_ACT', 'label': 'Acte de mariage ou parental (famille)'},
                    {'type': 'RESIDENCE_CERT', 'label': 'Certificat de domicile du demandeur'},
                    {'type': 'PROFESSION_PROOF', 'label': 'Justificatif de la profession'}
                ]
            },
            {
                'name': 'Visas Diplomatiques / Courtoisie',
                'code': 'DIPLOMATIC',
                'description': 'Détenteurs de passeports diplomatiques ou de service.',
                'validity_days': 365,
                'max_stay_days': 90,
                'fee': 0,
                'required_documents': [
                    {'type': 'PASSPORT', 'label': 'Passeport Diplomatique / Service (6 mois min)'},
                    {'type': 'TRAVEL_ITINERARY', 'label': 'Billet d\'avion Aller/Retour'},
                    {'type': 'VERBAL_NOTE', 'label': 'Note verbale (Diplomatique / Service)'},
                    {'type': 'VACCINATION_CERT', 'label': 'Certificats internationaux de vaccination'},
                    {'type': 'OTHER', 'label': 'Justificatif de l\'objet de la visite'},
                    {'type': 'ACCOMMODATION_PROOF', 'label': 'Certificat d\'hébergement ou réservation hôtel'},
                    {'type': 'MISSION_ORDER', 'label': 'Ordre de mission (le cas échéant)'}
                ]
            }
        ]

        for vdata in visa_types:
            visa, created = VisaType.objects.update_or_create(
                code=vdata['code'],
                defaults=vdata
            )
            status = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f'Successfully {status} visa type: {vdata["name"]}'))
