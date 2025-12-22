import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useOrgId } from './useOrgId';

// Cache global avec TTL
let kpisCache = null;
let kpisCacheTimestamp = null;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

const formatKPIs = (org) => {
  return [
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
};

export function useKPIs() {
  const { orgId, loading: orgLoading } = useOrgId();
  const [kpis, setKpis] = useState(kpisCache || null);
  const [loading, setLoading] = useState(!kpisCache);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchKPIs = useCallback(async () => {
    if (!orgId) return;

    try {
      // Stale-while-revalidate : afficher les vieilles données si elles existent
      if (kpisCache && !loading) {
        setLoading(true);
      }

      // Vérifier le cache
      const now = Date.now();
      if (kpisCache && kpisCacheTimestamp && (now - kpisCacheTimestamp < CACHE_TTL)) {
        // Cache valide
        if (isMountedRef.current) {
          setKpis(kpisCache);
          setLoading(false);
        }
        return;
      }

      // Récupère les KPIs de l'organisation (UNE SEULE REQUÊTE)
      const { data: org, error: orgError } = await supabase
        .from('organisations')
        .select(
          'id, nom, ' +
          'kpi_ca_genere_valeur, kpi_ca_genere_objectif, ' +
          'kpi_marge_generee_valeur, kpi_marge_generee_objectif, ' +
          'kpi_taux_marge_valeur, kpi_taux_marge_objectif, ' +
          'kpi_taux_transformation_valeur, kpi_taux_transformation_objectif'
        )
        .eq('id', orgId)
        .single();

      if (orgError) throw orgError;

      const formattedKpis = formatKPIs(org);

      // Mettre à jour le cache global
      kpisCache = formattedKpis;
      kpisCacheTimestamp = Date.now();

      if (isMountedRef.current) {
        setKpis(formattedKpis);
        setError(null);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des KPIs:', err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [orgId]);

  useEffect(() => {
    // Reset mounted to true on each effect execution (including Strict Mode remounts)
    isMountedRef.current = true;

    fetchKPIs();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchKPIs]);

  return {
    kpis,
    loading: loading || orgLoading,
    error,
    refetch: fetchKPIs
  };
}
