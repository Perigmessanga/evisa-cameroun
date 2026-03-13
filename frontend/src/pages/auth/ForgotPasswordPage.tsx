// ─────────────────────────────────────────────
//  pages/auth/ForgotPasswordPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import CameroonFlag from '../../components/common/CameroonFlag';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Erreur lors de la demande. Vérifiez l\'adresse email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cm-cream items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] p-8 sm:p-10 animate-fadeUp">
        
        <Link to="/auth/login" className="inline-flex items-center gap-2 text-cm-muted hover:text-cm-green-mid text-sm font-semibold mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <CameroonFlag size={24} />
          <div className="font-display font-bold text-lg text-cm-text">e-Visa Cameroun</div>
        </div>

        {success ? (
          <div className="text-center animate-fadeIn py-4">
            <div className="w-16 h-16 bg-cm-green-pale/20 rounded-full flex items-center justify-center mx-auto mb-6 text-cm-green border border-cm-green-pale/30">
              <MailCheck size={32} />
            </div>
            <h2 className="font-display text-2xl font-bold text-cm-text mb-4">Email Envoyé !</h2>
            <p className="text-cm-muted text-sm leading-relaxed mb-8">
              Si le compte existe, un lien de réinitialisation de mot de passe a été envoyé à <strong>{email}</strong>. Veuillez vérifier votre boîte de réception.
            </p>
            <Link to="/auth/login" className="px-6 py-3 rounded-xl bg-cm-cream text-cm-green-mid font-bold text-sm hover:bg-cm-green/10 transition-colors inline-block">
              Retourner à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-cm-text mb-2">Mot de passe oublié</h1>
            <p className="text-cm-muted text-sm mb-8">Entrez votre adresse email, nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

            {error && (
              <div className="bg-cm-red/5 border border-cm-red/10 text-cm-error text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2 animate-fadeIn">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-cm-text mb-2">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3.5 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-cm-green to-cm-green-mid text-white font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Envoyer le lien'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
