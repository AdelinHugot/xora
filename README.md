# 🏢 Xora - Plateforme SaaS de Gestion d'Entreprise

## 📋 Vue d'ensemble

**Xora** est une application SaaS moderne et professionnelle conçue pour les équipes francophones du secteur de la rénovation cuisine/mobilier. Elle offre une plateforme centralisée pour gérer les clients, projets, tâches, équipes et indicateurs de performance clés (KPIs).

**Status**: MVP fonctionnel avec interface complète | Données mockées | Prêt pour intégration backend

---

## 🎯 Objectif du projet

Fournir un outil de gestion d'entreprise intégré qui permet de :
- Gérer une base clients (CRM)
- Tracker les projets en cours
- Organiser les tâches et mémos
- Coordonner l'équipe
- Visualiser les KPIs d'entreprise en temps réel

---

## 🚀 Stack technologique

### Frontend
| Technologie | Version | Usage |
|---|---|---|
| **React** | 18.2.0 | Framework UI principal |
| **Vite** | 5.2.0 | Build tool ultra-rapide + dev server HMR |
| **Tailwind CSS** | 3.3.0 | Styling utility-first |
| **Lucide React** | 0.263.1 | Bibliothèque d'icons SVG (150+ icons) |
| **TypeScript** | Partiel | Quelques composants en .tsx |
| **ESLint** | 8.57.0 | Linting et qualité de code |

### Build & Deployment
- **Netlify** : Déploiement SPA avec rewrites
- **npm** : Package manager
- **PostCSS** + **Autoprefixer** : Traitement CSS

### État actuel
- ❌ Pas de backend (données mockées)
- ❌ Pas d'authentification
- ❌ Pas de base de données réelle
- ❌ Pas d'API REST intégrée

---

## 📁 Structure du projet

```
/Xora/
├── src/
│   ├── main.jsx                          # Entry point React
│   ├── App.jsx                           # Routeur principal (682 lignes)
│   ├── index.css                         # Directives Tailwind
│   ├── components/                       # Composants réutilisables
│   │   ├── Sidebar.jsx                   # Navigation sidebar (348 lignes)
│   │   ├── UserTopBar.tsx                # Barre profil en header (2024 bytes)
│   │   ├── CreateContactModal.jsx        # Modal création contact
│   │   ├── CreateArticleModal.jsx        # Modal création article
│   │   ├── CreateTaskOrMemoModal.jsx     # Modal création tâche/memo
│   │   ├── TeamTab.jsx                   # Onglet gestion équipe
│   │   ├── CompanyTab.jsx                # Onglet infos entreprise
│   │   ├── ConnectionsTab.jsx            # Onglet connexions API
│   │   └── [autres composants modaux]
│   └── pages/                            # Composants pages
│       ├── DashboardPage.jsx             # Dashboard principal
│       ├── DirectoryPage.jsx             # Annuaire/CRM (30+ contacts)
│       ├── ProjectTrackingPage.jsx       # Suivi projets
│       ├── AgendaPage.jsx                # Agenda hebdomadaire
│       ├── TasksPage.jsx                 # Liste des tâches
│       ├── TasksMemoPage.jsx             # Tâches et mémos
│       ├── ArticlesPage.jsx              # Base de connaissances
│       ├── SettingsPage.jsx              # Paramètres multi-onglets
│       ├── TeamMemberPage.jsx            # Profil membre équipe
│       ├── ProjectDetailPage.jsx         # Détail d'un projet
│       └── ContactDetailPage.jsx         # Détail d'un contact
├── public/
│   └── logo-xora.png                     # Logo application
├── index.html                            # Entrée HTML
├── package.json                          # Dépendances et scripts
├── vite.config.js                        # Configuration Vite
├── tailwind.config.js                    # Configuration Tailwind
├── postcss.config.js                     # Configuration PostCSS
├── .eslintrc.cjs                         # Configuration ESLint
├── netlify.toml                          # Configuration déploiement
├── .gitignore                            # Fichiers ignorés Git
└── dist/                                 # Build output (production)
```

---

## 📄 Description détaillée des pages

