import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  GripVertical,
  CheckCircle2,
  Bell,
  Settings,
  ChevronDown
} from "lucide-react";
import Sidebar from "../components/Sidebar";

// Mock data - 10 tâches selon la maquette
const mockTasks = [
  {
    id: "1",
    rank: 1,
    title: "Cuisine extérieure",
    client: "Coline FARGET",
    tag: "Dossier technique",
    assignee: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
    due: "Jusqu'au 25/03/25",
    note: true,
    progress: 45,
    status: "En cours"
  },
  {
    id: "2",
    rank: 2,
    title: "Appeler Laurent",
    client: "",
    tag: "Mémo",
    assignee: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" },
    due: "Jusqu'au 26/03/25",
    note: false,
    progress: 0,
    status: "Non commencé"
  },
  {
    id: "3",
    rank: 3,
    title: "Appeler Bernard",
    client: "",
    tag: "Mémo",
    assignee: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" },
    due: "Jusqu'au 27/03/25",
    note: false,
    progress: 0,
    status: "Non commencé"
  },
  {
    id: "4",
    rank: 4,
    title: "Cuisine extérieure",
    client: "Marie DUPONT",
    tag: "Études en cours",
    assignee: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
    due: "Jusqu'au 28/03/25",
    note: true,
    progress: 65,
    status: "En cours"
  },
  {
    id: "5",
    rank: 5,
    title: "Cuisine extérieure",
    client: "Paul MARTIN",
    tag: "Installation",
    assignee: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" },
    due: "Jusqu'au 29/03/25",
    note: false,
    progress: 80,
    status: "En cours"
  },
  {
    id: "6",
    rank: 6,
    title: "Appeler Bernard",
    client: "",
    tag: "Mémo",
    assignee: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" },
    due: "Jusqu'au 30/03/25",
    note: false,
    progress: 0,
    status: "Non commencé"
  },
  {
    id: "7",
    rank: 7,
    title: "Cuisine extérieure",
    client: "Anne SIMON",
    tag: "Installation",
    assignee: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
    due: "Jusqu'au 31/03/25",
    note: true,
    progress: 90,
    status: "En cours"
  },
  {
    id: "8",
    rank: 8,
    title: "Cuisine extérieure",
    client: "Pierre ROUX",
    tag: "Études en cours",
    assignee: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" },
    due: "Jusqu'au 01/04/25",
    note: false,
    progress: 30,
    status: "En cours"
  },
  {
    id: "9",
    rank: 9,
    title: "Appeler Bernard",
    client: "",
    tag: "Mémo",
    assignee: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" },
    due: "Jusqu'au 02/04/25",
    note: false,
    progress: 0,
    status: "Non commencé"
  },
  {
    id: "10",
    rank: 10,
    title: "Cuisine extérieure",
    client: "Sylvie BLANC",
    tag: "Dossier technique",
    assignee: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
    due: "Jusqu'au 03/04/25",
    note: true,
    progress: 55,
    status: "En cours"
  }
];

