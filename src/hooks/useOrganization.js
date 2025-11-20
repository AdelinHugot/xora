import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOrganization() {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Récupérer l'ID de l'organisation de l'utilisateur
      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', user.id)
        .single();

      if (authError) throw authError;

      // Récupérer les données de l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', authData.id_organisation)
        .single();

      if (orgError) throw orgError;

      setOrganization(orgData);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'organisation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (updates) => {
    try {
      setError(null);

      if (!organization) {
        throw new Error('Aucune organisation chargée');
      }

      const { data, error } = await supabase
        .from('organisations')
        .update(updates)
        .eq('id', organization.id)
        .select()
        .single();

      if (error) throw error;

      setOrganization(data);
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'organisation:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    organization,
    loading,
    error,
    updateOrganization,
    refetch: fetchOrganization
  };
}
