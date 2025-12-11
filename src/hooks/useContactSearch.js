import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useDebounce } from './useDebounce'; // We assume or will create this

export function useContactSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchContacts = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', user.id)
        .single();

      if (authError || !authData) throw new Error('Organisation non trouvée');

      // Search query
      const { data, error } = await supabase
        .from('contacts')
        .select('id, prenom, nom, email, telephone')
        .eq('id_organisation', authData.id_organisation)
        .is('supprime_le', null)
        .or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;

      const formattedResults = data.map(contact => ({
        id: contact.id,
        name: `${contact.nom || ''} ${contact.prenom || ''}`.trim().toUpperCase(),
        email: contact.email,
        telephone: contact.telephone
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error('Erreur recherche contact:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, searchContacts };
}
