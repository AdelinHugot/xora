// filename: TasksMemoPage.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CreateTaskOrMemoModal from "../components/CreateTaskOrMemoModal";
import UserTopBar from "../components/UserTopBar";
import { useTaches } from "../hooks/useTaches";
import { useTeamMembers } from "../hooks/useTeamMembers";

// Mock data generator (gardé pour les filtres d'agenceurs)


// Statuts de projets pour la diversification
const PROJECT_STATUSES = [
  "Prospect",
  "Étude client",
  "Dossier technique",
  "Installation",
  "SAV",
  "Terminé"
];

// Utility hooks
const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// SVG Icons (simplified)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3 3" strokeLinecap="round" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="3" width="10" height="14" rx="1.5" />
    <path d="M7 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

const TableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="10" rx="1" />
    <path d="M2 6h12M6 6v7" />
  </svg>
);

const MoreVerticalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="4" r="1.5" fill="currentColor" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="10" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

const GripVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="3" r="1" fill="currentColor" />
    <circle cx="10" cy="3" r="1" fill="currentColor" />
    <circle cx="6" cy="8" r="1" fill="currentColor" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="6" cy="13" r="1" fill="currentColor" />
    <circle cx="10" cy="13" r="1" fill="currentColor" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MessageIcon = () => <SearchIcon />;
const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1zM4 6h8M4 9h6" strokeLinecap="round" />
  </svg>
);

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3C4.5 3 1.5 5.5 1 8c.5 2.5 3.5 5 7 5s6.5-2.5 7-5c-.5-2.5-3.5-5-7-5z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const Pencil = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11.3 1.7L14.3 4.7L3.5 15.5H0.5V12.5L11.3 1.7Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.3 1.7L14.3 4.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Components
const Topbar = ({ onNavigate }) => {
  return (
    <header className="h-16 border-b border-[#E9E9E9] bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-neutral-50 border border-[#E9E9E9] rounded-lg text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 3.88501L7.9425 12.45L4.7625 9.27001L5.82 8.21251L7.9425 10.335L15.4425 2.83501L16.5 3.88501ZM14.8425 7.66501C14.94 8.09251 15 8.54251 15 9.00001C15 12.315 12.315 15 9 15C5.685 15 3 12.315 3 9.00001C3 5.68501 5.685 3.00001 9 3.00001C10.185 3.00001 11.28 3.34501 12.21 3.93751L13.29 2.85751C12.0348 1.97217 10.536 1.49788 9 1.50001C4.86 1.50001 1.5 4.86001 1.5 9.00001C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9.00001C16.5 8.10751 16.335 7.25251 16.05 6.45751L14.8425 7.66501Z" fill="currentColor" />
          </svg>
        </div>
        <h1 className="font-bold text-xl lg:text-2xl text-neutral-900">Tâches et Mémos</h1>
      </div>
      <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
    </header>
  );
};

const FiltersBar = ({ filters, onFilterChange, teamMembers = [] }) => {

  return (
    <div className="py-4 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <SearchIcon />
          </div>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Rechercher client/projet"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Tâches et Mémos</option>
          <option value="Tâche">Tâche</option>
          <option value="Mémo">Mémo</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Statut</option>
          <option value="Non commencé">Non commencé</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => onFilterChange("assignee", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Agenceur·s</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.prenom}>
              {member.prenom} {member.nom}
            </option>
          ))}
        </select>

        <select
          value={filters.echeance}
          onChange={(e) => onFilterChange("echeance", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Échéance</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois-ci</option>
          <option value="late">En retard</option>
        </select>
      </div>
    </div>
  );
};









const NoteButton = ({ note, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(note || "");
  const popoverRef = useRef(null);

  useOutsideClick(popoverRef, () => {
    if (isOpen) {
      onChange(value);
      setIsOpen(false);
    }
  });

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors"
        title="Note"
      >
        <NoteIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg p-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              onChange(value);
              setIsOpen(false);
            }}
            placeholder="Ajouter une note..."
            rows={4}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="Première page"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        «
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        ‹
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={typeof page === "number" ? `Page ${page}` : undefined}
          className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium ${page === currentPage
            ? "bg-neutral-900 text-white"
            : page === "..."
              ? "cursor-default"
              : "border border-neutral-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Dernière page"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        »
      </button>
    </nav>
  );
};

