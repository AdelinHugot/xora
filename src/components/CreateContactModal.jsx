import React, { useState, useEffect, useRef } from "react";

// SVG Icons
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11.667 2.5H5a1.667 1.667 0 00-1.667 1.667v11.666A1.667 1.667 0 005 17.5h10a1.667 1.667 0 001.667-1.667V7.5m-5-5l5 5m-5-5v5h5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3.333v9.334M3.333 8h9.334" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Spinner = () => (
  <svg className="size-4 animate-spin" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
    <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Custom Select with Avatar Component
const AgenceurSelect = ({ value, onChange, options, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedAgenceur = options.find(opt => opt.name === value);

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
          onChange(options[focusedIndex].name);
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

  const handleOptionClick = (optionName) => {
    onChange(optionName);
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
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {selectedAgenceur ? (
            <>
              <img
                src={selectedAgenceur.avatarUrl}
                alt=""
                className="size-6 rounded-full"
              />
              <span className="text-gray-900">{selectedAgenceur.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Choisir un agenseur</span>
          )}
        </span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              role="option"
              aria-selected={value === option.name}
              tabIndex={-1}
              onClick={() => handleOptionClick(option.name)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                focusedIndex === index ? "bg-gray-100" : ""
              } ${value === option.name ? "bg-gray-50" : ""} ${
                index === 0 ? "rounded-t-lg" : ""
              } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <img
                src={option.avatarUrl}
                alt=""
                className="size-6 rounded-full"
              />
              <span className="text-gray-900">{option.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateContactModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    civilite: "",
    nom: "",
    prenom: "",
    adresse: "",
    complementAdresse: "",
    agence: "",
    agenceurReferent: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Mock data for select options
  const agenceurs = [
    { id: "1", name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
    { id: "2", name: "Amélie", avatarUrl: "https://i.pravatar.cc/24?img=8" },
    { id: "3", name: "Lucas", avatarUrl: "https://i.pravatar.cc/24?img=15" }
  ];

  const agences = ["Travaux confort", "Rénov' expert", "Maison+"];

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
        civilite: "",
        nom: "",
        prenom: "",
        adresse: "",
        complementAdresse: "",
        agence: "",
        agenceurReferent: ""
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
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

    // Trim all string values
    const trimmedData = {
      civilite: formData.civilite,
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      adresse: formData.adresse.trim(),
      complementAdresse: formData.complementAdresse.trim(),
      agence: formData.agence,
      agenceurReferent: formData.agenceurReferent
    };

    try {
      if (onSubmit) {
        await onSubmit(trimmedData);
        onClose();
      } else {
        console.log(trimmedData);
        onClose();
      }
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

  const isFormValid = formData.nom.trim() && formData.prenom.trim();

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
        aria-labelledby="create-contact-title"
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <h2 id="create-contact-title" className="flex items-center gap-2 text-lg font-semibold">
            <DocIcon /> Créer une fiche contact
          </h2>
          <button
            aria-label="Fermer"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <XIcon />
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Ligne 1: Civilité | Nom | Prénom */}
            <section className="rounded-xl bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Civilité client */}
                <div>
                  <label htmlFor="civilite" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Civilité client
                  </label>
                  <select
                    ref={firstInputRef}
                    id="civilite"
                    value={formData.civilite}
                    onChange={(e) => handleChange("civilite", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Mme">Mme</option>
                    <option value="M.">M.</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Nom du contact */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom du contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    placeholder="Ex : Dupont"
                    className={`w-full rounded-lg border ${
                      errors.nom ? "border-red-500" : "border-gray-300"
                    } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400`}
                    aria-invalid={errors.nom ? "true" : "false"}
                    aria-describedby={errors.nom ? "nom-error" : undefined}
                  />
                  {errors.nom && (
                    <p id="nom-error" role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
                      {errors.nom}
                    </p>
                  )}
                </div>

                {/* Prénom du contact */}
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prénom du contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    placeholder="Ex : Chloé"
                    className={`w-full rounded-lg border ${
                      errors.prenom ? "border-red-500" : "border-gray-300"
                    } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400`}
                    aria-invalid={errors.prenom ? "true" : "false"}
                    aria-describedby={errors.prenom ? "prenom-error" : undefined}
                  />
                  {errors.prenom && (
                    <p id="prenom-error" role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
                      {errors.prenom}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Ligne 2: Adresse | Complément d'adresse */}
            <section className="rounded-xl bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Adresse */}
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleChange("adresse", e.target.value)}
                    placeholder="Ex : 7 Rue de Provence, 34350 Valras-Plage"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                  />
                </div>

                {/* Complément d'adresse */}
                <div>
                  <label htmlFor="complementAdresse" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Complément d'adresse
                  </label>
                  <input
                    type="text"
                    id="complementAdresse"
                    value={formData.complementAdresse}
                    onChange={(e) => handleChange("complementAdresse", e.target.value)}
                    placeholder="Appartement, bâtiment, etc."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* Ligne 3: Agence | Agenceur référent */}
            <section className="rounded-xl bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Agence */}
                <div>
                  <label htmlFor="agence" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Agence
                  </label>
                  <select
                    id="agence"
                    value={formData.agence}
                    onChange={(e) => handleChange("agence", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                  >
                    <option value="">Sélectionner une agence</option>
                    {agences.map((agence) => (
                      <option key={agence} value={agence}>
                        {agence}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agenceur référent - Custom Select with Avatar */}
                <div>
                  <label htmlFor="agenceurReferent" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Agenceur référent
                  </label>
                  <AgenceurSelect
                    value={formData.agenceurReferent}
                    onChange={(value) => handleChange("agenceurReferent", value)}
                    options={agenceurs}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="px-6 pb-6 pt-2 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {isSubmitting ? <Spinner /> : <PlusIcon />}
              <span>Créer la fiche contact</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;
