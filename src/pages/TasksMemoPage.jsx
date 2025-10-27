// filename: TasksMemoPage.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CreateTaskOrMemoModal from "../components/CreateTaskOrMemoModal";
import UserTopBar from "../components/UserTopBar";

// Mock data generator
const generateMockTasks = () => {
  const titles = [
    "Cuisine extérieure",
    "Appeler Laurent",
    "Installation client – Nicolas DUMONT",
    "Rendez-vous avec Romain pour Mme Dubois",
    "Cuisine Salon – Pierre HERME",
    "Livraison Cuisine – Coline FARGET",
    "Devis salle de bain",
    "Suivi dossier technique",
    "Validation plan installation",
    "Commande fournisseur",
    "Contrôle qualité",
    "Rendez-vous showroom",
    "Installation électroménager",
    "Finalisation pose carrelage",
    "Appel client retour",
    "Étude faisabilité projet",
    "Visite chantier",
    "Préparation dossier SAV"
  ];

  const clients = [
    "Coline FARGET",
    "Nicolas DUMONT",
    "Mme Dubois",
    "Pierre HERME",
    "Laurent MARTIN",
    "Sophie BERNARD",
    "Jean DURAND",
    "Marie LEROY"
  ];

  const assignees = [
    "Jérémy",
    "Amélie",
    "Lucas",
    "Thomas",
    "Coline"
  ];

  const tags = [
    "Mémo",
    "Dossier technique",
    "Études en cours",
    "Installation",
    "Prospect",
    "Étude client",
    "SAV",
    "Terminé"
  ];

  const statuses = [
    "Non commencé",
    "En cours",
    "Terminé"
  ];

  const tasks = [];

  for (let i = 1; i <= 42; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let progress = Math.floor(Math.random() * 100);

    // Adjust progress based on status
    if (status === "Non commencé") progress = Math.min(progress, 20);
    if (status === "Terminé") progress = 100;
    if (status === "En cours") progress = Math.max(20, Math.min(progress, 80));

    const today = new Date();
    const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + daysOffset);

    tasks.push({
      id: `task-${i}`,
      index: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      tag: Math.random() > 0.3 ? tags[Math.floor(Math.random() * tags.length)] : undefined,
      client: clients[Math.floor(Math.random() * clients.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      due: dueDate.toISOString(),
      status,
      progress,
      note: Math.random() > 0.7 ? "Note de suivi client" : undefined,
      type: Math.random() > 0.5 ? "Tâche" : "Mémo"
    });
  }

  return tasks;
};

const mockTasks = generateMockTasks();

// Statuts de projets pour la diversification
const PROJECT_STATUSES = [
  "Prospect",
  "Étude client",
  "Dossier technique",
  "Installation",
  "SAV",
  "Terminé"
];

// Utility hooks
const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// SVG Icons (simplified)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3 3" strokeLinecap="round" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="3" width="10" height="14" rx="1.5" />
    <path d="M7 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

const TableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="10" rx="1" />
    <path d="M2 6h12M6 6v7" />
  </svg>
);

const MoreVerticalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="4" r="1.5" fill="currentColor" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="10" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

const GripVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="3" r="1" fill="currentColor" />
    <circle cx="10" cy="3" r="1" fill="currentColor" />
    <circle cx="6" cy="8" r="1" fill="currentColor" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="6" cy="13" r="1" fill="currentColor" />
    <circle cx="10" cy="13" r="1" fill="currentColor" />
  </svg>
);

