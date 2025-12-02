import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProjects(contactId = null) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [contactId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Join with contacts to get client name, and with utilisateurs to get agent name
      let query = supabase
        .from('projets')
        .select(`
          *,
          contacts:id_contact (
            id,
            prenom,
            nom
          ),
          utilisateurs:id_referent (
            id,
            prenom,
            nom
          )
        `)
        .is('supprime_le', null)
        .order('cree_le', { ascending: false });

      if (contactId) {
        query = query.eq('id_contact', contactId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to include joined information
      const enrichedData = (data || []).map(project => ({
        ...project,
        // Add joined contact info
        contact: project.contacts,
        // Add joined user (referent/agent) info
        referent: project.utilisateurs
      }));

      setProjects(enrichedData);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des projets:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      const { data, error } = await supabase
        .from('projets')
        .insert([projectData])
        .select();

      if (error) throw error;
      setProjects([data[0], ...projects]);
      return data[0];
    } catch (err) {
      console.error('Erreur lors de l\'ajout du projet:', err);
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const { data, error } = await supabase
        .from('projets')
        .update(projectData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? data[0] : p));
      return data[0];
    } catch (err) {
      console.error('Erreur lors de la modification du projet:', err);
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('projets')
        .update({ supprime_le: new Date() })
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      throw err;
    }
  };

  return { projects, loading, error, addProject, updateProject, deleteProject, refetch: fetchProjects };
}
