// filename: CreateTaskOrMemoModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { useContactSearch } from "../hooks/useContactSearch";
import { useDebounce } from "../hooks/useDebounce";
import { useProjects } from "../hooks/useProjects";

// SVG Icons
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckDocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.667 5L7.5 14.167 3.333 10" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Spinner = () => (
  <svg className="size-4 animate-spin" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
    <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Constants
const TASK_TYPES = ["Appel", "Email", "Rendez-vous", "Relance", "Note", "Mémo"];
const COMMERCIALS_FALLBACK = ["Jérémy", "Amélie", "Lucas", "Thomas", "Coline"];

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

// Custom Select Component (Reusable)
const UserSelect = ({ value, onChange, options, placeholder = "Sélectionner", disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          onChange(options[focusedIndex].id);
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
    }
  };

  const handleOptionClick = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <span className="flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.avatarUrl && (
                <img
                  src={selectedOption.avatarUrl}
                  alt=""
                  className="size-6 rounded-full"
                />
              )}
              <span>{selectedOption.name}</span>
            </>
          ) : (
            <span className="text-[#A1A7B6]">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-lg border border-[#E1E4ED] bg-white shadow-lg max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              role="option"
              aria-selected={value === option.id}
              tabIndex={-1}
              onClick={() => handleOptionClick(option.id)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm ${focusedIndex === index ? "bg-[#F3F4F6]" : ""
                } ${value === option.id ? "bg-[#F8F9FA]" : ""} ${index === 0 ? "rounded-t-lg" : ""
                } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              {option.avatarUrl && (
                <img
                  src={option.avatarUrl}
                  alt=""
                  className="size-6 rounded-full"
                />
              )}
              <span>{option.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Client Search Component
const ClientSearch = ({ value, onChange, onContactSelect, placeholder = "Rechercher un client..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, searchContacts } = useContactSearch();
  const dropdownRef = useRef(null);

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(value, 300);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      searchContacts(debouncedSearchTerm);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedSearchTerm, searchContacts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (clientName, contactId) => {
    onChange(clientName); // Update parent state with selected name
    if (onContactSelect) {
      onContactSelect(contactId); // Notify parent of contact ID
    }
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pl-9 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
          onFocus={() => {
            if (value && value.length >= 2) setIsOpen(true);
          }}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A7B6]">
          {loading ? <Spinner /> : <SearchIcon />}
        </div>
      </div>

      {isOpen && results && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#E1E4ED] bg-white shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, idx) => (
            <button
              key={result.id || idx}
              type="button"
              onClick={() => handleSelect(result.name, result.id)}
              className="w-full px-3 py-2 text-left text-sm text-[#1F2027] hover:bg-[#F3F4F6] border-b border-[#E1E4ED] last:border-b-0 flex flex-col"
            >
              <span className="font-medium">{result.name}</span>
              {result.email && <span className="text-xs text-[#6B7280]">{result.email}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateTaskOrMemoModal = ({
  open,
  onClose,
  onSubmit,
  preFilledClient = "",
  preFilledContactId = null,
  preFilledProject = "",
  employees = [],
  commercials = [],
  projects = []
}) => {
  const [formData, setFormData] = useState({
    kind: "Tâche",
    // Fields for Tâche
    taskName: "", // New field for Task Title
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
  const [selectedContactId, setSelectedContactId] = useState(null);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Load projects for the selected contact
  const { projects: contactProjects } = useProjects(selectedContactId);

  // Prepare employee options for UserSelect
  const employeeOptions = employees.map(e => ({
    id: e.id,
    name: `${e.prenom} ${e.nom}`,
    avatarUrl: `https://i.pravatar.cc/150?u=${e.id}`
  }));

  // Prepare commercial options for UserSelect
  const commercialOptions = commercials.length > 0
    ? commercials.map(c => ({
      id: c.id,
      name: `${c.prenom} ${c.nom}`,
      avatarUrl: `https://i.pravatar.cc/150?u=${c.id}`
    }))
    : COMMERCIALS_FALLBACK.map((name, idx) => ({
      id: name, // Using name as ID for fallback
      name: name,
      avatarUrl: `https://i.pravatar.cc/150?u=${idx}`
    }));


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
        taskName: "", // Reset Title
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
      setSelectedContactId(null);
    } else if (open && preFilledContactId) {
      // When modal opens with pre-filled contact ID, set it
      setSelectedContactId(preFilledContactId);
    }
  }, [open, preFilledClient, preFilledProject, preFilledContactId]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      // When switching kind, reset non-common fields
      if (field === "kind") {
        if (value === "Tâche") {
          return {
            kind: "Tâche",
            taskName: "", // Reset
            salarie: "",
            agendaDatetime: "",
            client: prev.client,
            commercial: "",
            taskType: prev.taskType,
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
            client: prev.client,
            commercial: "",
            taskType: prev.taskType,
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

  const handleContactSelect = (contactId) => {
    setSelectedContactId(contactId);
    // Reset project field when client changes
    setFormData(prev => ({ ...prev, project: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (formData.kind === "Tâche") {
      if (!formData.taskName.trim()) {
        newErrors.taskName = "Le nom de la tâche est requis";
      }
      if (!formData.salarie) {
        newErrors.salarie = "Le salarié est requis pour une tâche";
      }
      if (!formData.dueDate) {
        newErrors.dueDate = "L'échéance est requise";
      }
    } else {
      // Mémo
      if (!formData.memoName) {
        newErrors.memoName = "Le nom du mémo est requis";
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
        titre: formData.taskName.trim(), // Send title
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
      return formData.taskName.trim() && formData.salarie && formData.dueDate;
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
                Créer une tâche ou un mémo
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
                  Type d'élément
                </label>
                <div className="inline-flex rounded-full border border-[#E1E4ED] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleChange("kind", "Tâche")}
                    className={`px-3 py-1 text-sm transition-colors ${formData.kind === "Tâche" ? "bg-neutral-900 text-white" : "hover:bg-[#F3F4F6]"
                      }`}
                  >
                    Tâche
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("kind", "Mémo")}
                    className={`px-3 py-1 text-sm transition-colors ${formData.kind === "Mémo" ? "bg-neutral-900 text-white" : "hover:bg-[#F3F4F6]"
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
                {/* Groupe 2: Nom et Salarié | Agenda */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED] space-y-4">
                  {/* Nom de la tâche */}
                  <div>
                    <label htmlFor="taskName" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                      Nom de la tâche <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="taskName"
                      value={formData.taskName}
                      onChange={(e) => handleChange("taskName", e.target.value)}
                      placeholder="Ex: Relancer M. Dupont"
                      className={`w-full rounded-lg border ${errors.taskName ? "border-red-500" : "border-[#E1E4ED]"
                        } bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30`}
                      aria-invalid={errors.taskName ? "true" : "false"}
                      aria-describedby={errors.taskName ? "taskName-error" : undefined}
                    />
                    {errors.taskName && (
                      <p id="taskName-error" className="mt-1 text-xs text-red-600">
                        {errors.taskName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Salarié */}
                    <div>
                      <label htmlFor="salarie" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Salarié <span className="text-red-500">*</span>
                      </label>
                      <UserSelect
                        value={formData.salarie}
                        onChange={(val) => handleChange("salarie", val)}
                        options={employeeOptions}
                        placeholder="Choisir un salarié"
                        disabled={false}
                      />
                      {errors.salarie && (
                        <p id="salarie-error" className="mt-1 text-xs text-red-600">
                          {errors.salarie}
                        </p>
                      )}
                    </div>

                    {/* Agenda du salarié */}
                    <div>
                      <label htmlFor="agendaDatetime" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Date et heure dans l'emploi du temps
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

                {/* Groupe 3: Détails */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client */}
                    <div>
                      <label htmlFor="client" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Client
                      </label>
                      <ClientSearch
                        value={formData.client}
                        onChange={(val) => handleChange("client", val)}
                        onContactSelect={handleContactSelect}
                        placeholder="Rechercher un client..."
                      />
                    </div>

                    {/* Projet concerné */}
                    <div>
                      <label htmlFor="project" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Projet concerné
                      </label>
                      <div className="relative">
                        <select
                          id="project"
                          value={formData.project}
                          onChange={(e) => handleChange("project", e.target.value)}
                          disabled={!selectedContactId}
                          className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pr-8 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {selectedContactId ? "Sélectionner" : "Sélectionner un client d'abord"}
                          </option>
                          {contactProjects.map(p => (
                            <option key={p.id} value={p.titre}>
                              {p.titre}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </div>

                    {/* Commercial concerné */}
                    <div>
                      <label htmlFor="commercial" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Commercial
                      </label>
                      <UserSelect
                        value={formData.commercial}
                        onChange={(val) => handleChange("commercial", val)}
                        options={commercialOptions}
                        placeholder="Choisir un commercial"
                        disabled={false}
                      />
                    </div>

                    {/* Type de tâche */}
                    <div>
                      <label htmlFor="taskType" className="block text-xs font-medium text-[#4B5563] mb-1.5">
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

                    {/* Échéance */}
                    <div className="md:col-span-2">
                      <label htmlFor="dueDate" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Échéance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => handleChange("dueDate", e.target.value)}
                        className={`w-full rounded-lg border ${errors.dueDate ? "border-red-500" : "border-[#E1E4ED]"
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
                    <label htmlFor="noteTask" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                      Note de la tâche
                    </label>
                    <textarea
                      id="noteTask"
                      value={formData.noteTask}
                      onChange={(e) => handleChange("noteTask", e.target.value)}
                      placeholder="Saisir une note ou une consigne..."
                      rows={4}
                      className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 min-h-[100px] resize-y"
                    />
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Mémo Form */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED] space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Nom de la mémo */}
                    <div>
                      <label htmlFor="memoName" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Nom du mémo <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="memoName"
                        value={formData.memoName}
                        onChange={(e) => handleChange("memoName", e.target.value)}
                        placeholder="Titre du mémo"
                        className={`w-full rounded-lg border ${errors.memoName ? "border-red-500" : "border-[#E1E4ED]"
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
                      <label htmlFor="memoEcheance" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Échéance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="memoEcheance"
                        value={formData.memoEcheance}
                        onChange={(e) => handleChange("memoEcheance", e.target.value)}
                        className={`w-full rounded-lg border ${errors.memoEcheance ? "border-red-500" : "border-[#E1E4ED]"
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
                      <label htmlFor="noteMemo" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                        Note du mémo
                      </label>
                      <textarea
                        id="noteMemo"
                        value={formData.noteMemo}
                        onChange={(e) => handleChange("noteMemo", e.target.value)}
                        placeholder="Saisir une note..."
                        rows={4}
                        className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 min-h-[100px] resize-y"
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
