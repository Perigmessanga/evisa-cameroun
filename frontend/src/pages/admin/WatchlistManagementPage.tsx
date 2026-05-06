import { useState, useEffect } from 'react';
import { 
  ShieldAlert, Plus, Search, Filter, 
  Trash2, Edit2, AlertTriangle, UserMinus,
  Loader2, BadgeCheck, Globe, Info
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface WatchlistEntry {
  id: string;
  passport_number: string;
  full_name: string;
  reason: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
  created_at: string;
}

export default function WatchlistManagementPage() {
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<WatchlistEntry>>({
    risk_level: 'MEDIUM',
  });

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/national-watchlist/');
      // Extract from DRF results if paginated, otherwise direct
      setEntries(data.results || data.data || data);
    } catch (error) {
      toast.error('Erreur lors de la récupération de la Watchlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/national-watchlist/', formData);
      toast.success('Entrée ajoutée à la Watchlist nationale.');
      setIsModalOpen(false);
      setFormData({ risk_level: 'MEDIUM' });
      fetchWatchlist();
    } catch (error) {
       toast.error('Échec de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Retirer cette personne de la surveillance étatique ?')) return;
    try {
      await api.delete(`/national-watchlist/${id}/`);
      toast.success('Entrée supprimée.');
      fetchWatchlist();
    } catch (error) {
      toast.error('Erreur suppression.');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-cm-red text-white';
      case 'MEDIUM': return 'bg-cm-gold text-cm-text';
      default: return 'bg-blue-500 text-white';
    }
  };

  const filteredEntries = entries.filter(e => 
    e.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.passport_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <ShieldAlert className="text-cm-red" size={32} /> Vigilance Étatique (Watchlist)
          </h1>
          <p className="text-cm-muted mt-1">Surveillance des individus à risque pour la sécurité nationale.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cm-red text-white rounded-xl font-bold text-sm hover:bg-cm-red/90 shadow-lg shadow-cm-red/20 transition-all"
        >
          <Plus size={18} /> Signaler un Profil
        </button>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou numéro de passeport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:border-cm-red outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-cm-muted" />
          <select className="bg-cm-cream/50 border border-cm-border rounded-xl px-4 py-3 text-sm font-bold text-cm-text">
            <option>Tous les niveaux de risque</option>
            <option>Critique</option>
            <option>Élevé</option>
          </select>
        </div>
      </div>

      {/* ── LIST ── */}
      <div className="bg-white border border-cm-border rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-cm-red" size={40} />
            <p className="font-bold text-cm-muted">Consultation des bases de données de sécurité...</p>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-widest font-bold text-cm-muted">
                  <th className="p-5">Identité / Passeport</th>
                  <th className="p-5">Niveau de Risque</th>
                  <th className="p-5">Motif du Signalement</th>
                  <th className="p-5">Notes de Sécurité</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-cm-red/5 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-cm-text uppercase">{entry.full_name}</div>
                      <div className="text-xs font-mono text-cm-muted tracking-tight mt-1 flex items-center gap-1">
                        <Globe size={12} /> {entry.passport_number}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRiskColor(entry.risk_level)}`}>
                        {entry.risk_level}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-cm-text">
                        <AlertTriangle className="text-cm-gold" size={14} />
                        {entry.reason}
                      </div>
                    </td>
                    <td className="p-5 max-w-[200px]">
                      <p className="text-xs text-cm-muted line-clamp-2 italic">"{entry.notes || 'Aucun détail additionnel.'}"</p>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-cm-muted hover:text-cm-red hover:bg-cm-red/10 rounded-lg transition-colors"
                        title="Retirer de la Watchlist"
                      >
                        <UserMinus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-cm-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cm-green/20">
              <BadgeCheck className="text-cm-green" size={32} />
            </div>
            <h3 className="font-display font-bold text-lg text-cm-text mb-1">Watchlist Vierge</h3>
            <p className="text-sm text-cm-muted max-w-sm mx-auto">Aucun individu n'est actuellement sous surveillance active. Le calme règne sur les flux migratoires.</p>
          </div>
        )}
      </div>

      {/* ── MODAL AJOUT ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="bg-cm-red p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert size={28} />
                <h2 className="font-display text-xl font-bold">Nouveau Signalement Étatique</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><XCircle /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-cm-muted uppercase mb-2">Nom Complet</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl focus:border-cm-red outline-none shadow-inner"
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-cm-muted uppercase mb-2">N° de Passeport</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl focus:border-cm-red outline-none shadow-inner"
                      onChange={e => setFormData({...formData, passport_number: e.target.value})}
                    />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-cm-muted uppercase mb-2">Motif du signalement</label>
                  <input 
                    type="text" required placeholder="Ex: Fraude documentaire, Terrorisme, Espionnage..."
                    className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl focus:border-cm-red outline-none shadow-inner"
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-cm-muted uppercase mb-2">Niveau de Risque</label>
                  <select 
                    className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl focus:border-cm-red outline-none appearance-none font-bold"
                    value={formData.risk_level}
                    onChange={e => setFormData({...formData, risk_level: e.target.value as any})}
                  >
                    <option value="LOW">FAIBLE</option>
                    <option value="MEDIUM">MODÉRÉ</option>
                    <option value="HIGH">ÉLEVÉ (DANGER)</option>
                    <option value="CRITICAL">CRITIQUE (URGENT)</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-cm-muted uppercase mb-2">Notes de sécurité confidentielles</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-cm-cream border border-cm-border rounded-xl focus:border-cm-red outline-none shadow-inner resize-none"
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  ></textarea>
               </div>
               <div className="flex gap-4 pt-4">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-cm-border font-bold text-cm-muted rounded-xl hover:bg-cm-cream transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" disabled={loading}
                    className="flex-2 py-3 bg-cm-red text-white font-bold rounded-xl hover:bg-cm-red/90 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><ShieldAlert size={18} /> Inscrire à la Vigilance</>}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function XCircle() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>; }
