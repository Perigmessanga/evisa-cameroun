import { useState, useEffect } from 'react';
import visaService from '../../services/visaService';
import { 
  FileWarning, Search, Filter, ArrowUpDown, 
  Clock, User, ChevronRight, Loader2, RefreshCw
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { VisaApplication } from '../../types';
import { Link } from 'react-router-dom';

export default function PendingDocsPage() {
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await visaService.getImmigrationApplications();
      setApplications(data.filter((app: VisaApplication) => 
        app.status === 'PENDING_DOCS' || app.status === 'DOCS_PROVIDED'
      ));
    } catch (error) {
      console.error('Erreur chargement compléments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const filteredApps = applications.filter(app => 
    app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.application_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-cm-green mb-4" size={40} />
        <p className="text-cm-muted font-semibold">Chargement des compléments de dossiers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Compléments de Dossiers</h1>
          <p className="text-cm-muted font-semibold">Demandes en attente de pièces complémentaires</p>
        </div>
        <button 
          onClick={fetchPending}
          className="p-2.5 bg-white text-cm-green rounded-xl border border-cm-border hover:bg-cm-cream transition-all shadow-xs"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* SEARCH AREA */}
      <div className="bg-white p-4 rounded-2xl border border-cm-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Rechercher par nom ou n° dossier..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-cm-border focus:border-cm-green outline-hidden transition-all text-sm font-semibold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cm-muted" size={18} />
        </div>
        <button className="px-4 py-2.5 bg-cm-cream text-cm-text rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-cm-border hover:bg-cm-border/20 transition-all">
          <Filter size={18} /> Filtres
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-cm-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cm-cream/40 text-[10px] uppercase tracking-wider font-bold text-cm-muted border-b border-cm-border">
              <tr>
                <th className="px-6 py-4">N° Dossier</th>
                <th className="px-6 py-4">Demandeur</th>
                <th className="px-6 py-4">Pays</th>
                <th className="px-6 py-4">
                   <div className="flex items-center gap-1"><Clock size={12}/> Date Soumission</div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/50">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-cm-cream/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-bold text-cm-green">{app.application_number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-cm-green/10 text-cm-green flex items-center justify-center text-xs font-bold uppercase">
                          {app.full_name?.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div className="font-bold text-cm-text text-sm capitalize">{app.full_name}</div>
                       {app.status === 'DOCS_PROVIDED' && (
                         <span className="bg-cm-gold text-[8px] text-white px-1.5 py-0.5 rounded shadow-sm font-bold uppercase tracking-tighter animate-pulse">
                           Nouveau
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-cm-muted">{app.nationality}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-cm-text font-bold">
                      {app.submitted_at ? formatDate(app.submitted_at) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/agent/applications/${app.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-cm-green text-white rounded-lg text-xs font-bold hover:bg-cm-green/90 transition-all shadow-sm"
                    >
                      Voir le dossier <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApps.length === 0 && (
          <div className="p-20 text-center">
            <FileWarning className="mx-auto text-cm-muted opacity-20 mb-4" size={48} />
            <p className="text-cm-muted font-bold italic">Aucun dossier en attente de complément</p>
          </div>
        )}
      </div>

    </div>
  );
}
