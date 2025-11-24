-- ============================================
-- AJOUTER LES COLONNES MANQUANTES À LA TABLE CONTACTS
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- Ajouter la colonne agenceur_referent avec une clé étrangère vers utilisateurs
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS agenceur_referent UUID REFERENCES utilisateurs(id);

-- Ajouter la colonne rgpd pour le consentement RGPD
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS rgpd BOOLEAN DEFAULT false;

-- Ajouter la colonne societe pour le nom de la société du contact
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS societe TEXT;

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN contacts.agenceur_referent IS 'Référence vers l''utilisateur agenceur responsable du contact';
COMMENT ON COLUMN contacts.rgpd IS 'Consentement RGPD du contact';
COMMENT ON COLUMN contacts.societe IS 'Nom de la société du contact';
