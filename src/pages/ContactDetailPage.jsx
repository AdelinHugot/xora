// filename: ContactDetailPage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Plus,
  MapPin,
  ChevronLeft,
  X,
  Eye,
  MoreHorizontal,
  Home,
  Search,
  ChevronDown
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateTaskOrMemoModal from "../components/CreateTaskOrMemoModal";
import CreateContactModal from "../components/CreateContactModal";
import { useContact } from "../hooks/useContact";
import { useProjects } from "../hooks/useProjects";
import { useAppointments } from "../hooks/useAppointments";
import { useTaches } from "../hooks/useTaches";
import { supabase } from "../lib/supabase";
import { simplifyAddress, formatPhoneForDisplay } from "../utils/dataTransformers";

// Contact Header Component
function ContactHeader({ contact, onBack, onContact, onCall, onSchedule, onAddTask }) {
  return (
    <div className="bg-white border-b border-neutral-200 w-full py-6 px-4 lg:px-6">
      <div>
        {/* Contact info and actions */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Info blocks */}
          <div className="flex gap-4 flex-1">
            {/* Block 1: Back arrow */}
            <button
              onClick={onBack}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-[#E5E5E5] hover:bg-neutral-50 transition-colors"
            >
              <ChevronLeft className="size-5 text-neutral-900" />
            </button>

            {/* Block 2: Date and Status */}
            <div className="flex flex-col justify-center px-4 py-3 rounded-xl bg-white">
              <div className="text-sm font-bold text-neutral-900 mb-1">Créé le {contact.createdAt}</div>
              <div className="inline-flex gap-2 items-center">
                <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
                  {contact.status}
                </span>
                <img
                  src="https://i.pravatar.cc/32?img=5"
                  alt="Agent"
                  className="size-6 rounded-full"
                />
              </div>
            </div>

            {/* Block 3: Name and contact info */}
            <div className="flex items-center justify-center px-4 py-3 rounded-xl bg-white">
              <div className="flex items-center gap-4">
                <h1 className="text-base font-bold text-neutral-900">
                  {contact.firstName} {contact.lastName}
                </h1>
                <div className="flex items-center gap-3 text-sm text-neutral-600 border-l border-neutral-200 pl-4">
                  <div className="flex items-center gap-1">
                    <Phone className="size-4" />
                    <span>{formatPhoneForDisplay(contact.mobilePhone) || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="size-4" />
                    <span>{contact.email || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action buttons in 2 rows */}
          <div className="flex flex-col gap-2">
            {/* First row */}
            <div className="flex gap-2">
              <button
                onClick={onContact}
                className="flex items-center justify-center gap-2 w-40 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Mail className="size-4" />
                Contacter
              </button>
              <button
                onClick={onSchedule}
                className="flex items-center justify-center gap-2 w-40 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Calendar className="size-4" />
                Planifier un RDV
              </button>
            </div>
            {/* Second row */}
            <div className="flex gap-2">
              <button
                onClick={onCall}
                className="flex items-center justify-center gap-2 w-40 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Phone className="size-4" />
                Appeler
              </button>
              <button
                onClick={onAddTask}
                className="flex items-center justify-center gap-2 w-40 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Plus className="size-4" />
                Ajouter une tâche
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ activeTab, onTabChange, activeSubTab, onSubTabChange, projectsCount = 0, tasksCount = 0, appointmentsCount = 0 }) {
  const tabs = [
    { id: "contact-info", label: "Informations contact" },
    { id: "projects", label: "Projet", count: projectsCount },
    { id: "tasks", label: "Tâches", count: tasksCount },
    { id: "appointments", label: "Rendez-vous", count: appointmentsCount },
    { id: "loyalty", label: "Fidélisation" },
    { id: "documents", label: "Documents" }
  ];

  const subTabs = [
    { id: "client-info", label: "Infos client" },
    { id: "external-contact", label: "Contact externe" },
    { id: "property-info", label: "Infos des biens" }
  ];

  const showSubTabs = activeTab === "contact-info";

  return (
    <div className="w-full pt-4 pb-0 px-4 lg:px-6 bg-[#F7F7F8]">
      {/* Main tabs */}
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
                className={`px-5 py-3 text-[15px] font-medium leading-6 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white text-neutral-900 border-t border-l border-r border-[#E5E5E5] rounded-t-xl"
                    : "text-[#8A8A8A] hover:text-neutral-700"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1">({tab.count})</span>
                )}
              </button>
            );
          })}
        </nav>

      {/* Sub tabs bar (only for contact-info tab) */}
      {showSubTabs && (
        <div className="bg-white border-t border-l border-r border-[#E5E5E5] mt-0">
          <nav
            className="flex items-center gap-8 h-12"
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
                  className={`relative h-full px-6 text-[15px] font-medium leading-6 transition-colors ${
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
  );
}

// Form Components
function FormSection({ title, children, isGray = false }) {
  return (
    <div className={`rounded-xl border p-6 ${isGray ? "bg-gray-50 border-gray-200" : "bg-white border-[#E5E5E5]"}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children, span = 1 }) {
  const spanClass = span === 2 ? "md:col-span-2" : "";

  return (
    <div className={spanClass}>
      <label className="block text-sm font-medium text-[#5C5C5C] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options, placeholder, onBlur }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
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

function TextInput({ value, onChange, placeholder, type = "text", onBlur }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
    />
  );
}

// Address Input with Autocomplete Component
function AddressInputWithAutocomplete({ value, onChange, placeholder, onBlur }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const searchAddress = async (addressQuery) => {
    if (!addressQuery.trim() || addressQuery.trim().length <= 3) {
      setSearchResults([]);
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
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error searching address:", error);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSearch = (query) => {
    onChange(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(query);
    }, 500);
  };

  const handleSelectAddress = (result) => {
    onChange(result.display_name);
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleAddressSearch(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
      />

      {value.trim().length > 3 && !isSearching && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
          {searchResults.map((result, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectAddress(result)}
              className="w-full px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50 border-b border-[#E5E5E5] last:border-b-0"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {isSearching && value.trim().length > 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-10 p-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            <span className="text-sm text-neutral-600">Recherche en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Client Info Tab Content Component
function ClientInfoTabContent({ contact }) {
  const [formData, setFormData] = useState({
    civility: contact?.civilite || "",
    lastName: contact?.nom || "",
    firstName: contact?.prenom || "",
    email: contact?.email || "",
    mobilePhone: contact?.telephone || "",
    landlinePhone: "",
    origin: contact?.origine || "",
    subOrigin: contact?.sous_origine || "",
    companyName: contact?.societe || "",
    referent: contact?.agenceur_referent || "",
    clientAccessAccount: "",
    address: contact?.adresse || "",
    addressComplement: contact?.complement_adresse || ""
  });

  const [agenceurs, setAgenceurs] = useState([]);
  const [agenceurName, setAgenceurName] = useState("");

  const origines = ["Relation", "Salon", "Web", "Recommandation", "Démarchage"];
  const sousOrigines = {
    "Relation": ["Client existant", "Bouche à oreille", "Partenaire"],
    "Salon": ["Salon de l'habitat", "Salon du luxe", "Autre"],
    "Web": ["Google", "Site web", "Réseaux sociaux", "Autre"],
    "Recommandation": ["Client", "Architecte", "Autre professionnel"],
    "Démarchage": ["Porte à porte", "Appel téléphonique", "Email"]
  };

  // Update form when contact data changes
  useEffect(() => {
    if (contact) {
      setFormData({
        civility: contact.civilite || "",
        lastName: contact.nom || "",
        firstName: contact.prenom || "",
        email: contact.email || "",
        mobilePhone: contact.telephone || "",
        landlinePhone: "",
        origin: contact.origine || "",
        subOrigin: contact.sous_origine || "",
        companyName: contact.societe || "",
        referent: contact.agenceur_referent || "",
        clientAccessAccount: "",
        address: contact.adresse || "",
        addressComplement: contact.complement_adresse || ""
      });
    }
  }, [contact]);

  // Fetch agenceurs for the dropdown
  useEffect(() => {
    const fetchAgenceurs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: authData, error: authError } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', user.id)
          .single();

        if (authError) {
          console.error('Erreur lors de la récupération de l\'organisation:', authError);
          return;
        }

        // Get role IDs for Administrateur and Agenceur
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

        // Fetch users with these roles
        const { data: users, error: usersError } = await supabase
          .from('utilisateurs')
          .select('id, prenom, nom, id_role')
          .eq('id_organisation', authData.id_organisation)
          .in('id_role', roleIds);

        if (usersError) {
          console.error('Erreur lors de la récupération des agenceurs:', usersError);
          return;
        }

        setAgenceurs(users || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des agenceurs:', error);
      }
    };

    fetchAgenceurs();
  }, []);

  // Fetch agenceur name when referent changes
  useEffect(() => {
    if (formData.referent && agenceurs.length > 0) {
      const agenceur = agenceurs.find(a => a.id === formData.referent);
      if (agenceur) {
        setAgenceurName(`${agenceur.prenom} ${agenceur.nom}`);
      }
    }
  }, [formData.referent, agenceurs]);

  // Save single field to Supabase on blur
  const saveField = async (field, value) => {
    if (!contact?.id) return;

    const fieldMap = {
      civility: 'civilite',
      lastName: 'nom',
      firstName: 'prenom',
      email: 'email',
      mobilePhone: 'telephone',
      origin: 'origine',
      subOrigin: 'sous_origine',
      companyName: 'societe',
      referent: 'agenceur_referent',
      address: 'adresse',
      addressComplement: 'complement_adresse'
    };

    try {
      const updateData = {
        [fieldMap[field]]: value,
        modifie_le: new Date().toISOString()
      };

      const { error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', contact.id);

      if (error) {
        console.error(`Erreur lors de la sauvegarde du champ ${field}:`, error);
      } else {
        console.log(`${field} sauvegardé avec succès`);
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field, value) => {
    saveField(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Coordonnées */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Coordonnées</h3>
          <button onClick={() => setIsCreateContactModalOpen(true)} className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E5] hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap">
            + Ajouter un contact
          </button>
        </div>
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-[#E5E5E5] p-6">
          {/* Client Name Header */}
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {formData.firstName} {formData.lastName}
          </h2>

          {/* Contact Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Civilité">
              <SelectInput
                value={formData.civility}
                onChange={(value) => updateField("civility", value)}
                onBlur={() => handleFieldBlur("civility", formData.civility)}
                options={[
                  { value: "M", label: "M." },
                  { value: "Mme", label: "Mme" },
                  { value: "Autre", label: "Autre" }
                ]}
                placeholder="Sélectionner"
              />
            </FormField>
            <FormField label="Nom">
              <TextInput
                value={formData.lastName}
                onChange={(value) => updateField("lastName", value)}
                onBlur={() => handleFieldBlur("lastName", formData.lastName)}
                placeholder="Nom"
              />
            </FormField>
            <FormField label="Prénom">
              <TextInput
                value={formData.firstName}
                onChange={(value) => updateField("firstName", value)}
                onBlur={() => handleFieldBlur("firstName", formData.firstName)}
                placeholder="Prénom"
              />
            </FormField>
            <FormField label="Email">
              <TextInput
                type="email"
                value={formData.email}
                onChange={(value) => updateField("email", value)}
                onBlur={() => handleFieldBlur("email", formData.email)}
                placeholder="Email"
              />
            </FormField>
            <FormField label="Portable">
              <TextInput
                type="tel"
                value={formData.mobilePhone}
                onChange={(value) => updateField("mobilePhone", value)}
                onBlur={() => handleFieldBlur("mobilePhone", formData.mobilePhone)}
                placeholder="Entrer un numéro"
              />
            </FormField>
            <FormField label="Fixe">
              <TextInput
                type="tel"
                value={formData.landlinePhone}
                onChange={(value) => updateField("landlinePhone", value)}
                onBlur={() => handleFieldBlur("landlinePhone", formData.landlinePhone)}
                placeholder="Entrer un numéro"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Adresse du bien principal */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Adresse du bien principal</h3>
        <AddressBlockComponent
          address={formData.address}
          complement={formData.addressComplement}
          onAddressChange={(value) => updateField("address", value)}
          onComplementChange={(value) => updateField("addressComplement", value)}
          onAddressBlur={() => handleFieldBlur("address", formData.address)}
          onComplementBlur={() => handleFieldBlur("addressComplement", formData.addressComplement)}
          statusColor="leads"
        />
      </div>

      {/* Origine client */}
      <FormSection title="Origine client" isGray={true}>
        <FormField label="Origine du contact">
          <SelectInput
            value={formData.origin}
            onChange={(value) => updateField("origin", value)}
            onBlur={() => handleFieldBlur("origin", formData.origin)}
            options={origines.map(o => ({ value: o, label: o }))}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Sous origine">
          <SelectInput
            value={formData.subOrigin}
            onChange={(value) => updateField("subOrigin", value)}
            onBlur={() => handleFieldBlur("subOrigin", formData.subOrigin)}
            options={formData.origin && sousOrigines[formData.origin]
              ? sousOrigines[formData.origin].map(s => ({ value: s, label: s }))
              : []
            }
            placeholder="Sélectionner"
          />
        </FormField>
      </FormSection>

      {/* Affectation */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Affectation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Nom de la société">
            <TextInput
              value={formData.companyName}
              onChange={(value) => updateField("companyName", value)}
              onBlur={() => handleFieldBlur("companyName", formData.companyName)}
              placeholder="Nom de la société"
            />
          </FormField>
          <FormField label="Agenceur référent">
            <div className="relative">
              <SelectInput
                value={formData.referent}
                onChange={(value) => updateField("referent", value)}
                onBlur={() => handleFieldBlur("referent", formData.referent)}
                options={agenceurs.map(a => ({
                  value: a.id,
                  label: `${a.prenom} ${a.nom}`
                }))}
                placeholder="Sélectionner"
              />
              {formData.referent && agenceurName && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <img
                    src={`https://i.pravatar.cc/32?u=${formData.referent}`}
                    alt={agenceurName}
                    className="size-6 rounded-full"
                  />
                  <span className="text-sm text-neutral-900">{agenceurName}</span>
                </div>
              )}
            </div>
          </FormField>
          <FormField label="Compte accès client">
            <TextInput
              value={formData.clientAccessAccount}
              onChange={(value) => updateField("clientAccessAccount", value)}
              onBlur={() => handleFieldBlur("clientAccessAccount", formData.clientAccessAccount)}
              placeholder="Compte accès client"
            />
          </FormField>
        </div>
      </div>

    </div>
  );
}

// Address Modal Component
function AddressModal({ isOpen, onClose, onSave, initialAddress, initialComplement }) {
  const [tempAddress, setTempAddress] = useState(initialAddress);
  const [tempComplement, setTempComplement] = useState(initialComplement);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setTempAddress(initialAddress);
    setTempComplement(initialComplement);
  }, [isOpen, initialAddress, initialComplement]);

  const searchAddress = async (addressQuery) => {
    if (!addressQuery.trim() || addressQuery.trim().length <= 3) {
      setSearchResults([]);
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
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error searching address:", error);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSearch = (query) => {
    setTempAddress(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(query);
    }, 500);
  };

  const simplifyAddressDisplay = (fullAddress) => {
    // Extract from the address object or string
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

    // Extract street address: combine first 1 or 2 parts that contain the street info
    // Typically: "18 Place Ambroise Courtois" or split as "18" and "Place Ambroise Courtois"
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
            part !== streetParts[0] &&
            part !== streetParts[1] &&
            part.length > 0) {
          city = part;
          break;
        }
      }
    } else {
      // If no postal code found, try to find city from the end
      for (let i = parts.length - 1; i > 1; i--) {
        const part = parts[i];
        if (!/^\d+$/.test(part) &&
            !part.toLowerCase().includes('arrondissement') &&
            !part.toLowerCase().includes('france') &&
            part !== streetParts[0] &&
            part !== streetParts[1] &&
            part.length > 0) {
          city = part;
          break;
        }
      }
    }

    // Build simplified address: "18 Place Ambroise Courtois, 69008, Lyon"
    const simplifiedParts = [streetAddress];
    if (postalCode) simplifiedParts.push(postalCode);
    if (city) simplifiedParts.push(city);

    return simplifiedParts.filter(p => p && p.length > 0).join(', ');
  };

  const handleSelectAddress = (result) => {
    const simplified = simplifyAddressDisplay(result.display_name);
    setTempAddress(simplified);
    setSearchResults([]);
  };

  const handleSave = () => {
    onSave(tempAddress, tempComplement);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Ajouter une adresse</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-neutral-600" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#5C5C5C] mb-1.5">
              Adresse
            </label>
            <div className="relative">
              <input
                type="text"
                value={tempAddress}
                onChange={(e) => handleAddressSearch(e.target.value)}
                placeholder="Entrer une adresse"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />

              {tempAddress.trim().length > 3 && !isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAddress(result)}
                      className="w-full px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50 border-b border-[#E5E5E5] last:border-b-0"
                    >
                      {simplifyAddressDisplay(result.display_name)}
                    </button>
                  ))}
                </div>
              )}

              {isSearching && tempAddress.trim().length > 3 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-10 p-3">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center justify-center w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
                    <span className="text-sm text-neutral-600">Recherche en cours...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C5C5C] mb-1.5">
              Complément d'adresse
            </label>
            <input
              type="text"
              value={tempComplement}
              onChange={(e) => setTempComplement(e.target.value)}
              placeholder="Complément d'adresse (optionnel)"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!tempAddress.trim()}
            className="flex-1 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300 text-sm font-medium transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

