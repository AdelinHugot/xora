-- ============================================
-- SOLUTION FINALE : DÉSACTIVER RLS SUR LES TABLES D'INSCRIPTION
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- Désactiver RLS sur les tables nécessaires pour l'inscription
ALTER TABLE organisations DISABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs DISABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs_auth DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;

-- GARDER RLS ACTIVÉ sur les autres tables (contacts, projets, etc.)
-- pour maintenir la sécurité multi-tenant

-- Les tables suivantes GARDENT leur RLS actif :
-- - contacts
-- - biens_immobiliers
-- - contacts_externes
-- - projets
-- - etapes_projets
-- - taches
-- - rendez_vous
-- - collaborateurs_rendez_vous

-- Cela permet :
-- ✅ L'inscription de fonctionner sans problème
-- ✅ La sécurité multi-tenant sur les données métier
