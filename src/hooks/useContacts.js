import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrgId } from './useOrgId';

export function useContacts(pageSize = 20) {
  const { orgId, loading: orgLoading } = useOrgId();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(!orgId);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (orgId) {
      fetchContacts(1);
    }
  }, [pageSize, orgId]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchContacts = async (page = 1) => {
    if (!orgId) return;

    try {
      setLoading(true);
      setCurrentPage(page);

      // Get total count for pagination
      const { count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('id_organisation', orgId)
        .is('supprime_le', null);

      setTotalCount(count || 0);

      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          utilisateurs!contacts_agenceur_referent_fkey(id, prenom, nom)
        `)
        .eq('id_organisation', orgId)
        .is('supprime_le', null)
        .order('cree_le', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;

      // Renommer le champ pour maintenir la compatibilité avec transformContactForDirectory
      const contactsWithCreator = data.map(contact => ({
        ...contact,
        ajoute_par: contact.utilisateurs
      }));

      setContacts(contactsWithCreator || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData) => {
    try {
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

      // Ajouter l'id_organisation aux données du contact
      const contactWithOrg = {
        ...contactData,
        id_organisation: authData.id_organisation
      };

      const { data, error } = await supabase
        .from('contacts')
        .insert([contactWithOrg])
        .select();

      if (error) throw error;
      setContacts([data[0], ...contacts]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Erreur lors de l\'ajout du contact:', err);
      return { success: false, error: err.message };
    }
  };

  const updateContact = async (id, contactData) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(contactData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setContacts(contacts.map(c => c.id === id ? data[0] : c));
      return data[0];
    } catch (err) {
      console.error('Erreur lors de la modification du contact:', err);
      throw err;
    }
  };

  const deleteContact = async (id) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ supprime_le: new Date() })
        .eq('id', id);

      if (error) throw error;
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du contact:', err);
      throw err;
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchContacts(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchContacts(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchContacts(page);
    }
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: () => fetchContacts(currentPage),
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    nextPage,
    prevPage,
    goToPage
  };
}
