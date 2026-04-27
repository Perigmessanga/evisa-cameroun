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
      },
      "roles": {
        "admin": "ESPACE ADMIN",
        "agent": "ESPACE AGENT",
        "embassy": "ESPACE AMBASSADE",
        "border": "ESPACE FRONTIÈRE",
        "applicant": "ESPACE DEMANDEUR"
      },
      "nav_admin": {
        "supervisor": "Superviseur",
        "users": "Utilisateurs",
        "visa_types": "Types de visa",
        "logs": "Logs Système",
        "email_templates": "Email Templates",
        "messages": "Messages",
        "border_tracking": "Suivi Entrées/Sorties",
        "settings": "Configuration",
        "watchlist": "Vigilance (Watchlist)"
      },
      "nav_agent": {
        "dashboard": "Tableau de bord",
        "applications": "Dossiers",
        "pending_docs": "Compléments",
        "payments": "Paiements"
      },
      "nav_border": {
        "dashboard": "Poste Frontière",
        "verification": "Scan & Vérification",
        "history": "Historique",
        "alerts": "Alertes"
      },
      "badges": {
        "new": "NOUVEAU",
        "security": "SÉCURITÉ"
      },
      "border_tracking": {
        "title": "Suivi des Entrées/Sorties",
        "subtitle": "Gestion et surveillance des séjours des voyageurs sur le territoire.",
        "overstay_alert": "{{count}} voyageur(s) en dépassement de séjour",
        "search_placeholder": "Rechercher par nom ou numéro de visa...",
        "filters": {
          "all": "Tous les statuts",
          "in_progress": "En cours",
          "exited": "Sortis",
          "overstay": "Dépassement (Actif)",
          "exited_overstay": "Sortis (Dépassement)",
          "refused": "Refus d'entrée"
        },
        "refresh": "Actualiser",
        "columns": {
          "traveler": "Voyageur",
          "visa": "Visa",
          "movements": "Mouvements",
          "dates": "Dates Clés",
          "status": "Statut"
        },
        "traveler_subtitle": "Voyageur e-Visa",
        "expected_exit": "Sortie prévue :",
        "no_data": "Aucun mouvement frontalier trouvé"
      },
      "agent_dashboard": {
        "title": "Tableau de Bord Agent",
        "title_embassy": "Ambassade : {{country}}",
        "role_agent": "Agent d'immigration",
        "role_embassy": "Représentation Diplomatique",
        "stats": {
          "processing": "En cours",
          "today": "Aujourd'hui",
          "total_pending": "À Traiter (Total)",
          "in_processing": "En Traitement",
          "approved": "Approuvées",
          "rejected": "Rejetées"
        },
        "recent_apps": "Demandes Récentes",
        "view_all": "Voir tout",
        "table": {
          "file": "Dossier",
          "applicant": "Demandeur",
          "type_date": "Type / Date",
          "status": "Statut",
          "action": "Action",
          "examine": "Examiner",
          "no_data": "Aucune demande récente à afficher."
        },
        "activity": {
          "title": "Activité Récente",
          "coming_soon": "Bientôt disponible : Historique en temps réel."
        },
        "alert": {
          "title": "Mise à jour requise",
          "message": "Les directives d'approbation pour les visas touristes en provenance d'Europe ont été mises à jour. Veuillez consulter la documentation interne."
        },
        "badges": {
          "approved": "Approuvé",
          "new": "Nouveau",
          "processing": "En cours",
          "rejected": "Rejeté",
          "docs_required": "Documents requis",
          "review_required": "Avis consulaire"
        }
      },
      "admin_dashboard": {
        "title": "Console Administration",
        "role": "Super Administrateur E-Visa",
        "stats": {
          "active_users": "Utilisateurs Actifs",
          "active_users_desc": "Sur {{count}} inscrits",
          "total_visas": "Visas Traités (Total)",
          "total_visas_desc": "Depuis le lancement",
          "revenue": "Recettes Est. (FCFA)",
          "revenue_desc": "Année en cours",
          "health": "Santé du Système",
          "health_desc": "Toutes les APIs OK"
        },
        "actions": {
          "title": "Administration Rapide",
          "users": "Gestion Utilisateurs",
          "users_desc": "Gérez les accès, rôles (Agents, Ambassades) et désactivez les comptes frauduleux.",
          "visa_types": "Types de Visas",
          "visa_types_desc": "Ajoutez, modifiez les tarifs sociaux et conditions des documents requis.",
          "settings": "Paramètres Système",
          "settings_desc": "Configuration des serveurs SMTP, clés API de paiement, et maintenance.",
          "reports": "Rapports & Stats",
          "reports_desc": "Générez des rapports d'activité détaillés sur l'immigration."
        },
        "logs": {
          "title": "Journal Système",
          "view_all": "Voir tout",
          "success": "Succès",
          "warning": "Alerte",
          "error": "Erreur",
          "no_logs": "Aucun journal récent.",
          "system": "Système"
        }
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
      },
      "roles": {
        "admin": "ADMIN AREA",
        "agent": "AGENT AREA",
        "embassy": "EMBASSY AREA",
        "border": "BORDER AREA",
        "applicant": "APPLICANT AREA"
      },
      "nav_admin": {
        "supervisor": "Supervisor",
        "users": "Users",
        "visa_types": "Visa Types",
        "logs": "System Logs",
        "email_templates": "Email Templates",
        "messages": "Messages",
        "border_tracking": "Entry/Exit Tracking",
        "settings": "Settings",
        "watchlist": "Watchlist (Security)"
      },
      "nav_agent": {
        "dashboard": "Dashboard",
        "applications": "Applications",
        "pending_docs": "Pending Docs",
        "payments": "Payments"
      },
      "nav_border": {
        "dashboard": "Border Checkpoint",
        "verification": "Scan & Verification",
        "history": "History",
        "alerts": "Alerts"
      },
      "badges": {
        "new": "NEW",
        "security": "SECURITY"
      },
      "border_tracking": {
        "title": "Entry/Exit Tracking",
        "subtitle": "Management and monitoring of traveler stays in the territory.",
        "overstay_alert": "{{count}} traveler(s) overstaying",
        "search_placeholder": "Search by name or visa number...",
        "filters": {
          "all": "All statuses",
          "in_progress": "In Progress",
          "exited": "Exited",
          "overstay": "Overstay (Active)",
          "exited_overstay": "Exited (Overstay)",
          "refused": "Entry Refused"
        },
        "refresh": "Refresh",
        "columns": {
          "traveler": "Traveler",
          "visa": "Visa",
          "movements": "Movements",
          "dates": "Key Dates",
          "status": "Status"
        },
        "traveler_subtitle": "e-Visa Traveler",
        "expected_exit": "Expected exit:",
        "no_data": "No border movements found"
      },
      "agent_dashboard": {
        "title": "Agent Dashboard",
        "title_embassy": "Embassy: {{country}}",
        "role_agent": "Immigration Agent",
        "role_embassy": "Diplomatic Representation",
        "stats": {
          "processing": "Processing",
          "today": "Today",
          "total_pending": "Pending (Total)",
          "in_processing": "In Processing",
          "approved": "Approved",
          "rejected": "Rejected"
        },
        "recent_apps": "Recent Applications",
        "view_all": "View all",
        "table": {
          "file": "File",
          "applicant": "Applicant",
          "type_date": "Type / Date",
          "status": "Status",
          "action": "Action",
          "examine": "Review",
          "no_data": "No recent applications to display."
        },
        "activity": {
          "title": "Recent Activity",
          "coming_soon": "Coming soon: Real-time history."
        },
        "alert": {
          "title": "Update Required",
          "message": "Approval guidelines for tourist visas from Europe have been updated. Please check internal documentation."
        },
        "badges": {
          "approved": "Approved",
          "new": "New",
          "processing": "Processing",
          "rejected": "Rejected",
          "docs_required": "Docs Required",
          "review_required": "Consular Review"
        }
      },
      "admin_dashboard": {
        "title": "Administration Console",
        "role": "Super E-Visa Administrator",
        "stats": {
          "active_users": "Active Users",
          "active_users_desc": "Out of {{count}} registered",
          "total_visas": "Processed Visas (Total)",
          "total_visas_desc": "Since launch",
          "revenue": "Est. Revenue (FCFA)",
          "revenue_desc": "Current year",
          "health": "System Health",
          "health_desc": "All APIs OK"
        },
        "actions": {
          "title": "Quick Administration",
          "users": "User Management",
          "users_desc": "Manage access, roles (Agents, Embassies) and disable fraudulent accounts.",
          "visa_types": "Visa Types",
          "visa_types_desc": "Add or modify social rates and required documents conditions.",
          "settings": "System Settings",
          "settings_desc": "Configuration for SMTP servers, payment API keys, and maintenance.",
          "reports": "Reports & Stats",
          "reports_desc": "Generate detailed immigration activity reports."
        },
        "logs": {
          "title": "System Log",
          "view_all": "View all",
          "success": "Success",
          "warning": "Warning",
          "error": "Error",
          "no_logs": "No recent logs.",
          "system": "System"
        }
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
