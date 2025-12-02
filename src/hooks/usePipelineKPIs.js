import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePipelineKPIs() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPipelineKPIs = async () => {
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

        const orgId = authData.id_organisation;

        // Récupère les contacts et les compte par statut
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('statut')
          .eq('id_organisation', orgId)
          .is('supprime_le', null);

        if (contactsError) throw contactsError;

        // Compte les contacts par statut
        const statusCounts = {
          'Leads': 0,
          'Études en cours': 0,
          'Commande client': 0,
          'Dossier tech & install': 0,
          'SAV': 0
        };

        contacts.forEach(contact => {
          const status = contact.statut || 'Leads';
          if (status in statusCounts) {
            statusCounts[status]++;
          }
        });

        // Formate les KPIs au format attendu par le Dashboard
        const formattedKpis = [
          {
            id: 'leads',
            label: 'Leads',
            value: statusCounts['Leads'],
            color: '#EEE8FD'
          },
          {
            id: 'studies',
            label: 'Études en cours',
            value: statusCounts['Études en cours'],
            color: '#EED1F4'
          },
          {
            id: 'order',
            label: 'Commande client',
            value: statusCounts['Commande client'],
            color: '#A9C9F9'
          },
          {
            id: 'tech',
            label: 'Dossier tech & install',
            value: statusCounts['Dossier tech & install'],
            color: '#A4E6FE'
          },
          {
            id: 'sav',
            label: 'SAV',
            value: statusCounts['SAV'],
            color: '#FFD0C1'
          }
        ];

        setKpis(formattedKpis);
      } catch (err) {
        console.error('Erreur lors de la récupération des KPIs pipeline:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineKPIs();
  }, []);

  return { kpis, loading, error };
}
