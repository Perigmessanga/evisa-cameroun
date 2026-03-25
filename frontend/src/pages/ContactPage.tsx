import { useState } from 'react';
import { Link } from 'react-router-dom';
import CameroonFlag from '../components/common/CameroonFlag';
import Footer from '../components/layout/Footer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/../contact-messages/', formData);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setFormData({first_name: '', last_name: '', email: '', subject: '', message: ''});
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cm-cream flex flex-col">
      {/* Navbar (Static version) */}
      <nav className="bg-white border-b border-cm-border py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <CameroonFlag size={36} />
            <div>
              <div className="font-display font-bold text-cm-text text-xl leading-tight">e-Visa Cameroun</div>
              <div className="text-[0.65rem] font-bold tracking-widest text-cm-green">MINREX</div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-cm-muted hover:text-cm-green-mid hidden sm:block">
              Retour à l'accueil
            </Link>
            <Link to="/auth/login" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-cm-green text-white hover:bg-cm-green-mid transition-all">
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="bg-cm-dark text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 geo-pattern opacity-10" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Vous avez des questions ou besoin d'assistance pour votre demande de visa ? Notre équipe est à votre disposition pour vous accompagner.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-cm-text mb-8">Informations de contact</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-cm-gold/10 text-cm-gold flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-cm-text text-lg">Direction de la Police aux Frontières</h4>
                    <p className="text-cm-muted mt-1 leading-relaxed">
                      Quartier Administratif<br />
                      Yaoundé, Cameroun
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-cm-green/10 text-cm-green flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-cm-text">Email Officiel</h3>
                    <p className="text-cm-muted mt-1 leading-relaxed">messangaperig3@gmail.com</p>
                    <p className="text-sm font-bold text-cm-green-mid mt-1">Réponse en 24h ouvrées</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-4 bg-cm-cream/50 rounded-xl text-cm-green">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-cm-text">Téléphone (WhatsApp & Appels)</h3>
                    <p className="text-cm-muted mt-1 leading-relaxed">+237 690 99 22 59</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-cm-cream border border-cm-border text-cm-muted flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-cm-text text-lg">Heures d'ouverture</h4>
                    <p className="text-cm-muted mt-1 leading-relaxed">Lundi - Vendredi : 08h00 - 15h30</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cm-cream/50 rounded-2xl p-6 border border-cm-border shadow-sm">
              <h4 className="font-bold text-cm-text mb-2">Suivi de demande</h4>
              <p className="text-sm text-cm-muted mb-4">Si votre demande concerne un dossier en cours, veuillez vous munir de votre identifiant de dossier.</p>
              <Link to="/applicant/tracking" className="text-sm font-bold text-cm-green-mid hover:underline">
                Accéder au suivi &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border">
              <h3 className="font-display text-2xl font-bold text-cm-text mb-2">Envoyez-nous un message</h3>
              <p className="text-cm-muted mb-8 text-sm">Nous vous répondrons dans les plus brefs délais.</p>

              {sent ? (
                <div className="bg-cm-green-pale/20 border border-cm-green/30 rounded-xl p-8 text-center animate-fadeIn">
                  <div className="w-16 h-16 bg-cm-green text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-bold text-cm-text text-lg mb-2">Message Envoyé !</h4>
                  <p className="text-cm-muted text-sm">Votre demande a été prise en compte avec succès.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-cm-text mb-2">Prénom</label>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/10 outline-none transition-all" placeholder="Jean" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-cm-text mb-2">Nom</label>
                      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/10 outline-none transition-all" placeholder="Dupont" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-cm-text mb-2">Adresse Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/10 outline-none transition-all" placeholder="jean.dupont@email.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cm-text mb-2">Sujet de la demande</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/10 outline-none transition-all text-cm-text">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="Statut de ma demande de visa">Statut de ma demande de visa</option>
                      <option value="Problème de paiement">Problème de paiement</option>
                      <option value="Assistance pour les documents">Assistance pour les documents</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cm-text mb-2">Votre message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/10 outline-none transition-all resize-none" placeholder="Décrivez votre problème en détail..."></textarea>
                  </div>

                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-cm-green to-cm-green-mid text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Envoyer <Send size={18} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
