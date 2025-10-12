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
  return classes[type] || "bg-gray-100 text-gray-700";
};

const CreateTaskOrMemoModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    kind: "Tâche",
    // Fields for Tâche
    salarie: "",
    agendaDatetime: "",
    client: "",
    taskType: "",
    project: "",
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

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        kind: "Tâche",
        salarie: "",
        agendaDatetime: "",
        client: "",
        taskType: "",
        project: "",
        dueDate: "",
        noteTask: "",
        memoName: "",
        memoEcheance: "",
        noteMemo: ""
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

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
        className="relative w-full max-w-5xl rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 id="create-task-memo-title" className="flex items-center gap-2 text-lg font-semibold">
              <CheckDocIcon /> Créer une tâche ou une mémo
            </h2>
            <button
              aria-label="Fermer"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <XIcon />
            </button>
          </div>
        </header>

        {/* Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Groupe 1: Toggle Tâche/Mémo */}
            <section className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Créer une tâche ou une mémo
                </label>
                <div className="inline-flex rounded-full border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleChange("kind", "Tâche")}
                    className={`px-3 py-1 text-sm transition-colors ${
                      formData.kind === "Tâche" ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    Tâche
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("kind", "Mémo")}
                    className={`px-3 py-1 text-sm transition-colors ${
                      formData.kind === "Mémo" ? "bg-gray-900 text-white" : "hover:bg-gray-100"
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
                <section className="rounded-xl bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Salarié */}
                    <div>
                      <label htmlFor="salarie" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Salarié <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          ref={firstInputRef}
                          id="salarie"
                          value={formData.salarie}
                          onChange={(e) => handleChange("salarie", e.target.value)}
                          className={`w-full rounded-lg border ${
                            errors.salarie ? "border-red-500" : "border-gray-300"
                          } bg-white px-3 py-2 pr-8 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none`}
                          aria-invalid={errors.salarie ? "true" : "false"}
                          aria-describedby={errors.salarie ? "salarie-error" : undefined}
                        >
                          <option value="">Sélectionner</option>
                          {SALARIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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
                      <label htmlFor="agendaDatetime" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Date et heure dans l'emploi du temps du salarié
                      </label>
                      <input
                        type="datetime-local"
                        id="agendaDatetime"
                        value={formData.agendaDatetime}
                        onChange={(e) => handleChange("agendaDatetime", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>
                  </div>
                </section>

                {/* Groupe 3: Client | Type | Projet | Échéance */}
                <section className="rounded-xl bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Client */}
                    <div>
                      <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Client
                      </label>
                      <div className="relative">
                        <select
                          id="client"
                          value={formData.client}
                          onChange={(e) => handleChange("client", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none"
                        >
                          <option value="">Sélectionner</option>
                          {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>

                    {/* Type de tâche */}
                    <div>
                      <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Type de tâche
                      </label>
                      {formData.taskType ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => handleChange("taskType", "")}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                          >
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTaskTypeBadgeClass(formData.taskType)}`}>
                              {formData.taskType}
                            </span>
                            <span className="text-gray-400 text-xs">Changer</span>
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            id="taskType"
                            value={formData.taskType}
                            onChange={(e) => handleChange("taskType", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none"
                          >
                            <option value="">Sélectionner</option>
                            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronDownIcon />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Projet concerné */}
                    <div>
                      <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Projet concerné
                      </label>
                      <div className="relative">
                        <select
                          id="project"
                          value={formData.project}
                          onChange={(e) => handleChange("project", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none"
                        >
                          <option value="">Sélectionner</option>
                          {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>

                    {/* Échéance */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Échéance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => handleChange("dueDate", e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.dueDate ? "border-red-500" : "border-gray-300"
                        } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
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
                <section className="rounded-xl bg-gray-50 p-4">
                  <div>
                    <label htmlFor="noteTask" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Note de la tâche
                    </label>
                    <textarea
                      id="noteTask"
                      value={formData.noteTask}
                      onChange={(e) => handleChange("noteTask", e.target.value)}
                      placeholder="Saisir une note ou une consigne..."
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 min-h-[120px] resize-y"
                    />
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Mémo Form */}
                <section className="rounded-xl bg-gray-50 p-4">
                  <div className="space-y-4">
                    {/* Nom de la mémo */}
                    <div>
                      <label htmlFor="memoName" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                          errors.memoName ? "border-red-500" : "border-gray-300"
                        } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
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
                      <label htmlFor="memoEcheance" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Échéance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="memoEcheance"
                        value={formData.memoEcheance}
                        onChange={(e) => handleChange("memoEcheance", e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.memoEcheance ? "border-red-500" : "border-gray-300"
                        } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
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
                      <label htmlFor="noteMemo" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Note de la mémo
                      </label>
                      <textarea
                        id="noteMemo"
                        value={formData.noteMemo}
                        onChange={(e) => handleChange("noteMemo", e.target.value)}
                        placeholder="Saisir une note..."
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 min-h-[120px] resize-y"
                      />
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="px-6 pb-6 pt-2 flex justify-center flex-shrink-0">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <PlusIcon />
                  <span>{formData.kind === "Tâche" ? "Créer la tâche" : "Créer la mémo"}</span>
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
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
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
