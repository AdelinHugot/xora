// filename: ContactDetailPage.jsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Plus,
  MapPin
} from "lucide-react";
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
    <div className="bg-white border-b border-neutral-200 p-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm font-medium">Retour à l'annuaire</span>
        </button>

        {/* Contact info and actions */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Contact info */}
          <div className="flex-1">
            {/* Status and creation date */}
            <div className="text-sm text-[#7A7A7A] mb-2">
              Créé le {contact.createdAt} — {contact.status}
            </div>

            {/* Contact name */}
            <h1 className="text-3xl font-bold text-neutral-900">
              {contact.firstName} {contact.lastName}
            </h1>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onContact}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
            >
              <Mail className="size-4" />
              Contacter
            </button>
            <button
              onClick={onCall}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
            >
              <Phone className="size-4" />
              Appeler
            </button>
            <button
              onClick={onSchedule}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
            >
              <Calendar className="size-4" />
              Planifier un RDV
            </button>
            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Ajouter une tâche
            </button>
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
    <div className="bg-[#F7F7F8]">
      <div className="max-w-[1100px] mx-auto">
        {/* Main tabs */}
        <nav
          className="flex items-end gap-1 px-6 pt-4"
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
          <div className="bg-white border-t border-l border-r border-[#E5E5E5] mx-6">
            <nav
              className="flex items-center gap-8 px-6 h-12"
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

// Form Components
function FormSection({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
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
    agency: "",
    referent: "benjamin"
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Infos client */}
      <FormSection title="Infos client">
        <FormField label="Civilité client">
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
        <FormField label="Nom du client">
          <TextInput
            value={formData.lastName}
            onChange={(value) => updateField("lastName", value)}
            placeholder="Nom"
          />
        </FormField>
        <FormField label="Prénom client">
          <TextInput
            value={formData.firstName}
            onChange={(value) => updateField("firstName", value)}
            placeholder="Prénom"
          />
        </FormField>
        <FormField label="Email client">
          <TextInput
            type="email"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            placeholder="Email"
          />
        </FormField>
        <FormField label="Téléphone portable">
          <TextInput
            type="tel"
            value={formData.mobilePhone}
            onChange={(value) => updateField("mobilePhone", value)}
            placeholder="Entrer un numéro"
          />
        </FormField>
        <FormField label="Téléphone fixe">
          <TextInput
            type="tel"
            value={formData.landlinePhone}
            onChange={(value) => updateField("landlinePhone", value)}
            placeholder="Entrer un numéro"
          />
        </FormField>
        <FormField label="Adresse du bien principal" span={2}>
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50">
            <p className="text-sm text-neutral-600 mb-3">
              Veuillez renseigner l'adresse principale dans 'infos des biens' pour la visualiser sur cette page.
            </p>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-neutral-50 text-sm font-medium transition-colors">
              <MapPin className="size-4" />
              Ajouter une adresse
            </button>
          </div>
        </FormField>
      </FormSection>

      {/* Origine client */}
      <FormSection title="Origine client">
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
      <FormSection title="Affectation">
        <FormField label="Agence">
          <SelectInput
            value={formData.agency}
            onChange={(value) => updateField("agency", value)}
            placeholder="Sélectionner"
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
      </FormSection>

      {/* Compte accès client */}
      <FormSection title="Compte accès client">
        <div className="md:col-span-2">
          <p className="text-sm text-neutral-500">
            Aucun compte accès créé pour ce client.
          </p>
        </div>
      </FormSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm font-medium">
          Enregistrer les modifications
        </button>
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
        <div className="bg-[#F7F7F8]">
          <div className="max-w-[1100px] mx-auto px-6 pb-8">
            <div className="bg-white border border-[#E5E5E5] border-t-0 rounded-b-xl p-8">
              {activeTab === "contact-info" && activeSubTab === "client-info" && (
                <ClientInfoTabContent />
              )}
              {activeTab === "contact-info" && activeSubTab !== "client-info" && (
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
        </div>
      </main>
    </div>
  );
}
