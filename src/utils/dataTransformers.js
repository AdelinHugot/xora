/**
 * Transformateurs de données Supabase vers format UI
 */

// Coordonnées géographiques des villes
const locationCoordinates = {
  "Valras-Plage": [43.15, 3.10],
  "Montpellier": [43.65, 3.95],
  "Nîmes": [43.90, 4.50],
  "Béziers": [43.30, 2.65],
  "Agde": [43.25, 3.50],
  "Sète": [43.40, 3.75],
  "Paris": [48.85, 2.35],
  "Lyon": [45.76, 4.84],
  "Marseille": [43.30, 5.37],
  "Toulouse": [43.60, 1.44],
  "Bordeaux": [44.84, -0.58]
};

/**
 * Transforme les contacts Supabase au format UI Directory
 */
export const transformContactForDirectory = (contact, referent = null) => {
  // Récupérer l'info du créateur (ajoute_par) depuis les données du contact
  const creatorData = contact.ajoute_par;
  const creatorName = creatorData ? `${creatorData.nom} ${creatorData.prenom}` : 'N/A';
  const creatorId = creatorData?.id || contact.id;

  return {
    id: contact.id,
    name: `${contact.nom} ${contact.prenom}`.toUpperCase(),
    addedBy: {
      name: creatorName,
      avatarUrl: `https://i.pravatar.cc/24?u=${creatorId}`
    },
    origin: contact.origine || 'Web',
    location: contact.localisation || 'Paris',
    coordinates: locationCoordinates[contact.localisation] || locationCoordinates['Paris'],
    projects: 0, // À récupérer depuis la table projets
    status: contact.statut || 'Prospect',
    addedAt: formatDate(contact.cree_le),
    type: getContactType(contact.statut),
    email: contact.email,
    telephone: contact.telephone,
    nomEntreprise: contact.nom_entreprise
  };
};

/**
 * Transforme les projets Supabase au format UI ProjectTracking
 */
export const transformProjectForTracking = (project) => {
  // Get client name from joined contact or fallback to nom_contact
  const clientName = project.contact
    ? `${project.contact.nom} ${project.contact.prenom}`.toUpperCase()
    : (project.nom_contact || 'Sans nom');

  // Get agent/referent name from joined utilisateur or fallback
  const agentName = project.referent
    ? `${project.referent.nom} ${project.referent.prenom}`
    : 'Non assigné';

  const agentId = project.referent?.id || project.id_referent || project.id;

  return {
    id: project.id,
    clientName,
    agent: {
      name: agentName,
      avatar: `https://i.pravatar.cc/32?u=${agentId}`
    },
    projectName: project.nom_projet || 'Sans titre',
    status: project.statut || 'Non défini',
    progress: project.progression || 0,
    dateAdded: formatDate(project.cree_le),
    type: project.type,
    budget: project.budget_global
  };
};

/**
 * Transforme les rendez-vous Supabase au format UI Agenda
 */
export const transformAppointmentForAgenda = (appointment, contact = null) => {
  return {
    id: appointment.id,
    title: appointment.titre,
    contact: contact ? `${contact.nom} ${contact.prenom}` : appointment.titre,
    date: appointment.date_debut,
    startTime: appointment.heure_debut,
    endTime: appointment.heure_fin,
    location: appointment.lieu,
    comments: appointment.commentaires,
    createdBy: 'Agent'
  };
};

/**
 * Détermine le type de contact basé sur le statut
 */
function getContactType(statut) {
  const statusMap = {
    'Client': 'clients',
    'Prospect': 'clients',
    'Leads': 'institutional',
    'Fournisseur': 'suppliers',
    'Artisan': 'artisans',
    'Prescripteur': 'prescriber',
    'Sous-traitant': 'subcontractor'
  };
  return statusMap[statut] || 'clients';
}

/**
 * Formate une date ISO en format français JJ/MM/AA
 */
function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleDateString('fr-FR', { year: '2-digit', month: '2-digit', day: '2-digit' });

  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Génère un code hash simple pour un string
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en entier 32-bit
  }
  return Math.abs(hash);
}

/**
 * Formate un numéro de téléphone pour l'affichage (format français: 06 01 02 03 04)
 */
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return "";
  // Supprimer tous les caractères non-numériques
  const cleaned = phone.replace(/\D/g, "");
  // Si commence par 33 (format international), convertir en 0X
  if (cleaned.startsWith("33")) {
    const local = cleaned.substring(2);
    return local.replace(/(\d{2})(?=\d)/g, "$1 ");
  }
  // Si commence par 0, ajouter les espaces tous les 2 chiffres
  if (cleaned.startsWith("0")) {
    return cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
  }
  return phone;
};

/**
 * Formate un numéro de téléphone pour le stockage (format E.164: +33XXXXXXXXX)
 */
export const formatPhoneForStorage = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "+33" + cleaned.substring(1);
  }
  if (cleaned.startsWith("33")) {
    return "+" + cleaned;
  }
  return "+" + cleaned;
};

/**
 * Valide un numéro de téléphone
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Champ optionnel
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 9 && cleaned.length <= 15;
};

/**
 * Simplifie une adresse complète au format: Numéro Rue, Code Postal, Ville
 * Exemple: "18, Place Ambroise Courtois, Monplaisir, Lyon 8e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69008, France"
 * Devient: "18 Place Ambroise Courtois, 69008, Lyon"
 */
export const simplifyAddress = (address) => {
  if (!address) return '';

  // Diviser l'adresse par les virgules
  const parts = address.split(',').map(p => p.trim());

  if (parts.length === 0) return address;

  // Chercher le numéro et la rue (première partie)
  let streetAddress = parts[0];

  // Chercher le code postal (généralement 5 chiffres)
  let postalCode = '';
  let city = '';

  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];

    // Chercher le code postal (5 chiffres d'affilée)
    if (/^\d{5}$/.test(part)) {
      postalCode = part;
      // La ville est généralement après le code postal en remontant
      // ou avant dans la structure
      break;
    }
  }

  // Chercher la ville - c'est généralement le mot qui suit le code postal
  // ou avant le code postal
  if (postalCode) {
    const postalIndex = parts.findIndex(p => p === postalCode);
    // La ville est généralement juste avant le code postal ou la dernière partie significative
    for (let i = postalIndex - 1; i >= 0; i--) {
      const part = parts[i];
      // Ignorer les numéros de département et régions
      if (!/^\d+$/.test(part) && part.length > 0 && part.length < 50) {
        // Vérifier que ce n'est pas un arrondissement (contient "Arrondissement")
        if (!part.toLowerCase().includes('arrondissement') &&
            !part.toLowerCase().includes('france') &&
            part !== streetAddress) {
          city = part;
          break;
        }
      }
    }
  }

  // Si on n'a pas trouvé la ville de cette manière, chercher le dernier mot significatif
  if (!city && parts.length > 1) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (!/^\d{5}$/.test(part) &&
          !part.includes('Arrondissement') &&
          !part.toLowerCase().includes('france') &&
          part.length > 2 &&
          part.length < 50 &&
          part !== streetAddress) {
        city = part;
        break;
      }
    }
  }

  // Construire l'adresse simplifiée
  const simplifiedParts = [streetAddress];
  if (postalCode) simplifiedParts.push(postalCode);
  if (city) simplifiedParts.push(city);

  return simplifiedParts.filter(p => p && p.length > 0).join(', ');
};
