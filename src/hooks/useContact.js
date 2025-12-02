import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useContact(contactId) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contactId) {
      setLoading(false);
      return;
    }

    fetchContact();

    // Setup real-time subscription for this contact using new API
    const subscription = supabase
      .channel(`contact-${contactId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
          filter: `id=eq.${contactId}`
        },
        (payload) => {
          // Update contact data when changes occur in real-time
          if (payload.new) {
            setContact(payload.new);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount or when contactId changes
    return () => {
      subscription.unsubscribe();
    };
  }, [contactId]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError(null);

      // Déterminer si contactId est un UUID ou un numéro
      const isUUID = contactId.includes('-');

      const query = supabase
        .from('contacts')
        .select('*')
        .is('supprime_le', null);

      // Filtrer par ID ou par numéro selon le format
      if (isUUID) {
        query.eq('id', contactId);
      } else {
        query.eq('numero', parseInt(contactId));
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) throw fetchError;

      setContact(data);
    } catch (err) {
      console.error('Erreur lors de la récupération du contact:', err);
      setError(err.message);
      setContact(null);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contact.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setContact(data);
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du contact:', err);
      return { success: false, error: err.message };
    }
  };

  return { contact, loading, error, updateContact, refetch: fetchContact };
}
