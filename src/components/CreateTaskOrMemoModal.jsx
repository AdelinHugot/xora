// filename: CreateTaskOrMemoModal.jsx
import React, { useState, useEffect, useRef } from "react";

// SVG Icons
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckDocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.667 5L7.5 14.167 3.333 10" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Mock data
const SALARIES = ["Jérémy", "Amélie", "Lucas", "Thomas", "Coline"];
const CLIENTS = ["DUBOIS Chloé", "MOREAU Julian", "BERNARD Amélie", "FARGET Coline"];
const PROJECTS = ["Pose de cuisine", "Dossier technique", "Études en cours", "Installation", "SAV"];
const TASK_TYPES = ["Appel", "Email", "Rendez-vous", "Relance", "Note", "Mémo"];
const COMMERCIALS = ["Jérémy", "Amélie", "Lucas", "Thomas", "Coline"];

// Generate next 14 days
const generateDateOptions = () => {
  const options = [];
  const today = new Date();

  for (let i = 0; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const label = i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : date.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });
    options.push({
      label,
      value: date.toISOString().split('T')[0]
    });
  }

  return options;
};

// Generate time slots
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      options.push(timeStr);
    }
  }
  return options;
};

const DATE_OPTIONS = generateDateOptions();
const TIME_OPTIONS = generateTimeOptions();

// Task type badge colors
const getTaskTypeBadgeClass = (type) => {
  const classes = {
    "Appel": "bg-purple-100 text-purple-700",
    "Email": "bg-sky-100 text-sky-700",
    "Rendez-vous": "bg-emerald-100 text-emerald-700",
    "Relance": "bg-amber-100 text-amber-700",
    "Note": "bg-gray-800 text-white",
    "Mémo": "bg-gray-800 text-white"
  };
  return classes[type] || "bg-neutral-100 text-neutral-900";
};

