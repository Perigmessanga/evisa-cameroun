// ─────────────────────────────────────────────
//  pages/applicant/DownloadVisaPage.tsx
// ─────────────────────────────────────────────
import { useParams, Link } from 'react-router-dom';
import { Download, Printer, ArrowLeft, CheckCircle2, QrCode } from 'lucide-react';
import CameroonFlag from '../../components/common/CameroonFlag';
import { mockApplications } from '../../data/mockApplicantData';

export default function DownloadVisaPage() {
  const { id } = useParams();
  
  // Find the specific application or use a fallback
  const app = mockApplications.find(a => a.id === id) || mockApplications[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // In a real app, this would trigger a backend PDF generation/download
    alert('Simulating PDF download for ' + app.id);
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
            <p className="text-xs font-bold text-cm-muted">No: <span className="text-cm-text">{app.id}</span></p>
          </div>
        </div>

        {/* Visa Content */}
        <div className="grid md:grid-cols-4 gap-8">
          
          <div className="md:col-span-3 space-y-6">
            
            {/* Applicant Details */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Nom / Surname</p>
                <p className="font-bold text-cm-text text-sm sm:text-base uppercase">DUPONT</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Prénoms / Given Names</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">Jean-Baptiste</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Passeport / Passport N°</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">14XY89221</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Nationalité / Nationality</p>
                <p className="font-bold text-cm-text text-sm sm:text-base">FRANCE (FRA)</p>
              </div>
            </div>

            <div className="h-px w-full bg-cm-border/50" />

            {/* Visa Details */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-cm-muted uppercase tracking-wider">Type de Visa / Visa Type</p>
                <p className="font-bold text-cm-text text-sm sm:text-base uppercase">{app.type}</p>
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
            {/* Placeholder Photo */}
            <div className="w-28 h-36 bg-cm-cream border border-cm-border/70 rounded shadow-inner flex items-center justify-center p-1">
               <div className="w-full h-full bg-cm-border/20 flex items-center justify-center text-cm-muted text-[10px] text-center p-2">
                 Photo<br/>Numérisée
               </div>
            </div>

            {/* Simulated QR Code */}
            <div className="bg-white p-2 border border-cm-border shadow-sm rounded-lg flex flex-col items-center">
              <QrCode size={80} className="text-cm-text" strokeWidth={1.5} />
              <span className="text-[8px] font-mono text-cm-muted mt-1 uppercase tracking-widest">{app.id.split('-').join('')}</span>
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
