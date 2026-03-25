import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';

const BiometricPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = location.state?.applicationId;

  const [cameraActive, setCameraActive] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [captureUrl, setCaptureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!applicationId) {
      toast.error('Aucune demande en cours. Veuillez recommencer.');
      navigate('/applicant/dashboard');
    }
  }, [applicationId, navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCaptured(false);
        setCaptureUrl(null);
      }
    } catch (err) {
      toast.error('Impossible d\'accéder à la caméra.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCaptureUrl(dataUrl);
        setCaptured(true);
        stopCamera();
      }
    }
  };

  const submitPhoto = async () => {
    if (!captureUrl || !applicationId) return;
    setLoading(true);

    try {
      // Convert Data URL to Blob -> File
      const res = await fetch(captureUrl);
      const blob = await res.blob();
      const file = new File([blob], 'biometric_face.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('application', applicationId);
      formData.append('face_image', file);
      
      await applicationService.submitBiometric(formData);
      
      toast.success('Données biométriques enregistrées !');
      navigate('/applicant/payment', { state: { applicationId } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de la soumission biométrique.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn space-y-6">
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
              
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover ${cameraActive && !captured ? 'block' : 'hidden'}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {captureUrl && (
                <img src={captureUrl} alt="Capture" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {!cameraActive && !captured && !captureUrl ? (
                <div className="text-center space-y-4 p-6 z-10">
                  <div className="bg-white p-4 rounded-full inline-block text-cm-green">
                    <Camera size={48} />
                  </div>
                  <p className="text-sm text-gray-500">Caméra inactive</p>
                </div>
              ) : cameraActive && !captured ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                  <div className="w-48 h-64 border-2 border-dashed border-white rounded-full bg-black/10 shadow-[0_0_0_999px_rgba(0,0,0,0.5)]" />
                  <p className="absolute bottom-4 text-white text-sm font-semibold tracking-wide drop-shadow-md">Placez votre visage au centre</p>
                </div>
              ) : captured ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <CheckCircle size={64} className="text-cm-green drop-shadow-md" />
                  <p className="absolute bottom-4 text-white font-medium drop-shadow-md">Capture réussie</p>
                </div>
              ) : null}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center w-full">
              {!cameraActive && !captured ? (
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid transition-colors flex items-center gap-2 font-semibold"
                >
                  <Camera size={20} />
                  Activer la caméra
                </button>
              ) : cameraActive && !captured ? (
                <button
                  onClick={takePhoto}
                  className="px-6 py-3 bg-cm-red text-white rounded-lg hover:bg-cm-red-light transition-colors flex items-center gap-2 font-semibold"
                >
                  <Camera size={20} />
                  Prendre la photo
                </button>
              ) : (
                <>
                  <button
                    onClick={startCamera}
                    disabled={loading}
                    className="px-6 py-3 bg-white border border-cm-gold text-cm-gold rounded-lg hover:bg-cm-cream transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
                  >
                    <RefreshCw size={20} />
                    Reprendre
                  </button>
                  <button 
                    onClick={submitPhoto} 
                    disabled={loading}
                    className="px-6 py-3 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid transition-colors flex items-center gap-2 font-semibold disabled:opacity-70 disabled:hover:translate-y-0 shadow-lg"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
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
  );
};

export default BiometricPage;
