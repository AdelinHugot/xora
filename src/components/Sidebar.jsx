import React, { useState } from "react";
import { LogOut, CheckCircle2, Clock3, CircleDot, User2, ChevronDown, ChevronRight } from "lucide-react";

// Icon placeholders
function CalendarIcon(props){return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}><rect x="3" y="4" width="18" height="18" rx="2" className="fill-none stroke-current"/><line x1="16" y1="2" x2="16" y2="6" className="stroke-current"/><line x1="8" y1="2" x2="8" y2="6" className="stroke-current"/><line x1="3" y1="10" x2="21" y2="10" className="stroke-current"/></svg>}
function DocumentIcon(props){return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}><path d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" className="fill-none stroke-current"/></svg>}
function InvoiceIcon(props){return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}><rect x="4" y="3" width="16" height="18" rx="2" className="fill-none stroke-current"/><line x1="8" y1="8" x2="16" y2="8" className="stroke-current"/><line x1="8" y1="12" x2="16" y2="12" className="stroke-current"/><line x1="8" y1="16" x2="12" y2="16" className="stroke-current"/></svg>}
function QuoteIcon(props){return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}><path d="M7 7h6v6H7zM13 7h6v6h-6z" className="fill-none stroke-current"/></svg>}
function BoxIcon(props){return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}><path d="M3 7l9-4 9 4v10l-9 4-9-4z" className="fill-none stroke-current"/></svg>}

export default function Sidebar({ currentPage = "dashboard", onNavigate }) {
  const [expandedSections, setExpandedSections] = useState(["annuaire"]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const navigationItems = [
    { 
      id: "dashboard", 
      label: "Tableau de bord", 
      icon: CircleDot, 
      route: "dashboard",
      active: currentPage === "dashboard"
    },
    { 
      id: "projects", 
      label: "Suivi projets", 
      icon: CheckCircle2, 
      route: "projects",
      active: currentPage === "projects"
    },
    {
      id: "annuaire",
      label: "Annuaire",
      icon: User2,
      expandable: true,
      expanded: expandedSections.includes("annuaire"),
      children: [
        { 
          id: "contacts", 
          label: "Fiche contact", 
          route: "directory-contacts",
          active: currentPage === "directory-contacts"
        },
        { 
          id: "fournisseurs", 
          label: "Fiche fournisseurs", 
          route: "directory-suppliers",
          active: currentPage === "directory-suppliers"
        },
        { 
          id: "artisans", 
          label: "Fiche artisans", 
          route: "directory-artisans",
          active: currentPage === "directory-artisans"
        },
        { 
          id: "institutionnel", 
          label: "Fiche institutionnel", 
          route: "directory-institutional",
          active: currentPage === "directory-institutional"
        },
        { 
          id: "prescripteur", 
          label: "Fiche prescripteur", 
          route: "directory-prescriber",
          active: currentPage === "directory-prescriber"
        },
        { 
          id: "soustraitant", 
          label: "Fiche sous traitant", 
          route: "directory-subcontractor",
          active: currentPage === "directory-subcontractor"
        },
      ]
    },
    { 
      id: "tasks", 
      label: "Tâches & mémo", 
      icon: Clock3, 
      route: "tasks",
      active: currentPage === "tasks"
    },
    { 
      id: "agenda", 
      label: "Agenda", 
      icon: CalendarIcon, 
      route: "agenda",
      active: currentPage === "agenda"
    },
    { 
      id: "articles", 
      label: "Articles", 
      icon: DocumentIcon, 
      route: "articles",
      active: currentPage === "articles"
    },
    { 
      id: "factures", 
      label: "Factures", 
      icon: InvoiceIcon, 
      route: "invoices",
      active: currentPage === "invoices"
    },
    { 
      id: "devis", 
      label: "Devis", 
      icon: QuoteIcon, 
      route: "quotes",
      active: currentPage === "quotes"
    },
    { 
      id: "commandes", 
      label: "Commandes", 
      icon: BoxIcon, 
      route: "orders",
      active: currentPage === "orders"
    },
  ];

  const handleItemClick = (item) => {
    if (item.expandable) {
      toggleSection(item.id);
    } else if (item.route && onNavigate) {
      onNavigate(item.route);
    }
  };

  const handleChildClick = (child) => {
    if (child.route && onNavigate) {
      onNavigate(child.route);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-white/90 backdrop-blur-sm border-r border-neutral-200 hidden lg:flex lg:flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-neutral-200 bg-white/50">
        <span className="font-black tracking-tight text-2xl text-neutral-900">XORA</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.id}>
            <button 
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                item.active 
                  ? "bg-neutral-100 text-neutral-900 border-l-2 border-neutral-900" 
                  : "text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900"
              }`}
            >
              <item.icon className="size-5 flex-shrink-0" />
              <span className="truncate flex-1 text-left">{item.label}</span>
              {item.expandable && (
                item.expanded ? (
                  <ChevronDown className="size-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="size-4 flex-shrink-0" />
                )
              )}
            </button>
            
            {/* Submenu */}
            {item.expandable && item.expanded && item.children && (
              <div className="mt-1 ml-4 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildClick(child)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      child.active
                        ? "bg-neutral-100 text-neutral-900 font-medium"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <span className="truncate text-left">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors duration-200">
          <span>Se déconnecter</span>
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}