import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAppointments(contactId) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contactId) {
      setLoading(false);
      return;
    }

    fetchAppointments();

    // Setup real-time subscription for this contact's appointments
    const subscription = supabase
      .channel(`appointments-${contactId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rendez_vous',
          filter: `id_contact=eq.${contactId}`
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
  }, [contactId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch appointments for this contact with organization filter
      const { data: authData } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', user.id)
        .single();

      if (!authData) return;

      const { data, error: fetchError } = await supabase
        .from('rendez_vous')
        .select('*')
        .eq('id_contact', contactId)
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

  const addAppointment = async (appointmentData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      // Get organization and user ID from utilisateurs_auth
      const { data: authData } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation, id_utilisateur')
        .eq('id_auth_user', user.id)
        .single();

      if (!authData) throw new Error('Organisation non trouvée');

      // Format appointment data for database
      const appointmentToSave = {
        titre: appointmentData.title,
        id_contact: contactId,
        date_debut: appointmentData.startDate,
        heure_debut: appointmentData.startTime,
        date_fin: appointmentData.endDate,
        heure_fin: appointmentData.endTime,
        lieu: appointmentData.location,
        commentaires: appointmentData.comments || '',
        id_cree_par: authData.id_utilisateur,
        id_organisation: authData.id_organisation
      };

      const { data, error } = await supabase
        .from('rendez_vous')
        .insert([appointmentToSave])
        .select();

      if (error) throw error;

      setAppointments([data[0], ...appointments]);
      return data[0];
    } catch (err) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', err);
      throw err;
    }
  };

  const updateAppointment = async (id, appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('rendez_vous')
        .update({
          titre: appointmentData.title,
          date_debut: appointmentData.startDate,
          heure_debut: appointmentData.startTime,
          date_fin: appointmentData.endDate,
          heure_fin: appointmentData.endTime,
          lieu: appointmentData.location,
          commentaires: appointmentData.comments || '',
          modifie_le: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      setAppointments(appointments.map(apt => apt.id === id ? data[0] : apt));
      return data[0];
    } catch (err) {
      console.error('Erreur lors de la modification du rendez-vous:', err);
      throw err;
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const { error } = await supabase
        .from('rendez_vous')
        .update({ supprime_le: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.filter(apt => apt.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du rendez-vous:', err);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments
  };
}
