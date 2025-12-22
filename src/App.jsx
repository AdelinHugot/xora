import React, { useMemo, useState, useEffect, useRef } from "react";
import { Menu, Search, ChevronDown, Bell, Settings, MoreVertical, ArrowUpRight, AlertCircle, Eye, Pencil, Trash2 } from "lucide-react";
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
import ArticleDetailPage from "./pages/ArticleDetailPage";
import KPIPage from "./pages/KPIPage";
import OurCompanyPage from "./pages/OurCompanyPage";
import AfterSalesPage from "./pages/AfterSalesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { GlobalAuthProvider, useGlobalAuth } from "./contexts/GlobalAuthContext";
import { useKPIs } from "./hooks/useKPIs";
import { usePipelineKPIs } from "./hooks/usePipelineKPIs";
import { useTaches } from "./hooks/useTaches";
import { useContacts } from "./hooks/useContacts";
import { useTeamMembers } from "./hooks/useTeamMembers";
import { useAgendaWeek } from "./hooks/useAgendaWeek";
import CreateTaskOrMemoModal from "./components/CreateTaskOrMemoModal";
import KpiCaGenereSvg from "../SVG Menu/KPI - CA Généré.svg";
import KpiMargeGenereSvg from "../SVG Menu/KPI - Marge générée.svg";
import KpiTauxMargeSvg from "../SVG Menu/KPI - Taux de marge.svg";
import KpiTauxTransformationSvg from "../SVG Menu/KPI - Taux de transformation.svg";
import AttentionSvg from "../SVG Menu/Attention.svg";
import MenuSvg from "../SVG Menu/3 Points.svg";
import { supabase } from "./lib/supabase";

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

function Topbar({ onSettingsClick = () => { } }) {
  // Use global auth context instead of making independent API calls
  const { userProfile } = useGlobalAuth();
  const [userName, setUserName] = useState("Chargement...");
  const [userRole, setUserRole] = useState("Utilisateur");
  const [userAvatar, setUserAvatar] = useState("https://i.pravatar.cc/40?img=12");

  // Update display when profile loads from context
  useEffect(() => {
    if (userProfile) {
      const prenom = userProfile.prenom ? userProfile.prenom.charAt(0).toUpperCase() + userProfile.prenom.slice(1).toLowerCase() : '';
      const nom = userProfile.nom ? userProfile.nom.charAt(0).toUpperCase() + userProfile.nom.slice(1).toLowerCase() : '';
      const fullName = `${prenom} ${nom}`.trim();
      setUserName(fullName || "Utilisateur");
      setUserRole("Utilisateur");
      setUserAvatar(`https://i.pravatar.cc/40?u=${userProfile.id}`);
    }
  }, [userProfile]);

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    onSettingsClick("our-company");
  };

  return (
    <header className="h-16 border-b border-neutral-200 bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-neutral-300 rounded text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 11.0625C2.25 10.7518 2.50184 10.5 2.8125 10.5H9.1875C9.49815 10.5 9.75 10.7518 9.75 11.0625V15.1875C9.75 15.4982 9.49815 15.75 9.1875 15.75H2.8125C2.50184 15.75 2.25 15.4982 2.25 15.1875V11.0625Z" fill="currentColor" />
            <path d="M2.25 2.8125C2.25 2.50184 2.50184 2.25 2.8125 2.25H15.1875C15.4982 2.25 15.75 2.50184 15.75 2.8125V6.9375C15.75 7.24816 15.4982 7.5 15.1875 7.5H2.8125C2.50184 7.5 2.25 7.24816 2.25 6.9375V2.8125Z" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900 my-2">Tableau de bord</h1>
        <button className="lg:hidden p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Menu" title="Menu">
          <Menu className="size-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Notifications" title="Notifications">
          <Bell className="size-4" />
        </button>
        <button
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
          aria-label="Paramètres"
          title="Paramètres"
          onClick={handleSettingsClick}
        >
          <Settings className="size-4" />
        </button>
        <div className="flex items-center gap-2 pl-3 ml-2 border-l border-neutral-200">
          <img src={userAvatar} alt="avatar" className="size-8 rounded-full" />
          <div className="text-sm leading-tight">
            <div className="font-semibold">{userName}</div>
            <div className="text-neutral-500">{userRole}</div>
          </div>
          <ChevronDown className="size-4 text-neutral-500" />
        </div>
      </div>
    </header>
  );
}

// Internal Searchbar component removed. Importing from components/Searchbar.jsx
import Searchbar from "./components/Searchbar";

