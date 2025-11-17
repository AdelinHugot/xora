-- ============================================
-- XORA CRM - CONFIGURATION SCHEMA SUPABASE
-- ============================================

-- 1. ACTIVER LES EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- 2. TABLE RÔLES
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT 'blue',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. TABLE UTILISATEURS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  civility VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES roles(id),
  status VARCHAR(50) DEFAULT 'active',
  join_date TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- 4. TABLE CONTACTS
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  civility VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  mobile_phone VARCHAR(20),
  landline_phone VARCHAR(20),
  company_name VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  origin VARCHAR(50),
  sub_origin VARCHAR(255),
  origin_name VARCHAR(255),
  location VARCHAR(255),
  address VARCHAR(255),
  address_complement VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  referent_id UUID REFERENCES users(id),
  client_access_account VARCHAR(255),
  added_by_id UUID REFERENCES users(id),
  added_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_referent_id ON contacts(referent_id);
CREATE INDEX idx_contacts_origin ON contacts(origin);
CREATE INDEX idx_contacts_location ON contacts(location);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- ============================================
-- 5. TABLE BIENS IMMOBILIERS
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  address VARCHAR(255) NOT NULL,
  address_complement VARCHAR(255),
  type VARCHAR(100) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  property_type VARCHAR(100),
  property_nature VARCHAR(100),
  work_type VARCHAR(100),
  more_than_two_years BOOLEAN DEFAULT FALSE,
  floor VARCHAR(20),
  elevator BOOLEAN DEFAULT FALSE,
  misc_info TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_contact_id ON properties(contact_id);
CREATE INDEX idx_properties_type ON properties(property_type);

-- ============================================
-- 6. TABLE CONTACTS EXTERNES
-- ============================================
CREATE TABLE IF NOT EXISTS external_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  civility VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  relationship VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_external_contacts_contact_id ON external_contacts(contact_id);

-- ============================================
-- 7. TABLE PROJETS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) NOT NULL,
  contact_id UUID NOT NULL REFERENCES contacts(id),
  contact_name VARCHAR(255),
  project_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL,
  progress INTEGER DEFAULT 0,
  progress_label VARCHAR(100),
  referent_id UUID REFERENCES users(id),
  agency VARCHAR(255),
  origin VARCHAR(255),
  sub_origin VARCHAR(255),
  sponsor_link VARCHAR(255),
  site_address VARCHAR(255),
  billing_address VARCHAR(255),
  study_trade VARCHAR(255),
  work_execution VARCHAR(255),
  artisans_needed BOOLEAN DEFAULT FALSE,
  artisans_list TEXT,
  signature_date DATE,
  work_dates VARCHAR(255),
  installation_date DATE,
  budget_low DECIMAL(12, 2),
  budget_high DECIMAL(12, 2),
  global_budget DECIMAL(12, 2),
  financing VARCHAR(255),
  removal VARCHAR(255),
  installation VARCHAR(255),
  delivery_by VARCHAR(255),
  technical_plans BOOLEAN DEFAULT FALSE,
  competitors_count INTEGER,
  competitors TEXT,
  competitor_budget VARCHAR(255),
  project_status VARCHAR(255),
  building_permit BOOLEAN DEFAULT FALSE,
  permit_date DATE,
  phone VARCHAR(20),
  email VARCHAR(255),
  -- Découverte Cuisine
  ambiance_types TEXT,
  ambiance_appreciated TEXT,
  ambiance_to_avoid TEXT,
  furniture TEXT,
  handles VARCHAR(255),
  worktop VARCHAR(255),
  kitchen_floor VARCHAR(255),
  kitchen_wall VARCHAR(255),
  kitchen_other TEXT,
  furniture_selection TEXT,
  materials_description TEXT,
  notes_ambiance TEXT,
  notes_furniture TEXT,
  notes_appliances TEXT,
  notes_financial TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_projects_contact_id ON projects(contact_id);
