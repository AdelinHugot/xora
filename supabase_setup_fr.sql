-- ============================================
-- XORA CRM - CONFIGURATION SCHEMA SUPABASE
-- ENTIÈREMENT EN FRANÇAIS
-- ============================================

-- 1. ACTIVER LES EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- 2. TABLE RÔLES
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  couleur VARCHAR(50) DEFAULT 'blue',
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. TABLE UTILISATEURS
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  civilite VARCHAR(50) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  url_avatar TEXT,
  id_role UUID NOT NULL REFERENCES roles(id),
  statut VARCHAR(50) DEFAULT 'actif',
  date_adhesion TIMESTAMP DEFAULT NOW(),
  derniere_connexion TIMESTAMP,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_id_role ON utilisateurs(id_role);
CREATE INDEX idx_utilisateurs_statut ON utilisateurs(statut);

-- ============================================
-- 4. TABLE CONTACTS
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  civilite VARCHAR(50) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telephone VARCHAR(20),
  telephone_mobile VARCHAR(20),
  telephone_fixe VARCHAR(20),
  nom_entreprise VARCHAR(255),
  statut VARCHAR(50) NOT NULL,
  origine VARCHAR(50),
  sous_origine VARCHAR(255),
  nom_origine VARCHAR(255),
  localisation VARCHAR(255),
  adresse VARCHAR(255),
  complement_adresse VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  id_referent UUID REFERENCES utilisateurs(id),
  numero_compte_client VARCHAR(255),
  id_ajoute_par UUID REFERENCES utilisateurs(id),
  date_ajout TIMESTAMP,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW(),
  supprime_le TIMESTAMP
);

CREATE INDEX idx_contacts_statut ON contacts(statut);
CREATE INDEX idx_contacts_id_referent ON contacts(id_referent);
CREATE INDEX idx_contacts_origine ON contacts(origine);
CREATE INDEX idx_contacts_localisation ON contacts(localisation);
CREATE INDEX idx_contacts_cree_le ON contacts(cree_le);

-- ============================================
-- 5. TABLE BIENS IMMOBILIERS
-- ============================================
CREATE TABLE IF NOT EXISTS biens_immobiliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_contact UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  adresse VARCHAR(255) NOT NULL,
  complement_adresse VARCHAR(255),
  type VARCHAR(100) NOT NULL,
  proprietaire VARCHAR(255) NOT NULL,
  type_immobilier VARCHAR(100),
  nature_bien VARCHAR(100),
  type_travaux VARCHAR(100),
  acqu_plus_deux_ans BOOLEAN DEFAULT FALSE,
  etage VARCHAR(20),
  ascenseur BOOLEAN DEFAULT FALSE,
  infos_divers TEXT,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_biens_immobiliers_id_contact ON biens_immobiliers(id_contact);
CREATE INDEX idx_biens_immobiliers_type ON biens_immobiliers(type_immobilier);

-- ============================================
-- 6. TABLE CONTACTS EXTERNES
-- ============================================
CREATE TABLE IF NOT EXISTS contacts_externes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_contact UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  civilite VARCHAR(50),
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telephone VARCHAR(20),
  relation VARCHAR(100),
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_externes_id_contact ON contacts_externes(id_contact);

-- ============================================
-- 7. TABLE PROJETS
-- ============================================
CREATE TABLE IF NOT EXISTS projets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) NOT NULL,
  id_contact UUID NOT NULL REFERENCES contacts(id),
  nom_contact VARCHAR(255),
  nom_projet VARCHAR(255) NOT NULL,
  titre VARCHAR(255) NOT NULL,
  statut VARCHAR(100) NOT NULL,
  progression INTEGER DEFAULT 0,
  label_progression VARCHAR(100),
  id_referent UUID REFERENCES utilisateurs(id),
  agence VARCHAR(255),
  origine VARCHAR(255),
  sous_origine VARCHAR(255),
  lien_sponsor VARCHAR(255),
  adresse_chantier VARCHAR(255),
  adresse_facturation VARCHAR(255),
  metier_etudie VARCHAR(255),
  execution_travaux VARCHAR(255),
  artisans_necessaires BOOLEAN DEFAULT FALSE,
  liste_artisans TEXT,
  date_signature DATE,
  dates_travaux VARCHAR(255),
  date_installation DATE,
  budget_bas DECIMAL(12, 2),
  budget_haut DECIMAL(12, 2),
  budget_global DECIMAL(12, 2),
  financement VARCHAR(255),
  enlevement VARCHAR(255),
  installation VARCHAR(255),
  livre_par VARCHAR(255),
  plans_techniques BOOLEAN DEFAULT FALSE,
  nombre_concurrents INTEGER,
  concurrents TEXT,
  budget_concurrence VARCHAR(255),
  statut_projet VARCHAR(255),
  permis_construire BOOLEAN DEFAULT FALSE,
  date_permis DATE,
  telephone VARCHAR(20),
  email VARCHAR(255),
  -- Découverte Cuisine
  types_ambiance TEXT,
  ambiance_appreciee TEXT,
  ambiance_eviter TEXT,
  meubles TEXT,
  poignees VARCHAR(255),
  plan_travail VARCHAR(255),
  sol_cuisine VARCHAR(255),
  revetement_murs VARCHAR(255),
  autres_details TEXT,
  selection_meubles TEXT,
  description_materiaux TEXT,
  notes_ambiance TEXT,
  notes_meubles TEXT,
  notes_electromenagers TEXT,
  notes_financier TEXT,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW(),
  supprime_le TIMESTAMP
);

