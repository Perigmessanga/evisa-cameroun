import { Link } from 'react-router-dom';
import CameroonFlag from '../../components/common/CameroonFlag';
import Footer from '../../components/layout/Footer';
import { Shield, ChevronRight, BookOpen, Globe, Server, AlertTriangle, Info, Mail } from 'lucide-react';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
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

export default function MentionsLegalesPage() {
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
            <span className="font-bold text-cm-text">Mentions Légales</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-cm-dark text-white py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 geo-pattern opacity-10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-cm-gold text-sm font-bold bg-cm-gold/10 border border-cm-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Shield size={14} />
            Document officiel
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold mb-4 leading-tight">Mentions Légales</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Informations légales relatives à la plateforme e-Visa Cameroun, conformément à la législation camerounaise en vigueur.
          </p>
          <p className="text-white/40 text-sm mt-4">Dernière mise à jour : 1<sup>er</sup> janvier 2026</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 lg:py-16 space-y-6">

        <Section icon={Info} title="1. Éditeur de la plateforme">
          <p>
            La plateforme <strong className="text-cm-text">e-Visa Cameroun</strong> est éditée et administrée par le <strong className="text-cm-text">Ministère des Relations Extérieures de la République du Cameroun (MINREX)</strong>, agissant conjointement avec la <strong className="text-cm-text">Direction Générale de la Sûreté Nationale (DGSN)</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-cm-muted">
            <li><strong className="text-cm-text">Raison sociale :</strong> République du Cameroun – MINREX</li>
            <li><strong className="text-cm-text">Siège :</strong> Quartier Administratif, Yaoundé, Cameroun</li>
            <li><strong className="text-cm-text">Email officiel :</strong> messangaperig3@gmail.com</li>
            <li><strong className="text-cm-text">Téléphone :</strong> +237 690 99 22 59</li>
          </ul>
        </Section>

        <Section icon={BookOpen} title="2. Objet de la plateforme">
          <p>
            La plateforme e-Visa Cameroun a pour vocation de permettre aux ressortissants étrangers d'obtenir un visa électronique d'entrée sur le territoire camerounais de façon dématérialisée, rapide et sécurisée.
          </p>
          <p>
            Ce service public numérique vise à moderniser le processus d'instruction des demandes de visas et à faciliter l'accueil des visiteurs, des investisseurs et des membres de la diaspora camerounaise.
          </p>
        </Section>

        <Section icon={Server} title="3. Hébergement">
          <p>
            La plateforme est hébergée sur des infrastructures cloud certifiées, accessibles en permanence, et bénéficiant d'un niveau de sécurité conforme aux normes internationales de protection des données gouvernementales.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-cm-text">Hébergeur applicatif :</strong> PythonAnywhere Ltd (UK) — pour le backend API</li>
            <li><strong className="text-cm-text">Hébergeur frontend :</strong> Vercel Inc. (USA) — pour l'interface utilisateur</li>
          </ul>
        </Section>

        <Section icon={Globe} title="4. Propriété intellectuelle">
          <p>
            L'ensemble des contenus présents sur cette plateforme (graphismes, textes, logos, structure, code source) sont la propriété exclusive de <strong className="text-cm-text">la République du Cameroun</strong> et sont protégés par les lois relatives à la propriété intellectuelle en vigueur au Cameroun et à l'international.
          </p>
          <p>
            Toute reproduction, représentation ou utilisation, même partielle, sans autorisation écrite préalable de l'éditeur est strictement interdite et constituerait une contrefaçon sanctionnée par la loi.
          </p>
        </Section>

        <Section icon={AlertTriangle} title="5. Limitation de responsabilité">
          <p>
            L'État camerounais s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur cette plateforme. Cependant, en cas de force majeure, de maintenance technique, ou d'une interruption du réseau, l'accessibilité du service ne peut être garantie en permanence.
          </p>
          <p>
            La plateforme décline toute responsabilité pour les dommages directs ou indirects découlant de l'utilisation du site ou de l'impossibilité temporaire d'y accéder.
          </p>
        </Section>

        <Section icon={Mail} title="6. Contact & réclamations">
          <p>
            Pour toute question juridique ou réclamation relative au contenu de cette plateforme, nous vous invitons à nous contacter :
          </p>
          <div className="mt-2 bg-cm-cream/70 rounded-xl p-4 border border-cm-border">
            <p className="font-bold text-cm-text">Direction Générale de la Sûreté Nationale (DGSN)</p>
            <p className="mt-1">Email : <a href="mailto:messangaperig3@gmail.com" className="text-cm-green-mid font-semibold hover:underline">messangaperig3@gmail.com</a></p>
            <p>Téléphone : <a href="tel:+237690992259" className="text-cm-green-mid font-semibold hover:underline">+237 690 99 22 59</a></p>
          </div>
        </Section>

        {/* Legal navigation */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/politique-confidentialite" className="flex items-center gap-2 text-sm font-bold text-cm-green-mid hover:underline">
            Politique de Confidentialité <ChevronRight size={14} />
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
