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
  Layout,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  List,
  Map
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Sidebar from "../components/Sidebar";
import CreateContactModal from "../components/CreateContactModal";
import UserTopBar from "../components/UserTopBar";
import { useContacts } from "../hooks/useContacts";
import { transformContactForDirectory } from "../utils/dataTransformers";

// Coordonnées géographiques des villes
const locationCoordinates = {
  "Valras-Plage": [43.15, 3.10],
  "Montpellier": [43.65, 3.95],
  "Nîmes": [43.90, 4.50],
  "Béziers": [43.30, 2.65],
  "Agde": [43.25, 3.50],
  "Sète": [43.40, 3.75]
};

// Utility components
const Badge = ({ variant, children }) => {
  const variantClasses = {
    prospect: "bg-rose-100 text-rose-700 border-rose-200",
    client: "bg-sky-100 text-sky-800 border-sky-200",
    leads: "bg-violet-100 text-violet-800 border-violet-200",
    fournisseur: "bg-amber-100 text-amber-700 border-amber-200",
    artisan: "bg-green-100 text-green-700 border-green-200",
    institutionnel: "bg-purple-100 text-purple-700 border-purple-200",
    prescripteur: "bg-indigo-100 text-indigo-700 border-indigo-200",
    "sous-traitant": "bg-cyan-100 text-cyan-700 border-cyan-200",
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

// Fonction pour obtenir les couleurs des statuts
function getStatusColors(status) {
  switch (status) {
    case "Prospect":
      return { bg: "#E0E7FF", text: "#4F46E5" };
    case "Client":
      return { bg: "#A4E6FE", text: "#1A8AB3" };
    case "Leads":
      return { bg: "#EED1F4", text: "#C970AB" };
    default:
      return { bg: "#F3F4F6", text: "#1F2937" };
  }
}

// Composant Dropdown personnalisé pour les statuts avec pastilles
function StatusDropdownDirectory({ value, onChange, statuses }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
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

  const selectedLabel = statuses.find(s => s === value) || "Statut";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Tous les statuts
          </button>
          {statuses.map((status) => {
            const colors = getStatusColors(status);
            return (
              <button
                key={status}
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text
                  }}
                />
                {status}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Composant Dropdown personnalisé pour les agenceurs avec photos
function AgentDropdownDirectory({ value, onChange, agents }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedAgent = agents.find(a => a.name === value);
  const selectedLabel = selectedAgent?.name || "Agenceur.se";

  React.useEffect(() => {
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Tous les agenceurs
          </button>
          {agents.map((agent) => (
            <button
              key={agent.name}
              onClick={() => {
                onChange(agent.name);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
            >
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="size-6 rounded-full flex-shrink-0"
              />
              <span>{agent.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant Dropdown personnalisé pour les dates avec icônes flèche
function DateDropdownDirectory({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find(o => o === value);
  const selectedLabel = selectedOption || "Date d'ajout";

  React.useEffect(() => {
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Date d'ajout
          </button>
          {options.map((option) => {
            const isRecent = option === "Aujourd'hui" || option === "Cette semaine" || option === "Ce mois";
            return (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
              >
                {isRecent ? (
                  <ArrowUp className="size-4 text-neutral-600" />
                ) : (
                  <ArrowDown className="size-4 text-neutral-600" />
                )}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Composant Dropdown personnalisé pour l'origine
function OriginDropdownDirectory({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find(o => o === value);
  const selectedLabel = selectedOption || "Origine";

  React.useEffect(() => {
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Origine
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
            >
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant Dropdown personnalisé pour la localisation
function LocationDropdownDirectory({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find(o => o === value);
  const selectedLabel = selectedOption || "Localisation";

  React.useEffect(() => {
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Localisation
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
            >
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pastille de sélection des statuts
function StatusPills({ selectedStatus, onStatusChange, statusCounts }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full p-1" style={{ backgroundColor: "#F8F9FA", border: "1px solid #E4E4E7" }}>
      {[
        { value: "", label: "Tous", count: statusCounts.all },
        { value: "Leads", label: "Leads", count: statusCounts.leads },
        { value: "Prospect", label: "Prospects", count: statusCounts.prospects },
        { value: "Client", label: "Clients", count: statusCounts.clients }
      ].map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2"
          style={
            selectedStatus === status.value
              ? { backgroundColor: "#323130", color: "white" }
              : { backgroundColor: "transparent", color: "#323130" }
          }
        >
          <span>{status.label}</span>
          <span
            className="font-semibold px-2 py-0.5 rounded-full text-xs"
            style={
              selectedStatus === status.value
                ? { backgroundColor: "#1a1a18", color: "white" }
                : { backgroundColor: "#E4E4E7", color: "#323130" }
            }
          >
            {status.count}
          </span>
        </button>
      ))}
    </div>
  );
}

// Composant pastille de choix de vue (Liste/Carte)
function ViewModePills({ viewMode, onViewModeChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: "#F8F9FA", border: "1px solid #E4E4E7" }}>
      {[
        { value: "list", label: "Liste", icon: List },
        { value: "map", label: "Carte", icon: Map }
      ].map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.value}
            onClick={() => onViewModeChange(mode.value)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
            style={
              viewMode === mode.value
                ? { backgroundColor: "white", color: "#323130", border: "1px solid #E4E4E7" }
                : { backgroundColor: "transparent", color: "#323130" }
            }
          >
            <Icon className="size-4" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Composant Dropdown personnalisé pour les projets
function ProjectDropdownDirectory({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find(o => o === value);
  const selectedLabel = selectedOption || "Projet(s)";

  React.useEffect(() => {
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 flex items-center gap-2 w-full"
      >
        <span className="flex-1 text-left">{selectedLabel}</span>
        <ChevronDown className="size-4 flex-shrink-0" style={{ position: "absolute", right: "12px" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-full">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Projet(s)
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-neutral-50"
            >
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const Topbar = ({ onNavigate }) => {
  return (
    <header className="h-16 border-b bg-[#FAFAFA] border-[#E4E4E7] px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-neutral-300 rounded text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 14.625V3.375C3 2.33947 3.83947 1.5 4.875 1.5H15V16.5H4.875C3.83947 16.5 3 15.6605 3 14.625ZM3 14.625C3 13.5895 3.83946 12.75 4.87498 12.75H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
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
    <div className="overflow-x-auto border border-[#E4E4E7] rounded-[8px]" style={{ maxHeight: "calc(100vh - 420px)" }}>
      <table className="w-full" role="table">
        <thead>
          <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E4E4E7" }}>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Nom & prénom
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Ajouté par
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Origine
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Localisation
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Projets en cours
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Statut
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Ajouté le
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold tracking-wide" style={{ color: "#A9A9A9" }}>
              Action rapide
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-neutral-50 transition-colors" style={{ borderBottom: "1px solid #E4E4E7" }} role="row">
              <td className="py-4 px-3" role="cell">
                <div className="text-sm font-semibold text-neutral-900">{contact.name}</div>
              </td>
              <td className="py-4 px-3" role="cell">
                <div className="flex items-center gap-2">
                  <img
                    src={contact.addedBy.avatarUrl}
                    alt={`Avatar de ${contact.addedBy.name}`}
                    className="size-6 rounded-full"
                  />
                  <span className="text-sm text-neutral-600">{contact.addedBy.name}</span>
                </div>
              </td>
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-600">{contact.origin}</span>
              </td>
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-600">{contact.location}</span>
              </td>
              <td className="py-4 px-3" role="cell">
                {contact.projects > 0 ? (
                  <Badge variant="projects">{contact.projects} projet{contact.projects > 1 ? 's' : ''}</Badge>
                ) : (
                  <span className="text-neutral-400">–</span>
                )}
              </td>
              <td className="py-4 px-3" role="cell">
                <Badge variant={contact.status.toLowerCase()}>{contact.status}</Badge>
              </td>
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-600">{contact.addedAt}</span>
              </td>
              <td className="py-4 px-3" role="cell">
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

// Modale pour afficher les contacts d'une localisation
const LocationContactsModal = ({ location, contacts, onClose, onSelectContact }) => {
  if (!location) return null;

  const locationContacts = contacts.filter(c => c.location === location);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-xl w-96 max-h-96 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E4E4E7]">
          <h2 className="text-lg font-bold text-neutral-900">{location}</h2>
          <p className="text-sm text-neutral-500">{locationContacts.length} contact{locationContacts.length > 1 ? 's' : ''}</p>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-[#E4E4E7]">
            {locationContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  onSelectContact(contact);
                  onClose();
                }}
                className="w-full px-6 py-3 hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-neutral-900">{contact.name}</div>
                    <div className="text-xs text-neutral-500">{contact.status}</div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: contact.status === "Prospect" ? "#E0E7FF" : contact.status === "Client" ? "#A4E6FE" : "#EED1F4",
                      color: contact.status === "Prospect" ? "#4F46E5" : contact.status === "Client" ? "#1A8AB3" : "#C970AB"
                    }}
                  >
                    {contact.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E4E4E7]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de vue carte des contacts
const ContactsMapView = ({ contacts, onViewContact }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getMarkerColor = (status) => {
    switch (status) {
      case "Prospect":
        return "#4F46E5";
      case "Client":
        return "#1A8AB3";
      case "Leads":
        return "#C970AB";
      default:
        return "#808080";
    }
  };

  // Grouper les contacts par localisation pour compter les marqueurs
  const locationMap = {};
  contacts.forEach(contact => {
    if (contact.coordinates) {
      const key = JSON.stringify(contact.coordinates);
      if (!locationMap[key]) {
        locationMap[key] = {
          coordinates: contact.coordinates,
          location: contact.location,
          contacts: []
        };
      }
      locationMap[key].contacts.push(contact);
    }
  });

  return (
    <>
      <div className="w-full rounded-[8px] overflow-hidden border border-[#E4E4E7]" style={{ height: "calc(100vh - 420px)" }}>
        <MapContainer
          center={[43.5, 3.5]}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.values(locationMap).map((locationData) => {
            const contactCount = locationData.contacts.length;
            const primaryColor = getMarkerColor(locationData.contacts[0].status);

            return (
              <Marker
                key={JSON.stringify(locationData.coordinates)}
                position={locationData.coordinates}
                icon={L.divIcon({
                  className: "custom-marker",
                  html: `<div style="width: 40px; height: 40px; background-color: ${primaryColor}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-weight: bold; color: white; font-size: 14px;">${contactCount}</div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20],
                  popupAnchor: [0, -20]
                })}
                eventHandlers={{
                  click: () => setSelectedLocation(locationData.location)
                }}
              >
                </Marker>
            );
          })}
        </MapContainer>
      </div>

      {selectedLocation && (
        <LocationContactsModal
          location={selectedLocation}
          contacts={contacts}
          onClose={() => setSelectedLocation(null)}
          onSelectContact={onViewContact}
        />
      )}
    </>
  );
};

const DirectoryContactsCard = ({ filter = "all", onNavigate, contacts = [], onAddContact }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
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

  // Filter type labels
  const filterLabels = {
    all: "Tous",
    clients: "Clients et Prospects",
    suppliers: "Fournisseurs",
    artisans: "Artisans",
    institutional: "Institutionnel",
    prescriber: "Prescripteur",
    subcontractor: "Sous-traitant"
  };

  // Filter options
  const filterOptions = {
    addedBy: ["Jérémy", "Sophie", "Thomas"],
    origin: ["Relation", "Salon", "Web", "Recommandation"],
    location: ["Valras-Plage", "Montpellier", "Nîmes", "Béziers", "Agde", "Sète", "Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux"],
    project: ["En cours", "Terminé", "En attente"],
    status: ["Client", "Prospect", "Fournisseur", "Artisan", "Institutionnel", "Prescripteur", "Sous-traitant", "Leads"],
    dateAdded: ["Aujourd'hui", "Cette semaine", "Ce mois", "Ce trimestre"]
  };

  // Apply filters and search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAddedBy = !filters.addedBy || contact.addedBy.name === filters.addedBy;
      const matchesOrigin = !filters.origin || contact.origin === filters.origin;
      const matchesLocation = !filters.location || contact.location === filters.location;
      const matchesStatus = !filters.status || contact.status === filters.status;

      // Apply type filter from sidebar submenu
      const matchesType = filter === "all" || contact.type === filter;

      return matchesSearch && matchesAddedBy && matchesOrigin && matchesLocation && matchesStatus && matchesType;
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
    if (onNavigate) {
      onNavigate(`contact-${contact.id}`);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateContact = async (formData) => {
    try {
      console.log('FormData reçue:', formData);

      // Mapper les données de la modale au format de la BDD
      const contactData = {
        civilite: formData.civilite,
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        complement_adresse: formData.complementAdresse,
        latitude: formData.adresseCoordinates ? formData.adresseCoordinates[0] : null,
        longitude: formData.adresseCoordinates ? formData.adresseCoordinates[1] : null,
        origine: formData.origine,
        sous_origine: formData.sousOrigine,
        societe: formData.societe,
        agenceur_referent: formData.agenceurReferent,
        rgpd: formData.rgpd,
        statut: 'Leads', // Par défaut, nouveau contact = Leads
        cree_le: new Date().toISOString()
      };

      console.log('ContactData envoyée à la BDD:', contactData);

      // Utiliser le hook pour ajouter le contact
      const result = await onAddContact(contactData);

      console.log('Résultat de l\'ajout:', result);

      if (!result.success) {
        console.error('Erreur lors de la création du contact:', result.error);
        alert('Erreur lors de la création du contact: ' + result.error);
      } else {
        // Fermer la modale
        setIsModalOpen(false);
        // Naviguer vers la page de détail du contact nouvellement créé (utiliser le numéro si disponible)
        const contactIdentifier = result.data.numero || result.data.id;
        onNavigate(`contact-${contactIdentifier}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du contact (catch):', error);
      alert('Erreur lors de la création du contact: ' + error.message);
    }
  };

  return (
    <>
      <CreateContactModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateContact}
      />

      <div className="bg-white rounded-[8px] border border-[#E4E4E7] shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-neutral-900">
              {filterLabels[filter]} ({filteredContacts.length})
            </h2>
            <StatusPills
              selectedStatus={filters.status}
              onStatusChange={(value) => updateFilter('status', value)}
              statusCounts={{
                all: contacts.length,
                leads: contacts.filter(c => c.status === "Leads").length,
                prospects: contacts.filter(c => c.status === "Prospect").length,
                clients: contacts.filter(c => c.status === "Client").length
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors" style={{ backgroundColor: "#F8F9FA", border: "1px solid #E4E4E7", color: "#323130" }}>
              <Download className="size-4" />
              Exporter
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors" style={{ backgroundColor: "#F8F9FA", border: "1px solid #E4E4E7", color: "#323130" }}>
              <Upload className="size-4" />
              Importer
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Ajouter une fiche leads
            </button>
          </div>
        </div>
      </div>

      {/* Filters - Combined Line: View Mode + Search and Filters */}
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {/* View Mode Pills */}
          <div className="flex-shrink-0">
            <ViewModePills
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Searchbar */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="search"
              placeholder="Rechercher un contact"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E4E4E7] bg-neutral-50 text-sm text-neutral-600 placeholder:text-neutral-400"
            />
          </div>

          {/* Agenceur.se */}
          <div className="flex-1">
            <AgentDropdownDirectory
              value={filters.addedBy}
              onChange={(value) => updateFilter('addedBy', value)}
              agents={[
                { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" },
                { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" },
                { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }
              ]}
            />
          </div>

          {/* Origine */}
          <div className="flex-1">
            <OriginDropdownDirectory
              value={filters.origin}
              onChange={(value) => updateFilter('origin', value)}
              options={filterOptions.origin}
            />
          </div>

          {/* Localisation */}
          <div className="flex-1">
            <LocationDropdownDirectory
              value={filters.location}
              onChange={(value) => updateFilter('location', value)}
              options={filterOptions.location}
            />
          </div>

          {/* Projet(s) */}
          <div className="flex-1">
            <ProjectDropdownDirectory
              value={filters.project}
              onChange={(value) => updateFilter('project', value)}
              options={filterOptions.project}
            />
          </div>

          {/* Date d'ajout */}
          <div className="flex-1">
            <DateDropdownDirectory
              value={filters.dateAdded}
              onChange={(value) => updateFilter('dateAdded', value)}
              options={filterOptions.dateAdded}
            />
          </div>
        </div>
      </div>

      {/* Table or Map */}
      <div className="p-6">
        {viewMode === "list" ? (
          <>
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
          </>
        ) : (
          <ContactsMapView
            contacts={filteredContacts}
            onViewContact={handleViewContact}
          />
        )}
      </div>
      </div>
    </>
  );
};

export default function DirectoryPage({ onNavigate, sidebarCollapsed, onToggleSidebar, filter = "all" }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  // Récupérer les contacts depuis Supabase
  const { contacts: supabaseContacts, loading, error, addContact, refetch } = useContacts();

  // Transformer les contacts Supabase au format UI
  const transformedContacts = supabaseContacts.map(contact =>
    transformContactForDirectory(contact)
  );

  // Utiliser les contacts transformés à la place des mockContacts
  const mockContacts = transformedContacts.length > 0 ? transformedContacts : [];

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
        <div className="w-full py-6 px-4 lg:px-6">
          {/* Main Content */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mb-4"></div>
                <p className="text-neutral-600">Chargement des contacts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-red-600 font-semibold">Erreur lors du chargement</p>
                <p className="text-neutral-600 text-sm mt-2">{error}</p>
              </div>
            </div>
          ) : (
            <DirectoryContactsCard filter={filter} onNavigate={onNavigate} contacts={mockContacts} onAddContact={addContact} />
          )}
        </div>
      </main>
    </div>
  );
}
