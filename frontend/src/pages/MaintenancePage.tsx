import { Wrench, ShieldAlert } from 'lucide-react';
import CameroonFlag from '../components/common/CameroonFlag';
import { Link } from 'react-router-dom';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(145deg, var(--color-cm-dark) 0%, var(--color-cm-green) 50%, var(--color-cm-green-mid) 100%)' }}>
      <div className="absolute inset-0 geo-pattern opacity-5" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cm-gold/10 rounded-full blur-[100px] animate-pulse-ring" />
      
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl relative z-10 border border-cm-gold/20 animate-fadeUp">
        
        <div className="flex justify-center mb-8">
          <CameroonFlag size={64} />
        </div>
        
        <div className="w-20 h-20 bg-cm-cream rounded-full flex items-center justify-center mx-auto mb-6 border border-cm-border shadow-sm">
          <Wrench size={36} className="text-cm-gold" />
        </div>
        
        <h1 className="font-display text-3xl font-bold text-cm-text mb-4">
          Maintenance en cours
        </h1>
        
        <p className="text-cm-muted leading-relaxed mb-8">
          Le portail officiel e-Visa Cameroun est actuellement en cours de maintenance technique afin d'améliorer la qualité de nos services. 
          Veuillez nous excuser pour la gêne occasionnée. Nous serons de retour très prochainement.
        </p>

        <div className="p-4 bg-cm-green-pale/20 rounded-xl flex gap-3 text-left">
          <ShieldAlert size={24} className="text-cm-green-mid shrink-0" />
          <div className="text-sm font-medium text-cm-text">
            Vos données personnelles ainsi que l'historique de vos demandes restent strictement sécurisés et intacts.
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cm-border flex justify-between items-center text-xs">
          <span className="text-cm-muted/60">© {new Date().getFullYear()} Ing.concept MESSANGA Charles Perig</span>
          <Link to="/auth/login" className="text-cm-gold/50 hover:text-cm-gold transition-colors font-bold">
            Accès Administrateur
          </Link>
        </div>
      </div>
    </div>
  );
}
