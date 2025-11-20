-- ============================================
-- XORA CRM - MIGRATION MULTI-TENANT avec RLS
-- Ajout de la gestion des organisations/sociétés
-- ============================================

-- ============================================
-- 1. CRÉER LA TABLE ORGANISATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX idx_organisations_slug ON organisations(slug);
CREATE INDEX idx_organisations_statut ON organisations(statut);

-- ============================================
-- 2. AJOUTER id_organisation AUX TABLES EXISTANTES
-- ============================================

-- Ajouter id_organisation à la table utilisateurs
ALTER TABLE utilisateurs
ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;

-- Ajouter id_organisation à la table contacts
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;

-- Ajouter id_organisation à la table projets
ALTER TABLE projets
ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;

-- Ajouter id_organisation à la table taches (si elle existe)
ALTER TABLE taches
ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;

-- Ajouter id_organisation à la table rendez_vous (si elle existe)
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS id_organisation UUID REFERENCES organisations(id) ON DELETE CASCADE;

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_utilisateurs_id_organisation ON utilisateurs(id_organisation);
CREATE INDEX IF NOT EXISTS idx_contacts_id_organisation ON contacts(id_organisation);
CREATE INDEX IF NOT EXISTS idx_projets_id_organisation ON projets(id_organisation);
CREATE INDEX IF NOT EXISTS idx_taches_id_organisation ON taches(id_organisation);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_id_organisation ON rendez_vous(id_organisation);

-- ============================================
-- 3. CRÉER UNE TABLE DE LIAISON AUTH.USERS <-> UTILISATEURS
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs_auth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_auth_user UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  id_utilisateur UUID NOT NULL UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
  id_organisation UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  cree_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_utilisateurs_auth_id_auth_user ON utilisateurs_auth(id_auth_user);
CREATE INDEX idx_utilisateurs_auth_id_utilisateur ON utilisateurs_auth(id_utilisateur);
CREATE INDEX idx_utilisateurs_auth_id_organisation ON utilisateurs_auth(id_organisation);

-- ============================================
-- 4. FONCTION HELPER POUR OBTENIR L'ORGANISATION DE L'UTILISATEUR
-- ============================================
CREATE OR REPLACE FUNCTION get_user_organisation_id()
RETURNS UUID AS $$
  SELECT id_organisation
  FROM utilisateurs_auth
  WHERE id_auth_user = auth.uid()
$$ LANGUAGE SQL STABLE;

-- ============================================
-- 5. ACTIVER RLS SUR TOUTES LES TABLES
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

