"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { menuItems } from "./Sidebar";
import { logoutAdmin } from "../../services/auth.service";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity lg:hidden"
        />
      )}

      {/* Drawer Content */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo and close button */}
        <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-brand-cream-350 dark:border-slate-700 shrink-0 bg-[#FFF8F2]">
              <Image
                src="/assets/branding/logo.jpeg"
                alt="Jatashankar Logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <h1 className="text-[10px] font-serif font-extrabold text-slate-900 dark:text-white leading-tight uppercase">
                Jatashankar
              </h1>
              <p className="text-[8px] text-[#9B111E] dark:text-[#E25C65] font-bold uppercase tracking-wider">
                Institute
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#9B111E]/5 text-[#9B111E] dark:bg-[#9B111E]/15 dark:text-[#E25C65] border-l-4 border-[#9B111E]"
                    : "text-slate-650 hover:text-[#9B111E] hover:bg-[#FFF8F2] dark:text-slate-400 dark:hover:text-[#E25C65]"
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

        {/* Info label footer */}
        <div className="p-4 border-t border-slate-50 dark:border-slate-800/60 text-center">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-650 uppercase tracking-widest">
            Institutional Console
          </p>
        </div>

      </div>
    </>
  );
}
