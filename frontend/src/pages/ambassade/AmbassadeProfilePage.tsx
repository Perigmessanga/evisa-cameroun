// ─────────────────────────────────────────────
//  pages/ambassade/AmbassadeProfilePage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Building2, Save, Loader2, Globe, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AmbassadeProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Préférences mises à jour.');
    }, 1500);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Mot de passe consulaire modifié avec succès.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-cm-gold-pale/30 flex items-center justify-center text-cm-gold">
           <Building2 size={24} />
        </div>
        <div>
           <h1 className="font-display text-3xl font-bold text-cm-text">Profil Consulaire</h1>
           <p className="text-cm-muted mt-1 flex items-center gap-2">
             Gestion des accès sécurisés pour les représentants diplomatiques.
           </p>
        </div>
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
            <User size={18} /> Antenne & Représentation
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'SECURITY' 
                ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <Lock size={18} /> Sécurité Diplômatique
          </button>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="md:col-span-3">
          
          {activeTab === 'INFO' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border overflow-hidden animate-fadeIn">
              
              <div className="p-6 sm:p-8 border-b border-cm-border flex items-center gap-4 bg-cm-cream/30">
                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-cm-gold-pale to-cm-gold text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
                  <Globe size={32} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-cm-text">Ambassade du Cameroun à Paris</h2>
                  <p className="text-sm font-semibold text-cm-green-mid flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={14} /> Représentation Officielle • France
                  </p>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} className="p-6 sm:p-8 space-y-6">
                
                <div className="grid gap-6">
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">ID Antenne Spéciale</label>
                     <input type="text" disabled value="AMB-FR-01" className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-mono font-bold text-sm outline-none cursor-not-allowed" />
                     <p className="text-[10px] text-cm-muted font-medium mt-1 uppercase tracking-wide">ID de la borne de traitement locale</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Compte Agent Responsable</label>
                     <input type="text" disabled value={`${user?.first_name} ${user?.last_name}`} className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-medium text-sm outline-none cursor-not-allowed" />
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Email de Contact Sécurisé</label>
                     <input type="email" disabled value={user?.email} className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-medium text-sm outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="pt-6 border-t border-cm-border">
                   <h3 className="font-bold text-cm-text mb-4">Configurations d'Urgence</h3>
                   <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" defaultChecked className="text-cm-green-mid focus:ring-cm-green rounded" />
                         <span className="text-sm text-cm-text font-medium">Notifier par email pour chaque dossier en statut *URGENT*</span>
                      </label>
                   </div>
                </div>

                <div className="pt-6 border-t border-cm-border text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-cm-border text-cm-text rounded-xl font-bold min-w-[160px] justify-center hover:bg-cm-cream transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Mettre à jour</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8 animate-fadeIn">
              <h2 className="font-display text-xl font-bold text-cm-text mb-6">Mot de passe consulaire</h2>
              <p className="text-sm text-cm-muted mb-6">Changement de mot de passe du terminal. Un code 2FA vous sera demandé à la prochaine connexion après cette modification.</p>
              
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
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-gold to-yellow-600 text-white rounded-xl font-bold min-w-[160px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Changer le mot de passe'}
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
