import { useContext } from 'react';
import { GlobalAuthContext } from '../contexts/GlobalAuthContext';

// useOrgId maintenant utilise le contexte global au lieu de faire ses propres requêtes
// Cela élimine les 24+ requêtes dupliquées à utilisateurs_auth
export function useOrgId() {
  const context = useContext(GlobalAuthContext);

  if (!context) {
    throw new Error('useOrgId must be used within GlobalAuthProvider');
  }

  const { orgId, loading, error } = context;

  return { orgId, loading, error };
}
