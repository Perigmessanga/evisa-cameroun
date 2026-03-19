import React, { useState } from 'react';
import { Camera, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const BiometricPage: React.FC = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [captured, setCaptured] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-cm-green mb-2">Capture Biométrique</h1>
          <p className="text-gray-600">
            Veuillez capturer une photo de votre visage pour vérification d'identité. 
            Assurez-vous d'être dans un environnement bien éclairé.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Camera Viewfinder */}
            <div className="relative w-full max-w-md aspect-3/4 bg-gray-100 rounded-2xl overflow-hidden border-4 border-cm-gold flex items-center justify-center">
              {!cameraActive && !captured ? (
                <div className="text-center space-y-4 p-6">
                  <div className="bg-white p-4 rounded-full inline-block text-cm-green">
                    <Camera size={48} />
                  </div>
                  <p className="text-sm text-gray-500">Caméra inactive</p>
                </div>
              ) : cameraActive && !captured ? (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-full"></div>
                  <p className="absolute bottom-4 text-white text-sm">Placez votre visage au centre</p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <CheckCircle size={64} className="text-cm-green" />
                  <p className="absolute bottom-4 text-cm-green font-medium">Capture réussie</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center w-full">
              {!cameraActive && !captured ? (
                <button
                  onClick={() => setCameraActive(true)}
                  className="px-6 py-3 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid transition-colors flex items-center gap-2"
                >
                  <Camera size={20} />
                  Activer la caméra
                </button>
              ) : cameraActive && !captured ? (
                <button
                  onClick={() => {
                    setCameraActive(false);
                    setCaptured(true);
                  }}
                  className="px-6 py-3 bg-cm-red text-white rounded-lg hover:bg-cm-red-light transition-colors flex items-center gap-2"
                >
                  <Camera size={20} />
                  Prendre la photo
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCaptured(false);
                      setCameraActive(true);
                    }}
                    className="px-6 py-3 bg-white border border-cm-gold text-cm-gold rounded-lg hover:bg-cm-cream transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={20} />
                    Reprendre
                  </button>
                  <button className="px-6 py-3 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid transition-colors flex items-center gap-2">
                    <CheckCircle size={20} />
                    Valider la photo
                  </button>
                </>
              )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-cm-cream text-cm-gold rounded-lg w-full mt-6">
              <AlertCircle size={24} className="shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Instructions importantes :</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Regardez directement l'objectif</li>
                  <li>Gardez une expression neutre</li>
                  <li>Retirez vos lunettes si elles reflètent la lumière</li>
                  <li>Assurez-vous que l'éclairage est uniforme sur votre visage</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BiometricPage;
