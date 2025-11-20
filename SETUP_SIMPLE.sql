-- ============================================
-- XORA CRM - SCRIPT SQL SIMPLIFIÉ
-- À copier-coller dans le SQL Editor de Supabase
-- ============================================

-- ÉTAPE 1 : Créer la table organisations
-- ============================================
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  adresse VARCHAR(255),
  telephone VARCHAR(20),
  email VARCHAR(255),
  site_web VARCHAR(255),
  statut VARCHAR(50) DEFAULT 'actif',
  date_creation DATE DEFAULT CURRENT_DATE,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

-- ÉTAPE 2 : Ajouter id_organisation aux tables existantes
-- ============================================
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;
ALTER TABLE projets ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;
ALTER TABLE taches ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;
ALTER TABLE rendez_vous ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_utilisateurs_id_organisation ON utilisateurs(id_organisation);
CREATE INDEX IF NOT EXISTS idx_contacts_id_organisation ON contacts(id_organisation);
CREATE INDEX IF NOT EXISTS idx_projets_id_organisation ON projets(id_organisation);
CREATE INDEX IF NOT EXISTS idx_taches_id_organisation ON taches(id_organisation);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_id_organisation ON rendez_vous(id_organisation);

-- ÉTAPE 3 : Créer la table de liaison auth
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_auth_user UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  id_utilisateur UUID NOT NULL UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
  id_organisation UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  cree_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_utilisateurs_auth_id_auth_user ON utilisateurs_auth(id_auth_user);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_auth_id_organisation ON utilisateurs_auth(id_organisation);

-- ÉTAPE 4 : Fonction pour obtenir l'organisation de l'utilisateur
-- ============================================
CREATE OR REPLACE FUNCTION get_user_organisation_id()
RETURNS UUID AS $$
  SELECT id_organisation
  FROM utilisateurs_auth
  WHERE id_auth_user = auth.uid()
$$ LANGUAGE SQL STABLE;

-- ÉTAPE 5 : Activer RLS sur toutes les tables
-- ============================================
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE biens_immobiliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_externes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapes_projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborateurs_rendez_vous ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 6 : Politiques RLS pour ORGANISATIONS
-- ============================================
DROP POLICY IF EXISTS "Voir son organisation" ON organisations;
CREATE POLICY "Voir son organisation"
ON organisations FOR SELECT
USING (id = get_user_organisation_id());

-- ÉTAPE 7 : Politiques RLS pour UTILISATEURS
-- ============================================
DROP POLICY IF EXISTS "Voir utilisateurs de son org" ON utilisateurs;
CREATE POLICY "Voir utilisateurs de son org"
ON utilisateurs FOR SELECT
USING (id_organisation = get_user_organisation_id());