// Mapper les données du hook vers le format attendu par la page
const getStatusColor = (status) => {
  switch (status) {
    case "En cours":
      return { bg: "#FEF3C7", text: "#92400E", progressBar: "bg-blue-500", progressText: "text-blue-600" };
    case "Terminé":
      return { bg: "#DCFCE7", text: "#166534", progressBar: "bg-green-500", progressText: "text-green-600" };
    default:
      return { bg: "#F3F4F6", text: "#1F2937", progressBar: "bg-neutral-400", progressText: "text-neutral-600" };
  }
};

const mapTacheForDisplay = (tache) => {
  return {
    id: tache.id,
    index: tache.index,
    title: tache.titre || tache.clientName,
    client: tache.projectName,
    clientName: tache.clientName,
    projectName: tache.projectName,
    tag: tache.tag,
    type: tache.type,
    status: tache.status,
    progress: tache.progress,
    due: tache.dueDate || tache.cree_le,
    assignee: "Non assigné",
    salarie_name: tache.salarie_name,
    note: tache.note,
    currentStage: tache.currentStage,
    stages: tache.stages,
    isLate: tache.isLate,
    daysLate: tache.daysLate,
    dueDate: tache.dueDate
  };
};

// Main component
export default function TasksMemoPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  // Utiliser le hook pour les vraies données
  const { taches, loading, error, updateTacheStage, updateTacheStatus, deleteTache, createTache } = useTaches();
  const { teamMembers } = useTeamMembers();

  // Mapper les tâches pour l'affichage
  const mappedTaches = taches.map(mapTacheForDisplay);

  // State pour le filtre principal (Pill)
  const [statusFilterPill, setStatusFilterPill] = useState("all");

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    assignee: "",
    echeance: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewTaskId, setViewTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const menuRef = useRef(null);
  const pageSize = 10;

  // Close menu when clicking outside
  useOutsideClick(menuRef, () => setOpenMenuId(null));

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      if (updates.status !== undefined) {
        await updateTacheStatus(id, updates.status);
      }
      if (updates.currentStage !== undefined) {
        await updateTacheStage(id, updates.status === 'Terminé' ? 2 : (updates.status === 'En cours' ? 1 : 0));
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTache(id);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      await createTache(newTask);
      setIsModalOpen(false);
    } catch (err) {
      alert("Erreur lors de la création de la tâche: " + err.message);
    }
  };

  const handleViewTask = (taskId) => {
    setViewTaskId(taskId);
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditFormData({
      titre: task.title || "",
      type: task.tag || "",
      statut: task.status || "",
      note: task.note || ""
    });
  };

  const handleSaveEditTask = async () => {
    try {
      if (editFormData.statut !== undefined) {
        await updateTacheStatus(editTaskId, editFormData.statut);
      }
      setEditTaskId(null);
      setEditFormData(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert("Erreur lors de la mise à jour: " + err.message);
    }
  };

  // Filter logic
  const filteredTasks = useMemo(() => {
    return mappedTaches.filter((task) => {
      // 1. Filtre Principal (Pill)
      if (statusFilterPill === "en-cours") {
        if (task.status !== "En cours" && task.status !== "Non commencé") return false;
      } else if (statusFilterPill === "termine") {
        if (task.status !== "Terminé") return false;
      }

      // 2. Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          task.title || "",
          task.client || "",
          task.tag || "",
          task.note || ""
        ].map((f) => f.toLowerCase());

        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      // 3. Autres filtres
      if (filters.type) {
        if (filters.type === "Tâche" && task.type === "Mémo") return false;
        if (filters.type === "Mémo" && task.type === "Tâche") return false;
      }

      // The status filter from the FiltersBar should only apply if the main pill is "all"
      // or if it's consistent with the main pill.
      // For simplicity, if a status is selected in the FiltersBar, it overrides/refines the pill.
      if (filters.status) {
        if (task.status !== filters.status) return false;
      }


      if (filters.assignee && task.assignee !== filters.assignee && (!task.salarie_name || !task.salarie_name.includes(filters.assignee))) return false;

      if (filters.echeance && task.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [day, month, year] = task.dueDate.split('/');
        const dueDate = new Date(year, month - 1, day);
        const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (filters.echeance === "today" && daysDiff !== 0) return false;
        if (filters.echeance === "week" && (daysDiff < 0 || daysDiff > 7)) return false;
        if (filters.echeance === "month" && (daysDiff < 0 || daysDiff > 30)) return false;
        if (filters.echeance === "late" && daysDiff >= 0) return false;
      }

      return true;
    });
  }, [mappedTaches, filters, statusFilterPill]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  // --- Helper pour l'affichage de l'échéance ---
  const renderDueDate = (dateStr) => {
    if (!dateStr || dateStr === 'Pas de date') return <span className="text-neutral-400">Pas de date</span>;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [day, month, year] = dateStr.split('/');
    const dueDate = new Date(year, month - 1, day);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return (
        <span className="text-red-600 font-bold">
          {diffDays} jour{diffDays > 1 ? 's' : ''} de retard
        </span>
      );
    }
    return <span className="text-neutral-900 font-medium">{dateStr}</span>;
  };

  const isLate = (dateStr) => {
    if (!dateStr || dateStr === 'Pas de date') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [day, month, year] = dateStr.split('/');
    const dueDate = new Date(year, month - 1, day);
    return dueDate < today;
  };


  // --- Layout Helpers ---
  const sidebarWidth = sidebarCollapsed ? "72px" : "256px";

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans text-neutral-900">
      <Sidebar
        currentPage="tasks-memo"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />

      <main
        className="flex-1 flex flex-col h-full overflow-hidden relative transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar onNavigate={onNavigate} />

        <CreateTaskOrMemoModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
          employees={teamMembers}
          commercials={teamMembers}
        />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">

            {/* Main Card Container */}
            <div className="rounded-2xl border border-[#E9E9E9] bg-white shadow-sm">

              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Liste des tâches et mémo ({filteredTasks.length})
                    </h2>
                    {/* Status Pill */}
                    <div className="inline-flex rounded-full border border-neutral-300 bg-neutral-100 p-1">
                      <button
                        onClick={() => setStatusFilterPill("all")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${statusFilterPill === "all" ? "bg-gray-900 text-white" : "text-neutral-700 hover:text-neutral-900"
                          }`}
                      >
                        Tout voir
                      </button>
                      <button
                        onClick={() => setStatusFilterPill("en-cours")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${statusFilterPill === "en-cours" ? "bg-gray-900 text-white" : "text-neutral-700 hover:text-neutral-900"
                          }`}
                      >
                        En cours
                      </button>
                      <button
                        onClick={() => setStatusFilterPill("termine")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${statusFilterPill === "termine" ? "bg-gray-900 text-white" : "text-neutral-700 hover:text-neutral-900"
                          }`}
                      >
                        Terminé
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10"
                  >
                    <PlusIcon />
                    Ajouter une tâche manuelle ou un mémo
                  </button>
                </div>

                {/* Filters */}
                <FiltersBar filters={filters} onFilterChange={handleFilterChange} teamMembers={teamMembers} />
              </div>

              {/* Table Content */}
              <div className="w-full overflow-x-auto mt-2">
                {/* Headers */}
                <div className="py-3 px-6 bg-neutral-50 border-y border-neutral-200 grid gap-4 items-center min-w-[1000px]" style={{ gridTemplateColumns: "60px 2.5fr 1fr 1fr 1fr 1fr 0.5fr 1.5fr 40px" }}>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Ordre</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Descriptif</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Tag</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Échéance</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Statut</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Collaborateur</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Note</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Progression</div>
                  <div></div>
                </div>

                <div className="divide-y divide-neutral-100">
                  {loading && (
                    <div className="py-12 text-center text-neutral-500">Chargement...</div>
                  )}
                  {!loading && !error && paginatedTasks.length === 0 && (
                    <div className="py-12 text-center text-neutral-500">Aucune tâche trouvée</div>
                  )}
                  {!loading && !error && paginatedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="py-4 px-6 grid gap-4 items-center hover:bg-neutral-50 transition-colors min-w-[1000px]"
                      style={{ gridTemplateColumns: "60px 2.5fr 1fr 1fr 1fr 1fr 0.5fr 1.5fr 40px" }}
                    >
                      {/* Ordre */}
                      <div className="text-sm text-neutral-400 font-mono">#{task.index}</div>

                      {/* Descriptif */}
                      <div className="min-w-0">
                        <div className={`font-medium truncate ${task.status === "Terminé" ? "line-through text-neutral-400" : "text-neutral-900"}`}>{task.title}</div>
                        <div className="text-xs text-neutral-500 truncate">{task.clientName !== 'Non spécifié' ? task.clientName : ''}</div>
                      </div>

                      {/* Tag */}
                      <div>
                        {task.tag && (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${task.tag === 'Mémo' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                            {task.tag}
                          </span>
                        )}
                      </div>

                      {/* Echeance */}
                      <div className="text-sm text-neutral-600">
                        {task.dueDate}
                      </div>

                      {/* Statut */}
                      <div>
                        {(() => {
                          const statusColor = getStatusColor(task.status);
                          return (
                            <select
                              value={task.status}
                              onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                              className="text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0"
                              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                            >
                              <option value="Non commencé">Non commencé</option>
                              <option value="En cours">En cours</option>
                              <option value="Terminé">Terminé</option>
                            </select>
                          );
                        })()}
                      </div>

                      {/* Collaborateur */}
                      <div className="flex items-center gap-2">
                        {task.salarie_name ? (
                          <span className="text-sm text-neutral-700">{task.salarie_name.split(' ')[0]}</span>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">Non assigné</span>
                        )}
                      </div>

                      {/* Note */}
                      <div>
                        {task.note && <NoteIcon />}
                      </div>

                      {/* Progression */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500 w-8 text-right">{task.progress}%</span>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end relative" ref={menuRef}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                          className="text-neutral-400 hover:text-neutral-600 p-1"
                        >
                          <MoreVerticalIcon />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === task.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-max">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleEditTask(task);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 first:rounded-t-lg"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleViewTask(task.id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            >
                              Voir
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDeleteTask(task.id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                {paginatedTasks.length > 0 && (
                  <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
                    <span className="text-sm text-neutral-500">
                      {startIndex + 1}-{Math.min(startIndex + pageSize, filteredTasks.length)} sur {filteredTasks.length}
                    </span>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Task Modal */}
        {viewTaskId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Détails de la tâche</h2>
                <button
                  onClick={() => setViewTaskId(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <XIcon />
                </button>
              </div>

              {(() => {
                const task = mappedTaches.find(t => t.id === viewTaskId);
                if (!task) return null;

                return (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Titre</label>
                      <p className="text-sm text-neutral-900">{task.title || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Type</label>
                      <p className="text-sm text-neutral-900">{task.tag || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Statut</label>
                      <p className="text-sm text-neutral-900">{task.status || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Client</label>
                      <p className="text-sm text-neutral-900">{task.client || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Projet</label>
                      <p className="text-sm text-neutral-900">{task.project || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Progression</label>
                      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{task.progress}%</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Note</label>
                      <p className="text-sm text-neutral-900">{task.note || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Échéance</label>
                      <p className="text-sm text-neutral-900">{task.dueDate || "-"}</p>
                    </div>
                  </div>
                );
              })()}

              <div className="p-6 border-t border-neutral-200">
                <button
                  onClick={() => setViewTaskId(null)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-neutral-900 hover:bg-neutral-50 font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {editTaskId && editFormData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Modifier la tâche</h2>
                <button
                  onClick={() => {
                    setEditTaskId(null);
                    setEditFormData(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <XIcon />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Titre</label>
                  <input
                    type="text"
                    value={editFormData.titre}
                    onChange={(e) => setEditFormData({ ...editFormData, titre: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Type</label>
                  <input
                    type="text"
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Statut</label>
                  <select
                    value={editFormData.statut}
                    onChange={(e) => setEditFormData({ ...editFormData, statut: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un statut</option>
                    <option value="Non commencé">Non commencé</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-2">Note</label>
                  <textarea
                    value={editFormData.note}
                    onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200 flex gap-3">
                <button
                  onClick={() => {
                    setEditTaskId(null);
                    setEditFormData(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 text-neutral-900 hover:bg-neutral-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEditTask}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Example wrapper for standalone use
export function ExampleTasksMemoPage() {
  return <TasksMemoPage onNavigate={() => { }} sidebarCollapsed={false} onToggleSidebar={() => { }} />;
}
