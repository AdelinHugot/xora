import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useKPIs() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupère l'utilisateur courant
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Utilisateur non authentifié');

        // Récupère l'organisation de l'utilisateur via utilisateurs_auth
        const { data: authData, error: authError } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', user.id)
          .single();

        if (authError) throw authError;
        if (!authData) throw new Error('Organisation non trouvée');

        // Récupère les KPIs de l'organisation
        const { data: org, error: orgError } = await supabase
          .from('organisations')
          .select(
            'id, nom, ' +
            'kpi_ca_genere_valeur, kpi_ca_genere_objectif, ' +
            'kpi_marge_generee_valeur, kpi_marge_generee_objectif, ' +
            'kpi_taux_marge_valeur, kpi_taux_marge_objectif, ' +
            'kpi_taux_transformation_valeur, kpi_taux_transformation_objectif'
          )
          .eq('id', authData.id_organisation)
          .single();

        if (orgError) throw orgError;

        // Formatte les KPIs au format attendu par le Dashboard
        const formattedKpis = [
          {
            id: 'ca-genere',
            label: 'CA Généré',
            value: `${(org.kpi_ca_genere_valeur || 0).toLocaleString('fr-FR')}€`,
            goal: `${(org.kpi_ca_genere_objectif || 0).toLocaleString('fr-FR')}€`,
            percent: org.kpi_ca_genere_objectif > 0
              ? Math.round((org.kpi_ca_genere_valeur / org.kpi_ca_genere_objectif) * 100)
              : 0
          },
          {
            id: 'marge-generee',
            label: 'Marge générée',
            value: `${(org.kpi_marge_generee_valeur || 0).toLocaleString('fr-FR')}€`,
            goal: `${(org.kpi_marge_generee_objectif || 0).toLocaleString('fr-FR')}€`,
            percent: org.kpi_marge_generee_objectif > 0
              ? Math.round((org.kpi_marge_generee_valeur / org.kpi_marge_generee_objectif) * 100)
              : 0
          },
          {
            id: 'taux-marge',
            label: 'Taux de marge',
            value: `${(org.kpi_taux_marge_valeur || 0).toFixed(1)}%`,
            goal: `${(org.kpi_taux_marge_objectif || 0).toFixed(1)}%`,
            percent: org.kpi_taux_marge_objectif > 0
              ? Math.round((org.kpi_taux_marge_valeur / org.kpi_taux_marge_objectif) * 100)
              : 0
          },
          {
            id: 'taux-transformation',
            label: 'Taux de transformation',
            value: `${(org.kpi_taux_transformation_valeur || 0).toFixed(1)}%`,
            goal: `${(org.kpi_taux_transformation_objectif || 0).toFixed(1)}%`,
            percent: org.kpi_taux_transformation_objectif > 0
              ? Math.round((org.kpi_taux_transformation_valeur / org.kpi_taux_transformation_objectif) * 100)
              : 0
          }
        ];

        setKpis(formattedKpis);
      } catch (err) {
        console.error('Erreur lors de la récupération des KPIs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  return { kpis, loading, error };
}
