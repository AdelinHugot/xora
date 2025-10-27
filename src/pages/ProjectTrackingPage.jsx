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
  Folder,
  ChevronDown,
  ArrowUp,
  ArrowDown
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
    status: "Prospect",
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
    status: "Prospect",
    progress: 45,
    dateAdded: "25/05/25"
  },
  {
    id: 4,
    clientName: "Chloé DUBOIS",
    agent: { name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=1" },
    projectName: "Salle de bain étage",
    status: "Prospect",
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

// Fonction pour obtenir les couleurs du statut avec les couleurs exactes demandées
function getStatusColors(status) {
  switch (status) {
    case "Prospect":
      return { bg: "#E0E7FF", text: "#4F46E5", progress: "bg-indigo-500", bgClass: "bg-[#E0E7FF]", textClass: "text-[#4F46E5]" };
    case "Étude client":
      return { bg: "#EED1F4", text: "#C970AB", progress: "bg-violet-500", bgClass: "bg-[#EED1F4]", textClass: "text-[#C970AB]" };
    case "Dossier technique":
      return { bg: "#A4E6FE", text: "#1A8AB3", progress: "bg-sky-500", bgClass: "bg-[#A4E6FE]", textClass: "text-[#1A8AB3]" };
    case "Installation":
      return { bg: "#A9C9F9", text: "#385D95", progress: "bg-blue-500", bgClass: "bg-[#A9C9F9]", textClass: "text-[#385D95]" };
    case "SAV":
      return { bg: "#FFD0C1", text: "#DF7959", progress: "bg-rose-500", bgClass: "bg-[#FFD0C1]", textClass: "text-[#DF7959]" };
    case "Terminé":
      return { bg: "#76D88B", text: "#2A732F", progress: "bg-green-500", bgClass: "bg-[#76D88B]", textClass: "text-[#2A732F]" };
    default:
      return { bg: "#F3F4F6", text: "#1F2937", progress: "bg-neutral-500", bgClass: "bg-[#F3F4F6]", textClass: "text-[#1F2937]" };
  }
}

// Composant Dropdown personnalisé pour le statut avec pastilles de couleurs
function StatusDropdown({ value, onChange, statuses }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const getStatusStyle = (status) => {
    const colors = getStatusColors(status);
    return {
      backgroundColor: colors.bg,
      color: colors.text
    };
  };

  const selectedLabel = statuses.find(s => s.value === value)?.label || "Statut";

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 min-w-[200px] w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Tous les statuts
          </button>
          {statuses.map((status) => {
            const colors = getStatusColors(status.label);
            return (
              <button
                key={status.value}
                onClick={() => {
                  onChange(status.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-neutral-50"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={getStatusStyle(status.label)}
                />
                {status.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Composant Dropdown personnalisé pour les agenceurs avec photos
function AgentDropdown({ value, onChange, agents }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedAgent = agents.find(a => a.id === value);
  const selectedLabel = selectedAgent?.name || "Agenceur.se";

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Tous les agenceurs
          </button>
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                onChange(agent.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
            >
              <img
                src={agent.avatar}
                alt={agent.name}
                className="size-6 rounded-full flex-shrink-0"
              />
              <span>{agent.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant Dropdown personnalisé pour les dates avec icônes flèche
function DateDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find(o => o.id === value);
  const selectedLabel = selectedOption?.label || "Date d'ajout";

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Date d'ajout
          </button>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant Topbar
function Topbar({ onNavigate }) {
  return (
    <header className="h-16 border-b bg-[#F8F9FA] border-neutral-200 px-4 lg:px-6 flex items-center justify-between">
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
      className="hover:bg-neutral-50 transition-colors cursor-pointer"
      style={{ borderBottom: "1px solid #E4E4E7" }}
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
        <div className="flex items-center gap-3">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0"
            style={{
              backgroundColor: statusColors.bg,
              color: statusColors.text
            }}
          >
            {project.status}
          </span>

          {/* Indicateur circulaire du progrès avec pourcentage à droite */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Cercle SVG - Réduit */}
            <svg width="28" height="28" viewBox="0 0 40 40" className="transform -rotate-90 flex-shrink-0">
              {/* Cercle de fond gris clair */}
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2.5"
              />
              {/* Cercle de progression */}
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke={statusColors.text}
                strokeWidth="2.5"
                strokeDasharray={`${(project.progress / 100) * (2 * Math.PI * 16)} ${2 * Math.PI * 16}`}
                strokeLinecap="round"
                className="transition-all"
              />
            </svg>

            {/* Pourcentage à droite du cercle */}
            <span
              className="text-xs font-semibold whitespace-nowrap flex-shrink-0"
              style={{ color: statusColors.text }}
            >
              {project.progress}%
            </span>
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
          {/* Tableau */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6">
            {/* Barre de filtres dans le bloc blanc */}
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                {/* Searchbar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="search"
                    placeholder="Rechercher un client/projet"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-600 placeholder:text-neutral-400"
                  />
                </div>

                {/* Filtre Agenceur.se */}
                <div className="flex-1">
                  <AgentDropdown
                    value={selectedAgent}
                    onChange={setSelectedAgent}
                    agents={[
                      { id: "jeremy", name: "Jérémy", avatar: "https://i.pravatar.cc/24?img=1" },
                      { id: "sophie", name: "Sophie", avatar: "https://i.pravatar.cc/24?img=3" },
                      { id: "marie", name: "Marie", avatar: "https://i.pravatar.cc/24?img=4" }
                    ]}
                  />
                </div>

                {/* Filtre Statut avec composant personnalisé */}
                <div className="flex-1">
                  <StatusDropdown
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    statuses={[
                      { value: "etude", label: "Étude client" },
                      { value: "dossier", label: "Dossier technique" },
                      { value: "installation", label: "Installation" },
                      { value: "sav", label: "SAV" },
                      { value: "termine", label: "Terminé" }
                    ]}
                  />
                </div>

                {/* Filtre Date d'ajout */}
                <div className="flex-1">
                  <DateDropdown
                    value={selectedDate}
                    onChange={setSelectedDate}
                    options={[
                      { id: "recent", label: "Plus récent", icon: <ArrowUp className="size-4 text-neutral-600" /> },
                      { id: "ancien", label: "Plus ancien", icon: <ArrowDown className="size-4 text-neutral-600" /> }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Tableau contenu */}
            <div className="overflow-x-auto border border-[#E4E4E7] rounded-lg" style={{ maxHeight: "calc(100vh - 420px)" }}>
              <table className="w-full" role="table">
                <thead>
                  <tr style={{ backgroundColor: "#E4E4E7", borderBottom: "1px solid #D4D4D8" }}>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
                      Nom & prénom
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
                      Agenceur.s
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
                      Nom du projet
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
                      Statut
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
                      Ajouté le
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
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
