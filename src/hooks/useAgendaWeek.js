import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { format, startOfWeek, endOfWeek, addWeeks, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function useAgendaWeek(weekOffset = 0) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculer les dates de la semaine
  const weekDates = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(addWeeks(now, weekOffset), { weekStartsOn: 1 }); // Lundi
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    return { weekStart, weekEnd };
  }, [weekOffset]);

  // Générer les jours de la semaine (Lundi à Samedi, pas dimanche)
  const days = useMemo(() => {
    const result = [];
    const current = new Date(weekDates.weekStart);

    for (let i = 0; i < 6; i++) {
      const dayNum = current.getDate();
      const dayName = format(current, 'EEEE', { locale: fr });
      const formattedDate = format(current, 'yyyy-MM-dd');

      result.push({
        key: `day-${i}`,
        dateKey: formattedDate,
        label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum}`,
        date: new Date(current),
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  }, [weekDates]);

  // Récupérer les rendez-vous de la semaine
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupère l'utilisateur courant
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Utilisateur non authentifié');

        // Récupère l'organisation de l'utilisateur
        const { data: authData, error: authError } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', user.id)
          .single();

        if (authError) throw authError;
        if (!authData) throw new Error('Organisation non trouvée');

        // Récupère les rendez-vous de la semaine avec relations
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('rendez_vous')
          .select(
            `id,
            titre,
            date_debut,
            heure_debut,
            date_fin,
            heure_fin,
            lieu,
            commentaires,
            contact:contacts(prenom, nom)`
          )
          .eq('id_organisation', authData.id_organisation)
          .gte('date_debut', format(weekDates.weekStart, 'yyyy-MM-dd'))
          .lte('date_fin', format(weekDates.weekEnd, 'yyyy-MM-dd'))
          .is('supprime_le', null)
          .order('date_debut', { ascending: true });

        if (appointmentsError) throw appointmentsError;

        // Formate les rendez-vous
        const formattedAppointments = (appointmentsData || []).map(apt => ({
          id: apt.id,
          title: apt.titre || 'Rendez-vous',
          dateKey: format(parseISO(apt.date_debut), 'yyyy-MM-dd'),
          start: apt.heure_debut ? apt.heure_debut.substring(0, 5) : '00:00',
          end: apt.heure_fin ? apt.heure_fin.substring(0, 5) : '00:00',
          lieu: apt.lieu || '',
          contactName: apt.contact
            ? `${apt.contact.prenom} ${apt.contact.nom}`
            : 'Non spécifié',
          commentaires: apt.commentaires || '',
        }));

        setAppointments(formattedAppointments);
      } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [weekDates]);

  // Grouper les rendez-vous par jour
  const appointmentsByDay = useMemo(() => {
    const map = {};
    days.forEach(day => {
      map[day.key] = [];
    });

    appointments.forEach(apt => {
      const dayIndex = days.findIndex(d => d.dateKey === apt.dateKey);
      if (dayIndex !== -1) {
        map[days[dayIndex].key].push(apt);
      }
    });

    return map;
  }, [appointments, days]);

  return {
    days,
    appointments,
    appointmentsByDay,
    loading,
    error,
    weekDates,
  };
}
