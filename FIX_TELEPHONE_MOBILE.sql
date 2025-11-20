-- ============================================
-- AJOUTER LA COLONNE telephone_mobile SI ELLE N'EXISTE PAS
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- Vérifier les colonnes de téléphone existantes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'utilisateurs'
  AND column_name LIKE '%telephone%';

-- Ajouter la colonne telephone_mobile si elle n'existe pas
ALTER TABLE utilisateurs
ADD COLUMN IF NOT EXISTS telephone_mobile VARCHAR(20);

-- Vérification finale
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'utilisateurs'
  AND column_name LIKE '%telephone%';
