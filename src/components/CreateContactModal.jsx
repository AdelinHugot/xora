import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { supabase } from "../lib/supabase";

// SVG Icons
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.667 17.5v-1.667a3.333 3.333 0 00-3.334-3.333H6.667a3.333 3.333 0 00-3.334 3.333V17.5M10 9.167A3.333 3.333 0 1010 2.5a3.333 3.333 0 000 6.667z" strokeLinecap="round" strokeLinejoin="round"/>
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

  const selectedAgenceur = options.find(opt => opt.id === value);

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
          {selectedAgenceur ? (
            <>
              <img
                src={selectedAgenceur.avatarUrl}
                alt=""
                className="size-6 rounded-full"
              />
              <span>{selectedAgenceur.name}</span>
            </>
          ) : (
            <span className="text-[#A1A7B6]">Choisir un agenceur</span>
          )}
        </span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-lg border border-[#E1E4ED] bg-white shadow-lg"
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              role="option"
              aria-selected={value === option.id}
              tabIndex={-1}
              onClick={() => handleOptionClick(option.id)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm ${
                focusedIndex === index ? "bg-[#F3F4F6]" : ""
              } ${value === option.id ? "bg-[#F8F9FA]" : ""} ${
                index === 0 ? "rounded-t-lg" : ""
              } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <img
                src={option.avatarUrl}
                alt=""
                className="size-6 rounded-full"
              />
              <span>{option.name}</span>
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

  // State for agenceurs and organization from database
  const [agenceurs, setAgenceurs] = useState([]);
  const [organisationName, setOrganisationName] = useState('');

  const origines = ["Relation", "Salon", "Web", "Recommandation", "Démarchage"];

  const sousOrigines = {
    "Relation": ["Client existant", "Bouche à oreille", "Partenaire"],
    "Salon": ["Salon de l'habitat", "Salon du luxe", "Autre"],
    "Web": ["Google", "Site web", "Réseaux sociaux", "Autre"],
    "Recommandation": ["Client", "Architecte", "Autre professionnel"],
    "Démarchage": ["Porte à porte", "Appel téléphonique", "Email"]
  };

  // Fetch agenceurs when modal opens
  useEffect(() => {
    const fetchAgenceurs = async () => {
      if (!open) return;

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's organization
        const { data: authData, error: authError } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', user.id)
          .single();

        if (authError) {
          console.error('Erreur lors de la récupération de l\'organisation:', authError);
          return;
        }

        // First, get the role IDs for Administrateur and Agenceur
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('id')
          .in('nom', ['Administrateur', 'Agenceur']);

        if (rolesError) {
          console.error('Erreur lors de la récupération des rôles:', rolesError);
          return;
        }

        const roleIds = rolesData.map(r => r.id);

        if (roleIds.length === 0) {
          console.warn('Aucun rôle Administrateur ou Agenceur trouvé');
          return;
        }

        // Then fetch users with these roles from the same organization
        const { data: users, error: usersError } = await supabase
          .from('utilisateurs')
          .select(`
            id,
            prenom,
            nom,
            id_role
          `)
          .eq('id_organisation', authData.id_organisation)
          .in('id_role', roleIds);

        if (usersError) {
          console.error('Erreur lors de la récupération des agenceurs:', usersError);
          return;
        }

        // Transform data for the select component
        const agenceursData = users.map(u => ({
          id: u.id,
          name: `${u.prenom} ${u.nom}`,
          avatarUrl: `https://i.pravatar.cc/24?u=${u.id}`
        }));

        setAgenceurs(agenceursData);

        // Fetch organization name
        const { data: orgData, error: orgError } = await supabase
          .from('organisations')
          .select('nom')
          .eq('id', authData.id_organisation)
          .single();

        if (!orgError && orgData) {
          setOrganisationName(orgData.nom);
          // Pre-fill the societe field with the organization name
          setFormData(prev => ({
            ...prev,
            societe: orgData.nom
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des agenceurs:', error);
      }
    };

    fetchAgenceurs();
  }, [open]);

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
      const timeoutId = setTimeout(() => controller.abort(), 5000);

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

  // Format address to show only: N° de rue Nom de rue, Code postal, Ville
  const formatAddressDisplay = (result) => {
    const fullAddress = result.display_name;
    const parts = fullAddress.split(',').map(p => p.trim());

    let streetAddress = '';
    let postalCode = '';
    let city = '';

    // Find postal code first (5-digit number)
    let postalCodeIndex = -1;
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (/^\d{5}$/.test(part)) {
        postalCode = part;
        postalCodeIndex = i;
        break;
      }
    }

    // Extract street address: combine first 1 or 2 parts
    const streetParts = [];
    for (let i = 0; i < Math.min(2, parts.length); i++) {
      const part = parts[i];
      if (part.length > 0 && !part.match(/^\d{5}$/)) {
        streetParts.push(part);
      }
    }
    streetAddress = streetParts.join(' ');

    // Find city: look for text between postal code and end, avoiding administrative divisions
    if (postalCodeIndex >= 0) {
      for (let i = postalCodeIndex - 1; i >= 0; i--) {
        const part = parts[i];
        if (!/^\d{5}$/.test(part) && // not postal code
            !/^\d+$/.test(part) && // not a number
            !part.toLowerCase().includes('arrondissement') &&
            !part.toLowerCase().includes('france') &&
            !part.toLowerCase().includes('métropole') &&
            !part.toLowerCase().includes('rhône') &&
            !part.toLowerCase().includes('auvergne') &&
            !part.toLowerCase().includes('alpes') &&
            !part.toLowerCase().includes('métropolitaine') &&
            part !== streetParts[0] &&
            part !== streetParts[1] &&
            part.length > 0) {
          city = part;
          break;
        }
      }
    }

    return [streetAddress, postalCode, city].filter(Boolean).join(', ');
  };

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

    if (field === "adresse") {
      setAdresseValidated(false);
      setShowAddressMap(false);
      handleAddressSearch(value);
    }

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-contact-title"
        className="relative w-full bg-white shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ maxWidth: '740px', borderRadius: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E4E4E7] flex-shrink-0 rounded-t-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#E4E4E7] rounded-lg">
                <UserIcon />
              </div>
              <h2 id="create-contact-title" className="text-sm font-semibold text-[#1F2027]">
                Créer une fiche contact
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">

            {/* Section 1: Informations personnelles */}
            <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-4 border border-[#E1E4ED]">
              <h3 className="text-xs text-[#6B7280] font-medium">Informations personnelles</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="civilite" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Civilité
                  </label>
                  <select
                    ref={firstInputRef}
                    id="civilite"
                    value={formData.civilite}
                    onChange={(e) => handleChange("civilite", e.target.value)}
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Mme">Mme</option>
                    <option value="M.">M.</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    placeholder="Chloé"
                    className={`w-full rounded-lg border ${
                      errors.prenom ? "border-red-500" : "border-[#E1E4ED]"
                    } bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]`}
                  />
                  {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
                </div>

                <div>
                  <label htmlFor="nom" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    placeholder="DUBOIS"
                    className={`w-full rounded-lg border ${
                      errors.nom ? "border-red-500" : "border-[#E1E4ED]"
                    } bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]`}
                  />
                  {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="chloe@example.com"
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    placeholder="+33 6 XX XX XX XX"
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Adresse */}
            <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
              <h3 className="text-xs text-[#6B7280] font-medium">Adresse</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adresse" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleChange("adresse", e.target.value)}
                    placeholder="Tapez une adresse..."
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                  />

                  {formData.adresse.trim().length > 3 && !adresseValidated && (
                    <>
                      {isSearching && (
                        <div className="mt-2 rounded-lg border border-[#E1E4ED] bg-white shadow-sm p-3">
                          <div className="flex items-center gap-2">
                            <Spinner />
                            <span className="text-sm text-[#6B7280]">Recherche en cours...</span>
                          </div>
                        </div>
                      )}
                      {!isSearching && adresseSearchResults.length > 0 && (
                        <div className="mt-2 rounded-lg border border-[#E1E4ED] bg-white shadow-sm max-h-48 overflow-y-auto">
                          {adresseSearchResults.map((result, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectAddress(result)}
                              className="w-full px-3 py-2 text-left text-sm text-[#4B5563] hover:bg-[#F3F4F6] border-b border-[#E1E4ED] last:border-b-0"
                            >
                              {formatAddressDisplay(result)}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <label htmlFor="complementAdresse" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Complément d'adresse
                  </label>
                  <input
                    type="text"
                    id="complementAdresse"
                    value={formData.complementAdresse}
                    onChange={(e) => handleChange("complementAdresse", e.target.value)}
                    placeholder="Appartement, bâtiment..."
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                  />
                </div>
              </div>

              {showAddressMap && formData.adresseCoordinates && (
                <div className="rounded-lg overflow-hidden border border-[#E1E4ED] h-48">
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
            </section>

            {/* Section 3: Origine */}
            <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
              <h3 className="text-xs text-[#6B7280] font-medium">Origine du contact</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="origine" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Origine
                  </label>
                  <select
                    id="origine"
                    value={formData.origine}
                    onChange={(e) => handleChange("origine", e.target.value)}
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                  >
                    <option value="">Sélectionner une origine</option>
                    {origines.map(origine => (
                      <option key={origine} value={origine}>{origine}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sousOrigine" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Sous-Origine
                  </label>
                  <select
                    id="sousOrigine"
                    value={formData.sousOrigine}
                    onChange={(e) => handleChange("sousOrigine", e.target.value)}
                    disabled={!formData.origine}
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionner une sous-origine</option>
                    {formData.origine && sousOrigines[formData.origine]?.map(sous => (
                      <option key={sous} value={sous}>{sous}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section 4: Société et Agenceur */}
            <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
              <h3 className="text-xs text-[#6B7280] font-medium">Informations complémentaires</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="societe" className="block text-xs font-medium text-[#4B5563] mb-1.5">
                    Nom de la société
                  </label>
                  <input
                    type="text"
                    id="societe"
                    value={formData.societe}
                    disabled={true}
                    className="w-full rounded-lg border border-[#E1E4ED] bg-[#F3F4F6] px-3 py-2.5 text-sm text-[#999999] focus:outline-none cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label htmlFor="agenceurReferent" className="block text-xs font-medium text-[#4B5563] mb-1.5">
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

            {/* Section 5: RGPD */}
            <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
              <h3 className="text-xs text-[#6B7280] font-medium">Consentement RGPD</h3>

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
                      formData.rgpd ? "bg-neutral-900" : "bg-[#D1D5DB]"
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
                  <span className="text-sm font-medium text-[#1F2027]">
                    {formData.rgpd ? "Oui" : "Non"}
                  </span>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Mes données ne seront utilisées qu'à cette fin et je pourrai retirer mon consentement à tout moment
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-[#E4E4E7] bg-white flex justify-end gap-3 flex-shrink-0 rounded-b-[16px]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
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
