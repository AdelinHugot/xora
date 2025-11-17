import React, { useState } from "react";
import { MoreHorizontal, Plus, Eye } from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

// Mock employee data
const mockEmployees = [
  {
    id: 1,
    name: "Benjamin Petit",
    position: "Chef de projet",
    jobType: "Dirigeant",
    email: "benjamin.petit@xora.fr",
    phone: "06 12 34 56 78",
    avatar: "https://i.pravatar.cc/32?img=5"
  },
  {
    id: 2,
    name: "Sophie Martin",
    position: "Directrice commerciale",
    jobType: "Commercial",
    email: "sophie.martin@xora.fr",
    phone: "06 23 45 67 89",
    avatar: "https://i.pravatar.cc/32?img=8"
  },
  {
    id: 3,
    name: "Thomas Dubois",
    position: "Responsable RH",
    jobType: "RH",
    email: "thomas.dubois@xora.fr",
    phone: "06 34 56 78 90",
    avatar: "https://i.pravatar.cc/32?img=15"
  },
  {
    id: 4,
    name: "Claire Rousseau",
    position: "Développeuse",
    jobType: "Technicien",
    email: "claire.rousseau@xora.fr",
    phone: "06 45 67 89 01",
    avatar: "https://i.pravatar.cc/32?img=22"
  },
  {
    id: 5,
    name: "Marc Lefebvre",
    position: "Responsable technique",
    jobType: "Agenceur",
    email: "marc.lefebvre@xora.fr",
    phone: "06 56 78 90 12",
    avatar: "https://i.pravatar.cc/32?img=10"
  },
  {
    id: 6,
    name: "Nathalie Blanc",
    position: "Comptable",
    jobType: "Administratif",
    email: "nathalie.blanc@xora.fr",
    phone: "06 67 89 01 23",
    avatar: "https://i.pravatar.cc/32?img=25"
  }
];

