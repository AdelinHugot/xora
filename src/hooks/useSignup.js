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

      // Générer le slug de l'organisation
      const slug = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Étape 1 : Créer l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organisations')
        .insert({
          nom: organizationName,
          slug: slug,
          description: `Organisation ${organizationName}`,
          statut: 'actif'
        })
        .select()
        .single();

      if (orgError) {
        console.error('Erreur création organisation:', orgError);
        throw new Error('Impossible de créer l\'organisation.');
      }

      console.log('Organisation créée:', orgData);

      // Étape 2 : Créer ou récupérer le rôle administrateur
      let roleData;
      const { data: existingRole } = await supabase
        .from('roles')
        .select('*')
        .eq('nom', 'Administrateur')
        .single();

      if (existingRole) {
        roleData = existingRole;
      } else {
        const { data: newRole, error: roleError } = await supabase
          .from('roles')
          .insert({
            nom: 'Administrateur',
            description: 'Accès complet à l\'application',
            couleur: 'violet'
          })
          .select()
          .single();

        if (roleError) {
          console.error('Erreur création rôle:', roleError);
          // Nettoyer
          await supabase.from('organisations').delete().eq('id', orgData.id);
          throw new Error('Impossible de créer le rôle administrateur.');
        }
        roleData = newRole;
      }

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
        throw new Error('Impossible de créer le profil utilisateur.');
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
        throw new Error('Impossible de finaliser la création du compte.');
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
