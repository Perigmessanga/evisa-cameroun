import { useState } from 'react';
import { 
  Scan, Search, ShieldCheck, User, 
  MapPin, Calendar, FileText, CheckCircle2, 
  XCircle, AlertTriangle, Loader2, ArrowLeft,
  Camera, StopCircle
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import visaService from '../../services/visaService';
import CameroonFlag from '../../components/common/CameroonFlag';
import Badge from '../../components/common/Badge';
import { VisaApplication } from '../../types';

export default function VerificationVisaPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrCode: any = null;
    if (isScanning) {
      // @ts-expect-error
      html5QrCode = new Html5Qrcode("reader");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText: string) => {
          setQuery(decodedText);
          setIsScanning(false);
          performSearch(decodedText);
        },
        (errorMessage: string) => {
          // ignore error logs
        }
      ).catch((err: any) => {
        console.error("Erreur démarrage scanner:", err);
        toast.error("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        setIsScanning(false);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch((e: any) => console.warn(e));
      }
    };
  }, [isScanning]);

  const performSearch = async (val: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await visaService.verifyEVisa(val);
      setResult(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Visa introuvable ou invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    performSearch(query);
  };

  const handleRecordPassage = async (action: 'ENTRY' | 'EXIT' | 'DENIED') => {
    if (!result || !result.application) return;
    
    setActionLoading(true);
    try {
      // On utilise l'ID de la demande (application) pour permettre l'enregistrement d'un refus
      // même sur un dossier non-approuvé.
      await visaService.submitBorderCheckIn(result.application.id, action);
      
      if (action === 'DENIED') {
        toast.error("Entrée refusée et enregistrée dans le système de sécurité");
      } else {
        toast.success(action === 'EXIT' ? "Sortie enregistrée" : "Autorisation d'entrée enregistrée");
      }
      
      // On vide le résultat après l'action
      setResult(null);
      setQuery('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l’enregistrement');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Visa Valide</Badge>;
      case 'REJECTED': return <Badge variant="danger">Visa Rejeté</Badge>;
      case 'EXPIRED': return <Badge variant="warning">Visa Expiré</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Scan & Vérification</h1>
          <p className="text-cm-muted font-semibold">Contrôle des titres de voyage à l'entrée/sortie</p>
        </div>
        <div className="hidden sm:block">
           <CameroonFlag size={48} />
        </div>
      </div>

      {/* ── SEARCH AREA ── */}
      <div className="bg-white p-8 rounded-3xl border border-cm-border shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            placeholder="Scannez QR Code ou entrez N° Passeport / N° Visa"
            className="w-full h-16 pl-14 pr-32 rounded-2xl border-2 border-cm-border bg-cm-cream/30 focus:border-cm-green focus:bg-white transition-all outline-hidden font-bold text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Scan className="absolute left-5 top-1/2 -translate-y-1/2 text-cm-muted group-focus-within:text-cm-green transition-colors" size={24} />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-cm-text text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            Vérifier
          </button>
        </form>

        <div className="flex flex-col items-center gap-4">
           {!isScanning ? (
             <button 
               onClick={() => setIsScanning(true)}
               className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all w-full md:w-auto"
             >
               <Camera size={24} /> Scanner le QR Code ici
             </button>
           ) : (
             <div className="w-full max-w-sm space-y-4">
                <div id="reader" className="overflow-hidden rounded-2xl border-4 border-cm-green shadow-xl bg-black min-h-[300px]"></div>
                <button 
                   onClick={() => setIsScanning(false)}
                   className="w-full flex items-center justify-center gap-2 py-3 bg-cm-red text-white rounded-xl font-bold"
                >
                   <StopCircle size={20} /> Arrêter le scan
                </button>
             </div>
           )}
        </div>
      </div>

      {/* ── RESULT AREA ── */}
      {result && (
        <div className="bg-white rounded-3xl border border-cm-border shadow-xl overflow-hidden animate-slideUp">
          
          {/* Status Header */}
          <div className={`p-6 flex items-center justify-between ${result.valid ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-4">
              {result.valid ? (
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={24} />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                  <XCircle size={24} />
                </div>
              )}
              <div>
                 <div className="text-xs font-bold uppercase tracking-wider text-cm-muted">Statut du Visa</div>
                 <div className="mt-0.5">{result.valid ? <Badge variant="success">Visa Valide</Badge> : <Badge variant="danger">Visa Invalide</Badge>}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-cm-muted">N° Visa</div>
              <div className="font-mono font-bold text-cm-text">{result.evisa?.visa_number}</div>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-10">
            {/* Passenger Info */}
            <div className="space-y-6">
              <h3 className="font-display font-bold text-lg text-cm-text flex items-center gap-2 pb-2 border-b border-cm-border">
                <User size={20} className="text-cm-green" /> Informations Voyageur
              </h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-cm-muted font-bold uppercase text-[10px]">Nom Complet</p>
                  <p className="font-bold text-cm-text text-base">{result.evisa?.applicant_name}</p>
                </div>
                <div>
                  <p className="text-cm-muted font-bold uppercase text-[10px]">Nationalité</p>
                  <p className="font-bold text-cm-text">{result.evisa?.applicant_nationality}</p>
                </div>
                <div>
                  <p className="text-cm-muted font-bold uppercase text-[10px]">N° Passeport</p>
                  <p className="font-bold text-cm-text font-mono text-base">{result.evisa?.passport_number}</p>
                </div>
              </div>
            </div>

            {/* Visa Info */}
            <div className="space-y-6">
              <h3 className="font-display font-bold text-lg text-cm-text flex items-center gap-2 pb-2 border-b border-cm-border">
                <ShieldCheck size={20} className="text-cm-green" /> Détails du Titre
              </h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-cm-muted font-bold uppercase text-[10px]">Type de Visa</p>
                  <p className="font-bold text-cm-text">{result.evisa?.visa_type_name}</p>
                </div>
                <div>
                  <p className="text-cm-muted font-bold uppercase text-[10px]">Expiration</p>
                  <p className="font-bold text-cm-text text-red-600">
                    {result.evisa?.expiry_date ? new Date(result.evisa.expiry_date).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-cm-cream/30 border-t border-cm-border flex flex-wrap gap-4">
            <button
              onClick={() => handleRecordPassage('ENTRY')}
              disabled={actionLoading || !result.valid}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              Autoriser l'Entrée
            </button>
            <button
              onClick={() => handleRecordPassage('EXIT')}
              disabled={actionLoading || !result.valid}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
              Enregistrer Sortie
            </button>
            <button
              onClick={() => handleRecordPassage('DENIED')}
              disabled={actionLoading}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 bg-cm-red text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-md"
            >
              {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <AlertTriangle size={20} />}
              Refuser l'Entrée
            </button>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-cm-border">
          <Scan className="mx-auto text-cm-muted mb-4 opacity-20" size={64} />
          <p className="text-cm-muted font-semibold">En attente de scan ou de saisie...</p>
        </div>
      )}
    </div>
  );
}
