import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async ({
    email,
    password,
    firstName,
    lastName,
    organizationName
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Étape 1 : Créer l'organisation via Edge Function
      const { data: supabaseConfig } = await supabase.functions.getProjectConfig?.() || {};
      const supabaseUrl = supabase.supabaseUrl;

      const response = await fetch(`${supabaseUrl}/functions/v1/create-signup-organisation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          organizationName
        })
      });

      const signupData = await response.json();

      if (!response.ok) {
        console.error('Erreur création organisation:', signupData);
        throw new Error(`Impossible de créer l'organisation: ${signupData.error || 'Erreur inconnue'}`);
      }

      const orgData = { id: signupData.organisation_id };
      const roleData = { id: signupData.role_id };
      console.log('Organisation créée:', orgData);
      console.log('Rôle:', roleData);

      // Étape 3 : Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            organization_id: orgData.id
          }
        }
      });

      if (authError) {
        console.error('Erreur création auth:', authError);
        // Nettoyer
        await supabase.from('organisations').delete().eq('id', orgData.id);
        throw new Error('Impossible de créer le compte utilisateur. ' + authError.message);
      }

      if (!authData.user) {
        await supabase.from('organisations').delete().eq('id', orgData.id);
        throw new Error('Aucun utilisateur créé.');
      }

      console.log('Utilisateur auth créé:', authData.user.id);

      // Étape 4 : Créer le profil utilisateur
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .insert({
          id_organisation: orgData.id,
          civilite: 'Mr',
          prenom: firstName,
          nom: lastName,
          email: email,
          id_role: roleData.id,
          statut: 'actif'
        })
        .select()
        .single();

      if (userError) {
        console.error('Erreur création profil:', userError);
        throw new Error(`Impossible de créer le profil utilisateur: ${userError.message || JSON.stringify(userError)}`);
      }

      console.log('Profil utilisateur créé:', userData);

      // Étape 5 : Lier l'utilisateur auth à son profil
      const { error: linkError } = await supabase
        .from('utilisateurs_auth')
        .insert({
          id_auth_user: authData.user.id,
          id_utilisateur: userData.id,
          id_organisation: orgData.id
        });

      if (linkError) {
        console.error('Erreur liaison auth:', linkError);
        throw new Error(`Impossible de finaliser la création du compte: ${linkError.message || JSON.stringify(linkError)}`);
      }

      console.log('Liaison auth créée avec succès');

      return {
        success: true,
        user: authData.user,
        organization: orgData
      };

    } catch (err) {
      console.error('Erreur signup:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
      return {
        success: false,
        error: err.message || 'Une erreur est survenue lors de l\'inscription'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error
  };
}
