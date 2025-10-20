import React, { useState } from "react";
import { LogOut, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react";
import {
  DashboardIcon,
  SuiviProjetsIcon,
  AnnuaireIcon,
  TachesEtMemoIcon,
  AgendaIcon,
  ArticlesIcon,
  KPIIcon,
  FacturesIcon,
  DevisIcon,
  CommandesIcon,
  NotreEntrepriseIcon,
  SuiviSAVIcon,
} from "./MenuIcons";

// Configuration des items avec états désactivés
const navigationConfig = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: DashboardIcon,
    route: "dashboard",
    disabled: false
  },
  {
    id: "project-tracking",
    label: "Projets",
    icon: SuiviProjetsIcon,
    route: "project-tracking",
    disabled: false
  },
  {
    id: "directory",
    label: "Annuaire",
    icon: AnnuaireIcon,
    route: "directory-all", // Route par défaut affichant tous les contacts
    disabled: false,
    hasSubmenu: true,
    submenu: [
      { id: "clients", label: "Clients et Prospects", route: "directory-clients" },
      { id: "suppliers", label: "Fournisseurs", route: "directory-suppliers" },
      { id: "artisans", label: "Artisans", route: "directory-artisans" },
      { id: "institutional", label: "Institutionnel", route: "directory-institutional" },
      { id: "prescriber", label: "Prescripteur", route: "directory-prescriber" },
      { id: "subcontractor", label: "Sous-traitant", route: "directory-subcontractor" }
    ]
  },
  {
    id: "tasks-memo",
    label: "Tâches & mémo",
    icon: TachesEtMemoIcon,
    route: "tasks-memo",
    disabled: false
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: AgendaIcon,
    route: "agenda",
    disabled: false
  },
  {
    id: "articles",
    label: "Articles",
    icon: ArticlesIcon,
    route: "articles",
    disabled: false
  },
  {
    id: "invoices",
    label: "Factures",
    icon: FacturesIcon,
    route: "invoices",
    disabled: true // Désactivé selon les guidelines
  },
  {
    id: "quotes",
    label: "Devis",
    icon: DevisIcon,
    route: "quotes",
    disabled: true // Désactivé selon les guidelines
  },
  {
    id: "orders",
    label: "Commandes",
    icon: CommandesIcon,
    route: "orders",
    disabled: true // Désactivé selon les guidelines
  },
];

// Sous-composant Header
function SidebarHeader({ collapsed, onToggleCollapse }) {
  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200">
      {!collapsed && (
        <img src="/logo-xora.png" alt="XORA" className="h-8" />
      )}
      <button
        onClick={onToggleCollapse}
        className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
        title={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
      >
        {collapsed ? (
          <ChevronsRight className="size-4" />
        ) : (
          <ChevronsLeft className="size-4" />
        )}
      </button>
    </div>
  );
}

// Constantes de couleur
const ACTIVE_COLOR = "#323130";
const INACTIVE_COLOR = "#A9A9A9";