// Utility components
const Tag = ({ variant, children }) => {
  const variantClasses = {
    "Dossier technique": "bg-sky-100 text-sky-700 border-sky-200",
    "Études en cours": "bg-violet-100 text-violet-600 border-violet-200",
    "Installation": "bg-blue-100 text-blue-700 border-blue-200",
    "Mémo": "bg-neutral-900 text-white border-neutral-900"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${variantClasses[variant] || variantClasses["Mémo"]}`}>
      {children}
    </span>
  );
};

const StatusButton = ({ status, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${
        isActive 
          ? "bg-neutral-900 text-white" 
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      {status}
    </button>
  );
};

const Progress = ({ value, onUpdate }) => {
  const handleClick = (e) => {
    if (onUpdate) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newValue = Math.round((x / width) * 100);
      onUpdate(Math.min(100, Math.max(0, newValue)));
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex-1 h-2 bg-neutral-200 rounded-full cursor-pointer overflow-hidden"
        onClick={handleClick}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="h-full bg-neutral-800 transition-all duration-200"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-medium text-neutral-600 min-w-[3ch]">{value}%</span>
    </div>
  );
};

const TaskRow = ({ task, onTaskUpdate }) => {
  const handleStatusChange = (newStatus) => {
    onTaskUpdate(task.id, { status: newStatus });
  };

  const handleProgressUpdate = (newProgress) => {
    onTaskUpdate(task.id, { progress: newProgress });
  };

  return (
    <div 
      className="rounded-xl border border-neutral-200 bg-white px-4 py-3 md:py-4 hover:bg-neutral-50 transition-colors shadow-sm"
      role="group"
      aria-labelledby={`task-title-${task.id}`}
    >
      <div className="flex items-center gap-4">
        {/* Handle drag + rank */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="cursor-grab text-neutral-400 hover:text-neutral-600">
            <GripVertical className="size-4" />
          </div>
          <div className="size-6 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-600">
            {task.rank}
          </div>
        </div>

        {/* Titre + client + tag */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 
              id={`task-title-${task.id}`}
              className="font-semibold text-neutral-900 truncate"
            >
              {task.title}
            </h3>
            <Tag variant={task.tag}>{task.tag}</Tag>
          </div>
          {task.client && (
            <div className="text-sm text-neutral-600">{task.client}</div>
          )}
        </div>

        {/* Assigné à */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img 
            src={task.assignee.avatarUrl} 
            alt={`Avatar de ${task.assignee.name}`}
            className="size-6 rounded-full"
          />
          <span className="text-sm text-neutral-600">{task.assignee.name}</span>
        </div>

        {/* Échéance */}
        <div className="text-sm text-neutral-600 flex-shrink-0 min-w-[120px]">
          {task.due}
        </div>

        {/* Note */}
        <div className="flex-shrink-0">
          {task.note ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
              Note
            </span>
          ) : (
            <div className="size-2 rounded-full bg-neutral-300"></div>
          )}
        </div>

        {/* Progression */}
        <div className="min-w-[150px] flex-shrink-0">
          <Progress 
            value={task.progress} 
            onUpdate={handleProgressUpdate}
          />
        </div>

        {/* Statut tri-états */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {["Non commencé", "En cours", "Terminé"].map((status) => (
            <StatusButton
              key={status}
              status={status}
              isActive={task.status === status}
              onClick={() => handleStatusChange(status)}
            />
          ))}
        </div>

        {/* Action rapide */}
        <div className="flex-shrink-0">
          <button 
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-colors"
            aria-label={`Ouvrir actions pour ${task.title}`}
            aria-haspopup="menu"
          >
            <MoreHorizontal className="size-4 text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Topbar = () => {
  return (
    <header className="h-16 border-b bg-[#F8F9FA] border-neutral-200 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-xl lg:text-2xl text-neutral-900">Tâches & mémo</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl border hover:bg-neutral-50" aria-label="Messages">
          <Search className="size-4" />
        </button>
        <button className="p-2 rounded-xl border hover:bg-neutral-50" aria-label="Notifications">
          <Bell className="size-4" />
        </button>
        <button className="p-2 rounded-xl border hover:bg-neutral-50" aria-label="Paramètres">
          <Settings className="size-4" />
        </button>
        <div className="flex items-center gap-2 pl-3 ml-2 border-l">
          <img src="https://i.pravatar.cc/40?img=12" alt="avatar" className="size-8 rounded-full" />
          <div className="text-sm leading-tight">
            <div className="font-semibold">Thomas</div>
            <div className="text-neutral-500">Admin</div>
          </div>
          <ChevronDown className="size-4 text-neutral-500" />
        </div>
      </div>
    </header>
  );
};

const TasksCard = () => {
  const [viewMode, setViewMode] = useState("Tableau");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    assignee: "",
    due: ""
  });
  const [tasks, setTasks] = useState(mockTasks);

  // Options pour les filtres
  const filterOptions = {
    type: ["Dossier technique", "Études en cours", "Installation", "Mémo"],
    status: ["Non commencé", "En cours", "Terminé"],
    assignee: ["Jérémy", "Sophie", "Thomas"],
    due: ["Cette semaine", "Ce mois", "Ce trimestre"]
  };

  // Filtrage des tâches
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.type || task.tag === filters.type;
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesAssignee = !filters.assignee || task.assignee.name === filters.assignee;
      
      return matchesSearch && matchesType && matchesStatus && matchesAssignee;
    });
  }, [tasks, searchTerm, filters]);

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200">
      {/* Header de la carte */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-neutral-600" />
            <h2 className="text-lg font-bold text-neutral-900">
              Liste des tâches et mémo ({filteredTasks.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Segmented control */}
            <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-1">
              <button
                onClick={() => setViewMode("Tableau")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === "Tableau"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Tableau
              </button>
              <button
                onClick={() => setViewMode("Grille")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === "Grille"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Grille
              </button>
            </div>

            {/* Bouton ajouter */}
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-medium transition-colors">
              <Plus className="size-4" />
              Ajouter une mémo
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="p-6 border-b border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher client/projet"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1"
          >
            <option value="">Tâches & mémo</option>
            {filterOptions.type.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1"
          >
            <option value="">Statut</option>
            {filterOptions.status.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.assignee}
            onChange={(e) => updateFilter('assignee', e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1"
          >
            <option value="">Agenceur.s</option>
            {filterOptions.assignee.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={filters.due}
            onChange={(e) => updateFilter('due', e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1"
          >
            <option value="">Échéance</option>
            {filterOptions.due.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1"
          >
            <option value="">Autre filtre</option>
          </select>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="p-6">
        {viewMode === "Tableau" ? (
          <div className="space-y-3" role="list" aria-label="Liste des tâches">
            {filteredTasks.map((task) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                onTaskUpdate={handleTaskUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            Mode Grille - En cours de développement
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            Aucune tâche trouvée pour les filtres sélectionnés
          </div>
        )}
      </div>
    </div>
  );
};

export default function TasksPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar 
        currentPage="tasks" 
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar />
        <div className="w-full py-6 px-4 lg:px-6">
          <TasksCard />
        </div>
      </main>
    </div>
  );
}