import React, { useState, useEffect } from 'react';
import { Save, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const EmailTemplateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'SYSTEM',
    language: 'FR',
    subject: '',
    body_text: '',
    body_html: '',
    is_active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  useEffect(() => {
    if (isEditMode && id) {
      const fetchTemplate = async () => {
        try {
          const data = await adminService.getEmailTemplateById(id);
          setFormData({
            name: data.name || '',
            code: data.code || '',
            type: data.type || 'SYSTEM',
            language: data.language || 'FR',
            subject: data.subject || '',
            body_text: data.body_text || '',
            body_html: data.body_html || '',
            is_active: data.is_active !== undefined ? data.is_active : true
          });
        } catch (error) {
          toast.error("Impossible de charger le modèle d'email.");
          navigate('/admin/email-templates');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTemplate();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.subject || !formData.body_text) {
      toast.error('Veuillez remplir les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await adminService.updateEmailTemplate(id!, formData);
        toast.success("Modèle d'email mis à jour avec succès !");
      } else {
        await adminService.createEmailTemplate(formData);
        toast.success("Modèle d'email créé avec succès !");
      }
      navigate('/admin/email-templates');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde du modèle.');
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
          <button onClick={() => navigate('/admin/email-templates')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cm-green">
              {isEditMode ? 'Modifier le Modèle d\'Email' : 'Nouveau Modèle d\'Email'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Modifiez la configuration de cet email système.' : 'Configurez un nouveau template d\'email système.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom du Modèle <span className="text-cm-red">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none transition-all"
                  placeholder="Ex: Bienvenue sur e-Visa"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Code Unique <span className="text-cm-red">*</span></label>
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none transition-all uppercase"
                  placeholder="Ex: TPL-006"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Type de Modèle</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none transition-all"
                >
                  <option value="AUTH">Authentification</option>
                  <option value="APPLICATION">Dossier / Demande</option>
                  <option value="SECURITY">Sécurité</option>
                  <option value="PAYMENT">Paiement</option>
                  <option value="SYSTEM">Système</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Langue</label>
                <select 
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none transition-all"
                >
                  <option value="FR">Français</option>
                  <option value="EN">Anglais</option>
                </select>
              </div>

            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sujet de l'Email <span className="text-cm-red">*</span></label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none transition-all"
                placeholder="Ex: Accusé de réception de votre demande"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Corps du Message (Texte Brut) <span className="text-cm-red">*</span></label>
              <textarea 
                name="body_text"
                value={formData.body_text}
                onChange={handleChange}
                className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none transition-all font-mono text-sm"
                placeholder="Rédigez le texte de votre email ici..."
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-cm-green focus:ring-cm-green border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Activer ce modèle d'email
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => navigate('/admin/email-templates')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors font-medium"
              >
                <X size={18} />
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-cm-green-mid hover:bg-cm-green text-white rounded-lg flex items-center gap-2 transition-colors font-bold disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isEditMode ? 'Enregistrer les modifications' : 'Créer le modèle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateFormPage;
