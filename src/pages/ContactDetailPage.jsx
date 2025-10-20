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
  X
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

// Mock contact data
const mockContactData = {
  id: "contact_1",
  civility: "Mme",
  lastName: "DUBOIS",
  firstName: "Chloé",
  email: "chloe.dubois@gmail.com",
  mobilePhone: "",
  landlinePhone: "",
  status: "Leads - À qualifier",
  createdAt: "01/01/2025"
};

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
                    <span>{contact.mobilePhone || "—"}</span>
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
function TabNavigation({ activeTab, onTabChange, activeSubTab, onSubTabChange }) {
  const tabs = [
    { id: "contact-info", label: "Informations contact" },
    { id: "projects", label: "Projet", count: 0 },
    { id: "tasks", label: "Tâches", count: 1 },
    { id: "appointments", label: "Rendez-vous", count: 0 },
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

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
    />
  );
}

// Client Info Tab Content Component
function ClientInfoTabContent() {
  const [formData, setFormData] = useState({
    civility: "Mme",
    lastName: "DUBOIS",
    firstName: "Chloé",
    email: "chloe.dubois@gmail.com",
    mobilePhone: "",
    landlinePhone: "",
    origin: "",
    subOrigin: "",
    companyName: "",
    referent: "benjamin",
    clientAccessAccount: "",
    address: "",
    addressComplement: ""
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Coordonnées */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Coordonnées</h3>
          <button className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E5] hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap">
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
                placeholder="Nom"
              />
            </FormField>
            <FormField label="Prénom">
              <TextInput
                value={formData.firstName}
                onChange={(value) => updateField("firstName", value)}
                placeholder="Prénom"
              />
            </FormField>
            <FormField label="Email">
              <TextInput
                type="email"
                value={formData.email}
                onChange={(value) => updateField("email", value)}
                placeholder="Email"
              />
            </FormField>
            <FormField label="Portable">
              <TextInput
                type="tel"
                value={formData.mobilePhone}
                onChange={(value) => updateField("mobilePhone", value)}
                placeholder="Entrer un numéro"
              />
            </FormField>
            <FormField label="Fixe">
              <TextInput
                type="tel"
                value={formData.landlinePhone}
                onChange={(value) => updateField("landlinePhone", value)}
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
          statusColor="leads"
        />
      </div>

      {/* Origine client */}
      <FormSection title="Origine client" isGray={true}>
        <FormField label="Origine du contact">
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
      </FormSection>

      {/* Affectation */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Affectation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Nom de la société">
            <TextInput
              value={formData.companyName}
              onChange={(value) => updateField("companyName", value)}
              placeholder="Nom de la société"
            />
          </FormField>
          <FormField label="Agenceur référent">
            <div className="relative">
              <SelectInput
                value={formData.referent}
                onChange={(value) => updateField("referent", value)}
                options={[
                  { value: "benjamin", label: "Benjamin" }
                ]}
                placeholder="Sélectionner"
              />
              {formData.referent === "benjamin" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <img
                    src="https://i.pravatar.cc/32?img=5"
                    alt="Benjamin"
                    className="size-6 rounded-full"
                  />
                  <span className="text-sm text-neutral-900">Benjamin</span>
                </div>
              )}
            </div>
          </FormField>
          <FormField label="Compte accès client">
            <TextInput
              value={formData.clientAccessAccount}
              onChange={(value) => updateField("clientAccessAccount", value)}
              placeholder="Compte accès client"
            />
          </FormField>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm font-medium">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

// Address Modal Component
function AddressModal({ isOpen, onClose, onSave, initialAddress, initialComplement }) {
  const [tempAddress, setTempAddress] = useState(initialAddress);
  const [tempComplement, setTempComplement] = useState(initialComplement);

  useEffect(() => {
    setTempAddress(initialAddress);
    setTempComplement(initialComplement);
  }, [isOpen, initialAddress, initialComplement]);

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
            <input
              type="text"
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              placeholder="Entrer une adresse"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
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
function AddressBlockComponent({ address, complement, onAddressChange, onComplementChange, statusColor }) {
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
            placeholder="Entrer une adresse"
          />
        </FormField>
        <FormField label="Complément d'adresse">
          <TextInput
            value={complement}
            onChange={onComplementChange}
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
              <Popup>{address}</Popup>
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

// External Contact Tab Content Component
function ExternalContactTabContent() {
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

  const handleBack = () => {
    onNavigate("directory-all");
  };

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
          contact={mockContactData}
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
        />

        {/* Content */}
        <div className="w-full pb-6 px-4 lg:px-6 bg-[#F7F7F8]">
          <div className="bg-white border border-[#E5E5E5] border-t-0 rounded-b-xl p-8">
            {activeTab === "contact-info" && activeSubTab === "client-info" && (
              <ClientInfoTabContent />
            )}
            {activeTab === "contact-info" && activeSubTab === "external-contact" && (
              <ExternalContactTabContent />
            )}
            {activeTab === "contact-info" && activeSubTab === "property-info" && (
              <div className="p-12 text-center text-neutral-500">
                Contenu à venir
              </div>
            )}
            {activeTab !== "contact-info" && (
              <div className="p-12 text-center text-neutral-500">
                Contenu à venir
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
