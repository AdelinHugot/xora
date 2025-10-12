import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Upload,
  Plus,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Layout
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CreateContactModal from "../components/CreateContactModal";
import UserTopBar from "../components/UserTopBar";

// Mock data - 30+ contacts for filtering/pagination demo
const mockContacts = [
  { id: "1", name: "Chloé DUBOIS", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Relation", location: "Valras-Plage", projects: 2, status: "Prospect", addedAt: "25/05/25" },
  { id: "2", name: "Pierre MARTIN", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Montpellier", projects: 1, status: "Client", addedAt: "24/05/25" },
  { id: "3", name: "Marie BERNARD", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Web", location: "Nîmes", projects: 0, status: "Leads", addedAt: "23/05/25" },
  { id: "4", name: "Jean DURAND", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Recommandation", location: "Béziers", projects: 3, status: "Client", addedAt: "22/05/25" },
  { id: "5", name: "Anne MOREAU", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Agde", projects: 1, status: "Prospect", addedAt: "21/05/25" },
  { id: "6", name: "Paul ROBERT", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Web", location: "Sète", projects: 2, status: "Leads", addedAt: "20/05/25" },
  { id: "7", name: "Claire PETIT", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Relation", location: "Valras-Plage", projects: 0, status: "Prospect", addedAt: "19/05/25" },
  { id: "8", name: "Michel ROUX", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Montpellier", projects: 4, status: "Client", addedAt: "18/05/25" },
  { id: "9", name: "Sylvie LEROY", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Recommandation", location: "Nîmes", projects: 1, status: "Leads", addedAt: "17/05/25" },
  { id: "10", name: "François SIMON", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Béziers", projects: 2, status: "Client", addedAt: "16/05/25" },
  { id: "11", name: "Isabelle MICHEL", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Agde", projects: 0, status: "Prospect", addedAt: "15/05/25" },
  { id: "12", name: "Laurent GARCIA", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Relation", location: "Sète", projects: 3, status: "Leads", addedAt: "14/05/25" },
  { id: "13", name: "Nathalie DAVID", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Valras-Plage", projects: 1, status: "Client", addedAt: "13/05/25" },
  { id: "14", name: "Alain BERTRAND", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Recommandation", location: "Montpellier", projects: 2, status: "Prospect", addedAt: "12/05/25" },
  { id: "15", name: "Valérie THOMAS", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Salon", location: "Nîmes", projects: 0, status: "Leads", addedAt: "11/05/25" },
  { id: "16", name: "Olivier RICHARD", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Béziers", projects: 4, status: "Client", addedAt: "10/05/25" },
  { id: "17", name: "Catherine PETIT", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Relation", location: "Agde", projects: 1, status: "Prospect", addedAt: "09/05/25" },
  { id: "18", name: "Stéphane DURAND", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Salon", location: "Sète", projects: 2, status: "Leads", addedAt: "08/05/25" },
  { id: "19", name: "Monique MOREAU", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Recommandation", location: "Valras-Plage", projects: 0, status: "Client", addedAt: "07/05/25" },
  { id: "20", name: "Philippe MARTIN", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Web", location: "Montpellier", projects: 3, status: "Prospect", addedAt: "06/05/25" },
  { id: "21", name: "Sandrine BLANC", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Salon", location: "Nîmes", projects: 1, status: "Leads", addedAt: "05/05/25" },
  { id: "22", name: "Christophe ROUX", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Relation", location: "Béziers", projects: 2, status: "Client", addedAt: "04/05/25" },
  { id: "23", name: "Brigitte SIMON", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Recommandation", location: "Agde", projects: 0, status: "Prospect", addedAt: "03/05/25" },
  { id: "24", name: "Thierry LEROY", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Web", location: "Sète", projects: 4, status: "Leads", addedAt: "02/05/25" },
  { id: "25", name: "Pascale GARCIA", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Salon", location: "Valras-Plage", projects: 1, status: "Client", addedAt: "01/05/25" },
  { id: "26", name: "Bernard MICHEL", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Relation", location: "Montpellier", projects: 2, status: "Prospect", addedAt: "30/04/25" },
  { id: "27", name: "Martine DAVID", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Recommandation", location: "Nîmes", projects: 0, status: "Leads", addedAt: "29/04/25" },
  { id: "28", name: "Gérard BERTRAND", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Béziers", projects: 3, status: "Client", addedAt: "28/04/25" },
  { id: "29", name: "Nicole THOMAS", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Agde", projects: 1, status: "Prospect", addedAt: "27/04/25" },
  { id: "30", name: "Daniel RICHARD", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Relation", location: "Sète", projects: 2, status: "Leads", addedAt: "26/04/25" },
];

// Utility components
const Badge = ({ variant, children }) => {
  const variantClasses = {
    prospect: "bg-rose-100 text-rose-700 border-rose-200",
    client: "bg-sky-100 text-sky-800 border-sky-200", 
    leads: "bg-violet-100 text-violet-800 border-violet-200",
    projects: "bg-neutral-100 text-neutral-600 border-neutral-200"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

const IconButton = ({ icon: Icon, label, onClick, variant = "ghost" }) => {
  const variantClasses = {
    ghost: "border hover:bg-neutral-50",
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900"
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-xl transition-colors focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1 ${variantClasses[variant]}`}
    >
      <Icon className="size-4" />
    </button>
  );
};

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1 focus:border-neutral-300"
      />
    </div>
  );
};

const Select = ({ value, onChange, options, placeholder }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-1 focus:border-neutral-300"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const Topbar = ({ onNavigate }) => {
  return (
    <header className="h-16 border-b bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-xl lg:text-2xl text-neutral-900">Annuaire</h1>
      </div>
      <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
    </header>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("...");
    }
    
    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    
    // Always show last page if > 1
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="Première page"
        className="p-2 rounded-lg border hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft className="size-4" />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="p-2 rounded-lg border hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-4" />
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === "..."}
          aria-current={page === currentPage ? "page" : undefined}
          className={`px-3 py-2 rounded-lg text-sm font-medium ${
            page === currentPage
              ? "bg-neutral-900 text-white"
              : page === "..."
              ? "cursor-default"
              : "border hover:bg-neutral-50"
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="p-2 rounded-lg border hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-4" />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Dernière page"
        className="p-2 rounded-lg border hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight className="size-4" />
      </button>
    </nav>
  );
};

const ContactsTable = ({ contacts, onViewContact }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nom & prénom
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ajouté par
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Origine
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Localisation
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Projets en cours
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ajouté le
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Action rapide
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-neutral-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-neutral-900">{contact.name}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <img 
                    src={contact.addedBy.avatarUrl} 
                    alt={`Avatar de ${contact.addedBy.name}`} 
                    className="size-6 rounded-full"
                  />
                  <span className="text-sm text-neutral-600">{contact.addedBy.name}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm text-neutral-600">{contact.origin}</span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm text-neutral-600">{contact.location}</span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {contact.projects > 0 ? (
                  <Badge variant="projects">{contact.projects} projet{contact.projects > 1 ? 's' : ''}</Badge>
                ) : (
                  <span className="text-neutral-400">–</span>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <Badge variant={contact.status.toLowerCase()}>{contact.status}</Badge>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm text-neutral-600">{contact.addedAt}</span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={Eye}
                    label={`Voir la fiche de ${contact.name}`}
                    onClick={() => onViewContact(contact)}
                  />
                  <IconButton
                    icon={MoreHorizontal}
                    label={`Plus d'options pour ${contact.name}`}
                    onClick={() => console.log('Menu options pour', contact.name)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DirectoryContactsCard = ({ filter = "all" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    addedBy: "",
    origin: "",
    location: "",
    project: "",
    status: "",
    dateAdded: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 11;

  // Filter options
  const filterOptions = {
    addedBy: ["Jérémy", "Sophie", "Thomas"],
    origin: ["Relation", "Salon", "Web", "Recommandation"],
    location: ["Valras-Plage", "Montpellier", "Nîmes", "Béziers", "Agde", "Sète"],
    project: ["En cours", "Terminé", "En attente"],
    status: ["Prospect", "Client", "Leads"],
    dateAdded: ["Aujourd'hui", "Cette semaine", "Ce mois", "Ce trimestre"]
  };

  // Apply filters and search
  const filteredContacts = useMemo(() => {
    return mockContacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAddedBy = !filters.addedBy || contact.addedBy.name === filters.addedBy;
      const matchesOrigin = !filters.origin || contact.origin === filters.origin;
      const matchesLocation = !filters.location || contact.location === filters.location;
      const matchesStatus = !filters.status || contact.status === filters.status;

      // Apply type filter from sidebar submenu
      // Pour le moment, on affiche tous les contacts car il n'y a pas de champ "type" dans mockContacts
      // Dans une vraie application, on ajouterait un champ "type" et on filtrerait ici
      // const matchesType = filter === "all" || filter === "contacts" || contact.type === filter;

      return matchesSearch && matchesAddedBy && matchesOrigin && matchesLocation && matchesStatus;
    });
  }, [searchTerm, filters, filter]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + pageSize);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleViewContact = (contact) => {
    alert(`Voir la fiche de ${contact.name} (ID: ${contact.id})`);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateContact = async (formData) => {
    console.log("Creating contact:", formData);
    // Here you would typically make an API call
    // For now, we'll just log the data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  };

  return (
    <>
      <CreateContactModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateContact}
      />

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
      {/* Card Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-neutral-600" />
            <h2 className="text-lg font-bold text-neutral-900">
              Fiche contact ({filteredContacts.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-medium transition-colors">
              <Download className="size-4" />
              Exporter
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-medium transition-colors">
              <Upload className="size-4" />
              Importer
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Ajouter une fiche contact
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher"
          />
          <Select
            value={filters.addedBy}
            onChange={(value) => updateFilter('addedBy', value)}
            options={filterOptions.addedBy}
            placeholder="Agenceur.se"
          />
          <Select
            value={filters.origin}
            onChange={(value) => updateFilter('origin', value)}
            options={filterOptions.origin}
            placeholder="Origine"
          />
          <Select
            value={filters.location}
            onChange={(value) => updateFilter('location', value)}
            options={filterOptions.location}
            placeholder="Localisation"
          />
          <Select
            value={filters.status}
            onChange={(value) => updateFilter('status', value)}
            options={filterOptions.status}
            placeholder="Statut"
          />
          <Select
            value={filters.dateAdded}
            onChange={(value) => updateFilter('dateAdded', value)}
            options={filterOptions.dateAdded}
            placeholder="Date d'ajout"
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <ContactsTable 
          contacts={paginatedContacts} 
          onViewContact={handleViewContact}
        />

        {/* Table Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            Actuellement {startIndex + 1} à {Math.min(startIndex + pageSize, filteredContacts.length)} sur {filteredContacts.length} résultats
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      </div>
    </>
  );
};

export default function DirectoryPage({ onNavigate, sidebarCollapsed, onToggleSidebar, filter = "all" }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  // Map filter to display title
  const filterTitles = {
    all: "Tous les contacts",
    contacts: "Tous les contacts",
    clients: "Clients et Prospects",
    suppliers: "Fournisseurs",
    artisans: "Artisans",
    institutional: "Institutionnel",
    prescriber: "Prescripteur",
    subcontractor: "Sous-traitant"
  };

  const pageTitle = filterTitles[filter] || "Tous les contacts";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage={`directory-${filter}`}
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar onNavigate={onNavigate} />
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-neutral-600 mb-2">
              <Layout className="size-4" />
              <span className="text-sm">Annuaire</span>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">{pageTitle}</h1>
          </div>

          {/* Main Content */}
          <DirectoryContactsCard filter={filter} />
        </div>
      </main>
    </div>
  );
}
