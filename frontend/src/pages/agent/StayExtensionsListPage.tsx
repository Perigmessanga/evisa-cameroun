import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Loader2, RefreshCcw, ChevronRight, CheckCircle2, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import applicationService from '../../services/applicationService';
import type { StayExtensionRequest } from '../../types';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function StayExtensionsListPage() {
  const { t } = useTranslation();
  const [extensions, setExtensions] = useState<StayExtensionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedExt, setSelectedExt] = useState<StayExtensionRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchExtensions = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getStayExtensions();
      setExtensions(data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des prorogations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const handleAction = async (status: string) => {
    if (!selectedExt) return;
    
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      toast.error("Le motif de rejet est obligatoire.");
      return;
    }

    setActionLoading(true);
    try {
      await applicationService.updateStayExtensionStatus(selectedExt.id, status, rejectionReason);
      toast.success(`Demande ${status === 'APPROVED' ? 'approuvée' : 'rejetée'} avec succès.`);
      setIsModalOpen(false);
      setRejectionReason('');
      fetchExtensions();
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du statut.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">APPROUVÉE</Badge>;
      case 'SUBMITTED': return <Badge variant="info">SOUMISE</Badge>;
      case 'PROCESSING': return <Badge variant="warning">EN COURS</Badge>;
      case 'REJECTED': return <Badge variant="danger">REJETÉE</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredExtensions = extensions.filter(ext => 
    ext.visa_application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ext.applicant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cm-text flex items-center gap-2">
            <RefreshCcw size={24} className="text-cm-green-mid" />
            Gestion des Prorogations
          </h1>
          <p className="text-cm-muted text-sm">Traitez les demandes d'extension de séjour soumises par les voyageurs.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-cm-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cm-muted" size={18} />
          <input
            type="text"
            placeholder="Rechercher par N° dossier ou nom..."
            className="w-full pl-10 pr-4 py-2 bg-cm-cream/30 border border-cm-border rounded-xl text-sm outline-none focus:border-cm-green-mid transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cm-cream border border-cm-border rounded-xl text-sm font-bold text-cm-text hover:bg-cm-border/20 transition-colors">
          <Filter size={18} /> Filtres
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 size={40} className="text-cm-green-mid animate-spin mb-4" />
            <p className="text-sm text-cm-muted">Chargement des données...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4">Dossier / Demandeur</th>
                  <th className="p-4">Période actuelle</th>
                  <th className="p-4">Extension demandée</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Date soumission</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50 text-sm">
                {filteredExtensions.length > 0 ? filteredExtensions.map(ext => (
                  <tr key={ext.id} className="hover:bg-cm-cream/10 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-cm-text">{ext.visa_application_number}</div>
                      <div className="text-xs text-cm-muted">{ext.applicant_name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-cm-red font-medium">Expire le {formatDate(ext.current_expiry_date)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-cm-green-mid">+{ext.requested_days} jours</div>
                      <div className="text-xs text-cm-muted">→ {formatDate(ext.new_expiry_date)}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(ext.status)}
                    </td>
                    <td className="p-4 text-cm-muted">
                      {formatDate(ext.created_at)}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => { setSelectedExt(ext); setIsModalOpen(true); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-cm-green-mid/10 text-cm-green-mid rounded-lg text-xs font-bold hover:bg-cm-green-mid hover:text-white transition-all"
                      >
                        <Eye size={14} /> Examiner
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-cm-muted italic">
                      Aucune demande de prorogation trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal d'examen */}
      {isModalOpen && selectedExt && (
        <div className="fixed inset-0 bg-cm-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-cm-border flex justify-between items-center bg-cm-cream/20">
              <h3 className="font-bold text-cm-text flex items-center gap-2">
                <RefreshCcw size={18} className="text-cm-gold" />
                Détail de la demande de prorogation
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-cm-muted hover:text-cm-red">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-cm-muted uppercase">Demandeur</p>
                    <p className="font-bold text-cm-text">{selectedExt.applicant_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cm-muted uppercase">Dossier Original</p>
                    <p className="font-bold text-cm-green-mid">{selectedExt.visa_application_number}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-cm-muted uppercase">Extension demandée</p>
                    <p className="font-bold text-cm-text">+{selectedExt.requested_days} jours</p>
                    <p className="text-xs text-cm-muted">Fin prévue : {formatDate(selectedExt.new_expiry_date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cm-muted uppercase">Date soumission</p>
                    <p className="text-sm">{formatDate(selectedExt.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-cm-cream/30 p-5 rounded-2xl border border-cm-border flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-cm-muted uppercase mb-2">Motif de la demande</p>
                  <p className="text-sm text-cm-text leading-relaxed">"{selectedExt.reason}"</p>
                </div>
                {selectedExt.extension_proof_url && (
                  <a 
                    href={selectedExt.extension_proof_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 p-3 bg-white border border-cm-border rounded-xl hover:bg-cm-cream transition-all group"
                  >
                    <FileText size={20} className="text-cm-gold group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-cm-muted uppercase">Justificatif</span>
                  </a>
                )}
              </div>

              {selectedExt.status === 'SUBMITTED' || selectedExt.status === 'PROCESSING' ? (
                <div className="space-y-4 pt-4 border-t border-cm-border">
                  <label className="block text-sm font-bold text-cm-text mb-2">Décision de l'Agent</label>
                  <textarea
                    placeholder="Notes internes ou motif de rejet (obligatoire en cas de rejet)..."
                    className="w-full px-4 py-3 bg-white border border-cm-border rounded-xl text-sm outline-none focus:border-cm-green-mid min-h-[100px]"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => handleAction('REJECTED')}
                      disabled={actionLoading}
                      className="py-3 px-6 bg-cm-red/10 text-cm-red rounded-xl font-bold text-sm hover:bg-cm-red hover:text-white transition-all border border-cm-red/20 disabled:opacity-50"
                    >
                      {actionLoading ? 'Chargement...' : 'Rejeter la demande'}
                    </button>
                    <button
                      onClick={() => handleAction('APPROVED')}
                      disabled={actionLoading}
                      className="py-3 px-6 bg-cm-green-mid text-white rounded-xl font-bold text-sm hover:bg-cm-green transition-all shadow-lg shadow-cm-green/20 disabled:opacity-50"
                    >
                      {actionLoading ? 'Chargement...' : 'Approuver la prorogation'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-cm-border">
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${selectedExt.status === 'APPROVED' ? 'bg-cm-green-pale/10 text-cm-green-mid border border-cm-green-pale' : 'bg-cm-red/5 text-cm-red border border-cm-red/20'}`}>
                    {selectedExt.status === 'APPROVED' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    <div>
                      <p className="text-sm font-bold">Demande déjà traitée : {selectedExt.status}</p>
                      {selectedExt.rejection_reason && <p className="text-xs mt-1">Motif : {selectedExt.rejection_reason}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