const MessageIcon = () => <SearchIcon />;
const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1zM4 6h8M4 9h6" strokeLinecap="round" />
  </svg>
);

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3C4.5 3 1.5 5.5 1 8c.5 2.5 3.5 5 7 5s6.5-2.5 7-5c-.5-2.5-3.5-5-7-5z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const Pencil = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11.3 1.7L14.3 4.7L3.5 15.5H0.5V12.5L11.3 1.7Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.3 1.7L14.3 4.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Components
const Topbar = ({ onNavigate }) => {
  return (
    <header className="h-16 border-b border-[#E9E9E9] bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-neutral-50 border border-[#E9E9E9] rounded-lg text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 3.88501L7.9425 12.45L4.7625 9.27001L5.82 8.21251L7.9425 10.335L15.4425 2.83501L16.5 3.88501ZM14.8425 7.66501C14.94 8.09251 15 8.54251 15 9.00001C15 12.315 12.315 15 9 15C5.685 15 3 12.315 3 9.00001C3 5.68501 5.685 3.00001 9 3.00001C10.185 3.00001 11.28 3.34501 12.21 3.93751L13.29 2.85751C12.0348 1.97217 10.536 1.49788 9 1.50001C4.86 1.50001 1.5 4.86001 1.5 9.00001C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9.00001C16.5 8.10751 16.335 7.25251 16.05 6.45751L14.8425 7.66501Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="font-bold text-xl lg:text-2xl text-neutral-900">Tâches & mémo</h1>
      </div>
      <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
    </header>
  );
};

