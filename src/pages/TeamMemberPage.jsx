// filename: TeamMemberPage.jsx
import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit3,
  MessageSquare
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";
import { useTeamMember } from "../hooks/useTeamMember";

// Mock member data
const mockEmployees = [
  {
    id: 1,
    name: "Benjamin Petit",
    firstName: "Benjamin",
    lastName: "Petit",
    position: "Chef de projet",
    role: "Chef de projet",
    jobType: "Dirigeant",
    email: "benjamin.petit@xora.fr",
    phone: "06 12 34 56 78",
    phoneFixe: "+33612345678",
    phonePortable: "+33612345678",
    avatar: "https://i.pravatar.cc/128?img=5",
    avatarUrl: "https://i.pravatar.cc/128?img=5",
    contractType: "CDI",
    job: "Dirigeant",
    hasPhone: true,
    hasCar: true,
    hasLaptop: true,
    agendaColor: "#A8A8A8",
    xoraSubscriptionActive: true,
    civility: "Mr"
  },
  {
    id: 2,
    name: "Sophie Martin",
    firstName: "Sophie",
    lastName: "Martin",
    position: "Directrice commerciale",
    role: "Directrice commerciale",
    jobType: "Commercial",
    email: "sophie.martin@xora.fr",
    phone: "06 23 45 67 89",
    phoneFixe: "+33623456789",
    phonePortable: "+33623456789",
    avatar: "https://i.pravatar.cc/128?img=8",
    avatarUrl: "https://i.pravatar.cc/128?img=8",
    contractType: "CDI",
    job: "Commercial",
    hasPhone: true,
    hasCar: true,
    hasLaptop: true,
    agendaColor: "#E8A8A8",
    xoraSubscriptionActive: true,
    civility: "Mme"
  },
  {
    id: 3,
    name: "Thomas Dubois",
    firstName: "Thomas",
    lastName: "Dubois",
    position: "Responsable RH",
    role: "Responsable RH",
    jobType: "RH",
    email: "thomas.dubois@xora.fr",
    phone: "06 34 56 78 90",
    phoneFixe: "+33634567890",
    phonePortable: "+33634567890",
    avatar: "https://i.pravatar.cc/128?img=15",
    avatarUrl: "https://i.pravatar.cc/128?img=15",
    contractType: "CDI",
    job: "RH",
    hasPhone: true,
    hasCar: false,
    hasLaptop: true,
    agendaColor: "#A8D8A8",
    xoraSubscriptionActive: true,
    civility: "Mr"
  },
  {
    id: 4,
    name: "Claire Rousseau",
    firstName: "Claire",
    lastName: "Rousseau",
    position: "Développeuse",
    role: "Développeuse",
    jobType: "Technicien",
    email: "claire.rousseau@xora.fr",
    phone: "06 45 67 89 01",
    phoneFixe: "+33645678901",
    phonePortable: "+33645678901",
    avatar: "https://i.pravatar.cc/128?img=22",
    avatarUrl: "https://i.pravatar.cc/128?img=22",
    contractType: "CDI",
    job: "Technicien",
    hasPhone: true,
    hasCar: true,
    hasLaptop: true,
    agendaColor: "#A8A8E8",
    xoraSubscriptionActive: true,
    civility: "Mme"
  },
  {
    id: 5,
    name: "Marc Lefebvre",
    firstName: "Marc",
    lastName: "Lefebvre",
    position: "Responsable technique",
    role: "Responsable technique",
    jobType: "Agenceur",
    email: "marc.lefebvre@xora.fr",
    phone: "06 56 78 90 12",
    phoneFixe: "+33656789012",
    phonePortable: "+33656789012",
    avatar: "https://i.pravatar.cc/128?img=10",
    avatarUrl: "https://i.pravatar.cc/128?img=10",
    contractType: "CDI",
    job: "Agenceur",
    hasPhone: true,
    hasCar: true,
    hasLaptop: true,
    agendaColor: "#E8C8A8",
    xoraSubscriptionActive: true,
    civility: "Mr"
  },
  {
    id: 6,
    name: "Nathalie Blanc",
    firstName: "Nathalie",
    lastName: "Blanc",
    position: "Comptable",
    role: "Comptable",
    jobType: "Administratif",
    email: "nathalie.blanc@xora.fr",
    phone: "06 67 89 01 23",
    phoneFixe: "+33667890123",
    phonePortable: "+33667890123",
    avatar: "https://i.pravatar.cc/128?img=25",
    avatarUrl: "https://i.pravatar.cc/128?img=25",
    contractType: "CDI",
    job: "Administratif",
    hasPhone: true,
    hasCar: false,
    hasLaptop: true,
    agendaColor: "#D8A8E8",
    xoraSubscriptionActive: true,
    civility: "Mme"
  }
];

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
              <p className="text-neutral-500">{member.job}</p>
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
      <div className="w-full px-4 lg:px-6">
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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
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
        <div className="space-y-6">
          {/* Ligne 1: Civilité, Nom, Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <FormField label="Nom du membre" required>
              <TextInput
                value={formData.lastName}
                onChange={(value) => updateField("lastName", value)}
                placeholder="COLOMB"
              />
            </FormField>

            <FormField label="Prénom client" required>
              <TextInput
                value={formData.firstName}
                onChange={(value) => updateField("firstName", value)}
                placeholder="Jérémy"
              />
            </FormField>
          </div>

          {/* Ligne 2: Email, Téléphone portable, Téléphone fixe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Email client" required>
              <TextInput
                value={formData.email}
                onChange={(value) => updateField("email", value)}
                placeholder="jeremy.colomb@travauxconfort.com"
              />
            </FormField>

            <FormField label="Téléphone portable">
              <PhoneInput
                value={formData.phonePortable}
                onChange={(value) => updateField("phonePortable", value)}
                placeholder="Entrer un numéro"
              />
            </FormField>

            <FormField label="Téléphone fixe">
              <PhoneInput
                value={formData.phoneFixe}
                onChange={(value) => updateField("phoneFixe", value)}
                placeholder="Entrer un numéro"
              />
            </FormField>
          </div>

          {/* Ligne 3: Type de contrat, Métier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Ligne 4: Téléphone mis à disposition, Voiture, Ordinateur portable */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Téléphone mis à disposition</label>
              <ToggleField
                label=""
                enabled={formData.hasPhone}
                onChange={(value) => updateField("hasPhone", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Voiture</label>
              <ToggleField
                label=""
                enabled={formData.hasCar}
                onChange={(value) => updateField("hasCar", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Ordinateur portable</label>
              <ToggleField
                label=""
                enabled={formData.hasLaptop}
                onChange={(value) => updateField("hasLaptop", value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agenda Color Block */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-4">
          Couleur collaborateur agenda
        </h3>
        <div className="flex items-center gap-3 w-fit relative">
          <input
            type="color"
            value={formData.agendaColor}
            onChange={(e) => updateField("agendaColor", e.target.value)}
            className="absolute opacity-0 w-0 h-0 cursor-pointer"
            id="colorInput"
          />
          <label
            htmlFor="colorInput"
            className="size-12 rounded-lg border border-neutral-200 cursor-pointer block"
            style={{ backgroundColor: formData.agendaColor }}
            title="Cliquez pour changer la couleur"
          />
          <input
            type="text"
            value={formData.agendaColor.toUpperCase()}
            onChange={(e) => updateField("agendaColor", e.target.value)}
            placeholder="#000000"
            className="w-24 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-mono text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
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

  // Extract utilisateur ID from memberId (format: "team-member-{uuid}" or "mem_{uuid}")
  const utilisateurId = useMemo(() => {
    if (!memberId) return null;

    // Try team-member- format first (UUID)
    if (memberId.startsWith('team-member-')) {
      return memberId.replace('team-member-', '');
    }

    // Try mem_ format (captures UUID, not just digits)
    const idMatch = memberId.match(/mem_(.+)$/);
    if (idMatch) {
      return idMatch[1];
    }

    return memberId;
  }, [memberId]);

  // Fetch member data from Supabase
  const { member: memberData, loading, error, updateMember } = useTeamMember(utilisateurId);

  // Fallback to mock data if member not found
  const displayData = memberData || mockEmployees[0];

  const handleBack = () => {
    onNavigate("our-company");
  };

  const handleEdit = () => {
    console.log("Edit member");
  };

  const handleContact = () => {
    console.log("Contact member");
  };

  const handleUpdate = async (updatedData) => {
    console.log("Update member data:", updatedData);

    // Map UI field names to database column names
    const dbUpdates = {
      prenom: updatedData.firstName,
      nom: updatedData.lastName,
      email: updatedData.email,
      telephone_mobile: updatedData.phonePortable,
      telephone: updatedData.phoneFixe,
      poste: updatedData.position,
      type_contrat: updatedData.contractType,
      civilite: updatedData.civility,
      telephone_disponible: updatedData.hasPhone,
      voiture_disponible: updatedData.hasCar,
      ordinateur_disponible: updatedData.hasLaptop,
      couleur_agenda: updatedData.agendaColor,
      abonnement_xora_actif: updatedData.xoraSubscriptionActive
    };

    const result = await updateMember(dbUpdates);
    if (result.success) {
      alert("Modifications enregistrées");
    } else {
      alert("Erreur lors de la sauvegarde: " + result.error);
    }
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mb-4"></div>
              <p className="text-neutral-600">Chargement du profil...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-red-600 font-semibold">Erreur lors du chargement</p>
              <p className="text-neutral-600 text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Member Content */}
        {!loading && !error && (
          <>
            {/* Member Header */}
            <MemberHeader
              member={displayData}
              onBack={handleBack}
              onEdit={handleEdit}
              onContact={handleContact}
            />

            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content */}
            <div className="max-w-[1400px] mx-auto p-6">
              {activeTab === "info" && (
                <MemberInfoTab member={displayData} onUpdate={handleUpdate} />
              )}
              {activeTab === "documents" && <DocumentsTab />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
