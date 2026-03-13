// ─────────────────────────────────────────────
//  pages/ambassade/DossierDetailPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDossiers } from '../../data/mockAmbassadeData';
import Badge from '../../components/common/Badge';
import { 
  ArrowLeft, FileText, CheckCircle2, 
  XCircle, AlertTriangle, Loader2, MessageSquare, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DossierDetailPage() {
  const { id } = useParams();
  const dossier = mockDossiers.find(d => d.id === id) || mockDossiers[0];
  const [loading, setLoading] = useState(false);
  const [avisAction, setAvisAction] = useState<'APPROVE'|'REJECT'|null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_EMBASSY': return <Badge variant="warning">Avis Requis</Badge>;
      case 'EMBASSY_APPROVED': return <Badge variant="success">Favorable</Badge>;
      case 'EMBASSY_REJECTED': return <Badge variant="danger">Défavorable</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleAvis = (type: 'APPROVE'|'REJECT') => {
    setLoading(true);
    setAvisAction(type);
    setTimeout(() => {
      setLoading(false);
      toast.success(type === 'APPROVE' ? 'Avis favorable transmis.' : 'Avis défavorable transmis.');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex items-center gap-4 mb-4">
        <Link to="/ambassade/dossiers" className="w-10 h-10 rounded-full bg-white border border-cm-border shadow-sm flex items-center justify-center text-cm-muted hover:text-cm-green-mid hover:border-cm-green-mid transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-cm-text">Avis Consulaire</h1>
          <p className="text-cm-muted text-sm mt-0.5 flex items-center gap-2">
             Dossier <span className="font-mono font-bold text-cm-text">{dossier.id}</span>
          </p>
        </div>
        <div className="ml-auto">
          {getStatusBadge(dossier.status)}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         
         {/* ── LEFT COL: INFO ── */}
         <div className="md:col-span-2 space-y-6">
            
            {/* Applicant General Info */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-cm-border overflow-hidden">
               <div className="p-6 border-b border-cm-border flex justify-between items-start bg-cm-cream/30">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-cm-cream border border-cm-border flex items-center justify-center font-display font-bold text-2xl text-cm-text shadow-inner">
                        {dossier.applicantName[0]}
                     </div>
                     <div>
                        <h2 className="font-bold text-xl text-cm-text">{dossier.applicantName}</h2>
                        <p className="text-sm font-semibold text-cm-muted mt-1">{dossier.nationality}</p>
                     </div>
                  </div>
               </div>
               <div className="p-6 grid sm:grid-cols-2 gap-6">
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Type de Visa Demandé</p>
                     <p className="font-bold text-cm-text">{dossier.type === 'VCS' ? 'Court Séjour (Tourisme)' : dossier.type === 'VLS' ? 'Long Séjour' : 'Transit'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Date de Soumission</p>
                     <p className="font-bold text-cm-text">{new Date(dossier.submissionDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Motif du Séjour</p>
                     <p className="font-semibold text-cm-text">Visite Touristique / Familiale</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Durée Prévue</p>
                     <p className="font-semibold text-cm-text">30 Jours</p>
                  </div>
               </div>
            </div>

            {/* Documents Overview */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-cm-border p-6">
               <h3 className="font-bold text-lg text-cm-text mb-4 flex items-center gap-2">
                  <FileText className="text-cm-gold" size={20} /> Documents Fournis
               </h3>
               <div className="space-y-3">
                  {['Passeport (Copie)', 'Billet Aller-Retour', 'Réservation Hôtel', 'Lettre d\'invitation'].map((doc, i) => (
                     <div key={i} className="flex justify-between items-center p-3 sm:p-4 bg-cm-cream/50 border border-cm-border/50 rounded-xl hover:bg-white transition-colors">
                        <span className="font-semibold text-sm text-cm-text">{doc}</span>
                        <button className="flex items-center gap-2 text-xs font-bold text-cm-green-mid hover:text-cm-green transition-colors px-3 py-1.5 bg-cm-green-pale/10 rounded-lg">
                           <ExternalLink size={14} /> Voir
                        </button>
                     </div>
                  ))}
               </div>
            </div>

         </div>

         {/* ── RIGHT COL: ACTIONS ── */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-cm-border p-6 sticky top-6">
               <h3 className="font-bold text-lg text-cm-text mb-2">Décision Consulaire</h3>
               <p className="text-xs text-cm-muted mb-6">Émettez un avis formel sur cette demande. Cet avis sera transmis à la DGSN pour décision finale globale.</p>

               {dossier.status === 'WAITING_EMBASSY' ? (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-cm-muted uppercase tracking-wider mb-2">Note / Justificatif</label>
                        <textarea 
                           className="w-full h-24 p-3 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid outline-none resize-none"
                           placeholder="Ex: Le motif de séjour semble valide, ou le passeport expire bientôt..."
                        ></textarea>
                     </div>

                     <button 
                        disabled={loading}
                        onClick={() => handleAvis('APPROVE')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cm-green-mid text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {loading && avisAction === 'APPROVE' ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Avis Favorable</>}
                     </button>
                     
                     <button 
                        disabled={loading}
                        onClick={() => handleAvis('REJECT')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-cm-red text-cm-red rounded-xl font-bold text-sm hover:bg-cm-red/5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {loading && avisAction === 'REJECT' ? <Loader2 size={18} className="animate-spin" /> : <><XCircle size={18} /> Avis Défavorable</>}
                     </button>

                     <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cm-cream text-cm-text rounded-xl font-bold text-sm hover:bg-cm-border/50 transition-all">
                        <MessageSquare size={18} /> Contacter l'Agent DGSN
                     </button>
                  </div>
               ) : (
                  <div className={`p-4 rounded-xl border flex gap-3 ${dossier.status === 'EMBASSY_APPROVED' ? 'bg-cm-green-pale/10 border-cm-green/30' : 'bg-cm-red/5 border-cm-red/20'}`}>
                     <div className="shrink-0 mt-0.5">
                        {dossier.status === 'EMBASSY_APPROVED' ? <CheckCircle2 className="text-cm-green-mid" size={20} /> : <AlertTriangle className="text-cm-red" size={20} />}
                     </div>
                     <div>
                        <h4 className={`font-bold text-sm ${dossier.status === 'EMBASSY_APPROVED' ? 'text-cm-green-mid' : 'text-cm-red'}`}>
                           {dossier.status === 'EMBASSY_APPROVED' ? 'Avis Favorable Donné' : 'Avis Défavorable Donné'}
                        </h4>
                        <p className={`text-xs mt-1 ${dossier.status === 'EMBASSY_APPROVED' ? 'text-cm-green' : 'text-cm-red/80'}`}>
                           Cet avis a été transmis à la DGSN le {new Date().toLocaleDateString('fr-FR')}. Il ne peut plus être modifié.
                        </p>
                     </div>
                  </div>
               )}

            </div>

         </div>

      </div>
    </div>
  );
}
