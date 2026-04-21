import { Link } from 'react-router-dom';
import CameroonFlag from '../../components/common/CameroonFlag';
import Footer from '../../components/layout/Footer';
import {
  FileText, ChevronRight, UserCheck, ShieldAlert, CreditCard,
  Ban, Scale, RefreshCw, Globe, Mail
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

export default function ConditionsGeneralesPage() {
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
            <span className="font-bold text-cm-text">Conditions Générales d'Utilisation</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-cm-dark text-white py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 geo-pattern opacity-10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-cm-gold text-sm font-bold bg-cm-gold/10 border border-cm-gold/20 rounded-full px-4 py-1.5 mb-5">
            <FileText size={14} />
            Document officiel
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme e-Visa Cameroun. Toute utilisation du service vaut acceptation des présentes conditions.
          </p>
          <p className="text-white/40 text-sm mt-4">Dernière mise à jour : 1<sup>er</sup> janvier 2026</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 lg:py-16 space-y-6">

        {/* Important notice */}
        <div className="bg-cm-gold/5 border border-cm-gold/20 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-cm-gold/10 text-cm-gold flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="font-bold text-cm-text mb-1">Lisez attentivement ces conditions</p>
            <p className="text-sm text-cm-muted leading-relaxed">
              L'utilisation de la plateforme e-Visa Cameroun implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, nous vous prions de ne pas utiliser ce service. L'État camerounais se réserve le droit de modifier ces CGU à tout moment.
            </p>
          </div>
        </div>

        <Section icon={FileText} title="1. Objet et champ d'application">
          <p>
            Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités et conditions d'utilisation de la plateforme <strong className="text-cm-text">e-Visa Cameroun</strong>, service public numérique édité par le <strong className="text-cm-text">Ministère des Relations Extérieures (MINREX)</strong> de la République du Cameroun, en collaboration avec la <strong className="text-cm-text">Direction Générale de la Sûreté Nationale (DGSN)</strong>.
          </p>
          <p>
            Ces conditions s'appliquent à toute personne physique (ci-après dénommée «&nbsp;l'Utilisateur&nbsp;») accédant à la plateforme en vue d'effectuer une demande de visa électronique d'entrée sur le territoire camerounais.
          </p>
        </Section>

        <Section icon={Globe} title="2. Accès au service">
          <p>L'accès à la plateforme e-Visa Cameroun est ouvert à tout ressortissant étranger souhaitant effectuer une demande de visa d'entrée au Cameroun, sous réserve que sa nationalité soit éligible au dispositif d'e-visa.</p>
          <p>Pour utiliser les fonctionnalités complètes de la plateforme, l'Utilisateur doit :</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Créer un compte personnel avec une adresse email valide</li>
            <li>Fournir des informations exactes, complètes et à jour</li>
            <li>Disposer d'un passeport en cours de validité</li>
            <li>Disposer d'un moyen de paiement électronique accepté par la plateforme</li>
          </ul>
          <p className="mt-2">L'État camerounais se réserve le droit de suspendre ou de restreindre l'accès à la plateforme à tout moment, notamment pour des raisons de maintenance, de sécurité ou de force majeure, sans que cela ne puisse engager sa responsabilité.</p>
        </Section>

        <Section icon={UserCheck} title="3. Obligations de l'utilisateur">
          <p>En utilisant la plateforme e-Visa Cameroun, l'Utilisateur s'engage à :</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Fournir des informations exactes, sincères et complètes lors de la création de son compte et lors de chaque demande de visa</li>
            <li>Ne pas usurper l'identité d'une tierce personne ni soumettre des documents falsifiés ou altérés</li>
            <li>Maintenir la confidentialité de ses identifiants de connexion et ne pas les partager avec des tiers</li>
            <li>Ne pas tenter de contourner les mécanismes de sécurité de la plateforme</li>
            <li>Ne pas utiliser de moyens automatisés (bots, scrapers) pour accéder au service sans autorisation préalable</li>
            <li>Respecter la législation camerounaise et internationale applicable</li>
            <li>Informer immédiatement l'administration en cas de perte ou de compromission de ses identifiants</li>
          </ul>
          <p className="mt-3 font-semibold text-cm-text">Toute déclaration mensongère ou dépôt de faux documents constitue une infraction pénale susceptible d'entraîner des poursuites judiciaires conformément au Code pénal camerounais.</p>
        </Section>

        <Section icon={CreditCard} title="4. Procédure de demande et paiement">
          <p>La procédure de demande d'e-visa se déroule selon les étapes suivantes :</p>
          <ol className="list-decimal list-inside space-y-2 mt-2">
            <li>Création d'un compte Utilisateur sur la plateforme</li>
            <li>Renseignement des informations personnelles et du voyage</li>
            <li>Téléversement des documents requis (passeport, photo d'identité, justificatifs selon le type de visa)</li>
            <li>Enregistrement des données biométriques si applicable</li>
            <li>Revue et soumission du dossier complet</li>
            <li>Paiement des droits de visa par voie électronique</li>
            <li>Instruction du dossier par les services compétents</li>
            <li>Notification de la décision et téléchargement du visa électronique</li>
          </ol>
          <div className="mt-4 bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
            <p className="font-bold text-cm-text mb-1">Politique de remboursement</p>
            <p>Les droits de visa versés ne sont pas remboursables en cas de refus de visa ou de retrait volontaire de la demande après paiement effectif, sauf décision contraire de l'autorité compétente. En cas d'erreur technique imputable à la plateforme, un remboursement sera étudié au cas par cas.</p>
          </div>
        </Section>

        <Section icon={Ban} title="5. Comportements prohibés">
          <p>Sont strictement interdits sur la plateforme e-Visa Cameroun :</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>La soumission de documents d'identité falsifiés, altérés ou appartenant à autrui</li>
            <li>Toute tentative d'accès non autorisé aux systèmes informatiques de l'État</li>
            <li>L'utilisation de la plateforme à des fins de blanchiment de capitaux ou de financement du terrorisme</li>
            <li>Le contournement des contrôles de sécurité mis en place</li>
            <li>La revente ou la commercialisation des accès à la plateforme</li>
            <li>La soumission de demandes multiples frauduleuses pour un même demandeur</li>
            <li>Tout acte de nature à porter atteinte à la sécurité nationale du Cameroun</li>
          </ul>
          <p className="mt-3">Toute violation de ces interdictions peut entraîner, sans préavis, la suspension immédiate du compte, l'annulation de la demande de visa, le signalement aux autorités compétentes et des poursuites judiciaires.</p>
        </Section>

        <Section icon={Scale} title="6. Responsabilité de la plateforme">
          <p>L'État camerounais, à travers la plateforme e-Visa Cameroun, s'engage à :</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Traiter les demandes de visa dans des délais raisonnables</li>
            <li>Assurer la sécurité des données personnelles transmises</li>
            <li>Notifier l'Utilisateur de toute décision relative à sa demande</li>
            <li>Maintenir la disponibilité du service dans la mesure du possible</li>
          </ul>
          <p className="mt-3">L'État camerounais ne saurait être tenu responsable :</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Des interruptions ou indisponibilités du service liées à des causes de force majeure</li>
            <li>Des dommages liés à un usage inapproprié de la plateforme par l'Utilisateur</li>
            <li>Des conséquences d'une décision de refus de visa, qui relève du pouvoir discrétionnaire de l'autorité compétente</li>
            <li>Des dysfonctionnements liés aux équipements ou à la connexion Internet de l'Utilisateur</li>
          </ul>
        </Section>

        <Section icon={RefreshCw} title="7. Modification des CGU">
          <p>
            Le Gouvernement camerounais se réserve le droit de modifier les présentes CGU à tout moment, notamment pour s'adapter aux évolutions législatives, réglementaires ou technologiques.
          </p>
          <p>
            Les utilisateurs seront informés de toute modification substantielle par notification sur la plateforme ou par email. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.
          </p>
        </Section>

        <Section icon={Scale} title="8. Droit applicable et juridiction compétente">
          <p>
            Les présentes CGU sont soumises au droit camerounais. Tout litige relatif à l'interprétation ou à l'exécution des présentes conditions sera soumis à la juridiction compétente des tribunaux de <strong className="text-cm-text">Yaoundé, République du Cameroun</strong>.
          </p>
          <p>
            En cas de divergence entre la version française et une éventuelle traduction des présentes CGU, la version française prévaut.
          </p>
        </Section>

        <Section icon={Mail} title="9. Contact">
          <p>Pour toute question relative aux présentes CGU ou à l'utilisation de la plateforme :</p>
          <div className="mt-3 bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
            <p className="font-bold text-cm-text">Service Juridique — MINREX / DGSN</p>
            <p className="mt-1">Email : <a href="mailto:messangaperig3@gmail.com" className="text-cm-green-mid font-semibold hover:underline">messangaperig3@gmail.com</a></p>
            <p>Téléphone : <a href="tel:+237690992259" className="text-cm-green-mid font-semibold hover:underline">+237 690 99 22 59</a></p>
            <p>Adresse : Quartier Administratif, Yaoundé, Cameroun</p>
          </div>
        </Section>

        {/* Legal navigation */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/mentions-legales" className="flex items-center gap-2 text-sm font-bold text-cm-green-mid hover:underline">
            Mentions Légales <ChevronRight size={14} />
          </Link>
          <Link to="/politique-confidentialite" className="flex items-center gap-2 text-sm font-bold text-cm-green-mid hover:underline">
            Politique de Confidentialité <ChevronRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