-- ÉTAPE 8 : Politiques RLS pour CONTACTS
-- ============================================
DROP POLICY IF EXISTS "Voir contacts de son org" ON contacts;
CREATE POLICY "Voir contacts de son org"
ON contacts FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Créer contacts pour son org" ON contacts;
CREATE POLICY "Créer contacts pour son org"
ON contacts FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Modifier contacts de son org" ON contacts;
CREATE POLICY "Modifier contacts de son org"
ON contacts FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Supprimer contacts de son org" ON contacts;
CREATE POLICY "Supprimer contacts de son org"
ON contacts FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ÉTAPE 9 : Politiques RLS pour BIENS IMMOBILIERS
-- ============================================
DROP POLICY IF EXISTS "Voir biens de son org" ON biens_immobiliers;
CREATE POLICY "Voir biens de son org"
ON biens_immobiliers FOR SELECT
USING (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Créer biens pour son org" ON biens_immobiliers;
CREATE POLICY "Créer biens pour son org"
ON biens_immobiliers FOR INSERT
WITH CHECK (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Modifier biens de son org" ON biens_immobiliers;
CREATE POLICY "Modifier biens de son org"
ON biens_immobiliers FOR UPDATE
USING (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Supprimer biens de son org" ON biens_immobiliers;
CREATE POLICY "Supprimer biens de son org"
ON biens_immobiliers FOR DELETE
USING (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

-- ÉTAPE 10 : Politiques RLS pour CONTACTS EXTERNES
-- ============================================
DROP POLICY IF EXISTS "Voir contacts ext de son org" ON contacts_externes;
CREATE POLICY "Voir contacts ext de son org"
ON contacts_externes FOR SELECT
USING (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Créer contacts ext pour son org" ON contacts_externes;
CREATE POLICY "Créer contacts ext pour son org"
ON contacts_externes FOR INSERT
WITH CHECK (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Modifier contacts ext de son org" ON contacts_externes;
CREATE POLICY "Modifier contacts ext de son org"
ON contacts_externes FOR UPDATE
USING (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Supprimer contacts ext de son org" ON contacts_externes;
CREATE POLICY "Supprimer contacts ext de son org"
ON contacts_externes FOR DELETE
USING (id_contact IN (SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()));

-- ÉTAPE 11 : Politiques RLS pour PROJETS
-- ============================================
DROP POLICY IF EXISTS "Voir projets de son org" ON projets;
CREATE POLICY "Voir projets de son org"
ON projets FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Créer projets pour son org" ON projets;
CREATE POLICY "Créer projets pour son org"
ON projets FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Modifier projets de son org" ON projets;
CREATE POLICY "Modifier projets de son org"
ON projets FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Supprimer projets de son org" ON projets;
CREATE POLICY "Supprimer projets de son org"
ON projets FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ÉTAPE 12 : Politiques RLS pour ÉTAPES PROJETS
-- ============================================
DROP POLICY IF EXISTS "Voir étapes de son org" ON etapes_projets;
CREATE POLICY "Voir étapes de son org"
ON etapes_projets FOR SELECT
USING (id_projet IN (SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Créer étapes pour son org" ON etapes_projets;
CREATE POLICY "Créer étapes pour son org"
ON etapes_projets FOR INSERT
WITH CHECK (id_projet IN (SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Modifier étapes de son org" ON etapes_projets;
CREATE POLICY "Modifier étapes de son org"
ON etapes_projets FOR UPDATE
USING (id_projet IN (SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Supprimer étapes de son org" ON etapes_projets;
CREATE POLICY "Supprimer étapes de son org"
ON etapes_projets FOR DELETE
USING (id_projet IN (SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()));

-- ÉTAPE 13 : Politiques RLS pour TÂCHES
-- ============================================
DROP POLICY IF EXISTS "Voir tâches de son org" ON taches;
CREATE POLICY "Voir tâches de son org"
ON taches FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Créer tâches pour son org" ON taches;
CREATE POLICY "Créer tâches pour son org"
ON taches FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Modifier tâches de son org" ON taches;
CREATE POLICY "Modifier tâches de son org"
ON taches FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Supprimer tâches de son org" ON taches;
CREATE POLICY "Supprimer tâches de son org"
ON taches FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ÉTAPE 14 : Politiques RLS pour RENDEZ-VOUS
-- ============================================
DROP POLICY IF EXISTS "Voir RDV de son org" ON rendez_vous;
CREATE POLICY "Voir RDV de son org"
ON rendez_vous FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Créer RDV pour son org" ON rendez_vous;
CREATE POLICY "Créer RDV pour son org"
ON rendez_vous FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Modifier RDV de son org" ON rendez_vous;
CREATE POLICY "Modifier RDV de son org"
ON rendez_vous FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Supprimer RDV de son org" ON rendez_vous;
CREATE POLICY "Supprimer RDV de son org"
ON rendez_vous FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ÉTAPE 15 : Politiques RLS pour COLLABORATEURS RENDEZ-VOUS
-- ============================================
DROP POLICY IF EXISTS "Voir collab RDV de son org" ON collaborateurs_rendez_vous;
CREATE POLICY "Voir collab RDV de son org"
ON collaborateurs_rendez_vous FOR SELECT
USING (id_rendez_vous IN (SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Créer collab RDV pour son org" ON collaborateurs_rendez_vous;
CREATE POLICY "Créer collab RDV pour son org"
ON collaborateurs_rendez_vous FOR INSERT
WITH CHECK (id_rendez_vous IN (SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Modifier collab RDV de son org" ON collaborateurs_rendez_vous;
CREATE POLICY "Modifier collab RDV de son org"
ON collaborateurs_rendez_vous FOR UPDATE
USING (id_rendez_vous IN (SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()));

DROP POLICY IF EXISTS "Supprimer collab RDV de son org" ON collaborateurs_rendez_vous;
CREATE POLICY "Supprimer collab RDV de son org"
ON collaborateurs_rendez_vous FOR DELETE
USING (id_rendez_vous IN (SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()));

-- ÉTAPE 16 : Trigger pour auto-remplir id_organisation
-- ============================================
CREATE OR REPLACE FUNCTION set_organisation_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id_organisation IS NULL THEN
    NEW.id_organisation := get_user_organisation_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_org_contacts ON contacts;
CREATE TRIGGER trigger_set_org_contacts
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

DROP TRIGGER IF EXISTS trigger_set_org_projets ON projets;
CREATE TRIGGER trigger_set_org_projets
  BEFORE INSERT ON projets
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

DROP TRIGGER IF EXISTS trigger_set_org_taches ON taches;
CREATE TRIGGER trigger_set_org_taches
  BEFORE INSERT ON taches
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

DROP TRIGGER IF EXISTS trigger_set_org_rdv ON rendez_vous;
CREATE TRIGGER trigger_set_org_rdv
  BEFORE INSERT ON rendez_vous
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

-- ============================================
-- FIN DU SCRIPT - Maintenant créez vos données
-- ============================================
