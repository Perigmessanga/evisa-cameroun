import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import visaService from '../../services/visaService';
import { VisaApplication } from '../../types';
import { 
  Search, Filter, ChevronRight, FileSearch, 
  MapPin, Calendar, Loader2, UserCheck, User, Clock, ShieldAlert
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function AdminApplicationsListPage() {
  const [apps, setApps] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const data = await visaService.getImmigrationApplications();
        setApps(data);
      } catch (error) {
        console.error('Erreur chargement applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const calculateProcessingTime = (submittedAt?: string | null, processedAt?: string | null) => {
    if (!submittedAt || !processedAt) return '---';
    const start = new Date(submittedAt);
    const end = new Date(processedAt);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMins} min`;
    }
    if (diffInHours > 24) {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} jour(s)`;
    }
    return `${diffInHours}h`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">APPROUVÉ</Badge>;
      case 'PENDING_REVIEW': return <Badge variant="info">EN ATTENTE AVIS</Badge>;
      case 'SUBMITTED': return <Badge variant="warning">SOUMIS</Badge>;
      case 'PROCESSING': return <Badge variant="warning">EN COURS</Badge>;
      case 'REJECTED': return <Badge variant="danger">REJETÉ</Badge>;
      case 'PENDING_DOCS': return <Badge variant="warning">DOCS MANQUANTS</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = (app.application_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (app.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (app.assigned_agent_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <FileSearch className="text-cm-gold" size={32} /> Traçabilité des Visas
          </h1>
          <p className="text-cm-muted mt-1">Historique complet de toutes les demandes et des agents qui les ont traitées.</p>
        </div>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher par N° dossier, Demandeur, Agent..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cm-cream/30 border border-cm-border rounded-xl text-sm focus:border-cm-gold outline-none transition-all"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-cm-muted" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 md:flex-none pl-3 pr-8 py-2 bg-cm-cream/30 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-gold"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="APPROVED">Approuvés</option>
            <option value="REJECTED">Rejetés</option>
            <option value="SUBMITTED">Soumis</option>
            <option value="PROCESSING">En traitement</option>
          </select>
        </div>
      </div>

      {/* ── APPLICATIONS TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-cm-muted">
            <Loader2 className="animate-spin mx-auto mb-4" /> Chargement de la traçabilité...
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4">Dossier / Date</th>
                  <th className="p-4">Bénéficiaire</th>
                  <th className="p-4">Agent Examinateur</th>
                  <th className="p-4">Avis Consulaire</th>
                  <th className="p-4">Temps de Traitement</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50 text-sm">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-cm-cream/10 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-cm-text">{app.application_number}</div>
                      <div className="flex items-center gap-1 text-[10px] text-cm-muted mt-1 uppercase font-medium">
                        <Calendar size={10} /> {formatDate(app.submitted_at || app.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-cm-text">{app.full_name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-cm-muted mt-1 uppercase font-medium">
                        <MapPin size={10} /> {app.nationality}
                      </div>
                    </td>
                    <td className="p-4">
                      {app.assigned_agent_name ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-cm-green-pale/20 flex items-center justify-center text-cm-green-mid shadow-inner">
                            <UserCheck size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-cm-text text-xs">{app.assigned_agent_name}</div>
                            <div className="text-[9px] text-cm-muted uppercase font-bold tracking-tighter">Officier d'Immigration</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-cm-muted">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={14} />
                          </div>
                          <span className="text-xs italic">Non assigné</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                       {app.embassy_opinion ? (
                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${app.embassy_opinion === 'FAVORABLE' ? 'bg-cm-green-pale/30 text-cm-green-mid' : 'bg-cm-red/10 text-cm-red'}`}>
                            {app.embassy_opinion === 'FAVORABLE' ? 'FAVORABLE ✅' : 'DÉFAVORABLE ❌'}
                         </div>
                       ) : (
                         <span className="text-[10px] text-cm-muted italic">Aucun avis</span>
                       )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-cm-text font-medium">
                        <Clock size={14} className="text-cm-muted" />
                        {calculateProcessingTime(app.submitted_at || app.created_at, app.processed_at)}
                      </div>
                      {app.processing_type === 'EXPRESS' && (
                        <div className="mt-1 text-[9px] font-bold text-cm-red uppercase tracking-widest flex items-center gap-1">
                           <ShieldAlert size={10} /> Priorité Express
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/agent/applications/${app.id}`}
                        className="p-2 text-cm-muted hover:text-cm-gold hover:bg-cm-gold/10 rounded-lg transition-all inline-block"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-cm-muted italic">
            Aucun dossier trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
