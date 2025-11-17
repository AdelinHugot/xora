import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`
          *,
          role:roles(nom, couleur)
        `)
        .eq('statut', 'actif');

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}
