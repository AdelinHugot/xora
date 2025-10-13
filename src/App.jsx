import React, { useMemo, useState, useEffect, useRef } from "react";
import { Menu, Search, ChevronDown, Bell, Settings, MoreVertical, ArrowUpRight } from "lucide-react";
import Sidebar from "./components/Sidebar";
import DirectoryPage from "./pages/DirectoryPage";
import TasksPage from "./pages/TasksPage";
import ProjectTrackingPage from "./pages/ProjectTrackingPage";
import AgendaPage from "./pages/AgendaPage";
import ArticlesPage from "./pages/ArticlesPage";
import TasksMemoPage from "./pages/TasksMemoPage";
import SettingsPage from "./pages/SettingsPage";
import TeamMemberPage from "./pages/TeamMemberPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ContactDetailPage from "./pages/ContactDetailPage";
import LoginPage from "./pages/LoginPage";

// Mock data - KPI blanches (cartes horizontales)
const whiteKpis = [
  { 
    id: "ca-genere", 
    label: "CA Généré", 
    value: "53.456€", 
    goal: "110.000€", 
    percent: 65,
    icon: "€"
  },
  { 
    id: "marge-generee", 
    label: "Marge générée", 
    value: "12.326€", 
    goal: "15.000€", 
    percent: 73,
    icon: "📈"
  },
  { 
    id: "taux-marge", 
    label: "Taux de marge", 
    value: "23,4%", 
    goal: "35%", 
    percent: 68,
    icon: "%"
  },
  { 
    id: "taux-transformation", 
    label: "Taux de transformation", 
    value: "32,2%", 
    goal: "33%", 
    percent: 96,
    icon: "🎯"
  },
];

// Mock data - KPI colorés (cartes pastel)
const coloredKpis = [
  { id: "leads", label: "Leads", value: 8, color: "from-indigo-200 to-indigo-100" },
  { id: "studies", label: "Études en cours", value: 8, color: "from-fuchsia-200 to-pink-100" },
  { id: "order", label: "Commande client", value: 8, color: "from-sky-200 to-sky-100" },
  { id: "tech", label: "Dossier tech & install", value: 10, color: "from-cyan-200 to-teal-100" },
  { id: "sav", label: "SAV", value: 7, color: "from-rose-200 to-orange-100" },
];

