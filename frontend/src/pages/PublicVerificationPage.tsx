import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, ShieldAlert, Loader2, 
  User, Calendar, Globe, FileCheck, 
  MapPin, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import CameroonFlag from '../components/common/CameroonFlag';

export default function PublicVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      verifyVisa();
    } else {
      setLoading(false);
      setError("Aucun jeton de vérification fourni. Veuillez scanner un QR code officiel.");
    }
  }, [token]);

  const verifyVisa = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/evisas/public-verify/?token=${token}`);
      setResult(data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Signature cryptographique invalide ou visa expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cm-cream flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* ── LOGO ── */}
      <div className="flex flex-col items-center mb-10 text-center animate-fadeIn">
        <CameroonFlag size={48} className="mb-4" />
        <h1 className="font-display text-2xl font-bold text-cm-text">VÉRIFICATION OFFICIELLE</h1>
        <p className="text-[0.6rem] font-bold tracking-widest text-cm-gold uppercase mt-1">Délégation Générale à la Sûreté Nationale</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cm-border overflow-hidden animate-fadeUp">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-cm-green" size={60} />
              <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cm-green-mid" size={24} />
            </div>
            <div className="text-center">
              <p className="font-bold text-cm-text text-lg">Authentification cryptographique...</p>
              <p className="text-cm-muted text-sm mt-1">Vérification de la signature numérique de l'État.</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-cm-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-cm-red" size={48} />
            </div>
            <h2 className="text-2xl font-display font-bold text-cm-text mb-4">Authentification Échouée</h2>
            <div className="p-4 bg-cm-red/5 border border-cm-red/20 rounded-2xl mb-8">
              <p className="text-cm-error font-medium">{error}</p>
            </div>
            <p className="text-sm text-cm-muted leading-relaxed mb-8">
              Ce document n'a pas pu être validé par le système central. Il peut s'agir d'une contrefaçon ou d'une erreur de lecture. 
              <br/><span className="font-bold text-cm-red">Action requise : Refuser l'accès et contacter les autorités.</span>
            </p>
            <Link to="/" className="inline-block px-8 py-3 bg-cm-text text-white rounded-xl font-bold transition-transform hover:scale-105">
              Retour à l'accueil
            </Link>
          </div>
        ) : result && (
          <div className="relative">
            {/* Success Banner */}
            <div className="bg-cm-green p-6 text-white text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold">VISA AUTHENTIQUE</h2>
              <div className="text-[0.65rem] font-bold tracking-widest opacity-80 mt-1 uppercase">Validé par Signature Numérique Seg-DGSN</div>
            </div>

            {/* Details */}
            <div className="p-8 sm:p-10 space-y-8">
              
              <div className="flex items-start gap-6 border-b border-cm-border pb-8">
                 <div className="w-24 h-32 bg-cm-cream rounded-xl border border-cm-border flex items-center justify-center overflow-hidden shrink-0">
                    <User size={40} className="text-cm-muted/30" />
                 </div>
                 <div className="flex-1">
                    <div className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Titulaire du Visa</div>
                    <div className="text-xl font-display font-bold text-cm-text uppercase leading-tight mb-2">
                       {result.applicant_name}
                    </div>
                    <div className="flex flex-wrap gap-3">
                       <span className="flex items-center gap-1.5 px-2 py-1 bg-cm-cream rounded-md text-[10px] font-bold text-cm-text border border-cm-border">
                          <Globe size={12} /> {result.nationality}
                       </span>
                       <span className="flex items-center gap-1.5 px-2 py-1 bg-cm-cream rounded-md text-[10px] font-bold text-cm-text border border-cm-border">
                          <FileCheck size={12} /> {result.passport_number}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                 <div>
                    <div className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-3">Détails du Document</div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-bold text-cm-muted/60 uppercase">Numéro de Visa</p>
                          <p className="font-mono font-bold text-cm-green-mid">{result.visa_number}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-cm-muted/60 uppercase">Type de Visa</p>
                          <p className="font-bold text-cm-text">{result.visa_type}</p>
                       </div>
                    </div>
                 </div>
                 <div>
                    <div className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-3">Validité Temporelle</div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <Calendar className="text-cm-green" size={18} />
                          <div>
                             <p className="text-[10px] font-bold text-cm-muted/60 uppercase">Date d'Expiration</p>
                             <p className="font-bold text-cm-text">{new Date(result.expiry_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          </div>
                       </div>
                       <div className={`flex items-center gap-3 p-3 rounded-xl border ${result.is_valid ? 'bg-cm-green/5 border-cm-green/20' : 'bg-cm-red/5 border-cm-red/20'}`}>
                          {result.is_valid ? <CheckCircle2 className="text-cm-green" size={20} /> : <AlertTriangle className="text-cm-red" size={20} />}
                          <div>
                             <p className="text-[10px] font-bold text-cm-muted/60 uppercase">Statut Actuel</p>
                             <p className={`font-bold ${result.is_valid ? 'text-cm-green' : 'text-cm-red'}`}>{result.is_valid ? 'VALIDE POUR VOYAGE' : 'EXPIRÉ / INVALIDE'}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-cm-border">
                 <div className="p-4 bg-cm-cream/50 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-cm-gold shrink-0 mt-0.5" size={18} />
                    <p className="text-[10px] leading-relaxed text-cm-muted">
                       Ce certificat de vérification est généré dynamiquement par les services de l'État du Cameroun. La falsification de documents officiels est passible de poursuites pénales conformément au Code Pénal Camerounais.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-12 text-cm-muted text-xs font-medium">© {new Date().getFullYear()} e-Visa République du Cameroun — Tous droits réservés.</p>
    </div>
  );
}
