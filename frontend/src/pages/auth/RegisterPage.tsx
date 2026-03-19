// ─────────────────────────────────────────────
//  pages/auth/RegisterPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CameroonFlag from '../../components/common/CameroonFlag';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Votre nom et prénom sont obligatoires.');
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Inscription réussie ! Veuillez vérifier votre email.');
      navigate('/auth/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Un objet Utilisateur avec ce champ Email existe déjà.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-cm-cream">
      {/* ── LEFT PANEL (Decoration) ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-br from-cm-dark via-cm-green to-cm-green-mid" />
        <div className="absolute inset-0 geo-pattern opacity-10 blur-[1px]" />
        
        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <CameroonFlag size={48} />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            Créer votre<br />
            <span className="text-cm-gold-light">Espace Personnel</span>
          </h2>
          
          <ul className="text-left text-white/80 space-y-4 mb-12">
            <li className="flex items-start gap-3">
              <span className="text-cm-gold text-lg leading-none">✓</span>
              <span className="text-sm font-light">Suivez l'état de votre demande de visa en temps réel.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cm-gold text-lg leading-none">✓</span>
              <span className="text-sm font-light">Téléchargez votre e-Visa approuvé au format PDF.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cm-gold text-lg leading-none">✓</span>
              <span className="text-sm font-light">Accédez à l'historique de toutes vos démarches.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── RIGHT PANEL (Auth Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 w-full lg:w-auto overflow-y-auto">
        <div className="w-full max-w-lg bg-white rounded-4xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] p-8 sm:p-10 animate-fadeUp my-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-cm-muted hover:text-cm-green-mid text-sm font-semibold mb-8 transition-colors">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>

          <h1 className="font-display text-3xl font-bold text-cm-text mb-2">Inscription</h1>
          <p className="text-cm-muted text-sm mb-8">Remplissez le formulaire ci-dessous pour créer votre compte.</p>

          {error && (
            <div className="bg-cm-red/5 border border-cm-red/10 text-cm-error text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2 animate-fadeIn">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Prénom <span className="text-cm-red">*</span></label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Nom <span className="text-cm-red">*</span></label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cm-text mb-2">Adresse email <span className="text-cm-red">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cm-text mb-2">Numéro de téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+237 ..."
                className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Mot de passe <span className="text-cm-red">*</span></label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full pl-4 pr-10 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cm-muted hover:text-cm-text">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Confirmation <span className="text-cm-red">*</span></label>
                <div className="relative">
                  <input
                    type={showPwd2 ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full pl-4 pr-10 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                  />
                  <button type="button" onClick={() => setShowPwd2(!showPwd2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cm-muted hover:text-cm-text">
                    {showPwd2 ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-cm-green to-cm-green-mid text-white font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-cm-muted">
            Déjà un compte ?{' '}
            <Link to="/auth/login" className="font-bold text-cm-green-mid hover:text-cm-green transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