-- ============================================
-- 6. POLITIQUES RLS POUR ORGANISATIONS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leur organisation" ON organisations;
CREATE POLICY "Utilisateurs peuvent voir leur organisation"
ON organisations FOR SELECT
USING (id = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leur organisation" ON organisations;
CREATE POLICY "Utilisateurs peuvent modifier leur organisation"
ON organisations FOR UPDATE
USING (id = get_user_organisation_id());

-- ============================================
-- 7. POLITIQUES RLS POUR UTILISATEURS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les membres de leur organisation" ON utilisateurs;
CREATE POLICY "Utilisateurs peuvent voir les membres de leur organisation"
ON utilisateurs FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leur propre profil" ON utilisateurs;
CREATE POLICY "Utilisateurs peuvent modifier leur propre profil"
ON utilisateurs FOR UPDATE
USING (
  id_organisation = get_user_organisation_id()
  AND id = (SELECT id_utilisateur FROM utilisateurs_auth WHERE id_auth_user = auth.uid())
);

-- ============================================
-- 8. POLITIQUES RLS POUR CONTACTS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les contacts de leur organisation" ON contacts;
CREATE POLICY "Utilisateurs peuvent voir les contacts de leur organisation"
ON contacts FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des contacts pour leur organisation" ON contacts;
CREATE POLICY "Utilisateurs peuvent créer des contacts pour leur organisation"
ON contacts FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les contacts de leur organisation" ON contacts;
CREATE POLICY "Utilisateurs peuvent modifier les contacts de leur organisation"
ON contacts FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les contacts de leur organisation" ON contacts;
CREATE POLICY "Utilisateurs peuvent supprimer les contacts de leur organisation"
ON contacts FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ============================================
-- 9. POLITIQUES RLS POUR BIENS IMMOBILIERS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les biens de leur organisation" ON biens_immobiliers;
CREATE POLICY "Utilisateurs peuvent voir les biens de leur organisation"
ON biens_immobiliers FOR SELECT
USING (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des biens pour leur organisation" ON biens_immobiliers;
CREATE POLICY "Utilisateurs peuvent créer des biens pour leur organisation"
ON biens_immobiliers FOR INSERT
WITH CHECK (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les biens de leur organisation" ON biens_immobiliers;
CREATE POLICY "Utilisateurs peuvent modifier les biens de leur organisation"
ON biens_immobiliers FOR UPDATE
USING (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les biens de leur organisation" ON biens_immobiliers;
CREATE POLICY "Utilisateurs peuvent supprimer les biens de leur organisation"
ON biens_immobiliers FOR DELETE
USING (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

-- ============================================
-- 10. POLITIQUES RLS POUR CONTACTS EXTERNES
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les contacts externes de leur organisation" ON contacts_externes;
CREATE POLICY "Utilisateurs peuvent voir les contacts externes de leur organisation"
ON contacts_externes FOR SELECT
USING (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des contacts externes pour leur organisation" ON contacts_externes;
CREATE POLICY "Utilisateurs peuvent créer des contacts externes pour leur organisation"
ON contacts_externes FOR INSERT
WITH CHECK (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les contacts externes de leur organisation" ON contacts_externes;
CREATE POLICY "Utilisateurs peuvent modifier les contacts externes de leur organisation"
ON contacts_externes FOR UPDATE
USING (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les contacts externes de leur organisation" ON contacts_externes;
CREATE POLICY "Utilisateurs peuvent supprimer les contacts externes de leur organisation"
ON contacts_externes FOR DELETE
USING (
  id_contact IN (
    SELECT id FROM contacts WHERE id_organisation = get_user_organisation_id()
  )
);

-- ============================================
-- 11. POLITIQUES RLS POUR PROJETS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les projets de leur organisation" ON projets;
CREATE POLICY "Utilisateurs peuvent voir les projets de leur organisation"
ON projets FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des projets pour leur organisation" ON projets;
CREATE POLICY "Utilisateurs peuvent créer des projets pour leur organisation"
ON projets FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les projets de leur organisation" ON projets;
CREATE POLICY "Utilisateurs peuvent modifier les projets de leur organisation"
ON projets FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les projets de leur organisation" ON projets;
CREATE POLICY "Utilisateurs peuvent supprimer les projets de leur organisation"
ON projets FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ============================================
-- 12. POLITIQUES RLS POUR ÉTAPES PROJETS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les étapes de projets de leur organisation" ON etapes_projets;
CREATE POLICY "Utilisateurs peuvent voir les étapes de projets de leur organisation"
ON etapes_projets FOR SELECT
USING (
  id_projet IN (
    SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des étapes pour leur organisation" ON etapes_projets;
CREATE POLICY "Utilisateurs peuvent créer des étapes pour leur organisation"
ON etapes_projets FOR INSERT
WITH CHECK (
  id_projet IN (
    SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les étapes de leur organisation" ON etapes_projets;
CREATE POLICY "Utilisateurs peuvent modifier les étapes de leur organisation"
ON etapes_projets FOR UPDATE
USING (
  id_projet IN (
    SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les étapes de leur organisation" ON etapes_projets;
CREATE POLICY "Utilisateurs peuvent supprimer les étapes de leur organisation"
ON etapes_projets FOR DELETE
USING (
  id_projet IN (
    SELECT id FROM projets WHERE id_organisation = get_user_organisation_id()
  )
);

-- ============================================
-- 13. POLITIQUES RLS POUR TÂCHES
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les tâches de leur organisation" ON taches;
CREATE POLICY "Utilisateurs peuvent voir les tâches de leur organisation"
ON taches FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des tâches pour leur organisation" ON taches;
CREATE POLICY "Utilisateurs peuvent créer des tâches pour leur organisation"
ON taches FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les tâches de leur organisation" ON taches;
CREATE POLICY "Utilisateurs peuvent modifier les tâches de leur organisation"
ON taches FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les tâches de leur organisation" ON taches;
CREATE POLICY "Utilisateurs peuvent supprimer les tâches de leur organisation"
ON taches FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ============================================
-- 14. POLITIQUES RLS POUR RENDEZ-VOUS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les rendez-vous de leur organisation" ON rendez_vous;
CREATE POLICY "Utilisateurs peuvent voir les rendez-vous de leur organisation"
ON rendez_vous FOR SELECT
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des rendez-vous pour leur organisation" ON rendez_vous;
CREATE POLICY "Utilisateurs peuvent créer des rendez-vous pour leur organisation"
ON rendez_vous FOR INSERT
WITH CHECK (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les rendez-vous de leur organisation" ON rendez_vous;
CREATE POLICY "Utilisateurs peuvent modifier les rendez-vous de leur organisation"
ON rendez_vous FOR UPDATE
USING (id_organisation = get_user_organisation_id());

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les rendez-vous de leur organisation" ON rendez_vous;
CREATE POLICY "Utilisateurs peuvent supprimer les rendez-vous de leur organisation"
ON rendez_vous FOR DELETE
USING (id_organisation = get_user_organisation_id());

-- ============================================
-- 15. POLITIQUES RLS POUR COLLABORATEURS RENDEZ-VOUS
-- ============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les collaborateurs de rendez-vous de leur organisation" ON collaborateurs_rendez_vous;
CREATE POLICY "Utilisateurs peuvent voir les collaborateurs de rendez-vous de leur organisation"
ON collaborateurs_rendez_vous FOR SELECT
USING (
  id_rendez_vous IN (
    SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent créer des collaborateurs pour leur organisation" ON collaborateurs_rendez_vous;
CREATE POLICY "Utilisateurs peuvent créer des collaborateurs pour leur organisation"
ON collaborateurs_rendez_vous FOR INSERT
WITH CHECK (
  id_rendez_vous IN (
    SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent modifier les collaborateurs de leur organisation" ON collaborateurs_rendez_vous;
CREATE POLICY "Utilisateurs peuvent modifier les collaborateurs de leur organisation"
ON collaborateurs_rendez_vous FOR UPDATE
USING (
  id_rendez_vous IN (
    SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()
  )
);

DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer les collaborateurs de leur organisation" ON collaborateurs_rendez_vous;
CREATE POLICY "Utilisateurs peuvent supprimer les collaborateurs de leur organisation"
ON collaborateurs_rendez_vous FOR DELETE
USING (
  id_rendez_vous IN (
    SELECT id FROM rendez_vous WHERE id_organisation = get_user_organisation_id()
  )
);

-- ============================================
-- 16. FONCTION TRIGGER POUR AUTO-REMPLIR id_organisation
-- ============================================

-- Fonction pour auto-remplir id_organisation sur INSERT
CREATE OR REPLACE FUNCTION set_organisation_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id_organisation IS NULL THEN
    NEW.id_organisation := get_user_organisation_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables principales
DROP TRIGGER IF EXISTS trigger_set_organisation_id_contacts ON contacts;
CREATE TRIGGER trigger_set_organisation_id_contacts
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

DROP TRIGGER IF EXISTS trigger_set_organisation_id_projets ON projets;
CREATE TRIGGER trigger_set_organisation_id_projets
  BEFORE INSERT ON projets
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

DROP TRIGGER IF EXISTS trigger_set_organisation_id_taches ON taches;
CREATE TRIGGER trigger_set_organisation_id_taches
  BEFORE INSERT ON taches
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

DROP TRIGGER IF EXISTS trigger_set_organisation_id_rendez_vous ON rendez_vous;
CREATE TRIGGER trigger_set_organisation_id_rendez_vous
  BEFORE INSERT ON rendez_vous
  FOR EACH ROW
  EXECUTE FUNCTION set_organisation_id();

-- ============================================
-- 17. DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Créer une organisation de démonstration
INSERT INTO organisations (id, nom, slug, description, statut)
VALUES (
  'org-demo-001',
  'Xora Démonstration',
  'xora-demo',
  'Organisation de démonstration pour Xora CRM',
  'actif'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIN DU SCRIPT DE MIGRATION MULTI-TENANT
-- ============================================
