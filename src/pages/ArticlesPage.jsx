import React, { useState, useMemo, useRef, useEffect } from "react";
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
  List,
  Layout,
  ChevronUp,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CreateArticleModal from "../components/CreateArticleModal";
import UserTopBar from "../components/UserTopBar";

// Mock data generator
const generateMockArticles = () => {
  const branches = ["Salle de bain", "Douche", "Baignoire", "Toilettes", "Bidet", "Lavabo", "Robinetterie", "Accessoires", "Meuble de salle de bain"];
  const familles = ["Sanitaire vasque sdb", "Sanitaire douche dou", "Sanitaire baignoire bai", "Sanitaire WC", "Sanitaire bidet bid", "Sanitaire lavabo lav", "Robinetterie mitigeur", "Accessoires chrome", "Meuble sous-vasque"];
  const gammes = ["Sanitaire Approsine SDB", "Sanitaire Approsine Douche", "Sanitaire Premium Bain", "Sanitaire Eco WC", "Sanitaire Luxe Bidet", "Sanitaire Standard Lavabo", "Robinetterie Design", "Accessoires Moderne", "Meuble Classique"];
  const fournisseurs = ["APPROSINE", "HYDROPLUS", "SANIFIX", "BATHPRO", "AQUATECH"];

  const articles = [];
  for (let i = 1; i <= 72; i++) {
    const branche = branches[Math.floor(Math.random() * branches.length)];
    const famille = familles[Math.floor(Math.random() * familles.length)];
    const gamme = gammes[Math.floor(Math.random() * gammes.length)];
    const fournisseur = fournisseurs[Math.floor(Math.random() * fournisseurs.length)];
    const reference = `ST${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.random() > 0.5 ? '/G' : '/W'}`;
    const pp_ht = Math.round((50 + Math.random() * 950) * 100) / 100;
    const pv_ttc = Math.round(pp_ht * 1.2 * 100) / 100;

    articles.push({
      id: i,
      branche,
      famille,
      gamme,
      fournisseur,
      reference,
      pp_ht,
      pv_ttc
    });
  }

  return articles;
};

const mockArticles = generateMockArticles();

// Custom hook for client-side table management
const useClientTable = (data, filters, sortConfig, pageSize = 11) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          item.branche,
          item.famille,
          item.gamme,
          item.reference,
          item.fournisseur
        ].map(f => f.toLowerCase());

        if (!searchableFields.some(field => field.includes(searchLower))) {
          return false;
        }
      }

      // Exact filters
      if (filters.branche && item.branche !== filters.branche) return false;
      if (filters.famille && item.famille !== filters.famille) return false;
      if (filters.gamme && item.gamme !== filters.gamme) return false;
      if (filters.fournisseur && item.fournisseur !== filters.fournisseur) return false;

      return true;
    });
  }, [data, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return {
    data: paginatedData,
    totalItems: sortedData.length,
    currentPage,
    totalPages,
    setCurrentPage,
    startIndex: startIndex + 1,
    endIndex: Math.min(startIndex + pageSize, sortedData.length)
  };
};

// Components
const Topbar = ({ onNavigate }) => {
  return (
    <header className="h-16 border-b bg-[#F8F9FA] border-neutral-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-neutral-300 rounded text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7.5V14.625C15 15.2463 14.4963 15.75 13.875 15.75H4.125C3.50368 15.75 3 15.2463 3 14.625V7.5M7.5 9.75H10.5M2.25 2.25H15.75C16.1642 2.25 16.5 2.58579 16.5 3V6.75C16.5 7.16421 16.1642 7.5 15.75 7.5H2.25C1.83579 7.5 1.5 7.16421 1.5 6.75V3C1.5 2.58579 1.83579 2.25 2.25 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-bold text-xl lg:text-2xl text-neutral-900">Articles</h1>
      </div>
      <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
    </header>
  );
};

