import { Link } from 'react-router-dom';
import CameroonFlag from '../../components/common/CameroonFlag';
import Footer from '../../components/layout/Footer';
import {
  Lock, ChevronRight, Eye, Database, Share2,
  Cookie, UserCheck, RefreshCw, Mail, ShieldCheck
} from 'lucide-react';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="border border-cm-border rounded-2xl overflow-hidden">
    <div className="flex items-center gap-3 bg-cm-cream/60 px-6 py-4 border-b border-cm-border">
      <div className="w-9 h-9 rounded-xl bg-cm-green/10 flex items-center justify-center text-cm-green shrink-0">
        <Icon size={18} />
      </div>
      <h2 className="font-display font-bold text-cm-text text-base lg:text-lg">{title}</h2>
    </div>
    <div className="px-6 py-5 text-sm text-cm-muted leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-cm-cream flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-cm-border py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <CameroonFlag size={36} />
            <div>
              <div className="font-display font-bold text-cm-text text-xl leading-tight">e-Visa Cameroun</div>
              <div className="text-[0.65rem] font-bold tracking-widest text-cm-green">MINREX</div>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-sm text-cm-muted">
            <Link to="/" className="hover:text-cm-green-mid font-semibold hidden sm:block transition-colors">Accueil</Link>
            <ChevronRight size={14} className="text-cm-border hidden sm:block" />
            <span className="font-bold text-cm-text">Politique de Confidentialité</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-cm-dark text-white py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 geo-pattern opacity-10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-cm-gold text-sm font-bold bg-cm-gold/10 border border-cm-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Lock size={14} />
            Document officiel
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Découvrez comment le Gouvernement camerounais collecte, traite et protège vos données personnelles dans le cadre de vos démarches de demande d'e-visa.
          </p>
          <p className="text-white/40 text-sm mt-4">Dernière mise à jour : 1<sup>er</sup> janvier 2026</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 lg:py-16 space-y-6">

        {/* Intro card */}
        <div className="bg-cm-green/5 border border-cm-green/20 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-cm-green/10 text-cm-green flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-bold text-cm-text mb-1">Votre vie privée est notre priorité</p>
            <p className="text-sm text-cm-muted leading-relaxed">
              La plateforme e-Visa Cameroun traite vos données personnelles uniquement dans le cadre strict de l'instruction de votre demande de visa électronique. Nous n'utilisons jamais vos informations à des fins commerciales ou publicitaires.
            </p>
          </div>
        </div>

        <Section icon={Eye} title="1. Identité du responsable de traitement">
          <p>
            Le responsable du traitement de vos données personnelles est le <strong className="text-cm-text">Ministère des Relations Extérieures de la République du Cameroun (MINREX)</strong>, agissant conjointement avec la <strong className="text-cm-text">Direction Générale de la Sûreté Nationale (DGSN)</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-cm-text">Adresse :</strong> Quartier Administratif, Yaoundé, Cameroun</li>
            <li><strong className="text-cm-text">Email DPO :</strong> messangaperig3@gmail.com</li>
            <li><strong className="text-cm-text">Téléphone :</strong> +237 690 99 22 59</li>
          </ul>
        </Section>

        <Section icon={Database} title="2. Données collectées">
          <p>Dans le cadre de votre demande d'e-visa, nous collectons les catégories de données suivantes :</p>
          <div className="space-y-3 mt-2">
            <div className="bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
              <p className="font-bold text-cm-text text-xs uppercase tracking-widest mb-2">Données d'identité</p>
              <p>Nom complet, date et lieu de naissance, nationalité, numéro de passeport, photographie d'identité, données biométriques partielles.</p>
            </div>
            <div className="bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
              <p className="font-bold text-cm-text text-xs uppercase tracking-widest mb-2">Données de contact</p>
              <p>Adresse email, numéro de téléphone, adresse postale du domicile et, le cas échéant, de l'hébergement au Cameroun.</p>
            </div>
            <div className="bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
              <p className="font-bold text-cm-text text-xs uppercase tracking-widest mb-2">Données relatives au voyage</p>
              <p>Pays de résidence actuelle, motif du voyage, durée et dates de séjour envisagés, type de visa sollicité, moyens de transport prévus.</p>
            </div>
            <div className="bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
              <p className="font-bold text-cm-text text-xs uppercase tracking-widest mb-2">Données de paiement</p>
              <p>Référence de transaction électronique (aucune donnée bancaire brute n'est stockée sur nos serveurs ; le paiement est géré par un prestataire certifié PCI-DSS).</p>
            </div>
            <div className="bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
              <p className="font-bold text-cm-text text-xs uppercase tracking-widest mb-2">Données de navigation</p>
              <p>Adresse IP, type de navigateur, pages visitées, durée de session (collectées à des fins de sécurité et d'amélioration du service).</p>
            </div>
          </div>
        </Section>

        <Section icon={UserCheck} title="3. Finalités et base légale du traitement">
          <p>Vos données sont traitées sur la base légale de l'exécution d'une mission de service public. Les finalités sont les suivantes :</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Instruction et validation de votre demande d'e-visa</li>
            <li>Vérification de l'identité et prévention de la fraude documentaire</li>
            <li>Transmission aux services consulaires et aux postes de frontière concernés</li>
            <li>Gestion des paiements de droits de visa</li>
            <li>Communication relative à l'état d'avancement de votre dossier</li>
            <li>Suivi des entrées et sorties du territoire national (obligation légale)</li>
            <li>Amélioration des services numériques proposés par l'État</li>
          </ul>
        </Section>

        <Section icon={Share2} title="4. Destinataires des données">
          <p>Vos données personnelles peuvent être communiquées, dans le strict cadre légal, aux entités suivantes :</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong className="text-cm-text">Direction de la Police aux Frontières (DIRCAM)</strong> — pour les contrôles à l'entrée du territoire</li>
            <li><strong className="text-cm-text">Ambassades et consulats camerounais</strong> — pour les dossiers traités localement</li>
            <li><strong className="text-cm-text">Ministère de l'Intérieur</strong> — dans le cadre des dispositions de sécurité nationale</li>
            <li><strong className="text-cm-text">Prestataires techniques certifiés</strong> — hébergement sécurisé des données, sous accord de confidentialité strict</li>
          </ul>
          <p className="mt-3">Vos données ne sont en aucun cas vendues, louées ou cédées à des tiers à des fins commerciales.</p>
        </Section>

        <Section icon={RefreshCw} title="5. Durée de conservation">
          <p>Vos données sont conservées pour les durées suivantes :</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-cm-text">Dossiers de visa accordé :</strong> 5 ans à compter de la date d'expiration du visa</li>
            <li><strong className="text-cm-text">Dossiers de visa refusé :</strong> 3 ans à compter de la date de refus</li>
            <li><strong className="text-cm-text">Données de connexion et journaux de sécurité :</strong> 12 mois</li>
            <li><strong className="text-cm-text">Données de paiement :</strong> Conformément aux obligations fiscales légales (10 ans)</li>
          </ul>
          <p className="mt-3">À l'issue de ces délais, vos données sont supprimées ou anonymisées de façon irréversible.</p>
        </Section>

        <Section icon={Cookie} title="6. Cookies et traceurs">
          <p>La plateforme utilise des cookies strictement nécessaires à son fonctionnement (gestion de session, sécurité CSRF) ainsi que des cookies d'analyse anonymisés. Aucun cookie publicitaire ou de profilage commercial n'est utilisé.</p>
          <p>Vous pouvez à tout moment gérer vos préférences de cookies via les paramètres de votre navigateur.</p>
        </Section>

        <Section icon={Lock} title="7. Sécurité des données">
          <p>La plateforme e-Visa Cameroun met en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données :</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Chiffrement des communications par protocole TLS 1.3 (HTTPS)</li>
            <li>Hachage sécurisé des mots de passe (algorithme bcrypt)</li>
            <li>Contrôle d'accès strict par rôles et permissions</li>
            <li>Journalisation de tous les accès et modifications de données</li>
            <li>Audits de sécurité réguliers</li>
            <li>Sauvegardes chiffrées effectuées quotidiennement</li>
          </ul>
        </Section>

        <Section icon={UserCheck} title="8. Vos droits">
          <p>Vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-cm-text">Droit d'accès :</strong> obtenir une copie de vos données personnelles traitées</li>
            <li><strong className="text-cm-text">Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
            <li><strong className="text-cm-text">Droit à l'effacement :</strong> demander la suppression de vos données sous réserve des obligations légales</li>
            <li><strong className="text-cm-text">Droit à la limitation :</strong> restreindre le traitement de vos données dans certains cas</li>
            <li><strong className="text-cm-text">Droit d'opposition :</strong> vous opposer à certains traitements basés sur l'intérêt légitime</li>
          </ul>
          <p className="mt-3">Pour exercer ces droits, adressez votre demande à l'adresse email ci-dessous en joignant une copie de votre pièce d'identité.</p>
        </Section>

        <Section icon={Mail} title="9. Contact & réclamations">
          <p>Pour toute question relative à la protection de vos données personnelles :</p>
          <div className="mt-3 bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
            <p className="font-bold text-cm-text">Délégué à la Protection des Données (DPO) — MINREX</p>
            <p className="mt-1">Email : <a href="mailto:messangaperig3@gmail.com" className="text-cm-green-mid font-semibold hover:underline">messangaperig3@gmail.com</a></p>
            <p>Téléphone : <a href="tel:+237690992259" className="text-cm-green-mid font-semibold hover:underline">+237 690 99 22 59</a></p>
          </div>
        </Section>

        {/* Legal navigation */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/mentions-legales" className="flex items-center gap-2 text-sm font-bold text-cm-green-mid hover:underline">
            Mentions Légales <ChevronRight size={14} />
          </Link>
          <Link to="/conditions-generales" className="flex items-center gap-2 text-sm font-bold text-cm-green-mid hover:underline">
            CGU <ChevronRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
