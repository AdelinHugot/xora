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
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .is('supprime_le', null)
        .order('cree_le', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select();

      if (error) throw error;
      setContacts([data[0], ...contacts]);
      return data[0];
    } catch (err) {
      console.error('Erreur lors de l\'ajout du contact:', err);
      throw err;
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