CREATE INDEX idx_projects_referent_id ON projects(referent_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- ============================================
-- 8. TABLE ÉTAPES PROJETS
-- ============================================
CREATE TABLE IF NOT EXISTS project_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  label VARCHAR(100) NOT NULL,
  progress INTEGER DEFAULT 0,
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_project_steps_project_id ON project_steps(project_id);

-- ============================================
-- 9. TABLE TÂCHES
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_index INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  project_id UUID REFERENCES projects(id),
  contact_id UUID REFERENCES contacts(id),
  client_name VARCHAR(255),
  project_name VARCHAR(255),
  assignee_id UUID REFERENCES users(id),
  status VARCHAR(100) NOT NULL,
  progress INTEGER DEFAULT 0,
  due_date DATE,
  note TEXT,
  is_late BOOLEAN DEFAULT FALSE,
  days_late INTEGER DEFAULT 0,
  has_alert BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_contact_id ON tasks(contact_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tag ON tasks(tag);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================
-- 10. TABLE RENDEZ-VOUS
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  start_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_date DATE NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255),
  comments TEXT,
  created_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_appointments_contact_id ON appointments(contact_id);
CREATE INDEX idx_appointments_start_date ON appointments(start_date);
CREATE INDEX idx_appointments_created_by_id ON appointments(created_by_id);

-- ============================================
-- 11. TABLE COLLABORATEURS RENDEZ-VOUS
-- ============================================
CREATE TABLE IF NOT EXISTS appointment_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  response_status VARCHAR(50) DEFAULT 'no_response',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(appointment_id, user_id)
);

CREATE INDEX idx_appointment_collaborators ON appointment_collaborators(appointment_id, user_id);

-- ============================================
-- 12. TABLE ARTICLES
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT,
  category VARCHAR(100),
  tags VARCHAR(500),
  author_id UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_is_published ON articles(is_published);

-- ============================================
-- 13. TABLE KPIs
-- ============================================
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_type VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  value DECIMAL(15, 2),
  goal DECIMAL(15, 2),
  unit VARCHAR(50),
  color VARCHAR(50),
  period VARCHAR(50),
  calculation_rule VARCHAR(500),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kpis_kpi_type ON kpis(kpi_type);
CREATE INDEX idx_kpis_period ON kpis(period);

-- ============================================
-- 14. TABLE LOGS D'AUDIT
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- 15. TABLE FLUX D'ACTIVITÉ
-- ============================================
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  activity_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at);

-- ============================================
-- 16. TABLE INTÉGRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  api_key VARCHAR(500),
  config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INSERTION DES DONNÉES INITIALES
-- ============================================

-- Insérer les rôles
INSERT INTO roles (id, name, description, color) VALUES
('role-admin', 'Administrateur', 'Accès complet à l''application', 'violet'),
('role-manager', 'Manager', 'Gestion équipe et projets', 'blue'),
('role-commercial', 'Commercial', 'Gestion contacts et devis', 'green'),
('role-technician', 'Technicien', 'Suivi technique des projets', 'orange');

-- Insérer les utilisateurs
INSERT INTO users (id, civility, first_name, last_name, email, phone, role_id, status) VALUES
('user-admin', 'Mr', 'Admin', 'Xora', 'admin@xora.fr', '+33612345678', 'role-admin', 'active'),
('user-manager', 'Mme', 'Marie', 'Dupont', 'marie.dupont@xora.fr', '+33612345679', 'role-manager', 'active'),
('user-commercial', 'Mr', 'Jérémy', 'Colomb', 'jeremy.colomb@xora.fr', '+33612345680', 'role-commercial', 'active'),
('user-tech', 'Mr', 'Thomas', 'Dubois', 'thomas.dubois@xora.fr', '+33612345681', 'role-technician', 'active');

-- Insérer les contacts de test
INSERT INTO contacts (id, civility, first_name, last_name, email, phone, company_name, status, origin, location, referent_id) VALUES
('contact-1', 'Mme', 'Chloé', 'Dupont', 'chloe.dupont@email.com', '+33612345700', 'Dupont Immobilier', 'Client', 'Web', 'Paris', 'user-commercial'),
('contact-2', 'Mr', 'Lucas', 'Martinez', 'lucas.martinez@email.com', '+33612345701', 'Martinez Construction', 'Prospect', 'Relation', 'Lyon', 'user-commercial'),
('contact-3', 'Mme', 'Amélie', 'Bernard', 'amelie.bernard@email.com', '+33612345702', 'Bernard Architecture', 'Client', 'Recommandation', 'Marseille', 'user-manager'),
('contact-4', 'Mme', 'Coline', 'Farget', 'coline.farget@email.com', '+33612345703', 'Farget Design', 'Leads', 'Salon', 'Toulouse', 'user-commercial'),
('contact-5', 'Mr', 'Jean', 'Durand', 'jean.durand@email.com', '+33612345704', 'Durand Rénovation', 'Client', 'Web', 'Bordeaux', 'user-manager');

