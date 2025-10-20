import React, { useState } from "react";
import {
  Search,
  ArrowUpRight,
  Eye,
  Mail,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Folder
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

// Mock data pour les projets
const mockProjects = [
  {
    id: 1,
    clientName: "Chloé DUBOIS",
    agent: { name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=1" },
    projectName: "Cuisine étage 2",
    status: "Découverte leads",
    progress: 45,
    dateAdded: "25/05/25"
  },
  {
    id: 2,
    clientName: "Lucas MARTINEZ",
    agent: { name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=2" },
    projectName: "Salle de bain étage",
    status: "Étude client",
    progress: 45,
    dateAdded: "15/06/25"
  },
  {
    id: 3,
    clientName: "Chloé DUBOIS",
    agent: { name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=1" },
    projectName: "Terrasse",
    status: "Découverte leads",
    progress: 45,
    dateAdded: "25/05/25"
  },
  {
    id: 4,
    clientName: "Chloé DUBOIS",
    agent: { name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=1" },
    projectName: "Salle de bain étage",
    status: "Découverte leads",
    progress: 45,
    dateAdded: "25/05/25"
  },
  {
    id: 5,
    clientName: "Chloé DUBOIS",
    agent: { name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=1" },
    projectName: "Salle de bain étage",
    status: "SAV",
    progress: 45,
    dateAdded: "25/05/25"
  },
  {
    id: 6,
    clientName: "Amélie BERNARD",
    agent: { name: "Sophie", avatar: "https://i.pravatar.cc/24?img=3" },
    projectName: "Salle de bain étage",
    status: "Dossier technique",
    progress: 45,
    dateAdded: "20/09/25"
  },
  {
    id: 7,
    clientName: "Amélie BERNARD",
    agent: { name: "Sophie", avatar: "https://i.pravatar.cc/24?img=3" },
    projectName: "Salle de bain étage",
    status: "Dossier technique",
    progress: 45,
    dateAdded: "20/09/25"
  },
  {
    id: 8,
    clientName: "Sophie LEROY",
    agent: { name: "Marie", avatar: "https://i.pravatar.cc/24?img=4" },
    projectName: "Salle de bain étage",
    status: "Installation",
    progress: 45,
    dateAdded: "01/07/25"
  },
  {
    id: 9,
    clientName: "Amélie BERNARD",
    agent: { name: "Sophie", avatar: "https://i.pravatar.cc/24?img=3" },
    projectName: "Salle de bain étage",
    status: "Dossier technique",
    progress: 45,
    dateAdded: "20/09/25"
  },
  {
    id: 10,
    clientName: "Sophie LEROY",
    agent: { name: "Marie", avatar: "https://i.pravatar.cc/24?img=4" },
    projectName: "Salle de bain étage",
    status: "Installation",
    progress: 45,
    dateAdded: "01/07/25"
  }
];

// Fonction pour obtenir les couleurs du statut
function getStatusColors(status) {
  switch (status) {
    case "Découverte leads":
      return { bg: "bg-violet-100", text: "text-violet-600", progress: "bg-violet-500" };
    case "Étude client":
      return { bg: "bg-pink-100", text: "text-pink-600", progress: "bg-pink-500" };
    case "SAV":
      return { bg: "bg-rose-100", text: "text-rose-600", progress: "bg-rose-500" };
    case "Dossier technique":
      return { bg: "bg-sky-100", text: "text-sky-700", progress: "bg-sky-500" };
    case "Installation":
      return { bg: "bg-blue-100", text: "text-blue-700", progress: "bg-blue-500" };
    default:
      return { bg: "bg-neutral-100", text: "text-neutral-600", progress: "bg-neutral-500" };
  }
}

// Composant Topbar
function Topbar({ onNavigate }) {
  return (
    <header className="h-16 border-b border-neutral-200 bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-neutral-300 rounded text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 15.75H15.75M5.25 11.25H12.75M6.75 6.75H11.25M14.25 15.75L9.98715 2.96151C9.84555 2.5366 9.4479 2.25 9 2.25C8.5521 2.25 8.15445 2.5366 8.01285 2.96151L3.75 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-bold text-xl lg:text-2xl text-neutral-900">Suivi projets</h1>
      </div>
      <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
    </header>
  );
}

// Composant ligne de projet
function ProjectRow({ project, onViewProject }) {
  const statusColors = getStatusColors(project.status);

  const handleRowClick = (e) => {
    // Empêcher la navigation si on clique sur les boutons d'action
    if (e.target.closest('button')) {
      return;
    }
    if (onViewProject) {
      onViewProject(project);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className="border-b last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
      role="row"
    >
      {/* Nom & prénom */}
      <td className="py-4 px-3" role="cell">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">{project.clientName}</span>
          <ArrowUpRight className="size-4 text-neutral-400" />
        </div>
      </td>
      
      {/* Agenceur.s */}
      <td className="py-4 px-3" role="cell">
        <div className="flex items-center gap-2">
          <img 
            src={project.agent.avatar} 
            alt={project.agent.name} 
            className="size-6 rounded-full"
          />
          <span className="text-sm text-neutral-700">{project.agent.name}</span>
        </div>
      </td>
      
      {/* Nom du projet */}
      <td className="py-4 px-3" role="cell">
        <span className="text-sm text-neutral-700">{project.projectName}</span>
      </td>
      
      {/* Statut */}
      <td className="py-4 px-3" role="cell">
        <div className="space-y-2">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
            {project.status}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-neutral-200">
              <div 
                className={`h-2 rounded-full ${statusColors.progress}`}
                style={{ width: `${project.progress}%` }}
                role="progressbar"
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-xs text-neutral-500">{project.progress}%</span>
          </div>
        </div>
      </td>
      
      {/* Ajouté le */}
      <td className="py-4 px-3" role="cell">
        <span className="text-sm text-neutral-500">{project.dateAdded}</span>
      </td>
      
      {/* Action rapide */}
      <td className="py-4 px-3" role="cell">
        <div className="flex items-center gap-1">
          <button 
            className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
            aria-label="Voir projet"
            title="Voir projet"
          >
            <Eye className="size-4 text-neutral-600" />
          </button>
          <button 
            className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
            aria-label="Envoyer email"
            title="Envoyer email"
          >
            <Mail className="size-4 text-neutral-600" />
          </button>
          <button 
            className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
            aria-label="Éditer projet"
            title="Éditer projet"
          >
            <Edit3 className="size-4 text-neutral-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Composant Pagination
function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 36;
  const totalResults = 320;
  const resultsPerPage = 11;
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
      <div className="text-sm text-neutral-500">
        Actuellement {startResult} à {endResult} sur {totalResults} résultats
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
          disabled={currentPage === 1}
          aria-label="Première page"
        >
          <ChevronsLeft className="size-4" />
        </button>
        <button 
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
          disabled={currentPage === 1}
          aria-label="Page précédente"
        >
          <ChevronLeft className="size-4" />
        </button>
        
        {/* Pages */}
        <button className="px-3 py-1 rounded-xl bg-neutral-900 text-white text-sm font-medium">
          1
        </button>
        <button className="px-3 py-1 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-sm">
          2
        </button>
        <button className="px-3 py-1 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-sm">
          3
        </button>
        <span className="px-2 text-neutral-400">…</span>
        <button className="px-3 py-1 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-sm">
          36
        </button>
        
        <button 
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
        >
          <ChevronRight className="size-4" />
        </button>
        <button 
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
          disabled={currentPage === totalPages}
          aria-label="Dernière page"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function ProjectTrackingPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  const handleViewProject = (project) => {
    if (onNavigate) {
      onNavigate(`project-detail-${project.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar 
        currentPage="project-tracking" 
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar onNavigate={onNavigate} />

        <div className="w-full py-6 px-4 lg:px-6">
          {/* Barre de filtres */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Rechercher un client/projet"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-600 placeholder:text-neutral-400"
                />
              </div>
              
              <select 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600"
              >
                <option value="">Agenceur.se</option>
                <option value="jeremy">Jérémy</option>
                <option value="sophie">Sophie</option>
                <option value="marie">Marie</option>
              </select>
              
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600"
              >
                <option value="">Statut</option>
                <option value="decouverte">Découverte leads</option>
                <option value="etude">Étude client</option>
                <option value="sav">SAV</option>
                <option value="dossier">Dossier technique</option>
                <option value="installation">Installation</option>
              </select>
              
              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600"
              >
                <option value="">Date d'ajout</option>
                <option value="recent">Plus récent</option>
                <option value="ancien">Plus ancien</option>
              </select>
            </div>
          </div>
          
          {/* Tableau */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Nom & prénom
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Agenceur.s
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Nom du projet
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Statut
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Ajouté le
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Action rapide
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.map((project) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      onViewProject={handleViewProject}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            <Pagination />
          </div>
        </div>
      </main>
    </div>
  );
}