// Mock data - Tâches (exactement 7 selon la maquette)
const tasks = [
  {
    id: 1,
    title: "Livraison Cuisine – Coline FARGET",
    due: "Aujourd'hui",
    tag: "Dossier tech & install",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
  {
    id: 2,
    title: "Appeler Laurent",
    due: "1 jour restant",
    tag: "Mémo",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
  {
    id: 3,
    title: "Installation client – Nicolas DUMONT",
    due: "3 jours restants",
    tag: "Commande client",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
  {
    id: 4,
    title: "Rendez-vous avec Romain pour Mme Dubois",
    due: "1 jour restant",
    tag: "Mémo",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
  {
    id: 5,
    title: "Rendez-vous avec Romain pour Mme Dubois",
    due: "1 jour restant",
    tag: "Mémo",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
  {
    id: 6,
    title: "Cuisine Salon – Pierre HERME",
    due: "1 jour restant",
    tag: "Études en cours",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
  {
    id: 7,
    title: "Cuisine Salon – Pierre HERME",
    due: "Aujourd'hui",
    tag: "Dossier tech & install",
    stages: ["Non commencé", "En cours", "Terminé"],
    progress: 45,
  },
];

const days = [
  { key: "mon", label: "Lundi 12" },
  { key: "tue", label: "Mardi 13" },
  { key: "wed", label: "Mercredi 14" },
  { key: "thu", label: "Jeudi 15" },
  { key: "fri", label: "Vendredi 16" },
];

const agendaItems = [
  { id: "a1", day: "mon", start: "09:00", end: "09:30", title: "Rendez-vous client" },
  { id: "a2", day: "tue", start: "09:00", end: "09:30", title: "Rendez-vous client" },
  { id: "a3", day: "wed", start: "09:00", end: "09:30", title: "Rendez-vous client" },
  { id: "a4", day: "thu", start: "09:00", end: "09:30", title: "Rendez-vous client" },
  { id: "a5", day: "fri", start: "09:00", end: "09:30", title: "Rendez-vous client" },
];

// Small UI helpers (unused but kept for potential future use)
const Badge = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">{children}</span>
);

const Tag = ({ children }) => (
  <span className="px-2 py-0.5 text-xs rounded-md bg-neutral-800/90 text-white">{children}</span>
);

const Progress = ({ value }) => (
  <div className="w-full h-2 rounded-full bg-neutral-200">
    <div
      className="h-2 rounded-full bg-neutral-800"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      role="progressbar"
    />
  </div>
);

const PillIcon = ({ Icon }) => (
  <div className="size-8 rounded-xl bg-white/70 border border-white shadow-sm grid place-items-center">
    <Icon className="size-4 text-neutral-700" />
  </div>
);

// Layout pieces

function Topbar({ onSettingsClick = () => {} }) {
  return (
    <header className="h-16 border-b border-neutral-200 bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Menu" title="Menu">
          <Menu className="size-4" />
        </button>
        <h1 className="text-xl font-semibold text-neutral-900 my-2">Tableau de bord</h1>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Notifications" title="Notifications">
          <Bell className="size-4" />
        </button>
        <button
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
          aria-label="Paramètres"
          title="Paramètres"
          onClick={onSettingsClick}
        >
          <Settings className="size-4" />
        </button>
        <div className="flex items-center gap-2 pl-3 ml-2 border-l border-neutral-200">
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
}

function Searchbar() {
  return (
    <div className="p-4 lg:p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white/70 placeholder:text-neutral-400"
          placeholder="Rechercher un client"
          type="search"
        />
      </div>
    </div>
  );
}

// Composant pour les cartes KPI blanches horizontales
function KpiStrip() {
  return (
    <div className="px-4 lg:px-6 mb-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
        {/* 4 cartes KPI horizontales */}
        <div className="grid gap-4 md:grid-cols-4">
          {whiteKpis.map((kpi) => (
            <div key={kpi.id} className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-start gap-3">
              {/* Médaillon icône */}
              <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-medium">
                {kpi.icon}
              </div>
              
              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900 mb-1">{kpi.label}</div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-lg font-semibold text-neutral-900">{kpi.value}</span>
                  <span className="text-sm text-neutral-400">/ {kpi.goal}</span>
                </div>
                
                {/* Barre de progression + pourcentage */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-violet-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-600 transition-all duration-300"
                      style={{ width: `${kpi.percent}%` }}
                      role="progressbar"
                      aria-valuenow={kpi.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-xs text-neutral-500">{kpi.percent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour les cartes KPI colorées (colonne gauche)
function KpiStack() {
  return (
    <div className="space-y-4">
      {coloredKpis.map((kpi) => (
        <div key={kpi.id} className={`relative rounded-2xl border border-neutral-200 bg-gradient-to-br ${kpi.color} p-4`}> 
          <div className="flex items-start justify-between">
            <div className="text-neutral-700">
              <div className="text-sm font-medium mb-1">{kpi.label}</div>
              <div className="text-3xl font-black">{kpi.value}</div>
            </div>
            <button 
              onClick={() => console.log(`Ouvrir ${kpi.label}`)}
              className="p-2 rounded-xl border border-neutral-200 bg-white/70 hover:bg-white transition-colors"
              aria-label={`Ouvrir ${kpi.label}`}
              title={`Ouvrir ${kpi.label}`}
            >
              <ArrowUpRight className="size-4 text-neutral-700" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Fonction pour obtenir les couleurs des tags
function getTagColors(tag) {
  switch (tag) {
    case "Dossier tech & install":
      return "bg-sky-100 text-sky-700";
    case "Commande client":
      return "bg-blue-100 text-blue-700";
    case "Études en cours":
      return "bg-pink-100 text-pink-700";
    case "Mémo":
      return "bg-neutral-900 text-white";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function TaskRow({ task, index }) {
  // Déterminer si cette tâche doit montrer les statuts (tâches 2, 4, 5 selon la spécification)
  const showStatuses = [2, 4, 5].includes(task.id);
  
  return (
    <div className="p-4 sm:p-5 border border-neutral-200 rounded-2xl bg-white">
      <div className="flex items-start gap-3">
        <span className="size-7 grid place-items-center rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-600">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="font-medium text-neutral-900 truncate">{task.title}</div>
            {task.tag && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColors(task.tag)}`}>
                {task.tag}
              </span>
            )}
          </div>
          <div className="text-xs text-neutral-500 mt-1 mb-3">{task.due}</div>
          
          {/* Barre de progression + % + bouton kebab */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-neutral-800"
                  style={{ width: `${Math.min(100, Math.max(0, task.progress))}%` }}
                  role="progressbar"
                  aria-valuenow={task.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
            <div className="text-sm text-neutral-500">{task.progress}%</div>
            <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Options">
              <MoreVertical className="size-4" />
            </button>
          </div>
          
          {/* Pills de statut (seulement pour certaines tâches) */}
          {showStatuses && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {task.stages?.map((status, i) => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                    i === 1 ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                  aria-pressed={i === 1}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TasksPanel({ height }) {
  return (
    <div 
      className="rounded-2xl border border-neutral-200 bg-white/70 p-4 pt-5 flex flex-col" 
      style={height ? { height: `535px` } : {}}
    >
      {/* Header avec bouton externe en haut à droite */}
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Priorité des tâches</h2>
          <div className="text-sm text-neutral-500">12 mars 2025</div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => console.log('Ajouter tâche')}
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
            aria-label="Ajouter une tâche ou une mémo"
          >
            + Ajouter une tâche ou une mémo
          </button>
          <button 
            onClick={() => console.log('Ouvrir dans nouvelle vue')}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
            aria-label="Ouvrir dans une nouvelle vue"
            title="Ouvrir dans une nouvelle vue"
          >
            <ArrowUpRight className="size-4 text-neutral-600" />
          </button>
        </div>
      </div>
      
      {/* Corps avec scroll interne */}
      <div className="mt-4 flex-1 overflow-y-auto grid gap-3 pr-1 min-h-0">
        {tasks.map((t, i) => (
          <TaskRow key={t.id} task={t} index={i} />
        ))}
      </div>
    </div>
  );
}

function Agenda() {
  const [week, setWeek] = useState("12/05 - 17/05");
  const itemsByDay = useMemo(() => {
    const map = Object.fromEntries(days.map((d) => [d.key, []]));
    for (const it of agendaItems) map[it.day].push(it);
    return map;
  }, []);

  return (
    <section className="px-4 lg:px-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-900">Agenda</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-xl border border-neutral-200 bg-white/70 text-sm font-medium" value={week} onChange={(e) => setWeek(e.target.value)}>
            <option>12/05 - 17/05</option>
            <option>19/05 - 24/05</option>
          </select>
          <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Options agenda">
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {days.map((d) => (
          <div key={d.key} className="rounded-2xl border border-neutral-200 bg-white/70 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 text-sm font-semibold text-neutral-700">{d.label}</div>
            <div className="p-3 space-y-2">
              {itemsByDay[d.key].map((it) => (
                <div key={it.id} className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 hover:bg-neutral-50 transition-colors">
                  <div className="text-xs text-neutral-500 font-medium">{it.start} - {it.end}</div>
                  <div className="text-sm font-semibold text-neutral-900 mt-1">{it.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


// Grille principale avec hauteurs synchronisées
function MainPanels() {
  const kpiRef = useRef(null);
  const [kpiHeight, setKpiHeight] = useState(0);
  const [isWide, setIsWide] = useState(false);

  // Détection responsive breakpoint 1280px
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => setIsWide(mq.matches);
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  // ResizeObserver pour synchroniser les hauteurs (uniquement ≥1280px)
  useEffect(() => {
    if (!kpiRef.current || !isWide) return;
    
    const updateHeight = () => {
      const rect = kpiRef.current.getBoundingClientRect();
      setKpiHeight(rect.height);
    };

    const ro = new ResizeObserver(updateHeight);
    ro.observe(kpiRef.current);
    
    // Calcul initial
    updateHeight();
    
    return () => ro.disconnect();
  }, [isWide]);

  return (
    <section className="px-4 lg:px-6">
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        {/* Colonne gauche - KPI colorés */}
        <div ref={kpiRef}>
          <KpiStack />
        </div>
        
        {/* Colonne droite - Tâches avec hauteur synchronisée */}
        <TasksPanel height={isWide && kpiHeight > 0 ? kpiHeight : null} />
      </div>
    </section>
  );
}

function DashboardPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar 
        currentPage="dashboard" 
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar onSettingsClick={() => onNavigate("settings-connection")} />
        <div className="max-w-[1400px] mx-auto">
          <Searchbar />
          <KpiStrip />
          <MainPanels />
          <Agenda />
          <footer className="h-16" />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigateToRoute = (route) => {
    setCurrentRoute(route);
    window.location.hash = route === "dashboard" ? "" : route;
  };

  const handleNavigation = (route) => {
    navigateToRoute(route);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Simple routing logic (you can replace with React Router later)
  const renderSettingsPage = (initialTab = "company") => (
    <SettingsPage
      onNavigate={handleNavigation}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={handleToggleSidebar}
      initialTab={initialTab}
      onTabNavigate={(tabId) => {
        const route = `settings-${tabId}`;
        if (route !== currentRoute) {
          navigateToRoute(route);
        }
      }}
    />
  );

  const renderPage = () => {
    switch (currentRoute) {
      case "directory-all":
      case "directory-contacts":
      case "directory-clients":
      case "directory-suppliers":
      case "directory-artisans":
      case "directory-institutional":
      case "directory-prescriber":
      case "directory-subcontractor":
        return (
          <DirectoryPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            filter={currentRoute.replace("directory-", "")}
          />
        );
      case "tasks":
        return (
          <TasksPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "project-tracking":
        return (
          <ProjectTrackingPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "agenda":
        return (
          <AgendaPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "articles":
        return (
          <ArticlesPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "tasks-memo":
        return (
          <TasksMemoPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "settings":
        return renderSettingsPage("company");
      case "settings-team":
        return renderSettingsPage("team");
      case "settings-company":
        return renderSettingsPage("company");
      case "settings-role":
        return renderSettingsPage("role");
      case "settings-connection":
        return renderSettingsPage("connection");
      default:
        // Check if it's a team member route (e.g., team-member-123)
        if (currentRoute.startsWith("team-member-")) {
          const memberId = currentRoute.replace("team-member-", "");
          return (
            <TeamMemberPage
              onNavigate={handleNavigation}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
              memberId={memberId}
            />
          );
        }
        // Check if it's a project detail route (e.g., project-detail-123)
        if (currentRoute.startsWith("project-detail-")) {
          const projectId = currentRoute.replace("project-detail-", "");
          return (
            <ProjectDetailPage
              onNavigate={handleNavigation}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
              projectId={projectId}
            />
          );
        }
        // Check if it's a contact detail route (e.g., contact-123)
        if (currentRoute.startsWith("contact-")) {
          const contactId = currentRoute.replace("contact-", "");
          return (
            <ContactDetailPage
              onNavigate={handleNavigation}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
              contactId={contactId}
            />
          );
        }
        return (
          <DashboardPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
    }
  };

  // Initialize route from URL hash
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== currentRoute) {
      setCurrentRoute(hash || "dashboard");
    }
  }, [currentRoute]);

  // Si l'utilisateur n'est pas connecté, afficher la page de login
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return renderPage();
}
