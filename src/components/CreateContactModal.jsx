import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

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
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {selectedAgenceur ? (
            <>
              <img
                src={selectedAgenceur.avatarUrl}
                alt=""
                className="size-6 rounded-full"
              />
              <span className="text-neutral-900">{selectedAgenceur.name}</span>
            </>
          ) : (
            <span className="text-neutral-400">Choisir un agenceur</span>
          )}
        </span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg"
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
                focusedIndex === index ? "bg-neutral-100" : ""
              } ${value === option.name ? "bg-neutral-50" : ""} ${
                index === 0 ? "rounded-t-lg" : ""
              } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <img
                src={option.avatarUrl}
                alt=""
                className="size-6 rounded-full"
              />
              <span className="text-neutral-900">{option.name}</span>
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
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    complementAdresse: "",
    adresseCoordinates: null,
    origine: "",
    sousOrigine: "",
    societe: "",
    agenceurReferent: "",
    rgpd: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adresseSearchResults, setAdresseSearchResults] = useState([]);
  const [adresseValidated, setAdresseValidated] = useState(false);
  const [showAddressMap, setShowAddressMap] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Mock data for select options
  const agenceurs = [
    { id: "1", name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
    { id: "2", name: "Amélie", avatarUrl: "https://i.pravatar.cc/24?img=8" },
    { id: "3", name: "Lucas", avatarUrl: "https://i.pravatar.cc/24?img=15" }
  ];

  const origines = ["Relation", "Salon", "Web", "Recommandation", "Démarchage"];

  const sousOrigines = {
    "Relation": ["Client existant", "Bouche à oreille", "Partenaire"],
    "Salon": ["Salon de l'habitat", "Salon du luxe", "Autre"],
    "Web": ["Google", "Site web", "Réseaux sociaux", "Autre"],
    "Recommandation": ["Client", "Architecte", "Autre professionnel"],
    "Démarchage": ["Porte à porte", "Appel téléphonique", "Email"]
  };

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
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        adresse: "",
        complementAdresse: "",
        adresseCoordinates: null,
        origine: "",
        sousOrigine: "",
        societe: "",
        agenceurReferent: "",
        rgpd: false
      });
      setErrors({});
      setIsSubmitting(false);
      setAdresseValidated(false);
      setShowAddressMap(false);
      setAdresseSearchResults([]);
    }
  }, [open]);

  // Search address using Nominatim API with debounce
  const searchAddress = async (addressQuery) => {
    if (!addressQuery.trim()) {
      setAdresseSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&countrycodes=fr&limit=5`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);
      const results = await response.json();
      setAdresseSearchResults(results.slice(0, 5));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error searching address:", error);
      }
      setAdresseSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search handler
  const handleAddressSearch = (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setAdresseSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (query.trim().length <= 3) {
      setAdresseSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Debounce: wait 500ms before searching
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(query);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle address selection
  const handleSelectAddress = (result) => {
    setFormData(prev => ({
      ...prev,
      adresse: result.display_name,
      adresseCoordinates: [parseFloat(result.lat), parseFloat(result.lon)]
    }));
    setAdresseValidated(true);
    setShowAddressMap(true);
    setAdresseSearchResults([]);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Special handling for adresse field - search for addresses with debounce
    if (field === "adresse") {
      setAdresseValidated(false);
      setShowAddressMap(false);
      handleAddressSearch(value);
    }

    // Reset sous-origine when origine changes
    if (field === "origine") {
      setFormData(prev => ({ ...prev, sousOrigine: "" }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
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

    try {
      const submitData = {
        civilite: formData.civilite,
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        adresse: formData.adresse.trim(),
        complementAdresse: formData.complementAdresse.trim(),
        adresseCoordinates: formData.adresseCoordinates,
        origine: formData.origine,
        sousOrigine: formData.sousOrigine,
        societe: formData.societe.trim(),
        agenceurReferent: formData.agenceurReferent,
        rgpd: formData.rgpd
      };

      if (onSubmit) {
        await onSubmit(submitData);
        onClose();
      } else {
        console.log(submitData);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-contact-title"
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl my-8"
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
            className="p-2 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            <XIcon />
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <div className="p-6 space-y-4">

            {/* BLOC 1: Civilité | Prénom | Nom | Email | Téléphone */}
            <div className="rounded-xl bg-neutral-50 p-4 space-y-4 border border-[#E9E9E9]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="civilite" className="block text-sm font-medium text-neutral-900 mb-2">
                    Civilité
                  </label>
                  <select
                    ref={firstInputRef}
                    id="civilite"
                    value={formData.civilite}
                    onChange={(e) => handleChange("civilite", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Mme">Mme</option>
                    <option value="M.">M.</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-neutral-900 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    placeholder="Chloé"
                    className={`w-full rounded-xl border ${
                      errors.prenom ? "border-red-500" : "border-neutral-200"
                    } bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300`}
                  />
                  {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                </div>

                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-neutral-900 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    placeholder="DUBOIS"
                    className={`w-full rounded-xl border ${
                      errors.nom ? "border-red-500" : "border-neutral-200"
                    } bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300`}
                  />
                  {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="chloe@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-neutral-900 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    placeholder="+33 6 XX XX XX XX"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
              </div>
            </div>

            {/* BLOC 2: Adresse avec recherche et Leaflet */}
            <div className="rounded-xl bg-neutral-50 p-4 space-y-3 border border-[#E9E9E9]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-neutral-900 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleChange("adresse", e.target.value)}
                    placeholder="Tapez une adresse..."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />

                  {/* Address search results or loading indicator */}
                  {formData.adresse.trim().length > 3 && !adresseValidated && (
                    <>
                      {isSearching && (
                        <div className="mt-2 rounded-lg border border-neutral-200 bg-white shadow-sm p-3">
                          <div className="flex items-center gap-2">
                            <Spinner />
                            <span className="text-sm text-neutral-600">Recherche en cours...</span>
                          </div>
                        </div>
                      )}
                      {!isSearching && adresseSearchResults.length > 0 && (
                        <div className="mt-2 rounded-lg border border-neutral-200 bg-white shadow-sm max-h-48 overflow-y-auto">
                          {adresseSearchResults.map((result, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectAddress(result)}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0"
                            >
                              {result.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                </div>

                <div>
                  <label htmlFor="complementAdresse" className="block text-sm font-medium text-neutral-900 mb-2">
                    Complément d'adresse
                  </label>
                  <input
                    type="text"
                    id="complementAdresse"
                    value={formData.complementAdresse}
                    onChange={(e) => handleChange("complementAdresse", e.target.value)}
                    placeholder="Appartement, bâtiment..."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
              </div>

              {/* Leaflet Map */}
              {showAddressMap && formData.adresseCoordinates && (
                <div className="rounded-lg overflow-hidden border border-neutral-200 h-48">
                  <MapContainer
                    center={formData.adresseCoordinates}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={formData.adresseCoordinates} />
                  </MapContainer>
                </div>
              )}
            </div>

            {/* BLOC 3: Origine et Sous-Origine */}
            <div className="rounded-xl bg-neutral-50 p-4 space-y-3 border border-[#E9E9E9]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="origine" className="block text-sm font-medium text-neutral-900 mb-2">
                    Origine
                  </label>
                  <select
                    id="origine"
                    value={formData.origine}
                    onChange={(e) => handleChange("origine", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  >
                    <option value="">Sélectionner une origine</option>
                    {origines.map(origine => (
                      <option key={origine} value={origine}>{origine}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sousOrigine" className="block text-sm font-medium text-neutral-900 mb-2">
                    Sous-Origine
                  </label>
                  <select
                    id="sousOrigine"
                    value={formData.sousOrigine}
                    onChange={(e) => handleChange("sousOrigine", e.target.value)}
                    disabled={!formData.origine}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionner une sous-origine</option>
                    {formData.origine && sousOrigines[formData.origine]?.map(sous => (
                      <option key={sous} value={sous}>{sous}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* BLOC 4: Société et Agenceur référent */}
            <div className="rounded-xl bg-neutral-50 p-4 space-y-3 border border-[#E9E9E9]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="societe" className="block text-sm font-medium text-neutral-900 mb-2">
                    Nom de la société
                  </label>
                  <input
                    type="text"
                    id="societe"
                    value={formData.societe}
                    onChange={(e) => handleChange("societe", e.target.value)}
                    placeholder="Nom de la société"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>

                <div>
                  <label htmlFor="agenceurReferent" className="block text-sm font-medium text-neutral-900 mb-2">
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
            </div>

            {/* BLOC 5: RGPD */}
            <div className="rounded-xl bg-neutral-50 p-4 space-y-3 border border-[#E9E9E9]">
              <div className="flex items-center gap-3">
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="rgpd"
                    name="rgpd"
                    checked={formData.rgpd}
                    onChange={(e) => handleChange("rgpd", e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="rgpd"
                    className={`block w-full h-full rounded-full transition cursor-pointer ${
                      formData.rgpd ? "bg-neutral-900" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transition transform ${
                        formData.rgpd ? "translate-x-6" : ""
                      }`}
                    />
                  </label>
                </div>
                <div>
                  <span className="text-sm font-medium">
                    {formData.rgpd ? "Oui" : "Non"}
                  </span>
                  <button type="button" className="text-sm text-neutral-600 hover:underline ml-2">
                    Voir les informations RGPD
                  </button>
                </div>
              </div>
              <p className="text-xs text-neutral-600">
                Mes données ne seront utilisées qu'à cette fin et je pourrai retirer mon consentement à tout moment sur mon accès portail ou sur demande à contact@xora.fr
              </p>
            </div>

          </div>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300"
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
