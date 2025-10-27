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

// Coordonnées géographiques des villes
const locationCoordinates = {
  "Valras-Plage": [43.15, 3.10],
  "Montpellier": [43.65, 3.95],
  "Nîmes": [43.90, 4.50],
  "Béziers": [43.30, 2.65],
  "Agde": [43.25, 3.50],
  "Sète": [43.40, 3.75]
};

// Mock data - 30+ contacts for filtering/pagination demo
const mockContacts = [
  { id: "1", name: "Chloé DUBOIS", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Relation", location: "Valras-Plage", coordinates: locationCoordinates["Valras-Plage"], projects: 2, status: "Prospect", addedAt: "25/05/25" },
  { id: "2", name: "Pierre MARTIN", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Montpellier", coordinates: locationCoordinates["Montpellier"], projects: 1, status: "Client", addedAt: "24/05/25" },
  { id: "3", name: "Marie BERNARD", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Web", location: "Nîmes", coordinates: locationCoordinates["Nîmes"], projects: 0, status: "Leads", addedAt: "23/05/25" },
  { id: "4", name: "Jean DURAND", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Recommandation", location: "Béziers", coordinates: locationCoordinates["Béziers"], projects: 3, status: "Client", addedAt: "22/05/25" },
  { id: "5", name: "Anne MOREAU", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Agde", coordinates: locationCoordinates["Agde"], projects: 1, status: "Prospect", addedAt: "21/05/25" },
  { id: "6", name: "Paul ROBERT", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Web", location: "Sète", coordinates: locationCoordinates["Sète"], projects: 2, status: "Leads", addedAt: "20/05/25" },
  { id: "7", name: "Claire PETIT", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Relation", location: "Valras-Plage", coordinates: locationCoordinates["Valras-Plage"], projects: 0, status: "Prospect", addedAt: "19/05/25" },
  { id: "8", name: "Michel ROUX", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Montpellier", coordinates: locationCoordinates["Montpellier"], projects: 4, status: "Client", addedAt: "18/05/25" },
  { id: "9", name: "Sylvie LEROY", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Recommandation", location: "Nîmes", coordinates: locationCoordinates["Nîmes"], projects: 1, status: "Leads", addedAt: "17/05/25" },
  { id: "10", name: "François SIMON", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Béziers", coordinates: locationCoordinates["Béziers"], projects: 2, status: "Client", addedAt: "16/05/25" },
  { id: "11", name: "Isabelle MICHEL", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Agde", coordinates: locationCoordinates["Agde"], projects: 0, status: "Prospect", addedAt: "15/05/25" },
  { id: "12", name: "Laurent GARCIA", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Relation", location: "Sète", coordinates: locationCoordinates["Sète"], projects: 3, status: "Leads", addedAt: "14/05/25" },
  { id: "13", name: "Nathalie DAVID", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Valras-Plage", coordinates: locationCoordinates["Valras-Plage"], projects: 1, status: "Client", addedAt: "13/05/25" },
  { id: "14", name: "Alain BERTRAND", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Recommandation", location: "Montpellier", coordinates: locationCoordinates["Montpellier"], projects: 2, status: "Prospect", addedAt: "12/05/25" },
  { id: "15", name: "Valérie THOMAS", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Salon", location: "Nîmes", coordinates: locationCoordinates["Nîmes"], projects: 0, status: "Leads", addedAt: "11/05/25" },
  { id: "16", name: "Olivier RICHARD", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Béziers", coordinates: locationCoordinates["Béziers"], projects: 4, status: "Client", addedAt: "10/05/25" },
  { id: "17", name: "Catherine PETIT", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Relation", location: "Agde", coordinates: locationCoordinates["Agde"], projects: 1, status: "Prospect", addedAt: "09/05/25" },
  { id: "18", name: "Stéphane DURAND", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Salon", location: "Sète", coordinates: locationCoordinates["Sète"], projects: 2, status: "Leads", addedAt: "08/05/25" },
  { id: "19", name: "Monique MOREAU", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Recommandation", location: "Valras-Plage", coordinates: locationCoordinates["Valras-Plage"], projects: 0, status: "Client", addedAt: "07/05/25" },
  { id: "20", name: "Philippe MARTIN", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Web", location: "Montpellier", coordinates: locationCoordinates["Montpellier"], projects: 3, status: "Prospect", addedAt: "06/05/25" },
  { id: "21", name: "Sandrine BLANC", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Salon", location: "Nîmes", coordinates: locationCoordinates["Nîmes"], projects: 1, status: "Leads", addedAt: "05/05/25" },
  { id: "22", name: "Christophe ROUX", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Relation", location: "Béziers", coordinates: locationCoordinates["Béziers"], projects: 2, status: "Client", addedAt: "04/05/25" },
  { id: "23", name: "Brigitte SIMON", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Recommandation", location: "Agde", coordinates: locationCoordinates["Agde"], projects: 0, status: "Prospect", addedAt: "03/05/25" },
  { id: "24", name: "Thierry LEROY", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Web", location: "Sète", coordinates: locationCoordinates["Sète"], projects: 4, status: "Leads", addedAt: "02/05/25" },
  { id: "25", name: "Pascale GARCIA", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Salon", location: "Valras-Plage", coordinates: locationCoordinates["Valras-Plage"], projects: 1, status: "Client", addedAt: "01/05/25" },
  { id: "26", name: "Bernard MICHEL", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Relation", location: "Montpellier", coordinates: locationCoordinates["Montpellier"], projects: 2, status: "Prospect", addedAt: "30/04/25" },
  { id: "27", name: "Martine DAVID", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Recommandation", location: "Nîmes", coordinates: locationCoordinates["Nîmes"], projects: 0, status: "Leads", addedAt: "29/04/25" },
  { id: "28", name: "Gérard BERTRAND", addedBy: { name: "Jérémy", avatarUrl: "https://i.pravatar.cc/24?img=12" }, origin: "Web", location: "Béziers", coordinates: locationCoordinates["Béziers"], projects: 3, status: "Client", addedAt: "28/04/25" },
  { id: "29", name: "Nicole THOMAS", addedBy: { name: "Sophie", avatarUrl: "https://i.pravatar.cc/24?img=8" }, origin: "Salon", location: "Agde", coordinates: locationCoordinates["Agde"], projects: 1, status: "Prospect", addedAt: "27/04/25" },
  { id: "30", name: "Daniel RICHARD", addedBy: { name: "Thomas", avatarUrl: "https://i.pravatar.cc/24?img=15" }, origin: "Relation", location: "Sète", coordinates: locationCoordinates["Sète"], projects: 2, status: "Leads", addedAt: "26/04/25" },
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
    <header className="h-16 border-b bg-[#F8F9FA] border-neutral-200 px-4 lg:px-6 flex items-center justify-between">
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
    <div className="overflow-x-auto border border-[#E4E4E7] rounded-lg" style={{ maxHeight: "calc(100vh - 420px)" }}>
      <table className="w-full" role="table">
        <thead>
          <tr style={{ backgroundColor: "#E4E4E7", borderBottom: "1px solid #D4D4D8" }}>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Nom & prénom
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Ajouté par
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Origine
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Localisation
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Projets en cours
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Statut
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
              Ajouté le
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#A9A9A9" }}>
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
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">{location}</h2>
          <p className="text-sm text-neutral-500">{locationContacts.length} contact{locationContacts.length > 1 ? 's' : ''}</p>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-neutral-200">
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
        <div className="px-6 py-3 border-t border-neutral-200">
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
      <div className="w-full rounded-lg overflow-hidden border border-[#E4E4E7]" style={{ height: "calc(100vh - 420px)" }}>
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

const DirectoryContactsCard = ({ filter = "all", onNavigate }) => {
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
    if (onNavigate) {
      onNavigate(`contact-${contact.id}`);
    }
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
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-neutral-900">
              Tous ({filteredContacts.length})
            </h2>
            <StatusPills
              selectedStatus={filters.status}
              onStatusChange={(value) => updateFilter('status', value)}
              statusCounts={{
                all: mockContacts.length,
                leads: mockContacts.filter(c => c.status === "Leads").length,
                prospects: mockContacts.filter(c => c.status === "Prospect").length,
                clients: mockContacts.filter(c => c.status === "Client").length
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
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-600 placeholder:text-neutral-400"
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
          <DirectoryContactsCard filter={filter} onNavigate={onNavigate} />
        </div>
      </main>
    </div>
  );
}
