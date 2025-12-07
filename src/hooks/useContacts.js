import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', user.id)
        .single();

      if (authError) throw authError;
      if (!authData) throw new Error('Organisation non trouvée');

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          utilisateurs!contacts_agenceur_referent_fkey(id, prenom, nom)
        `)
        .eq('id_organisation', authData.id_organisation)
        .is('supprime_le', null)
        .order('cree_le', { ascending: false });

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

  return { contacts, loading, error, addContact, updateContact, deleteContact, refetch: fetchContacts };
}
