import React, { useState, useEffect } from 'react';
import { Save, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'APPLICANT',
    password: '',
    is_active: true
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchUser = async () => {
        try {
          const data = await adminService.getUserById(id);
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone_number || data.phone || '',
            role: data.role || 'APPLICANT',
            password: '', // Le mot de passe ne s'affiche jamais par sécurité
            is_active: data.is_active !== undefined ? data.is_active : true
          });
        } catch (error) {
          toast.error("Impossible de charger les données de l'utilisateur.");
          navigate('/admin/users');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error('Veuillez remplir les champs obligatoires.');
      return;
    }
    if (!isEditMode && !formData.password) {
      toast.error('Un mot de passe est obligatoire pour la création.');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // En mode édition, si le mot de passe est vide, on l'enlève pour ne pas l'écraser
        const updateData = { ...formData };
        if (!updateData.password) {
          delete (updateData as any).password;
        }
        await adminService.updateUser(id!, updateData);
        toast.success('Utilisateur mis à jour avec succès !');
      } else {
        await adminService.createUser(formData);
        toast.success('Utilisateur créé avec succès !');
      }
      navigate('/admin/users');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <button onClick={() => navigate('/admin/users')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cm-green">
              {isEditMode ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Mettez à jour les informations et les accès du compte.' : 'Créez un nouvel utilisateur et définissez ses accès.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prénom <span className="text-cm-red">*</span></label>
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="Jean"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom <span className="text-cm-red">*</span></label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="Dupont"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-cm-red">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="jean.dupont@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="+237 XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe {!isEditMode && <span className="text-cm-red">*</span>}
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder={isEditMode ? "Laissez vide pour ne pas modifier" : "••••••••"}
                  required={!isEditMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rôle <span className="text-cm-red">*</span></label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="APPLICANT">Demandeur</option>
                  <option value="AGENT">Agent d'immigration</option>
                  <option value="EMBASSY">Agent Ambassade</option>
                  <option value="BORDER">Agent Frontière</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => navigate('/admin/users')}
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
                {isEditMode ? 'Mettre à jour' : 'Créer l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;