CREATE INDEX idx_projets_id_contact ON projets(id_contact);
CREATE INDEX idx_projets_id_referent ON projets(id_referent);
CREATE INDEX idx_projets_statut ON projets(statut);
CREATE INDEX idx_projets_cree_le ON projets(cree_le);

-- ============================================
-- 8. TABLE ÉTAPES PROJETS
-- ============================================
CREATE TABLE IF NOT EXISTS etapes_projets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_projet UUID NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  numero_etape INTEGER NOT NULL,
  label VARCHAR(100) NOT NULL,
  progression INTEGER DEFAULT 0,
  couleur VARCHAR(50),
  cree_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_etapes_projets_id_projet ON etapes_projets(id_projet);

-- ============================================
-- 9. TABLE TÂCHES
-- ============================================
CREATE TABLE IF NOT EXISTS taches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  index_tache INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL,
  titre VARCHAR(255) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  id_projet UUID REFERENCES projets(id),
  id_contact UUID REFERENCES contacts(id),
  nom_client VARCHAR(255),
  nom_projet VARCHAR(255),
  id_affecte_a UUID REFERENCES utilisateurs(id),
  statut VARCHAR(100) NOT NULL,
  progression INTEGER DEFAULT 0,
  date_echeance DATE,
  note TEXT,
  est_en_retard BOOLEAN DEFAULT FALSE,
  jours_retard INTEGER DEFAULT 0,
  a_alerte BOOLEAN DEFAULT FALSE,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW(),
  supprime_le TIMESTAMP
);

CREATE INDEX idx_taches_id_projet ON taches(id_projet);
CREATE INDEX idx_taches_id_contact ON taches(id_contact);
CREATE INDEX idx_taches_id_affecte_a ON taches(id_affecte_a);
CREATE INDEX idx_taches_statut ON taches(statut);
CREATE INDEX idx_taches_tag ON taches(tag);
CREATE INDEX idx_taches_date_echeance ON taches(date_echeance);

-- ============================================
-- 10. TABLE RENDEZ-VOUS
-- ============================================
CREATE TABLE IF NOT EXISTS rendez_vous (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre VARCHAR(255) NOT NULL,
  id_contact UUID REFERENCES contacts(id),
  date_debut DATE NOT NULL,
  heure_debut TIME NOT NULL,
  date_fin DATE NOT NULL,
  heure_fin TIME NOT NULL,
  lieu VARCHAR(255),
  commentaires TEXT,
  id_cree_par UUID REFERENCES utilisateurs(id),
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW(),
  supprime_le TIMESTAMP
);

CREATE INDEX idx_rendez_vous_id_contact ON rendez_vous(id_contact);
CREATE INDEX idx_rendez_vous_date_debut ON rendez_vous(date_debut);
CREATE INDEX idx_rendez_vous_id_cree_par ON rendez_vous(id_cree_par);

-- ============================================
-- 11. TABLE COLLABORATEURS RENDEZ-VOUS
-- ============================================
CREATE TABLE IF NOT EXISTS collaborateurs_rendez_vous (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_rendez_vous UUID NOT NULL REFERENCES rendez_vous(id) ON DELETE CASCADE,
  id_utilisateur UUID NOT NULL REFERENCES utilisateurs(id),
  statut_reponse VARCHAR(50) DEFAULT 'pas_repondu',
  cree_le TIMESTAMP DEFAULT NOW(),
  UNIQUE(id_rendez_vous, id_utilisateur)
);

