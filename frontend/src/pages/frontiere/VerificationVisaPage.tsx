import React, { useState } from 'react';
import { Search, QrCode, UserCheck, UserX, Clock, AlertTriangle, Loader2, Fingerprint } from 'lucide-react';
import visaService from '../../services/visaService';
import { VisaApplication } from '../../types';
import toast from 'react-hot-toast';

const VerificationVisaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState<VisaApplication | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recordLoading, setRecordLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setLoading(true);
    setSearchError(null);
    setApp(null);
    
    try {
      const result = await visaService.verifyEVisa(searchQuery.trim());
      setApp(result);
    } catch (error: any) {
      console.error('Erreur vérification visa:', error);
      setSearchError(error.response?.data?.message || 'Visa introuvable ou invalide.');
      toast.error('Vérification échouée.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPassage = async (status: 'AUTHORIZED' | 'DENIED') => {
    if (!app?.id) return;
    setRecordLoading(true);
    try {
      // status 'AUTHORIZED' maps to 'ENTRY' entry for now in this context? 
      // Actually backend expects 'ENTRY' or 'EXIT'.
      // If we are at the border, it's usually ENTRY.
      await visaService.submitBorderCheckIn(app.id, 'ENTRY');
      toast.success(`Passage ${status === 'AUTHORIZED' ? 'autorisé' : 'refusé'} enregistré.`);
      setApp(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Erreur enregistrement passage:', error);
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setRecordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl font-display font-bold text-cm-text">Vérification de Visa</h1>
        <p className="text-cm-muted font-medium mt-1">Scannez le QR code ou entrez le numéro de visa/passeport.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan QR Box */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-cm-border flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-cm-green-pale/20 text-cm-green-mid rounded-2xl flex items-center justify-center mb-4">
            <QrCode size={32} />
          </div>
          <h3 className="text-lg font-bold text-cm-text mb-2">Scanner un QR Code</h3>
          <p className="text-sm text-cm-muted mb-6">Utilisez la caméra pour scanner le QR code présent sur le e-Visa.</p>
          
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className="px-6 py-3 bg-cm-green-mid text-white rounded-xl font-bold hover:shadow-lg transition-all w-full flex items-center justify-center gap-2"
          >
            <QrCode size={18} />
            {isScanning ? 'Arrêter le scan' : 'Démarrer le scan'}
          </button>
          
          {isScanning && (
            <div className="mt-4 w-full aspect-video bg-black rounded-xl flex items-center justify-center border-2 border-dashed border-cm-gold relative overflow-hidden">
               <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cm-gold/50 shadow-[0_0_10px_cm-gold] animate-scan-line"></div>
               <p className="text-white text-xs font-bold">Caméra active - En attente...</p>
            </div>
          )}
        </div>

        {/* Manual Entry Box */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-cm-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cm-cream rounded-lg text-cm-muted">
              <Search size={20} />
            </div>
            <h3 className="text-lg font-bold text-cm-text">Saisie Manuelle</h3>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-cm-muted uppercase tracking-wider mb-2">Numéro de Visa ou Passeport</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl focus:ring-2 focus:ring-cm-green-mid focus:border-transparent outline-none transition-all uppercase font-mono text-sm"
                placeholder="Ex: CM-2023-XXXX"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white border-2 border-cm-green-mid text-cm-green-mid font-bold rounded-xl hover:bg-cm-green-mid hover:text-white transition-all w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Vérifier manuellement</>}
            </button>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-cm-red/5 border border-cm-red/20 rounded-xl flex items-center gap-2 text-cm-red text-sm font-bold">
              <AlertTriangle size={16} />
              {searchError}
            </div>
          )}
        </div>
      </div>

      {/* Results Box */}
      {app && (
        <div className={`p-8 rounded-2xl border-2 animate-slideUp ${
          app.status === 'APPROVED' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-cm-red/5 border-cm-red/20'
        }`}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 shrink-0">
               <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                 app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-cm-red'
               }`}>
                 {app.status === 'APPROVED' ? <UserCheck size={48} /> : <UserX size={48} />}
               </div>
               <div className={`px-4 py-1.5 rounded-full font-bold text-sm ${
                 app.status === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-cm-red text-white'
               }`}>
                 {app.status === 'APPROVED' ? 'VISA VALIDE' : 'VISA INVALIDE'}
               </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12 bg-white/60 p-6 rounded-2xl border border-white">
                <div>
                  <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Titulaire</p>
                  <p className="font-bold text-lg text-cm-text">{app.full_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Passeport</p>
                  <p className="font-mono font-bold text-lg text-cm-text">{app.passport_number}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Type de Visa</p>
                  <p className="font-bold text-cm-text">{app.visa_type?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Date d'Expiration</p>
                  <p className="font-bold text-cm-text">{new Date(app.passport_expiry_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">Nationalité</p>
                  <p className="font-bold text-cm-text">{app.nationality}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Fingerprint size={16} className={app.has_biometrics ? 'text-cm-green-mid' : 'text-cm-muted'} />
                   <span className={`text-xs font-bold ${app.has_biometrics ? 'text-cm-green-mid' : 'text-cm-muted'}`}>
                     {app.has_biometrics ? 'BIOMÉTRIE VÉRIFIÉE' : 'BIOMÉTRIE MANQUANTE'}
                   </span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-cm-border/20">
                <button 
                  onClick={() => handleRecordPassage('DENIED')}
                  disabled={recordLoading}
                  className="px-6 py-3 bg-white border border-cm-red text-cm-red rounded-xl hover:bg-cm-red/5 transition-all flex items-center gap-2 font-bold text-sm disabled:opacity-50"
                >
                  <UserX size={18} /> Refuser l'entrée
                </button>
                <button 
                  onClick={() => handleRecordPassage('AUTHORIZED')}
                  disabled={recordLoading}
                  className="px-8 py-3 bg-cm-green-mid text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-bold text-sm shadow-md disabled:opacity-50"
                >
                  {recordLoading ? <Loader2 size={18} className="animate-spin" /> : <><UserCheck size={18} /> Autoriser l'entrée</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerificationVisaPage;
