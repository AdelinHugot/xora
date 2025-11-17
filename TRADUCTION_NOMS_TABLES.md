# Traduction Noms des Tables Supabase

Voici la correspondance entre les **anciens noms (anglais)** et les **nouveaux noms (français)**:

## Tables Principales

| Anglais | Français | Description |
|---------|----------|-------------|
| `users` | `utilisateurs` | Comptes utilisateurs et collaborateurs |
| `roles` | `roles` | Rôles et permissions (pas de changement) |
| `contacts` | `contacts` | Clients, prospects, leads (pas de changement) |
| `properties` | `biens_immobiliers` | Biens immobiliers des contacts |
| `external_contacts` | `contacts_externes` | Contacts secondaires/externes |
| `projects` | `projets` | Projets et devis clients |
| `project_steps` | `etapes_projets` | Étapes de progression des projets |
| `tasks` | `taches` | Tâches et mémos |
| `appointments` | `rendez_vous` | Rendez-vous et réunions |
| `appointment_collaborators` | `collaborateurs_rendez_vous` | Collaborateurs aux rendez-vous |
| `articles` | `articles` | Base de connaissances (pas de changement) |
| `kpis` | `kpis` | Indicateurs KPI (pas de changement) |
| `audit_logs` | `logs_audit` | Logs d'audit et traçabilité |
| `activity_feed` | `flux_activite` | Flux d'activité |
| `integrations` | `integrations` | Intégrations externes (pas de changement) |

## Noms des Colonnes

### Colonnes Commune à Toutes les Tables

| Anglais | Français |
|---------|----------|
| `id` | `id` (pas de changement) |
| `created_at` | `cree_le` |
| `updated_at` | `modifie_le` |
| `deleted_at` | `supprime_le` |

### Colonnes pour les Utilisateurs

| Anglais | Français |
|---------|----------|
| `first_name` | `prenom` |
| `last_name` | `nom` |
| `email` | `email` (pas de changement) |
| `phone` | `telephone` |
| `avatar_url` | `url_avatar` |
| `role_id` | `id_role` |
| `status` | `statut` |
| `join_date` | `date_adhesion` |
| `last_login` | `derniere_connexion` |

### Colonnes pour les Contacts

| Anglais | Français |
|---------|----------|
| `civility` | `civilite` |
| `first_name` | `prenom` |
| `last_name` | `nom` |
| `mobile_phone` | `telephone_mobile` |
| `landline_phone` | `telephone_fixe` |
| `company_name` | `nom_entreprise` |
| `status` | `statut` |
| `origin` | `origine` |
| `sub_origin` | `sous_origine` |
| `origin_name` | `nom_origine` |
| `location` | `localisation` |
| `address` | `adresse` |
| `address_complement` | `complement_adresse` |
| `referent_id` | `id_referent` |
| `client_access_account` | `numero_compte_client` |
| `added_by_id` | `id_ajoute_par` |
| `added_at` | `date_ajout` |

### Colonnes pour les Projets

| Anglais | Français |
|---------|----------|
| `contact_id` | `id_contact` |
| `contact_name` | `nom_contact` |
| `project_name` | `nom_projet` |
| `referent_id` | `id_referent` |
| `site_address` | `adresse_chantier` |
| `billing_address` | `adresse_facturation` |
| `study_trade` | `metier_etudie` |
| `work_execution` | `execution_travaux` |
| `artisans_needed` | `artisans_necessaires` |
| `artisans_list` | `liste_artisans` |
| `signature_date` | `date_signature` |
| `work_dates` | `dates_travaux` |
| `installation_date` | `date_installation` |
| `budget_low` | `budget_bas` |
| `budget_high` | `budget_haut` |
| `global_budget` | `budget_global` |
| `technical_plans` | `plans_techniques` |
| `competitors_count` | `nombre_concurrents` |
| `competitor_budget` | `budget_concurrence` |
| `project_status` | `statut_projet` |
| `building_permit` | `permis_construire` |
| `permit_date` | `date_permis` |
| `ambiance_types` | `types_ambiance` |
| `ambiance_appreciated` | `ambiance_appreciee` |
| `ambiance_to_avoid` | `ambiance_eviter` |
| `furniture` | `meubles` |
| `handles` | `poignees` |
| `worktop` | `plan_travail` |
| `kitchen_floor` | `sol_cuisine` |
| `kitchen_wall` | `revetement_murs` |
| `kitchen_other` | `autres_details` |
| `furniture_selection` | `selection_meubles` |
| `materials_description` | `description_materiaux` |

### Colonnes pour les Tâches

| Anglais | Français |
|---------|----------|
| `task_index` | `index_tache` |
| `project_id` | `id_projet` |
| `contact_id` | `id_contact` |
| `client_name` | `nom_client` |
| `project_name` | `nom_projet` |
| `assignee_id` | `id_affecte_a` |
| `due_date` | `date_echeance` |
| `is_late` | `est_en_retard` |
| `days_late` | `jours_retard` |
| `has_alert` | `a_alerte` |

### Colonnes pour les Rendez-vous

| Anglais | Français |
|---------|----------|
| `contact_id` | `id_contact` |
| `start_date` | `date_debut` |
| `start_time` | `heure_debut` |
| `end_date` | `date_fin` |
| `end_time` | `heure_fin` |
| `created_by_id` | `id_cree_par` |

### Colonnes pour les Collaborateurs Rendez-vous

| Anglais | Français |
|---------|----------|
| `appointment_id` | `id_rendez_vous` |
| `user_id` | `id_utilisateur` |
| `response_status` | `statut_reponse` |

### Colonnes pour les Articles

| Anglais | Français |
|---------|----------|
| `author_id` | `id_auteur` |
| `is_published` | `est_publie` |
| `view_count` | `nombre_vues` |
| `published_at` | `publie_le` |

### Colonnes pour les KPIs

| Anglais | Français |
|---------|----------|
| `kpi_type` | `type_kpi` |
| `value` | `valeur` |
| `goal` | `objectif` |
| `unit` | `unite` |
| `period` | `periode` |
| `calculation_rule` | `regle_calcul` |

### Colonnes pour les Logs d'Audit

| Anglais | Français |
|---------|----------|
| `entity_type` | `type_entite` |
| `entity_id` | `id_entite` |
| `user_id` | `id_utilisateur` |
| `old_values` | `anciennes_valeurs` |
| `new_values` | `nouvelles_valeurs` |
| `ip_address` | `adresse_ip` |
| `user_agent` | `user_agent` (pas de changement) |

### Colonnes pour le Flux d'Activité

| Anglais | Français |
|---------|----------|
| `user_id` | `id_utilisateur` |
| `activity_type` | `type_activite` |
| `entity_type` | `type_entite` |
| `entity_id` | `id_entite` |

### Colonnes pour les Intégrations

| Anglais | Français |
|---------|----------|
| `service_type` | `type_service` |
| `api_key` | `cle_api` |
| `is_active` | `est_actif` |
| `last_sync` | `derniere_synchro` |

## Important ⚠️

Le fichier **`supabase_setup_fr.sql`** contient TOUTES les tables avec les noms EN FRANÇAIS.

Utilise ce fichier pour exécuter le SQL dans Supabase!

Les **hooks React** (useContacts, useProjects, etc.) sont déjà mis à jour avec les nouveaux noms de colonnes.
