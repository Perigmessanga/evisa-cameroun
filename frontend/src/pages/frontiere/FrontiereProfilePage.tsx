// ─────────────────────────────────────────────
//  pages/frontiere/FrontiereProfilePage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import visaService from '../../services/visaService';
import authService from '../../services/authService';
import { User, Lock, CheckCircle2, Loader2, Save, MapPin, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';
import TwoFactorWidget from '../../components/security/TwoFactorWidget';
import toast from 'react-hot-toast';

export default function FrontiereProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');
  const [stats, setStats] = useState({
    controleToday: 0,
    visasInvalides: 0,
    alertesDeclenchees: 0,
    averageScanTime: '12s'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await visaService.getBorderStats();
        if (data) {
          setStats({
            controleToday: data.stats?.controleToday || 0,
            visasInvalides: data.stats?.visasInvalides || 0,
            alertesDeclenchees: data.stats?.alertesDeclenchees || 0,
            averageScanTime: data.stats?.averageScanTime || '12s'
          });
        }
      } catch (error) {
        console.error('Erreur stats profil frontière:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Préférences mises à jour.');
    }, 1000);
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
      toast.success('Mot de passe modifié avec succès.');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cm-text">Mon Profil Agent</h1>
        <p className="text-cm-muted mt-1 flex items-center gap-2 font-semibold">
          Gérez votre profil de contrôle aux frontières et vos paramètres de sécurité.
        </p>
      </div>

      {/* ── BORDER AGENT STATS HEADER ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <div className="bg-cm-cream p-5 rounded-2xl border border-cm-border flex flex-col items-center text-center">
            <CheckCircle2 size={24} className="text-cm-green-mid mb-2" />
            <p className="text-xs font-bold text-cm-muted uppercase">Contrôles (Aujourd'hui)</p>
            <p className="text-2xl font-bold text-cm-text mt-1">
              {statsLoading ? <Loader2 size={20} className="animate-spin opacity-20" /> : (stats.controleToday || 0).toLocaleString()}
            </p>
         </div>
         <div className="bg-cm-cream p-5 rounded-2xl border border-cm-border flex flex-col items-center text-center">
            <AlertTriangle size={24} className="text-cm-red mb-2" />
            <p className="text-xs font-bold text-cm-muted uppercase">Visas Invalides / Refus</p>
            <p className="text-2xl font-bold text-cm-text mt-1">
               {statsLoading ? <Loader2 size={20} className="animate-spin opacity-20" /> : stats.visasInvalides}
            </p>
         </div>
         <div className="bg-cm-cream p-5 rounded-2xl border border-cm-border flex flex-col items-center text-center">
            <ShieldAlert size={24} className="text-indigo-600 mb-2" />
            <p className="text-xs font-bold text-cm-muted uppercase">Alertes Déclenchées</p>
            <p className="text-2xl font-bold text-cm-text mt-1">
               {statsLoading ? <Loader2 size={20} className="animate-spin opacity-20" /> : stats.alertesDeclenchees}
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
            <User size={18} /> Profil & Préférences
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'SECURITY' 
                ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <Lock size={18} /> Sécurité & 2FA
          </button>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="md:col-span-3">
          
          {activeTab === 'INFO' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border overflow-hidden animate-fadeIn">
              
              <div className="p-6 sm:p-8 border-b border-cm-border flex items-center gap-4 bg-cm-cream/30">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#1d4b38] to-[#1c4936] text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0 text-center uppercase">
                  {user?.first_name ? user.first_name[0] : 'A'}{user?.last_name ? user.last_name[0] : 'F'}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-cm-text">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-sm font-semibold text-cm-green-mid flex items-center gap-1.5 mt-0.5">
                    <Shield size={14} className="text-cm-gold" /> 
                    Contrôleur aux Frontières (DGSN)
                  </p>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} className="p-6 sm:p-8 space-y-6">
                
                <div className="grid gap-6">
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Matricule Frontière</label>
                     <input type="text" disabled value="PF-78945" className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-mono font-bold text-sm outline-none cursor-not-allowed" />
                     <p className="text-[10px] text-cm-muted font-medium mt-1 uppercase tracking-wide">Identifiant système du poste de contrôle</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Email Professionnel</label>
                     <input type="email" disabled value={user?.email} className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-medium text-sm outline-none cursor-not-allowed" />
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Point de Passage Assigné</label>
                     <div className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-bold text-sm flex items-center gap-2">
                       <MapPin size={16} /> Aéroport International de Yaoundé-Nsimalen (NSI)
                     </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-cm-border">
                   <h3 className="font-bold text-cm-text mb-4">Préférences de Poste</h3>
                   <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" defaultChecked className="text-cm-green-mid focus:ring-cm-green rounded" />
                         <span className="text-sm text-cm-text font-medium">Activer le bip sonore lors d'un scan réussi</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" defaultChecked className="text-cm-green-mid focus:ring-cm-green rounded" />
                         <span className="text-sm text-cm-text font-medium">M'alerter immédiatement en cas de concordance Watchlist</span>
                      </label>
                   </div>
                </div>

                <div className="pt-6 border-t border-cm-border text-right">
                   <button
                     type="submit"
                     disabled={loading}
                     className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-cm-border text-cm-text rounded-xl font-bold min-w-[160px] justify-center hover:bg-cm-cream transition-all disabled:opacity-70"
                   >
                     {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Sauvegarder</>}
                   </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-8 animate-fadeIn">
              <TwoFactorWidget />
              
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-cm-text mb-6">Modifier le mot de passe</h2>
                <p className="text-sm text-cm-muted mb-6">En tant qu'agent de contrôle aux frontières (DGSN), votre mot de passe doit respecter des normes strictes de sécurité.</p>
                
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
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold min-w-[160px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : 'Changer le mot de passe'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
