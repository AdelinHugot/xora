-- ============================================
-- FONCTION RPC POUR L'INSCRIPTION (Solution sécurisée)
-- Cette fonction s'exécute avec les privilèges du propriétaire
-- et contourne les politiques RLS pour l'inscription
-- ============================================

CREATE OR REPLACE FUNCTION inscription_complete(
  p_email TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_organization_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Important : exécute avec les privilèges du propriétaire
AS $$
DECLARE
  v_org_id UUID;
  v_role_id UUID;
  v_user_id UUID;
  v_slug TEXT;
BEGIN
  -- Générer le slug
  v_slug := lower(regexp_replace(p_organization_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-+|-+$', '', 'g');

  -- 1. Créer l'organisation
  INSERT INTO organisations (nom, slug, description, statut)
  VALUES (p_organization_name, v_slug, 'Organisation ' || p_organization_name, 'actif')
  RETURNING id INTO v_org_id;

  -- 2. Récupérer ou créer le rôle administrateur
  SELECT id INTO v_role_id
  FROM roles
  WHERE nom = 'Administrateur'
  LIMIT 1;

  IF v_role_id IS NULL THEN
    INSERT INTO roles (nom, description, couleur)
    VALUES ('Administrateur', 'Accès complet', 'violet')
    RETURNING id INTO v_role_id;
  END IF;

  -- 3. Créer le profil utilisateur
  INSERT INTO utilisateurs (id_organisation, civilite, prenom, nom, email, id_role, statut)
  VALUES (v_org_id, 'Mr', p_first_name, p_last_name, p_email, v_role_id, 'actif')
  RETURNING id INTO v_user_id;

  -- 4. Retourner les IDs pour que le client puisse créer la liaison auth
  RETURN json_build_object(
    'success', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'role_id', v_role_id
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Donner les permissions à anon et authenticated
GRANT EXECUTE ON FUNCTION inscription_complete TO anon;
GRANT EXECUTE ON FUNCTION inscription_complete TO authenticated;

-- Fonction pour créer la liaison auth après que l'utilisateur soit créé
CREATE OR REPLACE FUNCTION creer_liaison_auth(
  p_auth_user_id UUID,
  p_user_id UUID,
  p_org_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO utilisateurs_auth (id_auth_user, id_utilisateur, id_organisation)
  VALUES (p_auth_user_id, p_user_id, p_org_id);

  RETURN json_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

GRANT EXECUTE ON FUNCTION creer_liaison_auth TO anon;
GRANT EXECUTE ON FUNCTION creer_liaison_auth TO authenticated;
