-- ============================================
-- VÉRIFIER LA STRUCTURE DE LA TABLE CONTACTS
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- Vérifier toutes les colonnes de la table contacts
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;