// Address Block Component
function AddressBlockComponent({ address, complement, onAddressChange, onComplementChange, onAddressBlur, onComplementBlur, statusColor }) {
  const [coordinates, setCoordinates] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Geocode address when it changes
  useEffect(() => {
    if (address && address.trim()) {
      // Using OpenStreetMap Nominatim API for geocoding
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch(err => console.error("Geocoding error:", err));
    }
  }, [address]);

  const handleSaveAddress = (newAddress, newComplement) => {
    onAddressChange(newAddress);
    onComplementChange(newComplement);
  };

  if (!address) {
    return (
      <>
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-[#E5E5E5] p-6">
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50">
            <p className="text-sm text-neutral-600 mb-3">
              Veuillez renseigner l'adresse principale pour la visualiser sur la carte.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors">
              <MapPin className="size-4" />
              Ajouter une adresse
            </button>
          </div>
        </div>
        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAddress}
          initialAddress={address}
          initialComplement={complement}
        />
      </>
    );
  }

  // Map color based on status
  const getMarkerColor = () => {
    switch (statusColor) {
      case "leads":
        return "#666666";
      case "contact":
        return "#0066CC";
      case "client":
        return "#00AA00";
      default:
        return "#666666";
    }
  };

  return (
    <div className="col-span-1 md:col-span-2 flex gap-6">
      {/* Left: Address fields */}
      <div className="flex-1 flex flex-col gap-4">
        <FormField label="Adresse">
          <TextInput
            value={address}
            onChange={onAddressChange}
            onBlur={onAddressBlur}
            placeholder="Entrer une adresse"
          />
        </FormField>
        <FormField label="Complément d'adresse">
          <TextInput
            value={complement}
            onChange={onComplementChange}
            onBlur={onComplementBlur}
            placeholder="Complément d'adresse (optionnel)"
          />
        </FormField>
      </div>

      {/* Right: Map */}
      <div className="flex-1">
        {coordinates ? (
          <MapContainer center={coordinates} zoom={13} style={{ height: "200px", borderRadius: "0.75rem" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={coordinates}>
              <Popup>{simplifyAddress(address)}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="h-52 bg-gray-100 rounded-xl flex items-center justify-center text-neutral-500">
            Chargement de la carte...
          </div>
        )}
      </div>
    </div>
  );
}

// Property Info Tab Content Component
function PropertyInfoTabContent({ contact }) {
  const [properties, setProperties] = useState([
    {
      id: 1,
      address: contact?.adresse || "",
      complement: contact?.complement_adresse || "",
      type: "Bien principal",
      isExpanded: true,
      owner: "",
      propertyType: "",
      propertyNature: "",
      workType: "",
      moreThanTwoYears: "",
      floor: "",
      elevator: "",
      miscInfo: ""
    }
  ]);

  const togglePropertyExpand = (id) => {
    setProperties(prev =>
      prev.map(prop =>
        prop.id === id ? { ...prop, isExpanded: !prop.isExpanded } : prop
      )
    );
  };

  // Save property field to Supabase on blur
  const savePropertyField = async (id, field, value) => {
    // Only save main property (id === 1) to contacts table
    if (id !== 1 || !contact?.id) return;

    const fieldMap = {
      address: 'adresse',
      complement: 'complement_adresse'
    };

    try {
      const updateData = {
        [fieldMap[field]]: value,
        modifie_le: new Date().toISOString()
      };

      const { error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', contact.id);

      if (error) {
        console.error(`Erreur lors de la sauvegarde du champ ${field}:`, error);
      } else {
        console.log(`${field} sauvegardé avec succès`);
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const updateProperty = (id, field, value) => {
    setProperties(prev =>
      prev.map(prop =>
        prop.id === id ? { ...prop, [field]: value } : prop
      )
    );
  };

  const handlePropertyFieldBlur = (id, field, value) => {
    savePropertyField(id, field, value);
  };

  const addProperty = () => {
    const newId = Math.max(...properties.map(p => p.id), 0) + 1;
    setProperties(prev => [
      ...prev,
      {
        id: newId,
        address: "",
        complement: "",
        type: "Bien secondaire",
        isExpanded: false,
        owner: "",
        propertyType: "",
        propertyNature: "",
        workType: "",
        moreThanTwoYears: "",
        floor: "",
        elevator: "",
        miscInfo: ""
      }
    ]);
  };

  const deleteProperty = (id) => {
    if (properties.length > 1) {
      setProperties(prev => prev.filter(prop => prop.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Properties List */}
      <div className="space-y-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden"
          >
            {/* Property Header */}
            <button
              onClick={() => togglePropertyExpand(property.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-neutral-900">
                      Bien N°{property.id}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {simplifyAddress(property.address) || "Adresse non renseignée"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-[10px] bg-gray-100 text-gray-700 text-xs font-medium">
                      {property.type}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronLeft
                className={`size-5 text-neutral-400 transition-transform ${
                  property.isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {/* Property Details */}
            {property.isExpanded && (
              <div className="border-t border-[#E5E5E5] p-6 bg-gray-50">
                {/* Line 1: Address and Complement */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField label="Adresse">
                      <AddressInputWithAutocomplete
                        value={property.address}
                        onChange={(value) => updateProperty(property.id, "address", value)}
                        onBlur={() => handlePropertyFieldBlur(property.id, "address", property.address)}
                        placeholder="Entrer une adresse"
                      />
                    </FormField>
                    <FormField label="Complément d'adresse">
                      <TextInput
                        value={property.complement}
                        onChange={(value) => updateProperty(property.id, "complement", value)}
                        onBlur={() => handlePropertyFieldBlur(property.id, "complement", property.complement)}
                        placeholder="Complément d'adresse (optionnel)"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Line 2: Owner, Property Type, Property Nature, Work Type */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormField label="Propriétaire">
                      <SelectInput
                        value={property.owner}
                        onChange={(value) => updateProperty(property.id, "owner", value)}
                        options={[
                          { value: "propriétaire", label: "Propriétaire" },
                          { value: "locataire", label: "Locataire" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                    <FormField label="Type de bien">
                      <SelectInput
                        value={property.propertyType}
                        onChange={(value) => updateProperty(property.id, "propertyType", value)}
                        options={[
                          { value: "appartement", label: "Appartement" },
                          { value: "maison", label: "Maison" },
                          { value: "studio", label: "Studio" },
                          { value: "t2", label: "T2" },
                          { value: "t3", label: "T3" },
                          { value: "t4", label: "T4" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                    <FormField label="Type de propriété">
                      <SelectInput
                        value={property.propertyNature}
                        onChange={(value) => updateProperty(property.id, "propertyNature", value)}
                        options={[
                          { value: "location", label: "Location" },
                          { value: "vente", label: "Vente" },
                          { value: "propre", label: "Propre" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                    <FormField label="Nature des travaux">
                      <SelectInput
                        value={property.workType}
                        onChange={(value) => updateProperty(property.id, "workType", value)}
                        options={[
                          { value: "renovation", label: "Rénovation" },
                          { value: "construction", label: "Construction" },
                          { value: "agencement", label: "Agencement" },
                          { value: "autre", label: "Autre" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Line 3: +2 years, Floor, Elevator, Misc Info */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormField label="+2 ans">
                      <SelectInput
                        value={property.moreThanTwoYears}
                        onChange={(value) => updateProperty(property.id, "moreThanTwoYears", value)}
                        options={[
                          { value: "oui", label: "Oui" },
                          { value: "non", label: "Non" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                    <FormField label="Étage">
                      <SelectInput
                        value={property.floor}
                        onChange={(value) => updateProperty(property.id, "floor", value)}
                        options={[
                          { value: "rdc", label: "RDC" },
                          { value: "1", label: "1" },
                          { value: "2", label: "2" },
                          { value: "3", label: "3" },
                          { value: "4", label: "4" },
                          { value: "5", label: "5" },
                          { value: "6", label: "6" },
                          { value: "7", label: "7" },
                          { value: "8", label: "8+" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                    <FormField label="Ascenseur">
                      <SelectInput
                        value={property.elevator}
                        onChange={(value) => updateProperty(property.id, "elevator", value)}
                        options={[
                          { value: "oui", label: "Oui" },
                          { value: "non", label: "Non" }
                        ]}
                        placeholder="Sélectionner"
                      />
                    </FormField>
                    <FormField label="Infos diverses">
                      <TextInput
                        value={property.miscInfo}
                        onChange={(value) => updateProperty(property.id, "miscInfo", value)}
                        placeholder="Infos diverses"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Delete Button */}
                {properties.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Supprimer ce bien
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Property Button */}
      <div className="flex justify-start">
        <button
          onClick={addProperty}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          Ajouter un bien
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button className="px-6 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm font-medium">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

// Dropdown Filter Component
function FilterDropdown({ label, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full hover:bg-neutral-50 transition-colors"
      >
        <span className="flex-1 text-left truncate">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-20 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50 border-b border-[#E5E5E5]"
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50 ${
                value === option.value ? "bg-neutral-50 font-medium" : ""
              }`}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Search Input Component
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E5E5] bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
      />
    </div>
  );
}

// Project List Tab Content Component
function ProjectListTabContent({ projects = [], loading = false, onAddProject, users = [] }) {
  // Transform projects from Supabase to display format
  const displayProjects = (projects || []).map(p => {
    // Find the referent user
    const referent = users.find(u => u.id === p.id_referent);
    const referentName = referent ? `${referent.prenom} ${referent.nom}` : "Non assigné";

    // Truncate address if needed
    const address = p.adresse_chantier || "Non spécifiée";
    const truncatedAddress = address.length > 30 ? address.substring(0, 30) + "..." : address;

    return {
      id: p.id,
      trade: p.metier_etudie || "Non spécifié",
      name: p.nom_projet || "Sans titre",
      agent: {
        name: referentName,
        avatar: referent ? `https://i.pravatar.cc/32?u=${referent.id}` : `https://i.pravatar.cc/32?img=0`
      },
      status: "Etude à réaliser",
      propertyType: truncatedAddress,
      addedDate: p.cree_le ? new Date(p.cree_le).toLocaleDateString('fr-FR') : ""
    };
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Extract unique values for filters
  const trades = [...new Set(displayProjects.map(p => p.trade))].map(trade => ({
    value: trade,
    label: trade
  }));

  const agents = [...new Set(displayProjects.map(p => p.agent.name))].map(name => {
    const agent = displayProjects.find(p => p.agent.name === name);
    return {
      value: name,
      label: name,
      icon: <img src={agent.agent.avatar} alt={name} className="size-5 rounded-full" />
    };
  });

  const statuses = [...new Set(displayProjects.map(p => p.status))].map(status => ({
    value: status,
    label: status
  }));

  const dateOptions = [
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "older", label: "Plus ancien" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Etude à réaliser":
        return { bg: "#FEF3C7", text: "#92400E", icon: "📌" };
      case "En cours":
        return { bg: "#FEF3C7", text: "#92400E", icon: "▶" };
      case "Devis":
        return { bg: "#DBEAFE", text: "#1E40AF", icon: "📄" };
      case "Terminé":
        return { bg: "#DCFCE7", text: "#166534", icon: "✓" };
      case "En attente":
        return { bg: "#F3E8FF", text: "#6B21A8", icon: "⏳" };
      case "Etude client":
        return { bg: "#FEF3C7", text: "#92400E", icon: "📌" };
      default:
        return { bg: "#F3F4F6", text: "#1F2937", icon: "•" };
    }
  };

  // Filter projects based on search and filters
  const filteredProjects = displayProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.trade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrade = !selectedTrade || project.trade === selectedTrade;
    const matchesAgent = !selectedAgent || project.agent.name === selectedAgent;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;

    // Simple date filtering based on dates in mock data
    let matchesDate = true;
    if (selectedDate) {
      const projectDate = new Date(displayProjects.find(p => p.id === project.id).addedDate.split('/').reverse().join('-'));
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      switch (selectedDate) {
        case "today":
          matchesDate = projectDate.toDateString() === today.toDateString();
          break;
        case "week":
          matchesDate = projectDate >= weekAgo;
          break;
        case "month":
          matchesDate = projectDate >= monthAgo;
          break;
        case "older":
          matchesDate = projectDate < monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesTrade && matchesAgent && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Title and Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Liste des projets</h3>
        <button
          onClick={onAddProject}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E9E9E9] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          Ajouter un projet
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-2"></div>
            <p className="text-neutral-600">Chargement des projets...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayProjects.length === 0 && (
        <div className="rounded-xl p-6 border text-center" style={{ backgroundColor: "#F8F9FA", borderColor: "#E9E9E9" }}>
          <p className="text-neutral-600 mb-2">📋</p>
          <p className="text-neutral-900 font-medium">Aucun projet</p>
          <p className="text-sm text-neutral-500">Ce contact n'a pas de projet associé</p>
        </div>
      )}

      {/* Gray Container with Filters and Table */}
      {!loading && displayProjects.length > 0 && (
      <div className="rounded-xl p-6 border" style={{ backgroundColor: "#F8F9FA", borderColor: "#E9E9E9" }}>
        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un projet..."
          />
          <FilterDropdown
            label="Métier"
            value={selectedTrade}
            onChange={setSelectedTrade}
            options={trades}
            placeholder="Tous les métiers"
          />
          <FilterDropdown
            label="Agenceur.euse"
            value={selectedAgent}
            onChange={setSelectedAgent}
            options={agents}
            placeholder="Tous les agenceurs"
          />
          <FilterDropdown
            label="Statut"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statuses}
            placeholder="Tous les statuts"
          />
          <FilterDropdown
            label="Date"
            value={selectedDate}
            onChange={setSelectedDate}
            options={dateOptions}
            placeholder="Filtre de date"
          />
        </div>

        {/* Projects Table */}
        <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "#E9E9E9" }}>
          <table className="w-full" role="table">
            <thead>
              <tr style={{ backgroundColor: "#F8F8F8", borderBottom: "1px solid #E9E9E9" }}>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Métier</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Nom du projet</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Agenceur.euse</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Statut</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Type de propriété</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Ajouté le</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Actions rapides</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  style={{ borderBottom: "1px solid #E9E9E9" }}
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  <td className="py-4 px-4" role="cell">
                    <span className="text-sm text-neutral-600">{project.trade}</span>
                  </td>
                  <td className="py-4 px-4" role="cell">
                    <span className="text-sm text-neutral-600">{project.name}</span>
                  </td>
                  <td className="py-4 px-4" role="cell">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.agent.avatar}
                        alt={project.agent.name}
                        className="size-6 rounded-full"
                      />
                      <span className="text-sm text-neutral-600">{project.agent.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" role="cell">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: getStatusColor(project.status).bg, color: getStatusColor(project.status).text }}
                    >
                      <span>{getStatusColor(project.status).icon}</span>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4 px-4" role="cell">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-gray-100">
                        <Home className="size-4 text-neutral-600" />
                      </div>
                      <span className="text-sm text-neutral-600">{project.propertyType}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" role="cell">
                    <span className="text-sm text-neutral-600">{project.addedDate}</span>
                  </td>
                  <td className="py-4 px-4" role="cell">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 rounded-xl border bg-white hover:bg-[#FAFAFA] transition-colors"
                        style={{ borderColor: "#E9E9E9" }}
                        title="Voir le projet"
                      >
                        <Eye className="size-4 text-neutral-600" />
                      </button>
                      <button
                        className="p-2 rounded-xl border bg-white hover:bg-[#FAFAFA] transition-colors"
                        style={{ borderColor: "#E9E9E9" }}
                        title="Plus d'options"
                      >
                        <MoreHorizontal className="size-4 text-neutral-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="p-12 text-center text-neutral-500">
              {"Aucun projet ne correspond à vos filtres"}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

// Tasks Tab Content Component
function TasksTabContent({ contact, users = [], projects = [] }) {
  const [taskFilter, setTaskFilter] = useState("in-progress");
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const { taches, loading, error, createTache } = useTaches();

  // Filter tasks by contact and status
  const filteredTasks = taches.filter(task => {
    // Filter by contact OR by project associated with this contact
    const contactName = `${contact?.prenom} ${contact?.nom}`.trim();
    const isClientMatch = task.clientName === contactName;

    // Check if task belongs to any project of this contact (using id_projet first, then name fallback)
    const isProjectMatch = projects.some(project => {
      // Prefer id_projet matching if available
      if (task.id_projet && project.id && task.id_projet === project.id) {
        return true;
      }
      // Fallback to name matching
      return task.projectName === project.titre;
    });

    // Show task if it matches the client name OR belongs to a project of this contact
    if (!isClientMatch && !isProjectMatch) {
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

  const handleCreateTask = async (payload) => {
    try {
      // Find the project ID if a project is selected
      let id_projet = null;
      if (payload.project) {
        const selectedProject = projects.find(p => p.titre === payload.project);
        if (selectedProject) {
          id_projet = selectedProject.id;
        }
      }

      // Add contact and project information to the payload
      const taskData = {
        titre: payload.kind === "Tâche" ? payload.taskType || "Tâche sans titre" : payload.memoName,
        type: payload.kind,
        id_contact: contact?.id || null,
        nom_client: `${contact?.prenom} ${contact?.nom}`.trim(),
        id_projet: id_projet,
        nom_projet: payload.project || null,
        tag: payload.taskType || "Autre",
        note: payload.note,
        date_echeance: payload.dueDate || payload.memoEcheance,
        statut: "non_commence",
        id_affecte_a: payload.salarie || null
      };

      console.log("Creating task with payload:", taskData);
      await createTache(taskData);
      setIsCreateTaskModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la création de la tâche:", err);
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
          onClick={() => setIsCreateTaskModalOpen(true)}
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
            const statusColor = getStatusColor(task.statut);
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
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      {task.statut}
                    </span>
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

      {/* Create Task Modal */}
      <CreateTaskOrMemoModal
        open={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        preFilledClient={contact ? `${contact.prenom} ${contact.nom}` : ""}
        preFilledContactId={contact?.id || null}
        employees={users}
        projects={projects}
      />
    </div>
  );
}

// Create Appointment Modal Component
function CreateAppointmentModal({ isOpen, onClose, onSave, users = [] }) {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    collaborators: [],
    directory: "",
    location: "",
    comments: ""
  });

  const [collaboratorDropdownOpen, setCollaboratorDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        return;
      }
      // Fermer les dropdowns si on clique en dehors
      if (collaboratorDropdownOpen || locationDropdownOpen) {
        const target = event.target;
        if (!target.closest('.collaborator-dropdown') && !target.closest('.location-dropdown')) {
          setCollaboratorDropdownOpen(false);
          setLocationDropdownOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, collaboratorDropdownOpen, locationDropdownOpen]);

  // Transform users to collaborators format
  const collaborators = users.map(user => ({
    id: user.id,
    name: `${user.prenom} ${user.nom}`,
    avatar: `https://i.pravatar.cc/32?u=${user.id}`
  }));

  const mockAddresses = [
    "123 Rue de la Paix, 75000 Paris",
    "45 Avenue des Champs, 75008 Paris"
  ];

  if (!isOpen) return null;

  const toggleCollaborator = (id) => {
    if (formData.collaborators.includes(id)) {
      setFormData({
        ...formData,
        collaborators: formData.collaborators.filter(cid => cid !== id)
      });
    } else {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, id]
      });
    }
  };

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value.slice(0, 25) });
  };

  const handleStartDateTimeChange = (date, time) => {
    setFormData({
      ...formData,
      startDate: date,
      startTime: time,
      endDate: date,
      endTime: time ? addHoursToTime(time, 1) : ""
    });
  };

  const addHoursToTime = (timeStr, hours) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const newH = (h + hours) % 24;
    return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleSave = () => {
    onSave(formData);
    setFormData({
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      collaborators: [],
      directory: "",
      location: "",
      comments: ""
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[60vw] p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Créer un rendez-vous</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-neutral-600" />
          </button>
        </div>

        {/* Bloc 1: Nom du rendez-vous */}
        <div className="mb-6 rounded-lg p-4 bg-gray-50 border border-[#E9E9E9]">
          <div className="flex items-start justify-between mb-2">
            <label className="text-sm font-semibold text-neutral-900">Nom du rendez-vous</label>
            <span className="text-xs text-neutral-500">{formData.title.length}/25</span>
          </div>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Entrer le nom du RDV"
            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>

        {/* Bloc 2: Date et Heure */}
        <div className="mb-6 rounded-lg p-4 bg-gray-50 border border-[#E9E9E9]">
          <label className="text-sm font-semibold text-neutral-900 block mb-4">Date et heure du rendez-vous</label>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-xs text-neutral-600 block mb-1">Date de début</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleStartDateTimeChange(e.target.value, formData.startTime)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-neutral-600 block mb-1">Heure de début</label>
              <input
                type="time"
                step="300"
                value={formData.startTime}
                onChange={(e) => handleStartDateTimeChange(formData.startDate, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
            <div className="flex flex-col items-center justify-end" style={{ paddingBottom: "20px" }}>
              <div className="h-0.5 bg-neutral-300 rounded-full" style={{ width: "65px", backgroundColor: "#969696" }}></div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-neutral-600 block mb-1">Heure de fin</label>
              <input
                type="time"
                step="300"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-neutral-600 block mb-1">Date de fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
          </div>
        </div>

        {/* Bloc 3: Collaborateurs et Annuaire */}
        <div className="mb-6 rounded-lg p-4 bg-gray-50 border border-[#E9E9E9]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-neutral-900 block mb-2">Collaborateur(s)</label>
              <div className="relative collaborator-dropdown">
                <button
                  onClick={() => setCollaboratorDropdownOpen(!collaboratorDropdownOpen)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 text-left flex items-center justify-between hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                >
                  <div className="flex items-center gap-2">
                    {formData.collaborators.length === 0 ? (
                      <span className="text-sm">Sélectionner collaborateur(s)</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          {collaborators
                            .filter(c => formData.collaborators.includes(c.id))
                            .map(c => (
                              <img
                                key={c.id}
                                src={c.avatar}
                                alt={c.name}
                                className="size-5 rounded-full border border-white"
                              />
                            ))}
                        </div>
                        <span className="text-sm">
                          {collaborators
                            .filter(c => formData.collaborators.includes(c.id))
                            .map(c => c.name)
                            .join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="size-4 text-neutral-600 flex-shrink-0" />
                </button>

                {collaboratorDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-10">
                    {collaborators.length === 0 ? (
                      <div className="p-3 text-center text-sm text-neutral-500">
                        Aucun collaborateur disponible
                      </div>
                    ) : (
                      collaborators.map((collab) => (
                        <button
                          key={collab.id}
                          onClick={() => toggleCollaborator(collab.id)}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors"
                        >
                          <div
                            className={`flex items-center justify-center w-4 h-4 rounded border-2 ${
                              formData.collaborators.includes(collab.id)
                                ? "bg-neutral-900 border-neutral-900"
                                : "border-[#E5E5E5]"
                            }`}
                          >
                            {formData.collaborators.includes(collab.id) && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <img src={collab.avatar} alt={collab.name} className="size-6 rounded-full" />
                          <span className="text-sm text-neutral-600">{collab.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-900 block mb-2">Nom du client</label>
              <button
                onClick={() => setCollaboratorDropdownOpen(false)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 text-left flex items-center justify-between hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              >
                <span className="text-sm">
                  {formData.directory ?
                    (formData.directory === "contact1" ? "Chloé DUBOIS" : "Pierre MARTIN")
                    : "Sélectionner un contact"}
                </span>
                <ChevronDown className="size-4 text-neutral-600" />
              </button>
              <div className="absolute mt-2 w-full bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-10"
                style={{ display: 'none', right: 0 }}>
                <button
                  onClick={() => setFormData({ ...formData, directory: "contact1" })}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-50 text-sm border-b border-neutral-100 last:border-b-0"
                >
                  Chloé DUBOIS
                </button>
                <button
                  onClick={() => setFormData({ ...formData, directory: "contact2" })}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-50 text-sm border-b border-neutral-100 last:border-b-0"
                >
                  Pierre MARTIN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 4: Lieu du RDV */}
        <div className="mb-6 rounded-lg p-4 bg-gray-50 border border-[#E9E9E9]">
          <label className="text-sm font-semibold text-neutral-900 block mb-2">Lieu du rendez-vous</label>
          <div className="relative mb-3 location-dropdown">
            <input
              type="text"
              placeholder="Entrer ou sélectionner une adresse"
              value={formData.location}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, location: value });
                if (value.trim()) {
                  const filtered = mockAddresses.filter(addr =>
                    addr.toLowerCase().includes(value.toLowerCase())
                  );
                  setFilteredAddresses(filtered);
                  setLocationDropdownOpen(true);
                } else {
                  setFilteredAddresses(mockAddresses);
                  setLocationDropdownOpen(true);
                }
              }}
              onFocus={() => {
                setLocationDropdownOpen(true);
                setFilteredAddresses(mockAddresses);
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
            {locationDropdownOpen && filteredAddresses.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-10">
                {filteredAddresses.map((addr, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFormData({ ...formData, location: addr });
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-50 text-sm border-b border-neutral-100 last:border-b-0"
                  >
                    {addr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bloc 5: Commentaires */}
        <div className="mb-6 rounded-lg p-4 bg-gray-50 border border-[#E9E9E9]">
          <label className="text-sm font-semibold text-neutral-900 block mb-2">Commentaires</label>
          <textarea
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            placeholder="Ajouter des commentaires..."
            className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 resize-none"
            rows="4"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium transition-colors"
          >
            Créer le RDV
          </button>
        </div>
      </div>
    </div>
  );
}

// Appointments Tab Content Component
function AppointmentsTabContent({ contact, users = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { appointments, addAppointment, loading } = useAppointments(contact?.id);

  const handleSaveAppointment = async (formData) => {
    try {
      await addAppointment(formData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du rendez-vous:', err);
      alert('Erreur lors de la sauvegarde du rendez-vous');
    }
  };

  return (
    <div className="space-y-6">
      {/* Rendez-vous Section */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Liste des rendez-vous</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-white border border-[#E5E5E5] hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            + Ajouter un RDV
          </button>
        </div>
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Vous n'avez pas renseigné de rendez-vous
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl border border-[#E5E5E5] p-4 space-y-2">
                <h4 className="font-semibold text-neutral-900">{appointment.titre || 'Sans titre'}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                  <div>
                    <span className="font-medium">📅 Date:</span> {new Date(appointment.date_debut).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-medium">🕐 Heure:</span> {appointment.heure_debut} - {appointment.heure_fin}
                  </div>
                  <div>
                    <span className="font-medium">📍 Lieu:</span> {appointment.lieu || 'Non spécifié'}
                  </div>
                  {appointment.commentaires && (
                    <div>
                      <span className="font-medium">📝 Notes:</span> {appointment.commentaires}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        users={users}
      />
    </div>
  );
}

// External Contact Tab Content Component
function ExternalContactTabContent({ contact }) {
  const [externalContacts, setExternalContacts] = useState([]);
  const [directoryContacts, setDirectoryContacts] = useState([]);

  return (
    <div className="space-y-6">
      {/* Liste de contacts externe */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Liste de contacts externe</h3>
          <button className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E5] hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap">
            + Ajouter un contact externe
          </button>
        </div>
        {externalContacts.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Vous n'avez pas renseigné de contact externe
          </div>
        ) : (
          <div className="space-y-3">
            {externalContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                {contact.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liste des contacts annuaires */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Liste des contacts annuaires</h3>
          <button className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E5] hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap">
            + Ajouter depuis annuaire
          </button>
        </div>
        {directoryContacts.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Vous n'avez pas renseigné d'annuaire
          </div>
        ) : (
          <div className="space-y-3">
            {directoryContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                {contact.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Contact Detail Page Component
export default function ContactDetailPage({
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
  contactId
}) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  const [activeTab, setActiveTab] = useState("contact-info");
  const [activeSubTab, setActiveSubTab] = useState("client-info");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Extract the actual contact identifier from contactId (remove "contact-" prefix)
  const actualContactId = contactId ? contactId.replace(/^contact-/, '') : null;

  // Fetch contact data from Supabase
  const { contact: dbContact, loading, error } = useContact(actualContactId);

  // Fetch projects for this contact
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects(actualContactId);

  // Fetch tasks for this contact
  const { taches, loading: tachesLoading } = useTaches();

  // Fetch appointments for this contact
  const { appointments, loading: appointmentsLoading } = useAppointments(actualContactId);

  // Fetch users from organization
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data: authData } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', authUser.id)
          .single();

        if (!authData) return;

        const { data: utilisateurs } = await supabase
          .from('utilisateurs')
          .select('id, prenom, nom')
          .eq('id_organisation', authData.id_organisation)
          .eq('statut', 'actif');

        setUsers(utilisateurs || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      }
    };

    fetchUsers();
  }, []);

  // Format contact data for display
  const contactData = dbContact ? {
    id: dbContact.id,
    civility: dbContact.civilite || "",
    lastName: dbContact.nom || "",
    firstName: dbContact.prenom || "",
    email: dbContact.email || "",
    mobilePhone: dbContact.telephone || "",
    landlinePhone: "",
    status: dbContact.statut || "Leads",
    createdAt: dbContact.cree_le ? new Date(dbContact.cree_le).toLocaleDateString('fr-FR') : ""
  } : {
    id: "",
    civility: "",
    lastName: "",
    firstName: "",
    email: "",
    mobilePhone: "",
    landlinePhone: "",
    status: "Leads",
    createdAt: ""
  };

  const handleBack = () => {
    onNavigate("directory-all");
  };

  const handleCreateProject = async (projectData) => {
    try {
      // Insérer le projet dans la base de données
      // projectData contient déjà tous les champs nécessaires
      const { data, error } = await supabase
        .from('projets')
        .insert([projectData])
        .select();

      if (error) throw error;

      // Fermer la modale
      setIsCreateProjectModalOpen(false);

      // Rafraîchir la liste des projets
      await refetchProjects();

      alert("Projet créé avec succès!");
    } catch (err) {
      console.error('Erreur lors de la création du projet:', err);
      alert("Erreur lors de la création du projet: " + err.message);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] text-neutral-900">
        <Sidebar
          currentPage="directory"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main
          className="lg:transition-[margin] lg:duration-200 min-h-screen flex items-center justify-center"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="text-neutral-600">Chargement...</div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !dbContact) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] text-neutral-900">
        <Sidebar
          currentPage="directory"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main
          className="lg:transition-[margin] lg:duration-200 min-h-screen flex items-center justify-center"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="text-red-600">
            {error ? `Erreur: ${error}` : "Contact non trouvé"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-neutral-900">
      <Sidebar
        currentPage="directory"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />

      <main
        className="lg:transition-[margin] lg:duration-200 min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-neutral-200 bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-neutral-900">Fiche client</h1>
          </div>
          <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
        </header>

        {/* Contact Header */}
        <ContactHeader
          contact={contactData}
          onBack={handleBack}
          onContact={() => console.log("Contact")}
          onCall={() => console.log("Call")}
          onSchedule={() => console.log("Schedule")}
          onAddTask={() => console.log("Add task")}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
          projectsCount={(projects || []).length}
          tasksCount={(taches || []).length}
          appointmentsCount={(appointments || []).length}
        />

        {/* Content */}
        <div className="w-full pb-6 px-4 lg:px-6 bg-[#F7F7F8]">
          <div className="bg-white border border-[#E9E9E9] rounded-b-xl p-8">
            {activeTab === "contact-info" && activeSubTab === "client-info" && (
              <ClientInfoTabContent contact={dbContact} />
            )}
            {activeTab === "contact-info" && activeSubTab === "external-contact" && (
              <ExternalContactTabContent contact={dbContact} />
            )}
            {activeTab === "contact-info" && activeSubTab === "property-info" && (
              <PropertyInfoTabContent contact={dbContact} />
            )}
            {activeTab === "projects" && (
              <ProjectListTabContent
                projects={projects}
                loading={projectsLoading}
                onAddProject={() => setIsCreateProjectModalOpen(true)}
                users={users}
              />
            )}
            {activeTab === "tasks" && (
              <TasksTabContent contact={dbContact} users={users} projects={projects} />
            )}
            {activeTab === "appointments" && (
              <AppointmentsTabContent contact={dbContact} users={users} />
            )}
            {(activeTab !== "contact-info" && activeTab !== "projects" && activeTab !== "tasks" && activeTab !== "appointments") && (
              <div className="p-12 text-center text-neutral-500">
                Contenu à venir
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        contact={dbContact}
      />

      {/* Create Contact Modal */}
      <CreateContactModal
        open={isCreateContactModalOpen}
        onClose={() => setIsCreateContactModalOpen(false)}
        onSubmit={(contactData) => {
          setIsCreateContactModalOpen(false);
          // The modal handles creation via Supabase insert
        }}
      />
    </div>
  );
}
