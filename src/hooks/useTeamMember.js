import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTeamMember(utilisateurId) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!utilisateurId) {
      setLoading(false);
      return;
    }

    fetchMember();
  }, [utilisateurId]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's organization
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setError('Non authentifié');
        return;
      }

      const { data: authData } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', authUser.id)
        .single();

      if (!authData) {
        setError('Organisation non trouvée');
        return;
      }

      // Fetch the member data
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('id', utilisateurId)
        .eq('id_organisation', authData.id_organisation)
        .single();

      if (userError) {
        console.error('Erreur lors de la récupération du membre:', userError);
        setError(userError.message);
        return;
      }

      if (userData) {
        setMember({
          id: userData.id,
          firstName: userData.prenom || '',
          lastName: userData.nom || '',
          name: `${userData.prenom || ''} ${userData.nom || ''}`.trim(),
          email: userData.email || '',
          phone: userData.telephone_mobile || userData.telephone || '',
          phoneFixe: userData.telephone || '',
          phonePortable: userData.telephone_mobile || '',
          position: userData.poste || '',
          role: userData.poste || '',
          job: userData.poste || '',
          jobType: userData.type_contrat || '',
          contractType: userData.type_contrat || '',
          civility: userData.civilite || 'Mr',
          avatar: `https://i.pravatar.cc/128?u=${userData.id}`,
          avatarUrl: `https://i.pravatar.cc/128?u=${userData.id}`,
          hasPhone: userData.telephone_disponible || false,
          hasCar: userData.voiture_disponible || false,
          hasLaptop: userData.ordinateur_disponible || false,
          agendaColor: userData.couleur_agenda || '#A8A8A8',
          xoraSubscriptionActive: userData.abonnement_xora_actif !== false,
          // Raw data for updates
          raw: userData
        });
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du membre:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('utilisateurs')
        .update(updates)
        .eq('id', utilisateurId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh member data
      await fetchMember();
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du membre:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    member,
    loading,
    error,
    refetch: fetchMember,
    updateMember
  };
}