### 1. **Dashboard** (Accueil)
- **KPIs White Strip** : Revenue, Marge, Taux marge, Taux conversion
- **KPIs Colored Stack** : Leads, Études, Commandes, Dossiers tech, Support client
- **Task Priority Panel** : Tâches prioritaires avec suivi progression
- **Weekly Agenda** : Vue calendrier semaine
- **Responsive Grid** : Hauteurs synchronisées pour alignement optimal

### 2. **Annuaire/Directory** (CRM)
- **30+ contacts mockés** avec profils complets
- **Filtres avancés** : recherche, ajouté par, origine, localisation, statut
- **Pagination** : 11 items par page avec affichage intelligent
- **Table interactive** : avatar, nom, dates, statuts
- **Statuts** : Prospect, Client, Leads
- **Actions** : créer, consulter, modifier contacts
- **Fonctionnalités** : import/export (prévu)

### 3. **Suivi Projets** (Project Tracking)
- **10 projets mockés** avec infos complètes
- **Statuts** : Découverte leads, Étude client, Dossier technique, Installation, SAV
- **Assignation** : Multi-agents avec avatars
- **Progression** : Barre de progression visuelle
- **Filtres** : par agent, statut, date ajout
- **Lien clients** : Association client ↔ projet

### 4. **Agenda** (Calendar)
- **Vue hebdomadaire** : Lundi à vendredi
- **Time slots** : Plages horaires pour rendez-vous
- **Données mockées** : Rendez-vous de démonstration

### 5. **Tâches** (Tasks)
- **Gestion des tâches** : création, suppression, édition
- **Priorités** : différents niveaux
- **Statuts** : À faire, En cours, Terminée
- **Modal de création** : Interface complète

### 6. **Tâches & Mémos** (Tasks & Memos)
- **Vue combinée** : tâches + mémos dans une interface unifiée
- **Catégorisation** : Dossier tech, Commande client, Études en cours, etc.
- **Modal de création** : Création rapide

### 7. **Articles** (Knowledge Base)
- **Base de connaissances** : Documentation, tutoriels
- **Modal de création** : Articles richement formatés

### 8. **Paramètres** (Settings)
- **Company Tab** : Infos entreprise (nom, secteur, localisation)
- **Role Tab** : Gestion des rôles (Admin, Manager, Commercial, Technicien)
- **Team Tab** : Gestion équipe (ajout, suppression, rôles)
- **Connection Tab** : Intégrations API externes
- **Profile** : Gestion profil utilisateur
- **Avatar Upload** : Validation (PNG/JPG, max 5MB)
- **Change Password** : Validation force mot de passe
- **Validation forms** : Messages d'erreur en français

### 9. **Détail Membre Équipe** (Team Member)
- **Profil complet** : Infos personnelles, rôle, statut
- **Historique** : Date d'ajout, statut activation

### 10. **Détail Projet** (Project Detail)
- **Vue détaillée** : Toutes infos du projet
- **Timeline** : Progression, étapes
- **Contacts liés** : Clients associés

### 11. **Détail Contact** (Contact Detail)
- **Profil complet** : Infos personnelles, historique
- **Projets liés** : Tous les projets du contact
- **Notes et historique** : Interactions précédentes

---

## 🧭 Navigation et Routing

### Système de routing
- **Type** : Hash-based (`#` dans URL)
- **Routes principales** :
  - `#` → Dashboard
  - `#directory-clients` → Annuaire
  - `#directory-prospects` → Prospects (sous-menu)
  - `#project-tracking` → Projets
  - `#agenda` → Agenda
  - `#tasks` → Tâches
  - `#tasks-memo` → Tâches & Mémos
  - `#articles` → Articles
  - `#settings` → Paramètres

### Routes paramétrées
- `#contact-{id}` → Détail d'un contact
- `#project-detail-{id}` → Détail d'un projet
- `#team-member-{id}` → Détail d'un membre équipe

### Sidebar Navigation
- Collapsible avec icônes Lucide
- Sous-menus (Directory a 6 sous-catégories)
- Items désactivés : Factures, Devis, Commandes (futures)
- Responsive : cachée sur mobile, visible sur desktop

---

## 🎨 Architecture et Patterns

### Patterns utilisés
1. **Component Composition** : Petits composants réutilisables combinés
2. **Container/Presentational** : Pages = conteneurs, composants = présentation
3. **Controlled Components** : Inputs controlés via React state
4. **Hash Routing** : Routing client-side custom
5. **Mock Data Pattern** : Données hardcodées pour dev (prêt pour API)