// Tab Navigation Component
function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "teams", label: "Équipes" },
    { id: "company", label: "Informations société" }
  ];

  return (
    <div className="bg-[#F8F9FA] px-4 lg:px-6">
      <nav
        className="flex items-end gap-1"
        role="tablist"
        aria-label="Onglets Notre Entreprise"
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
              className={`flex-1 px-5 py-3 text-[15px] font-medium leading-6 transition-all whitespace-nowrap inline-flex items-center justify-center gap-3 ${
                isActive
                  ? "bg-white text-neutral-900 border-t border-l border-r border-[#E5E5E5] rounded-t-xl"
                  : "text-[#8A8A8A] hover:text-neutral-700"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Teams Tab Content Component
function TeamsTabContent({ onNavigate }) {
  const [searchValue, setSearchValue] = useState("");
  const [filterJobType, setFilterJobType] = useState("");

  // Get unique job types for the filter
  const uniqueJobTypes = [...new Set(mockEmployees.map(emp => emp.jobType))].sort();

  // Filter employees based on search and job type
  const filteredEmployees = mockEmployees.filter((employee) => {
    const searchLower = searchValue.toLowerCase();
    const matchesSearch =
      employee.name.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.phone.toLowerCase().includes(searchLower);

    const matchesJobType = filterJobType === "" || employee.jobType === filterJobType;

    return matchesSearch && matchesJobType;
  });

  return (
    <div className="space-y-6">
      {/* Title, Search and Add Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Liste des salariés</h3>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            <Plus className="size-4" />
            Ajouter un salarié
          </button>
        </div>

        {/* Search and Filter Fields */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Rechercher par nom, email ou téléphone..."
            className="flex-1 px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
          />
          <div className="flex-1 relative">
            <select
              value={filterJobType}
              onChange={(e) => setFilterJobType(e.target.value)}
              className='w-full appearance-none px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10 shadow-[0_1px_2px_rgba(15,23,42,0.08)] pr-10'
            >
              <option value="">Tous les métiers</option>
              {uniqueJobTypes.map((jobType) => (
                <option key={jobType} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-[#5F6470] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M2 2L6 6L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Employees Container */}
      <div className="rounded-lg border border-[#E4E4E7] overflow-hidden" style={{ backgroundColor: "#F8F9FA" }}>
        {/* Header */}
        <div className="w-full border-b border-[#E4E4E7] p-4" style={{ backgroundColor: "#FAFAFA" }}>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-neutral-600 flex-1">Nom</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Type de métier</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Email</span>
            <span className="text-xs font-semibold text-neutral-600 flex-1">Téléphone</span>
            <div className="flex-shrink-0 w-20 flex items-center justify-center">
              <span className="text-xs font-semibold text-neutral-600">Actions</span>
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="p-4 space-y-3">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="border border-[#E4E4E7] rounded-lg bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-3">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="size-8 rounded-full flex-shrink-0"
                    />
                    <span className="text-sm font-medium text-neutral-900">{employee.name}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-600">{employee.jobType}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-600">{employee.email}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-600">{employee.phone}</span>
                  </div>
                  <div className="flex-shrink-0 w-20 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onNavigate(`team-member-mem_${employee.id}`)}
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                      title="Voir le détail"
                    >
                      <Eye className="size-4 text-neutral-600" />
                    </button>
                    <button
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                      title="Options du salarié"
                    >
                      <MoreHorizontal className="size-4 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-neutral-500 border border-[#E4E4E7] rounded-lg bg-white">
              Aucun salarié trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Company Info Tab Content Component
function CompanyTabContent() {
  const [companyInfo, setCompanyInfo] = useState({
    commercialName: "XORA SARL",
    address: "123 Rue de la Paix, 75000 Paris",
    phone: "01 23 45 67 89",
    website: "www.xora.fr",
    siret: "12345678901234",
    tva: "FR12345678901"
  });

  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const documents = [
    { id: 1, name: "IBAN", value: "FR76 1234 5678 9012 3456 7890 123" },
    { id: 2, name: "KBIS", value: "Document disponible" },
    { id: 3, name: "Assurance décennale", value: "Document disponible" }
  ];

  return (
    <div className="space-y-6">
      {/* Company Information Block */}
      <div className="bg-white rounded-lg border border-[#E4E4E7] overflow-hidden">
        <div className="border-b border-[#E4E4E7] px-6 py-4" style={{ backgroundColor: "#FAFAFA" }}>
          <h3 className="text-lg font-semibold text-neutral-900">Informations société</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">Nom commercial</label>
              <input
                type="text"
                value={companyInfo.commercialName}
                onChange={(e) => handleCompanyInfoChange("commercialName", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">Adresse du siège social</label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => handleCompanyInfoChange("address", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">Téléphone fixe</label>
              <input
                type="text"
                value={companyInfo.phone}
                onChange={(e) => handleCompanyInfoChange("phone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">Site internet</label>
              <input
                type="text"
                value={companyInfo.website}
                onChange={(e) => handleCompanyInfoChange("website", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">SIRET</label>
              <input
                type="text"
                value={companyInfo.siret}
                onChange={(e) => handleCompanyInfoChange("siret", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-600">N° de TVA</label>
              <input
                type="text"
                value={companyInfo.tva}
                onChange={(e) => handleCompanyInfoChange("tva", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E1E4ED] bg-white text-sm text-[#1F2027] focus:outline-none focus:ring-4 focus:ring-[#2B7FFF]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documents List Block */}
      <div className="bg-white rounded-lg border border-[#E4E4E7] overflow-hidden">
        <div className="border-b border-[#E4E4E7] px-6 py-4 flex items-center justify-between" style={{ backgroundColor: "#FAFAFA" }}>
          <h3 className="text-lg font-semibold text-neutral-900">Liste des documents</h3>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            <Plus className="size-4" />
            Ajouter des documents
          </button>
        </div>
        <div className="p-6 space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-[#E4E4E7] rounded-lg bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-neutral-900">{doc.name}</label>
                  <p className="text-sm text-neutral-600">{doc.value}</p>
                </div>
                <button
                  className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  title="Options du document"
                >
                  <MoreHorizontal className="size-4 text-neutral-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OurCompanyPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const [activeTab, setActiveTab] = useState("teams");
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900">
      <Sidebar
        currentPage="our-company"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main
        className="lg:transition-[margin] lg:duration-200 min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-[#E7E9EF] bg-white/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-neutral-900">Notre Entreprise</h1>
          </div>
          <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
        </header>

        {/* Spacing */}
        <div className="h-4"></div>

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <div className="bg-[#F8F9FA]">
          <div className="w-full pb-8 px-4 lg:px-6">
            <div className="bg-white border border-[#E5E5E5] border-t-0 rounded-b-lg p-8">
              {activeTab === "teams" && (
                <TeamsTabContent onNavigate={onNavigate} />
              )}
              {activeTab === "company" && (
                <CompanyTabContent />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
