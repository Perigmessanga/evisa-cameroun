import React, { useState } from 'react';
import { Search, QrCode, UserCheck, UserX, Clock, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const VerificationVisaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [searchResult, setSearchResult] = useState<null | 'valid' | 'invalid' | 'expired'>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Mock simulation
    if (searchQuery.includes('123')) setSearchResult('valid');
    else if (searchQuery.includes('456')) setSearchResult('expired');
    else setSearchResult('invalid');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-cm-green">Vérification de Visa</h1>
          <p className="text-gray-600">Scannez le QR code ou entrez le numéro de visa pour vérification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scan QR Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-cm-green/10 text-cm-green rounded-2xl flex items-center justify-center mb-4">
              <QrCode size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Scanner un QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">Utilisez la caméra pour scanner le QR code présent sur le e-Visa du voyageur.</p>
            
            <button 
              onClick={() => setIsScanning(!isScanning)}
              className="px-6 py-2.5 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid transition-colors w-full flex items-center justify-center gap-2"
            >
              <QrCode size={18} />
              {isScanning ? 'Arrêter le scan' : 'Démarrer le scan'}
            </button>
            
            {isScanning && (
              <div className="mt-4 w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-cm-gold">
                <p className="text-white text-sm">Caméra active - Placez le QR code ici</p>
              </div>
            )}
          </div>

          {/* Manual Entry Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <Search size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Saisie Manuelle</h3>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Visa ou Passeport</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all uppercase"
                  placeholder="Ex: CM-2023-XXXX"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2.5 border-2 border-cm-green text-cm-green font-semibold rounded-lg hover:bg-cm-green hover:text-white transition-colors w-full"
              >
                Vérifier manuellement
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Essayez avec :</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600 font-mono">123 (Valide)</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600 font-mono">456 (Expiré)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Box */}
        {searchResult && (
          <div className={`p-6 rounded-xl border ${
            searchResult === 'valid' ? 'bg-green-50 border-green-200' :
            searchResult === 'invalid' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                searchResult === 'valid' ? 'bg-green-100 text-cm-green' :
                searchResult === 'invalid' ? 'bg-red-100 text-cm-red' :
                'bg-yellow-100 text-cm-gold'
              }`}>
                {searchResult === 'valid' ? <UserCheck size={32} /> :
                 searchResult === 'invalid' ? <UserX size={32} /> :
                 <Clock size={32} />}
              </div>
              
              <div className="flex-1">
                <h2 className={`text-xl font-bold mb-1 ${
                  searchResult === 'valid' ? 'text-cm-green' :
                  searchResult === 'invalid' ? 'text-cm-red' :
                  'text-cm-gold'
                }`}>
                  {searchResult === 'valid' ? 'Visa Valide' :
                   searchResult === 'invalid' ? 'Visa Invalide ou Introuvable' :
                   'Visa Expiré'}
                </h2>
                
                {searchResult === 'valid' && (
                  <div className="mt-4 grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-green-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Titulaire</p>
                      <p className="font-medium text-gray-800">JEAN DUPONT</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Passeport</p>
                      <p className="font-medium text-gray-800">12AB34567</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Type de Visa</p>
                      <p className="font-medium text-gray-800">Tourisme (30 jours)</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Expiration</p>
                      <p className="font-medium text-gray-800">12 Dec 2024</p>
                    </div>
                  </div>
                )}
                
                {searchResult === 'valid' && (
                  <div className="mt-6 flex justify-end gap-3">
                    <button className="px-4 py-2 bg-white border border-cm-red text-cm-red rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 font-medium">
                      <AlertTriangle size={18} />
                      Signaler un problème
                    </button>
                    <button className="px-4 py-2 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid transition-colors font-medium">
                      Enregistrer le passage
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default VerificationVisaPage;
