"use client";

import React from "react";
import { Phone } from "lucide-react";

interface CallButtonProps {
  phoneNumber?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CallButton({ 
  phoneNumber = "9926561016", 
  className = "", 
  children 
}: CallButtonProps) {
  const handleCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleCall}
      className={`inline-flex items-center justify-center space-x-2 px-5 py-3 border border-[#D4A017]/40 hover:border-[#9B111E] text-[#9B111E] dark:text-[#D4A017] font-sans font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${className}`}
    >
      <Phone className="w-4 h-4 shrink-0" />
      <span>{children || "Call Now"}</span>
    </a>
  );
}