-- Insérer les biens immobiliers
INSERT INTO properties (id, contact_id, address, type, owner, property_type, floor, created_at) VALUES
('prop-1', 'contact-1', '12 rue de Paris, 75001 Paris', 'Bien principal', 'Chloé Dupont', 'Appartement', '3ème', NOW()),
('prop-2', 'contact-1', '45 avenue des Champs, 75008 Paris', 'Bien secondaire', 'Chloé Dupont', 'Studio', 'RDC', NOW()),
('prop-3', 'contact-2', '8 rue Montmartre, 75002 Paris', 'Bien principal', 'Lucas Martinez', 'Maison', '2ème', NOW()),
('prop-4', 'contact-3', '15 boulevard Saint-Germain, 75005 Paris', 'Bien principal', 'Amélie Bernard', 'T3', '1er', NOW()),
('prop-5', 'contact-5', '100 rue de Turenne, 75003 Paris', 'Bien principal', 'Jean Durand', 'Maison', 'RDC', NOW());

-- Insérer les projets de test
INSERT INTO projects (id, type, contact_id, contact_name, project_name, title, status, progress, referent_id) VALUES
('project-1', 'Cuisiniste', 'contact-1', 'Chloé Dupont', 'Cuisine étage 2', 'Rénovation cuisine étage 2', 'Dossier technique', 60, 'user-commercial'),
('project-2', 'Salle de bain', 'contact-1', 'Chloé Dupont', 'Salle de bain étage', 'Rénovation salle de bain', 'Installation', 75, 'user-manager'),
('project-3', 'Agencement', 'contact-2', 'Lucas Martinez', 'Terrasse', 'Aménagement terrasse', 'Prospect', 20, 'user-commercial'),
('project-4', 'Cuisiniste', 'contact-2', 'Lucas Martinez', 'Rénovation cuisine', 'Cuisine moderne', 'Étude client', 45, 'user-manager'),
('project-5', 'Salle de bain', 'contact-3', 'Amélie Bernard', 'Installation douche', 'Douche italienne', 'Installation', 85, 'user-tech');

-- Insérer les rendez-vous de test
INSERT INTO appointments (id, title, contact_id, start_date, start_time, end_date, end_time, location, created_by_id) VALUES
('apt-1', 'RDV R1 Dupont', 'contact-1', '2025-11-24', '10:30', '2025-11-24', '12:30', '12 rue de Paris, 75001 Paris', 'user-commercial'),
('apt-2', 'Visite Chantier', 'contact-2', '2025-11-25', '14:00', '2025-11-25', '16:30', 'Chantier Lyon', 'user-manager'),
('apt-3', 'Réunion Client', 'contact-3', '2025-11-26', '09:00', '2025-11-26', '10:00', 'Showroom Marseille', 'user-commercial');

-- Insérer les collaborateurs aux rendez-vous
INSERT INTO appointment_collaborators (appointment_id, user_id, response_status) VALUES
('apt-1', 'user-commercial', 'accepted'),
('apt-1', 'user-manager', 'tentative'),
('apt-2', 'user-manager', 'accepted'),
('apt-2', 'user-tech', 'accepted'),
('apt-3', 'user-commercial', 'accepted');

-- Insérer les tâches de test
INSERT INTO tasks (id, task_index, type, title, tag, project_id, contact_id, assignee_id, status, progress) VALUES
('task-1', 1, 'Tâche', 'Prendre les mesures cuisine', 'Dossier technique', 'project-1', 'contact-1', 'user-tech', 'En cours', 50),
('task-2', 2, 'Tâche', 'Faire devis installation', 'Dossier technique', 'project-1', 'contact-1', 'user-commercial', 'Termin', 100),
('task-3', 3, 'Tâche', 'Commander matériaux', 'Installation', 'project-2', 'contact-1', 'user-manager', 'Non commencé', 0),
('task-4', 4, 'Mémo', 'Appeler le client pour suivi', 'Prospect', 'project-3', 'contact-2', 'user-commercial', 'Non commencé', 0);

-- Insérer les KPIs de test
INSERT INTO kpis (kpi_type, label, value, goal, unit, color, period) VALUES
('financial', 'Chiffre d''affaires', 45000, 50000, '€', '#2B7FFF', 'monthly'),
('financial', 'Marge brute', 15000, 18000, '€', '#10B981', 'monthly'),
('operational', 'Projets en cours', 12, 15, 'nb', '#F59E0B', 'monthly'),
('operational', 'Taux de réussite', 85, 90, '%', '#8B5CF6', 'monthly');
