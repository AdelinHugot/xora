# Structure de Base de Données - Xora CRM

## =Ë Vue d'ensemble

Xora est une application SaaS de gestion d'entreprise pour le secteur de la rénovation. La BDD est organisée autour de 9 tables principales avec des relations many-to-many pour supporter la complexité du domaine métier.

---

## 1. TABLE: `users` (Utilisateurs)

### Description
Utilisateurs et collaborateurs du système avec authentification et gestion des rôles.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `civility` | ENUM('Mr', 'Mme', 'Autre') | NOT NULL | Civilité |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash sécurisé du mot de passe |
| `phone` | VARCHAR(20) | | Téléphone (format E.164: +33...) |
| `avatar_url` | TEXT | | URL de l'avatar |
| `role_id` | UUID | FOREIGN KEY ’ roles.id, NOT NULL | Rôle de l'utilisateur |
| `status` | ENUM('active', 'inactive', 'suspended') | DEFAULT 'active' | Statut du compte |
| `join_date` | TIMESTAMP | DEFAULT NOW() | Date d'adhésion |
| `last_login` | TIMESTAMP | | Dernière connexion |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |

### Indices
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
```

---

## 2. TABLE: `roles` (Rôles)

### Description
Définition des rôles et permissions dans l'application.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Nom du rôle |
| `description` | TEXT | | Description du rôle |
| `color` | VARCHAR(50) | DEFAULT 'blue' | Couleur associée au rôle |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |

### Données de base
```sql
INSERT INTO roles (id, name, description, color) VALUES
('role-admin', 'Administrateur', 'Accès complet à l''application', 'violet'),
('role-manager', 'Manager', 'Gestion équipe et projets', 'blue'),
('role-commercial', 'Commercial', 'Gestion contacts et devis', 'green'),
('role-technician', 'Technicien', 'Suivi technique des projets', 'orange');
```

---

## 3. TABLE: `role_permissions` (Permissions des rôles)

### Description
Matrice de permissions pour chaque rôle (many-to-many).

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `role_id` | UUID | FOREIGN KEY ’ roles.id, NOT NULL | Rôle |
| `permission` | VARCHAR(100) | NOT NULL | Permission (ex: contacts.create, projects.edit) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |

### Indices
```sql
CREATE UNIQUE INDEX idx_role_permission ON role_permissions(role_id, permission);
```

---

## 4. TABLE: `contacts` (Contacts/Clients)

### Description
Tous les contacts CRM : prospects, clients, leads avec gestion des entreprises.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `civility` | ENUM('Mr', 'Mme', 'Autre') | NOT NULL | Civilité |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom |
| `email` | VARCHAR(255) | | Email professionnel |
| `phone` | VARCHAR(20) | | Téléphone fixe |
| `mobile_phone` | VARCHAR(20) | | Téléphone mobile |
| `landline_phone` | VARCHAR(20) | | Téléphone fixe (bis) |
| `company_name` | VARCHAR(255) | | Société/Entreprise |
| `status` | ENUM('Prospect', 'Client', 'Leads') | NOT NULL | Statut du contact |
| `origin` | ENUM('Relation', 'Salon', 'Web', 'Recommandation') | | Origine du contact |
| `sub_origin` | VARCHAR(255) | | Sous-origine (détail) |
| `origin_name` | VARCHAR(255) | | Nom de la personne qui l'a référé |
| `location` | VARCHAR(255) | | Localisation générale |
| `address` | VARCHAR(255) | | Adresse complète |
| `address_complement` | VARCHAR(255) | | Complément d'adresse |
| `latitude` | DECIMAL(10, 8) | | Latitude pour carte |
| `longitude` | DECIMAL(11, 8) | | Longitude pour carte |
| `referent_id` | UUID | FOREIGN KEY ’ users.id | Agenceur référent |
| `client_access_account` | VARCHAR(255) | | Numéro compte d'accès client |
| `added_by_id` | UUID | FOREIGN KEY ’ users.id | Créé par |
| `added_at` | TIMESTAMP | | Date d'ajout |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |
| `deleted_at` | TIMESTAMP | | Soft delete |

### Indices
```sql
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_referent_id ON contacts(referent_id);
CREATE INDEX idx_contacts_origin ON contacts(origin);
CREATE INDEX idx_contacts_location ON contacts(location);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE FULLTEXT INDEX idx_contacts_search ON contacts(first_name, last_name, email, phone);
CREATE SPATIAL INDEX idx_contacts_coordinates ON contacts(latitude, longitude);
```

---

## 5. TABLE: `properties` (Biens immobiliers)

### Description
Propriétés/biens associés à chaque contact (multi-bien par contact).

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `contact_id` | UUID | FOREIGN KEY ’ contacts.id, NOT NULL | Contact propriétaire |
| `address` | VARCHAR(255) | NOT NULL | Adresse du bien |
| `address_complement` | VARCHAR(255) | | Complément d'adresse |
| `type` | ENUM('Bien principal', 'Bien secondaire') | NOT NULL | Type du bien |
| `owner` | VARCHAR(255) | NOT NULL | Propriétaire |
| `property_type` | ENUM('Appartement', 'Maison', 'Studio', 'T2', 'T3', 'T4', 'Autre') | | Type immobilier |
| `property_nature` | ENUM('Location', 'Vente', 'Propre') | | Nature (propriété, location, etc) |
| `work_type` | ENUM('Rénovation', 'Construction', 'Agencement', 'Autre') | | Type de travaux |
| `more_than_two_years` | BOOLEAN | DEFAULT FALSE | Bien acquis depuis 2+ ans |
| `floor` | VARCHAR(20) | | Étage |
| `elevator` | BOOLEAN | DEFAULT FALSE | Présence ascenseur |
| `misc_info` | TEXT | | Infos supplémentaires |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |

### Indices
```sql
CREATE INDEX idx_properties_contact_id ON properties(contact_id);
CREATE INDEX idx_properties_type ON properties(property_type);
```

---

## 6. TABLE: `external_contacts` (Contacts externes)

### Description
Contacts externes liés aux contacts principaux (multi-contacts par contact).

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `contact_id` | UUID | FOREIGN KEY ’ contacts.id, NOT NULL | Contact parent |
| `civility` | ENUM('Mr', 'Mme', 'Autre') | | Civilité |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom |
| `email` | VARCHAR(255) | | Email |
| `phone` | VARCHAR(20) | | Téléphone |
| `relationship` | VARCHAR(100) | | Lien/Relation (Conjointe, Associé, etc) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |

### Indices
```sql
CREATE INDEX idx_external_contacts_contact_id ON external_contacts(contact_id);
```

---

## 7. TABLE: `projects` (Projets)

### Description
Projets/devis associés aux contacts avec suivi de progression.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `type` | VARCHAR(100) | NOT NULL | Type de projet (ex: Cuisiniste) |
| `contact_id` | UUID | FOREIGN KEY ’ contacts.id, NOT NULL | Client associé |
| `contact_name` | VARCHAR(255) | | Nom du client |
| `project_name` | VARCHAR(255) | NOT NULL | Nom du projet |
| `title` | VARCHAR(255) | NOT NULL | Titre du projet |
| `status` | ENUM('Prospect', 'Étude client', 'Dossier technique', 'Installation', 'SAV', 'Terminé') | NOT NULL | Statut du projet |
| `progress` | INTEGER | DEFAULT 0 | Progression (0-100) |
| `progress_label` | VARCHAR(100) | | Label de progression |
| `referent_id` | UUID | FOREIGN KEY ’ users.id | Agenceur référent |
| `agency` | VARCHAR(255) | | Agence responsable |
| `origin` | VARCHAR(255) | | Origine du projet |
| `sub_origin` | VARCHAR(255) | | Sous-origine |
| `sponsor_link` | VARCHAR(255) | | Parrain/Sponsor |
| `site_address` | VARCHAR(255) | | Adresse du site |
| `billing_address` | VARCHAR(255) | | Adresse de facturation |
| `study_trade` | VARCHAR(255) | | Métier étudié |
| `work_execution` | VARCHAR(255) | | Exécution des travaux |
| `artisans_needed` | BOOLEAN | DEFAULT FALSE | Artisans nécessaires |
| `artisans_list` | TEXT | | Liste des artisans |
| `signature_date` | DATE | | Date de signature |
| `work_dates` | VARCHAR(255) | | Dates des travaux |
| `installation_date` | DATE | | Date d'installation |
| `budget_low` | DECIMAL(12, 2) | | Budget bas estimé |
| `budget_high` | DECIMAL(12, 2) | | Budget haut estimé |
| `global_budget` | DECIMAL(12, 2) | | Budget global |
| `financing` | VARCHAR(255) | | Mode de financement |
| `removal` | VARCHAR(255) | | Enlèvement |
| `installation` | VARCHAR(255) | | Installation |
| `delivery_by` | VARCHAR(255) | | Livré par |
| `technical_plans` | BOOLEAN | DEFAULT FALSE | Plans techniques |
| `competitors_count` | INTEGER | | Nombre de concurrents |
| `competitors` | TEXT | | Noms des concurrents |
| `competitor_budget` | VARCHAR(255) | | Budget concurrence |
| `project_status` | VARCHAR(255) | | Statut interne |
| `building_permit` | BOOLEAN | DEFAULT FALSE | Permis de construire |
| `permit_date` | DATE | | Date du permis |
| `phone` | VARCHAR(20) | | Téléphone projet |
| `email` | VARCHAR(255) | | Email projet |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |
| `deleted_at` | TIMESTAMP | | Soft delete |

### Découverte Cuisine (Colonnes)
| Colonne | Type | Description |
|---------|------|-------------|
| `ambiance_types` | TEXT | Types d'ambiance souhaités |
| `ambiance_appreciated` | TEXT | Ambiance appréciée |
| `ambiance_to_avoid` | TEXT | Ambiance à éviter |
| `furniture` | TEXT | Meubles sélectionnés |
| `handles` | VARCHAR(255) | Poignées |
| `worktop` | VARCHAR(255) | Plan de travail |
| `kitchen_floor` | VARCHAR(255) | Sol cuisine |
| `kitchen_wall` | VARCHAR(255) | Revêtement murs |
| `kitchen_other` | TEXT | Autres détails |
| `furniture_selection` | TEXT | Sélection meubles |
| `materials_description` | TEXT | Description matériaux |

### Notes par onglet
| Colonne | Type | Description |
|---------|------|-------------|
| `notes_ambiance` | TEXT | Notes sur l'ambiance |
| `notes_furniture` | TEXT | Notes sur les meubles |
| `notes_appliances` | TEXT | Notes sur les électroménagers |
| `notes_financial` | TEXT | Notes sur l'estimation financière |

### Indices
```sql
CREATE INDEX idx_projects_contact_id ON projects(contact_id);
CREATE INDEX idx_projects_referent_id ON projects(referent_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE FULLTEXT INDEX idx_projects_search ON projects(project_name, title);
```

---

## 8. TABLE: `project_steps` (Étapes de progression des projets)

### Description
Définit les étapes de progression visibles dans la sidebar d'un projet.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `project_id` | UUID | FOREIGN KEY ’ projects.id, NOT NULL | Projet parent |
| `step_number` | INTEGER | NOT NULL | Ordre de l'étape (1-4) |
| `label` | VARCHAR(100) | NOT NULL | Label de l'étape |
| `progress` | INTEGER | DEFAULT 0 | Progression (0-100) |
| `color` | VARCHAR(50) | | Couleur hexadécimale |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |

### Indices
```sql
CREATE INDEX idx_project_steps_project_id ON project_steps(project_id);
```

---

## 9. TABLE: `tasks` (Tâches et Mémos)

### Description
Tâches et mémos avec suivi de progression et affectation à des collaborateurs.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `task_index` | INTEGER | NOT NULL | Ordre d'affichage pour drag & drop |
| `type` | ENUM('Tâche', 'Mémo') | NOT NULL | Type |
| `title` | VARCHAR(255) | NOT NULL | Titre/Descriptif |
| `tag` | ENUM('Dossier technique', 'Études en cours', 'Installation', 'Prospect', 'Étude client', 'SAV', 'Terminé', 'Mémo') | NOT NULL | Tag de catégorisation |
| `project_id` | UUID | FOREIGN KEY ’ projects.id | Projet lié (optionnel) |
| `contact_id` | UUID | FOREIGN KEY ’ contacts.id | Contact lié (optionnel) |
| `client_name` | VARCHAR(255) | | Nom du client |
| `project_name` | VARCHAR(255) | | Nom du projet |
| `assignee_id` | UUID | FOREIGN KEY ’ users.id | Collaborateur responsable |
| `status` | ENUM('Non commencé', 'En cours', 'Terminé') | NOT NULL | Statut |
| `progress` | INTEGER | DEFAULT 0 | Progression (0-100) pour Tâches |
| `due_date` | DATE | | Date d'échéance |
| `note` | TEXT | | Note attachée |
| `is_late` | BOOLEAN | DEFAULT FALSE | Est en retard |
| `days_late` | INTEGER | DEFAULT 0 | Nombre de jours en retard |
| `has_alert` | BOOLEAN | DEFAULT FALSE | Alerte active |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |
| `deleted_at` | TIMESTAMP | | Soft delete |

### Indices
```sql
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_contact_id ON tasks(contact_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tag ON tasks(tag);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_task_index ON tasks(task_index);
```

---

## 10. TABLE: `appointments` (Rendez-vous)

### Description
Rendez-vous/réunions avec support multi-collaborateurs.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `title` | VARCHAR(255) | NOT NULL | Titre (max 25 chars affiché) |
| `contact_id` | UUID | FOREIGN KEY ’ contacts.id | Contact concerné |
| `start_date` | DATE | NOT NULL | Date de début |
| `start_time` | TIME | NOT NULL | Heure de début |
| `end_date` | DATE | NOT NULL | Date de fin |
| `end_time` | TIME | NOT NULL | Heure de fin |
| `location` | VARCHAR(255) | | Lieu du RDV (adresse) |
| `comments` | TEXT | | Commentaires |
| `created_by_id` | UUID | FOREIGN KEY ’ users.id | Créé par |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |
| `deleted_at` | TIMESTAMP | | Soft delete |

### Indices
```sql
CREATE INDEX idx_appointments_contact_id ON appointments(contact_id);
CREATE INDEX idx_appointments_start_date ON appointments(start_date);
CREATE INDEX idx_appointments_created_by_id ON appointments(created_by_id);
```

---

## 11. TABLE: `appointment_collaborators` (Collaborateurs des RDV)

### Description
Associe les collaborateurs/utilisateurs à un rendez-vous (many-to-many).

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `appointment_id` | UUID | FOREIGN KEY ’ appointments.id, NOT NULL | Rendez-vous |
| `user_id` | UUID | FOREIGN KEY ’ users.id, NOT NULL | Collaborateur |
| `response_status` | ENUM('accepted', 'declined', 'tentative', 'no_response') | DEFAULT 'no_response' | Statut de réponse |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |

### Indices
```sql
CREATE UNIQUE INDEX idx_appointment_collaborators ON appointment_collaborators(appointment_id, user_id);
```

---

## 12. TABLE: `articles` (Articles/Base de connaissances)

### Description
Articles internes et base de connaissances.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `title` | VARCHAR(255) | NOT NULL | Titre |
| `slug` | VARCHAR(255) | UNIQUE | Slug pour URL |
| `content` | LONGTEXT | | Contenu riche (HTML/Markdown) |
| `category` | VARCHAR(100) | | Catégorie |
| `tags` | VARCHAR(500) | | Tags séparés par virgule |
| `author_id` | UUID | FOREIGN KEY ’ users.id | Auteur |
| `is_published` | BOOLEAN | DEFAULT FALSE | Publié |
| `view_count` | INTEGER | DEFAULT 0 | Nombre de vues |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |
| `published_at` | TIMESTAMP | | Date de publication |

### Indices
```sql
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_is_published ON articles(is_published);
CREATE FULLTEXT INDEX idx_articles_search ON articles(title, content);
```

---

## 13. TABLE: `kpis` (KPIs et Métriques)

### Description
Indicateurs clés de performance et métriques.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `kpi_type` | ENUM('financial', 'operational') | NOT NULL | Type de KPI |
| `label` | VARCHAR(255) | NOT NULL | Libellé |
| `value` | DECIMAL(15, 2) | | Valeur actuelle |
| `goal` | DECIMAL(15, 2) | | Objectif |
| `unit` | VARCHAR(50) | | Unité (¬, %, nb, etc) |
| `color` | VARCHAR(50) | | Couleur hexadécimale |
| `period` | ENUM('daily', 'weekly', 'monthly', 'yearly') | | Période |
| `calculation_rule` | VARCHAR(500) | | Règle de calcul |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Dernière mise à jour |

### Indices
```sql
CREATE INDEX idx_kpis_kpi_type ON kpis(kpi_type);
CREATE INDEX idx_kpis_period ON kpis(period);
```

---

## 14. TABLE: `audit_logs` (Logs d'audit)

### Description
Traçabilité complète des modifications pour conformité et sécurité.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `entity_type` | VARCHAR(100) | NOT NULL | Type d'entité (contacts, projects, etc) |
| `entity_id` | VARCHAR(255) | NOT NULL | ID de l'entité |
| `action` | ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT') | NOT NULL | Action effectuée |
| `user_id` | UUID | FOREIGN KEY ’ users.id | Utilisateur qui a agit |
| `old_values` | JSON | | Anciennes valeurs (JSON) |
| `new_values` | JSON | | Nouvelles valeurs (JSON) |
| `ip_address` | VARCHAR(45) | | Adresse IP |
| `user_agent` | TEXT | | User agent du navigateur |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |

### Indices
```sql
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## 15. TABLE: `integrations` (Intégrations externes)

### Description
Configuration des intégrations avec services externes.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `name` | VARCHAR(100) | NOT NULL | Nom de l'intégration |
| `service_type` | VARCHAR(100) | NOT NULL | Type (Stripe, SendGrid, etc) |
| `api_key` | VARCHAR(500) | | Clé API (chiffrée) |
| `config` | JSON | | Configuration JSON |
| `is_active` | BOOLEAN | DEFAULT TRUE | Activée |
| `last_sync` | TIMESTAMP | | Dernière synchronisation |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Modifié le |

---

## 16. TABLE: `activity_feed` (Flux d'activité)

### Description
Feed d'activité pour affichage temps réel.

### Colonnes

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `user_id` | UUID | FOREIGN KEY ’ users.id | Utilisateur |
| `activity_type` | VARCHAR(100) | NOT NULL | Type d'activité |
| `entity_type` | VARCHAR(100) | | Type d'entité |
| `entity_id` | VARCHAR(255) | | ID de l'entité |
| `description` | TEXT | | Description |
| `icon` | VARCHAR(50) | | Icône |
| `color` | VARCHAR(50) | | Couleur |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Créé le |

### Indices
```sql
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at);
```

---

## DIAGRAMME DE RELATIONS

```
                                                                 
                        UTILISATEURS                              
                                                                 $
  users                     roles                  role_permissions
  " id (PK)                " id (PK)             " id (PK)
  " email (UQ)             " name (UQ)           " role_id (FK)
  " role_id (FK’roles)     " description         " permission
  " avatar_url             " color             
  " status                                     
                                                                 
          ²                                  ²
           referent_id, added_by_id         created_by_id
                                           
                                                                 
                      CRM & CONTACTS                              
                                                                 $
  contacts (PK: id)                                              
  " email (UQ), status, origin, location                         
  " referent_id (FK’users), added_by_id (FK’users)             
                                                                 
    (1:n) properties                                           
     " contact_id (FK)                                         
     " address, type, owner, property_type, floor              
                                                               
    (1:n) external_contacts                                   
      " contact_id (FK)                                         
      " first_name, last_name, email, phone                     
                                                                 
           contact_id
          
                                                                 
                      PROJETS & SUIVI                             
                                                                 $
  projects (PK: id)                                              
  " contact_id (FK’contacts)                                    
  " referent_id (FK’users)                                      
  " status, progress, type, budget_low, budget_high             
                                                                 
    (1:n) project_steps                                       
      " project_id (FK)                                         
      " label, progress, color                                  
                                                                 
           project_id, contact_id
          
                                                                 
                    TÂCHES & MÉMOS & RDV                          
                                                                 $
  tasks (PK: id)                    appointments (PK: id)
  " project_id (FK)                 " contact_id (FK)
  " contact_id (FK)                 " created_by_id (FK’users)
  " assignee_id (FK’users)          " start_date, start_time
  " type, tag, status, progress     " location, comments
  " due_date                      
                                      (n:m) appointment_collaborators
                                        " appointment_id (FK)
                                        " user_id (FK’users)
                                                                 

                                                                 
                     CONTENU & INTÉGRATIONS                       
                                                                 $
  articles                  kpis                   integrations
  " id (PK)                " id (PK)             " id (PK)
  " title, slug (UQ)       " kpi_type            " name
  " author_id (FK’users)   " label, value        " service_type
  " content, category      " goal, unit, color   " api_key
  " is_published           " period              " config
                                                 " is_active
                                                                 

                                                                 
                     AUDIT & SÉCURITÉ                             
                                                                 $
  audit_logs (PK: id)               activity_feed (PK: id)
  " entity_type, entity_id          " user_id (FK’users)
  " action, user_id (FK’users)      " activity_type
  " old_values (JSON)               " entity_type, entity_id
  " new_values (JSON)               " created_at
  " ip_address, user_agent        
                                                                 
```

---

## CONTRAINTES D'INTÉGRITÉ

### Soft Delete
Les tables `contacts`, `projects`, `tasks` et `appointments` utilisent un champ `deleted_at` pour la suppression logique (soft delete). Les requêtes doivent filtrer `WHERE deleted_at IS NULL`.

### Cascade Delete
```sql
-- Projects : supprimer les tâches et étapes si le projet est supprimé
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_project
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE project_steps ADD CONSTRAINT fk_project_steps_project
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Properties et External Contacts : supprimer si contact supprimé
ALTER TABLE properties ADD CONSTRAINT fk_properties_contact
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

ALTER TABLE external_contacts ADD CONSTRAINT fk_external_contacts_contact
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

-- Appointments et ses collaborateurs
ALTER TABLE appointment_collaborators ADD CONSTRAINT fk_appt_collab_appt
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE;
```

### Validations de données
```sql
-- Progression entre 0 et 100
ALTER TABLE projects ADD CONSTRAINT chk_projects_progress
  CHECK (progress >= 0 AND progress <= 100);

ALTER TABLE tasks ADD CONSTRAINT chk_tasks_progress
  CHECK (progress >= 0 AND progress <= 100);

ALTER TABLE project_steps ADD CONSTRAINT chk_steps_progress
  CHECK (progress >= 0 AND progress <= 100);

-- Coordonnées GPS valides
ALTER TABLE contacts ADD CONSTRAINT chk_contacts_coordinates
  CHECK (latitude >= -90 AND latitude <= 90 AND longitude >= -180 AND longitude <= 180);

-- Budget logique
ALTER TABLE projects ADD CONSTRAINT chk_projects_budget
  CHECK (budget_low <= budget_high);

-- Dates logiques pour RDV
ALTER TABLE appointments ADD CONSTRAINT chk_appointments_dates
  CHECK (start_date <= end_date AND (start_date < end_date OR start_time < end_time));
```

---

## INDEXATION STRATÉGIQUE

### Indices rapides
- **Recherche** : FULLTEXT sur contacts (name, email, phone) et projects (name, title)
- **Filtrage** : Status, Origin, Tags, Due Dates
- **Géolocalisation** : SPATIAL sur coordinates (latitude, longitude)
- **Tri/Pagination** : Created_at, task_index (pour drag & drop)

### Indices composés
```sql
CREATE INDEX idx_contacts_referent_status ON contacts(referent_id, status);
CREATE INDEX idx_projects_contact_status ON projects(contact_id, status);
CREATE INDEX idx_tasks_assignee_status ON tasks(assignee_id, status);
CREATE INDEX idx_appointments_user_date ON appointment_collaborators(user_id, created_at DESC);
```

---

## DONNÉES INITIALES À CHARGER

### Rôles (obligatoires)
```sql
INSERT INTO roles VALUES
('role-admin', 'Administrateur', 'Accès complet', 'violet', NOW(), NOW()),
('role-manager', 'Manager', 'Gestion équipe', 'blue', NOW(), NOW()),
('role-commercial', 'Commercial', 'Contacts et devis', 'green', NOW(), NOW()),
('role-technician', 'Technicien', 'Suivi technique', 'orange', NOW(), NOW());
```

### Utilisateurs de test
```sql
INSERT INTO users VALUES
('user-admin', 'Mr', 'Admin', 'Xora', 'admin@xora.fr', HASH('AdminXora123@'), '+33612345678', 'avatar.jpg', 'role-admin', 'active', NOW(), NULL, NOW(), NOW());
```

### Statuts et énumérations
- Contact statuses: Prospect, Client, Leads
- Project statuses: Prospect, Étude client, Dossier technique, Installation, SAV, Terminé
- Task statuses: Non commencé, En cours, Terminé
- Task tags: Dossier technique, Études en cours, Installation, Prospect, Étude client, SAV, Terminé, Mémo
- Contact origins: Relation, Salon, Web, Recommandation

---

## PERFORMANCES & OPTIMISATIONS

### Recommendations
1. **Pagination** : Always use LIMIT/OFFSET pour éviter les lectures massives
2. **Recherche** : Utiliser FULLTEXT INDEX pour les recherches texte complexes
3. **Carte** : SPATIAL INDEX sur coordinates pour les requêtes géographiques
4. **Archivage** : Archiver les audits logs annuels dans une table d'archive
5. **Cache** : Redis pour les KPIs et statistiques fréquemment consultés
6. **Triggers** : Mettre à jour `updated_at` automatiquement

### Trigger exemple
```sql
CREATE TRIGGER update_contacts_timestamp
BEFORE UPDATE ON contacts
FOR EACH ROW
SET NEW.updated_at = NOW();
```

---

## SÉCURITÉ

### Chiffrement
- `password_hash` : bcrypt ou Argon2
- `api_key` : AES-256-GCM ou similaire

### Audit
- Tous les CRUD loggés dans `audit_logs`
- Traçabilité IP et User-Agent
- Soft deletes pour récupération

### Permissions
- Matrice RBAC via `role_permissions`
- Row-level security optionnel (PostgreSQL)

---

## MIGRATION D'UNE VERSION

```sql
-- Exemple de migration pour ajouter un champ
ALTER TABLE projects ADD COLUMN budget_status ENUM('non_budgété', 'budgété', 'dépassé') DEFAULT 'non_budgété' AFTER global_budget;

CREATE INDEX idx_projects_budget_status ON projects(budget_status);
```

---

## STATISTIQUES ESTIMÉES

| Table | Lignes estimées | Taille |
|-------|----------------|--------|
| contacts | 10,000 | 50 MB |
| properties | 15,000 | 20 MB |
| projects | 5,000 | 100 MB |
| tasks | 50,000 | 30 MB |
| appointments | 20,000 | 10 MB |
| users | 100 | 1 MB |
| audit_logs | 1,000,000 | 500 MB (archive annuelle) |

---

## SCRIPTS D'INITIALISATION

### Creation de la BDD
```bash
# Créer la base
mysql -u root -p -e "CREATE DATABASE xora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importer le schéma
mysql -u root -p xora_db < bdd_schema.sql

# Charger les données initiales
mysql -u root -p xora_db < bdd_data.sql
```

---

**Version** : 1.0
**Dernière mise à jour** : 2025-11-03
**Status** :  Prête pour développement backend