### State Management
- **React Hooks** : `useState`, `useEffect`, `useMemo`, `useRef`
- **Pas de global state** : Props-based, state local par composant
- **Form State** : Objets state séparés pour formulaires
- **Pas de Redux/Zustand** : Simple et suffisant pour MVP

### Data Flow
```
App (Router, Main State)
  ↓
Sidebar (Navigation)
  ↓
Page Component (TopBar + Content)
  ├── Filters & Search
  ├── Data Display (Table/Grid)
  └── Modals (Create/Edit/Delete)
```

### Design Responsive
- **Mobile-first** : Tailwind breakpoints (sm, md, lg, xl, 2xl)
- **Sidebar** : Cachée sur mobile (breakpoint lg)
- **Grids** : 1 col mobile → 2-3 col tablet → 4-6 col desktop
- **Tables** : Scroll horizontal sur petit écran
- **Headers/Footers** : Sticky positioning

---

## 📊 Modèles de données

### ⚠️ Important : Toutes les données sont mockées en mémoire

```typescript
// Contact/Client Model
{
  id: string,
  name: string,
  email: string,
  phone: string,
  addedBy: { name: string, avatarUrl: string },
  origin: 'Relation' | 'Salon' | 'Web' | 'Recommandation',
  location: string,
  projects: number,
  status: 'Prospect' | 'Client' | 'Leads',
  addedAt: string (ISO date)
}

// Project Model
{
  id: number,
  clientName: string,
  agent: { name: string, avatar: string },
  projectName: string,
  status: 'Découverte leads' | 'Étude client' | 'Dossier technique' | 'Installation' | 'SAV',
  progress: number (0-100),
  dateAdded: string
}

// Task Model
{
  id: number,
  title: string,
  due: string,
  tag: string,
  stages: string[],
  progress: number (0-100)
}

// KPI Model (White Strip)
{
  id: string,
  label: string,
  value: string,
  goal: string,
  percent: number,
  icon: string
}

// KPI Model (Colored Stack)
{
  id: string,
  label: string,
  value: number,
  color: string (Tailwind gradient class)
}

// User Model
{
  id: string,
  civility: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  avatarUrl: string,
  role: 'admin' | 'manager' | 'commercial' | 'technician'
}

// Team Member Model
{
  id: string,
  name: string,
  email: string,
  role: string,
  status: 'active' | 'inactive',
  joinDate: string,
  avatar: string
}
```

---

## 🔧 Scripts NPM

```bash
# Démarrage développement
npm run dev          # Vite dev server sur http://localhost:5173

# Build production
npm run build        # Vite build → dist/

# Prévisualisation build
npm run preview      # Serve le dist/ localement

# Linting
npm lint            # ESLint sur tous les fichiers .js/.jsx
```

---

## 🎛️ Configuration Importante

### Vite (`vite.config.js`)
- React plugin activé
- HMR (Hot Module Replacement) pour dev rapide
- Build optimisé