const FiltersBar = ({ filters, onFilterChange }) => {
  const assignees = ["Jérémy", "Amélie", "Lucas", "Thomas", "Coline"];

  return (
    <div className="py-4 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <SearchIcon />
          </div>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Rechercher client/projet"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Tâches & mémo</option>
          <option value="Tâche">Tâche</option>
          <option value="Mémo">Mémo</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Statut</option>
          <option value="Non commencé">Non commencé</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => onFilterChange("assignee", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Agenceur·s</option>
          {assignees.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          value={filters.echeance}
          onChange={(e) => onFilterChange("echeance", e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="">Échéance</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois-ci</option>
          <option value="late">En retard</option>
        </select>
      </div>
    </div>
  );
};

const TagBadge = ({ tag }) => {
  if (!tag) return null;

  const tagClasses = {
    "Mémo": "bg-gray-800 text-white",
    "Dossier technique": "bg-blue-100 text-blue-700",
    "Études en cours": "bg-pink-100 text-pink-700",
    "Installation": "bg-sky-100 text-sky-700"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tagClasses[tag]}`}>
      {tag}
    </span>
  );
};

const StatusSegmented = ({ value, onChange }) => {
  const statuses = ["Non commencé", "En cours", "Terminé"];

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-300 p-1" role="radiogroup">
      {statuses.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          onClick={() => onChange(s)}
          className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
            value === s ? "bg-gray-900 text-white" : "hover:bg-white"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
};

const ProgressBar = ({ value, status, color }) => {
  const getColor = () => {
    if (color) return color;
    if (status === "Terminé") return "bg-green-500";
    if (status === "En cours") return "bg-blue-500";
    return "bg-neutral-400";
  };

  const getTextColor = () => {
    if (status === "Terminé") return "text-green-600";
    if (status === "En cours") return "text-blue-600";
    return "text-neutral-600";
  };

  return (
    <div className="flex items-center gap-2 flex-1 min-w-[120px]">
      <div className="relative h-1.5 rounded-full bg-neutral-200 flex-1">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${getColor()}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${getTextColor()} w-10 text-right`}>
        {value}%
      </span>
    </div>
  );
};

const RowMenu = ({ onView, onEdit, onDuplicate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useOutsideClick(menuRef, () => setIsOpen(false));

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const menuItems = [
    { label: "Voir", action: onView },
    { label: "Éditer", action: onEdit },
    { label: "Dupliquer", action: onDuplicate },
    { label: "Supprimer", action: onDelete }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="p-2 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <MoreVerticalIcon />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-white ${
                idx === 0 ? "rounded-t-lg" : ""
              } ${idx === menuItems.length - 1 ? "rounded-b-lg" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const NoteButton = ({ note, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(note || "");
  const popoverRef = useRef(null);

  useOutsideClick(popoverRef, () => {
    if (isOpen) {
      onChange(value);
      setIsOpen(false);
    }
  });

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors"
        title="Note"
      >
        <NoteIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg p-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              onChange(value);
              setIsOpen(false);
            }}
            placeholder="Ajouter une note..."
            rows={4}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

const TaskRow = ({ item, onUpdate, onDelete, onDragStart, onDragOver, onDrop, isDragging }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const daysLate = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (daysLate > 0) {
      return <span className="font-bold text-red-600">{daysLate} j retard</span>;
    }

    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "Tâche":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          progressColor: "bg-blue-500"
        };
      case "Mémo":
        return {
          bg: "bg-neutral-900",
          text: "text-white",
          progressColor: "bg-neutral-900"
        };
      default:
        return {
          bg: "bg-neutral-100",
          text: "text-neutral-900",
          progressColor: "bg-neutral-400"
        };
    }
  };

  const getTagStyles = (tag) => {
    switch (tag) {
      case "Prospect":
        return {
          bg: "bg-[#E0E7FF]",
          text: "text-[#4F46E5]"
        };
      case "Étude client":
        return {
          bg: "bg-[#EED1F4]",
          text: "text-[#C970AB]"
        };
      case "Dossier technique":
        return {
          bg: "bg-[#A4E6FE]",
          text: "text-[#1A8AB3]"
        };
      case "Installation":
        return {
          bg: "bg-[#A9C9F9]",
          text: "text-[#385D95]"
        };
      case "SAV":
        return {
          bg: "bg-[#FFD0C1]",
          text: "text-[#DF7959]"
        };
      case "Terminé":
        return {
          bg: "bg-[#76D88B]",
          text: "text-[#2A732F]"
        };
      case "Mémo":
        return {
          bg: "bg-neutral-900",
          text: "text-white"
        };
      case "Études en cours":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700"
        };
      default:
        return {
          bg: "bg-neutral-100",
          text: "text-neutral-900"
        };
    }
  };

  const handleStatusChange = (newStatus) => {
    let newProgress = item.progress;
    if (newStatus === "Non commencé") newProgress = 0;
    if (newStatus === "Terminé") newProgress = 100;
    if (newStatus === "En cours" && item.progress === 0) newProgress = 50;

    onUpdate(item.id, { status: newStatus, progress: newProgress });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item.id)}
      className={`w-full py-4 hover:bg-neutral-100 transition-colors grid gap-3 items-start ${
        isDragging ? "opacity-50 bg-neutral-100" : "bg-white"
      }`}
      style={{
        gridTemplateColumns: "50px 2fr 1.2fr 1fr 1.2fr 0.8fr 1.5fr 0.8fr 40px",
        paddingLeft: "24px",
        paddingRight: "24px",
        boxSizing: "border-box",
        width: "100%",
        minWidth: "min-content"
      }}
    >
      {/* Ordre */}
      <div className="flex items-center justify-center">
        <div className="cursor-move text-neutral-400 hover:text-neutral-600">
          <GripVerticalIcon />
        </div>
      </div>

      {/* Descriptif */}
      <div className="min-w-0 overflow-hidden w-full">
        <div className="flex items-start gap-2 min-w-0">
          <span className={`font-semibold truncate ${item.status === "Terminé" ? "line-through text-neutral-400" : "text-neutral-900"}`}>{item.title}</span>
        </div>
        <div className="text-xs text-neutral-500 truncate">{item.client}</div>
      </div>

      {/* Type/Tag */}
      <div className="flex items-start justify-start">
        {item.tag ? (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTagStyles(item.tag).bg} ${getTagStyles(item.tag).text}`}>
            {item.tag}
          </div>
        ) : (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeStyles(item.type).bg} ${getTypeStyles(item.type).text}`}>
            {item.type}
          </div>
        )}
      </div>

      {/* Échéance */}
      <div className="text-xs text-neutral-500 whitespace-nowrap">
        {formatDate(item.due)}
      </div>

      {/* Collaborateur.s */}
      <div className="flex items-start gap-2 whitespace-nowrap">
        <img
          src={`https://i.pravatar.cc/24?img=${item.assignee.charCodeAt(0)}`}
          alt={item.assignee}
          className="size-6 rounded-full"
        />
        <span className="text-sm text-neutral-700">{item.assignee}</span>
      </div>

      {/* Note */}
      <NoteButton
        note={item.note}
        onChange={(v) => onUpdate(item.id, { note: v })}
      />

      {/* Progression ou Statut Badge */}
      {item.type === "Mémo" ? (
        <div className="flex items-start justify-start">
          <div className="inline-flex rounded-full border border-neutral-300 bg-neutral-50 p-1">
            <button
              onClick={() => handleStatusChange("Non commencé")}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                item.status === "Non commencé" ? "bg-neutral-900 text-white" : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              Non
            </button>
            <button
              onClick={() => handleStatusChange("En cours")}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                item.status === "En cours" ? "bg-neutral-900 text-white" : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              Cours
            </button>
            <button
              onClick={() => handleStatusChange("Terminé")}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                item.status === "Terminé" ? "bg-neutral-900 text-white" : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              Terminé
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-start">
          <ProgressBar value={item.progress} status={item.status} color={getTypeStyles(item.type).progressColor} />
        </div>
      )}

      {/* Actions Menu */}
      <div className="relative flex justify-end" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-600 hover:text-neutral-900 transition-all border border-[#E4E4E7]"
        >
          <MoreVerticalIcon className="size-5" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
            {item.type === "Tâche" ? (
              <>
                <button
                  onClick={() => {
                    console.log("Voir le projet:", item);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-white flex items-center gap-2 border-b border-neutral-100"
                >
                  <Eye className="size-4" />
                  Voir le projet
                </button>
                <button
                  onClick={() => {
                    console.log("Modifier la tâche:", item);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-white flex items-center gap-2"
                >
                  <Pencil className="size-4" />
                  Modifier la tâche
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  console.log("Modifier le mémo:", item);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-white flex items-center gap-2"
              >
                <Pencil className="size-4" />
                Éditer le mémo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

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
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        «
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        ‹
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={typeof page === "number" ? `Page ${page}` : undefined}
          className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium ${
            page === currentPage
              ? "bg-neutral-900 text-white"
              : page === "..."
              ? "cursor-default"
              : "border border-neutral-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Dernière page"
        className="size-9 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        »
      </button>
    </nav>
  );
};

// Main component
export default function TasksMemoPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const [tasks, setTasks] = useState(mockTasks);
  const [statusFilterPill, setStatusFilterPill] = useState("en-cours");
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    assignee: "",
    echeance: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleUpdateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();

    if (draggedTaskId === targetTaskId) {
      setDraggedTaskId(null);
      return;
    }

    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedIndex = newTasks.findIndex(t => t.id === draggedTaskId);
      const targetIndex = newTasks.findIndex(t => t.id === targetTaskId);

      if (draggedIndex === -1 || targetIndex === -1) return prevTasks;

      // Remove dragged item
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      // Insert at target position
      newTasks.splice(targetIndex, 0, draggedTask);

      // Reindex all tasks
      return newTasks.map((task, idx) => ({ ...task, index: idx + 1 }));
    });

    setDraggedTaskId(null);
  };

  const handleCreateTaskOrMemo = async (payload) => {
    console.log("Creating task/memo:", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Here you would typically add the new task to the list
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          task.title,
          task.client,
          task.tag || "",
          task.assignee,
          task.note || ""
        ].map((f) => f.toLowerCase());

        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      // Type
      if (filters.type && task.type !== filters.type) return false;

      // Status
      if (filters.status && task.status !== filters.status) return false;

      // Assignee
      if (filters.assignee && task.assignee !== filters.assignee) return false;

      // Echeance
      if (filters.echeance) {
        const today = new Date();
        const dueDate = new Date(task.due);
        const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (filters.echeance === "today" && daysDiff !== 0) return false;
        if (filters.echeance === "week" && (daysDiff < 0 || daysDiff > 7)) return false;
        if (filters.echeance === "month" && (daysDiff < 0 || daysDiff > 30)) return false;
        if (filters.echeance === "late" && daysDiff >= 0) return false;
      }

      // Status Filter Pill
      if (statusFilterPill === "en-cours") {
        if (task.status !== "En cours" && task.status !== "Non commencé") return false;
      } else if (statusFilterPill === "termine") {
        if (task.status !== "Terminé") return false;
      }

      return true;
    });
  }, [tasks, filters, statusFilterPill]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <CreateTaskOrMemoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTaskOrMemo}
      />

      <Sidebar
        currentPage="tasks-memo"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar onNavigate={onNavigate} />
        <div className="w-full py-6 px-4 lg:px-6">
          {/* Main Card */}
          <div className="rounded-2xl border border-[#E9E9E9] bg-white shadow-sm">
            {/* Card Header */}
            <div className="p-6 pb-0">
              {/* First row: Title, Pill, Button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Liste des tâches et mémo ({filteredTasks.length})
                  </h2>
                  {/* Status Filter Pill */}
                  <div className="inline-flex rounded-full border border-neutral-300 bg-neutral-100 p-1">
                    <button
                      onClick={() => setStatusFilterPill("en-cours")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        statusFilterPill === "en-cours"
                          ? "bg-gray-900 text-white"
                          : "text-neutral-700 hover:text-neutral-900"
                      }`}
                    >
                      En cours
                    </button>
                    <button
                      onClick={() => setStatusFilterPill("termine")}
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        statusFilterPill === "termine"
                          ? "bg-gray-900 text-white"
                          : "text-neutral-700 hover:text-neutral-900"
                      }`}
                    >
                      Terminé
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300"
                >
                  <PlusIcon />
                  Ajouter une tâche ou un mémo
                </button>
              </div>

              {/* Second row: Filters */}
              <FiltersBar filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Content - Gray background container */}
            <div className="bg-white w-full overflow-x-auto" style={{ boxSizing: "border-box" }}>
              {/* Table Headers */}
              <div className="py-4 border-b border-[#E9E9E9] grid gap-3 items-start" style={{
                gridTemplateColumns: "50px 2fr 1.2fr 1fr 1.2fr 0.8fr 1.5fr 0.8fr 40px",
                paddingLeft: "24px",
                paddingRight: "24px",
                boxSizing: "border-box",
                width: "100%",
                minWidth: "min-content"
              }}>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Ordre</div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Descriptif</div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Statut</div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Échéance</div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Collaborateur.s</div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Note</div>
                <div className="text-xs font-semibold text-neutral-600 uppercase">Progression</div>
                <div></div>
              </div>

              {/* Table Rows */}
              {paginatedTasks.length > 0 ? (
                <div className="w-full">
                  {paginatedTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      item={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      isDragging={draggedTaskId === task.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full py-12 text-center text-neutral-500" style={{
                  paddingLeft: "24px",
                  paddingRight: "24px"
                }}>
                  Aucune tâche ou mémo à afficher
                </div>
              )}

              {/* Footer */}
              <div className="py-4 border-t border-[#E9E9E9] flex items-center justify-between bg-white w-full" style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                boxSizing: "border-box"
              }}>
                <div className="text-sm text-neutral-600">
                  Affichage {startIndex + 1}-{Math.min(startIndex + pageSize, filteredTasks.length)} sur{" "}
                  {filteredTasks.length} éléments
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Example wrapper for standalone use
export function ExampleTasksMemoPage() {
  return <TasksMemoPage onNavigate={() => {}} sidebarCollapsed={false} onToggleSidebar={() => {}} />;
}
