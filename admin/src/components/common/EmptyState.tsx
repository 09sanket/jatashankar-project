"use client";

/**
 * EmptyState — Reusable premium empty-state placeholder.
 *
 * Usage:
 *   <EmptyState
 *     icon={<Inbox className="w-8 h-8" />}
 *     title="No Records Found"
 *     description="Try adjusting your search or filters."
 *     action={{ label: "Clear Filters", onClick: () => {} }}
 *   />
 */

import React from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export interface EmptyStateProps {
  /** Custom icon element — defaults to SearchX */
  icon?: React.ReactNode;
  /** Headline text */
  title?: string;
  /** Supporting description */
  description?: string;
  /** Optional CTA button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title = "No Records Found",
  description = "There are no items to display at this time.",
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {/* Icon Container */}
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-5">
        {icon ?? <SearchX className="w-7 h-7" />}
      </div>

      {/* Heading */}
      <h3 className="text-sm font-serif font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1.5">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
        {description}
      </p>

      {/* Optional Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2 rounded-xl bg-[#9B111E] hover:bg-[#800F19] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-red-900/10"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
