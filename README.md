deploy test







git add backend/scripts/populate\_master\_data.py

git commit -m "Ajout du script de population des types de visa et templates email"

git push origin charles





docker exec -it event\_api\_prod python manage.py shell -c "from apps.authentication.models import CustomUser; CustomUser.objects.create\_superuser(email='awards@gmail.com', password='AwardsPass123', username='admin', role='admin', is\_email\_verified=True)"



jai pu creer l'evenement ca saffiche bien dans le homepage mais lorsque





je souhaiterais les dossiers sauvegarder en brouillon doivent etre dans longlet brouillon et dans mes demandes aussi. losque l'utilisateur clique sur continuer depuis un brouillon ca doit lui renvoyer a letape 1 et deux avec ses donnees deja remplies pour verification avant d'arriver a l'etape ou il sest arrive avant de sauvegarder la demande en brouillon.

bonne chance pour l'implementation jattends un rendu vraiment impeccable 100% professionnel sans aucune erreur. merci et bonne chance pour l'implementation



Suivi des Entrées/Sorties et Notifications (Border Control Tracking \& Emails)

Ce document décrit le plan d'implémentation pour répondre aux exigences concernant le suivi des entrées/sorties et l'envoi de notifications par e-mail.



Modèles et Base de Données (Backend)

Nous allons étendre le modèle existant BorderCrossing au lieu de créer un nouveau modèle, pour lier les entrées aux sorties et calculer les durées de séjour :



\[MODIFY] backend/apps/evisa/models.py

Ajout de champs au modèle BorderCrossing :



expected\_exit\_date = models.DateField(null=True, blank=True) : La date prévue de sortie, calculée à l'entrée.

linked\_exit = models.OneToOneField('self', on\_delete=models.SET\_NULL, null=True, blank=True, related\_name='linked\_entry') : Lien vers le passage frontière de type "SORTIE" lié à l'entrée.

Une fois les modèles modifiés, je créerai et appliquerai les migrations (makemigrations et migrate).



Logique Métier et Endpoints (Backend)

\[MODIFY] backend/apps/evisa/views.py

Dans BorderCrossingViewSet.create() :



Si le type est ENTRY (Entrée) :



Calcul de expected\_exit\_date : date\_d\_entree + max\_stay\_days du type de visa.

Notification E-mail (Demandeur) : Envoi d'un e-mail de bienvenue au demandeur indiquant le nombre de jours octroyés, la date d'entrée, et la date limite de sortie.

Si le type est EXIT (Sortie) :



Recherche de la dernière entrée correspondante sans sortie (linked\_exit=None) et mise à jour de son champ linked\_exit.

Vérification du dépassement : Si la date\_de\_sortie > expected\_exit\_date.

Notification E-mail (Administrateur) : Si dépassement avéré, envoi d'un e-mail d'alerte aux administrateurs avec les détails du demandeur.

\[NEW] Endpoint GET /api/border-crossings/tracking/

Dans BorderCrossingViewSet, ajout de l'action tracking accessible uniquement aux Administrateurs.



Filtre les éléments par crossing\_type='ENTRY'.

Calcule le statut en temps réel : EN\_COURS (dans le délai), SORTI (sortie enregistrée), ou DEPASSE (date actuelle > date limite de sortie et pas encore sorti).

Renvoie toutes les informations nécessaires à l'interface d'administration.

Notifications Récurrentes (Backend)

\[NEW] backend/apps/notifications/management/commands/send\_stay\_reminders.py

Création d'une commande Django (python manage.py send\_stay\_reminders) qui pourra être exécutée automatiquement (par exemple via CRON chaque jour) :



Elle parcourt les entrées (ENTRY) en cours (linked\_exit=None).

Si expected\_exit\_date est dans exactement 7 jours, elle envoie le message de rappel d'une semaine au demandeur.

Interface Utilisateur (Frontend)

\[NEW] frontend/src/pages/admin/AdminBorderTrackingPage.tsx

Création d'une nouvelle page de type DataTable qui listera toutes les entrées traitées aux frontières sous forme de "Séjours".



Affichage des colonnes : Nom et prénom, Type de visa, Date d'entrée, Date de départ prévue, Date de sortie réelle, et Statut.

