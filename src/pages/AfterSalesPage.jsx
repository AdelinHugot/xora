import React from "react";
import { ChevronDown, Menu, Bell, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function AfterSalesPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="after-sales"
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
                <g clipPath="url(#clip0_2512_23914)">
                  <path d="M10.1329 10.4719C11.8 11.1048 13.7848 10.7274 15.1591 9.35306C16.6183 7.89378 16.8451 5.6378 16.0405 3.91307L12.7845 7.16914L10.8309 5.2155L14.087 1.95943C12.3622 1.15486 10.1062 1.38167 8.64697 2.8409C7.27267 4.2152 6.89524 6.19995 7.52805 7.86708M7.49296 7.90218L2.03948 13.3557C1.32017 14.075 1.32017 15.2412 2.03948 15.9605C2.75879 16.6798 3.92503 16.6798 4.64434 15.9605L10.0978 10.507" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_2512_23914">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">SAV & Finition</h1>
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
            <h2 className="text-2xl font-bold mb-6">Suivi SAV & Finition</h2>
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <p className="text-neutral-500">Cette page sera complétée ultérieurement avec le suivi des demandes SAV et finitions.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
