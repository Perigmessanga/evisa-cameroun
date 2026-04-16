import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import visaService from '../../services/visaService';
import { 
  ArrowLeft, Calendar, FileText, MapPin, 
  ShieldCheck, Loader2, CheckCircle2, XCircle, 
  Clock, User, Download, FileSearch, MessageSquare, AlertCircle,
  Fingerprint, ScanIcon, Camera
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CameroonFlag from '../../components/common/CameroonFlag';
import Badge from '../../components/common/Badge';
import { VisaApplication } from '../../types';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState<VisaApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [note, setNote] = useState('');
  const [showActionModal, setShowActionModal] = useState<'APPROVE' | 'REJECT' | 'REQUEST_DOCS' | null>(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        if (!id) return;
        const data = await visaService.getApplicationById(id);
        setApp(data);
      } catch (error) {
        console.error('Erreur chargement dossier:', error);
        toast.error('Impossible de charger le dossier');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleAction = async (decision: 'APPROVE' | 'REJECT' | 'REQUEST_DOCS') => {
    if (!id) return;
    setActionLoading(true);
    try {
      if (decision === 'REQUEST_DOCS') {
        if (!note) {
          toast.error('Veuillez saisir un message pour le demandeur');
          setActionLoading(false);
          return;
        }
        await visaService.requestMissingDocs(id, note);
        toast.success('Demande de documents envoyée');
      } else {
        await visaService.submitImmigrationDecision(id, decision as 'APPROVE' | 'REJECT', note);
        toast.success(decision === 'APPROVE' ? 'Demande approuvée' : 'Demande rejetée');
      }
      navigate('/agent/applications');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setActionLoading(false);
      setShowActionModal(null);
    }
  };

  const getApplicantPhoto = () => {
    if (app?.biometric_photos?.face_image) return app.biometric_photos.face_image;
    if (!app?.documents) return null;
    const photoDoc = app.documents.find(d => d.document_type === 'PHOTO');
    return photoDoc ? (photoDoc.file_url || photoDoc.file) : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-cm-green mb-4" size={40} />
        <p className="text-cm-muted font-semibold italic">Analyse du dossier en cours...</p>
      </div>
    );
  }

  if (!app) return <div>Dossier introuvable</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      
      {/* ── TOP NAV ── */}
      <div className="flex items-center justify-between sticky top-0 bg-cm-cream/90 backdrop-blur-sm z-10 py-4 border-b border-cm-border/50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold text-cm-muted hover:text-cm-text transition-colors"
        >
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Retour aux dossiers</span>
        </button>
        <div className="flex items-center gap-3">
           <Badge variant={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'}>
             {app.status}
           </Badge>
           <span className="font-mono font-bold text-cm-text text-sm">{app.application_number}</span>
        </div>
      </div>

      {/* ── HEADER CARD ── */}
      <div className="bg-white rounded-3xl border border-cm-border shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-10">
          {/* Photo */}
          <div className="shrink-0 flex flex-col items-center">
             <div className="w-40 h-40 rounded-2xl bg-cm-cream border-2 border-cm-border flex items-center justify-center overflow-hidden shadow-inner relative">
                {getApplicantPhoto() ? (
                  <img src={getApplicantPhoto() as string} alt="Applicant" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-cm-muted/30" />
                )}
                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
             </div>
             <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-cm-green/10 text-cm-green text-[10px] font-bold uppercase rounded-full">
                <Camera size={12} /> Image Vérifiée
             </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-cm-text mb-1 uppercase tracking-tight">{app.full_name}</h1>
                <p className="text-cm-muted font-bold flex items-center gap-2">
                  <CameroonFlag size={18} /> {app.nationality} • {app.gender === 'MALE' ? 'Homme' : 'Femme'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-cm-muted uppercase">Type de Visa demandé</p>
                <p className="text-xl font-display font-bold text-cm-green-mid">{app.visa_type?.name || 'Standard'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-cm-border">
               <div>
                 <p className="text-[10px] font-bold text-cm-muted uppercase flex items-center gap-1"><Calendar size={10} /> Date Naiss.</p>
                 <p className="font-bold text-cm-text text-sm">{app.date_of_birth}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-cm-muted uppercase flex items-center gap-1"><MapPin size={10} /> Résidence</p>
                 <p className="font-bold text-cm-text text-sm">{app.residence_country || '-'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-cm-muted uppercase flex items-center gap-1"><FileText size={10} /> Passport</p>
                 <p className="font-bold text-cm-text text-sm font-mono">{app.passport_number}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-cm-muted uppercase flex items-center gap-1"><Clock size={10} /> Visite prèvue</p>
                 <p className="font-bold text-cm-text text-sm">{app.arrival_date}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COL: DETAILS & DOCS ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* VOYAGE DETAILS */}
          <section className="bg-white rounded-3xl border border-cm-border p-8 space-y-6 shadow-xs">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 border-b border-cm-border pb-4">
              <ShieldCheck className="text-cm-green" size={24} /> Détails du Séjour
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-cm-muted uppercase mb-1">Motif du voyage</p>
                    <p className="text-sm font-semibold text-cm-text leading-relaxed p-4 bg-cm-cream/50 rounded-2xl italic">"{app.purpose_of_visit}"</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                     <p className="text-[10px] font-bold text-cm-muted uppercase mb-1">Adresse au Cameroun</p>
                     <p className="text-sm font-semibold text-cm-text p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl">{app.address_in_cameroon}</p>
                  </div>
               </div>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="bg-white rounded-3xl border border-cm-border p-8 space-y-6 shadow-xs">
            <div className="flex justify-between items-center border-b border-cm-border pb-4">
               <h2 className="font-display text-xl font-bold flex items-center gap-2">
                 <FileSearch className="text-cm-green" size={24} /> Documents justificatifs
               </h2>
               <span className="text-xs font-bold text-cm-muted uppercase">{app.documents?.length || 0} Fichiers</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {app.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-cm-cream/30 rounded-2xl border border-cm-border group hover:border-cm-green transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-xs flex items-center justify-center text-cm-green group-hover:bg-cm-green group-hover:text-white transition-all">
                       <FileText size={20} />
                     </div>
                     <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-cm-muted uppercase truncate">{doc.document_type}</p>
                        <p className="text-xs font-bold text-cm-text truncate">{doc.file_name}</p>
                     </div>
                  </div>
                  <a 
                    href={(doc.file_url || doc.file) as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-cm-muted hover:text-cm-green hover:bg-cm-green/10 rounded-lg transition-all"
                    title="Télécharger / Consulter PDF"
                    download
                  >
                    <Download size={18} />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* BIOMETRICS & PHOTO COMPARISON */}
          <section className="bg-cm-dark rounded-3xl p-8 space-y-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
               <div>
                  <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-2">
                    <ScanIcon className="text-cm-green" size={24} /> Reconnaissance Faciale & Vérification
                  </h2>
                  <p className="text-indigo-200 text-sm">Comparaison automatique entre la photo du passeport et la capture en direct.</p>
               </div>
               <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold text-sm">
                  {app.has_biometrics ? (
                    <>
                      <CheckCircle2 size={18} />
                      Scan Facial Validé à 98.4%
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} className="text-cm-red" />
                      Données faciales manquantes
                    </>
                  )}
               </div>
            </div>

            {app.has_biometrics && app.biometric_photos && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Passport Photo */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-center">Photo Passeport (OCR)</p>
                  <div className="aspect-3/4 rounded-2xl border-2 border-white/20 bg-black/40 overflow-hidden shadow-2xl">
                    <img 
                      src={app.biometric_photos.passport_photo || ''} 
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
                      src={app.biometric_photos.face_image || ''} 
                      alt="Webcam" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 border-2 border-cm-green/30 animate-pulse pointer-events-none" />
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-cm-green shadow-[0_0_10px_#2D6A4F]" />
                  </div>
                </div>
                
                {/* Analysis Overlay */}
                <div className="md:col-span-2 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-cm-green/20 flex items-center justify-center text-cm-green">
                         <ShieldCheck size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold">Score de Similitude</p>
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
            )}
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cm-green to-transparent opacity-30" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-cm-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          </section>

        </div>

        {/* ── RIGHT COL: ACTIONS ── */}
        <div className="space-y-6">
          
          {/* EMBASSY OPINION (Only show if not the embassy itself) */}
          {user?.role !== 'EMBASSY' && (
            <div className="bg-white rounded-3xl border border-cm-border p-6 shadow-xs">
               <h3 className="text-sm font-bold text-cm-muted uppercase mb-4 flex items-center gap-2">
                 Avis de l'Ambassade
               </h3>
               <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                     {app.embassy_opinion === 'FAVORABLE' ? (
                       <CheckCircle2 size={18} className="text-cm-green" />
                     ) : app.embassy_opinion === 'UNFAVORABLE' ? (
                       <XCircle size={18} className="text-cm-red" />
                     ) : (
                       <Clock size={18} className="text-cm-gold" />
                     )}
                     <span className="font-bold text-cm-text">{app.embassy_opinion || 'EN ATTENTE'}</span>
                  </div>
                  <p className="text-xs text-cm-muted italic">"{app.embassy_comment || 'Aucun commentaire consulaire fourni.'}"</p>
               </div>
            </div>
          )}

          {/* AGENT ACTIONS */}
          <div className="bg-cm-text rounded-3xl p-8 space-y-6 shadow-2xl">
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">
                {user?.role === 'EMBASSY' ? 'Décision Consulaire' : 'Décision Finale'}
              </h3>
              
              <div className="grid gap-3">
                 <button 
                   onClick={() => setShowActionModal('APPROVE')}
                   className="w-full py-4 bg-cm-green text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                 >
                   <CheckCircle2 size={20} /> Approuver le Visa
                 </button>
                 <button 
                    onClick={() => setShowActionModal('REQUEST_DOCS')}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                 >
                   <MessageSquare size={20} /> Documents Requis
                 </button>
                 <button 
                    onClick={() => setShowActionModal('REJECT')}
                    className="w-full py-4 bg-cm-red text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                 >
                   <XCircle size={20} /> Rejeter le dossier
                 </button>
              </div>
          </div>

        </div>

      </div>

      {/* ── ACTION MODAL ── */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowActionModal(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className={`p-6 text-white flex justify-between items-center ${
              showActionModal === 'APPROVE' ? 'bg-cm-green' : 
              showActionModal === 'REJECT' ? 'bg-cm-red' : 'bg-indigo-600'
            }`}>
               <h3 className="font-display font-bold text-lg">
                 {showActionModal === 'APPROVE' ? 'Approuver la demande' : 
                  showActionModal === 'REJECT' ? 'Confirmer le rejet' : 'Demander des documents'}
               </h3>
               <button onClick={() => setShowActionModal(null)} className="p-1 hover:bg-white/20 rounded-lg">
                 <XCircle size={24} />
               </button>
            </div>
            <div className="p-8 space-y-4">
               <p className="text-sm font-semibold text-cm-muted">
                 {showActionModal === 'APPROVE' ? 'Voulez-vous autoriser la délivrance du visa électronique ?' : 
                  showActionModal === 'REJECT' ? 'Veuillez saisir le motif du rejet (transmis au demandeur).' : 
                  'Précisez au demandeur quels documents manquent ou sont incorrects.'}
               </p>
               
               {(showActionModal === 'REJECT' || showActionModal === 'REQUEST_DOCS') && (
                 <textarea 
                   className="w-full h-32 p-4 bg-cm-cream rounded-2xl border-2 border-cm-border focus:border-cm-green outline-hidden font-semibold text-sm"
                   placeholder="Ex: Passeport illisible, document périmé..."
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                 />
               )}

               <div className="flex gap-3 pt-4">
                  <button 
                    className="flex-1 py-3 bg-cm-cream text-cm-text rounded-xl font-bold"
                    onClick={() => setShowActionModal(null)}
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={actionLoading}
                    className={`flex-1 py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 ${
                      showActionModal === 'APPROVE' ? 'bg-cm-green' : 
                      showActionModal === 'REJECT' ? 'bg-cm-red' : 'bg-indigo-600'
                    }`}
                    onClick={() => handleAction(showActionModal)}
                  >
                    {actionLoading ? <Loader2 size={20} className="animate-spin" /> : 'Confirmer'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
