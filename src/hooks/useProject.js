import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    fetchProject();

    // Setup real-time subscription for this project
    const subscription = supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projets',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          if (payload.new) {
            setProject(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project with joined contact and user data
      const { data, error: fetchError } = await supabase
        .from('projets')
        .select(`
          *,
          contacts:id_contact (
            id,
            prenom,
            nom,
            email,
            telephone,
            adresse,
            complement_adresse,
            origine,
            sous_origine,
            societe
          ),
          utilisateurs:id_referent (
            id,
            prenom,
            nom,
            email,
            telephone_mobile
          )
        `)
        .eq('id', projectId)
        .is('supprime_le', null)
        .single();

      if (fetchError) throw fetchError;

      // Enrich project data with joined information
      const enrichedProject = {
        ...data,
        contact: data.contacts,
        referent: data.utilisateurs
      };

      setProject(enrichedProject);
    } catch (err) {
      console.error('Erreur lors de la récupération du projet:', err);
      setError(err.message);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('projets')
        .update(updates)
        .eq('id', project.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProject(data);
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du projet:', err);
      return { success: false, error: err.message };
    }
  };

  return { project, loading, error, updateProject, refetch: fetchProject };
}
