-- ============================================
-- AJOUTER LES CHAMPS MANQUANTS POUR "NOTRE ENTREPRISE"
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- 1. Ajouter SIRET et N° de TVA à la table organisations
ALTER TABLE organisations
ADD COLUMN IF NOT EXISTS siret VARCHAR(14),
ADD COLUMN IF NOT EXISTS numero_tva VARCHAR(20);

-- 2. Créer la table pour les documents de l'organisation
CREATE TABLE IF NOT EXISTS documents_organisation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_organisation UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- 'IBAN', 'KBIS', 'ASSURANCE_DECENNALE', etc.
  description TEXT,
  url_fichier TEXT, -- URL du fichier dans Supabase Storage
  nom_fichier VARCHAR(255),
  taille_fichier INTEGER, -- en bytes
  type_mime VARCHAR(100),
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_org_id_organisation ON documents_organisation(id_organisation);
CREATE INDEX idx_documents_org_type ON documents_organisation(type);

-- 3. Activer RLS sur la table documents_organisation
ALTER TABLE documents_organisation ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS pour documents_organisation
-- Permettre à tout le monde de créer des documents (pour l'inscription/ajout initial)
CREATE POLICY "docs_allow_insert"
ON documents_organisation FOR INSERT
WITH CHECK (true);

-- Voir seulement les documents de son organisation
CREATE POLICY "docs_allow_select_own_org"
ON documents_organisation FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND id_organisation IN (
    SELECT id_organisation FROM utilisateurs_auth WHERE id_auth_user = auth.uid()
  )
);

-- Modifier seulement les documents de son organisation
CREATE POLICY "docs_allow_update_own_org"
ON documents_organisation FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND id_organisation IN (
    SELECT id_organisation FROM utilisateurs_auth WHERE id_auth_user = auth.uid()
  )
);

-- Supprimer seulement les documents de son organisation
CREATE POLICY "docs_allow_delete_own_org"
ON documents_organisation FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND id_organisation IN (
    SELECT id_organisation FROM utilisateurs_auth WHERE id_auth_user = auth.uid()
  )
);

-- 5. Créer le bucket de stockage pour les documents
-- Note: Cette commande doit être exécutée séparément dans l'interface Storage de Supabase
-- ou via l'API Storage. Elle est ici à titre informatif.
--
-- Nom du bucket : 'organisation-documents'
-- Public : Non (private)
-- Allowed MIME types : application/pdf, image/jpeg, image/png, etc.

-- Vérification
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'organisations'
  AND column_name IN ('siret', 'numero_tva');