Mise en évidence visuelle (Avertissement/Rouge) pour les demandeurs dont le statut est DEPASSE.

\[MODIFY] frontend/src/App.tsx

Ajout de la route /admin/border-tracking liée à AdminBorderTrackingPage.

\[MODIFY] frontend/src/components/layout/DashboardLayout.tsx

Ajout du lien de navigation dans la sidebar de l'Administrateur : Suivi Entrées/Sorties pointant vers /admin/border-tracking.

IMPORTANT



Avertissement concernant les E-mails : Le système tentera d'envoyer de vrais e-mails. Étant en environnement de développement, l'application est probablement configurée pour afficher les e-mails dans la console du backend (EMAIL\_BACKEND = 'django.core.mail.backends.console.EmailBackend'). En production, de véritables e-mails seront envoyés.



Questions Ouvertes

Pouvons-nous procéder avec la configuration d'e-mail par défaut du serveur de développement (qui écrit les mails dans le terminal) pour que vous puissiez tester les messages sans utiliser un vrai compte SMTP dans l'immédiat ?

Ce plan vous convient-il ?





Walkthrough : Suivi des Entrées/Sorties et Notifications

L'implémentation du système de suivi des frontières et des notifications est maintenant terminée ! Voici un résumé de ce qui a été accompli et comment l'utiliser.



Ce qui a été réalisé

Mise à jour du Modèle de Données (Backend) :



Le modèle BorderCrossing contient désormais deux nouveaux champs : expected\_exit\_date (Date de sortie prévue) et linked\_exit (Lien vers la sortie correspondante).

Les migrations de base de données ont été générées et appliquées avec succès.

Logique Métier et E-mails (Backend) :



L'API d'enregistrement des passages (utilisée par les agents frontières) gère maintenant la logique suivante :

Lors d'une ENTRÉE : Le système calcule automatiquement la date limite de sortie en fonction de la durée maximale (max\_stay\_days) autorisée par le type de visa de l'applicant.

E-mail de Bienvenue : Dès l'entrée inscrite, un e-mail est envoyé au demandeur avec le nombre de jours exacts, la date de l'entrée et la date à laquelle il est censé quitter le territoire.

Lors d'une SORTIE : Le système lie cette sortie à la dernière entrée non close. Si la date de sortie est supérieure à la date limite autorisée, le système détecte le dépassement de séjour.

E-mail d'Alerte : En cas de dépassement avéré enregistré lors de la sortie, un e-mail est expédié automatiquement aux administrateurs les prévenant de l'incident avec les informations du fautif.

Tâche Périodique (Rappels de Sortie) :



Une commande spéciale a été développée : python manage.py send\_stay\_reminders.

Cette commande inspecte les entrées en cours. Si un demandeur est à exactement 7 jours de sa date limite de sortie, il recevra automatiquement un e-mail de rappel de la part de l'immigration.

Interface d'Administration (Frontend) :



Un nouvel onglet "Suivi Entrées/Sorties" figure désormais dans le menu de gauche des Administrateurs.

Il redirige vers une nouvelle page dédiée (/admin/border-tracking) exposant de façon claire chaque voyageur : Nom, Visa, Dates de mouvements et Statistiques.

La vue signale nettement le STATUT actuel du flux : En cours, Sorti, Dépassé (Avertissement critique en rouge clignotant), et Sorti (Dépassement).

NOTE



Pour tester la réception des emails dès l'enregistrement d'une entrée/sortie, vérifiez directement la console d'exécution du backend (si EMAIL\_BACKEND est configuré sur console) ou votre boîte de réception selon la configuration SMTP de Django actuellement active dans votre fichier .env.



TIP



Pour planifier les rappels de fin de séjour automatiques (1 semaine avant la limite), intégrez simplement la commande python manage.py send\_stay\_reminders dans un utilitaire de tâches CRON sur votre serveur distant (à l'avenir) pour qu'elle s'exécute chaque minuit.



Prochaines Étapes

Le développement de cette fonctionnalité demandée est 100% achevé. Si vous remarquez quoi que ce soit d'autre à corriger ou désirez un nouvel ajout, faites-le moi savoir !

