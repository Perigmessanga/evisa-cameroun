// ─────────────────────────────────────────────
//  pages/HomePage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CameroonFlag from '../components/common/CameroonFlag';
import {
  ShieldCheck, Clock, Globe, ArrowRight, CheckCircle2,
  ChevronDown, FileText, Smartphone, Fingerprint, MapPin, Menu, X
} from 'lucide-react';

const TRANSLATIONS = {
  fr: {
    nav: { home: 'Accueil', apply: 'Demander un Visa', tracking: 'Suivi', contact: 'Contact', login: 'Connexion' },
    hero: {
      badge: 'Plateforme Officielle - République du Cameroun',
      title1: 'Votre e-Visa pour le',
      title2: 'Cameroun',
      title3: 'en quelques clics',
      desc: 'Obtenez votre visa officiel rapidement, en toute sécurité et sans vous déplacer. Le processus est 100% en ligne pour vous permettre de voyager en toute sérénité.',
      btnApply: 'Commencer ma demande',
      btnTrack: 'Suivre mon dossier',
    },
    stats: { approved: 'Visas délivrés', time: 'Temps moyen (jours)', support: 'Support 24/7' },
    features: {
      title: 'Pourquoi utiliser la plateforme officielle ?',
      f1: { title: '100% Sécurisé', desc: 'Vos données personnelles et biométriques sont chiffrées selon les standards internationaux.' },
      f2: { title: 'Rapide & Simple', desc: 'Complétez votre demande en moins de 15 minutes. Recevez votre e-Visa directement par email.' },
      f3: { title: 'Paiement Universel', desc: 'Réglez vos frais par carte bancaire internationale, PayPal, ou via Mobile Money (MTN/Orange).' }
    },
    process: {
      title: 'Comment ça marche ?',
      steps: [
        { icon: <FileText size={24} />, title: '1. Remplissez le formulaire', desc: 'Fournissez vos informations personnelles et de voyage.' },
        { icon: <Smartphone size={24} />, title: '2. Scannez vos documents', desc: 'Téléchargez votre passeport et autres justificatifs requis.' },
        { icon: <Fingerprint size={24} />, title: '3. Payez les frais', desc: 'Réglez les frais de visa via notre plateforme sécurisée.' },
        { icon: <MapPin size={24} />, title: '4. Recevez votre e-Visa', desc: 'Votre e-Visa vous est envoyé par email après validation.' },
      ]
    },
    faq: {
      title: 'Questions fréquentes',
      q1: 'Qui a besoin d\'un e-Visa pour le Cameroun ?',
      a1: 'Tout ressortissant étranger souhaitant se rendre au Cameroun, à l\'exception des citoyens des pays exemptés par accord bilatéral ou régional.',
      q2: 'Combien de temps faut-il pour obtenir le visa ?',
      a2: 'Le délai de traitement standard est de 3 jours ouvrables. Un service express de 24h est également disponible selon le type de visa.',
      q3: 'Quels sont les documents obligatoires ?',
      a3: 'Vous aurez besoin d\'un passeport valide (au moins 6 mois), d\'une photo d\'identité récente, d\'un billet d\'avion aller-retour et d\'un justificatif d\'hébergement.',
      q4: 'Puis-je modifier ma demande après le paiement ?',
      a4: 'Non, une fois le paiement validé, aucune modification n\'est possible. Vérifiez attentivement vos informations avant la soumission.',
      q5: 'Comment vérifier le statut de mon e-Visa ?',
      a5: 'Utilisez la section "Suivi" avec votre numéro de dossier et votre adresse e-mail pour connaître l\'avancement en temps réel.'
    },
    visaTypes: {
      title: 'Types de visa disponibles',
      tourism: { title: 'Visa Tourisme', desc: 'Pour les visites touristiques et familiales.', price: '100 000 XAF', duration: 'Jusqu\'à 30 jours' },
      business: { title: 'Visa Affaires', desc: 'Pour les réunions, conférences et opportunités commerciales.', price: '150 000 XAF', duration: 'Jusqu\'à 6 mois' },
      transit: { title: 'Visa Transit', desc: 'Pour les escales de courte durée.', price: '50 000 XAF', duration: 'Jusqu\'à 5 jours' }
    },
    footer: { text: "République du Cameroun - Ministère des Relations Extérieures. Tous droits réservés." }
  },
  en: {
    nav: { home: 'Home', apply: 'Apply for Visa', tracking: 'Tracking', contact: 'Contact', login: 'Login' },
    hero: {
      badge: 'Official Platform - Republic of Cameroon',
      title1: 'Your e-Visa to',
      title2: 'Cameroon',
      title3: 'in just a few clicks',
      desc: 'Get your official visa quickly, securely, and without leaving your home. The process is 100% online so you can travel with peace of mind.',
      btnApply: 'Start my application',
      btnTrack: 'Track my file',
    },
    stats: { approved: 'Visas issued', time: 'Avg. processing (days)', support: '24/7 Support' },
    features: {
      title: 'Why use the official platform?',
      f1: { title: '100% Secure', desc: 'Your personal and biometric data are encrypted according to international standards.' },
      f2: { title: 'Fast & Simple', desc: 'Complete your application in less than 15 minutes. Receive your e-Visa directly by email.' },
      f3: { title: 'Universal Payment', desc: 'Pay your fees via international credit card, PayPal, or Mobile Money (MTN/Orange).' }
    },
    process: {
      title: 'How it works?',
      steps: [
        { icon: <FileText size={24} />, title: '1. Fill the form', desc: 'Provide your personal and travel information.' },
        { icon: <Smartphone size={24} />, title: '2. Scan your documents', desc: 'Upload your passport and other required documents.' },
        { icon: <Fingerprint size={24} />, title: '3. Pay the fees', desc: 'Pay the visa fees via our secure platform.' },
        { icon: <MapPin size={24} />, title: '4. Receive your e-Visa', desc: 'Your e-Visa is sent to you by email after approval.' },
      ]
    },
    faq: {
      title: 'Frequently asked questions',
      q1: 'Who needs an e-Visa for Cameroon?',
      a1: 'Any foreign national wishing to travel to Cameroon, with the exception of citizens of countries exempt by bilateral or regional agreement.',
      q2: 'How long does it take to get the visa?',
      a2: 'The standard processing time is 3 working days. A 24h express service is also available depending on the visa type.',
      q3: 'What are the mandatory documents?',
      a3: 'You will need a valid passport (at least 6 months), a recent identity photo, a return flight ticket and proof of accommodation.',
      q4: 'Can I modify my application after payment?',
      a4: 'No, once payment is confirmed, no modifications are possible. Carefully check your information before submission.',
      q5: 'How can I check the status of my e-Visa?',
      a5: 'Use the "Tracking" section with your file number and email address to know the progress in real time.'
    },
    visaTypes: {
      title: 'Available visa types',
      tourism: { title: 'Tourist Visa', desc: 'For tourist and family visits.', price: '100,000 XAF', duration: 'Up to 30 days' },
      business: { title: 'Business Visa', desc: 'For meetings, conferences, and commercial opportunities.', price: '150,000 XAF', duration: 'Up to 6 months' },
      transit: { title: 'Transit Visa', desc: 'For short stopovers.', price: '50,000 XAF', duration: 'Up to 5 days' }
    },
    footer: { text: "Republic of Cameroon - Ministry of External Relations. All rights reserved." }
  }
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const t = TRANSLATIONS[lang];
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          element.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-cm-cream min-h-screen relative overflow-x-hidden w-full m-0 p-0 block" style={{ maxWidth: '100vw' }}>
      {/* ── TICKER ── */}
      <div className="w-full bg-cm-green-mid text-white text-[0.7rem] font-bold py-2 overflow-hidden border-b border-cm-green-pale/30 fixed top-0 left-0 right-0 z-100">
        <div className="ticker-track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              <span className="text-cm-gold">★</span>
              <span>RÉPUBLIQUE DU CAMEROUN - PAIX TRAVAIL PATRIE</span>
              <span className="text-cm-gold">★</span>
              <span>E-VISA OFFICIEL</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-[32px] left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CameroonFlag size={36} />
            <div>
              <div className={`font-display font-bold leading-tight ${scrolled ? 'text-cm-text text-xl' : 'text-white text-2xl'}`}>e-Visa Cameroun</div>
              <div className={`text-[0.65rem] font-bold tracking-widest ${scrolled ? 'text-cm-green' : 'text-cm-gold-pale'}`}>MINREX</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['home', 'apply', 'tracking', 'contact'].map((item, i) => {
              let toPath = '/';
              if (item === 'apply') toPath = user ? '/applicant/application' : '/auth/login';
              if (item === 'tracking') toPath = user ? '/applicant/tracking' : '/auth/login';
              if (item === 'contact') toPath = '/contact';
              const stateObj = (!user && (item === 'apply' || item === 'tracking'))
                ? { from: { pathname: item === 'apply' ? '/applicant/application' : '/applicant/tracking' } }
                : undefined;

              return (
                <Link key={i} to={toPath} state={stateObj} className={`text-sm font-semibold transition-colors ${scrolled ? 'text-cm-muted hover:text-cm-green-mid' : 'text-white/80 hover:text-white'}`}>
                  {t.nav[item as keyof typeof t.nav]}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className={`text-xs font-bold px-2 py-1 rounded border ${scrolled ? 'border-cm-border text-cm-text hover:bg-cm-green/5' : 'border-white/30 text-white hover:bg-white/10'}`}>
              {lang.toUpperCase()}
            </button>
            <Link to={user ? "/applicant/dashboard" : "/auth/login"} className={`hidden sm:flex px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${scrolled ? 'bg-cm-green text-white hover:bg-cm-green-mid' : 'bg-white text-cm-green hover:bg-cm-cream'} whitespace-nowrap`}>
              {user ? 'Mon Tableau de bord' : t.nav.login}
            </Link>
            <button
              className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-cm-text bg-cm-cream' : 'text-white bg-white/10'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-cm-border shadow-lg p-6 flex flex-col gap-4 animate-fadeUp z-50">
            {['home', 'apply', 'tracking', 'contact'].map((item, i) => {
              let toPath = '/';
              if (item === 'apply') toPath = user ? '/applicant/application' : '/auth/login';
              if (item === 'tracking') toPath = user ? '/applicant/tracking' : '/auth/login';
              if (item === 'contact') toPath = '/contact';
              const stateObj = (!user && (item === 'apply' || item === 'tracking'))
                ? { from: { pathname: item === 'apply' ? '/applicant/application' : '/applicant/tracking' } }
                : undefined;

              return (
                <Link
                  key={i}
                  to={toPath}
                  state={stateObj}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-cm-text font-bold text-lg border-b border-cm-border/50 pb-3"
                >
                  {t.nav[item as keyof typeof t.nav]}
                </Link>
              );
            })}
            <Link
              to={user ? "/applicant/dashboard" : "/auth/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-5 py-3 rounded-xl bg-cm-green text-white text-center font-bold"
            >
              {user ? 'Mon Tableau de bord' : t.nav.login}
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-[180px] pb-[120px] lg:pt-[220px] lg:pb-[140px] px-6" style={{ background: 'linear-gradient(145deg, var(--color-cm-dark) 0%, var(--color-cm-green) 50%, var(--color-cm-green-mid) 100%)' }}>
        <div className="absolute inset-0 opacity-5 geo-pattern pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cm-gold/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse-ring pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="max-w-2xl animate-fadeUp">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 w-fit">
              <ShieldCheck size={16} className="text-cm-gold" />
              <span className="text-white font-medium text-sm">{t.hero.badge}</span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-lg">
              {t.hero.title1}<br />
              <span className="gold-shimmer">{t.hero.title2}</span><br />
              <span className="gold-shimmer text-4xl lg:text-6xl">{t.hero.title3}</span>
            </h1>

            <p className="text-white/80 text-lg lg:text-xl mb-10 leading-relaxed font-light max-w-xl">
              {t.hero.desc}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={user ? "/applicant/application" : "/auth/login"}
                state={!user ? { from: { pathname: '/applicant/application' } } : undefined}
                className="group px-8 py-4 rounded-xl bg-linear-to-r from-cm-gold to-cm-gold-light text-cm-dark font-bold text-base transition-all hover:-translate-y-1 shadow-[0_12px_24px_-8px_rgba(201,149,42,0.4)] flex items-center gap-2 hover:shadow-[0_16px_32px_-8px_rgba(201,149,42,0.6)]"
              >
                {t.hero.btnApply} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={user ? "/applicant/tracking" : "/auth/login"}
                state={!user ? { from: { pathname: '/applicant/tracking' } } : undefined}
                className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-base transition-all hover:bg-white/20 backdrop-blur-sm border border-white/20"
              >
                {t.hero.btnTrack}
              </Link>
            </div>
          </div>

          <div className="hidden lg:block animate-fadeUp delay-200 relative">
            {/* Flottant card visuel */}
            <div className="absolute inset-0 bg-linear-to-br from-cm-green-pale/20 to-transparent rounded-4xl blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-float">
              <div className="bg-cm-cream rounded-2xl p-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cm-gold-pale/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
                <div className="flex justify-between items-start mb-8">
                  <CameroonFlag size={48} />
                  <div className="text-right">
                    <div className="font-display font-bold text-xl text-cm-text">e-VISA</div>
                    <div className="text-xs font-bold text-cm-muted tracking-widest">CAMEROUN</div>
                  </div>
                </div>

                <div className="relative mb-8 w-full group overflow-hidden rounded-xl border border-cm-border/50 shadow-sm">
                  <img src="/evisa_preview.png" alt="Visa Preview" className="w-full h-40 object-cover transition-transform duration-700 max-w-full hover:scale-105" />
                  <div className="absolute inset-0 border border-black/5 rounded-xl pointer-events-none"></div>
                </div>

                <div className="flex justify-between items-end border-t border-cm-border pt-4">
                  <div>
                    <div className="text-[0.65rem] font-bold text-cm-muted mb-1">STATUS</div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cm-green-pale/20 text-cm-green-mid rounded-md text-xs font-bold">
                      <CheckCircle2 size={14} /> APPROUVÉ
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-lg border border-cm-border p-1 shadow-sm flex items-center justify-center">
                    <span className="text-[0.5rem] text-cm-muted text-center leading-tight">QR<br />CODE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-white border-b border-cm-border relative z-20 shadow-sm w-full block">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: t.stats.approved, value: '150k+', icon: <Globe className="text-cm-green" size={28} /> },
            { label: t.stats.time, value: '48h', icon: <Clock className="text-cm-gold" size={28} /> },
            { label: t.stats.support, value: '100%', icon: <ShieldCheck className="text-cm-red" size={28} /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-5 p-6 rounded-2xl bg-cm-cream/50 border border-cm-border hover:bg-cm-cream transition-colors reveal">
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center border border-cm-border shrink-0">{stat.icon}</div>
              <div>
                <div className="text-3xl font-display font-bold text-cm-text">{stat.value}</div>
                <div className="text-sm font-medium text-cm-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full block">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cm-text mb-4">{t.features.title}</h2>
          <div className="w-24 h-1.5 bg-linear-to-r from-cm-green to-cm-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[t.features.f1, t.features.f2, t.features.f3].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-cm-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group reveal delay-100">
              <div className="w-16 h-16 rounded-2xl bg-cm-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {i === 0 ? <ShieldCheck className="text-cm-green" size={32} /> : i === 1 ? <Clock className="text-cm-gold" size={32} /> : <CheckCircle2 className="text-cm-red" size={32} />}
              </div>
              <h3 className="text-xl font-display font-bold text-cm-text mb-3">{f.title}</h3>
              <p className="text-cm-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VISA TYPES ── */}
      <section className="py-24 bg-cm-cream/50 overflow-hidden w-full block">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cm-text mb-4">{t.visaTypes.title}</h2>
          <div className="w-24 h-1.5 bg-linear-to-r from-cm-gold to-cm-green mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 relative z-10">
          {[
            { tag: t.visaTypes.tourism, icon: <Globe size={32} className="text-cm-green" /> },
            { tag: t.visaTypes.business, icon: <FileText size={32} className="text-cm-gold" /> },
            { tag: t.visaTypes.transit, icon: <Clock size={32} className="text-cm-red" /> },
          ].map((type, i) => (
            <div key={i} className="bg-white p-8 rounded-4xl border border-cm-border shadow-md hover:-translate-y-2 transition-all duration-300 reveal flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cm-cream rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500 ease-out" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-cm-cream/50 flex items-center justify-center mb-6 shadow-xs border border-cm-border/50">
                  {type.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-cm-text mb-2">{type.tag.title}</h3>
                <p className="text-cm-muted mb-6">{type.tag.desc}</p>
                <div className="mt-auto space-y-3 pt-6 border-t border-cm-border/40">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-cm-text/60">Frais consulaires :</span>
                    <span className="text-cm-green font-bold text-base">{type.tag.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-cm-text/60">Validité max :</span>
                    <span className="text-cm-text">{type.tag.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-cm-dark text-white relative overflow-hidden w-full block">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cm-green rounded-full blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cm-gold rounded-full blur-[100px] opacity-20 pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10 reveal">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">{t.process.title}</h2>
          <div className="w-24 h-1.5 bg-linear-to-r from-cm-gold to-transparent mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 relative z-10">
          {t.process.steps.map((s, i) => (
            <div key={i} className="text-center reveal delay-100 relative group">
              {i < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-white/10 group-hover:bg-cm-gold/50 transition-colors" />}
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-5 group-hover:bg-cm-gold group-hover:text-cm-dark transition-all duration-300 relative z-10">
                {s.icon}
              </div>
              <h4 className="font-display text-xl font-bold mb-2">{s.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 max-w-3xl mx-auto px-6 w-full block">
        <div className="text-center mb-12 reveal">
          <h2 className="font-display text-4xl font-bold text-cm-text mb-4">{t.faq.title}</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: t.faq.q1, a: t.faq.a1 },
            { q: t.faq.q2, a: t.faq.a2 },
            { q: t.faq.q3, a: t.faq.a3 },
            { q: t.faq.q4, a: t.faq.a4 },
            { q: t.faq.q5, a: t.faq.a5 }
          ].map((faq, i) => (
            <div key={i} className={`border border-cm-border rounded-2xl bg-white overflow-hidden transition-shadow ${openFaq === i ? 'shadow-md border-cm-gold/50' : 'hover:border-cm-green-pale'}`}>
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center bg-transparent"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-bold text-cm-text text-lg pr-8">{faq.q}</span>
                <ChevronDown className={`text-cm-muted shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-cm-gold' : ''}`} />
              </button>
              <div className={`faq-answer ${openFaq === i ? 'open px-6 pb-6' : 'px-6 pb-0'}`}>
                <p className="text-cm-muted leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#08120D] pt-16 pb-8 border-t-4 border-cm-gold block text-white mt-auto w-full relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CameroonFlag size={32} />
              <div className="font-display font-bold text-xl">e-Visa Cameroun</div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">{t.hero.desc}</p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-cm-gold">Navigation</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">{t.nav.home}</a></li>
              <li><Link to="/auth/register" className="hover:text-white transition-colors">{t.nav.apply}</Link></li>
              <li><Link to="/applicant/tracking" className="hover:text-white transition-colors">{t.nav.tracking}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-cm-gold">Légal & Contact</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Mentions Légales</li>
              <li>Politique de Confidentialité</li>
              <li>Conditions Générales d'Utilisation</li>
              <li className="pt-2 text-white">messangaperig3@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 text-center text-sm text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{t.footer.text}</p>
          <p>© {new Date().getFullYear()} DGSN - MINREX</p>
        </div>
      </footer>
    </div>
  );
}
