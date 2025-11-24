-- ============================================
-- AJOUTER LA COLONNE agenceur_referent À LA TABLE CONTACTS
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- Ajouter la colonne agenceur_referent avec une clé étrangère vers utilisateurs
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS agenceur_referent UUID REFERENCES utilisateurs(id);

-- Ajouter un commentaire pour la documentation
COMMENT ON COLUMN contacts.agenceur_referent IS 'Référence vers l''utilisateur agenceur responsable du contact';
