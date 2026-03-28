import { useState, useEffect } from 'react';
import visaService from '../../services/visaService';
import { 
  FileText, Search, Filter, ArrowUpDown, 
  MapPin, Clock, User, ChevronRight, Loader2, X
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { VisaApplication } from '../../types';

export default function HistoriqueControlesPage() {
  const [history, setHistory] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await visaService.getBorderHistory();
        setHistory(data);
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.passport_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ENTERED': return <Badge variant="success">ENTRÉE</Badge>;
      case 'EXITED': return <Badge variant="info">SORTIE</Badge>;
      case 'DENIED': return <Badge variant="danger">REFUS</Badge>;
      default: return <Badge variant="default">INCONNU</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-cm-green mb-4" size={40} />
        <p className="text-cm-muted font-semibold">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Historique des Contrôles</h1>
          <p className="text-cm-muted font-semibold">Archives des passages et vérifications aux frontières</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-cm-green/10 text-cm-green rounded-xl font-bold text-sm">
             {filteredHistory.length} Passages
           </div>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="bg-white p-4 rounded-2xl border border-cm-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Rechercher par nom ou n° passeport..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-cm-border focus:border-cm-green outline-hidden transition-all text-sm font-semibold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cm-muted" size={18} />
        </div>
        <button className="px-4 py-2.5 bg-cm-cream text-cm-text rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-cm-border hover:bg-cm-border/20 transition-all">
          <Filter size={18} /> Filtres Avancés
        </button>
      </div>

      {/* ── TABLE AREA ── */}
      <div className="bg-white rounded-2xl border border-cm-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cm-cream/40 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-cm-muted border-b border-cm-border">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Voyageur</th>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4 flex items-center gap-1">
                  <Clock size={12} /> Date & Heure <ArrowUpDown size={10} />
                </th>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/50">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-cm-cream/10 transition-colors group">
                  <td className="px-6 py-4">
                    {getStatusBadge(item.border_check_status || '')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-cm-text text-sm capitalize">{item.full_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-cm-muted">{item.passport_number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-cm-text font-bold">
                      {formatDate(item.border_checked_at as string)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-cm-muted italic">Agent #{item.border_agent?.id?.split('-')[0] || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedApp(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-cm-green-pale/10 text-cm-green rounded-lg text-xs font-bold hover:bg-cm-green-pale/20 transition-all"
                    >
                      Détails <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredHistory.length === 0 && (
          <div className="p-20 text-center">
            <FileText className="mx-auto text-cm-muted opacity-20 mb-4" size={48} />
            <p className="text-cm-muted font-bold italic">Aucun enregistrement trouvé</p>
          </div>
        )}
      </div>

      {/* ── DETAILS MODAL ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
             <div className="bg-cm-green p-6 text-white flex justify-between items-center">
                <h3 className="font-display text-xl font-bold">Détails du Voyageur</h3>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                  <X size={24} />
                </button>
             </div>
             <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <p className="text-xs font-bold text-cm-muted uppercase">Nom Complet</p>
                     <p className="font-bold text-cm-text">{selectedApp.full_name}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-cm-muted uppercase">Nationalité</p>
                     <p className="font-bold text-cm-text">{selectedApp.nationality}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-cm-muted uppercase">N° Passeport</p>
                     <p className="font-bold font-mono text-cm-text">{selectedApp.passport_number}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-cm-muted uppercase">Type de Visa</p>
                     <p className="font-bold text-cm-text">{selectedApp.visa_type?.name || 'Tourisme'}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-cm-muted uppercase">Action Enregistrée</p>
                     <div className="mt-1">{getStatusBadge(selectedApp.border_check_status || '')}</div>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-cm-muted uppercase">Date de Contrôle</p>
                     <p className="font-bold text-cm-text">{formatDate(selectedApp.border_checked_at as string)}</p>
                   </div>
                </div>
                <div className="pt-6 border-t border-cm-border flex justify-end">
                   <button 
                     onClick={() => setSelectedApp(null)}
                     className="px-6 py-2.5 bg-cm-text text-white rounded-xl font-bold"
                   >
                     Fermer
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
