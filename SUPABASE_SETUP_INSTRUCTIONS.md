# Supabase Setup Instructions

## 🎯 Étapes à suivre

### 1️⃣ Exécuter le schéma SQL

1. Va sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionne ton projet `ziizmsogdyswtmsswsza`
3. Va dans l'onglet **SQL Editor**
4. Clique sur **New Query**
5. Copie tout le contenu du fichier `supabase_setup.sql`
6. Colle-le dans l'éditeur
7. Clique sur **Run** ou **Cmd+Enter**

⚠️ **Important** : Attends que toutes les tables soient créées (tu verras un message de succès)

### 2️⃣ Installer les dépendances npm

```bash
npm install @supabase/supabase-js
```

### 3️⃣ Vérifier la connexion

Une fois que tu as exécuté le SQL, tu peux tester avec ce code simple:

```javascript
import { supabase } from './src/lib/supabase';

// Dans la console du navigateur
supabase.from('contacts').select('*').then(res => console.log(res.data));
```

Tu devrais voir tes 5 contacts de test!

### 4️⃣ Hooks disponibles

Tu as maintenant accès à ces hooks:

```javascript
import { useContacts } from './src/hooks/useContacts';
import { useProjects } from './src/hooks/useProjects';
import { useAppointments } from './src/hooks/useAppointments';
import { useUsers } from './src/hooks/useUsers';

// Utilisation dans un composant
function MyComponent() {
  const { contacts, loading, error } = useContacts();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <ul>
      {contacts.map(contact => (
        <li key={contact.id}>{contact.first_name} {contact.last_name}</li>
      ))}
    </ul>
  );
}
```

## 📊 Données de test

Le SQL crée automatiquement:
- **5 contacts** (Client, Prospect, Leads)
- **5 propriétés**
- **5 projets**
- **3 rendez-vous**
- **4 utilisateurs** (Admin, Manager, Commercial, Technicien)
- **4 tâches**

## 🔐 Configuration RLS (Row Level Security)

Par défaut, Supabase crée les tables en mode public. Si tu veux sécuriser:

1. Va dans **Database** → **Auth** → **Policies**
2. Ajoute des policies selon tes besoins

Pour maintenant, on va laisser les tables en public pour faire des tests.

## ❌ Problèmes courants

### "ENUM type does not exist"
→ Les enums ne sont pas supportés par défaut. J'ai utilisé VARCHAR à la place.

### "Table already exists"
→ Exécute d'abord cette requête pour nettoyer:
```sql
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS appointment_collaborators CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS kpis CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_steps CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS external_contacts CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
```

Puis réexécute le setup.sql

### Pas de données
→ Vérifie que le SQL a bien exécuté jusqu'au bout. Check les INSERT statements.

## 📱 Prochaines étapes

Après la vérification de la connexion:
1. Refactoriser la page **Annuaire** pour utiliser `useContacts`
2. Refactoriser la page **Projet** pour utiliser `useProjects`
3. Refactoriser **Agenda** pour utiliser `useAppointments`
4. Ajouter l'authentification Supabase Auth
5. Implémenter les pages manquantes (Articles, KPIs, etc.)

Dis-moi quand tu as exécuté le SQL et on continue! ✅
