import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useOrgId } from './useOrgId';

// Cache global avec TTL
let pipelineKpisCache = null;
let pipelineKpisCacheTimestamp = null;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export function usePipelineKPIs() {
  const { orgId } = useOrgId();
  const [kpis, setKpis] = useState(pipelineKpisCache || null);
  const [loading, setLoading] = useState(!pipelineKpisCache);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchPipelineKPIs = useCallback(async () => {
    if (!orgId) return;

    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache
      const now = Date.now();
      if (pipelineKpisCache && pipelineKpisCacheTimestamp && (now - pipelineKpisCacheTimestamp < CACHE_TTL)) {
        // Cache valide
        if (isMountedRef.current) {
          setKpis(pipelineKpisCache);
          setLoading(false);
        }
        return;
      }

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

      // Mettre à jour le cache global
      pipelineKpisCache = formattedKpis;
      pipelineKpisCacheTimestamp = Date.now();

      if (isMountedRef.current) {
        setKpis(formattedKpis);
        setError(null);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des KPIs pipeline:', err);
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

    fetchPipelineKPIs();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPipelineKPIs]);

  return { kpis, loading, error, refetch: fetchPipelineKPIs };
}
