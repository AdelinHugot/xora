import React from "react";
import { ChevronDown, Menu, Bell, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function OurCompanyPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="our-company"
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
                <g clipPath="url(#clip0_2512_23930)">
                  <path d="M12 5.25V3C12 2.17157 11.3284 1.5 10.5 1.5H7.5C6.67157 1.5 6 2.17157 6 3V5.25M16.5 9L9.29415 10.4412C9.09998 10.48 8.90002 10.48 8.70585 10.4412L1.5 9M3 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V6.75C16.5 5.92157 15.8284 5.25 15 5.25H3C2.17157 5.25 1.5 5.92157 1.5 6.75V15C1.5 15.8284 2.17157 16.5 3 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_2512_23930">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">Notre Entreprise</h1>
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
            <h2 className="text-2xl font-bold mb-6">Informations sur notre entreprise</h2>
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <p className="text-neutral-500">Cette page sera complétée ultérieurement avec les informations sur l'entreprise.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
