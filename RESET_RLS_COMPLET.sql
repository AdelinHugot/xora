-- ============================================
-- RESET COMPLET DES POLITIQUES RLS
-- À exécuter dans le SQL Editor de Supabase
-- ============================================

-- ÉTAPE 1 : SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- ============================================

-- Table organisations
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leur organisation" ON organisations;
DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leur organisation" ON organisations;
DROP POLICY IF EXISTS "Voir son organisation" ON organisations;
DROP POLICY IF EXISTS "Modifier son organisation" ON organisations;
DROP POLICY IF EXISTS "Permettre création organisation" ON organisations;

-- Table utilisateurs
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les membres de leur organisation" ON utilisateurs;
DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leur propre profil" ON utilisateurs;
DROP POLICY IF EXISTS "Voir utilisateurs de son org" ON utilisateurs;
DROP POLICY IF EXISTS "Permettre création utilisateur" ON utilisateurs;

-- Table utilisateurs_auth
DROP POLICY IF EXISTS "Permettre création liaison auth" ON utilisateurs_auth;
DROP POLICY IF EXISTS "Voir liaisons auth de son org" ON utilisateurs_auth;

-- Table roles
DROP POLICY IF EXISTS "Lire rôles" ON roles;
DROP POLICY IF EXISTS "Créer rôles" ON roles;


-- ÉTAPE 2 : RECRÉER LES POLITIQUES CORRECTES
-- ============================================

-- ========== ORGANISATIONS ==========

-- Permettre à TOUT LE MONDE (anon et authenticated) de créer une organisation
CREATE POLICY "allow_insert_org"
ON organisations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permettre de voir seulement son organisation (une fois connecté)
CREATE POLICY "allow_select_own_org"
ON organisations FOR SELECT
TO authenticated
USING (id = get_user_organisation_id());

-- Permettre de modifier seulement son organisation
CREATE POLICY "allow_update_own_org"
ON organisations FOR UPDATE
TO authenticated
USING (id = get_user_organisation_id());


-- ========== ROLES ==========

-- Permettre à tout le monde de lire les rôles
CREATE POLICY "allow_select_roles"
ON roles FOR SELECT
TO anon, authenticated
USING (true);

-- Permettre à tout le monde de créer des rôles (pour l'inscription)
CREATE POLICY "allow_insert_roles"
ON roles FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- ========== UTILISATEURS ==========

-- Permettre à TOUT LE MONDE de créer un utilisateur (pour l'inscription)
CREATE POLICY "allow_insert_user"
ON utilisateurs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permettre de voir seulement les utilisateurs de son organisation
CREATE POLICY "allow_select_own_org_users"
ON utilisateurs FOR SELECT
TO authenticated
USING (id_organisation = get_user_organisation_id());

-- Permettre de modifier seulement son propre profil
CREATE POLICY "allow_update_own_user"
ON utilisateurs FOR UPDATE
TO authenticated
USING (
  id_organisation = get_user_organisation_id()
  AND id = (SELECT id_utilisateur FROM utilisateurs_auth WHERE id_auth_user = auth.uid())
);


-- ========== UTILISATEURS_AUTH (liaison) ==========

-- Permettre à TOUT LE MONDE de créer une liaison (pour l'inscription)
CREATE POLICY "allow_insert_user_auth"
ON utilisateurs_auth FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permettre de lire seulement les liaisons de son organisation
CREATE POLICY "allow_select_own_org_auth"
ON utilisateurs_auth FOR SELECT
TO authenticated
USING (id_organisation = get_user_organisation_id());


-- ÉTAPE 3 : VÉRIFICATION
-- ============================================

-- Afficher toutes les politiques pour vérifier
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('organisations', 'utilisateurs', 'utilisateurs_auth', 'roles')
ORDER BY tablename, policyname;
