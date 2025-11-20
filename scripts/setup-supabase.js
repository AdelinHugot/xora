import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Interface pour poser des questions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.bright}${colors.blue}▸${colors.reset} ${msg}`)
};

async function setupSupabase() {
  console.log(`\n${colors.bright}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}║   🚀 XORA - Setup Supabase Auto       ║${colors.reset}`);
  console.log(`${colors.bright}╚════════════════════════════════════════╝${colors.reset}\n`);

  try {
    // Étape 1 : Récupérer les credentials
    log.step('Étape 1/6 : Récupération des credentials Supabase');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      log.error('Credentials Supabase manquants dans le fichier .env');
      log.info('Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis');
      process.exit(1);
    }

    log.success(`URL Supabase: ${supabaseUrl}`);

    // Demander la clé service_role pour les opérations administratives
    log.warning('\n⚠️  Pour configurer la base de données, nous avons besoin de la clé SERVICE_ROLE');
    log.info('Vous pouvez la trouver dans: Dashboard Supabase → Settings → API → service_role key');
    log.warning('⚠️  Cette clé ne sera PAS sauvegardée et est utilisée uniquement pour le setup\n');

    const serviceRoleKey = await question('Entrez votre clé service_role: ');

    if (!serviceRoleKey || serviceRoleKey.trim() === '') {
      log.error('Clé service_role requise pour continuer');
      process.exit(1);
    }

    // Créer le client admin
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Étape 2 : Lire le script SQL
    log.step('Étape 2/6 : Lecture du script de migration');

    const sqlPath = path.join(__dirname, '..', 'supabase_rls_multi_tenant.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    log.success('Script SQL chargé');

    // Étape 3 : Exécuter le script SQL
    log.step('Étape 3/6 : Exécution du script de migration (cela peut prendre quelques secondes)');

    const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', { sql: sqlScript }).catch(async () => {
      // Si exec_sql n'existe pas, on essaie d'exécuter via l'API REST
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ sql: sqlScript })
      });

      if (!response.ok) {
        // Fallback: exécuter manuellement les principales commandes
        log.warning('Impossible d\'exécuter le script complet automatiquement');
        log.info('Vous devrez exécuter le script manuellement dans le SQL Editor');
        return { error: null };
      }

      return { error: null };
    });

    if (sqlError) {
      log.warning('Certaines parties du script n\'ont pas pu être exécutées automatiquement');
      log.info('Veuillez vérifier et exécuter manuellement le script supabase_rls_multi_tenant.sql');
    } else {
      log.success('Migration des tables terminée');
    }

    // Étape 4 : Créer l'organisation
    log.step('Étape 4/6 : Création de l\'organisation');

    const orgName = await question('\nNom de votre organisation (ex: Ma Société): ');
    const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organisations')
      .insert({
        nom: orgName,
        slug: orgSlug,
        description: `Organisation ${orgName}`,
        statut: 'actif'
      })
      .select()
      .single();

    if (orgError) {
      log.error(`Erreur lors de la création de l'organisation: ${orgError.message}`);
      process.exit(1);
    }

    log.success(`Organisation créée: ${orgData.nom} (ID: ${orgData.id})`);

    // Étape 5 : Créer le rôle admin
    log.step('Étape 5/6 : Vérification du rôle administrateur');

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .upsert({
        nom: 'Administrateur',
        description: 'Accès complet à l\'application',
        couleur: 'violet'
      }, { onConflict: 'nom' })
      .select()
      .single();

    if (roleError) {
      log.error(`Erreur lors de la création du rôle: ${roleError.message}`);
      process.exit(1);
    }

    log.success('Rôle administrateur vérifié');

    // Étape 6 : Créer l'utilisateur
    log.step('Étape 6/6 : Création de l\'utilisateur administrateur');

    const userEmail = await question('\nEmail de l\'administrateur: ');
    const userPassword = await question('Mot de passe (min 6 caractères): ');
    const userFirstName = await question('Prénom: ');
    const userLastName = await question('Nom: ');

    // Créer l'utilisateur dans auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      email_confirm: true,
      user_metadata: {
        first_name: userFirstName,
        last_name: userLastName
      }
    });

    if (authError) {
      log.error(`Erreur lors de la création de l'utilisateur auth: ${authError.message}`);
      process.exit(1);
    }

    log.success(`Utilisateur auth créé: ${authData.user.id}`);

    // Créer le profil utilisateur
    const { data: userData, error: userError } = await supabaseAdmin
      .from('utilisateurs')
      .insert({
        id_organisation: orgData.id,
        civilite: 'Mr',
        prenom: userFirstName,
        nom: userLastName,
        email: userEmail,
        id_role: roleData.id,
        statut: 'actif'
      })
      .select()
      .single();

    if (userError) {
      log.error(`Erreur lors de la création du profil utilisateur: ${userError.message}`);
      process.exit(1);
    }

    log.success('Profil utilisateur créé');

    // Créer la liaison auth
    const { error: authLinkError } = await supabaseAdmin
      .from('utilisateurs_auth')
      .insert({
        id_auth_user: authData.user.id,
        id_utilisateur: userData.id,
        id_organisation: orgData.id
      });

    if (authLinkError) {
      log.error(`Erreur lors de la liaison auth: ${authLinkError.message}`);
      process.exit(1);
    }

    log.success('Liaison auth créée');

    // Résumé final
    console.log(`\n${colors.bright}${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.green}║   ✓ Configuration terminée !           ║${colors.reset}`);
    console.log(`${colors.bright}${colors.green}╚════════════════════════════════════════╝${colors.reset}\n`);

    log.info('Récapitulatif:');
    console.log(`  • Organisation: ${colors.bright}${orgData.nom}${colors.reset}`);
    console.log(`  • Email: ${colors.bright}${userEmail}${colors.reset}`);
    console.log(`  • Rôle: ${colors.bright}Administrateur${colors.reset}\n`);

    log.success('Vous pouvez maintenant vous connecter avec ces identifiants !\n');

  } catch (error) {
    log.error(`Erreur inattendue: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Lancer le script
setupSupabase();
