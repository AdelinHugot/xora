import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rendez_vous')
        .select(`
          *,
          collaborateurs_rendez_vous(id_utilisateur),
          contact:contacts(prenom, nom),
          created_by:utilisateurs(prenom, nom)
        `)
        .is('supprime_le', null)
        .order('date_debut', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des rendez-vous:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('rendez_vous')
        .insert([appointmentData])
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
        .update(appointmentData)
        .eq('id', id)
        .select();

      if (error) throw error;
      setAppointments(appointments.map(a => a.id === id ? data[0] : a));
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
        .update({ supprime_le: new Date() })
        .eq('id', id);

      if (error) throw error;
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du rendez-vous:', err);
      throw err;
    }
  };

  return { appointments, loading, error, addAppointment, updateAppointment, deleteAppointment, refetch: fetchAppointments };
}
