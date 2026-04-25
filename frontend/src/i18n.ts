import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  fr: {
    translation: {
      "common": {
        "loading": "Chargement...",
        "error": "Une erreur est survenue",
        "save": "Enregistrer",
        "cancel": "Annuler",
        "next": "Suivant",
        "previous": "Précédent",
        "logout": "Déconnexion"
      },
      "nav": {
        "home": "Acceuil",
        "dashboard": "Tableau de Bord",
        "apply": "Demander un Visa",
        "tracking": "Suivre ma demande",
        "profile": "Profil"
      },
      "dashboard": {
        "welcome": "Bienvenue, {{name}}",
        "recent_apps": "Demandes Récentes",
        "no_apps": "Aucune demande trouvée."
      },
      "form": {
        "title": "Nouvelle Demande de Visa",
        "personal_info": "Informations Personnelles",
        "passport_info": "Informations Passeport",
        "travel_info": "Détails du Voyage",
        "documents": "Documents & Justificatifs",
        "full_name": "Nom complet",
        "nationality": "Pays de résidence actuel / Nationalité",
        "birth_date": "Date de naissance",
        "passport_number": "Numéro de passeport",
        "expiry_date": "Date d'expiration",
        "arrival_date": "Date d'arrivée prévue",
        "stay_duration": "Durée du séjour",
        "submit_application": "Soumettre ma demande",
        "step_indicator": "Étape {{current}} sur {{total}}",
        "gender": "Sexe",
        "marital_status": "Situation matrimoniale",
        "profession": "Profession / Fonction",
        "emergency_contact": "Contact d'urgence",
        "visa_required_type": "Type de visa demandé",
        "entry_type": "Type d'entrée",
        "placeholder_select": "Sélectionner",
        "placeholder_country": "Sélectionnez un pays"
      },
      "group": {
        "title": "Ma Famille / Mon Groupe",
        "add_member": "Ajouter un membre",
        "group_id": "Référence du groupe",
        "members_count": "{{count}} membres",
        "primary_applicant": "Chef de groupe",
        "member": "Membre"
      }
    }
  },
  en: {
    translation: {
      "common": {
        "loading": "Loading...",
        "error": "An error occurred",
        "save": "Save",
        "cancel": "Cancel",
        "next": "Next",
        "previous": "Previous",
        "logout": "Logout"
      },
      "nav": {
        "home": "Home",
        "dashboard": "Dashboard",
        "apply": "Apply for Visa",
        "tracking": "Track Application",
        "profile": "Profile"
      },
      "dashboard": {
        "welcome": "Welcome, {{name}}",
        "recent_apps": "Recent Applications",
        "no_apps": "No applications found."
      },
      "form": {
        "title": "New Visa Application",
        "personal_info": "Personal Information",
        "passport_info": "Passport Information",
        "travel_info": "Travel Details",
        "documents": "Documents & Supporting Files",
        "full_name": "Full Name",
        "nationality": "Current Residence / Nationality",
        "birth_date": "Date of Birth",
        "passport_number": "Passport Number",
        "expiry_date": "Expiry Date",
        "arrival_date": "Intended Arrival Date",
        "stay_duration": "Duration of stay",
        "submit_application": "Submit Application",
        "step_indicator": "Step {{current}} of {{total}}",
        "gender": "Gender",
        "marital_status": "Marital Status",
        "profession": "Profession / Occupation",
        "emergency_contact": "Emergency Contact",
        "visa_required_type": "Requested Visa Type",
        "entry_type": "Entry Type",
        "placeholder_select": "Select",
        "placeholder_country": "Select a country"
      },
      "group": {
        "title": "My Family / My Group",
        "add_member": "Add a member",
        "group_id": "Group Reference",
        "members_count": "{{count}} members",
        "primary_applicant": "Group Leader",
        "member": "Member"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
