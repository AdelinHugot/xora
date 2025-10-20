import React from "react";
import { ChevronDown, Menu, Bell, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function KPIPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="kpi"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        <header className="h-16 border-b border-neutral-200 bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Menu">
              <Menu className="size-4" />
            </button>
            <div className="p-2.5 bg-white border border-neutral-300 rounded text-neutral-900">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 2.25V15.75H15.75M5.25 12L9.1875 8.0625L11.8125 10.6875L15.75 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">KPI</h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Notifications">
              <Bell className="size-4" />
            </button>
            <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50" aria-label="Paramètres">
              <Settings className="size-4" />
            </button>
            <div className="flex items-center gap-2 pl-3 ml-2 border-l border-neutral-200">
              <img src="https://i.pravatar.cc/40?img=12" alt="avatar" className="size-8 rounded-full" />
              <div className="text-sm leading-tight">
                <div className="font-semibold">Thomas</div>
                <div className="text-neutral-500">Admin</div>
              </div>
              <ChevronDown className="size-4 text-neutral-500" />
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Indicateurs de Performance</h2>
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <p className="text-neutral-500">Cette page sera complétée ultérieurement avec les indicateurs KPI détaillés.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
