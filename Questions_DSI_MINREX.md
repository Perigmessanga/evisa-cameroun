# Questionnaire d'Interview destiné à la DSI du MINREX
**Objectif :** Recueillir des données sur le fonctionnement, l'architecture et les limites de la plateforme d'e-Visa camerounaise actuelle afin de justifier scientifiquement et d'orienter les améliorations apportées par notre projet de mémoire.

---

## 🏗️ 1. Architecture, Interopérabilité et Flux d'Information

* **Question 1 :** Quelle est l'architecture globale (Backend/Frontend/Base de données) de la plateforme e-visa existante et comment s'effectue la synchronisation des données en temps réel entre les serveurs centraux du MINREX à Yaoundé et les consulats/ambassades à l'étranger ?
* **Question 2 :** Comment la plateforme e-Visa du MINREX est-elle interconnectée avec les systèmes d’identification de la Délégation Générale à la Sûreté Nationale (DGSN) ? Existe-t-il une API d'échange de données en temps réel ?
* **Question 3 :** Comment le système gère-t-il les pics de charge (lors des grands événements nationaux ou saisons touristiques hautes) et quelle est la politique de redondance ou de haute disponibilité en cas de panne serveur ?

## 🔒 2. Sécurité de la Plateforme et Contrôle d'Accès

* **Question 4 :** Face aux cybermenaces visant les données d'identité nationale, quels protocoles de sécurité sont mis en œuvre pour protéger l'accès des agents consulaires et des administrateurs (ex: double authentification 2FA, restriction IP, jetons physiques) ?
* **Question 5 :** Comment sont tracées et auditées les actions critiques effectuées par les agents (approbation, rejet ou modification d'une demande) ? Disposez-vous d'un système d'Audit Log infalsifiable pour lutter contre la corruption ou la fraude interne ?
* **Question 6 :** Où et comment sont stockées les pièces justificatives sensibles (scans de passeports, documents de voyage) soumises par les demandeurs, et comment est garantie leur confidentialité ?

## 👁️ 3. Biométrie et Gestion de l'Identité

* **Question 7 :** Actuellement, comment s'effectue le contrôle biométrique des demandeurs ? Les empreintes digitales et la photo faciale sont-elles capturées uniquement aux postes frontières physiques (aéroports) ou y a-t-il un pré-enrôlement ou contrôle numérique à la soumission en ligne ?
* **Question 8 :** Disposez-vous d'algorithmes d'intelligence artificielle ou de reconnaissance faciale pour vérifier automatiquement la conformité des photos d'identité soumises en ligne par rapport aux normes OACI (Organisation de l'Aviation Civile Internationale) ?

## 🛂 4. Suivi aux Frontières et Contrôle des Séjours (Border Control)

* **Question 9 :** Comment le système effectue-t-il la liaison en temps réel entre l'arrivée (Entrée) et le départ (Sortie) d'un voyageur pour comptabiliser automatiquement les jours de séjour consommés ?
* **Question 10 :** Existe-t-il un mécanisme automatique d'alerte (par mail ou SMS) pour prévenir le voyageur que son séjour arrive à expiration (par exemple à J-7), ou pour notifier automatiquement les administrateurs et la DGSN en cas de dépassement constaté aux frontières ?
* **Question 11 :** Lors des contrôles de police aux aéroports, comment les agents frontaliers gèrent-ils la vérification des e-visas en cas de coupure réseau ou d'indisponibilité temporaire d'Internet ? Existe-t-il un mode hors-ligne sécurisé ?

## 🎫 5. Authentification des Visas par les Partenaires Tiers

* **Question 12 :** Comment les compagnies aériennes internationales (ex: Air France, Brussels Airlines, Ethiopian Airlines) ou les établissements hôteliers vérifient-ils l'authenticité d'un e-Visa camerounais présenté par un voyageur au départ ou à l'arrivée ?
* **Question 13 :** Quel est le mécanisme cryptographique mis en place pour empêcher qu'un voyageur malveillant ne modifie les informations écrites sur son e-Visa PDF (nom, dates de validité) ? Existe-t-il un portail de vérification public par signature électronique ?

## 👥 6. Expérience Utilisateur (UX) et Fonctionnalités Métiers

* **Question 14 :** Comment la plateforme actuelle gère-t-elle les demandes groupées (familles, délégations sportives, groupes de touristes) ? Le demandeur principal doit-il créer des comptes individuels pour chaque membre (y compris les enfants en bas âge) ou existe-t-il une référence de groupe commune ?
* **Question 15 :** Les demandeurs peuvent-ils commencer une demande, la sauvegarder en brouillon et la reprendre ultérieurement sans perdre leurs données ? Si oui, comment gérez-vous la validation progressive pour éviter la saisie d'informations incohérentes ?

---

## 🎯 Intérêt de ces questions pour ton projet :
En posant ces questions, tu montres que tu as identifié les **limites réelles** des systèmes étatiques actuels. Ta plateforme y répond point par point en proposant :
1. **La double authentification (2FA/TOTP)** et **l'Audit Log** pour la sécurité (Q4, Q5).
2. Le **suivi automatique des séjours (Border Control)** avec alertes d'infractions et rappels automatiques par mail (Q9, Q10).
3. Le **portail de vérification public par QR Code signé cryptographiquement** pour les compagnies aériennes (Q12, Q13).
4. Le support des **demandes groupées** (`group_reference`) et la validation de formulaire progressive en temps réel (Q14, Q15).
5. La **Progressive Web App (PWA)** avec service worker pour le support hors-ligne (Q11).
