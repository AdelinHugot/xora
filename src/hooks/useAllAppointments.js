import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();

    // Get current user's organization
    const setupSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: authData } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', user.id)
          .single();

        if (!authData) return;

        // Setup real-time subscription for all appointments in this organization
        const subscription = supabase
          .channel(`all-appointments-${authData.id_organisation}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'rendez_vous',
              filter: `id_organisation=eq.${authData.id_organisation}`
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setAppointments(prev => [payload.new, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                setAppointments(prev =>
                  prev.map(apt => apt.id === payload.new.id ? payload.new : apt)
                );
              } else if (payload.eventType === 'DELETE') {
                setAppointments(prev => prev.filter(apt => apt.id !== payload.old.id));
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Erreur lors de la configuration de la souscription:', err);
      }
    };

    const unsubscribe = setupSubscription();
    return () => {
      unsubscribe.then(unsub => unsub?.());
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch organization ID
      const { data: authData } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', user.id)
        .single();

      if (!authData) return;

      // Fetch all appointments for this organization with contact info
      const { data, error: fetchError } = await supabase
        .from('rendez_vous')
        .select(`
          *,
          contacts:id_contact (
            id,
            prenom,
            nom,
            email,
            telephone
          )
        `)
        .eq('id_organisation', authData.id_organisation)
        .is('supprime_le', null)
        .order('date_debut', { ascending: false });

      if (fetchError) throw fetchError;

      setAppointments(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments
  };
}
