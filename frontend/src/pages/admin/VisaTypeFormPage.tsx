import React, { useState, useEffect } from 'react';
import { Save, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const VisaTypeFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    validity_days: 90,
    max_stay_days: 30,
    fee: 0,
    processing_time_days: 5,
    is_active: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value)
    }));
  };

  useEffect(() => {
    if (isEditMode && id) {
      const fetchVisaType = async () => {
        try {
          const data = await adminService.getVisaTypeById(id);
          setFormData({
            code: data.code || '',
            name: data.name || '',
            description: data.description || '',
            validity_days: data.validity_days || 90,
            max_stay_days: data.max_stay_days || 30,
            fee: data.fee !== undefined ? data.fee : 0,
            processing_time_days: data.processing_time_days || 5,
            is_active: data.is_active !== undefined ? data.is_active : true
          });
        } catch (error) {
          toast.error('Impossible de charger le type de visa');
          navigate('/admin/visa-types');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchVisaType();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || formData.fee === undefined) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await adminService.updateVisaType(id!, formData);
        toast.success('Type de visa mis à jour avec succès');
      } else {
        await adminService.createVisaType(formData);
        toast.success('Type de visa créé avec succès');
      }
      navigate('/admin/visa-types');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-cm-green-mid" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/admin/visa-types')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cm-green">
              {isEditMode ? 'Modifier Type de Visa' : 'Nouveau Type de Visa'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Modifiez les paramètres de ce type de visa.' : 'Configurez les paramètres pour ce nouveau type de visa.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations Générales */}
            <div>
              <h3 className="text-lg font-semibold border-b border-gray-100 pb-2 mb-4 text-cm-green">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Code Visa <span className="text-cm-red">*</span></label>
                  <input 
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all uppercase"
                    placeholder="Ex: T-30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nom du Visa <span className="text-cm-red">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    placeholder="Visa Touristique 30 jours"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Durée de validité (Jours) <span className="text-cm-red">*</span></label>
                  <input 
                    type="number" 
                    name="validity_days"
                    value={formData.validity_days}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Durée max séjour (Jours) <span className="text-cm-red">*</span></label>
                  <input 
                    type="number" 
                    name="max_stay_days"
                    value={formData.max_stay_days}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tarif Officiel (FCFA) <span className="text-cm-red">*</span></label>
                  <input 
                    type="number" 
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Délai Traitement (Jours) <span className="text-cm-red">*</span></label>
                  <input 
                    type="number" 
                    name="processing_time_days"
                    value={formData.processing_time_days}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="block text-sm font-medium text-gray-700">Description / Règles Métiers</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="Exigences spécifiques pour l'obtention de ce visa..."
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-cm-green focus:ring-cm-green border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Activer ce type de visa (visible par le public)
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 flex-col sm:flex-row">
              <button 
                type="button" 
                onClick={() => navigate('/admin/visa-types')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors font-medium w-full sm:w-auto"
              >
                <X size={18} />
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid flex items-center justify-center gap-2 transition-colors font-medium w-full sm:w-auto disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isEditMode ? 'Enregistrer les modifications' : 'Créer Type de Visa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisaTypeFormPage;
