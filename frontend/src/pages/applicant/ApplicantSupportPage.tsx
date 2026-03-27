import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, Book, ExternalLink } from 'lucide-react';


const ApplicantSupportPage: React.FC = () => {
  const faqs = [
    {
      q: "Combien de temps faut-il pour obtenir mon e-Visa ?",
      a: "Le délai de traitement standard est de 3 à 5 jours ouvrés. En cas de traitement en urgence, cela peut prendre de 24 à 48 heures."
    },
    {
      q: "Quels sont les documents requis pour un visa touristique ?",
      a: "Vous aurez besoin d'un passeport valide au moins 6 mois, d'une photo d'identité récente, d'un billet d'avion aller-retour, et d'une preuve d'hébergement."
    },
    {
      q: "Puis-je modifier ma demande après l'avoir soumise ?",
      a: "Une fois soumise et payée, la demande ne peut plus être modifiée. Veuillez vérifier toutes les informations attentivement avant le paiement."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold border-l-4 border-cm-gold pl-4 text-cm-green">
            Centre de Support et d'Assistance
          </h1>
          <p className="mt-2 text-gray-600 pl-5">
            Trouvez des réponses à vos questions ou contactez l'équipe d'assistance de l'e-Visa Cameroun.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-cm-green rounded-lg flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Par Email</h3>
            <p className="text-gray-600 mb-4 text-sm">Notre équipe vous répondra sous 24h ouvrées.</p>
            <a href="mailto:support@evisacam.cm" className="text-cm-gold font-medium hover:text-cm-gold-light flex items-center gap-1">
              support@evisacam.cm
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-cm-green rounded-lg flex items-center justify-center mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Par Téléphone</h3>
            <p className="text-gray-600 mb-4 text-sm">Disponible de 8h à 18h (GMT+1), du lundi au vendredi.</p>
            <p className="text-cm-gold font-medium">+237 2 22 22 22 22</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-cm-green rounded-lg flex items-center justify-center mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat en Direct</h3>
            <p className="text-gray-600 mb-4 text-sm">Discutez en temps réel avec un de nos agents.</p>
            <button className="px-4 py-2 bg-cm-green text-white rounded-md text-sm hover:bg-cm-green-mid transition-colors w-full">
              Démarrer le chat
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-4 bg-cm-cream border-b border-gray-100 flex items-center gap-3">
            <HelpCircle className="text-cm-gold" />
            <h2 className="text-xl font-semibold text-cm-green">Questions Fréquemment Posées</h2>
          </div>
          <div className="p-6 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className={index !== faqs.length - 1 ? "border-b border-gray-100 pb-6" : ""}>
                <h4 className="font-semibold text-gray-800 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100">
            <button className="text-cm-green font-medium flex items-center gap-2 hover:underline">
              <Book size={18} />
              Voir toute la base de connaissances
            </button>
          </div>
        </div>
      </div>
  );
};

export default ApplicantSupportPage;