// Composant pour les cartes KPI blanches horizontales
function KpiStrip() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { kpis, loading, error } = useKPIs();

  // Map des icônes pour chaque KPI
  const kpiIcons = {
    'ca-genere': KpiCaGenereSvg,
    'marge-generee': KpiMargeGenereSvg,
    'taux-marge': KpiTauxMargeSvg,
    'taux-transformation': KpiTauxTransformationSvg
  };

  return (
    <div className="px-4 lg:px-6 mb-6">
      <div className="border border-neutral-200 rounded-2xl overflow-hidden" style={{ backgroundColor: "#F3F3F3" }}>
        {/* En-tête avec titre et bouton collapse/expand */}
        <div className="bg-white px-4 md:px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Liste des KPI</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label={isExpanded ? "Replier les KPIs" : "Déplier les KPIs"}
            title={isExpanded ? "Replier les KPIs" : "Déplier les KPIs"}
          >
            <ChevronDown
              className={`size-5 text-neutral-600 transition-transform duration-300 ${isExpanded ? "rotate-0" : "rotate-180"
                }`}
            />
          </button>
        </div>

        {/* Contenu des KPIs avec animation collapse/expand */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? "1000px" : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="p-4 md:p-5">
            {/* État de chargement */}
            {loading && (
              <div className="text-center py-8 text-neutral-500">Chargement des KPIs...</div>
            )}

            {/* État d'erreur */}
            {error && (
              <div className="text-center py-8 text-red-500">Erreur: {error}</div>
            )}

            {/* 4 cartes KPI horizontales */}
            {kpis && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-start gap-3">
                    {/* Médaillon icône - Carré avec radius 10px */}
                    <div className="size-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#A886D7" }}>
                      <img src={kpiIcons[kpi.id]} alt={kpi.label} className="size-5" />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les cartes KPI colorées (colonne gauche)
function KpiStack({ onNavigate }) {
  const { kpis, loading, error } = usePipelineKPIs();

  const handleKpiNavigation = (kpiId) => {
    if (kpiId === 'leads') {
      onNavigate('directory-leads');
    } else if (kpiId === 'studies') {
      onNavigate('project-tracking');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-neutral-500">Chargement des KPIs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {kpis && kpis.map((kpi) => (
        <div key={kpi.id} className="relative rounded-2xl border border-neutral-200 p-4" style={{ backgroundColor: kpi.color }}>
          <div className="flex items-start justify-between">
            <div className="text-neutral-700">
              <div className="text-sm font-medium mb-1">{kpi.label}</div>
              <div className="text-3xl font-black">{kpi.value}</div>
            </div>
            <button
              onClick={() => handleKpiNavigation(kpi.id)}
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

// Fonction pour obtenir les couleurs des tags/badges
function getTagColors(tag) {
  const tagColorMap = {
    "Dossier technique": { bg: "#A4E6FE", text: "#1A8AB3", border: "#0EA5E9" },
    "Dossier tech & install": { bg: "#A4E6FE", text: "#1A8AB3", border: "#0EA5E9" },
    "Études en cours": { bg: "#EBC5F2", text: "#C970AB", border: "#EBC5F2" },
    "Commande client": { bg: "#A9C9F9", text: "#1E40AF", border: "#3B82F6" },
    "SAV": { bg: "#FFD0C1", text: "#92400E", border: "#EA580C" },
    "Leads": { bg: "#EEE8FD", text: "#6B21A8", border: "#A855F7" },
    "Appel": { bg: "#F8F9FA", text: "#504B4D", border: "#E5E5E5" },
    "Email": { bg: "#F8F9FA", text: "#504B4D", border: "#E5E5E5" },
    "Mémo": { bg: "#504B4D", text: "white", border: "#E9E9E9" },
  };

  return tagColorMap[tag] || { bg: "#F3F4F6", text: "#1F2937", border: "#D1D5DB" };
}

function TaskRow({ task, index, onStageChange, onDelete, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(task.currentStage);
  const colors = getTagColors(task.tag);

  // Determine if task has progress bar (not Appel, Email, Mémo)
  const hasProgressBar = !["Appel", "Email", "Mémo"].includes(task.tag);

  const handleStageChange = async (stageIndex) => {
    setCurrentStage(stageIndex);
    if (onStageChange) {
      try {
        await onStageChange(task.id, stageIndex);
      } catch (err) {
        console.error('Erreur lors du changement de stage:', err);
        // Revert on error
        setCurrentStage(task.currentStage);
      }
    }
  };

  return (
    <>
      {/* Ligne principale */}
      <div className="px-4 bg-white flex items-center gap-3 w-full" style={{ height: "80px", borderBottom: "1px solid #E5E5E5", borderBottomWidth: "0.5px", marginBottom: "0.5px", marginTop: "0.5px", backgroundImage: "linear-gradient(to right, transparent 5%, #E5E5E5 5%, #E5E5E5 95%, transparent 95%)", backgroundSize: "100% 0.5px", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }}>
        {/* 1. Numéro priorité - Fond gris */}
        <div className="size-8 rounded-lg text-neutral-900 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: "#F3F3F3" }}>
          {index + 1}
        </div>

        {/* 2. Gauche: Client - Projet + Pastille + Date (flex-1, ~50%) */}
        <div className="flex-1 min-w-0 flex flex-col gap-0">
          {/* Row: Client - Projet + Pastille */}
          <div className="flex items-center gap-2">
            {/* Texte Client - Projet */}
            {/* Texte Titre de la tâche */}
            <div className="text-sm font-bold text-neutral-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {task.titre}
            </div>

            {/* Pastille - Collé à droite du projet */}
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {task.tag}
            </div>
          </div>

          {/* Client et Date en dessous */}
          <div className="text-xs text-neutral-500 leading-tight truncate">
            {task.clientName && task.clientName !== 'Non spécifié' && (
              <span className="font-medium text-neutral-700 mr-2">{task.clientName} •</span>
            )}
            <span>Date limite : {task.dueDate}</span>
          </div>
        </div>

        {/* 3. Droite: Barre de progression OU Statuts (flex-1, ~50%) */}
        <div className="flex-1 flex items-center gap-2">
          {/* Barre de progression OU Pastilles statuts */}
          {hasProgressBar ? (
            <>
              {/* Barre progression + % */}
              <div className="flex items-center gap-2 flex-1">
                <div className="h-1.5 flex-1 rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${task.progress}%`,
                      backgroundColor: colors.border,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-6 text-right flex-shrink-0" style={{ color: colors.text }}>
                  {task.progress}%
                </span>
              </div>

              {/* Bouton Attention - Uniquement pour tâches avec barre */}
              <button
                className="p-2 rounded-lg flex-shrink-0 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#F3F3F3" }}
                aria-label="Alerte"
                title={task.isLate ? `${task.daysLate} jour(s) de retard` : "Pas d'alerte"}
              >
                <img src={AttentionSvg} alt="Attention" className="size-5" />
              </button>
            </>
          ) : (
            /* Pastilles statuts pour Appel/Email/Mémo */
            <div className="flex-1 flex items-center gap-1 rounded-full px-2 py-1.5" style={{ backgroundColor: "#F8F9FA", border: "1px solid #E4E4E7" }}>
              {task.stages.map((stage, i) => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(i)}
                  className="flex-1 px-3 py-1 rounded-full text-xs font-medium transition-all text-center"
                  style={{
                    backgroundColor: i === currentStage ? "#FFFFFF" : "transparent",
                    color: i === currentStage ? "#000000" : "#6B7280",
                    border: i === currentStage ? "1px solid #E4E4E7" : "none",
                  }}
                >
                  {stage}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Menu 3 Points - TOUT À DROITE pour TOUTES les cartes */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg flex-shrink-0 hover:opacity-80 transition-opacity relative"
          style={{ backgroundColor: "#F3F3F3" }}
          aria-label="Options"
        >
          <img src={MenuSvg} alt="Menu" className="size-5" />

          {menuOpen && (
            <div className="absolute top-full right-0 z-30 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg min-w-[140px]">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate && onNavigate('tasks-memo');
                }}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-neutral-50 transition-colors"
              >
                <Eye className="size-4" />
                Voir
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate && onNavigate('tasks-memo');
                }}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-neutral-50 transition-colors"
              >
                <Pencil className="size-4" />
                Modifier
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onDelete) onDelete(task.id);
                }}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-neutral-50 transition-colors text-red-600"
              >
                <Trash2 className="size-4" />
                Supprimer
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Séparateur gris à 90% largeur - Intégré directement */}
    </>
  );
}

