"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* Sidebar - Desktop Layout Only */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Collapsible Mobile Navigation Drawer */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky top navigational header */}
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic page contents scroll viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950 relative">
          {children}
        </main>

      </div>

    </div>
  );
}
