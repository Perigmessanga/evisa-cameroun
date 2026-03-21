// ─────────────────────────────────────────────
//  pages/applicant/ProfilePage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { User, Mail, Lock, CheckCircle2, Loader2, Save, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    nationality: '',
    address: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      });
      // Optionally we should call refreshUser or context can just update locally
      toast.success('Informations du profil mises à jour.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(
        securityData.currentPassword,
        securityData.newPassword,
        securityData.confirmPassword
      );
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Mot de passe modifié avec succès.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.response?.data?.old_password?.[0] || 'Erreur lors de la modification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cm-text">Mon Profil</h1>
        <p className="text-cm-muted mt-1">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        
        {/* ── LEFT TABS ── */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'INFO' 
                ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <User size={18} /> Informations liées
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'SECURITY' 
                ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <Lock size={18} /> Sécurité & Mot de passe
          </button>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="md:col-span-3">
          
          {activeTab === 'INFO' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border overflow-hidden animate-fadeIn">
              
              <div className="p-6 sm:p-8 border-b border-cm-border flex items-center gap-4 bg-cm-cream/30">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-cm-green-pale to-cm-green text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
                  {user?.first_name[0]}{user?.last_name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-cm-text">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-sm font-semibold text-cm-gold flex items-center gap-1 mt-0.5"><CheckCircle2 size={14} /> Compte Demandeur vérifié</p>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Prénom(s)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.firstName} 
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Nom de famille</label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-cm-text mb-2">Adresse Email</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        disabled
                        value={formData.email} 
                        className="w-full pl-10 pr-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-medium text-sm outline-none cursor-not-allowed cursor" 
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
                    </div>
                    <p className="text-xs text-cm-muted/70 mt-1.5 font-medium">L'adresse email ne peut pas être modifiée car elle sert d'identifiant unique.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Nationalité</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ex: Français"
                        value={formData.nationality} 
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                      />
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      placeholder="+33 6 00 00 00 00"
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-cm-border text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold min-w-[160px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Sauvegarder</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8 animate-fadeIn">
              <h2 className="font-display text-xl font-bold text-cm-text mb-6">Modifier le mot de passe</h2>
              
              <form onSubmit={handleSecuritySubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Mot de passe actuel</label>
                  <input 
                    type="password" 
                    required
                    value={securityData.currentPassword} 
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={securityData.newPassword} 
                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                  />
                  <p className="text-[10px] text-cm-muted font-medium mt-1">Huit caractères minimum. Utilisez des chiffres et des lettres.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Confirmer le nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={securityData.confirmPassword} 
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                  />
                </div>

                <div className="pt-6 text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold min-w-[160px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