function TasksPanel({ height, onNavigate }) {
  // Limiter à 50 tâches pour le tableau de bord pour améliorer les performances
  const { taches, loading, error, updateTacheStage, deleteTache, refetch } = useTaches(50);
  const { teamMembers } = useTeamMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format date in French
  const formatDateFrench = () => {
    const now = new Date();
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Handle task creation success
  const handleTaskCreated = () => {
    setIsModalOpen(false);
    if (refetch) {
      refetch();
    }
  };

  return (
    <div
      className="rounded-2xl border border-neutral-200 bg-white/70 p-5 flex flex-col overflow-hidden"
      style={height ? { height: `${height}px`, maxHeight: `${height}px` } : {}}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-shrink-0 gap-4">
        {/* Gauche: Titre et Date */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Priorité des tâches & mémos</h2>
          <div className="text-xs text-neutral-500 mt-1">{formatDateFrench()}</div>
        </div>

        {/* Droite: Boutons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Bouton Ajouter tâche */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
            style={{ backgroundColor: "#F3F3F3", color: "#374151" }}
            aria-label="Créer la tâche manuelle"
            title="Créer la tâche manuelle"
          >
            + Créer la tâche manuelle
          </button>

          {/* Bouton Flèche vers haut-droit */}
          <button
            onClick={() => onNavigate && onNavigate('tasks-memo')}
            className="size-10 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ backgroundColor: "#F3F3F3" }}
            aria-label="Ouvrir la page Tâches et mémo"
            title="Ouvrir la page Tâches et mémo"
          >
            <ArrowUpRight className="size-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="flex-1 flex items-center justify-center text-neutral-500">
          Chargement des tâches...
        </div>
      )}

      {/* État d'erreur */}
      {error && (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Erreur: {error}
        </div>
      )}

      {/* Tâches avec scroll interne - scrollbar cachée */}
      {!loading && !error && (
        <div className="flex-1 overflow-y-auto grid gap-3 min-h-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {taches.length === 0 ? (
            <div className="flex items-center justify-center text-neutral-400 py-8">
              Aucune tâche pour le moment
            </div>
          ) : (
            taches.map((t, i) => (
              <TaskRow
                key={t.id}
                task={t}
                index={i}
                onStageChange={updateTacheStage}
                onDelete={deleteTache}
                onNavigate={onNavigate}
              />
            ))
          )}
        </div>
      )}

      {/* Task/Memo Creation Modal */}
      <CreateTaskOrMemoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskCreated}
        employees={teamMembers}
        commercials={teamMembers}
      />
    </div>
  );
}

