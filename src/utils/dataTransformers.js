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
  return {
    id: contact.id,
    name: `${contact.prenom} ${contact.nom}`.toUpperCase(),
    addedBy: {
      name: referent?.prenom || 'N/A',
      avatarUrl: `https://i.pravatar.cc/24?img=${hashCode(contact.id) % 24}`
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
export const transformProjectForTracking = (project, contact = null) => {
  return {
    id: project.id,
    clientName: contact ? `${contact.prenom} ${contact.nom}`.toUpperCase() : project.nom_contact,
    agent: {
      name: 'Agent',
      avatar: `https://i.pravatar.cc/24?img=${hashCode(project.id) % 24}`
    },
    projectName: project.nom_projet,
    status: project.statut,
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
    contact: contact ? `${contact.prenom} ${contact.nom}` : appointment.titre,
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