const FiltersBar = ({ filters, onFilterChange }) => {
  // Derive unique options from mock data
  const branches = [...new Set(mockArticles.map(a => a.branche))].sort();
  const familles = [...new Set(mockArticles.map(a => a.famille))].sort();
  const gammes = [...new Set(mockArticles.map(a => a.gamme))].sort();
  const fournisseurs = [...new Set(mockArticles.map(a => a.fournisseur))].sort();

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Rechercher"
            className="w-full pl-10 pr-3 h-10 rounded-lg border border-gray-300 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <select
          value={filters.branche}
          onChange={(e) => onFilterChange('branche', e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="">Branche</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={filters.famille}
          onChange={(e) => onFilterChange('famille', e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="">Famille</option>
          {familles.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          value={filters.gamme}
          onChange={(e) => onFilterChange('gamme', e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="">Gamme</option>
          {gammes.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select
          value={filters.fournisseur}
          onChange={(e) => onFilterChange('fournisseur', e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="">Fournisseur</option>
          {fournisseurs.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
};

const RowActionsMenu = ({ article, onClose }) => {
  const menuRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const menuItems = [
    { label: "Éditer", action: () => console.log("Éditer", article) },
    { label: "Dupliquer", action: () => console.log("Dupliquer", article) },
    { label: "Supprimer", action: () => console.log("Supprimer", article) }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, menuItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          menuItems[focusedIndex].action();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      role="menu"
      className="absolute right-2 z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      {menuItems.map((item, index) => (
        <button
          key={item.label}
          role="menuitem"
          onClick={() => {
            item.action();
            onClose();
          }}
          onMouseEnter={() => setFocusedIndex(index)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
            focusedIndex === index ? "bg-gray-50" : ""
          } ${index === 0 ? "rounded-t-lg" : ""} ${
            index === menuItems.length - 1 ? "rounded-b-lg" : ""
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

const ArticlesTable = ({ articles, sortConfig, onSort }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleSort = (key) => {
    if (!['reference', 'pp_ht', 'pv_ttc'].includes(key)) return;

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        onSort({ key, direction: 'desc' });
      } else {
        onSort({ key: null, direction: null });
      }
    } else {
      onSort({ key, direction: 'asc' });
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ?
      <ChevronUp className="size-3 inline ml-1" /> :
      <ChevronDown className="size-3 inline ml-1" />;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
              Branche
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
              Famille
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
              Gamme
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
              Nom fournisseur
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('reference')}
            >
              Référence <SortIcon columnKey="reference" />
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('pp_ht')}
            >
              Prix public HT <SortIcon columnKey="pp_ht" />
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('pv_ttc')}
            >
              Prix de vente TTC <SortIcon columnKey="pv_ttc" />
            </th>
            <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
              Action rapide
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr
              key={article.id}
              onClick={() => console.log("Voir article", article)}
              className="hover:bg-neutral-50 transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid #E4E4E7" }}
              role="row"
            >
              {/* Branche */}
              <td className="py-4 px-3" role="cell">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-neutral-900">{article.branche}</span>
                  <ArrowUpRight className="size-4 text-neutral-400 flex-shrink-0" />
                </div>
              </td>

              {/* Famille */}
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-700">{article.famille}</span>
              </td>

              {/* Gamme */}
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-700">{article.gamme}</span>
              </td>

              {/* Fournisseur */}
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-700">{article.fournisseur}</span>
              </td>

              {/* Référence */}
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-700 font-mono">{article.reference}</span>
              </td>

              {/* Prix public HT */}
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-700">{formatPrice(article.pp_ht)} €</span>
              </td>

              {/* Prix de vente TTC */}
              <td className="py-4 px-3" role="cell">
                <span className="text-sm text-neutral-700">{formatPrice(article.pv_ttc)} €</span>
              </td>

              {/* Action rapide */}
              <td className="py-4 px-3" role="cell">
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
                    aria-label="Voir article"
                    title="Voir article"
                    onClick={() => console.log("Voir", article)}
                  >
                    <Eye className="size-4 text-neutral-600" />
                  </button>
                  <button
                    className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
                    aria-label="Plus d'options"
                    title="Plus d'options"
                    onClick={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
                  >
                    <MoreHorizontal className="size-4 text-neutral-600" />
                  </button>
                  {openMenuId === article.id && (
                    <RowActionsMenu
                      article={article}
                      onClose={() => setOpenMenuId(null)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        className="size-9 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft className="size-4" />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="size-9 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-4" />
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === "..."}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={typeof page === 'number' ? `Page ${page}` : undefined}
          className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium ${
            page === currentPage
              ? "bg-gray-900 text-white"
              : page === "..."
              ? "cursor-default"
              : "border hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="size-9 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-4" />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Dernière page"
        className="size-9 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight className="size-4" />
      </button>
    </nav>
  );
};

export default function ArticlesPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const [filters, setFilters] = useState({
    search: "",
    branche: "",
    famille: "",
    gamme: "",
    fournisseur: ""
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateArticle = async (formData) => {
    console.log("Creating article:", formData);
    // Here you would typically make an API call
    // For now, we'll just log the data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsModalOpen(false);
  };

  const handleBack = () => {
    console.log("Back button clicked");
    setIsModalOpen(false);
  };

  const {
    data: paginatedArticles,
    totalItems,
    currentPage,
    totalPages,
    setCurrentPage,
    startIndex,
    endIndex
  } = useClientTable(mockArticles, filters, sortConfig, 11);

  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <CreateArticleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        onNext={handleCreateArticle}
      />

      <Sidebar
        currentPage="articles"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <Topbar onNavigate={onNavigate} />
        <div className="w-full py-6 px-4 lg:px-6">
          {/* Main Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <List className="size-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Liste des articles ({totalItems})
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => console.log("Exporter")}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Download className="size-4" />
                    Exporter
                  </button>
                  <button
                    onClick={() => console.log("Importer")}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="size-4" />
                    Importer
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="size-4" />
                    Ajouter un article
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <FiltersBar filters={filters} onFilterChange={handleFilterChange} />

            {/* Table */}
            <div className="p-6">
              <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
                <ArticlesTable
                  articles={paginatedArticles}
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Actuellement {startIndex} à {endIndex} sur {totalItems} résultats
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
