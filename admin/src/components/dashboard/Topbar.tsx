"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Calendar, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { menuItems } from "./Sidebar";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  // Set formatted date string client-side
  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  // Resolve dynamic title text depending on active route path
  const currentTitle = menuItems.find(item => item.path === pathname)?.name || "Admin Panel";

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-40 px-6 py-4 flex items-center justify-between">
      
      {/* Page Title & Hamburger Area */}
      <div className="flex items-center space-x-4">
        {/* Toggle Button for Collapsible Mobile sidebar */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-left">
          <h2 className="text-base sm:text-lg font-serif font-extrabold text-slate-900 dark:text-white leading-tight">
            {currentTitle}
          </h2>
          <p className="hidden sm:block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Jatashankar Management Console
          </p>
        </div>
      </div>

      {/* Date & User Info */}
      <div className="flex items-center space-x-6">
        {/* Date string indicator */}
        {currentDate && (
          <div className="hidden md:flex items-center space-x-2 text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{currentDate}</span>
          </div>
        )}

        {/* User profile capsule details */}
        <div className="flex items-center space-x-3 p-1.5 pl-3 rounded-full border border-slate-150 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950">
          <div className="hidden sm:block text-right">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
              Administrator
            </h4>
            <p className="text-[9px] text-slate-400 dark:text-slate-550 truncate max-w-[120px]">
              {user?.email || "No email"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#9B111E]/5 border border-[#9B111E]/10 flex items-center justify-center text-[#9B111E] dark:text-[#E25C65] shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>

    </header>
  );
}
