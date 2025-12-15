// filename: ProjectDetailPage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  Plus,
  Phone,
  Mail,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  X,
  Trash2,
  Check,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";
import CreateTaskOrMemoModal from "../components/CreateTaskOrMemoModal";
import ProjectDiscoveryTab from "../components/ProjectDiscoveryTab";
import ProjectArticlesTab from "../components/ProjectArticlesTab";
import ProjectCalendarTab from "../components/ProjectCalendarTab";
import { useProject } from "../hooks/useProject";
import { useTaches } from "../hooks/useTaches";
import { formatPhoneForDisplay } from "../utils/dataTransformers";

// Mock project data
const mockProjectData = {
  id: "proj_1",
  type: "Cuisiniste",
  createdAt: "01/01/2025",
  clientName: "Chloé Dubois",
  title: "Pose d'une cuisine",
  progress: 2,
  progressLabel: "Études à réaliser",
  phone: "06 76 54 32 42",
  email: "chloe.dubois@gmail.com"
};

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
        enabled ? "bg-neutral-900" : "bg-[#D3D9E5]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} shadow-[inset_0_1px_2px_rgba(15,23,42,0.1)]`}
    >
      <span
        className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform shadow-[0_2px_6px_rgba(15,23,42,0.15)] ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{enabled ? "Activé" : "Désactivé"}</span>
    </button>
  );
}

