"use client";

/**
 * TableSearch — Reusable premium search input for DataTable.
 *
 * Usage:
 *   <TableSearch
 *     value={query}
 *     onChange={setQuery}
 *     placeholder="Search faculty..."
 *   />
 */

import React, { useRef } from "react";
import { Search, X } from "lucide-react";

export interface TableSearchProps {
  /** Controlled value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional className override */
  className?: string;
}

export default function TableSearch({
  value,
  onChange,
  placeholder = "Search records...",
  className = "",
}: TableSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-350 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/20 transition-all shadow-sm"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