function Agenda() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { days, appointmentsByDay, loading, error, weekDates } = useAgendaWeek(weekOffset);

  // Formater les dates de la semaine pour affichage
  const formatWeekLabel = () => {
    if (!weekDates) return "";
    const startFormat = new Date(weekDates.weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
    const endFormat = new Date(weekDates.weekEnd).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
    return `${startFormat} - ${endFormat}`;
  };

  return (
    <section className="px-4 lg:px-6 mt-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-neutral-900">Agenda</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-2 rounded-xl border border-neutral-200 bg-white/70 text-sm font-medium text-neutral-600">
            {formatWeekLabel()}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
            aria-label="Semaine précédente"
            title="Semaine précédente"
          >
            <ChevronDown className="size-4 rotate-90" />
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
            aria-label="Semaine suivante"
            title="Semaine suivante"
          >
            <ChevronDown className="size-4 -rotate-90" />
          </button>
        </div>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="text-center py-8 text-neutral-500">Chargement de l'agenda...</div>
      )}

      {/* État d'erreur */}
      {error && (
        <div className="text-center py-8 text-red-500">Erreur: {error}</div>
      )}

      {/* Grille de l'agenda - 6 colonnes, 100% largeur, responsive */}
      {!loading && !error && (
        <div className="w-full rounded-2xl border border-neutral-200 bg-white/70 overflow-hidden">
          <div className="flex" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {days.map((d, idx) => (
              <div
                key={d.key}
                className={`${idx > 0 ? 'border-l border-neutral-200' : ''
                  }`}
              >
                {/* En-tête du jour */}
                <div className="px-4 py-3 border-b border-neutral-200 text-sm font-semibold text-neutral-700 bg-neutral-50 sticky top-0">
                  {d.label}
                </div>

                {/* Rendez-vous du jour */}
                <div className="p-3 space-y-2 min-h-48">
                  {appointmentsByDay[d.key] && appointmentsByDay[d.key].length > 0 ? (
                    appointmentsByDay[d.key].map((apt) => (
                      <div
                        key={apt.id}
                        className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2 hover:bg-neutral-50 transition-colors cursor-pointer text-xs"
                        title={`${apt.title} - ${apt.contactName}`}
                      >
                        <div className="font-medium text-neutral-700">
                          {apt.start}
                        </div>
                        <div className="font-semibold text-neutral-900 truncate mt-0.5">
                          {apt.title}
                        </div>
                        {apt.contactName && (
                          <div className="text-neutral-500 truncate mt-0.5">
                            {apt.contactName}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-neutral-400 text-center py-8">
                      -
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


// Grille principale avec hauteurs synchronisées
function MainPanels({ onNavigate }) {
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
      if (kpiRef.current) {
        // Mesurer la hauteur exacte du conteneur KPI
        const allChildren = kpiRef.current.querySelectorAll('[class*="rounded-2xl"]');
        let totalHeight = 0;

        allChildren.forEach((child) => {
          const rect = child.getBoundingClientRect();
          totalHeight += rect.height;
        });

        // Ajouter les gaps (space-y-4 = 1rem = 16px par gap, il y a n-1 gaps)
        if (allChildren.length > 1) {
          totalHeight += (allChildren.length - 1) * 16; // 4 * 4px = 16px
        }

        // Si on ne trouve pas d'enfants, utiliser scrollHeight
        if (totalHeight === 0) {
          totalHeight = kpiRef.current.scrollHeight;
        }

        setKpiHeight(totalHeight);
      }
    };

    // Délai court pour permettre au DOM de se stabiliser
    const timeoutId = setTimeout(updateHeight, 150);

    const ro = new ResizeObserver(updateHeight);
    ro.observe(kpiRef.current);

    // Calcul initial après stabilisation
    const initialTimeoutId = setTimeout(updateHeight, 300);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeoutId);
      ro.disconnect();
    };
  }, [isWide]);

  return (
    <section className="px-4 lg:px-6">
      <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] 2xl:grid-cols-[400px_1fr] gap-6">
        {/* Colonne gauche - KPI colorés */}
        <div ref={kpiRef}>
          <KpiStack onNavigate={onNavigate} />
        </div>

        {/* Colonne droite - Tâches avec hauteur synchronisée */}
        <TasksPanel height={isWide && kpiHeight > 0 ? kpiHeight : null} onNavigate={onNavigate} />
      </div>
    </section>
  );
}

function DashboardPage({ onNavigate, sidebarCollapsed, onToggleSidebar, onLogout }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  // Removed useContacts hook call since we use server-side search now

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="dashboard"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
        onLogout={onLogout}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar onSettingsClick={() => onNavigate("our-company")} />
        <div className="w-full">
          <Searchbar onNavigate={onNavigate} />
          <KpiStrip />
          <MainPanels onNavigate={onNavigate} />
          <Agenda />
          <footer className="h-16" />
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Use global context - auth state is managed by GlobalAuthProvider
  const { isAuthenticated, loading: isLoadingAuth } = useGlobalAuth();

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

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    // User is automatically logged in after signup via Supabase auth
  };

  const handleLogin = () => {
    // User is automatically logged in via Supabase auth
    // GlobalAuthContext will automatically update via auth listener
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase - GlobalAuthContext will automatically update via auth listener
      await supabase.auth.signOut();
      console.log('Utilisateur déconnecté avec succès');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
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
      case "directory-leads":
        return (
          <DirectoryPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            filter="all"
            statusFilter="Leads"
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
      case "kpi":
        return (
          <KPIPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "our-company":
        return (
          <OurCompanyPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "after-sales":
        return (
          <AfterSalesPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case "settings":
        return renderSettingsPage("company");
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
        // Check if it's an article detail route (e.g., article-123)
        if (currentRoute.startsWith("article-")) {
          const articleId = currentRoute.replace("article-", "");
          return (
            <ArticleDetailPage
              onNavigate={handleNavigation}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
              articleId={articleId}
            />
          );
        }
        return (
          <DashboardPage
            onNavigate={handleNavigation}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            onLogout={handleLogout}
          />
        );
    }
  };


  // Initialize route from URL hash and listen for changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentRoute(hash || "dashboard");
    };

    // Set initial route from current hash
    const hash = window.location.hash.slice(1);
    if (hash && hash !== currentRoute) {
      setCurrentRoute(hash || "dashboard");
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Si l'utilisateur n'est pas connecté, afficher la page de login ou signup
  // Afficher un écran de chargement pendant la vérification de la session
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mb-4"></div>
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <SignupPage
          onSignupSuccess={handleSignupSuccess}
          onBackToLogin={handleBackToLogin}
        />
      );
    }
    return <LoginPage onLogin={handleLogin} onShowSignup={handleShowSignup} />;
  }

  return renderPage();
}

// Wrapper component qui enveloppe l'app avec GlobalAuthProvider
export default function App() {
  return (
    <GlobalAuthProvider>
      <AppContent />
    </GlobalAuthProvider>
  );
}
