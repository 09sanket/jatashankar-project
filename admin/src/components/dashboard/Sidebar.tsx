"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Users, BookOpen, 
  Megaphone, Star, Settings, LogOut, Loader2, Heart 
} from "lucide-react";
import { logoutAdmin } from "../../services/auth.service";
import { showToast } from "../../lib/toast";

export const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Enquiries", path: "/dashboard/enquiries", icon: <FileText className="w-4 h-4" /> },
  { name: "Gallery", path: "/dashboard/gallery", icon: <ImageIcon className="w-4 h-4" /> },
  { name: "Faculty", path: "/dashboard/faculty", icon: <Users className="w-4 h-4" /> },
  { name: "Courses", path: "/dashboard/courses", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Announcements", path: "/dashboard/announcements", icon: <Megaphone className="w-4 h-4" /> },
  { name: "Testimonials", path: "/dashboard/testimonials", icon: <Star className="w-4 h-4" /> },
  { name: "Settings", path: "/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    // 1. Explicitly clear local session hint synchronously first to block any re-authentication checks
    try {
      localStorage.removeItem("admin_session_active");
    } catch (e) {
      console.warn("Sidebar: Failed to clear session key from localStorage:", e);
    }

    // 2. Wrap the Firebase signOut process inside a UI promise toast
    const logoutPromise = logoutAdmin();
    showToast.promise(logoutPromise, {
      loading: "Logging out of admin session...",
      success: "Logged out successfully.",
      error: "Failed to sign out cleanly.",
    });

    try {
      console.log("Sidebar: Initiating logout service...");
      await logoutPromise;
      console.log("Sidebar: Logout successful, redirecting to /login...");
      router.replace("/login");
    } catch (err) {
      console.error("Sidebar: Logout request failed:", err);
      setIsLoggingOut(false);
    }
  };


  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      
      {/* Brand Logo header */}
      <div className="p-6 flex items-center space-x-3 border-b border-slate-50 dark:border-slate-800/60">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-brand-cream-350 dark:border-slate-700 shrink-0 bg-[#FFF8F2]">
          <Image
            src="/assets/branding/logo.jpeg"
            alt="Jatashankar Logo"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="text-left min-w-0">
          <h1 className="text-xs font-serif font-extrabold text-slate-900 dark:text-white leading-tight uppercase truncate">
            Jatashankar
          </h1>
          <p className="text-[9px] text-[#9B111E] dark:text-[#E25C65] font-bold uppercase tracking-wider truncate">
            Group of Institute
          </p>
        </div>
      </div>

      {/* Navigation items list */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[#9B111E]/5 text-[#9B111E] dark:bg-[#9B111E]/15 dark:text-[#E25C65] border-l-4 border-[#9B111E]"
                  : "text-slate-600 hover:text-[#9B111E] hover:bg-[#FFF8F2] dark:text-slate-400 dark:hover:text-[#E25C65] dark:hover:bg-slate-800/40"
              }`}
            >
              <span className={`shrink-0 ${isActive ? "text-[#9B111E] dark:text-[#E25C65]" : "text-slate-400"}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button footer */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800/60">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center space-x-2.5 px-4 py-3 bg-[#9B111E]/5 hover:bg-[#9B111E] hover:text-white dark:bg-slate-950/20 text-[#9B111E] dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#9B111E] rounded-2xl text-xs font-bold transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-455"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging Out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout Session</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
