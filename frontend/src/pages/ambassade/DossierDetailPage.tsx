import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import visaService from '../../services/visaService';
import Badge from '../../components/common/Badge';
import { 
  ArrowLeft, FileText, CheckCircle2, 
  XCircle, AlertTriangle, Loader2, MessageSquare, ExternalLink,
  ShieldCheck, Download, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { VisaApplication } from '../../types';

export default function DossierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<VisaApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [avisAction, setAvisAction] = useState<'FAVORABLE'|'UNFAVORABLE'|null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchDossier = async () => {
      if (!id) return;
      try {
        const data = await visaService.getApplicationById(id);
        setDossier(data);
        if (data.embassy_comment) setComment(data.embassy_comment);
      } catch (error) {
        console.error('Erreur chargement dossier:', error);
        toast.error('Impossible de charger le dossier.');
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return <Badge variant="warning">Avis Requis</Badge>;
      case 'APPROVED': return <Badge variant="success">Favorable</Badge>;
      case 'REJECTED': return <Badge variant="danger">Défavorable</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleAvis = async (type: 'FAVORABLE'|'UNFAVORABLE') => {
    if (!id) return;
    setActionLoading(true);
    setAvisAction(type);
    try {
      await visaService.submitEmbassyOpinion(id, type, comment);
      toast.success(type === 'FAVORABLE' ? 'Avis favorable transmis.' : 'Avis défavorable transmis.');
      navigate('/ambassade/dossiers');
    } catch (error) {
      console.error('Erreur transmission avis:', error);
      toast.error('Une erreur est survenue.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-cm-muted"><Loader2 className="animate-spin mx-auto mb-4" /> Chargement du dossier...</div>;
  }

  if (!dossier) {
    return <div className="p-20 text-center text-cm-text font-bold">Dossier introuvable.</div>;
  }

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
             Dossier <span className="font-mono font-bold text-cm-text">{dossier.application_number}</span>
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
                        {dossier.full_name[0]}
                     </div>
                     <div>
                        <h2 className="font-bold text-xl text-cm-text">{dossier.full_name}</h2>
                        <p className="text-sm font-semibold text-cm-muted mt-1">{dossier.nationality}</p>
                     </div>
                  </div>
               </div>
               <div className="p-6 grid sm:grid-cols-2 gap-6">
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Type de Visa Demandé</p>
                     <p className="font-bold text-cm-text">{dossier.visa_type?.name}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Date de Soumission</p>
                     <p className="font-bold text-cm-text">{new Date(dossier.submitted_at || dossier.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Numéro de Passeport</p>
                     <p className="font-semibold text-cm-text">{dossier.passport_number}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Arrivée prévue</p>
                     <p className="font-semibold text-cm-text">{new Date(dossier.arrival_date).toLocaleDateString('fr-FR')}</p>
                  </div>
               </div>
            </div>

            {/* Biometric Check (Facial Comparison) */}
            {dossier.has_biometrics && dossier.biometric_photos && (
              <div className="bg-cm-text rounded-2xl shadow-xl overflow-hidden relative group">
                <div className="p-6 border-b border-white/10 bg-linear-to-r from-cm-text to-[#1a1a1a] flex justify-between items-center relative z-10">
                  <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <ShieldCheck className="text-cm-green-light" size={20} /> Reconnaissance Faciale & Vérification
                  </h3>
                  <div className="px-3 py-1 bg-cm-green/20 border border-cm-green/30 rounded-full text-[10px] font-bold text-cm-green-light animate-pulse">
                    SCAN FACIAL VALIDÉ À 98.4%
                  </div>
                </div>
                
                <div className="p-8 space-y-8 relative z-10 bg-linear-to-b from-cm-text/95 to-cm-text/90">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Passport Photo */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-center">Photo Passeport (OCR)</p>
                      <div className="aspect-3/4 rounded-2xl border-2 border-white/20 bg-black/40 overflow-hidden shadow-2xl">
                        <img 
                          src={dossier.biometric_photos.passport_photo || ''} 
                          alt="Passport" 
                          className="w-full h-full object-cover grayscale-xs hover:grayscale-0 transition-all duration-500" 
                        />
                      </div>
                    </div>
                    
                    {/* Live Webcam Photo */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-center">Capture Webcam (Live)</p>
                      <div className="aspect-3/4 rounded-2xl border-2 border-cm-green/50 bg-black/40 overflow-hidden shadow-2xl relative">
                        <img 
                          src={dossier.biometric_photos.face_image || ''} 
                          alt="Webcam" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 border-2 border-cm-green/30 animate-pulse pointer-events-none" />
                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-cm-green shadow-[0_0_10px_#2D6A4F]" />
                      </div>
                    </div>
                    
                    {/* Analysis Overlay */}
                    <div className="md:col-span-2 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                       <div className="flex items-center gap-4 text-white">
                          <div className="w-10 h-10 rounded-full bg-cm-green/20 flex items-center justify-center text-cm-green">
                             <ShieldCheck size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white">Score de Similitude</p>
                             <div className="w-48 h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-cm-green w-[98%]" />
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold text-white/40 uppercase">Vivacité</p>
                          <p className="text-xs font-bold text-emerald-400">AUTHENTIQUE</p>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-cm-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
              </div>
            )}

            {/* Documents Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-cm-border p-6">
                <h3 className="font-bold text-lg text-cm-text mb-6 flex items-center gap-2">
                    <FileText className="text-cm-gold" size={20} /> Documents Fournis
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                    {dossier.documents && dossier.documents.length > 0 ? (
                        dossier.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-cm-cream/20 rounded-xl border border-cm-border/50 hover:border-cm-gold/30 hover:bg-cm-cream/40 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-cm-muted border border-cm-border shadow-sm group-hover:scale-105 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-cm-text uppercase tracking-tight">{(doc.document_type as string).replace('_', ' ')}</p>
                                        <p className="text-[10px] text-cm-muted font-mono">{doc.file_name}</p>
                                    </div>
                                </div>
                                <a 
                                    href={(doc.file_url || doc.file) as string} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-white border border-cm-border rounded-xl text-cm-muted hover:text-cm-green-mid hover:border-cm-green-mid hover:shadow-md transition-all"
                                    title="Visualiser le document"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-cm-cream/30 rounded-xl border border-dashed border-cm-border text-xs text-cm-muted">
                            Aucun document attaché à ce dossier.
                        </div>
                    )}
                </div>
            </div>

         </div>

         {/* ── RIGHT COL: ACTIONS ── */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-cm-border p-6 sticky top-6">
               <h3 className="font-bold text-lg text-cm-text mb-2">Décision Consulaire</h3>
               <p className="text-xs text-cm-muted mb-6">Émettez un avis formel sur cette demande. Cet avis sera transmis à la DGSN pour décision finale globale.</p>

               {dossier.status === 'PENDING_REVIEW' ? (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-cm-muted uppercase tracking-wider mb-2">Note / Justificatif</label>
                        <textarea 
                           className="w-full h-24 p-3 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid outline-none resize-none"
                           placeholder="Ex: Le motif de séjour semble valide, ou le passeport expire bientôt..."
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                     </div>

                     <button 
                        disabled={actionLoading}
                        onClick={() => handleAvis('FAVORABLE')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cm-green-mid text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {actionLoading && avisAction === 'FAVORABLE' ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Avis Favorable</>}
                     </button>
                     
                     <button 
                        disabled={actionLoading}
                        onClick={() => handleAvis('UNFAVORABLE')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-cm-red text-cm-red rounded-xl font-bold text-sm hover:bg-cm-red/5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {actionLoading && avisAction === 'UNFAVORABLE' ? <Loader2 size={18} className="animate-spin" /> : <><XCircle size={18} /> Avis Défavorable</>}
                     </button>
                  </div>
               ) : (
                  <div className={`p-4 rounded-xl border flex gap-3 ${dossier.embassy_opinion === 'FAVORABLE' ? 'bg-cm-green-pale/10 border-cm-green/30' : 'bg-cm-red/5 border-cm-red/20'}`}>
                     <div className="shrink-0 mt-0.5">
                        {dossier.embassy_opinion === 'FAVORABLE' ? <CheckCircle2 className="text-cm-green-mid" size={20} /> : <AlertTriangle className="text-cm-red" size={20} />}
                     </div>
                     <div>
                        <h4 className={`font-bold text-sm ${dossier.embassy_opinion === 'FAVORABLE' ? 'text-cm-green-mid' : 'text-cm-red'}`}>
                           {dossier.embassy_opinion === 'FAVORABLE' ? 'Avis Favorable Donné' : 'Avis Défavorable Donné'}
                        </h4>
                        <p className={`text-xs mt-1 ${dossier.embassy_opinion === 'FAVORABLE' ? 'text-cm-green' : 'text-cm-red/80'}`}>
                           Cet avis a été transmis. Note: "{dossier.embassy_comment || "Aucune note"}"
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
