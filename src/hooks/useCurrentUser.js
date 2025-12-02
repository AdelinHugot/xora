import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setUser(null);
        return;
      }

      // Fetch user info from utilisateurs_auth table
      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_utilisateur, id_organisation')
        .eq('id_auth_user', authUser.id)
        .single();

      if (authError) throw authError;

      // Fetch full user info from utilisateurs table
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', authData.id_utilisateur)
        .single();

      if (userError) throw userError;

      setUser({
        id: userData.id,
        firstName: userData.prenom || '',
        lastName: userData.nom || '',
        email: authUser.email || '',
        role: userData.poste || 'Utilisateur',
        avatar: `https://i.pravatar.cc/40?u=${userData.id}`
      });
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    refetch: fetchCurrentUser
  };
}
