import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const GlobalAuthContext = createContext(null);

// Prevent duplicate initialization in Strict Mode
let initializationInProgress = false;
let initializationPromise = null;

export function GlobalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useRef for mounted so it persists across React Strict Mode remounts
  const mounted = useRef(true);

  useEffect(() => {
    // Reset mounted to true on each effect execution (including Strict Mode remounts)
    // This ensures that state updates from the first initialization can still complete
    mounted.current = true;

    if (initializationInProgress) {
      return;
    }

    // Fetch user, org ID, and profile ONCE at app startup
    const initializeAuth = async () => {
      try {
        initializationInProgress = true;
        setLoading(true);

        // 1. Get authenticated user
        const authResponse = await supabase.auth.getUser();
        const authUser = authResponse?.data?.user;

        if (!authUser) {
          if (mounted.current) {
            setUser(null);
            setOrgId(null);
            setLoading(false);
          }
          return;
        }

        if (mounted.current) setUser(authUser);

        // 2. Get user's organization ID
        const { data: authData, error: authError } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation, id_utilisateur')
          .eq('id_auth_user', authUser.id)
          .single();

        if (authError) throw authError;
        if (!authData) throw new Error('Organisation non trouvée');

        if (mounted.current) setOrgId(authData.id_organisation);

        // 3. Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('utilisateurs')
          .select('id, civilite, prenom, nom, email, telephone, url_avatar')
          .eq('id', authData.id_utilisateur)
          .single();

        if (profileError) throw profileError;

        if (mounted.current) {
          setUserProfile(profile);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[GlobalAuthContext] Auth error:', err);
        if (mounted.current) {
          setError(err?.message || 'Unknown error');
          setLoading(false);
        }
      } finally {
        initializationInProgress = false;
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && mounted.current) {
          setUser(session.user);
          // Refetch org on auth change
          const { data: authData } = await supabase
            .from('utilisateurs_auth')
            .select('id_organisation')
            .eq('id_auth_user', session.user.id)
            .single();
          if (mounted.current) setOrgId(authData?.id_organisation);
        } else if (mounted.current) {
          setUser(null);
          setOrgId(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      mounted.current = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    orgId,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <GlobalAuthContext.Provider value={value}>
      {children}
    </GlobalAuthContext.Provider>
  );
}

export function useGlobalAuth() {
  const context = useContext(GlobalAuthContext);
  if (!context) {
    throw new Error('useGlobalAuth must be used within GlobalAuthProvider');
  }
  return context;
}
