-- ============================================
-- AJOUTER UN NUMÉRO SÉQUENTIEL AUX CONTACTS
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- Ajouter une colonne numero avec une séquence auto-incrémentée
CREATE SEQUENCE IF NOT EXISTS contacts_numero_seq;

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS numero INTEGER DEFAULT nextval('contacts_numero_seq');

-- Créer un index unique sur le numéro pour des recherches rapides
CREATE UNIQUE INDEX IF NOT EXISTS contacts_numero_idx ON contacts(numero);

-- Ajouter un commentaire
COMMENT ON COLUMN contacts.numero IS 'Numéro séquentiel unique du contact pour les URLs';
