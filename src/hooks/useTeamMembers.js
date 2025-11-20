import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
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

      // Récupérer tous les utilisateurs de l'organisation avec leur rôle
      const { data: members, error: membersError } = await supabase
        .from('utilisateurs')
        .select(`
          id,
          civilite,
          prenom,
          nom,
          email,
          telephone,
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
        .eq('id_organisation', authData.id_organisation)
        .order('nom', { ascending: true });

      if (membersError) throw membersError;

      setTeamMembers(members || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des membres:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (memberData) => {
    try {
      setError(null);

      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Récupérer l'ID de l'organisation
      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', user.id)
        .single();

      if (authError) throw authError;

      // Créer le nouveau membre
      const { data, error } = await supabase
        .from('utilisateurs')
        .insert([{
          ...memberData,
          id_organisation: authData.id_organisation
        }])
        .select(`
          id,
          civilite,
          prenom,
          nom,
          email,
          telephone,
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

      if (error) throw error;

      setTeamMembers(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de l\'ajout du membre:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateTeamMember = async (memberId, updates) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('utilisateurs')
        .update(updates)
        .eq('id', memberId)
        .select(`
          id,
          civilite,
          prenom,
          nom,
          email,
          telephone,
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

      if (error) throw error;

      setTeamMembers(prev =>
        prev.map(member => member.id === memberId ? data : member)
      );
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du membre:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteTeamMember = async (memberId) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('utilisateurs')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression du membre:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    teamMembers,
    loading,
    error,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers
  };
}
