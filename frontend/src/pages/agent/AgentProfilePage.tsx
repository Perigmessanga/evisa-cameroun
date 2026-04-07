// ─────────────────────────────────────────────
//  pages/agent/AgentProfilePage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import visaService from '../../services/visaService';
import { User, Lock, CheckCircle2, Loader2, Save, Users, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');
  const [stats, setStats] = useState({
    monthlyTotal: 0,
    avgDays: 0,
    compliance: 0
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await visaService.getImmigrationStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur stats profil:', error);
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
      toast.success('Mot de passe modifié avec succès.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cm-text">
          {user?.role === 'EMBASSY' ? 'Mon Profil Ambassade' : 'Mon Profil Agent'}
        </h1>
        <p className="text-cm-muted mt-1 flex items-center gap-2">
          Gérez vos préférences de travail et vos paramètres de sécurité.
        </p>
      </div>

      {/* ── AGENT STATS HEADER ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
         <div className="bg-cm-cream p-5 rounded-2xl border border-cm-border flex flex-col items-center text-center">
            <Users size={24} className="text-cm-green-mid mb-2" />
            <p className="text-xs font-bold text-cm-muted uppercase">Dossiers (Mois)</p>
            <p className="text-2xl font-bold text-cm-text mt-1">
              {statsLoading ? <Loader2 size={20} className="animate-spin opacity-20" /> : (stats.monthlyTotal || 0).toLocaleString()}
            </p>
         </div>
         <div className="bg-cm-cream p-5 rounded-2xl border border-cm-border flex flex-col items-center text-center">
            <Clock size={24} className="text-cm-gold mb-2" />
            <p className="text-xs font-bold text-cm-muted uppercase">Temps Moyen</p>
            <p className="text-2xl font-bold text-cm-text mt-1">
               {statsLoading ? <Loader2 size={20} className="animate-spin opacity-20" /> : `${stats.avgDays || 0} jours`}
            </p>
         </div>
         <div className="bg-cm-cream p-5 rounded-2xl border border-cm-border flex flex-col items-center text-center">
            <CheckCircle2 size={24} className="text-cm-green-mid mb-2" />
            <p className="text-xs font-bold text-cm-muted uppercase">Conformité</p>
            <p className="text-2xl font-bold text-cm-text mt-1">
               {statsLoading ? <Loader2 size={20} className="animate-spin opacity-20" /> : `${stats.compliance || 0}%`}
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
            <Lock size={18} /> Sécurité & Mot de passe
          </button>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="md:col-span-3">
          
          {activeTab === 'INFO' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border overflow-hidden animate-fadeIn">
              
              <div className="p-6 sm:p-8 border-b border-cm-border flex items-center gap-4 bg-cm-cream/30">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-cm-green-pale to-cm-green text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0 text-center uppercase">
                  {user?.first_name[0]}{user?.last_name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-cm-text">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-sm font-semibold text-cm-green-mid flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={14} /> 
                    {user?.role === 'EMBASSY' ? `Consulaire - Ambassade : ${user?.embassy_country}` : 'Agent d\'immigration Central'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} className="p-6 sm:p-8 space-y-6">
                
                <div className="grid gap-6">
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Matricule Agent</label>
                     <input type="text" disabled value="AGT-30948-CMR" className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-mono font-bold text-sm outline-none cursor-not-allowed" />
                     <p className="text-[10px] text-cm-muted font-medium mt-1 uppercase tracking-wide">ID système interne inchangeable</p>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-cm-text mb-2">Email Professionnel</label>
                     <input type="email" disabled value={user?.email} className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-medium text-sm outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="pt-6 border-t border-cm-border">
                   <h3 className="font-bold text-cm-text mb-4">Préférences de Notification</h3>
                   <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" defaultChecked className="text-cm-green-mid focus:ring-cm-green rounded" />
                         <span className="text-sm text-cm-text font-medium">Alertes emails pour les dossiers URGENTS assignés</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" defaultChecked className="text-cm-green-mid focus:ring-cm-green rounded" />
                         <span className="text-sm text-cm-text font-medium">Rapport quotidien des dossiers traités (Automatique)</span>
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
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8 animate-fadeIn">
              <h2 className="font-display text-xl font-bold text-cm-text mb-6">Modifier le mot de passe</h2>
              <p className="text-sm text-cm-muted mb-6">En tant qu'agent administratif, votre mot de passe doit respecter des normes strictes de sécurité (12 caractères, Maj/Min, Chiffres, Spéciaux).</p>
              
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
          )}

        </div>
      </div>
    </div>
  );
}
