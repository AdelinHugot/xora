// filename: TeamMemberPage.jsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit3,
  MessageSquare
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

// Mock member data (in a real app, this would come from routing params or API)
const mockMemberData = {
  id: "mem_1",
  civility: "Mr",
  firstName: "Jérémy",
  lastName: "COLOMB",
  email: "jeremy.colomb@travauxconfort.com",
  role: "Agenceur",
  phonePortable: "+33601020304",
  phoneFixe: "+33123456789",
  avatarUrl: "https://i.pravatar.cc/128?img=12",
  contractType: "CDI",
  job: "Agenceur",
  hasPhone: true,
  hasCar: true,
  hasLaptop: true,
  agendaColor: "#A8A8A8",
  xoraSubscriptionActive: true
};

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors ${
        enabled ? "bg-neutral-900" : "bg-neutral-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-8" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{enabled ? "Activé" : "Désactivé"}</span>
    </button>
  );
}

// Header Component
function MemberHeader({ member, onBack, onEdit, onContact }) {
  return (
    <div className="bg-white border-b border-neutral-200 p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm font-medium">Retour à la liste</span>
        </button>

        {/* Profile header */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-4">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={`${member.firstName} ${member.lastName}`}
                className="size-20 rounded-full object-cover border-2 border-neutral-200"
              />
            ) : (
              <div className="size-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold border-2 border-neutral-200">
                {member.firstName?.[0]}{member.lastName?.[0]}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {member.firstName} {member.lastName}
                </h1>
                <img src="/logo-xora.png" alt="XORA" className="h-6" />
              </div>
              <p className="text-neutral-500">{member.role}</p>
            </div>
          </div>

          {/* Right: Contact info + Actions */}
          <div className="flex items-center gap-6">
            {/* Contact icons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-neutral-600">
                <Phone className="size-4" />
                <span className="text-sm">{member.phoneFixe?.replace("+33", "0").replace(/(\d{2})(?=\d)/g, "$1 ")}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail className="size-4" />
                <span className="text-sm">{member.email}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
              >
                <Edit3 className="size-4" />
                Modifier le profil
              </button>
              <button
                onClick={onContact}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-medium transition-colors"
              >
                <MessageSquare className="size-4" />
                Contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tabs Component
function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "info", label: "Informations collaborateur" },
    { id: "documents", label: "Documents" }
  ];

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-6">
        <nav className="flex gap-8" aria-label="Onglets">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Subscription Banner Component
function SubscriptionBanner({ active, onChange }) {
  return (
    <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-white font-semibold">Abonnement Xora Actif</span>
        <img src="/logo-xora.png" alt="XORA" className="h-5 brightness-0 invert" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm">Non</span>
        <ToggleSwitch enabled={active} onChange={onChange} />
        <span className="text-white text-sm font-medium">Oui</span>
      </div>
    </div>
  );
}

// Form Field Components
function FormField({ label, children, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled = false }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
    />
  );
}

function SelectInput({ value, onChange, options, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function PhoneInput({ value, onChange, placeholder, disabled = false }) {
  const formatPhoneDisplay = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("33")) {
      const local = cleaned.substring(2);
      return local.replace(/(\d{2})(?=\d)/g, "$1 ");
    }
    return phone;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">🇫🇷</span>
      <input
        type="tel"
        value={formatPhoneDisplay(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
      />
    </div>
  );
}

function ToggleField({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">Non</span>
        <ToggleSwitch enabled={enabled} onChange={onChange} />
        <span className="text-sm text-neutral-900 font-medium">Oui</span>
      </div>
    </div>
  );
}

// Member Info Tab Component
function MemberInfoTab({ member, onUpdate }) {
  const [formData, setFormData] = useState(member);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Subscription Banner */}
      <SubscriptionBanner
        active={formData.xoraSubscriptionActive}
        onChange={(value) => updateField("xoraSubscriptionActive", value)}
      />

      {/* Main Information Block */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Civilité */}
          <FormField label="Civilité du membre">
            <SelectInput
              value={formData.civility}
              onChange={(value) => updateField("civility", value)}
              options={[
                { value: "Mr", label: "M." },
                { value: "Mme", label: "Mme" },
                { value: "Autre", label: "Autre" }
              ]}
            />
          </FormField>

          {/* Nom */}
          <FormField label="Nom du membre" required>
            <TextInput
              value={formData.lastName}
              onChange={(value) => updateField("lastName", value)}
              placeholder="COLOMB"
            />
          </FormField>

          {/* Prénom */}
          <FormField label="Prénom client" required>
            <TextInput
              value={formData.firstName}
              onChange={(value) => updateField("firstName", value)}
              placeholder="Jérémy"
            />
          </FormField>

          {/* Email */}
          <FormField label="Email client" required>
            <TextInput
              value={formData.email}
              onChange={(value) => updateField("email", value)}
              placeholder="jeremy.colomb@travauxconfort.com"
            />
          </FormField>

          {/* Téléphone portable */}
          <FormField label="Téléphone portable">
            <PhoneInput
              value={formData.phonePortable}
              onChange={(value) => updateField("phonePortable", value)}
              placeholder="Entrer un numéro"
            />
          </FormField>

          {/* Téléphone fixe */}
          <FormField label="Téléphone fixe">
            <PhoneInput
              value={formData.phoneFixe}
              onChange={(value) => updateField("phoneFixe", value)}
              placeholder="Entrer un numéro"
            />
          </FormField>

          {/* Type de contrat */}
          <FormField label="Type de contrat">
            <SelectInput
              value={formData.contractType}
              onChange={(value) => updateField("contractType", value)}
              options={[
                { value: "CDI", label: "CDI" },
                { value: "CDD", label: "CDD" },
                { value: "Alternance", label: "Alternance" },
                { value: "Stage", label: "Stage" },
                { value: "Freelance", label: "Freelance" }
              ]}
            />
          </FormField>

          {/* Métier */}
          <FormField label="Métier">
            <SelectInput
              value={formData.job}
              onChange={(value) => updateField("job", value)}
              options={[
                { value: "Agenceur", label: "Agenceur" },
                { value: "Commercial", label: "Commercial" },
                { value: "Technicien", label: "Technicien" },
                { value: "Manager", label: "Manager" },
                { value: "Administratif", label: "Administratif" }
              ]}
            />
          </FormField>

          {/* Téléphone mis à disposition */}
          <FormField label="Téléphone mis à disposition">
            <ToggleField
              label=""
              enabled={formData.hasPhone}
              onChange={(value) => updateField("hasPhone", value)}
            />
          </FormField>

          {/* Voiture */}
          <FormField label="Voiture">
            <ToggleField
              label=""
              enabled={formData.hasCar}
              onChange={(value) => updateField("hasCar", value)}
            />
          </FormField>

          {/* Ordinateur portable */}
          <FormField label="Ordinateur portable">
            <ToggleField
              label=""
              enabled={formData.hasLaptop}
              onChange={(value) => updateField("hasLaptop", value)}
            />
          </FormField>
        </div>
      </div>

      {/* Agenda Color Block */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-4">
          Couleur collaborateur agenda
        </h3>
        <div className="flex items-center gap-4">
          <div
            className="size-12 rounded-lg border border-neutral-200"
            style={{ backgroundColor: formData.agendaColor }}
          />
          <div className="flex-1">
            <input
              type="color"
              value={formData.agendaColor}
              onChange={(e) => updateField("agendaColor", e.target.value)}
              className="w-full h-10 rounded-xl border border-neutral-200 cursor-pointer"
            />
          </div>
          <span className="text-sm font-mono text-neutral-600">
            {formData.agendaColor.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onUpdate(formData)}
          className="px-6 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

// Documents Tab Component (placeholder)
function DocumentsTab() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-12">
      <div className="text-center">
        <p className="text-neutral-500">Aucun document disponible pour le moment</p>
      </div>
    </div>
  );
}

// Main Team Member Page Component
export default function TeamMemberPage({
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
  memberId
}) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  const [activeTab, setActiveTab] = useState("info");

  const handleBack = () => {
    onNavigate("settings-team");
  };

  const handleEdit = () => {
    console.log("Edit member");
  };

  const handleContact = () => {
    console.log("Contact member");
  };

  const handleUpdate = (updatedData) => {
    console.log("Update member data:", updatedData);
    alert("Modifications enregistrées");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="settings-team"
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
            <h1 className="text-xl font-semibold text-neutral-900">Fiche collaborateur</h1>
          </div>
          <UserTopBar
            settingsActive={true}
            onSettingsClick={() => onNavigate("settings-connection")}
          />
        </header>

        {/* Member Header */}
        <MemberHeader
          member={mockMemberData}
          onBack={handleBack}
          onEdit={handleEdit}
          onContact={handleContact}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="max-w-[1400px] mx-auto p-6">
          {activeTab === "info" && (
            <MemberInfoTab member={mockMemberData} onUpdate={handleUpdate} />
          )}
          {activeTab === "documents" && <DocumentsTab />}
        </div>
      </main>
    </div>
  );
}
