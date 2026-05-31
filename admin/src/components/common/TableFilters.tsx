"use client";

/**
 * TableFilters — Reusable dropdown filter bar for DataTable.
 *
 * Usage:
 *   <TableFilters
 *     filters={[
 *       {
 *         key: "department",
 *         label: "Department",
 *         options: [
 *           { label: "All Departments", value: "" },
 *           { label: "Physiotherapy", value: "Physiotherapy" },
 *         ],
 *         value: selectedDept,
 *         onChange: setSelectedDept,
 *       },
 *     ]}
 *     onReset={() => { setSelectedDept(""); }}
 *   />
 */

import React from "react";
import { RotateCcw } from "lucide-react";

export interface FilterConfig {
  /** Unique identifier for the filter */
  key: string;
  /** Display label shown above the dropdown */
  label: string;
  /** Dropdown options */
  options: { label: string; value: string }[];
  /** Current selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
}

export interface TableFiltersProps {
  /** Array of filter configurations */
  filters: FilterConfig[];
  /** Called when user clicks "Reset All" */
  onReset?: () => void;
  /** Optional className override */
  className?: string;
}

export default function TableFilters({
  filters,
  onReset,
  className = "",
}: TableFiltersProps) {
  const hasActiveFilter = filters.some((f) => f.value !== "");

  if (filters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-1">
            {filter.label}
          </label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/20 transition-all shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-8"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset All Button */}
      {onReset && hasActiveFilter && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-[#9B111E] transition-colors cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