CREATE INDEX idx_collaborateurs_rdv ON collaborateurs_rendez_vous(id_rendez_vous, id_utilisateur);

-- ============================================
-- 12. TABLE ARTICLES
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  contenu TEXT,
  categorie VARCHAR(100),
  tags VARCHAR(500),
  id_auteur UUID REFERENCES utilisateurs(id),
  est_publie BOOLEAN DEFAULT FALSE,
  nombre_vues INTEGER DEFAULT 0,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW(),
  publie_le TIMESTAMP
);

CREATE INDEX idx_articles_categorie ON articles(categorie);
CREATE INDEX idx_articles_id_auteur ON articles(id_auteur);
CREATE INDEX idx_articles_est_publie ON articles(est_publie);

-- ============================================
-- 13. TABLE KPIs
-- ============================================
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_kpi VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  valeur DECIMAL(15, 2),
  objectif DECIMAL(15, 2),
  unite VARCHAR(50),
  couleur VARCHAR(50),
  periode VARCHAR(50),
  regle_calcul VARCHAR(500),
  modifie_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kpis_type_kpi ON kpis(type_kpi);
CREATE INDEX idx_kpis_periode ON kpis(periode);

-- ============================================
-- 14. TABLE LOGS D'AUDIT
-- ============================================
CREATE TABLE IF NOT EXISTS logs_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_entite VARCHAR(100) NOT NULL,
  id_entite VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  id_utilisateur UUID REFERENCES utilisateurs(id),
  anciennes_valeurs JSONB,
  nouvelles_valeurs JSONB,
  adresse_ip VARCHAR(45),
  user_agent TEXT,
  cree_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_audit_entite ON logs_audit(type_entite, id_entite);
CREATE INDEX idx_logs_audit_id_utilisateur ON logs_audit(id_utilisateur);
CREATE INDEX idx_logs_audit_action ON logs_audit(action);
CREATE INDEX idx_logs_audit_cree_le ON logs_audit(cree_le);

-- ============================================
-- 15. TABLE FLUX D'ACTIVITÉ
-- ============================================
CREATE TABLE IF NOT EXISTS flux_activite (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_utilisateur UUID NOT NULL REFERENCES utilisateurs(id),
  type_activite VARCHAR(100) NOT NULL,
  type_entite VARCHAR(100),
  id_entite VARCHAR(255),
  description TEXT,
  icone VARCHAR(50),
  couleur VARCHAR(50),
  cree_le TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flux_activite_id_utilisateur ON flux_activite(id_utilisateur);
CREATE INDEX idx_flux_activite_cree_le ON flux_activite(cree_le);

-- ============================================
-- 16. TABLE INTÉGRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) NOT NULL,
  type_service VARCHAR(100) NOT NULL,
  cle_api VARCHAR(500),
  config JSONB,
  est_actif BOOLEAN DEFAULT TRUE,
  derniere_synchro TIMESTAMP,
  cree_le TIMESTAMP DEFAULT NOW(),
  modifie_le TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INSERTION DES DONNÉES INITIALES
-- ============================================

-- Insérer les rôles
INSERT INTO roles (nom, description, couleur) VALUES
('Administrateur', 'Accès complet à l''application', 'violet'),
('Manager', 'Gestion équipe et projets', 'blue'),
('Commercial', 'Gestion contacts et devis', 'green'),
('Technicien', 'Suivi technique des projets', 'orange');

-- Récupérer les IDs des rôles créés
WITH role_ids AS (
  SELECT id, nom FROM roles ORDER BY nom
)
-- Insérer les utilisateurs avec les bons IDs de rôles
INSERT INTO utilisateurs (civilite, prenom, nom, email, telephone, id_role, statut)
SELECT 'Mr', 'Admin', 'Xora', 'admin@xora.fr', '+33612345678', (SELECT id FROM roles WHERE nom = 'Administrateur'), 'actif'
UNION ALL SELECT 'Mme', 'Marie', 'Dupont', 'marie.dupont@xora.fr', '+33612345679', (SELECT id FROM roles WHERE nom = 'Manager'), 'actif'
UNION ALL SELECT 'Mr', 'Jérémy', 'Colomb', 'jeremy.colomb@xora.fr', '+33612345680', (SELECT id FROM roles WHERE nom = 'Commercial'), 'actif'
UNION ALL SELECT 'Mr', 'Thomas', 'Dubois', 'thomas.dubois@xora.fr', '+33612345681', (SELECT id FROM roles WHERE nom = 'Technicien'), 'actif';

