import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AddTeamMemberModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    civilite: "Mr",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    telephone_mobile: "",
    id_role: ""
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch roles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('roles')
        .select('id, nom, description')
        .order('nom');

      if (err) throw err;
      setRoles(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des rôles:', err);
      setError('Erreur lors du chargement des rôles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.prenom.trim()) {
      setError("Le prénom est requis");
      return;
    }
    if (!formData.nom.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!formData.email.trim()) {
      setError("L'email est requis");
      return;
    }
    if (!formData.id_role) {
      setError("Le rôle est requis");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Get current user's organization
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('Utilisateur non connecté');
      }

      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', authUser.id)
        .single();

      if (authError) throw authError;

      // Create the new user
      const { data, error: err } = await supabase
        .from('utilisateurs')
        .insert([{
          civilite: formData.civilite,
          prenom: formData.prenom.trim(),
          nom: formData.nom.trim(),
          email: formData.email.trim().toLowerCase(),
          telephone: formData.telephone || null,
          telephone_mobile: formData.telephone_mobile || null,
          id_role: formData.id_role,
          id_organisation: authData.id_organisation,
          statut: 'actif'
        }])
        .select(`
          id,
          civilite,
          prenom,
          nom,
          email,
          telephone,
          telephone_mobile,
          statut,
          cree_le,
          id_role,
          roles (
            id,
            nom,
            description,
            couleur
          )
        `)
        .single();

      if (err) throw err;

      // Reset form
      setFormData({
        civilite: "Mr",
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        telephone_mobile: "",
        id_role: ""
      });

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(data);
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du membre:', err);
      if (err.message.includes('duplicate key')) {
        setError('Cet email est déjà utilisé');
      } else {
        setError(err.message || 'Erreur lors de l\'ajout du salarié');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#E4E4E7] px-6 py-4 bg-white">
          <h2 className="text-lg font-semibold text-neutral-900">Ajouter un salarié</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Civilité and Name Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Civilité
              </label>
              <select
                value={formData.civilite}
                onChange={(e) => handleChange("civilite", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="Mr">Mr</option>
                <option value="Mme">Mme</option>
                <option value="Mlle">Mlle</option>
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Prénom<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                placeholder="Prénom du salarié"
                className="w-full px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Nom<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                placeholder="Nom"
                className="w-full px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Email and Role Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Rôle<span className="text-red-500">*</span>
              </label>
              <select
                value={formData.id_role}
                onChange={(e) => handleChange("id_role", e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Téléphone fixe
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                placeholder="01 23 45 67 89"
                className="w-full px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Téléphone mobile
              </label>
              <input
                type="tel"
                value={formData.telephone_mobile}
                onChange={(e) => handleChange("telephone_mobile", e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