// Form Components
function FormSection({ title, children, action, documentCount }) {
  return (
    <section className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[#1F2027]">{title}</h3>
          {documentCount !== undefined && (
            <span className="px-3 py-1 rounded-full border border-[#E9E9E9] bg-white text-xs font-medium text-[#6B7280]">
              {documentCount} document{documentCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {action}
      </div>
      <div className="px-6 pb-6">
        <div className="rounded-lg border border-[#ECEEF5] bg-[#F8F9FC] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, children, span = 1, required = false }) {
  const spanClass = span === 2 ? "md:col-span-2" : span === 3 ? "md:col-span-3" : "";

  return (
    <div className={`${spanClass} space-y-2`}>
      <label className="block text-sm font-semibold text-[#2B2E38]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options, placeholder, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className='w-full appearance-none px-4 pr-10 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 disabled:bg-[#F4F5F9] disabled:text-[#8F96A9] shadow-[0_1px_2px_rgba(15,23,42,0.08)] bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E")] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-18px)_center]'
    >
      <option value="">{placeholder || "Sélectionner"}</option>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 disabled:bg-[#F4F5F9] disabled:text-[#8F96A9] shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
    />
  );
}

function DateInput({ value, onChange, disabled = false }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 disabled:bg-[#F4F5F9] disabled:text-[#8F96A9] shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
    />
  );
}

function ToggleField({ label, enabled, onChange }) {
  const hasLabel = Boolean(label);
  return (
    <div
      className={`flex items-center ${
        hasLabel ? "justify-between" : "justify-center"
      } bg-white rounded-lg border border-[#E1E4ED] px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]`}
    >
      {hasLabel && <span className="text-sm font-semibold text-[#1F2027]">{label}</span>}
      <div className="flex items-center gap-3 text-sm font-medium">
        <span className="text-[#8F96A9]">Non</span>
        <ToggleSwitch enabled={enabled} onChange={onChange} />
        <span className="text-[#1F2027]">Oui</span>
      </div>
    </div>
  );
}

// Project Header Component
function ProjectHeader({ project, onBack, onEdit, onSchedule, onAddTask, onLost }) {
  const formattedProgress = project.progress.toString().padStart(2, "0");

  return (
    <div className="bg-white border-b border-[#ECEEF5]">
      <div className="w-full px-4 lg:px-6 py-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#7E8189] hover:text-[#171717] mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          <span>Retour à la liste</span>
        </button>

        {/* Project info in 3 blocks on 2 lines */}
        <div className="grid grid-cols-3 gap-8">
          {/* Bloc 1: Project type and title */}
          <div className="space-y-2">
            {/* Line 1: Type + Date */}
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span className="font-medium">{project.type}</span>
              <span>•</span>
              <span>Créé le {project.createdAt}</span>
            </div>
            {/* Line 2: Title + Progress + Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-[#1F2937]">{project.title}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#F1E9FF] bg-[#F6F0FF] text-xs font-semibold text-[#5C37D1]">
                <span>{formattedProgress}%</span>
                <span>•</span>
                <span>{project.progressLabel}</span>
              </span>
            </div>
          </div>

          {/* Bloc 2: Client info */}
          <div className="space-y-2">
            {/* Line 1: Client name */}
            <div className="text-xl font-bold text-[#111827]">
              {project.clientName}
            </div>
            {/* Line 2: Contact info */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white">
                <Phone className="size-3.5 text-[#6B7280]" />
                <span className="text-sm text-[#374151]">{formatPhoneForDisplay(project.phone)}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white">
                <Mail className="size-3.5 text-[#6B7280]" />
                <span className="text-sm text-[#374151]">{project.email}</span>
              </div>
            </div>
          </div>

          {/* Bloc 3: Action buttons */}
          <div className="space-y-2">
            {/* Line 1: Edit + Schedule */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <Edit3 className="size-4" />
                Modifier le titre
              </button>
              <button
                onClick={onSchedule}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <Calendar className="size-4" />
                Planifier un RDV
              </button>
            </div>
            {/* Line 2: Add task + Lost */}
            <div className="flex items-center gap-2">
              <button
                onClick={onAddTask}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <Plus className="size-4" />
                Ajouter une tâche
              </button>
              <button
                onClick={onLost}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                Projet perdu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress Ring Component (for active tab indicator)
function ProgressRing({ progress = 0 }) {
  const radius = 7; // For 16px diameter (18px on dense screens)
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <span className="relative inline-flex items-center justify-center">
      <svg className="size-[20px]" viewBox="0 0 20 20">
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="#F4DFF0"
          strokeWidth="2"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="#E663C5"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 10 10)"
        />
      </svg>
      <span className="absolute inset-0 rounded-full border border-white/40" aria-hidden />
    </span>
  );
}

// Tab Navigation Component
function TabNavigation({ activeTab, onTabChange, activeSubTab, onSubTabChange, onOpenSummary, progressSidebarWidth, progress = 0 }) {
  const tabs = [
    { id: "study", label: "Étude client", hasProgress: true },
    { id: "tasks", label: "Tâches", count: 4 },
    { id: "calendar", label: "Calendrier" }
  ];

  const subTabs = [
    { id: "discovery", label: "Découverte" },
    { id: "kitchen", label: "Découverte cuisine" },
    { id: "commercial", label: "Présentation commerciale" },
    { id: "quote", label: "Devis en cours" }
  ];

  const showSubTabs = activeTab === "study";

  return (
    <div className="bg-[#F8F9FA] transition-[margin] duration-300" style={{ marginRight: `${progressSidebarWidth}px` }}>
      <div className="w-full px-4 lg:px-6">
        {/* Main tabs */}
        <div className="flex items-end justify-between pt-4">
          <nav
            className="flex items-end gap-1"
            role="tablist"
            aria-label="Onglets principaux"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  className={`px-5 py-3 text-[15px] font-medium leading-6 transition-all whitespace-nowrap inline-flex items-center gap-3 ${
                    isActive
                      ? "bg-white text-neutral-900 border-t border-l border-r border-[#E5E5E5] rounded-t-xl"
                      : "text-[#8A8A8A] hover:text-neutral-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.hasProgress && isActive && (
                    <span className="inline-flex items-center gap-1.5">
                      <ProgressRing progress={progress} />
                      <span className="text-xs font-semibold text-[#E663C5]">{progress}%</span>
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span className="ml-1">({tab.count})</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Summary button on the right */}
          <button
            onClick={onOpenSummary}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3 py-1.5 mb-2 text-sm font-medium text-[#2C2F37] hover:bg-[#F8F9FC] transition-colors shadow-sm"
          >
            <FileText className="size-3.5" />
            Résumé
          </button>
        </div>

        {/* Sub tabs bar (only for study tab) */}
        {showSubTabs && (
          <div className="bg-white border-t border-l border-r border-[#E5E5E5]">
            <nav
              className="flex items-center gap-8 px-4 lg:px-6 h-12"
              role="tablist"
              aria-label="Sous-onglets"
            >
              {subTabs.map((tab) => {
                const isActive = activeSubTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSubTabChange(tab.id)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`subpanel-${tab.id}`}
                    className={`relative h-full text-[15px] font-medium leading-6 transition-colors ${
                      isActive
                        ? "text-neutral-900 border-b-2 border-neutral-900"
                        : "text-[#8A8A8A] hover:text-neutral-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

// Add Appliance Modal Component
function AddApplianceModal({ isOpen, onClose, onAddNew, onAddExisting, searchValue, onSearchChange, selectedValue, onSelectionChange }) {
  const applianceOptions = [
    { value: "lave-vaisselle-2", label: "Lave-vaisselle intégré" },
    { value: "four-encastre", label: "Four encastré" },
    { value: "plaque-induction", label: "Plaque à induction" },
    { value: "frigo-americain", label: "Frigo américain" },
    { value: "cave-vin-2", label: "Cave à vin électrique" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Plus className="size-4 text-[#1F2027]" />
            <h2 className="text-base font-semibold text-[#1F2027]">Ajouter un électroménager</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Search field */}
          <div className="space-y-2">
            <label className="block text-xs text-[#6B7280]">Rechercher un article</label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un article"
              className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
            />
          </div>

          {/* Select dropdown */}
          <div className="space-y-2">
            <div className="border border-[#E1E4ED] rounded-lg bg-white max-h-48 overflow-y-auto">
              {applianceOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => onSelectionChange(option.value)}
                  className="flex items-center justify-between px-4 py-3 border-b border-[#E1E4ED] last:border-b-0 hover:bg-[#F8F9FC] cursor-pointer transition-colors"
                >
                  <span className="text-sm text-[#1F2027]">{option.label}</span>
                  {selectedValue === option.value && (
                    <Check className="size-4 text-[#1F2027]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-6 py-3 bg-neutral-50 rounded-b-lg border-t border-[#E5E7EB]">
          <button
            onClick={onAddNew}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[#E1E4ED] bg-white hover:bg-[#F9FAFB] text-xs font-medium text-[#1F2027] transition-colors"
          >
            <Plus className="size-3.5" />
            Ajouter un nouvel article
          </button>
          <button
            onClick={onAddExisting}
            disabled={!selectedValue}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#2C2F37] hover:bg-[#1F2027] disabled:bg-[#D1D5DB] text-white text-xs font-medium transition-colors"
          >
            <Check className="size-3.5" />
            Ajouter l'article
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirm Delete Modal Component
function ConfirmDeleteModal({ title, message, itemType, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-lg font-semibold text-[#1F2027]">{title}</h2>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 pb-6">
          <p className="text-sm text-[#6B7280]">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 bg-neutral-50 rounded-b-lg">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-sm font-medium text-[#374151] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Retour
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-sm font-medium transition-colors"
          >
            <Check className="size-4" />
            Supprimer {itemType.toLowerCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

// Note Modal Component
function NoteModal({ title, content, onSave, onClose }) {
  const [noteContent, setNoteContent] = useState(content);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#F5F5F5" }}>
          <h2 className="text-lg font-semibold text-[#1F2027]">Note {title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Écrivez votre note ici..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E1E4ED] bg-white hover:bg-neutral-50 text-sm font-medium text-[#1F2027] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(noteContent)}
            className="px-4 py-2 rounded-lg bg-[#1F2027] hover:bg-[#2A2D35] text-white text-sm font-medium transition-colors"
          >
            Sauvegarder la note
          </button>
        </div>
      </div>
    </div>
  );
}

// Number Spinner Component
function NumberSpinner({ value, onChange, placeholder = "0" }) {
  const handleIncrement = () => {
    const newValue = parseInt(value || 0) + 1;
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, parseInt(value || 0) - 1);
    onChange(newValue.toString());
  };

  return (
    <div className="flex items-center border border-[#E1E4ED] rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
      <button
        onClick={handleDecrement}
        className="px-3 py-3 text-[#2B7FFF] hover:bg-[#F8F9FC] transition-colors font-semibold text-lg flex items-center justify-center"
        aria-label="Décrementer"
      >
        −
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const numValue = e.target.value.replace(/\D/g, "");
          onChange(numValue);
        }}
        placeholder={placeholder}
        className="flex-1 px-3 py-3 text-center border-0 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-0 bg-white"
      />
      <button
        onClick={handleIncrement}
        className="px-3 py-3 text-[#2B7FFF] hover:bg-[#F8F9FC] transition-colors font-semibold text-lg flex items-center justify-center"
        aria-label="Incrémenter"
      >
        +
      </button>
    </div>
  );
}

// Project Tasks Tab Content Component
function ProjectTasksTabContent({ project }) {
  const [taskFilter, setTaskFilter] = useState("in-progress");
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const { taches, loading, error, createTache, updateTacheStatus } = useTaches();

  // Filter tasks by project ID (preferred) or project name (fallback)
  const filteredTasks = taches.filter(task => {
    // Use id_projet if available (most reliable)
    const isProjectMatch = project?.id && task.id_projet === project.id;
    // Fallback to project name matching if id_projet is not set
    const projectName = project?.titre;
    const isProjectNameMatch = projectName && task.projectName === projectName && task.projectName !== 'Non spécifié';

    // Show task if it matches the project
    if (!isProjectMatch && !isProjectNameMatch) {
      return false;
    }

    // Filter by status
    if (taskFilter === "in-progress") {
      return task.status !== "Terminé";
    } else if (taskFilter === "completed") {
      return task.status === "Terminé";
    }
    return true;
  });

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

  const getTypeStyles = (type) => {
    switch (type) {
      case "Tâche":
        return "bg-blue-100 text-blue-700";
      case "Mémo":
        return "bg-neutral-900 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title and Filter Pills */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">Liste des tâches</h3>
          <div className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 p-1" role="radiogroup">
            <button
              onClick={() => setTaskFilter("in-progress")}
              role="radio"
              aria-checked={taskFilter === "in-progress"}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                taskFilter === "in-progress"
                  ? "bg-gray-900 text-white"
                  : "text-neutral-700 hover:text-neutral-900"
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setTaskFilter("completed")}
              role="radio"
              aria-checked={taskFilter === "completed"}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                taskFilter === "completed"
                  ? "bg-gray-900 text-white"
                  : "text-neutral-700 hover:text-neutral-900"
              }`}
            >
              Terminées
            </button>
          </div>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => setAddTaskModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B7FFF] text-white text-sm font-medium hover:bg-[#1F6FE6] transition-colors"
        >
          <Plus className="size-4" />
          Créer une tâche
        </button>
      </div>

      {/* Gray Container for Tasks */}
      <div className="rounded-lg border border-[#E4E4E7] overflow-hidden" style={{ backgroundColor: "#F8F9FA" }}>
        {/* Tasks Header - Full Width */}
        <div className="w-full border-b border-[#E4E4E7] p-4" style={{ backgroundColor: "#FAFAFA" }}>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-neutral-600 flex-1">Type</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Projet</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Statut</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Échéance</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Collaborateur</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Notes</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Progression</span>
            <div className="flex-shrink-0 w-10"></div>
          </div>
        </div>

        {/* Tasks Cards Container */}
        <div className="p-4 space-y-3">
          {loading && (
            <div className="p-12 text-center text-neutral-500">
              Chargement des tâches...
            </div>
          )}
          {!loading && filteredTasks.map((task) => {
            const statusColor = getStatusColor(task.status);
            return (
              <div
                key={task.id}
                className="border border-[#E4E4E7] rounded-lg bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyles(task.type)}`}>
                      {task.type || "Tâche"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-600">{task.projectName || "—"}</span>
                  </div>
                  <div className="flex-1">
                    <select
                      value={task.status}
                      onChange={(e) => updateTacheStatus(task.id, e.target.value)}
                      className="text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      <option value="Non commencé">Non commencé</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-600">{task.dueDate}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {task.salarie_name ? (
                        <>
                          <div className="size-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-700">
                            {task.salarie_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-neutral-600">{task.salarie_name}</span>
                        </>
                      ) : (
                        <>
                          <div className="size-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600">
                            —
                          </div>
                          <span className="text-sm text-neutral-600">Non assigné</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-600">{task.note || "—"}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="relative h-1.5 rounded-full bg-neutral-200 flex-1">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${statusColor.progressBar}`}
                          style={{ width: `${Math.min(100, Math.max(0, task.progress))}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${statusColor.progressText} w-10 text-right`}>
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                      title="Options de la tâche"
                      onClick={() => console.log('Edit task:', task.id)}
                    >
                      <MoreHorizontal className="size-4 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="p-12 text-center text-neutral-500 border border-[#E4E4E7] rounded-lg bg-white">
              Aucune tâche {taskFilter === "in-progress" ? "en cours" : "terminée"}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <CreateTaskOrMemoModal
        open={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            console.log("[ProjectTasksTabContent] Task payload received:", payload);

            const taskData = {
              titre: payload.kind === "Tâche" ? payload.taskType || "Tâche sans titre" : payload.memoName,
              type: payload.kind,
              id_projet: project?.id || null,
              nom_projet: project?.titre || null,
              tag: payload.taskType || "Autre",
              note: payload.note,
              date_echeance: payload.dueDate || payload.memoEcheance,
              statut: "non_commence",
              id_affecte_a: payload.salarie || null
            };

            console.log("[ProjectTasksTabContent] Final taskData to send:", taskData);
            await createTache(taskData);
            setAddTaskModalOpen(false);
          } catch (err) {
            console.error("Erreur lors de la création de la tâche:", err);
          }
        }}
        preFilledClient={project?.clientName || ""}
        preFilledProject={project?.titre || ""}
      />
    </div>
  );
}

// Add Document Modal Component
function AddDocumentModal({ isOpen, onClose, onSave, sectionTitle }) {
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (documentName.trim() && selectedFile) {
      onSave({ name: documentName, file: selectedFile });
      setDocumentName("");
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setDocumentName("");
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg w-full mx-4" style={{ maxWidth: '740px', height: '450px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
        {/* Modal Header */}
        <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#E4E4E7] flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            {/* Document icon in square */}
            <div className="w-8 h-8 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#323130" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Title */}
            <h3 className="text-sm font-semibold text-[#1F2027]">Ajouter un document de {sectionTitle}</h3>
          </div>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="size-4 text-[#1F2027]" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Block 1: Document Name */}
          <div className="bg-[#F3F4F6] rounded-lg p-4">
            <div className="text-xs text-[#6B7280] font-medium mb-3">
              Nom du document<span className="text-red-500">*</span>
            </div>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Saisir le nom du document"
              className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A5A9B8] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
            />
          </div>

          {/* Block 2: File Upload */}
          <div className="bg-[#F3F4F6] rounded-lg p-4 flex flex-col items-center justify-center min-h-[180px]">
            <input
              type="file"
              id="file-input"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            <label htmlFor="file-input" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div className="text-center space-y-3 flex flex-col items-center">
                <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div>
                  <p className="text-xs text-[#6B7280] font-medium">
                    {selectedFile ? selectedFile.name : "Glissez-déposez ou"}
                  </p>
                  {!selectedFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('file-input')?.click();
                      }}
                      className="text-xs text-[#2B7FFF] font-medium hover:underline mt-1"
                    >
                      Sélectionner un fichier
                    </button>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-[#E4E4E7]">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors"
          >
            Retour
          </button>
          <button
            onClick={handleSave}
            disabled={!documentName.trim() || !selectedFile}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#2B7FFF] bg-[#2B7FFF] text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider l'ajout du document
          </button>
        </div>
      </div>
    </div>
  );
}

// Commercial Presentation Tab Content Component
function CommercialPresentationTabContent() {
  const [presentationComment, setPresentationComment] = useState("");
  const [addDocumentModalOpen, setAddDocumentModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState({
    photos: [
      { id: 1, name: "Photo 1 - Cuisine moderne" },
      { id: 2, name: "Photo 2 - Détail plan" },
      { id: 3, name: "Photo 3 - Vue d'ensemble" }
    ],
    trendBoard: [
      { id: 1, name: "Planche tendance 1" },
      { id: 2, name: "Planche tendance 2" }
    ],
    sitePlan: [
      { id: 1, name: "Plan de masse - Vue aérienne" }
    ],
    elevations: [
      { id: 1, name: "Élévation Façade Ouest" },
      { id: 2, name: "Élévation Façade Nord" }
    ],
    perspectives: [
      { id: 1, name: "Perspective 3D - Jour" },
      { id: 2, name: "Perspective 3D - Nuit" }
    ]
  });

  const handleAddDocumentClick = (section) => {
    setCurrentSection(section);
    setAddDocumentModalOpen(true);
  };

  const handleSaveDocument = (data) => {
    if (currentSection) {
      const newDoc = {
        id: Date.now(),
        name: data.name
      };
      setUploadedDocuments({
        ...uploadedDocuments,
        [currentSection]: [...(uploadedDocuments[currentSection] || []), newDoc]
      });
      setAddDocumentModalOpen(false);
      setCurrentSection(null);
    }
  };

  const DocumentGrid = ({ documents, onDelete, onEdit }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white rounded-lg border border-[#ECEEF5] p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg className="w-6 h-6 text-[#6B7280] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-[#1F2027] truncate">{doc.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => onEdit(doc)}
              className="p-1.5 hover:bg-[#F3F4F6] rounded-md transition-colors"
              title="Éditer"
            >
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(doc)}
              className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
              title="Supprimer"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Présentation de l'étude */}
      <FormSection title="Présentation de l'étude">
        <FormField label="Commentaire" span={3}>
          <textarea
            value={presentationComment}
            onChange={(e) => setPresentationComment(e.target.value)}
            placeholder="Écrivez votre commentaire ici..."
            rows={6}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A5A9B8] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 resize-none"
          />
        </FormField>
      </FormSection>

      {/* Photos & plan client */}
      <FormSection
        title="Photos & plan client"
        documentCount={uploadedDocuments.photos.length}
        action={
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3.5 py-2 text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Récupérer un document
            </button>
            <button onClick={() => handleAddDocumentClick('photos')} className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3.5 py-2 text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un document
            </button>
          </div>
        }
      >
        <FormField label="" span={3}>
          <DocumentGrid
            documents={uploadedDocuments.photos}
            onDelete={(doc) => {
              setUploadedDocuments({
                ...uploadedDocuments,
                photos: uploadedDocuments.photos.filter(d => d.id !== doc.id)
              });
            }}
            onEdit={(doc) => console.log("Éditer", doc)}
          />
        </FormField>
      </FormSection>

      {/* Planche tendance */}
      <FormSection
        title="Planche tendance"
        documentCount={uploadedDocuments.trendBoard.length}
        action={
          <button onClick={() => handleAddDocumentClick('trendBoard')} className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3.5 py-2 text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un document
          </button>
        }
      >
        <FormField label="" span={3}>
          <DocumentGrid
            documents={uploadedDocuments.trendBoard}
            onDelete={(doc) => {
              setUploadedDocuments({
                ...uploadedDocuments,
                trendBoard: uploadedDocuments.trendBoard.filter(d => d.id !== doc.id)
              });
            }}
            onEdit={(doc) => console.log("Éditer", doc)}
          />
        </FormField>
      </FormSection>

      {/* Plan de masse */}
      <FormSection
        title="Plan de masse"
        documentCount={uploadedDocuments.sitePlan.length}
        action={
          <button onClick={() => handleAddDocumentClick('sitePlan')} className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3.5 py-2 text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un document
          </button>
        }
      >
        <FormField label="" span={3}>
          <DocumentGrid
            documents={uploadedDocuments.sitePlan}
            onDelete={(doc) => {
              setUploadedDocuments({
                ...uploadedDocuments,
                sitePlan: uploadedDocuments.sitePlan.filter(d => d.id !== doc.id)
              });
            }}
            onEdit={(doc) => console.log("Éditer", doc)}
          />
        </FormField>
      </FormSection>

      {/* Élévations */}
      <FormSection
        title="Élévations"
        documentCount={uploadedDocuments.elevations.length}
        action={
          <button onClick={() => handleAddDocumentClick('elevations')} className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3.5 py-2 text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un document
          </button>
        }
      >
        <FormField label="" span={3}>
          <DocumentGrid
            documents={uploadedDocuments.elevations}
            onDelete={(doc) => {
              setUploadedDocuments({
                ...uploadedDocuments,
                elevations: uploadedDocuments.elevations.filter(d => d.id !== doc.id)
              });
            }}
            onEdit={(doc) => console.log("Éditer", doc)}
          />
        </FormField>
      </FormSection>

      {/* Perspectives */}
      <FormSection
        title="Perspectives"
        documentCount={uploadedDocuments.perspectives.length}
        action={
          <button onClick={() => handleAddDocumentClick('perspectives')} className="inline-flex items-center gap-2 rounded-lg border border-[#E1E4ED] bg-white px-3.5 py-2 text-sm font-medium text-[#1F2027] hover:bg-[#F8F9FA] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un document
          </button>
        }
      >
        <FormField label="" span={3}>
          <DocumentGrid
            documents={uploadedDocuments.perspectives}
            onDelete={(doc) => {
              setUploadedDocuments({
                ...uploadedDocuments,
                perspectives: uploadedDocuments.perspectives.filter(d => d.id !== doc.id)
              });
            }}
            onEdit={(doc) => console.log("Éditer", doc)}
          />
        </FormField>
      </FormSection>

      {/* Add Document Modal */}
      <AddDocumentModal
        isOpen={addDocumentModalOpen}
        onClose={() => setAddDocumentModalOpen(false)}
        onSave={handleSaveDocument}
        sectionTitle={
          {
            photos: "Photos & plan client",
            trendBoard: "Planche tendance",
            sitePlan: "Plan de masse",
            elevations: "Élévations",
            perspectives: "Perspectives"
          }[currentSection] || ""
        }
      />
    </div>
  );
}

// Kitchen Discovery Tab Content Component
function KitchenDiscoveryTabContent({ project, onUpdate }) {
  // Options for dropdown menus
  const accessoriesOptions = [
    { value: "tirors-amortis", label: "Tiroirs avec amortisseurs" },
    { value: "etageres-ajustables", label: "Étagères ajustables" },
    { value: "rangement-vertical", label: "Systèmes de rangement vertical" },
    { value: "separatifs", label: "Séparatifs de tiroirs" },
    { value: "porte-bouteilles", label: "Porte-bouteilles" },
    { value: "corbeille-pain", label: "Corbeille à pain" },
    { value: "porte-epices", label: "Porte-épices" },
    { value: "credence", label: "Crédence" },
    { value: "poignees-speciales", label: "Poignées spéciales" }
  ];

  const brightnessOptions = [
    { value: "tres-faible", label: "Très faible" },
    { value: "faible", label: "Faible" },
    { value: "normale", label: "Normale" },
    { value: "lumineuse", label: "Lumineuse" },
    { value: "tres-lumineuse", label: "Très lumineuse" }
  ];

  const temperatureOptions = [
    { value: "blanc-chaud", label: "Blanc chaud (2700K)" },
    { value: "blanc-neutre", label: "Blanc neutre (4000K)" },
    { value: "blanc-froid", label: "Blanc froid (6000K)" },
    { value: "melange", label: "Mélangé (ajustable)" }
  ];

  const apparatusOptions = [
    { value: "eviers", label: "Éviers" },
    { value: "plaques", label: "Plaques de cuisson" },
    { value: "lave-vaisselle", label: "Lave-vaisselle" },
    { value: "four", label: "Four" },
    { value: "hotte", label: "Hotte" },
    { value: "refrigerateur", label: "Réfrigérateur" },
    { value: "micro-ondes", label: "Micro-ondes" },
    { value: "meubles", label: "Meubles" }
  ];

  const kitchenObjectivesOptions = [
    { value: "maximiser-stockage", label: "Maximiser l'espace de stockage" },
    { value: "ergonomie", label: "Améliorer l'ergonomie" },
    { value: "lumiere", label: "Gain de lumière" },
    { value: "moderniser", label: "Moderniser l'apparence" },
    { value: "fonctionnalite", label: "Améliorer la fonctionnalité" },
    { value: "nettoyage", label: "Faciliter le nettoyage" },
    { value: "flux", label: "Optimiser le flux de travail" }
  ];

  const lowFurnitureOptions = [
    { value: "base-1-porte", label: "Base avec 1 porte" },
    { value: "base-2-portes", label: "Base avec 2 portes" },
    { value: "base-3-portes", label: "Base avec 3 portes" },
    { value: "base-tiroirs", label: "Base avec tiroirs" },
    { value: "base-angle", label: "Base d'angle" },
    { value: "base-ouverte", label: "Base ouverte" }
  ];

  const highFurnitureOptions = [
    { value: "armoire-1-porte", label: "Armoire haute 1 porte" },
    { value: "armoire-2-portes", label: "Armoire haute 2 portes" },
    { value: "armoire-etageres", label: "Armoire haute avec étagères" },
    { value: "armoire-ouverte", label: "Armoire haute ouverte" },
    { value: "armoire-angle", label: "Caisson haut d'angle" }
  ];

  const columnOptions = [
    { value: "colonne-simple", label: "Colonne simple" },
    { value: "colonne-double", label: "Colonne double" },
    { value: "colonne-etageres", label: "Colonne avec étagères" },
    { value: "colonne-angle", label: "Colonne d'angle" }
  ];

  const [activeTertiaryTab, setActiveTertiaryTab] = useState("ambiance");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteModalTab, setNoteModalTab] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [saveError, setSaveError] = useState(null);
  const debounceTimerRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const [sanitaryPrices, setSanitaryPrices] = useState({
    min: "35000",
    max: "56000"
  });
  const [addApplianceModalOpen, setAddApplianceModalOpen] = useState(false);
  const [applianceSearch, setApplianceSearch] = useState("");
  const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);
  const [addArticleModalType, setAddArticleModalType] = useState(null); // 'appliance' or 'sanitary'
  const [addArticleModalCurrentId, setAddArticleModalCurrentId] = useState(null); // appliance or sanitary ID
  const [addArticleModalData, setAddArticleModalData] = useState({
    catalogOrGeneric: "generic",
    family: "",
    article: ""
  });
  const [applianceArticles, setApplianceArticles] = useState({}); // { applianceId: [{ catalogOrGeneric, family, article }, ...] }
  const [sanitaryArticles, setSanitaryArticles] = useState({}); // { sanitaryId: [{ catalogOrGeneric, family, article }, ...] }
  const [applianceSelection, setApplianceSelection] = useState("");
  const [expandedAppliances, setExpandedAppliances] = useState({});
  const [expandedSanitaries, setExpandedSanitaries] = useState({});
  const [applianceAnswers, setApplianceAnswers] = useState({});
  const [sanitaryAnswers, setSanitaryAnswers] = useState({});
  const [financialEstimationExpanded, setFinancialEstimationExpanded] = useState(true);
  const [financialEstimationData, setFinancialEstimationData] = useState({
    mobilierMin: "",
    mobilierMax: "",
    planTravailMin: "",
    planTravailMax: "",
    accessoireMeubleMin: "",
    accessoireMeubleMax: "",
    mainOeuvreXLMin: "",
    mainOeuvreXLMax: "",
    livraisonMin: "",
    livraisonMax: "",
    mainOeuvreArtisansMin: "",
    mainOeuvreArtisansMax: ""
  });
  const [paymentSimulationExpanded, setPaymentSimulationExpanded] = useState(true);
  const [paymentSimulationData, setPaymentSimulationData] = useState({
    montantTotal: "",
    pourcentageAcompte: ""
  });
  const [applianceSupplier, setApplianceSupplier] = useState({});
  const [sanitarySupplier, setSanitarySupplier] = useState({});
  const [applianceProducts, setApplianceProducts] = useState({
    1: "four-standard",
    6: "hotte-deco"
  });
  const [sanitaryProducts, setSanitaryProducts] = useState({
    1: "evier-inox"
  });

  // Mock product data
  const mockProducts = {
    // Four
    "four-bas": { ref: "FOUR-BAS-2024", description: "Four encastré bas de gamme", minPrice: "320", maxPrice: "450" },
    "four-moyen": { ref: "FOUR-MOY-2024", description: "Four encastré moyen de gamme", minPrice: "550", maxPrice: "850" },
    "four-haut": { ref: "FOUR-HAUT-2024", description: "Four encastré haut de gamme", minPrice: "1200", maxPrice: "1800" },
    // Hotte
    "hotte-bas": { ref: "HOTTE-BAS-2024", description: "Hotte aspirante bas de gamme", minPrice: "150", maxPrice: "280" },
    "hotte-moyen": { ref: "HOTTE-MOY-2024", description: "Hotte aspirante moyen de gamme", minPrice: "380", maxPrice: "650" },
    "hotte-haut": { ref: "HOTTE-HAUT-2024", description: "Hotte décoration premium verre", minPrice: "850", maxPrice: "1400" },
    // Évier
    "evier-bas": { ref: "EVIER-BAS-2024", description: "Évier simple bas de gamme", minPrice: "120", maxPrice: "250" },
    "evier-moyen": { ref: "EVIER-MOY-2024", description: "Évier inox moyen de gamme", minPrice: "380", maxPrice: "650" },
    "evier-haut": { ref: "EVIER-HAUT-2024", description: "Évier design haut de gamme", minPrice: "950", maxPrice: "1600" },
    // Mitigeur
    "mitigeur-bas": { ref: "MITIGEUR-BAS-2024", description: "Mitigeur standard bas de gamme", minPrice: "80", maxPrice: "150" },
    "mitigeur-moyen": { ref: "MITIGEUR-MOY-2024", description: "Mitigeur chromé moyen de gamme", minPrice: "220", maxPrice: "380" },
    "mitigeur-haut": { ref: "MITIGEUR-HAUT-2024", description: "Mitigeur design premium", minPrice: "550", maxPrice: "950" }
  };
  const [appliances, setAppliances] = useState([
    { id: 1, name: "Four" },
    { id: 2, name: "Micro-Onde" },
    { id: 3, name: "Tiroir Chauffe-plat" },
    { id: 4, name: "Cafetière" },
    { id: 5, name: "Plaque de cuisson" },
    { id: 6, name: "Hotte" },
    { id: 7, name: "Réfrigérateur" },
    { id: 8, name: "Congélateur" },
    { id: 9, name: "Cave à vin" },
    { id: 10, name: "Lave vaisselle" },
    { id: 11, name: "Lave linge" }
  ]);
  const [sanitaries, setSanitaries] = useState([
    { id: 1, name: "Évier" },
    { id: 2, name: "Mitigeur" },
    { id: 3, name: "Distributeur savon" },
    { id: 4, name: "Égouttoir pliable" },
    { id: 5, name: "Vidage automatique" },
    { id: 6, name: "Panier égouttoir" },
    { id: 7, name: "Planche à découper / égouttoir" },
    { id: 8, name: "Bonde + trop-plein" },
    { id: 9, name: "Cache bonde" }
  ]);
  const [formData, setFormData] = useState({
    // Ambiance
    ambianceTypes: "",
    ambianceAppreciated: "",
    ambianceToAvoid: "",
    // Modèle final
    furniture: "",
    handles: "",
    worktop: "",
    // Matériaux conservés
    kitchenFloor: "",
    kitchenWall: "",
    other: "",
    furnitureSelection: "",
    materialsDescription: "",
    // Furniture Tab
    storageCurrentVolume: "",
    storageDesiredVolume: "",
    furnitureAccessories: "",
    accessoriesComment: "",
    lightingBrightness: "",
    lightingTemperature: "",
    lightingDescription: "",
    uninstallApparatus: "",
    uninstallLength: "",
    uninstallDescription: "",
    preparationLength: "",
    preparationWasteDescription: "",
    worktopCurrentHeight: "",
    worktopDesiredHeight: "",
    dailyMealAdults: "",
    dailyMealChildren: "",
    exceptionalMealAdults: "",
    exceptionalMealChildren: "",
    kitchenObjectives: "",
    usageWasteDescription: "",
    lowFurniture: "",
    highFurniture: "",
    columns: "",
    lowFurnitureDescription: "",
    highFurnitureDescription: "",
    columnsDescription: "",
    furnitureWasteManagement: ""
  });
  const [tabNotes, setTabNotes] = useState({
    ambiance: "",
    furniture: "",
    appliances: "",
    financial: ""
  });

  // Load project data into formData on mount
  useEffect(() => {
    if (project) {
      const ambianceData = project.kitchen_ambiance_data || {};
      const meubleData = project.kitchen_meubles_data || {};
      setFormData((prev) => ({
        ...prev,
        // Ambiance section (from JSONB)
        ambianceTypes: ambianceData.ambianceTypes || project.types_ambiance || "",
        ambianceAppreciated: ambianceData.ambianceAppreciated || project.ambiance_appreciee || "",
        ambianceToAvoid: ambianceData.ambianceToAvoid || project.ambiance_eviter || "",
        // Modèle final section (from JSONB)
        furniture: ambianceData.furniture || project.meubles || "",
        handles: ambianceData.handles || project.poignees || "",
        worktop: ambianceData.worktop || project.plan_travail || "",
        // Matériaux conservés section (from JSONB)
        kitchenFloor: ambianceData.kitchenFloor || project.sol_cuisine || "",
        kitchenWall: ambianceData.kitchenWall || project.revetement_murs || "",
        other: ambianceData.other || project.autres_details || "",
        furnitureSelection: ambianceData.furnitureSelection || project.selection_meubles || "",
        materialsDescription: ambianceData.materialsDescription || project.description_materiaux || "",
        // Furniture section (from JSONB)
        storageCurrentVolume: meubleData.storageCurrentVolume || "",
        storageDesiredVolume: meubleData.storageDesiredVolume || "",
        furnitureAccessories: meubleData.furnitureAccessories || "",
        accessoriesComment: meubleData.accessoriesComment || "",
        lightingBrightness: meubleData.lightingBrightness || "",
        lightingTemperature: meubleData.lightingTemperature || "",
        lightingDescription: meubleData.lightingDescription || "",
        uninstallApparatus: meubleData.uninstallApparatus || "",
        uninstallLength: meubleData.uninstallLength || "",
        uninstallDescription: meubleData.uninstallDescription || "",
        preparationLength: meubleData.preparationLength || "",
        preparationWasteDescription: meubleData.preparationWasteDescription || "",
        worktopCurrentHeight: meubleData.worktopCurrentHeight || "",
        worktopDesiredHeight: meubleData.worktopDesiredHeight || "",
        dailyMealAdults: meubleData.dailyMealAdults || "",
        dailyMealChildren: meubleData.dailyMealChildren || "",
        exceptionalMealAdults: meubleData.exceptionalMealAdults || "",
        exceptionalMealChildren: meubleData.exceptionalMealChildren || "",
        kitchenObjectives: meubleData.kitchenObjectives || "",
        usageWasteDescription: meubleData.usageWasteDescription || "",
        lowFurniture: meubleData.lowFurniture || "",
        highFurniture: meubleData.highFurniture || "",
        columns: meubleData.columns || "",
        lowFurnitureDescription: meubleData.lowFurnitureDescription || "",
        highFurnitureDescription: meubleData.highFurnitureDescription || "",
        columnsDescription: meubleData.columnsDescription || "",
        furnitureWasteManagement: meubleData.furnitureWasteManagement || ""
      }));
    }
  }, [project?.id]);

  // Function to save data
  const saveData = async (dataToSave) => {
    if (!project || !onUpdate || !dataToSave) return;

    // Check if data has actually changed
    const dataString = JSON.stringify(dataToSave);
    if (lastSavedDataRef.current === dataString) {
      return; // No change, skip save
    }

    setSaveStatus("saving");
    setSaveError(null);

    try {
      const result = await onUpdate(dataToSave);
      if (result.success) {
        lastSavedDataRef.current = dataString;
        setSaveStatus("saved");
        // Reset to idle after 2 seconds
        const timeoutId = setTimeout(() => setSaveStatus("idle"), 2000);
        return () => clearTimeout(timeoutId);
      } else {
        setSaveStatus("error");
        setSaveError(result.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err.message || "Erreur lors de la sauvegarde");
    }
  };

  // Auto-save with debounce
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer for debounced save (500ms for quasi-instant save)
    debounceTimerRef.current = setTimeout(() => {
      const dataToUpdate = {
        // Notes
        notes_ambiance: tabNotes.ambiance,
        notes_meubles: tabNotes.furniture,
        notes_electromenagers: tabNotes.appliances,
        notes_financier: tabNotes.financial,
        // Ambiance section (stored as JSONB)
        kitchen_ambiance_data: {
          ambianceTypes: formData.ambianceTypes,
          ambianceAppreciated: formData.ambianceAppreciated,
          ambianceToAvoid: formData.ambianceToAvoid,
          furniture: formData.furniture,
          handles: formData.handles,
          worktop: formData.worktop,
          kitchenFloor: formData.kitchenFloor,
          kitchenWall: formData.kitchenWall,
          other: formData.other,
          furnitureSelection: formData.furnitureSelection,
          materialsDescription: formData.materialsDescription
        },
        // Furniture section (stored as JSONB)
        kitchen_meubles_data: {
          storageCurrentVolume: formData.storageCurrentVolume,
          storageDesiredVolume: formData.storageDesiredVolume,
          furnitureAccessories: formData.furnitureAccessories,
          accessoriesComment: formData.accessoriesComment,
          lightingBrightness: formData.lightingBrightness,
          lightingTemperature: formData.lightingTemperature,
          lightingDescription: formData.lightingDescription,
          uninstallApparatus: formData.uninstallApparatus,
          uninstallLength: formData.uninstallLength,
          uninstallDescription: formData.uninstallDescription,
          preparationLength: formData.preparationLength,
          preparationWasteDescription: formData.preparationWasteDescription,
          worktopCurrentHeight: formData.worktopCurrentHeight,
          worktopDesiredHeight: formData.worktopDesiredHeight,
          dailyMealAdults: formData.dailyMealAdults,
          dailyMealChildren: formData.dailyMealChildren,
          exceptionalMealAdults: formData.exceptionalMealAdults,
          exceptionalMealChildren: formData.exceptionalMealChildren,
          kitchenObjectives: formData.kitchenObjectives,
          usageWasteDescription: formData.usageWasteDescription,
          lowFurniture: formData.lowFurniture,
          highFurniture: formData.highFurniture,
          columns: formData.columns,
          lowFurnitureDescription: formData.lowFurnitureDescription,
          highFurnitureDescription: formData.highFurnitureDescription,
          columnsDescription: formData.columnsDescription,
          furnitureWasteManagement: formData.furnitureWasteManagement
        }
      };

      saveData(dataToUpdate);
    }, 500); // 500ms debounce delay for quasi-instant save

    // Cleanup function - save on unmount if there are pending changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData, tabNotes]);

  // Save data before component unmounts
  useEffect(() => {
    return () => {
      // Clear timer and save immediately on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const dataToUpdate = {
        notes_ambiance: tabNotes.ambiance,
        notes_meubles: tabNotes.furniture,
        notes_electromenagers: tabNotes.appliances,
        notes_financier: tabNotes.financial,
        kitchen_ambiance_data: {
          ambianceTypes: formData.ambianceTypes,
          ambianceAppreciated: formData.ambianceAppreciated,
          ambianceToAvoid: formData.ambianceToAvoid,
          furniture: formData.furniture,
          handles: formData.handles,
          worktop: formData.worktop,
          kitchenFloor: formData.kitchenFloor,
          kitchenWall: formData.kitchenWall,
          other: formData.other,
          furnitureSelection: formData.furnitureSelection,
          materialsDescription: formData.materialsDescription
        },
        kitchen_meubles_data: {
          storageCurrentVolume: formData.storageCurrentVolume,
          storageDesiredVolume: formData.storageDesiredVolume,
          furnitureAccessories: formData.furnitureAccessories,
          accessoriesComment: formData.accessoriesComment,
          lightingBrightness: formData.lightingBrightness,
          lightingTemperature: formData.lightingTemperature,
          lightingDescription: formData.lightingDescription,
          uninstallApparatus: formData.uninstallApparatus,
          uninstallLength: formData.uninstallLength,
          uninstallDescription: formData.uninstallDescription,
          preparationLength: formData.preparationLength,
          preparationWasteDescription: formData.preparationWasteDescription,
          worktopCurrentHeight: formData.worktopCurrentHeight,
          worktopDesiredHeight: formData.worktopDesiredHeight,
          dailyMealAdults: formData.dailyMealAdults,
          dailyMealChildren: formData.dailyMealChildren,
          exceptionalMealAdults: formData.exceptionalMealAdults,
          exceptionalMealChildren: formData.exceptionalMealChildren,
          kitchenObjectives: formData.kitchenObjectives,
          usageWasteDescription: formData.usageWasteDescription,
          lowFurniture: formData.lowFurniture,
          highFurniture: formData.highFurniture,
          columns: formData.columns,
          lowFurnitureDescription: formData.lowFurnitureDescription,
          highFurnitureDescription: formData.highFurnitureDescription,
          columnsDescription: formData.columnsDescription,
          furnitureWasteManagement: formData.furnitureWasteManagement
        }
      };

      // Don't await - just fire and forget on unmount
      saveData(dataToUpdate);
    };
  }, []);

  // Calculate total prices for appliances
  // Helper function to extract min and max prices from article content
  const parsePriceFromArticle = (article) => {
    if (!article || !article.contenu) {
      return { min: 0, max: 0 };
    }

    // Parse format: "Prix TTC: 400€ - 600€"
    const priceMatch = article.contenu.match(/Prix TTC:\s*(\d+)€\s*-\s*(\d+)€/);
    if (priceMatch) {
      return {
        min: parseInt(priceMatch[1]) || 0,
        max: parseInt(priceMatch[2]) || 0
      };
    }
    return { min: 0, max: 0 };
  };

  const calculateApplianceTotals = () => {
    let minTotal = 0;
    let maxTotal = 0;

    // Get articles from project that are Electromenager category
    if (project && project.articles_data && Array.isArray(project.articles_data)) {
      project.articles_data.forEach((article) => {
        if (article.categorie === "Electromenager") {
          const prices = parsePriceFromArticle(article);
          minTotal += prices.min;
          maxTotal += prices.max;
        }
      });
    }

    return { min: minTotal, max: maxTotal };
  };

  // Calculate total prices for sanitaries
  const calculateSanitaryTotals = () => {
    let minTotal = 0;
    let maxTotal = 0;

    // Get articles from project that are Sanitaire category
    if (project && project.articles_data && Array.isArray(project.articles_data)) {
      project.articles_data.forEach((article) => {
        if (article.categorie === "Sanitaire") {
          const prices = parsePriceFromArticle(article);
          minTotal += prices.min;
          maxTotal += prices.max;
        }
      });
    }

    return { min: minTotal, max: maxTotal };
  };

  const applianceTotals = calculateApplianceTotals();
  const sanitaryTotals = calculateSanitaryTotals();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNoteClick = (tabId, tabLabel) => {
    setNoteModalTab({ id: tabId, label: tabLabel });
    setNoteModalOpen(true);
  };

  const handleNoteSave = (content) => {
    setTabNotes((prev) => ({ ...prev, [noteModalTab.id]: content }));
    setNoteModalOpen(false);
  };

  const handleDeleteAppliance = (appliance) => {
    setDeleteModalData({
      type: "appliance",
      id: appliance.id,
      name: appliance.name,
      title: `Supprimer ${appliance.name}`,
      message: `Voulez-vous vraiment supprimer le ${appliance.name} de la liste des électroménagers ?`,
      itemType: "l'électroménager"
    });
    setDeleteModalOpen(true);
  };

  const handleDeleteSanitary = (sanitary) => {
    setDeleteModalData({
      type: "sanitary",
      id: sanitary.id,
      name: sanitary.name,
      title: `Supprimer ${sanitary.name}`,
      message: `Voulez-vous vraiment supprimer le ${sanitary.name} de la liste des sanitaires ?`,
      itemType: "le sanitaire"
    });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteModalData.type === "appliance") {
      setAppliances(appliances.filter(a => a.id !== deleteModalData.id));
    } else if (deleteModalData.type === "sanitary") {
      setSanitaries(sanitaries.filter(s => s.id !== deleteModalData.id));
    }
    setDeleteModalOpen(false);
    setDeleteModalData(null);
  };

  const handleAddApplianceClick = () => {
    setAddApplianceModalOpen(true);
  };

  const handleAddApplianceNew = () => {
    setAddApplianceModalOpen(false);
    // Pour l'instant, on ouvre simplement la modale avec un champ vide
    // Tu peux ajouter une seconde modale pour créer un nouvel article
  };

  const handleAddApplianceExisting = () => {
    if (applianceSelection) {
      const applianceOptions = [
        { value: "lave-vaisselle-2", label: "Lave-vaisselle intégré" },
        { value: "four-encastre", label: "Four encastré" },
        { value: "plaque-induction", label: "Plaque à induction" },
        { value: "frigo-americain", label: "Frigo américain" },
        { value: "cave-vin-2", label: "Cave à vin électrique" }
      ];
      const selectedAppliance = applianceOptions.find(a => a.value === applianceSelection);
      if (selectedAppliance) {
        const newId = Math.max(...appliances.map(a => a.id), 0) + 1;
        setAppliances([...appliances, { id: newId, name: selectedAppliance.label }]);
        setAddApplianceModalOpen(false);
        setApplianceSelection("");
        setApplianceSearch("");
      }
    }
  };

  const tertiaryTabs = [
    { id: "ambiance", label: "Ambiance" },
    { id: "furniture", label: "Meubles" },
    { id: "appliances", label: "Electro et sanitaires" },
    { id: "financial", label: "Estimation financière" }
  ];

  return (
    <div className="space-y-6">
      {/* Tertiary Navigation */}
      <div className="flex items-center gap-2 p-2" style={{ backgroundColor: "#F8F9FA", border: "1px solid #E4E4E7", borderRadius: "100px" }}>
        {tertiaryTabs.map((tab) => {
          const isActive = activeTertiaryTab === tab.id;
          const hasNote = tabNotes[tab.id] && tabNotes[tab.id].trim() !== "";
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTertiaryTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? "#1F2027" : "#8A8A8A",
                border: isActive ? "1px solid #E4E4E7" : "none",
                borderRadius: "80px"
              }}
            >
              <span>{tab.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteClick(tab.id, tab.label);
                }}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[#E4E4E7] hover:bg-gray-50 transition-colors text-neutral-600 font-bold leading-none"
                title={`Ajouter une note à ${tab.label}`}
              >
                {hasNote ? (
                  <Clipboard className="size-4 text-[#1F2027]" />
                ) : (
                  "+"
                )}
              </button>
            </button>
          );
        })}
      </div>

      {/* Add Appliance Modal */}
      <AddApplianceModal
        isOpen={addApplianceModalOpen}
        onClose={() => {
          setAddApplianceModalOpen(false);
          setApplianceSelection("");
          setApplianceSearch("");
        }}
        onAddNew={handleAddApplianceNew}
        onAddExisting={handleAddApplianceExisting}
        searchValue={applianceSearch}
        onSearchChange={setApplianceSearch}
        selectedValue={applianceSelection}
        onSelectionChange={setApplianceSelection}
      />

      {/* Delete Modal */}
      {deleteModalOpen && deleteModalData && (
        <ConfirmDeleteModal
          title={deleteModalData.title}
          message={deleteModalData.message}
          itemType={deleteModalData.itemType}
          onCancel={() => {
            setDeleteModalOpen(false);
            setDeleteModalData(null);
          }}
          onConfirm={confirmDelete}
        />
      )}

      {/* Note Modal */}
      {noteModalOpen && noteModalTab && (
        <NoteModal
          title={noteModalTab.label}
          content={tabNotes[noteModalTab.id]}
          onSave={handleNoteSave}
          onClose={() => setNoteModalOpen(false)}
        />
      )}

      {/* Ambiance Content */}
      {activeTertiaryTab === "ambiance" && (
        <div className="space-y-6">
          {/* Section Ambiance */}
          <FormSection title="Ambiance">
            <FormField label="Ambiance(s) recherchée(s)">
              <textarea
                value={formData.ambianceTypes}
                onChange={(e) => updateField("ambianceTypes", e.target.value)}
                placeholder="Écrire les ambiances recherchées"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Ambiance appréciée">
              <textarea
                value={formData.ambianceAppreciated}
                onChange={(e) => updateField("ambianceAppreciated", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Ambiance à éviter">
              <textarea
                value={formData.ambianceToAvoid}
                onChange={(e) => updateField("ambianceToAvoid", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>

          {/* Section Modèle final */}
          <FormSection title="Modèle final (Présentation client)">
            <FormField label="Mobilier">
              <textarea
                value={formData.furniture}
                onChange={(e) => updateField("furniture", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Poignées">
              <textarea
                value={formData.handles}
                onChange={(e) => updateField("handles", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Plan de travail">
              <textarea
                value={formData.worktop}
                onChange={(e) => updateField("worktop", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>

          {/* Section Matériaux client conservés */}
          <FormSection title="Matériaux client conservés">
            <FormField label="Sol cuisine">
              <textarea
                value={formData.kitchenFloor}
                onChange={(e) => updateField("kitchenFloor", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Mur cuisine">
              <textarea
                value={formData.kitchenWall}
                onChange={(e) => updateField("kitchenWall", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Autre(s)">
              <textarea
                value={formData.other}
                onChange={(e) => updateField("other", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Sélection mobilier" span={1}>
              <SelectInput
                value={formData.furnitureSelection}
                onChange={(value) => updateField("furnitureSelection", value)}
                placeholder="Sélectionner"
              />
            </FormField>
            <FormField label="Description (Sol, mur, déco, etc…)" span={2}>
              <textarea
                value={formData.materialsDescription}
                onChange={(e) => updateField("materialsDescription", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>
        </div>
      )}

      {/* Furniture Tab Content */}
      {activeTertiaryTab === "furniture" && (
        <div className="space-y-6">
          {/* Rangements */}
          <FormSection title="Rangements">
            <FormField label="Volume de rangement actuel">
              <textarea
                value={formData.storageCurrentVolume}
                onChange={(e) => updateField("storageCurrentVolume", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Volume de rangement souhaité">
              <textarea
                value={formData.storageDesiredVolume}
                onChange={(e) => updateField("storageDesiredVolume", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>

          {/* Accessoires de meuble */}
          <FormSection title="Accessoires de meuble">
            <FormField label="Sélectionner les accessoires" span={1}>
              <SelectInput
                value={formData.furnitureAccessories}
                onChange={(value) => updateField("furnitureAccessories", value)}
                placeholder="Sélectionner"
                options={accessoriesOptions}
              />
            </FormField>
            <FormField label="Commentaire" span={2}>
              <textarea
                value={formData.accessoriesComment}
                onChange={(e) => updateField("accessoriesComment", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>

          {/* Éclairages */}
          <FormSection title="Éclairages">
            <FormField label="Luminosité pièce" span={1}>
              <SelectInput
                value={formData.lightingBrightness}
                onChange={(value) => updateField("lightingBrightness", value)}
                placeholder="Sélectionner"
                options={brightnessOptions}
              />
            </FormField>
            <FormField label="Température de l'éclairage" span={1}>
              <SelectInput
                value={formData.lightingTemperature}
                onChange={(value) => updateField("lightingTemperature", value)}
                placeholder="Sélectionner"
                options={temperatureOptions}
              />
            </FormField>
            <FormField label="Description de l'éclairage" span={1}>
              <textarea
                value={formData.lightingDescription}
                onChange={(e) => updateField("lightingDescription", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>

          {/* Plan de dépose */}
          <FormSection title="Plan de dépose">
            <FormField label="Appareil.s à poser" span={1}>
              <SelectInput
                value={formData.uninstallApparatus}
                onChange={(value) => updateField("uninstallApparatus", value)}
                placeholder="Sélectionner"
                options={apparatusOptions}
              />
            </FormField>
            <FormField label="Longueur à prévoir" span={1}>
              <TextInput
                value={formData.uninstallLength}
                onChange={(value) => updateField("uninstallLength", value)}
                placeholder="En mm"
              />
            </FormField>
            <FormField label="Description" span={1}>
              <textarea
                value={formData.uninstallDescription}
                onChange={(e) => updateField("uninstallDescription", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>

          {/* Plan de préparation */}
          <FormSection title="Plan de préparation">
            <FormField label="Longueur à prévoir (en mm)" span={1}>
              <TextInput
                value={formData.preparationLength}
                onChange={(value) => updateField("preparationLength", value)}
                placeholder="En mm"
              />
            </FormField>
          </FormSection>

          {/* Plan de travail */}
          <FormSection title="Plan de travail">
            <FormField label="Hauteur actuelle (en mm)" span={1}>
              <TextInput
                value={formData.worktopCurrentHeight}
                onChange={(value) => updateField("worktopCurrentHeight", value)}
                placeholder="En mm"
              />
            </FormField>
            <FormField label="Hauteur souhaitée (en mm)" span={1}>
              <TextInput
                value={formData.worktopDesiredHeight}
                onChange={(value) => updateField("worktopDesiredHeight", value)}
                placeholder="En mm"
              />
            </FormField>
          </FormSection>

          {/* Usage Cuisine */}
          <FormSection title="Usage Cuisine">
            {/* Personnes partageant le repas - Première ligne (2 groupes côte à côte) */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personnes partageant le repas quotidiennement */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#2B2E38]">Personnes partageant le repas quotidiennement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#2B2E38]">Adultes</label>
                    <NumberSpinner
                      value={formData.dailyMealAdults}
                      onChange={(value) => updateField("dailyMealAdults", value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#2B2E38]">Enfants</label>
                    <NumberSpinner
                      value={formData.dailyMealChildren}
                      onChange={(value) => updateField("dailyMealChildren", value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Personnes partageant le repas exceptionnellement */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#2B2E38]">Personnes partageant le repas exceptionnellement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#2B2E38]">Adultes</label>
                    <NumberSpinner
                      value={formData.exceptionalMealAdults}
                      onChange={(value) => updateField("exceptionalMealAdults", value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#2B2E38]">Enfants</label>
                    <NumberSpinner
                      value={formData.exceptionalMealChildren}
                      onChange={(value) => updateField("exceptionalMealChildren", value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Objectif.s nouvelle cuisine - Deuxième ligne */}
            <FormField label="Objectif.s nouvelle cuisine" span={1}>
              <SelectInput
                value={formData.kitchenObjectives}
                onChange={(value) => updateField("kitchenObjectives", value)}
                placeholder="Sélectionner"
                options={kitchenObjectivesOptions}
              />
            </FormField>

          </FormSection>

          {/* Type de rangements */}
          <FormSection title="Type de rangements">
            <FormField label="Meubles bas" span={1}>
              <SelectInput
                value={formData.lowFurniture}
                onChange={(value) => updateField("lowFurniture", value)}
                placeholder="Sélectionner"
                options={lowFurnitureOptions}
              />
            </FormField>
            <FormField label="Meubles hauts" span={1}>
              <SelectInput
                value={formData.highFurniture}
                onChange={(value) => updateField("highFurniture", value)}
                placeholder="Sélectionner"
                options={highFurnitureOptions}
              />
            </FormField>
            <FormField label="Colonnes" span={1}>
              <SelectInput
                value={formData.columns}
                onChange={(value) => updateField("columns", value)}
                placeholder="Sélectionner"
                options={columnOptions}
              />
            </FormField>
            <FormField label="Description meubles bas" span={1}>
              <textarea
                value={formData.lowFurnitureDescription}
                onChange={(e) => updateField("lowFurnitureDescription", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Description meubles hauts" span={1}>
              <textarea
                value={formData.highFurnitureDescription}
                onChange={(e) => updateField("highFurnitureDescription", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Description colonnes" span={1}>
              <textarea
                value={formData.columnsDescription}
                onChange={(e) => updateField("columnsDescription", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
            <FormField label="Gestion des déchets" span={3}>
              <textarea
                value={formData.furnitureWasteManagement}
                onChange={(e) => updateField("furnitureWasteManagement", e.target.value)}
                placeholder="Écrire un commentaire"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 resize-none"
              />
            </FormField>
          </FormSection>
        </div>
      )}

      {/* Appliances Tab Content */}
      {activeTertiaryTab === "appliances" && (
        <ProjectArticlesTab project={project} />
      )}

      {/* OLD APPLIANCES SECTION - KEPT FOR REFERENCE */}
      {false && (
        <div className="space-y-6">
          {/* Appliances Section */}
          <div className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
            {/* Header with title and add button */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F8F9FC]">
              <h3 className="text-lg font-semibold text-[#1F2027]">Liste des électroménagers</h3>
              <button
                onClick={handleAddApplianceClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E4E4E7] bg-white text-sm font-medium text-[#1F2027] hover:bg-neutral-50 transition-colors"
              >
                <Plus className="size-4" />
                Ajouter un électroménager
              </button>
            </div>

            {/* Total price blocks */}
            <div className="px-6 pt-4 pb-4 bg-[#F8F9FC]">
              <div className="grid grid-cols-2 gap-4">
                {/* Total min */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E4E4E7] hover:border-[#D4D4D7] transition-colors group">
                  <span className="text-sm text-[#6B7280]">Total min (TTC)</span>
                  <div className="flex items-center gap-0">
                    <span className="text-sm font-semibold text-[#1F2027]">{applianceTotals.min}</span>
                    <span className="text-sm font-semibold text-[#1F2027]">€</span>
                  </div>
                </div>
                {/* Total max */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E4E4E7] hover:border-[#D4D4D7] transition-colors group">
                  <span className="text-sm text-[#6B7280]">Total max (TTC)</span>
                  <div className="flex items-center gap-0">
                    <span className="text-sm font-semibold text-[#1F2027]">{applianceTotals.max}</span>
                    <span className="text-sm font-semibold text-[#1F2027]">€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appliances list */}
            <div className="px-6 pb-6 bg-[#F8F9FC] rounded-b-lg">
              <div className="space-y-3">
                {appliances.map((appliance) => (
                  <div key={appliance.id} className="bg-white rounded-lg border border-[#E4E4E7]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-[#1F2027]">
                        {appliance.name || "Saisir le nom de l'électroménager"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedAppliances({ ...expandedAppliances, [appliance.id]: !expandedAppliances[appliance.id] })}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#1F2027] transition-colors"
                          aria-label="Dérouler"
                        >
                          <ChevronDown className={`size-4 transition-transform ${expandedAppliances[appliance.id] ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteAppliance(appliance)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded transition-colors"
                          aria-label="Supprimer cet électroménager"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {expandedAppliances[appliance.id] && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#E4E4E7] space-y-4">
                        {/* Questions */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Quand utilisez-vous votre plaque de cuisson ?</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Préférez-vous une plaque visible ou cachée ?</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Installation en évacuation extérieure ou recyclage</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                        </div>

                        {/* More questions */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Au bruit de la plaque</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Aux odeurs</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">La graisse qui se dépose dans la cuisine</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                        </div>

                        {/* Product catalog section */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-[#6B7280]">Qui fournit ?</label>
                          <div className="bg-[#F3F4F6] rounded-lg p-4 space-y-3">
                            <select
                              value={applianceSupplier[appliance.id] || ""}
                              onChange={(e) => setApplianceSupplier({ ...applianceSupplier, [appliance.id]: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option value="">A fournir</option>
                              <option value="client">Le client fournit</option>
                            </select>

                            {/* Article catalog inside gray block - Only show if not "Le client fournit" */}
                            {applianceSupplier[appliance.id] !== "client" && (
                              <div className="space-y-2 pt-2 border-t border-[#E1E4ED]">
                                {/* White container with header and table */}
                                <div className="bg-white rounded-lg border border-[#E1E4ED] overflow-hidden">
                                  {/* Header with title and button */}
                                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E4ED]">
                                    <h4 className="text-sm font-semibold text-[#1F2027]">Article produit catalogue/générique</h4>
                                    <button
                                      onClick={() => {
                                        setAddArticleModalType('appliance');
                                        setAddArticleModalCurrentId(appliance.id);
                                        setAddArticleModalData({ catalogOrGeneric: "generic", family: "", article: "" });
                                        setAddArticleModalOpen(true);
                                      }}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-[#F8F9FA] text-[#323130] text-xs font-medium hover:bg-[#F0F0F0] transition-colors"
                                    >
                                      <Plus className="size-3.5" />
                                      Ajouter un article
                                    </button>
                                  </div>

                                  {/* Table */}
                                  {applianceArticles[appliance.id] && applianceArticles[appliance.id].length > 0 ? (
                                    <div className="overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-[#F3F4F6] border-b border-[#E1E4ED]">
                                            <th className="px-4 py-2 text-left font-semibold text-[#1F2027]">Référence produit</th>
                                            <th className="px-4 py-2 text-left font-semibold text-[#1F2027]">Description</th>
                                            <th className="px-4 py-2 text-right font-semibold text-[#1F2027]">Prix mini TTC</th>
                                            <th className="px-4 py-2 text-right font-semibold text-[#1F2027]">Prix maxi TTC</th>
                                            <th className="px-4 py-2 text-center font-semibold text-[#1F2027]"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {applianceArticles[appliance.id].map((article, idx) => {
                                            const familyKey = `${article.family}-${article.article.split('-')[article.article.split('-').length - 1]}`;
                                            const productData = mockProducts[familyKey] || { ref: "N/A", description: article.article, minPrice: "0", maxPrice: "0" };
                                            return (
                                              <tr key={idx} className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                                                <td className="px-4 py-2 text-[#1F2027] font-medium">{productData.ref}</td>
                                                <td className="px-4 py-2 text-[#1F2027]">{productData.description}</td>
                                                <td className="px-4 py-2 text-right text-[#1F2027] font-medium">{productData.minPrice}€</td>
                                                <td className="px-4 py-2 text-right text-[#1F2027] font-medium">{productData.maxPrice}€</td>
                                                <td className="px-4 py-2 text-center">
                                                  <button
                                                    onClick={() => {
                                                      setApplianceArticles({
                                                        ...applianceArticles,
                                                        [appliance.id]: applianceArticles[appliance.id].filter((_, i) => i !== idx)
                                                      });
                                                    }}
                                                    className="p-1 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded transition-colors"
                                                  >
                                                    <Trash2 className="size-4" />
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="px-4 py-8 text-center text-[#A1A7B6] text-sm">
                                      Aucun article ajouté
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {appliances.length === 0 && (
                  <div className="text-center text-neutral-500 py-8">
                    Aucun électroménager ajouté
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sanitaries Section */}
          <div className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
            {/* Header with title and add button */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F8F9FC]">
              <h3 className="text-lg font-semibold text-[#1F2027]">Liste des sanitaires</h3>
              <button
                onClick={() => {
                  const newId = Math.max(...sanitaries.map(s => s.id), 0) + 1;
                  setSanitaries([...sanitaries, { id: newId, name: "" }]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E4E4E7] bg-white text-sm font-medium text-[#1F2027] hover:bg-neutral-50 transition-colors"
              >
                <Plus className="size-4" />
                Ajouter un sanitaire
              </button>
            </div>

            {/* Total price blocks */}
            <div className="px-6 pt-4 pb-4 bg-[#F8F9FC]">
              <div className="grid grid-cols-2 gap-4">
                {/* Total min */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E4E4E7] hover:border-[#D4D4D7] transition-colors group">
                  <span className="text-sm text-[#6B7280]">Total min (TTC)</span>
                  <div className="flex items-center gap-0">
                    <span className="text-sm font-semibold text-[#1F2027]">{sanitaryTotals.min}</span>
                    <span className="text-sm font-semibold text-[#1F2027]">€</span>
                  </div>
                </div>
                {/* Total max */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E4E4E7] hover:border-[#D4D4D7] transition-colors group">
                  <span className="text-sm text-[#6B7280]">Total max (TTC)</span>
                  <div className="flex items-center gap-0">
                    <span className="text-sm font-semibold text-[#1F2027]">{sanitaryTotals.max}</span>
                    <span className="text-sm font-semibold text-[#1F2027]">€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sanitaries list */}
            <div className="px-6 pb-6 bg-[#F8F9FC]">
              <div className="space-y-3">
                {sanitaries.map((sanitary) => (
                  <div key={sanitary.id} className="bg-white rounded-lg border border-[#E4E4E7]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-[#1F2027]">
                        {sanitary.name || "Saisir le nom du sanitaire"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedSanitaries({ ...expandedSanitaries, [sanitary.id]: !expandedSanitaries[sanitary.id] })}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#1F2027] transition-colors"
                          aria-label="Dérouler"
                        >
                          <ChevronDown className={`size-4 transition-transform ${expandedSanitaries[sanitary.id] ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteSanitary(sanitary)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded transition-colors"
                          aria-label="Supprimer ce sanitaire"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {expandedSanitaries[sanitary.id] && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#E4E4E7] space-y-4">
                        {/* Questions */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Quand utilisez-vous votre évier ?</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Matière souhaitée ?</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs text-[#6B7280]">Nombre de bac</label>
                            <select className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option>Sélectionner</option>
                            </select>
                          </div>
                        </div>

                        {/* Product catalog section */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-[#6B7280]">Qui fournit ?</label>
                          <div className="bg-[#F3F4F6] rounded-lg p-4 space-y-3">
                            <select
                              value={sanitarySupplier[sanitary.id] || ""}
                              onChange={(e) => setSanitarySupplier({ ...sanitarySupplier, [sanitary.id]: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%3E%3Cpath%20d=%27M2%202L6%206L10%202%27%20stroke=%27%235F6470%27%20stroke-width=%271.5%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[length:12px] bg-[position:calc(100%-10px)_center] pr-8">
                              <option value="">A fournir</option>
                              <option value="client">Le client fournit</option>
                            </select>

                            {/* Article catalog inside gray block - Only show if not "Le client fournit" */}
                            {sanitarySupplier[sanitary.id] !== "client" && (
                              <div className="space-y-2 pt-2 border-t border-[#E1E4ED]">
                                {/* White container with header and table */}
                                <div className="bg-white rounded-lg border border-[#E1E4ED] overflow-hidden">
                                  {/* Header with title and button */}
                                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E4ED]">
                                    <h4 className="text-sm font-semibold text-[#1F2027]">Article produit catalogue/générique</h4>
                                    <button
                                      onClick={() => {
                                        setAddArticleModalType('sanitary');
                                        setAddArticleModalCurrentId(sanitary.id);
                                        setAddArticleModalData({ catalogOrGeneric: "generic", family: "", article: "" });
                                        setAddArticleModalOpen(true);
                                      }}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-[#F8F9FA] text-[#323130] text-xs font-medium hover:bg-[#F0F0F0] transition-colors"
                                    >
                                      <Plus className="size-3.5" />
                                      Ajouter un article
                                    </button>
                                  </div>

                                  {/* Table */}
                                  {sanitaryArticles[sanitary.id] && sanitaryArticles[sanitary.id].length > 0 ? (
                                    <div className="overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-[#F3F4F6] border-b border-[#E1E4ED]">
                                            <th className="px-4 py-2 text-left font-semibold text-[#1F2027]">Référence produit</th>
                                            <th className="px-4 py-2 text-left font-semibold text-[#1F2027]">Description</th>
                                            <th className="px-4 py-2 text-right font-semibold text-[#1F2027]">Prix mini TTC</th>
                                            <th className="px-4 py-2 text-right font-semibold text-[#1F2027]">Prix maxi TTC</th>
                                            <th className="px-4 py-2 text-center font-semibold text-[#1F2027]"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {sanitaryArticles[sanitary.id].map((article, idx) => {
                                            const familyKey = `${article.family}-${article.article.split('-')[article.article.split('-').length - 1]}`;
                                            const productData = mockProducts[familyKey] || { ref: "N/A", description: article.article, minPrice: "0", maxPrice: "0" };
                                            return (
                                              <tr key={idx} className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                                                <td className="px-4 py-2 text-[#1F2027] font-medium">{productData.ref}</td>
                                                <td className="px-4 py-2 text-[#1F2027]">{productData.description}</td>
                                                <td className="px-4 py-2 text-right text-[#1F2027] font-medium">{productData.minPrice}€</td>
                                                <td className="px-4 py-2 text-right text-[#1F2027] font-medium">{productData.maxPrice}€</td>
                                                <td className="px-4 py-2 text-center">
                                                  <button
                                                    onClick={() => {
                                                      setSanitaryArticles({
                                                        ...sanitaryArticles,
                                                        [sanitary.id]: sanitaryArticles[sanitary.id].filter((_, i) => i !== idx)
                                                      });
                                                    }}
                                                    className="p-1 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded transition-colors"
                                                  >
                                                    <Trash2 className="size-4" />
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="px-4 py-8 text-center text-[#A1A7B6] text-sm">
                                      Aucun article ajouté
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {sanitaries.length === 0 && (
                  <div className="text-center text-neutral-500 py-8">
                    Aucun sanitaire ajouté
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Estimation Section */}
      {activeTertiaryTab === "financial" && (
        <div className="space-y-6">
          {/* Financial Estimation Block */}
          <div className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
            {/* Header - All elements on one line */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F8F9FC]">
              {/* Title */}
              <h3 className="text-lg font-semibold text-[#1F2027] flex-shrink-0">Estimation enveloppe financière</h3>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Total min block */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E4E4E7] hover:border-[#D4D4D7] transition-colors group min-w-[200px]">
                <span className="text-sm text-[#6B7280]">Total min (TTC)</span>
                <div className="flex items-center gap-0">
                  <span className="text-sm font-semibold text-[#1F2027]">{(() => {
                    const mobilier = parseInt(financialEstimationData.mobilierMin) || 0;
                    const planTravail = parseInt(financialEstimationData.planTravailMin) || 0;
                    const accessoireMeuble = parseInt(financialEstimationData.accessoireMeubleMin) || 0;
                    const electromenager = applianceTotals.min || 0;
                    const sanitaire = sanitaryTotals.min || 0;
                    const mainOeuvreXL = parseInt(financialEstimationData.mainOeuvreXLMin) || 0;
                    const livraison = parseInt(financialEstimationData.livraisonMin) || 0;
                    const mainOeuvreArtisans = parseInt(financialEstimationData.mainOeuvreArtisansMin) || 0;
                    return (mobilier + planTravail + accessoireMeuble + electromenager + sanitaire + mainOeuvreXL + livraison + mainOeuvreArtisans).toLocaleString('fr-FR');
                  })()}</span>
                  <span className="text-sm font-semibold text-[#1F2027]">€</span>
                </div>
              </div>

              {/* Total max block */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E4E4E7] hover:border-[#D4D4D7] transition-colors group min-w-[200px] mx-2">
                <span className="text-sm text-[#6B7280]">Total max (TTC)</span>
                <div className="flex items-center gap-0">
                  <span className="text-sm font-semibold text-[#1F2027]">{(() => {
                    const mobilier = parseInt(financialEstimationData.mobilierMax) || 0;
                    const planTravail = parseInt(financialEstimationData.planTravailMax) || 0;
                    const accessoireMeuble = parseInt(financialEstimationData.accessoireMeubleMax) || 0;
                    const electromenager = applianceTotals.max || 0;
                    const sanitaire = sanitaryTotals.max || 0;
                    const mainOeuvreXL = parseInt(financialEstimationData.mainOeuvreXLMax) || 0;
                    const livraison = parseInt(financialEstimationData.livraisonMax) || 0;
                    const mainOeuvreArtisans = parseInt(financialEstimationData.mainOeuvreArtisansMax) || 0;
                    return (mobilier + planTravail + accessoireMeuble + electromenager + sanitaire + mainOeuvreXL + livraison + mainOeuvreArtisans).toLocaleString('fr-FR');
                  })()}</span>
                  <span className="text-sm font-semibold text-[#1F2027]">€</span>
                </div>
              </div>

              {/* Generate quote button */}
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E4E4E7] bg-white text-sm font-medium text-[#1F2027] hover:bg-neutral-50 transition-colors flex-shrink-0">
                Générer un devis
              </button>

              {/* Collapse/Expand button */}
              <button
                onClick={() => setFinancialEstimationExpanded(!financialEstimationExpanded)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#1F2027] transition-colors flex-shrink-0"
                aria-label="Replier/Dérouler"
              >
                <ChevronDown className={`size-4 transition-transform ${financialEstimationExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable content */}
            {financialEstimationExpanded && (
              <div className="px-6 pb-6 bg-[#F8F9FC] rounded-b-lg">
                {/* Financial estimation table */}
                <div className="bg-white rounded-lg border border-[#E1E4ED] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F3F4F6] border-b border-[#E1E4ED]">
                        <th className="px-4 py-2 text-left font-semibold text-[#1F2027]">Métier</th>
                        <th className="px-4 py-2 text-right font-semibold text-[#1F2027]">Prix mini</th>
                        <th className="px-4 py-2 text-right font-semibold text-[#1F2027]">Prix maxi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Mobilier */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Mobilier</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.mobilierMin}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, mobilierMin: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.mobilierMax}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, mobilierMax: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                      </tr>

                      {/* Plan de travail */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Plan de travail</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.planTravailMin}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, planTravailMin: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.planTravailMax}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, planTravailMax: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                      </tr>

                      {/* Accessoire meuble */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Accessoire meuble</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.accessoireMeubleMin}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, accessoireMeubleMin: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.accessoireMeubleMax}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, accessoireMeubleMax: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                      </tr>

                      {/* Électroménager (not editable) */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB] bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Électroménager</td>
                        <td className="px-4 py-2 text-right">
                          <span className="text-[#1F2027] font-medium">{applianceTotals.min.toLocaleString('fr-FR')}€</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="text-[#1F2027] font-medium">{applianceTotals.max.toLocaleString('fr-FR')}€</span>
                        </td>
                      </tr>

                      {/* Sanitaire & ses accessoires (not editable) */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB] bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Sanitaire & ses accessoires</td>
                        <td className="px-4 py-2 text-right">
                          <span className="text-[#1F2027] font-medium">{sanitaryTotals.min.toLocaleString('fr-FR')}€</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="text-[#1F2027] font-medium">{sanitaryTotals.max.toLocaleString('fr-FR')}€</span>
                        </td>
                      </tr>

                      {/* Main d'oeuvre XL */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Main d'oeuvre XL</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.mainOeuvreXLMin}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, mainOeuvreXLMin: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.mainOeuvreXLMax}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, mainOeuvreXLMax: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                      </tr>

                      {/* Livraison */}
                      <tr className="border-b border-[#E1E4ED] hover:bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Livraison</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.livraisonMin}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, livraisonMin: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.livraisonMax}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, livraisonMax: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                      </tr>

                      {/* Main d'oeuvre artisans */}
                      <tr className="hover:bg-[#F9FAFB]">
                        <td className="px-4 py-2 text-[#1F2027] font-medium">Main d'oeuvre artisans</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.mainOeuvreArtisansMin}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, mainOeuvreArtisansMin: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={financialEstimationData.mainOeuvreArtisansMax}
                              onChange={(e) => setFinancialEstimationData({ ...financialEstimationData, mainOeuvreArtisansMax: e.target.value })}
                              placeholder="0"
                              className="w-24 px-2 py-1 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-right"
                            />
                            <span className="text-[#6B7280] font-medium">€</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Simulation Block */}
      {activeTertiaryTab === "financial" && (
        <div className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F8F9FC]">
            <h3 className="text-lg font-semibold text-[#1F2027] flex-shrink-0">Simulation de règlement</h3>

            {/* Collapse/Expand button */}
            <button
              onClick={() => setPaymentSimulationExpanded(!paymentSimulationExpanded)}
              className="p-1.5 text-[#9CA3AF] hover:text-[#1F2027] transition-colors flex-shrink-0 ml-auto"
              aria-label="Replier/Dérouler"
            >
              <ChevronDown className={`size-4 transition-transform ${paymentSimulationExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable content */}
          {paymentSimulationExpanded && (
            <div className="px-6 pb-6 bg-[#F8F9FC] rounded-b-lg">
              <div className="flex gap-4">
                {/* Montant total */}
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-[#2B2E38]">Montant total</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={paymentSimulationData.montantTotal}
                      onChange={(e) => setPaymentSimulationData({ ...paymentSimulationData, montantTotal: e.target.value })}
                      placeholder="0"
                      className="flex-1 px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
                    />
                    <span className="text-[#6B7280] font-medium">€</span>
                  </div>
                </div>

                {/* Pourcentage acompte */}
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-[#2B2E38]">Pourcentage acompte</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={paymentSimulationData.pourcentageAcompte}
                      onChange={(e) => setPaymentSimulationData({ ...paymentSimulationData, pourcentageAcompte: e.target.value })}
                      placeholder="0"
                      className="flex-1 px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
                    />
                    <span className="text-[#6B7280] font-medium">%</span>
                  </div>
                </div>

                {/* Montant acompte (non-editable) */}
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-[#2B2E38]">Montant acompte</label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-[#F3F4F6] text-sm text-[#1F2027]">
                      <span className="font-medium">
                        {(() => {
                          const montantTotal = parseInt(paymentSimulationData.montantTotal) || 0;
                          const pourcentage = parseInt(paymentSimulationData.pourcentageAcompte) || 0;
                          return ((montantTotal * pourcentage) / 100).toLocaleString('fr-FR');
                        })()}
                      </span>
                    </div>
                    <span className="text-[#6B7280] font-medium">€</span>
                  </div>
                </div>

                {/* Livraison (non-editable) */}
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-[#2B2E38]">Livraison</label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-[#F3F4F6] text-sm text-[#1F2027]">
                      <span className="font-medium">
                        {(() => {
                          const montantTotal = parseInt(paymentSimulationData.montantTotal) || 0;
                          const pourcentage = parseInt(paymentSimulationData.pourcentageAcompte) || 0;
                          const acompte = (montantTotal * pourcentage) / 100;
                          return (montantTotal - acompte).toLocaleString('fr-FR');
                        })()}
                      </span>
                    </div>
                    <span className="text-[#6B7280] font-medium">€</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTertiaryTab !== "ambiance" && activeTertiaryTab !== "furniture" && activeTertiaryTab !== "appliances" && activeTertiaryTab !== "financial" && (
        <FormSection title={tertiaryTabs.find(t => t.id === activeTertiaryTab)?.label}>
          <FormField label="" span={3}>
            <div className="text-center text-neutral-500 py-8">
              Contenu à venir
            </div>
          </FormField>
        </FormSection>
      )}

      {/* Add Article Modal */}
      {addArticleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg w-full mx-4" style={{ maxWidth: '740px', height: '577px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
            {/* Modal Header - Gray background */}
            <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#E1E4ED] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo in small square */}
                <div className="w-8 h-8 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 9.16667L10 11.6667L18.3333 3.33333M17.5 10V15C17.5 16.3807 16.3807 17.5 15 17.5H5C3.61929 17.5 2.5 16.3807 2.5 15V5C2.5 3.61929 3.61929 2.5 5 2.5H13.3333" stroke="#323130" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* Title */}
                <h3 className="text-sm font-semibold text-[#1F2027]">Ajouter un article catalogue ou générique</h3>
              </div>
              {/* Close button */}
              <button
                onClick={() => setAddArticleModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                <X className="size-4 text-[#1F2027]" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {/* Block 1: Article catalogue ou générique */}
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <div className="text-xs text-[#6B7280] font-medium mb-3">Article catalogue ou générique</div>
                <select
                  value={addArticleModalData.catalogOrGeneric}
                  onChange={(e) => setAddArticleModalData({ ...addArticleModalData, catalogOrGeneric: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270%200%2012%208%27 fill=%27none%27%3E%3Cpath d=%27M2%202L6%206L10%202%27 stroke=%27%235F6470%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '12px',
                    paddingRight: '36px'
                  }}
                >
                  <option value="generic">Générique</option>
                  <option value="catalog">Catalogue</option>
                </select>
              </div>

              {/* Block 2: Sélectionner la famille de l'article */}
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <div className="text-xs text-[#6B7280] font-medium mb-3">Sélectionner la famille de l'article</div>
                <select
                  value={addArticleModalData.family}
                  onChange={(e) => setAddArticleModalData({ ...addArticleModalData, family: e.target.value, article: "" })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270%200%2012%208%27 fill=%27none%27%3E%3Cpath d=%27M2%202L6%206L10%202%27 stroke=%27%235F6470%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '12px',
                    paddingRight: '36px'
                  }}
                >
                  <option value="">Sélectionner</option>
                  <option value="four">Four</option>
                  <option value="hotte">Hotte</option>
                  <option value="evier">Évier</option>
                  <option value="mitigeur">Mitigeur</option>
                </select>
              </div>

              {/* Block 3: Sélectionner l'article générique/catalogue */}
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <div className="text-xs text-[#6B7280] font-medium mb-3">
                  {addArticleModalData.catalogOrGeneric === "generic"
                    ? "Sélectionner l'article générique"
                    : "Sélectionner l'article catalogue"}
                </div>
                <select
                  value={addArticleModalData.article}
                  onChange={(e) => setAddArticleModalData({ ...addArticleModalData, article: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270%200%2012%208%27 fill=%27none%27%3E%3Cpath d=%27M2%202L6%206L10%202%27 stroke=%27%235F6470%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '12px',
                    paddingRight: '36px'
                  }}
                >
                  <option value="">Sélectionner</option>
                  {addArticleModalData.family === "four" && (
                    <>
                      <option value="four-bas">Four bas de gamme</option>
                      <option value="four-moyen">Four moyen de gamme</option>
                      <option value="four-haut">Four haut de gamme</option>
                    </>
                  )}
                  {addArticleModalData.family === "hotte" && (
                    <>
                      <option value="hotte-bas">Hotte bas de gamme</option>
                      <option value="hotte-moyen">Hotte moyen de gamme</option>
                      <option value="hotte-haut">Hotte haut de gamme</option>
                    </>
                  )}
                  {addArticleModalData.family === "evier" && (
                    <>
                      <option value="evier-bas">Évier bas de gamme</option>
                      <option value="evier-moyen">Évier moyen de gamme</option>
                      <option value="evier-haut">Évier haut de gamme</option>
                    </>
                  )}
                  {addArticleModalData.family === "mitigeur" && (
                    <>
                      <option value="mitigeur-bas">Mitigeur bas de gamme</option>
                      <option value="mitigeur-moyen">Mitigeur moyen de gamme</option>
                      <option value="mitigeur-haut">Mitigeur haut de gamme</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Modal Footer - Separator and buttons */}
            <div className="border-t border-[#E1E4ED] px-6 py-4 flex gap-3">
              <button
                onClick={() => setAddArticleModalOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#E4E4E7] bg-white text-[#323130] text-sm font-medium hover:bg-[#F8F9FA] transition-colors"
              >
                <Plus className="size-4" />
                Ajouter un nouvel article
              </button>
              <button
                onClick={() => {
                  if (addArticleModalData.family && addArticleModalData.article) {
                    if (addArticleModalType === 'appliance') {
                      setApplianceArticles({
                        ...applianceArticles,
                        [addArticleModalCurrentId]: [
                          ...(applianceArticles[addArticleModalCurrentId] || []),
                          { ...addArticleModalData }
                        ]
                      });
                    } else if (addArticleModalType === 'sanitary') {
                      setSanitaryArticles({
                        ...sanitaryArticles,
                        [addArticleModalCurrentId]: [
                          ...(sanitaryArticles[addArticleModalCurrentId] || []),
                          { ...addArticleModalData }
                        ]
                      });
                    }
                    setAddArticleModalOpen(false);
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#2B7FFF] text-white text-sm font-medium hover:bg-[#1E5FBF] transition-colors"
              >
                <Check className="size-4" />
                Ajouter l'article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Discovery Tab Content Component
function DiscoveryTabContent() {
  const [formData, setFormData] = useState({
    // Attribution
    agency: "travaux-confort",
    referent: "jeremy",
    // Origine
    origin: "",
    subOrigin: "",
    originName: "",
    sponsorLink: "",
    // Projet
    siteAddress: "",
    billingAddress: "",
    studyTrade: "",
    workExecution: "",
    artisansNeeded: false,
    artisansList: "",
    signatureDate: "",
    workDates: "",
    installationDate: "",
    // Enveloppe financière
    budgetLow: "",
    budgetHigh: "",
    globalBudget: "",
    financing: "",
    // Installation
    removal: "",
    installation: "",
    deliveryBy: "",
    technicalPlans: false,
    // Concurrence
    competitorsCount: "",
    competitors: "",
    competitorBudget: "",
    projectStatus: "",
    // Permis
    buildingPermit: false,
    permitDate: ""
  });

  const referentOptions = [
    { value: "jeremy", label: "Jérémy", initials: "J" }
  ];

  const selectedReferent = referentOptions.find(
    (option) => option.value === formData.referent
  );

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Attribution */}
      <FormSection title="Attribution">
        <FormField label="Agence">
          <SelectInput
            value={formData.agency}
            onChange={(value) => updateField("agency", value)}
            options={[
              { value: "travaux-confort", label: "Travaux Confort" }
            ]}
            placeholder="Sélectionner une agence"
          />
        </FormField>
        <FormField label="Agenceur référent">
          <div className="relative">
            <SelectInput
              value={formData.referent}
              onChange={(value) => updateField("referent", value)}
              options={referentOptions}
              placeholder="Sélectionner un agenceur"
            />
            {selectedReferent && (
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#FFE7D9] text-sm font-semibold text-[#D05A2B] shadow-[0_4px_12px_rgba(208,90,43,0.25)]">
                  {selectedReferent.initials}
                </span>
              </span>
            )}
          </div>
        </FormField>
      </FormSection>

      {/* Origine du projet */}
      <FormSection title="Origine du Projet">
        <FormField label="Origine de projet">
          <SelectInput
            value={formData.origin}
            onChange={(value) => updateField("origin", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Sous origine">
          <SelectInput
            value={formData.subOrigin}
            onChange={(value) => updateField("subOrigin", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Nom">
          <SelectInput
            value={formData.originName}
            onChange={(value) => updateField("originName", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Lien parrain">
          <SelectInput
            value={formData.sponsorLink}
            onChange={(value) => updateField("sponsorLink", value)}
            placeholder="Sélectionner"
          />
        </FormField>
      </FormSection>

      {/* Projet */}
      <FormSection title="Projet">
        <FormField label="Adresse chantier">
          <SelectInput
            value={formData.siteAddress}
            onChange={(value) => updateField("siteAddress", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Adresse facturation">
          <SelectInput
            value={formData.billingAddress}
            onChange={(value) => updateField("billingAddress", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Métier de l'étude">
          <SelectInput
            value={formData.studyTrade}
            onChange={(value) => updateField("studyTrade", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Exécution des travaux">
          <SelectInput
            value={formData.workExecution}
            onChange={(value) => updateField("workExecution", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Artisan(s) nécessaires" span={3}>
          <div className="space-y-3">
            <ToggleField
              label=""
              enabled={formData.artisansNeeded}
              onChange={(value) => updateField("artisansNeeded", value)}
            />
            {formData.artisansNeeded && (
              <SelectInput
                value={formData.artisansList}
                onChange={(value) => updateField("artisansList", value)}
                placeholder="Sélectionner les artisans"
              />
            )}
          </div>
        </FormField>
        <FormField label="Date prévisionnelle signature">
          <DateInput
            value={formData.signatureDate}
            onChange={(value) => updateField("signatureDate", value)}
          />
        </FormField>
        <FormField label="Dates prévisionnel chantier">
          <DateInput
            value={formData.workDates}
            onChange={(value) => updateField("workDates", value)}
          />
        </FormField>
        <FormField label="Date installation cuisine">
          <DateInput
            value={formData.installationDate}
            onChange={(value) => updateField("installationDate", value)}
          />
        </FormField>
      </FormSection>

      {/* Enveloppe financière */}
      <FormSection
        title="Enveloppe financière"
        action={
          <button className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            <Plus className="size-4" />
            Ajouter une note
          </button>
        }
      >
        <FormField label="Fourchette basse budget">
          <SelectInput
            value={formData.budgetLow}
            onChange={(value) => updateField("budgetLow", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Fourchette haute budget">
          <SelectInput
            value={formData.budgetHigh}
            onChange={(value) => updateField("budgetHigh", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Budget global du chantier">
          <SelectInput
            value={formData.globalBudget}
            onChange={(value) => updateField("globalBudget", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Financement du projet">
          <SelectInput
            value={formData.financing}
            onChange={(value) => updateField("financing", value)}
            placeholder="Sélectionner"
          />
        </FormField>
      </FormSection>

      {/* Installation */}
      <FormSection title="Installation">
        <FormField label="Dépose">
          <SelectInput
            value={formData.removal}
            onChange={(value) => updateField("removal", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Installation">
          <SelectInput
            value={formData.installation}
            onChange={(value) => updateField("installation", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Livraison à charge de">
          <SelectInput
            value={formData.deliveryBy}
            onChange={(value) => updateField("deliveryBy", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Plans techniques">
          <ToggleField
            label=""
            enabled={formData.technicalPlans}
            onChange={(value) => updateField("technicalPlans", value)}
          />
        </FormField>
      </FormSection>

      {/* Confrère(s) */}
      <FormSection title="Confrère(s)">
        <FormField label="Nombre de confrères consultés">
          <TextInput
            type="number"
            value={formData.competitorsCount}
            onChange={(value) => updateField("competitorsCount", value)}
            placeholder="0"
          />
        </FormField>
        <FormField label="Confrères">
          <SelectInput
            value={formData.competitors}
            onChange={(value) => updateField("competitors", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Budget">
          <TextInput
            value={formData.competitorBudget}
            onChange={(value) => updateField("competitorBudget", value)}
            placeholder="Montant"
          />
        </FormField>
        <FormField label="Statut des projets">
          <SelectInput
            value={formData.projectStatus}
            onChange={(value) => updateField("projectStatus", value)}
            placeholder="Sélectionner"
          />
        </FormField>
      </FormSection>

      {/* Permis de construire */}
      <FormSection title="Permis de construire">
        <FormField label="Permis de construire accordé">
          <ToggleField
            label=""
            enabled={formData.buildingPermit}
            onChange={(value) => updateField("buildingPermit", value)}
          />
        </FormField>
        {formData.buildingPermit && (
          <FormField label="Date d'obtention permis">
            <DateInput
              value={formData.permitDate}
              onChange={(value) => updateField("permitDate", value)}
            />
          </FormField>
        )}
      </FormSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#2C2F37] px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.25)] transition-transform hover:translate-y-[-1px]">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

// Progress Summary Sidebar Component
function ProgressSidebar({ isCollapsed, onToggle, headerHeight, progress = 0 }) {
  const steps = [
    { label: "Études à réaliser", progress: 2, color: "violet" },
    { label: "Étude", progress: progress, color: "green" },
    { label: "Commande", progress: 0, color: "neutral" },
    { label: "Installation", progress: 0, color: "neutral" }
  ];

  const getAccent = (step) => {
    if (step.progress >= 90) return "text-[#E663C5]";
    if (step.progress > 0) return "text-[#2C2F37]";
    return "text-[#9AA0AE]";
  };

  const getBackgroundColor = (step) => {
    if (step.progress >= 90) return "bg-[#E663C5]";
    if (step.progress > 0) return "bg-[#2C2F37]";
    return "bg-neutral-300";
  };

  const getStrokeColor = (step) => {
    if (step.progress >= 90) return "#E663C5";
    if (step.progress > 0) return "#2C2F37";
    return "#D1D5DB";
  };

  return (
    <aside
      className={`fixed right-0 bg-white border-l border-[#E5E5E5] hidden xl:flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`
      }}
    >
      {isCollapsed ? (
        // Collapsed view - toggle button + compact progress indicators
        <div className="flex flex-col p-3 gap-4">
          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="w-12 h-12 flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white hover:bg-neutral-50 transition-colors mx-auto"
            aria-label="Déplier le panneau"
          >
            <ChevronLeft className="size-4 text-neutral-600" />
          </button>

          {/* Progress indicators */}
          <div className="space-y-4">
            {steps.map((step) => {
              const accent = getAccent(step);
              const formatted = step.progress.toString().padStart(2, "0");
              const strokeColor = getStrokeColor(step);
              const radius = 14;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (step.progress / 100) * circumference;

              return (
                <div key={step.label} className="flex flex-col items-center gap-1.5">
                  {/* Circle with progress */}
                  <svg className="size-8 flex-shrink-0" viewBox="0 0 32 32">
                    {/* Background circle (gray) */}
                    <circle
                      cx="16"
                      cy="16"
                      r={radius}
                      fill="none"
                      stroke="#E5E5E5"
                      strokeWidth="2.5"
                    />
                    {/* Progress circle (colored) */}
                    <circle
                      cx="16"
                      cy="16"
                      r={radius}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      transform="rotate(-90 16 16)"
                    />
                  </svg>
                  {/* Percentage below */}
                  <span className={`text-xs font-semibold ${accent}`}>{formatted}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Expanded view - full details
        <div className="flex flex-col h-full">
          {/* Toggle button */}
          <div className="p-4 border-b border-[#E5E5E5]">
            <button
              onClick={onToggle}
              className="w-full h-10 flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white hover:bg-neutral-50 transition-colors"
              aria-label="Replier le panneau"
            >
              <ChevronRight className="size-4 text-neutral-600" />
            </button>
          </div>

          {/* Progress content */}
          <div className="p-6 flex-1">
            <h3 className="text-sm font-semibold text-neutral-900 mb-6">Avancement du projet</h3>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const accent = getAccent(step);
                const formatted = step.progress.toString().padStart(2, "0");
                const isLast = index === steps.length - 1;

                return (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">{step.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${accent}`}>{formatted}%</span>
                        <StageRing progress={step.progress} />
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          step.progress >= 90 ? 'bg-[#E663C5]' : step.progress > 0 ? 'bg-[#2C2F37]' : 'bg-neutral-300'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                    {!isLast && <div className="h-px bg-neutral-200 my-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function StageRing({ progress }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = progress >= 90 ? "#E663C5" : progress > 0 ? "#2C2F37" : "#D3D9E5";
  const background = progress >= 90 ? "#F4DFF0" : "#EEF1F7";

  return (
    <span className="relative inline-flex items-center justify-center">
      <svg className="size-[20px]" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r={radius} fill="none" stroke={background} strokeWidth="2" />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 10 10)"
        />
      </svg>
      <span className="absolute inset-0 rounded-full border border-white/40" aria-hidden />
    </span>
  );
}

function ItemBadge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#ECEEF5] bg-[#F8F9FC] px-4 py-2 text-sm font-medium text-[#2C2F37] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
      {icon}
      {label}
    </span>
  );
}

// Create Appointment Modal Component
function CreateAppointmentModal({ isOpen, onClose, onSave, preFilledData = {}, users = [] }) {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    location: preFilledData?.location || "",
    comments: ""
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    setFormData({
      title: "",
      startDate: "",
      startTime: "",
      location: preFilledData?.location || "",
      comments: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Planifier un rendez-vous</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Nom du rendez-vous"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Heure</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Lieu</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Lieu du rendez-vous"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Commentaires</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Ajouter des commentaires"
              rows="3"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            Créer le rendez-vous
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Project Detail Page Component
export default function ProjectDetailPage({
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
  projectId
}) {
  // Extract actual project ID (remove "project-detail-" prefix if present)
  const actualProjectId = projectId ? projectId.replace(/^project-detail-/, '') : null;

  // Fetch project data
  const { project, loading, error, updateProject } = useProject(actualProjectId);

  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  const [activeTab, setActiveTab] = useState("study");
  const [activeSubTab, setActiveSubTab] = useState("discovery");
  const [progressSidebarCollapsed, setProgressSidebarCollapsed] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(240);
  const headerRef = useRef(null);

  // Modal states
  const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project?.nom_projet || "");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleBack = () => {
    onNavigate("project-tracking");
  };

  // Button handlers
  const handleEdit = () => {
    setIsEditTitleModalOpen(true);
  };

  const handleSaveTitle = async () => {
    try {
      await updateProject({ nom_projet: editedTitle });
      setIsEditTitleModalOpen(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du titre:', err);
    }
  };

  const handleSchedule = () => {
    setIsScheduleModalOpen(true);
  };

  const handleAddTask = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleLost = async () => {
    if (confirm('Êtes-vous sûr de vouloir marquer ce projet comme perdu ?')) {
      try {
        await updateProject({ statut: 'Perdu' });
      } catch (err) {
        console.error('Erreur lors de la mise à jour du statut:', err);
      }
    }
  };

  const progressSidebarWidth = progressSidebarCollapsed ? 80 : 256;

  // Calculate header height (topbar + project header)
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const topBar = 64; // h-16 = 64px
        const projectHeaderHeight = headerRef.current.offsetHeight;
        setHeaderHeight(topBar + projectHeaderHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900">
        <Sidebar
          currentPage="project-tracking"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main
          className="lg:transition-[margin] lg:duration-200 min-h-screen flex items-center justify-center"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mb-4"></div>
            <p className="text-neutral-600">Chargement du projet...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900">
        <Sidebar
          currentPage="project-tracking"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main
          className="lg:transition-[margin] lg:duration-200 min-h-screen flex items-center justify-center"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="text-center">
            <p className="text-red-600 font-semibold">Erreur lors du chargement du projet</p>
            <p className="text-neutral-600 text-sm mt-2">{error || "Projet non trouvé"}</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Retour à la liste
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Format project data for display
  const formattedProject = project ? {
    id: project.id,
    type: project.type || "Non spécifié",
    createdAt: project.cree_le ? new Date(project.cree_le).toLocaleDateString('fr-FR') : "Date inconnue",
    title: project.nom_projet || "Sans titre",
    clientName: project.contact ? `${project.contact.prenom} ${project.contact.nom}`.toUpperCase() : project.nom_contact || "Client inconnu",
    phone: project.contact?.telephone || "Non renseigné",
    email: project.contact?.email || "Non renseigné",
    progress: project.progression || 0,
    progressLabel: project.statut || "Non défini"
  } : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900">
      <Sidebar
        currentPage="project-tracking"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />

      <main
        className="lg:transition-[margin] lg:duration-200 min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-[#E7E9EF] bg-white/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-neutral-900">Fiche projet</h1>
          </div>
          <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
        </header>

        {/* Project Header */}
        <div ref={headerRef} className="sticky top-16 z-20">
          <ProjectHeader
            project={formattedProject}
            onBack={handleBack}
            onEdit={handleEdit}
            onSchedule={handleSchedule}
            onAddTask={handleAddTask}
            onLost={handleLost}
          />
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
          onOpenSummary={() => console.log("Open summary")}
          progressSidebarWidth={progressSidebarWidth}
          progress={formattedProject?.progress || 0}
        />

        {/* Progress Sidebar - Fixed on the right */}
        <ProgressSidebar
          isCollapsed={progressSidebarCollapsed}
          onToggle={() => setProgressSidebarCollapsed(!progressSidebarCollapsed)}
          headerHeight={headerHeight}
          progress={formattedProject?.progress || 0}
        />

        {/* Content */}
        <div
          className="bg-[#F8F9FA] transition-[margin] duration-300"
          style={{ marginRight: `${progressSidebarWidth}px` }}
        >
          <div className="w-full pb-8 px-4 lg:px-6">
            <div className="bg-white border border-[#E5E5E5] border-t-0 rounded-b-lg p-8">
              {activeTab === "study" && activeSubTab === "discovery" && (
                <ProjectDiscoveryTab project={project} onUpdate={updateProject} />
              )}
              {activeTab === "study" && activeSubTab === "kitchen" && (
                <KitchenDiscoveryTabContent project={project} onUpdate={updateProject} />
              )}
              {activeTab === "study" && activeSubTab === "commercial" && (
                <CommercialPresentationTabContent />
              )}
              {activeTab === "study" && activeSubTab !== "discovery" && activeSubTab !== "kitchen" && activeSubTab !== "commercial" && (
                <div className="p-12 text-center text-neutral-500">
                  Contenu à venir
                </div>
              )}
              {activeTab === "tasks" && (
                <ProjectTasksTabContent project={project} />
              )}
              {activeTab === "calendar" && (
                <ProjectCalendarTab project={project} />
              )}
              {activeTab !== "study" && activeTab !== "tasks" && activeTab !== "calendar" && (
                <div className="p-12 text-center text-neutral-500">
                  Contenu à venir
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Title Modal */}
        {isEditTitleModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">Modifier le titre du projet</h3>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Titre du projet"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsEditTitleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveTitle}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Appointment Modal */}
        {isScheduleModalOpen && (
          <CreateAppointmentModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            onSave={(appointmentData) => {
              console.log("Rendez-vous créé:", appointmentData);
              setIsScheduleModalOpen(false);
            }}
            preFilledData={{
              clientName: formattedProject?.clientName || "",
              location: ""
            }}
            users={[]}
          />
        )}

        {/* Add Task Modal */}
        {isAddTaskModalOpen && (
          <CreateTaskOrMemoModal
            open={isAddTaskModalOpen}
            onClose={() => setIsAddTaskModalOpen(false)}
            onSubmit={async (payload) => {
              try {
                const taskData = {
                  titre: payload.kind === "Tâche" ? payload.taskType || "Tâche sans titre" : payload.memoName,
                  type: payload.kind,
                  id_projet: project?.id || null,
                  nom_projet: project?.nom_projet || null,
                  tag: payload.taskType || "Autre",
                  note: payload.note,
                  date_echeance: payload.dueDate || payload.memoEcheance,
                  statut: "non_commence",
                  id_affecte_a: payload.salarie || null
                };
                await createTache(taskData);
                setIsAddTaskModalOpen(false);
              } catch (err) {
                console.error("Erreur lors de la création de la tâche:", err);
              }
            }}
            preFilledClient={formattedProject?.clientName || ""}
            preFilledProject={formattedProject?.title || ""}
            employees={[]}
            commercials={[]}
          />
        )}
      </main>
    </div>
  );
}