// Sous-composant Item de navigation avec sous-menu
function NavItemWithSubmenu({ item, isActive, collapsed, onNavigate, currentPage }) {
  const [isOpen, setIsOpen] = useState(
    currentPage?.startsWith("directory") || false
  );

  const handleMainClick = () => {
    // On navigue toujours vers la route principale
    if (!item.disabled && item.route && onNavigate) {
      onNavigate(item.route);
    }
  };

  const handleToggleSubmenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const baseClasses = "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-300";

  let stateClasses;
  if (item.disabled) {
    stateClasses = "text-neutral-400 cursor-not-allowed";
  } else if (isActive) {
    stateClasses = "bg-neutral-100 border border-neutral-200 text-neutral-900";
  } else {
    stateClasses = "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900";
  }

  const iconColor = item.disabled ? "#D1D5DB" : (isActive ? ACTIVE_COLOR : INACTIVE_COLOR);

  return (
    <div>
      {/* Item principal */}
      <button
        onClick={handleMainClick}
        className={`${baseClasses} ${stateClasses} ${collapsed ? 'justify-center' : ''}`}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={item.disabled}
        aria-expanded={!collapsed && isOpen}
        tabIndex={item.disabled ? -1 : 0}
        title={collapsed ? item.label : undefined}
      >
        <item.icon color={iconColor} />
        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left">{item.label}</span>
            <button
              onClick={handleToggleSubmenu}
              className="p-1 hover:bg-neutral-200/50 rounded transition-colors"
              aria-label={isOpen ? "Fermer le sous-menu" : "Ouvrir le sous-menu"}
            >
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </>
        )}
      </button>

      {/* Sous-menu */}
      {!collapsed && isOpen && item.submenu && (
        <div className="mt-1 space-y-1 ml-4">
          {item.submenu.map((subitem) => {
            const isSubActive = currentPage === subitem.route;
            return (
              <button
                key={subitem.id}
                onClick={() => onNavigate(subitem.route)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  isSubActive
                    ? "bg-neutral-50 text-neutral-900 font-medium"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <span className="truncate">{subitem.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Sous-composant Item de navigation simple
function NavItem({ item, isActive, collapsed, onNavigate }) {
  const handleClick = () => {
    if (!item.disabled && item.route && onNavigate) {
      onNavigate(item.route);
    }
  };

  const baseClasses = "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-300";

  let stateClasses;
  if (item.disabled) {
    stateClasses = "text-neutral-400 cursor-not-allowed";
  } else if (isActive) {
    stateClasses = "bg-neutral-100 border border-neutral-200 text-neutral-900";
  } else {
    stateClasses = "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900";
  }

  const iconColor = item.disabled ? "#D1D5DB" : (isActive ? ACTIVE_COLOR : INACTIVE_COLOR);

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${stateClasses} ${collapsed ? 'justify-center' : ''}`}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : 0}
      title={collapsed ? item.label : undefined}
    >
      <item.icon color={iconColor} />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </button>
  );
}

// Sous-composant Navigation
function SidebarNav({ currentPage, collapsed, onNavigate }) {
  return (
    <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto" aria-label="Navigation latérale">
      {navigationConfig.map((item) => {
        const isActive = currentPage === item.route ||
                        (item.id === "directory" && currentPage?.startsWith("directory")) ||
                        (item.id === "project-tracking" && currentPage === "project-tracking");

        // Utiliser le composant avec sous-menu si nécessaire
        if (item.hasSubmenu) {
          return (
            <NavItemWithSubmenu
              key={item.id}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
              onNavigate={onNavigate}
              currentPage={currentPage}
            />
          );
        }

        return (
          <NavItem
            key={item.id}
            item={item}
            isActive={isActive}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        );
      })}
    </nav>
  );
}

// Sous-composant Footer
function SidebarFooter({ collapsed }) {
  return (
    <div className={`border-t border-neutral-200 ${collapsed ? 'px-2 py-3' : 'px-4 py-3'}`}>
      <button 
        className={`text-rose-700 inline-flex items-center gap-2 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 rounded ${
          collapsed ? 'justify-center p-2' : ''
        }`}
        title={collapsed ? "Se déconnecter" : undefined}
      >
        <LogOut className="size-4" />
        {!collapsed && <span>Se déconnecter</span>}
      </button>
    </div>
  );
}

// Composant principal Sidebar
export default function Sidebar({ 
  currentPage = "dashboard", 
  onNavigate,
  initialCollapsed = false,
  onToggleCollapse
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setCollapsed(prev => !prev);
    }
  };

  // Utiliser la prop ou l'état local
  const isCollapsed = onToggleCollapse ? initialCollapsed : collapsed;

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-neutral-200 hidden lg:flex lg:flex-col transition-[width] duration-200 ${
        isCollapsed ? 'w-18' : 'w-64'
      } shrink-0`}
      style={{ width: isCollapsed ? '72px' : '256px' }}
    >
      <SidebarHeader 
        collapsed={isCollapsed} 
        onToggleCollapse={handleToggleCollapse} 
      />
      
      <SidebarNav 
        currentPage={currentPage} 
        collapsed={isCollapsed} 
        onNavigate={onNavigate} 
      />
      
      <SidebarFooter collapsed={isCollapsed} />
    </aside>
  );
}
