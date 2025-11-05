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
  X
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

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
function FormSection({ title, children, action }) {
  return (
    <section className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h3 className="text-lg font-semibold text-[#1F2027]">{title}</h3>
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
                <span className="text-sm text-[#374151]">{project.phone}</span>
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
function ProgressRing({ progress = 99 }) {
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
function TabNavigation({ activeTab, onTabChange, activeSubTab, onSubTabChange, onOpenSummary, progressSidebarWidth }) {
  const tabs = [
    { id: "study", label: "Étude client", hasProgress: true },
    { id: "tasks", label: "Tâches", count: 4 },
    { id: "calendar", label: "Calendrier" },
    { id: "documents", label: "Documents" }
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
                      <ProgressRing progress={99} />
                      <span className="text-xs font-semibold text-[#E663C5]">99%</span>
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

// Kitchen Discovery Tab Content Component
function KitchenDiscoveryTabContent() {
  const [activeTertiaryTab, setActiveTertiaryTab] = useState("ambiance");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteModalTab, setNoteModalTab] = useState(null);
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
    materialsDescription: ""
  });
  const [tabNotes, setTabNotes] = useState({
    ambiance: "",
    furniture: "",
    appliances: "",
    financial: ""
  });

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
            <FormField label="Ambiance(s) recherchée(s)" span={1}>
              <SelectInput
                value={formData.ambianceTypes}
                onChange={(value) => updateField("ambianceTypes", value)}
                placeholder="Sélectionner"
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

      {/* Placeholder for other tabs */}
      {activeTertiaryTab !== "ambiance" && (
        <FormSection title={tertiaryTabs.find(t => t.id === activeTertiaryTab)?.label}>
          <FormField label="" span={3}>
            <div className="text-center text-neutral-500 py-8">
              Contenu à venir
            </div>
          </FormField>
        </FormSection>
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

      {/* Concurrence */}
      <FormSection title="Concurrence">
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
function ProgressSidebar({ isCollapsed, onToggle, headerHeight }) {
  const steps = [
    { label: "Études à réaliser", progress: 2, color: "violet" },
    { label: "Étude", progress: 99, color: "green" },
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

// Main Project Detail Page Component
export default function ProjectDetailPage({
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
  projectId
}) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  const [activeTab, setActiveTab] = useState("study");
  const [activeSubTab, setActiveSubTab] = useState("discovery");
  const [progressSidebarCollapsed, setProgressSidebarCollapsed] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(240);
  const headerRef = useRef(null);

  const handleBack = () => {
    onNavigate("project-tracking");
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
            project={mockProjectData}
            onBack={handleBack}
            onEdit={() => console.log("Edit")}
            onSchedule={() => console.log("Schedule")}
            onAddTask={() => console.log("Add task")}
            onLost={() => console.log("Lost")}
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
        />

        {/* Progress Sidebar - Fixed on the right */}
        <ProgressSidebar
          isCollapsed={progressSidebarCollapsed}
          onToggle={() => setProgressSidebarCollapsed(!progressSidebarCollapsed)}
          headerHeight={headerHeight}
        />

        {/* Content */}
        <div
          className="bg-[#F8F9FA] transition-[margin] duration-300"
          style={{ marginRight: `${progressSidebarWidth}px` }}
        >
          <div className="w-full pb-8 px-4 lg:px-6">
            <div className="bg-white border border-[#E5E5E5] border-t-0 rounded-b-lg p-8">
              {activeTab === "study" && activeSubTab === "discovery" && (
                <DiscoveryTabContent />
              )}
              {activeTab === "study" && activeSubTab === "kitchen" && (
                <KitchenDiscoveryTabContent />
              )}
              {activeTab === "study" && activeSubTab !== "discovery" && activeSubTab !== "kitchen" && (
                <div className="p-12 text-center text-neutral-500">
                  Contenu à venir
                </div>
              )}
              {activeTab !== "study" && (
                <div className="p-12 text-center text-neutral-500">
                  Contenu à venir
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
