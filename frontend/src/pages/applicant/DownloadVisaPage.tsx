// ─────────────────────────────────────────────
//  pages/applicant/DownloadVisaPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Printer, ArrowLeft, CheckCircle2, QrCode, Loader2 } from 'lucide-react';
import CameroonFlag from '../../components/common/CameroonFlag';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';

export default function DownloadVisaPage() {
  const { id } = useParams<{ id: string }>();
  
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    applicationService.getApplication(id)
      .then(res => setApp(res))
      .catch(() => toast.error('Impossible de charger le visa.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-cm-green-mid mb-4" />
        <p className="text-cm-muted font-medium">Création de votre e-Visa...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-cm-muted">Visa introuvable.</p>
        <Link to="/applicant/tracking" className="text-cm-green mt-4 inline-block">Retour</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!id || !app.evisa) {
      toast.error('Erreur: e-Visa non généré.');
      return;
    }
    
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      // Remover string '/api/v1' extra se o baseUrl já tiver
      const urlBase = baseUrl.endsWith('/api/v1') ? baseUrl.slice(0, -7) : baseUrl;
      
      const response = await fetch(`${urlBase}/api/evisas/${app.evisa.id}/download/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evisa_${app.evisa.visa_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Téléchargement lancé.');
    } catch (err) {
      toast.error('Erreur lors du téléchargement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-6">
        <Link to="/applicant/tracking" className="inline-flex items-center gap-2 text-sm font-semibold text-cm-muted hover:text-cm-text transition-colors">
          <ArrowLeft size={16} /> Retour au suivi
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            Visa Approuvé <CheckCircle2 className="text-cm-green-mid" size={32} />
          </h1>
          <p className="text-cm-muted mt-1">Votre document de voyage électronique est prêt.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-cm-border text-cm-text rounded-lg font-bold text-sm hover:bg-cm-cream transition-colors shadow-sm"
          >
            <Printer size={16} /> Imprimer
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2 bg-cm-green-mid text-white rounded-lg font-bold text-sm hover:bg-cm-green transition-colors shadow-md"
          >
            <Download size={16} /> Télécharger (PDF)
          </button>
        </div>
      </div>

      {/* ── VISA DOCUMENT PREVIEW ── */}
      <div className="bg-white rounded-none sm:rounded-2xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] border border-cm-border p-8 sm:p-12 relative overflow-hidden print:shadow-none print:border-none print:p-0">
        
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-r from-cm-green-pale via-cm-green to-cm-gold" />
        
        {/* Visa Header */}
        <div className="flex justify-between items-start border-b-2 border-cm-border pb-6 mb-8">
          <div className="flex gap-4">
            <div className="opacity-90 grayscale-20">
              <CameroonFlag size={64} />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-cm-text uppercase tracking-wider">République du Cameroun</h2>
              <p className="font-display font-bold text-cm-gold tracking-widest text-sm uppercase">Republic of Cameroon</p>
              <p className="text-xs text-cm-muted mt-2">Délégation Générale à la Sûreté Nationale</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-black text-3xl tracking-widest text-cm-text/20 uppercase mb-1">E-VISA</h3>
            <p className="text-xs font-bold text-cm-muted">No: <span className="text-cm-text">{app.application_number || app.id}</span></p>
          </div>
        </div>

        {/* Visa Content */}
        <div className="grid md:grid-cols-4 gap-8">
          
          <div className="md:col-span-3 space-y-6">
            
            {/* Applicant Details */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Nom / Surname</p>
                <p className="font-bold text-cm-text text-sm sm:text-base uppercase">{app.full_name?.split(' ').pop() || 'DUPONT'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Prénoms / Given Names</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">{app.full_name?.split(' ').slice(0, -1).join(' ') || 'Jean-Baptiste'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Passeport / Passport N°</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">{app.passport_number || '14XY89221'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Nationalité / Nationality</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">{app.nationality || 'FRANCE'}</p>
              </div>
            </div>

            <div className="h-px w-full bg-cm-border/50" />

            {/* Visa Details */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Type de Visa / Visa Type</p>
                <p className="font-bold text-cm-text text-sm sm:text-base uppercase">{app.visa_type?.name || app.type}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Entrées / Entries</p>
                <p className="font-bold text-cm-text text-sm sm:text-base uppercase">MULTIPLE</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Délivré le / Issued On</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">18 Oct 2023</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Valable jusqu'au / Valid Until</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">18 Jan 2024</p>
              </div>
            </div>
            
          </div>

          {/* Right Column: Photo & QR */}
          <div className="flex flex-col items-center justify-start gap-6 border-l shrink-0 border-cm-border/50 pl-0 md:pl-8 pt-6 md:pt-0">
            {/* Real Photo if available */}
            <div className="w-28 h-36 bg-cm-cream border border-cm-border/70 rounded shadow-inner flex items-center justify-center p-1 overflow-hidden">
               {app.documents?.find((d: any) => d.document_type === 'PHOTO') ? (
                 <img 
                   src={app.documents.find((d: any) => d.document_type === 'PHOTO').file_url} 
                   alt="Profile" 
                   className="w-full h-full object-cover rounded"
                 />
               ) : (
                 <div className="w-full h-full bg-cm-border/20 flex items-center justify-center text-cm-muted text-[10px] text-center p-2">
                   Photo<br/>Numérisée
                 </div>
               )}
            </div>

            {/* Simulated QR Code */}
            <div className="bg-white p-2 border border-cm-border shadow-sm rounded-lg flex flex-col items-center">
              <QrCode size={80} className="text-cm-text" strokeWidth={1.5} />
              <span className="text-[8px] font-mono text-cm-muted mt-1 uppercase tracking-widest">{String(app.application_number || app.id).split('-')[0]}</span>
            </div>
          </div>
          
        </div>

        {/* Visa Footer Note */}
        <div className="mt-12 pt-6 border-t border-cm-border bg-cm-cream/30 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 sm:p-12 text-xs text-cm-muted leading-relaxed text-justify">
          <strong>Avis Important :</strong> Ce document est un laissez-passer électronique généré par le système d'Information de la DGSN du Cameroun. Vous devez l'imprimer et le présenter accompagné du passeport physique enregistré lors de votre contrôle aux frontières. Toute tentative de falsification entraînera des poursuites selon les lois en vigueur. This document is a computer-generated electronic pass by the DGSN Information System of Cameroon. You must print it and present it along with the physical passport registered during your border control. Any attempt to forge this document will result in prosecution under applicable laws.
        </div>

        {/* Watermark (Hidden on print, visible on screen) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] print:opacity-10 z-0 overflow-hidden">
           <div className="grayscale">
             <CameroonFlag size={800} />
           </div>
        </div>

      </div>

    </div>
  );
}
