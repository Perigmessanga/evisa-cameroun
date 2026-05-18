import { useState, useEffect } from 'react';
import Badge from '../../components/common/Badge';
import visaService from '../../services/visaService';
import adminService from '../../services/adminService';
import { VisaApplication } from '../../types';
import { 
  Search, Filter, ChevronRight, FileSearch, 
  MapPin, Calendar, Loader2, UserCheck, User, Clock, ShieldAlert,
  X, AlertTriangle, ShieldCheck, CheckCircle2, UserPlus, RefreshCw, FileText
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminApplicationsListPage() {
  const [apps, setApps] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // --- Slide-over Drawer States ---
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null);
  const [fullApp, setFullApp] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [watchlistReason, setWatchlistReason] = useState('');
  const [watchlistRisk, setWatchlistRisk] = useState('MEDIUM');
  const [revocationReason, setRevocationReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    fetchApps();
    fetchAgents();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await visaService.getImmigrationApplications();
      setApps(data);
    } catch (error) {
      console.error('Erreur chargement applications:', error);
      toast.error('Impossible de charger le suivi des visas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await adminService.getUsers();
      setAgents(data.filter((u: any) => u.role === 'AGENT' || u.role === 'EMBASSY'));
    } catch (error) {
      console.error('Erreur chargement agents:', error);
    }
  };

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

  // --- Actions Implementations ---
  const handleOpenDrawer = async (app: VisaApplication) => {
    setSelectedApp(app);
    setDrawerOpen(true);
    setLogsLoading(true);
    setFullApp(null);
    setAuditLogs([]);
    setWatchlistReason('');
    setRevocationReason('');
    setSelectedAgentId(app.assigned_agent || '');
    
    try {
      // 1. Charger le dossier complet
      const detail = await visaService.getApplicationById(app.id);
      setFullApp(detail);
      
      // 2. Charger le journal d'audit
      const logs = await adminService.getAuditLogsForApplication(app.id);
      setAuditLogs(logs);
    } catch (error) {
      console.error("Erreur chargement détails / logs d'audit:", error);
      toast.error('Impossible de charger le dossier complet ou son journal d’audit.');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedApp || !selectedAgentId) return;
    setSubmittingAction(true);
    try {
      await adminService.reassignApplicationAgent(selectedApp.id, selectedAgentId);
      toast.success('Officier instructeur réassigné avec succès.');
      
      // Actualiser
      await fetchApps();
      const detail = await visaService.getApplicationById(selectedApp.id);
      setFullApp(detail);
      const logs = await adminService.getAuditLogsForApplication(selectedApp.id);
      setAuditLogs(logs);
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur lors de la réassignation : ' + (error.response?.data?.error || 'Erreur inconnue'));
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!selectedApp || !watchlistReason.trim()) {
      toast.error('Veuillez spécifier le motif du signalement.');
      return;
    }
    setSubmittingAction(true);
    try {
      await adminService.addToWatchlist({
        full_name: selectedApp.full_name,
        passport_number: selectedApp.passport_number,
        nationality: selectedApp.nationality,
        risk_level: watchlistRisk,
        reason: watchlistReason
      });
      toast.success(`${selectedApp.full_name} a été ajouté à la Watchlist nationale.`);
      setWatchlistReason('');
      
      // Actualiser
      const logs = await adminService.getAuditLogsForApplication(selectedApp.id);
      setAuditLogs(logs);
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur lors du signalement : ' + (error.response?.data?.error || 'Erreur inconnue'));
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRevokeVisa = async () => {
    if (!fullApp?.evisa?.id) {
      toast.error('Aucun e-Visa valide trouvé pour ce dossier.');
      return;
    }
    if (!revocationReason.trim()) {
      toast.error('Veuillez renseigner le motif officiel de la révocation.');
      return;
    }
    if (!window.confirm('🚨 ATTENTION : Êtes-vous absolument sûr de vouloir révoquer définitivement cet e-Visa ? Le voyageur sera bloqué à la frontière.')) {
      return;
    }
    setSubmittingAction(true);
    try {
      await adminService.revokeEVisa(fullApp.evisa.id, revocationReason);
      toast.success('e-Visa révoqué définitivement avec succès.');
      setRevocationReason('');
      
      // Actualiser
      await fetchApps();
      const detail = await visaService.getApplicationById(selectedApp!.id);
      setFullApp(detail);
      const logs = await adminService.getAuditLogsForApplication(selectedApp!.id);
      setAuditLogs(logs);
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur lors de la révocation : ' + (error.response?.data?.error || 'Erreur inconnue'));
    } finally {
      setSubmittingAction(false);
    }
  };

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
            <option value="PENDING_REVIEW">En attente avis</option>
            <option value="PENDING_DOCS">Docs manquants</option>
          </select>
        </div>
      </div>

      {/* ── APPLICATIONS TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-cm-muted">
            <Loader2 className="animate-spin mx-auto mb-4 text-cm-gold" /> Chargement de la traçabilité...
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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cm-cream flex items-center justify-center border border-cm-border shadow-inner">
                          <UserCheck size={14} className={app.processed_by_name || app.assigned_agent_name ? "text-cm-green-mid" : "text-cm-muted"} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${app.processed_by_name || app.assigned_agent_name ? "text-cm-text" : "text-cm-muted"}`}>
                            {app.processed_by_name || app.assigned_agent_name || 'Non assigné'}
                          </div>
                          {(app.processed_by_name || app.assigned_agent_name) && (
                            <div className="text-[9px] text-cm-muted uppercase font-bold tracking-tighter">Officier Traitant</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                       {app.embassy_opinion && app.embassy_opinion !== 'NONE' ? (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${app.embassy_opinion === 'FAVORABLE' ? 'bg-cm-green-pale/30 text-cm-green-mid' : 'bg-cm-red/10 text-cm-red'}`}>
                             {app.embassy_opinion === 'FAVORABLE' ? 'FAVORABLE ✅' : 'DÉFAVORABLE ❌'}
                          </div>
                       ) : (
                          <span className="text-[10px] text-cm-muted italic bg-cm-cream px-2 py-1 rounded font-medium">Aucun avis</span>
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
                      <button 
                        onClick={() => handleOpenDrawer(app)}
                        className="p-2 text-cm-muted hover:text-cm-gold hover:bg-cm-gold/10 rounded-lg transition-all inline-block cursor-pointer"
                      >
                        <ChevronRight size={20} />
                      </button>
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

      {/* ── INTERACTIVE SLIDE-OVER PANEL (DRAWER) ── */}
      {drawerOpen && selectedApp && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Dark Overlay */}
            <div 
              className="absolute inset-0 bg-gray-600/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out" 
              onClick={() => setDrawerOpen(false)}
            />

            {/* Sliding Container */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-2xl transform bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full">
                
                {/* Drawer Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-cm-gold uppercase">Gouvernance & Sécurité e-Visa</span>
                    <h2 className="text-xl font-display font-bold text-cm-text mt-1">{selectedApp.application_number}</h2>
                  </div>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Drawer Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  
                  {/* 1. Résumé du Voyageur */}
                  <div className="bg-cm-cream/10 border border-cm-border p-4 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-cm-text uppercase tracking-wider flex items-center gap-1.5 border-b border-cm-border/50 pb-2">
                       <User size={14} className="text-cm-gold" /> Profil Voyageur & Dossier
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-cm-muted block">Nom Complet :</span>
                        <span className="font-bold text-cm-text">{selectedApp.full_name}</span>
                      </div>
                      <div>
                        <span className="text-cm-muted block">Nationalité :</span>
                        <span className="font-bold text-cm-text">{selectedApp.nationality}</span>
                      </div>
                      <div>
                        <span className="text-cm-muted block">N° Passeport :</span>
                        <span className="font-bold font-mono text-cm-text">{fullApp?.passport_number || selectedApp.passport_number}</span>
                      </div>
                      <div>
                        <span className="text-cm-muted block">Statut du Dossier :</span>
                        <span className="mt-1 inline-block">{getStatusBadge(selectedApp.status)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Journal d'Audit & Traçabilité (Audit Trail) */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-cm-text uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                       <Clock size={14} className="text-cm-gold" /> Journal d'Audit & Traçabilité
                    </h3>
                    
                    {logsLoading ? (
                      <div className="flex items-center justify-center py-10 text-xs text-cm-muted">
                        <Loader2 className="animate-spin text-cm-gold mr-2" size={16} /> Chargement des logs d'audit...
                      </div>
                    ) : auditLogs.length > 0 ? (
                      <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-6 text-xs">
                        {auditLogs.map((log, idx) => (
                          <div key={log.id || idx} className="relative">
                            <span className="absolute -left-[21px] top-0 bg-white p-0.5 rounded-full border border-gray-300">
                              <span className="block w-2.5 h-2.5 rounded-full bg-cm-gold" />
                            </span>
                            <div>
                              <div className="flex justify-between items-start text-cm-muted">
                                <span className="font-bold text-cm-text text-[11px]">{log.action}</span>
                                <span>{formatDate(log.created_at || log.time)}</span>
                              </div>
                              <p className="mt-1 text-gray-600 leading-relaxed">{log.description}</p>
                              {log.user_email && (
                                <div className="mt-1 text-[10px] text-cm-gold font-bold">
                                  Par : {log.user_email}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 text-center rounded-xl text-xs text-cm-muted italic">
                        Aucun journal d'audit enregistré pour le moment.
                      </div>
                    )}
                  </div>

                  {/* 3. Panel de Contrôle & Sécurité */}
                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-cm-text uppercase tracking-wider flex items-center gap-1.5 pb-2 text-red-700">
                       <ShieldAlert size={14} /> Actions de Haute Sécurité
                    </h3>

                    {/* ACTION A: Réassignation d'Agent */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase">👤 Réassigner à un Officier Instructeur</label>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Transférez l'instruction de cette demande à un autre agent d'immigration actif en cas d'urgence ou d'absence.
                      </p>
                      <div className="flex gap-2">
                        <select 
                          value={selectedAgentId}
                          onChange={(e) => setSelectedAgentId(e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-lg text-xs p-2 outline-none focus:border-cm-gold"
                        >
                          <option value="">-- Non assigné --</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.first_name} {agent.last_name} ({agent.email})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleReassign}
                          disabled={submittingAction}
                          className="px-4 py-2 bg-cm-text hover:bg-black text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {submittingAction ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                          Réassigner
                        </button>
                      </div>
                    </div>

                    {/* ACTION B: Watchlist Flag */}
                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 space-y-3">
                      <label className="block text-xs font-bold text-yellow-800 uppercase flex items-center gap-1">
                        <AlertTriangle size={14} className="text-yellow-700" /> Signaler à la Liste de Surveillance (Watchlist)
                      </label>
                      <p className="text-[11px] text-yellow-700 leading-relaxed">
                        Inscrit immédiatement l'identité et le passeport de ce voyageur dans la base nationale de surveillance. Les agents frontaliers recevront une alerte critique en cas de tentative d'entrée.
                      </p>
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1 text-[11px] font-semibold text-yellow-800">
                            <input 
                              type="radio" 
                              name="watchlistRisk" 
                              value="MEDIUM" 
                              checked={watchlistRisk === 'MEDIUM'} 
                              onChange={() => setWatchlistRisk('MEDIUM')} 
                            />
                            Risque Moyen
                          </label>
                          <label className="flex items-center gap-1 text-[11px] font-semibold text-red-800">
                            <input 
                              type="radio" 
                              name="watchlistRisk" 
                              value="HIGH" 
                              checked={watchlistRisk === 'HIGH'} 
                              onChange={() => setWatchlistRisk('HIGH')} 
                            />
                            Risque Critique / Interdiction
                          </label>
                        </div>
                        <textarea
                          placeholder="Motif officiel de la mise sous surveillance (ex: suspicion de faux documents, mandat de recherche...)"
                          value={watchlistReason}
                          onChange={(e) => setWatchlistReason(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg text-xs p-2.5 h-20 outline-none focus:border-cm-gold resize-none"
                        />
                        <button
                          onClick={handleAddToWatchlist}
                          disabled={submittingAction}
                          className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {submittingAction ? <Loader2 size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
                          Ajouter à la Watchlist nationale
                        </button>
                      </div>
                    </div>

                    {/* ACTION C: Revoke Approved Visa */}
                    {selectedApp.status === 'APPROVED' && (
                      <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
                        <label className="block text-xs font-bold text-red-800 uppercase flex items-center gap-1">
                          <ShieldAlert size={14} className="text-red-700" /> Révocation Définitive du Visa
                        </label>
                        <p className="text-[11px] text-red-700 leading-relaxed">
                          Annule de façon irréversible ce visa. Les signatures cryptographiques et le QR Code seront instantanément invalidés.
                        </p>
                        
                        {fullApp?.evisa?.is_revoked ? (
                          <div className="p-3 bg-red-100/50 text-red-800 rounded-lg font-bold text-center text-xs">
                             ⚠️ Cet e-Visa est DÉJÀ RÉVOQUÉ.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <textarea
                              placeholder="Motif officiel de la révocation du titre de voyage (obligatoire)"
                              value={revocationReason}
                              onChange={(e) => setRevocationReason(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg text-xs p-2.5 h-20 outline-none focus:border-red-500 resize-none"
                            />
                            <button
                              onClick={handleRevokeVisa}
                              disabled={submittingAction}
                              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {submittingAction ? <Loader2 size={12} className="animate-spin" /> : <ShieldAlert size={12} />}
                              Révoquer Définitivement le Visa
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
