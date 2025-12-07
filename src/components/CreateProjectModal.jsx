import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function CreateProjectModal({ isOpen, onClose, onSubmit, contact }) {
  const [isExpressProject, setIsExpressProject] = useState(false);
  const [users, setUsers] = useState([]);
  const [contactAddresses, setContactAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Bloc 2
    origin: "",
    subOrigin: "",
    name: "",
    sponsorLink: "",
    sponsorReferent: "",
    // Bloc 3
    projectName: "",
    projectReferent: "",
    siteAddress: "",
    // Bloc 4
    trade: ""
  });

  const [errors, setErrors] = useState({});

  // Fetch users from the organization
  useEffect(() => {
    if (isOpen && contact) {
      fetchUsers();
      // Re-fetch addresses each time modal opens to get latest data
      fetchContactAddresses();
    }
  }, [isOpen, contact?.id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const { data: authData } = await supabase
        .from('utilisateurs_auth')
        .select('id_organisation')
        .eq('id_auth_user', authUser.id)
        .single();

      if (!authData) throw new Error('Organisation non trouvée');

      const { data: utilisateurs } = await supabase
        .from('utilisateurs')
        .select('id, prenom, nom')
        .eq('id_organisation', authData.id_organisation)
        .eq('statut', 'actif');

      setUsers(utilisateurs || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactAddresses = async () => {
    try {
      // Récupérer les adresses des biens immobiliers
      let properties = [];
      if (contact && contact.id) {
        const { data } = await supabase
          .from('biens_immobiliers')
          .select('id, adresse')
          .eq('id_contact', contact.id)
          .is('supprime_le', null);
        properties = data || [];
      }

      // Ajouter l'adresse principale du contact si elle existe
      const addresses = [...properties];
      if (contact && contact.adresse && !addresses.some(p => p.adresse === contact.adresse)) {
        addresses.unshift({
          id: 'main-address',
          adresse: contact.adresse
        });
      }

      setContactAddresses(addresses);
    } catch (err) {
      console.error('Erreur lors de la récupération des adresses:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Valider les champs requis
      if (!formData.projectName) {
        alert("Le nom du projet est requis");
        setSubmitting(false);
        return;
      }

      if (!formData.trade) {
        alert("Le métier est requis");
        setSubmitting(false);
        return;
      }

      // Récupérer le nom du contact
      const contactName = `${contact.prenom || ''} ${contact.nom || ''}`.trim();

      // Préparer les données du projet
      const projectData = {
        type: isExpressProject ? "express" : "standard",
        id_contact: contact.id,
        nom_contact: contactName,
        nom_projet: formData.projectName,
        titre: formData.projectName, // Requis dans la BDD
        statut: "Prospect",
        progression: 0,
        origine: formData.origin || null,
        sous_origine: formData.subOrigin || null,
        lien_sponsor: formData.sponsorLink || null,
        metier_etudie: formData.trade,
        adresse_chantier: formData.siteAddress || null,
        id_referent: formData.projectReferent || null,
        agence: null,
        id_organisation: contact.id_organisation,
        cree_le: new Date().toISOString()
      };

      // Appeler onSubmit avec les données
      await onSubmit(projectData);

      // Réinitialiser le formulaire
      setFormData({
        origin: "",
        subOrigin: "",
        name: "",
        sponsorLink: "",
        sponsorReferent: "",
        projectName: "",
        projectReferent: "",
        siteAddress: "",
        trade: ""
      });
      setIsExpressProject(false);
      onClose();
    } catch (err) {
      console.error('Erreur lors de la création du projet:', err);
      alert("Erreur lors de la création du projet");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // SVG Icons matching CreateContactModal style
  const DocumentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2.5H5a2.5 2.5 0 00-2.5 2.5v10A2.5 2.5 0 005 17.5h10a2.5 2.5 0 002.5-2.5V11M15 2.5v4M6 7h4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="relative w-full bg-white shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ maxWidth: '740px', borderRadius: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E4E4E7] flex-shrink-0 rounded-t-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#E4E4E7] rounded-lg">
                <DocumentIcon />
              </div>
              <h2 id="create-project-title" className="text-sm font-semibold text-[#1F2027]">
                Créer une fiche projet
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
          {/* Bloc 1: Express Project */}
          <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
            <h3 className="text-xs text-[#6B7280] font-medium">Projet express</h3>

            <div className="flex items-center gap-3">
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="expressProject"
                  checked={isExpressProject}
                  onChange={(e) => setIsExpressProject(e.target.checked)}
                  className="sr-only"
                />
                <label
                  htmlFor="expressProject"
                  className={`block w-full h-full rounded-full transition cursor-pointer ${
                    isExpressProject ? "bg-neutral-900" : "bg-[#D1D5DB]"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transition transform ${
                      isExpressProject ? "translate-x-6" : ""
                    }`}
                  />
                </label>
              </div>
              <div>
                <span className="text-sm font-medium text-[#1F2027]">
                  {isExpressProject ? "Oui" : "Non"}
                </span>
                <p className="text-xs text-[#6B7280] mt-1">
                  Projet express pour générer rapidement factures, devis et SAV
                </p>
              </div>
            </div>
          </section>

          {/* Bloc 2: Origin and Sponsor Info - Caché pour express project */}
          {!isExpressProject && (
          <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
            <h3 className="text-xs text-[#6B7280] font-medium">Informations d'origine</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                  Origine
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleChange("origin", e.target.value)}
                  placeholder="Origine"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                  Sous-origine
                </label>
                <input
                  type="text"
                  value={formData.subOrigin}
                  onChange={(e) => handleChange("subOrigin", e.target.value)}
                  placeholder="Sous-origine"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nom"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                Lien parrain
              </label>
              <input
                type="text"
                value={formData.sponsorLink}
                onChange={(e) => handleChange("sponsorLink", e.target.value)}
                placeholder="Lien parrain"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                Agenceur référent parrain
              </label>
              <SelectDropdown
                options={users.map(u => ({
                  value: u.id,
                  label: `${u.prenom} ${u.nom}`
                }))}
                value={formData.sponsorReferent}
                onChange={(value) => handleChange("sponsorReferent", value)}
                placeholder="Sélectionner un agenceur"
              />
            </div>
          </section>
          )}

          {/* Bloc 3: Project Details */}
          <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
            <h3 className="text-xs text-[#6B7280] font-medium">Détails du projet</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                  Nom du projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                  placeholder="Pose d'une cuisine"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 placeholder:text-[#A1A7B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                  Agenceur référent du projet
                </label>
                <SelectDropdown
                  options={users.map(u => ({
                    value: u.id,
                    label: `${u.prenom} ${u.nom}`
                  }))}
                  value={formData.projectReferent}
                  onChange={(value) => handleChange("projectReferent", value)}
                  placeholder="Sélectionner un agenceur"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                Adresse chantier
              </label>
              <SelectDropdown
                options={contactAddresses.map(addr => ({
                  value: addr.adresse,
                  label: addr.adresse
                }))}
                value={formData.siteAddress}
                onChange={(value) => handleChange("siteAddress", value)}
                placeholder="Sélectionner une adresse"
                empty={contactAddresses.length === 0}
              />
              {contactAddresses.length === 0 && (
                <p className="text-xs text-[#6B7280] mt-1.5">Aucune adresse associée à ce contact</p>
              )}
            </div>
          </section>

          {/* Bloc 4: Trade Selection */}
          <section className="rounded-lg bg-[#F3F4F6] p-4 space-y-3 border border-[#E1E4ED]">
            <h3 className="text-xs text-[#6B7280] font-medium">Classification</h3>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] mb-1.5">
                Sélectionner le métier <span className="text-red-500">*</span>
              </label>
              <SelectDropdown
                options={[
                  { value: "Cuisine", label: "Cuisine" },
                  { value: "Salle de bain", label: "Salle de bain" },
                  { value: "Dressing", label: "Dressing" },
                  { value: "Chambre", label: "Chambre" },
                  { value: "Salon", label: "Salon" },
                  { value: "Escalier", label: "Escalier" },
                  { value: "Autre", label: "Autre" }
                ]}
                value={formData.trade}
                onChange={(value) => handleChange("trade", value)}
                placeholder="Sélectionner un métier"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-[#E4E4E7] bg-white flex justify-end gap-3 flex-shrink-0 rounded-b-[16px]">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg border border-[#E1E4ED] bg-white text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 3.333v9.334M3.333 8h9.334" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span>{isExpressProject ? "Créer le projet express" : "Créer la fiche projet"}</span>
          </button>
        </footer>
        </form>
      </div>
    </div>
  );
}

// Select Dropdown Component
function SelectDropdown({ options, value, onChange, placeholder, empty = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

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
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
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
    }
  };

  if (empty) {
    return (
      <div className="w-full px-3 py-2.5 rounded-lg border border-[#E1E4ED] bg-[#F3F4F6] text-[#A1A7B6] text-sm">
        {placeholder}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 flex items-center justify-between text-sm"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-lg border border-[#E1E4ED] bg-white shadow-lg"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              tabIndex={-1}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                setFocusedIndex(-1);
              }}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`px-3 py-2 cursor-pointer transition-colors text-sm ${
                focusedIndex === index ? "bg-[#F3F4F6]" : ""
              } ${value === option.value ? "bg-[#F8F9FA]" : ""} ${
                index === 0 ? "rounded-t-lg" : ""
              } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