const CreateTaskOrMemoModal = ({
  open,
  onClose,
  onSubmit,
  preFilledClient = "",
  preFilledProject = "",
  employees = [],
  commercials = [],
  projects = []
}) => {
  const [formData, setFormData] = useState({
    kind: "Tâche",
    // Fields for Tâche
    salarie: "",
    agendaDatetime: "",
    client: preFilledClient,
    commercial: "",
    taskType: "",
    project: preFilledProject,
    dueDate: "",
    noteTask: "",
    // Fields for Mémo
    memoName: "",
    memoEcheance: "",
    noteMemo: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Save last focused element when modal opens
  useEffect(() => {
    if (open) {
      lastFocusedElement.current = document.activeElement;
    } else if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Focus on first input when modal opens
  useEffect(() => {
    if (open && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset form when modal closes or opens with new pre-filled data
  useEffect(() => {
    if (!open) {
      setFormData({
        kind: "Tâche",
        salarie: "",
        agendaDatetime: "",
        client: preFilledClient || "",
        commercial: "",
        taskType: "",
        project: preFilledProject || "",
        dueDate: "",
        noteTask: "",
        memoName: "",
        memoEcheance: "",
        noteMemo: ""
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, preFilledClient, preFilledProject]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      // When switching kind, reset non-common fields
      if (field === "kind") {
        if (value === "Tâche") {
          return {
            kind: "Tâche",
            salarie: "",
            agendaDatetime: "",
            client: prev.client, // Keep client
            commercial: "",
            taskType: prev.taskType, // Keep taskType
            project: "",
            dueDate: "",
            noteTask: "",
            memoName: "",
            memoEcheance: "",
            noteMemo: ""
          };
        } else {
          return {
            kind: "Mémo",
            salarie: "",
            agendaDatetime: "",
            client: prev.client, // Keep client
            commercial: "",
            taskType: prev.taskType, // Keep taskType
            project: "",
            dueDate: "",
            noteTask: "",
            memoName: "",
            memoEcheance: "",
            noteMemo: ""
          };
        }
      }
      return { ...prev, [field]: value };
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.kind === "Tâche") {
      if (!formData.salarie) {
        newErrors.salarie = "Le salarié est requis pour une tâche";
      }
      if (!formData.dueDate) {
        newErrors.dueDate = "L'échéance est requise";
      }
    } else {
      // Mémo
      if (!formData.memoName) {
        newErrors.memoName = "Le nom de la mémo est requis";
      }
      if (!formData.memoEcheance) {
        newErrors.memoEcheance = "L'échéance est requise";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Build payload based on kind
    let payload;
    if (formData.kind === "Tâche") {
      payload = {
        kind: "Tâche",
        salarie: formData.salarie,
        agendaDatetime: formData.agendaDatetime || undefined,
        client: formData.client || undefined,
        commercial: formData.commercial || undefined,
        taskType: formData.taskType || undefined,
        project: formData.project || undefined,
        dueDate: formData.dueDate,
        note: formData.noteTask?.trim() || undefined
      };
    } else {
      payload = {
        kind: "Mémo",
        memoName: formData.memoName,
        memoEcheance: formData.memoEcheance,
        note: formData.noteMemo?.trim() || undefined
      };
    }

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        console.log(payload);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isFormValid = () => {
    if (formData.kind === "Tâche") {
      return formData.salarie && formData.dueDate;
    } else {
      return formData.memoName && formData.memoEcheance;
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-memo-title"
        className="relative w-full bg-white shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ maxWidth: '740px', borderRadius: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E4E4E7] flex-shrink-0 rounded-t-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#E4E4E7] rounded-lg">
                <CheckDocIcon />
              </div>
              <h2 id="create-task-memo-title" className="text-sm font-semibold text-[#1F2027]">
                Créer une tâche ou une mémo
              </h2>
            </div>
            <button
              aria-label="Fermer"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 transition-colors"
            >
              <XIcon />
            </button>
          </div>
        </header>

        {/* Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Groupe 1: Toggle Tâche/Mémo */}
            <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#6B7280] font-medium mb-0">
                  Créer une tâche ou une mémo
                </label>
                <div className="inline-flex rounded-full border border-[#E1E4ED] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleChange("kind", "Tâche")}
                    className={`px-3 py-1 text-sm transition-colors ${
                      formData.kind === "Tâche" ? "bg-neutral-900 text-white" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    Tâche
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("kind", "Mémo")}
                    className={`px-3 py-1 text-sm transition-colors ${
                      formData.kind === "Mémo" ? "bg-neutral-900 text-white" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    Mémo
                  </button>
                </div>
              </div>
            </section>

            {/* Conditional form content based on kind */}
            {formData.kind === "Tâche" ? (
              <>
                {/* Groupe 2: Salarié | Agenda */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Salarié */}
                    <div>
                      <label htmlFor="salarie" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Salarié <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          ref={firstInputRef}
                          id="salarie"
                          value={formData.salarie}
                          onChange={(e) => handleChange("salarie", e.target.value)}
                          className={`w-full rounded-lg border ${
                            errors.salarie ? "border-red-500" : "border-[#E1E4ED]"
                          } bg-white px-3 py-2.5 pr-8 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none`}
                          aria-invalid={errors.salarie ? "true" : "false"}
                          aria-describedby={errors.salarie ? "salarie-error" : undefined}
                        >
                          <option value="">Sélectionner</option>
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>
                              {e.prenom} {e.nom}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                          <ChevronDownIcon />
                        </div>
                      </div>
                      {errors.salarie && (
                        <p id="salarie-error" className="mt-1 text-xs text-red-600">
                          {errors.salarie}
                        </p>
                      )}
                    </div>

                    {/* Agenda du salarié */}
                    <div>
                      <label htmlFor="agendaDatetime" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Date et heure dans l'emploi du temps du salarié
                      </label>
                      <input
                        type="datetime-local"
                        id="agendaDatetime"
                        value={formData.agendaDatetime}
                        onChange={(e) => handleChange("agendaDatetime", e.target.value)}
                        className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                      />
                    </div>
                  </div>
                </section>

                {/* Groupe 3: Client | Commercial | Type | Projet | Échéance */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Client */}
                    <div>
                      <label htmlFor="client" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Client
                      </label>
                      <input
                        id="client"
                        type="text"
                        value={formData.client}
                        readOnly
                        className="w-full rounded-lg border border-[#E1E4ED] bg-gray-50 px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none"
                        placeholder="—"
                      />
                    </div>

                    {/* Commercial concerné */}
                    <div>
                      <label htmlFor="commercial" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Commercial
                      </label>
                      <div className="relative">
                        <select
                          id="commercial"
                          value={formData.commercial}
                          onChange={(e) => handleChange("commercial", e.target.value)}
                          className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pr-8 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none"
                        >
                          <option value="">Sélectionner</option>
                          {commercials.length > 0 ? (
                            commercials.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.prenom} {c.nom}
                              </option>
                            ))
                          ) : (
                            COMMERCIALS.map(c => <option key={c} value={c}>{c}</option>)
                          )}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>

                    {/* Type de tâche */}
                    <div>
                      <label htmlFor="taskType" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Type de tâche
                      </label>
                      {formData.taskType ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => handleChange("taskType", "")}
                            className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                          >
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTaskTypeBadgeClass(formData.taskType)}`}>
                              {formData.taskType}
                            </span>
                            <span className="text-[#6B7280] text-xs">Changer</span>
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            id="taskType"
                            value={formData.taskType}
                            onChange={(e) => handleChange("taskType", e.target.value)}
                            className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pr-8 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none"
                          >
                            <option value="">Sélectionner</option>
                            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                            <ChevronDownIcon />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Projet concerné */}
                    <div>
                      <label htmlFor="project" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Projet concerné
                      </label>
                      <div className="relative">
                        <select
                          id="project"
                          value={formData.project}
                          onChange={(e) => handleChange("project", e.target.value)}
                          className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pr-8 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none"
                        >
                          <option value="">Sélectionner</option>
                          {projects.map(p => (
                            <option key={p.id} value={p.nom_projet}>
                              {p.nom_projet}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>

                    {/* Échéance */}
                    <div>
                      <label htmlFor="dueDate" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Échéance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => handleChange("dueDate", e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.dueDate ? "border-red-500" : "border-[#E1E4ED]"
                        } bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30`}
                        aria-invalid={errors.dueDate ? "true" : "false"}
                        aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
                      />
                      {errors.dueDate && (
                        <p id="dueDate-error" className="mt-1 text-xs text-red-600">
                          {errors.dueDate}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Groupe 4: Note */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div>
                    <label htmlFor="noteTask" className="block text-xs text-[#6B7280] font-medium mb-3">
                      Note de la tâche
                    </label>
                    <textarea
                      id="noteTask"
                      value={formData.noteTask}
                      onChange={(e) => handleChange("noteTask", e.target.value)}
                      placeholder="Saisir une note ou une consigne..."
                      rows={5}
                      className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 min-h-[120px] resize-y"
                    />
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Mémo Form */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div className="space-y-4">
                    {/* Nom de la mémo */}
                    <div>
                      <label htmlFor="memoName" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Nom de la mémo <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="memoName"
                        value={formData.memoName}
                        onChange={(e) => handleChange("memoName", e.target.value)}
                        placeholder="Titre de la mémo"
                        className={`w-full rounded-lg border ${
                          errors.memoName ? "border-red-500" : "border-[#E1E4ED]"
                        } bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30`}
                        aria-invalid={errors.memoName ? "true" : "false"}
                        aria-describedby={errors.memoName ? "memoName-error" : undefined}
                      />
                      {errors.memoName && (
                        <p id="memoName-error" className="mt-1 text-xs text-red-600">
                          {errors.memoName}
                        </p>
                      )}
                    </div>

                    {/* Échéance */}
                    <div>
                      <label htmlFor="memoEcheance" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Échéance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="memoEcheance"
                        value={formData.memoEcheance}
                        onChange={(e) => handleChange("memoEcheance", e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.memoEcheance ? "border-red-500" : "border-[#E1E4ED]"
                        } bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30`}
                        aria-invalid={errors.memoEcheance ? "true" : "false"}
                        aria-describedby={errors.memoEcheance ? "memoEcheance-error" : undefined}
                      />
                      {errors.memoEcheance && (
                        <p id="memoEcheance-error" className="mt-1 text-xs text-red-600">
                          {errors.memoEcheance}
                        </p>
                      )}
                    </div>

                    {/* Note de la mémo */}
                    <div>
                      <label htmlFor="noteMemo" className="block text-xs text-[#6B7280] font-medium mb-3">
                        Note de la mémo
                      </label>
                      <textarea
                        id="noteMemo"
                        value={formData.noteMemo}
                        onChange={(e) => handleChange("noteMemo", e.target.value)}
                        placeholder="Saisir une note..."
                        rows={5}
                        className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 min-h-[120px] resize-y"
                      />
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white bg-white text-[#6B7280] px-4 py-2.5 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-sm font-medium"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2B7FFF] bg-[#2B7FFF] text-white px-4 py-2.5 hover:bg-[#1F6FE6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <PlusIcon />
                  <span>Valider</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskOrMemoModal;

// Example usage
export function ExampleCreateTaskOrMemoModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (payload) => {
    console.log("Task/Memo created:", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 hover:bg-neutral-50"
      >
        <PlusIcon />
        Ouvrir la modale
      </button>

      <CreateTaskOrMemoModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