### Tailwind (`tailwind.config.js`)
- Scans : `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- Pas de theme custom étendu
- Utilities standards Tailwind

### ESLint (`.eslintrc.cjs`)
- React plugin
- React Hooks validation
- React Refresh pour Vite HMR

### Netlify (`netlify.toml`)
- Build command : `npm run build`
- Build output : `dist/`
- SPA rewrites : Toutes routes → `index.html`

---

## 🎨 UI Components & Icons

### Components clés
- **Badge** : Labels de statut/catégorie
- **IconButton** : Boutons avec icons
- **SearchInput** : Champs recherche
- **Select** : Dropdowns custom
- **Pagination** : Navigation multi-pages
- **Progress Bar** : Indicateurs progression
- **TaskRow** : Carte tâche individuelle
- **ProjectRow** : Lignes table projet

### Icons Lucide utilisées (50+)
Menu, Search, ChevronDown, Bell, Settings, MoreVertical, ArrowUpRight, Download, Upload, Plus, Eye, Users, Layout, CheckCircle2, Clock3, Calendar, FileText, Receipt, Package, ClipboardList, LogOut, Camera, X, EyeOff, Check, AlertCircle, Building2, Shield, Wifi, Pencil, Trash2, Mail, Edit3, Folder, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User2, CircleDot, etc.

---

## 📈 KPIs & Métriques

### White Strip KPIs
1. **Revenue** : Chiffre d'affaires
2. **Marge** : Marge brute
3. **Taux Marge** : Pourcentage de marge
4. **Taux Conversion** : Prospects → Clients

### Colored Stack KPIs
1. **Leads** : Nombre de leads
2. **Études** : Études en cours
3. **Commandes** : Commandes en cours
4. **Dossiers Tech** : Dossiers techniques
5. **Support Client** : Tickets SAV

---

## 🔌 Points d'intégration futurs

### Backend nécessaire
1. **API REST** pour CRUD (Create, Read, Update, Delete)
   - `/api/contacts` : Gestion contacts
   - `/api/projects` : Gestion projets
   - `/api/tasks` : Gestion tâches
   - `/api/teams` : Gestion équipe
   - `/api/kpis` : Métriques en temps réel

2. **Authentification**
   - Système login/register
   - JWT tokens
   - Session management

3. **Base de données**
   - Schéma pour contacts, projets, tâches, utilisateurs
   - Relations entre entités
   - Audit logs

4. **File uploads**
   - Endpoint avatar upload
   - Import/export contacts (CSV, Excel)
   - Documents projets

5. **Real-time**
   - Notifications
   - Live updates pour collaboration
   - WebSockets si besoin

---

## 🚫 Features désactivées (futures)

Dans la Sidebar, les items suivants sont désactivés :
- 📄 **Factures** (Invoices)
- 💰 **Devis** (Quotes)
- 📦 **Commandes** (Orders)

Ces fonctionnalités sont prévues pour des phases futures.

---

## 📝 Conventions de code

### Nommage
- **Composants** : PascalCase (ex: `DashboardPage.jsx`)
- **Variables** : camelCase (ex: `contactsList`)
- **Constants** : UPPER_SNAKE_CASE (ex: `MAX_CONTACTS`)
- **CSS classes** : Tailwind utility classes

### Fichiers
- Composants pages → `/src/pages/`
- Composants réutilisables → `/src/components/`
- Main app → `/src/App.jsx`
- Style globals → `/src/index.css`

### État
- State local par composant avec `useState`
- Props drilling pour data simple
- Callbacks pour communication parent-enfant

---

## 🐛 Bugs connus & À améliorer

- [ ] Pas de validation côté backend (à implémenter)
- [ ] Données mockées ne persiste pas au refresh
- [ ] Pas de gestion d'erreurs réseau
- [ ] Pas de loading states complets
- [ ] Pas de pagination optimisée
- [ ] Pas de cache utilisateur

---

## 💡 Notes importantes pour les sessions futures

1. **Toutes les données sont mockées** → Remplacer par des appels API
2. **Pas d'authentification** → Ajouter système auth + JWT
3. **Hash routing custom** → Considérer React Router si complexité augmente
4. **Pas de global state** → Ajouter Zustand/Redux si besoin scalabilité
5. **Responsiveness OK** → Tester sur vrais appareils
6. **Performance** → Profiler et optimiser si ralentissements
7. **SEO** → Ajouter Helmet ou SSR si besoin

---

## 📞 Contact & Support

**Dernière mise à jour** : Octobre 2024
**Version** : MVP 13.10
**Commits récents** :
- `aaf669a` : Xora 13.10 00.46
- `6e31499` : Xora MVP
- `edfd4da` : feat: Initial commit - Complete Xora dashboard application

---

## 🎓 Pour les prochaines sessions d'IA

**Utilise ce README pour :**
1. Comprendre rapidement l'architecture globale
2. Localiser les pages et composants pertinents
3. Identifier les points d'intégration backend
4. Maintenir cohérence avec conventions existantes
5. Planifier les évolutions futures

**En cas de question**, commence par explorer les fichiers clés :
- `src/App.jsx` → Routing et structure globale
- `src/components/Sidebar.jsx` → Navigation
- `src/pages/DashboardPage.jsx` → Exemple de page complexe
- `tailwind.config.js` → Configuration styling

**Liaison vers documentation utile** :
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev
- Lucide Icons: https://lucide.dev

---

**Créé avec ❤️ pour la productivité d'entreprise**
