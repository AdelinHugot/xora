import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTaches(limit = null) {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mappings Statiques
  const DB_TO_UI_STATUS = {
    'non_commence': 'Non commencé',
    'en_cours': 'En cours',
    'termine': 'Terminé',
    // Fallback pour la rétrocompatibilité (si la BDD contient encore les anciennes valeurs)
    'Non commencé': 'Non commencé',
    'En cours': 'En cours',
    'Terminé': 'Terminé'
  };

  const UI_TO_DB_STATUS = {
    'Non commencé': 'non_commence',
    'En cours': 'en_cours',
    'Terminé': 'termine'
  };

  const DB_STATUS_TO_STAGE = {
    'non_commence': 0,
    'en_cours': 1,
    'termine': 2,
    // Fallback pour la rétrocompatibilité
    'Non commencé': 0,
    'En cours': 1,
    'Terminé': 2
  };

  const STAGE_TO_DB_STATUS = {
    0: 'non_commence',
    1: 'en_cours',
    2: 'termine'
  };

  useEffect(() => {
    const fetchTaches = async () => {
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

        // Récupère les tâches avec relations (contact et projet)
        let query = supabase
          .from('taches')
          .select(
            `id,
            index_tache,
            type,
            titre,
            tag,
            id_projet,
            id_contact,
            nom_client,
            nom_projet,
            statut,
            progression,
            date_echeance,
            note,
            est_en_retard,
            jours_retard,
            a_alerte,
            id_affecte_a,
            cree_le,
            modifie_le`
          )
          .eq('id_organisation', authData.id_organisation)
          .is('supprime_le', null)
          .order('index_tache', { ascending: true });

        if (limit) {
          query = query.limit(limit);
        }

        const { data: tachesData, error: tachesError } = await query;

        if (tachesError) throw tachesError;

        // Récupère les utilisateurs pour résoudre les noms des salariés assignés
        const { data: utilisateurs } = await supabase
          .from('utilisateurs')
          .select('id, prenom, nom');

        const userMap = {};
        if (utilisateurs) {
          utilisateurs.forEach(u => {
            userMap[u.id] = `${u.prenom} ${u.nom}`;
          });
        }

        // Formate les tâches au format attendu par le Dashboard
        const formattedTaches = tachesData.map((t) => {
          // Robustesse : si le statut en BDD n'est pas standard, on fallback proprement
          const dbStatus = t.statut || 'non_commence';
          const uiStatus = DB_TO_UI_STATUS[dbStatus] || 'Non commencé';

          return {
            id: t.id,
            index: t.index_tache || 0,
            titre: t.titre || 'Sans titre',
            type: t.type || 'Tâche',
            id_contact: t.id_contact,
            clientName: t.nom_client || 'Non spécifié',
            id_projet: t.id_projet,
            projectName: t.nom_projet || 'Non spécifié',
            tag: t.tag || 'Autre',
            dueDate: t.date_echeance
              ? new Date(t.date_echeance).toLocaleDateString('fr-FR')
              : 'Pas de date',
            isLate: t.est_en_retard || false,
            daysLate: t.jours_retard || 0,
            hasAlert: t.a_alerte || false,
            progress: t.progression || 0,
            status: uiStatus, // Pour l'affichage UI
            stages: ['Non commencé', 'En cours', 'Terminé'],
            currentStage: DB_STATUS_TO_STAGE[dbStatus] || 0,
            note: t.note,
            id_affecte_a: t.id_affecte_a,
            salarie_name: t.id_affecte_a ? userMap[t.id_affecte_a] : null,
            cree_le: t.cree_le,
            modifie_le: t.modifie_le,
          };
        });

        setTaches(formattedTaches);
      } catch (err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaches();
  }, [limit]);

  // Fonction pour mettre à jour l'étape d'une tâche (Dashboard logic)
  const updateTacheStage = async (tacheId, stageIndex) => {
    try {
      const newDbStatus = STAGE_TO_DB_STATUS[stageIndex];
      const newUiStatus = DB_TO_UI_STATUS[newDbStatus];

      const updates = { statut: newDbStatus };

      // Synchronisation progression
      if (stageIndex === 2) {
        updates.progression = 100;
      } else if (stageIndex === 0) {
        updates.progression = 0;
      }

      const { error } = await supabase
        .from('taches')
        .update(updates)
        .eq('id', tacheId);

      if (error) throw error;

      // Met à jour l'état local
      setTaches(taches.map(t =>
        t.id === tacheId
          ? {
            ...t,
            status: newUiStatus,
            currentStage: stageIndex,
            progress: updates.progression !== undefined ? updates.progression : t.progress
          }
          : t
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la tâche:', err);
      throw err;
    }
  };

  // Fonction pour mettre à jour le statut d'une tâche (Page Tâches logic)
  const updateTacheStatus = async (tacheId, newUiStatus) => {
    try {
      const newDbStatus = UI_TO_DB_STATUS[newUiStatus] || 'non_commence';
      const stageIndex = DB_STATUS_TO_STAGE[newDbStatus] || 0;

      const updates = { statut: newDbStatus };

      // Synchronisation progression
      if (newUiStatus === 'Terminé') {
        updates.progression = 100;
      } else if (newUiStatus === 'Non commencé') {
        updates.progression = 0;
      }

      const { error } = await supabase
        .from('taches')
        .update(updates)
        .eq('id', tacheId);

      if (error) throw error;

      // Met à jour l'état local
      setTaches(taches.map(t =>
        t.id === tacheId
          ? {
            ...t,
            status: newUiStatus,
            currentStage: stageIndex,
            progress: updates.progression !== undefined ? updates.progression : t.progress
          }
          : t
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      throw err;
    }
  };

  // Fonction pour supprimer une tâche (soft delete)
  const deleteTache = async (tacheId) => {
    try {
      const { error } = await supabase
        .from('taches')
        .update({ supprime_le: new Date().toISOString() })
        .eq('id', tacheId);

      if (error) throw error;

      // Met à jour l'état local
      setTaches(taches.filter(t => t.id !== tacheId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      throw err;
    }
  };

  // Fonction pour créer une tâche
  const createTache = async (tacheData) => {
    try {
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

      // Prépare les données pour l'insertion
      const dbStatus = UI_TO_DB_STATUS[tacheData.statut] || 'non_commence';

      const newTache = {
        titre: tacheData.titre || tacheData.memoName || 'Sans titre',
        tag: tacheData.tag || 'Autre',
        type: tacheData.type || 'Tâche',
        statut: dbStatus,
        progression: tacheData.progression || 0,
        date_echeance: tacheData.date_echeance || tacheData.dueDate,
        note: tacheData.note,
        nom_client: tacheData.nom_client,
        nom_projet: tacheData.nom_projet,
        id_affecte_a: tacheData.id_affecte_a || null,
        id_organisation: authData.id_organisation,
        index_tache: (taches.length || 0) + 1
      };

      const { data, error } = await supabase
        .from('taches')
        .insert([newTache])
        .select();

      if (error) throw error;

      // Récupère les utilisateurs pour résoudre le nom du salarié assigné
      let salarie_name = null;
      if (data[0].id_affecte_a) {
        const { data: user } = await supabase
          .from('utilisateurs')
          .select('prenom, nom')
          .eq('id', data[0].id_affecte_a)
          .single();
        if (user) {
          salarie_name = `${user.prenom} ${user.nom}`;
        }
      }

      // Formate la tâche retournée
      const uiStatus = DB_TO_UI_STATUS[data[0].statut] || 'Non commencé';

      const formattedTache = {
        id: data[0].id,
        index: data[0].index_tache,
        titre: data[0].titre || 'Sans titre',
        type: data[0].type || 'Tâche',
        clientName: data[0].nom_client || '',
        projectName: data[0].nom_projet || '',
        tag: data[0].tag,
        dueDate: data[0].date_echeance
          ? new Date(data[0].date_echeance).toLocaleDateString('fr-FR')
          : 'Pas de date',
        isLate: false,
        daysLate: 0,
        hasAlert: false,
        progress: data[0].progression || 0,
        status: uiStatus,
        stages: ['Non commencé', 'En cours', 'Terminé'],
        currentStage: DB_STATUS_TO_STAGE[data[0].statut] || 0,
        note: data[0].note,
        id_affecte_a: data[0].id_affecte_a,
        salarie_name: salarie_name,
        cree_le: data[0].cree_le,
        modifie_le: data[0].modifie_le,
      };

      // Ajoute à l'état local
      setTaches([formattedTache, ...taches]);

      return formattedTache;
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      throw err;
    }
  };

  return {
    taches,
    loading,
    error,
    updateTacheStage,
    updateTacheStatus,
    deleteTache,
    createTache,
    refetch: () => {
      setLoading(true);
      // Retrigger le useEffect
    }
  };
}
