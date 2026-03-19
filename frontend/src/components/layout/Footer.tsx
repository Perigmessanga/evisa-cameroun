import { Link } from 'react-router-dom';
import CameroonFlag from '../common/CameroonFlag';

export default function Footer() {
  return (
    <footer className="bg-[#08120D] pt-12 pb-8 border-t-4 border-cm-gold text-white w-full relative z-20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <CameroonFlag size={32} />
            <div className="font-display font-bold text-xl">e-Visa Cameroun</div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Obtenez votre visa officiel rapidement, en toute sécurité et sans vous déplacer. Le processus est 100% en ligne pour vous permettre de voyager en toute sérénité.
          </p>
        </div>
        <div>
          <h5 className="font-bold mb-4 text-cm-gold">Navigation</h5>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><Link to="/auth/register" className="hover:text-white transition-colors">Demander un Visa</Link></li>
            <li><Link to="/applicant/tracking" className="hover:text-white transition-colors">Suivi</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4 text-cm-gold">Légal & Contact</h5>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Mentions Légales</li>
            <li>Politique de Confidentialité</li>
            <li>Conditions Générales d'Utilisation</li>
            <li className="pt-2 text-white">support@diplomatie.cm</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 text-center text-sm text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>République du Cameroun - Ministère des Relations Extérieures. Tous droits réservés.</p>
        <p>© {new Date().getFullYear()} DGSN - MINREX</p>
      </div>
    </footer>
  );
}