-- Récupérer les IDs des utilisateurs créés
WITH user_ids AS (
  SELECT id, email FROM utilisateurs ORDER BY email
)
-- Insérer les contacts de test
INSERT INTO contacts (civilite, prenom, nom, email, telephone, nom_entreprise, statut, origine, localisation, id_referent)
VALUES
('Mme', 'Chloé', 'Dupont', 'chloe.dupont@email.com', '+33612345700', 'Dupont Immobilier', 'Client', 'Web', 'Paris', (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr')),
('Mr', 'Lucas', 'Martinez', 'lucas.martinez@email.com', '+33612345701', 'Martinez Construction', 'Prospect', 'Relation', 'Lyon', (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr')),
('Mme', 'Amélie', 'Bernard', 'amelie.bernard@email.com', '+33612345702', 'Bernard Architecture', 'Client', 'Recommandation', 'Marseille', (SELECT id FROM utilisateurs WHERE email = 'marie.dupont@xora.fr')),
('Mme', 'Coline', 'Farget', 'coline.farget@email.com', '+33612345703', 'Farget Design', 'Leads', 'Salon', 'Toulouse', (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr')),
('Mr', 'Jean', 'Durand', 'jean.durand@email.com', '+33612345704', 'Durand Rénovation', 'Client', 'Web', 'Bordeaux', (SELECT id FROM utilisateurs WHERE email = 'marie.dupont@xora.fr'));

-- Insérer les biens immobiliers
INSERT INTO biens_immobiliers (id_contact, adresse, type, proprietaire, type_immobilier, etage)
SELECT id, '12 rue de Paris, 75001 Paris', 'Bien principal', 'Chloé Dupont', 'Appartement', '3ème' FROM contacts WHERE email = 'chloe.dupont@email.com'
UNION ALL SELECT (SELECT id FROM contacts WHERE email = 'chloe.dupont@email.com'), '45 avenue des Champs, 75008 Paris', 'Bien secondaire', 'Chloé Dupont', 'Studio', 'RDC'
UNION ALL SELECT (SELECT id FROM contacts WHERE email = 'lucas.martinez@email.com'), '8 rue Montmartre, 75002 Paris', 'Bien principal', 'Lucas Martinez', 'Maison', '2ème'
UNION ALL SELECT (SELECT id FROM contacts WHERE email = 'amelie.bernard@email.com'), '15 boulevard Saint-Germain, 75005 Paris', 'Bien principal', 'Amélie Bernard', 'T3', '1er'
UNION ALL SELECT (SELECT id FROM contacts WHERE email = 'jean.durand@email.com'), '100 rue de Turenne, 75003 Paris', 'Bien principal', 'Jean Durand', 'Maison', 'RDC';

-- Insérer les projets de test
INSERT INTO projets (type, id_contact, nom_contact, nom_projet, titre, statut, progression, id_referent)
SELECT 'Cuisiniste', id, 'Chloé Dupont', 'Cuisine étage 2', 'Rénovation cuisine étage 2', 'Dossier technique', 60, (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr') FROM contacts WHERE email = 'chloe.dupont@email.com'
UNION ALL SELECT 'Salle de bain', (SELECT id FROM contacts WHERE email = 'chloe.dupont@email.com'), 'Chloé Dupont', 'Salle de bain étage', 'Rénovation salle de bain', 'Installation', 75, (SELECT id FROM utilisateurs WHERE email = 'marie.dupont@xora.fr')
UNION ALL SELECT 'Agencement', (SELECT id FROM contacts WHERE email = 'lucas.martinez@email.com'), 'Lucas Martinez', 'Terrasse', 'Aménagement terrasse', 'Prospect', 20, (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr')
UNION ALL SELECT 'Cuisiniste', (SELECT id FROM contacts WHERE email = 'lucas.martinez@email.com'), 'Lucas Martinez', 'Rénovation cuisine', 'Cuisine moderne', 'Étude client', 45, (SELECT id FROM utilisateurs WHERE email = 'marie.dupont@xora.fr')
UNION ALL SELECT 'Salle de bain', (SELECT id FROM contacts WHERE email = 'amelie.bernard@email.com'), 'Amélie Bernard', 'Installation douche', 'Douche italienne', 'Installation', 85, (SELECT id FROM utilisateurs WHERE email = 'thomas.dubois@xora.fr');

-- Insérer les rendez-vous de test
INSERT INTO rendez_vous (titre, id_contact, date_debut, heure_debut, date_fin, heure_fin, lieu, id_cree_par)
SELECT 'RDV R1 Dupont', id, DATE '2025-11-24', TIME '10:30', DATE '2025-11-24', TIME '12:30', '12 rue de Paris, 75001 Paris', (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr') FROM contacts WHERE email = 'chloe.dupont@email.com'
UNION ALL SELECT 'Visite Chantier', (SELECT id FROM contacts WHERE email = 'lucas.martinez@email.com'), DATE '2025-11-25', TIME '14:00', DATE '2025-11-25', TIME '16:30', 'Chantier Lyon', (SELECT id FROM utilisateurs WHERE email = 'marie.dupont@xora.fr')
UNION ALL SELECT 'Réunion Client', (SELECT id FROM contacts WHERE email = 'amelie.bernard@email.com'), DATE '2025-11-26', TIME '09:00', DATE '2025-11-26', TIME '10:00', 'Showroom Marseille', (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr');

-- Insérer les collaborateurs aux rendez-vous
INSERT INTO collaborateurs_rendez_vous (id_rendez_vous, id_utilisateur, statut_reponse)
SELECT rv.id, u.id, 'accepte' FROM rendez_vous rv, utilisateurs u WHERE rv.titre = 'RDV R1 Dupont' AND u.email = 'jeremy.colomb@xora.fr'
UNION ALL SELECT rv.id, u.id, 'provisoire' FROM rendez_vous rv, utilisateurs u WHERE rv.titre = 'RDV R1 Dupont' AND u.email = 'marie.dupont@xora.fr'
UNION ALL SELECT rv.id, u.id, 'accepte' FROM rendez_vous rv, utilisateurs u WHERE rv.titre = 'Visite Chantier' AND u.email = 'marie.dupont@xora.fr'
UNION ALL SELECT rv.id, u.id, 'accepte' FROM rendez_vous rv, utilisateurs u WHERE rv.titre = 'Visite Chantier' AND u.email = 'thomas.dubois@xora.fr'
UNION ALL SELECT rv.id, u.id, 'accepte' FROM rendez_vous rv, utilisateurs u WHERE rv.titre = 'Réunion Client' AND u.email = 'jeremy.colomb@xora.fr';

-- Insérer les tâches de test
INSERT INTO taches (index_tache, type, titre, tag, id_projet, id_contact, id_affecte_a, statut, progression)
SELECT 1, 'Tâche', 'Prendre les mesures cuisine', 'Dossier technique', pr.id, c.id, (SELECT id FROM utilisateurs WHERE email = 'thomas.dubois@xora.fr'), 'En cours', 50
FROM projets pr, contacts c WHERE pr.titre = 'Rénovation cuisine étage 2' AND c.email = 'chloe.dupont@email.com'
UNION ALL SELECT 2, 'Tâche', 'Faire devis installation', 'Dossier technique', pr.id, c.id, (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr'), 'Termini', 100
FROM projets pr, contacts c WHERE pr.titre = 'Rénovation cuisine étage 2' AND c.email = 'chloe.dupont@email.com'
UNION ALL SELECT 3, 'Tâche', 'Commander matériaux', 'Installation', pr.id, c.id, (SELECT id FROM utilisateurs WHERE email = 'marie.dupont@xora.fr'), 'Non commencé', 0
FROM projets pr, contacts c WHERE pr.titre = 'Rénovation salle de bain' AND c.email = 'chloe.dupont@email.com'
UNION ALL SELECT 4, 'Mémo', 'Appeler le client pour suivi', 'Prospect', pr.id, c.id, (SELECT id FROM utilisateurs WHERE email = 'jeremy.colomb@xora.fr'), 'Non commencé', 0
FROM projets pr, contacts c WHERE pr.titre = 'Aménagement terrasse' AND c.email = 'lucas.martinez@email.com';

-- Insérer les KPIs de test
INSERT INTO kpis (type_kpi, label, valeur, objectif, unite, couleur, periode) VALUES
('financier', 'Chiffre d''affaires', 45000, 50000, '€', '#2B7FFF', 'mensuel'),
('financier', 'Marge brute', 15000, 18000, '€', '#10B981', 'mensuel'),
('operationnel', 'Projets en cours', 12, 15, 'nb', '#F59E0B', 'mensuel'),
('operationnel', 'Taux de réussite', 85, 90, '%', '#8B5CF6', 'mensuel');
