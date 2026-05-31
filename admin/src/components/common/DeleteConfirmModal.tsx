"use client";

/**
 * DeleteConfirmModal — Reusable premium delete confirmation dialog.
 *
 * Usage:
 *   <DeleteConfirmModal
 *     isOpen={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     onConfirm={handleDelete}
 *     loading={isDeleting}
 *     itemName="Gallery Item"          // optional – personalises the message
 *   />
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

// ── Animation variants ─────────────────────────────────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
} as const;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.94, y: 16, transition: { duration: 0.18, ease: "easeIn" } },
} as const;

// ── Props ──────────────────────────────────────────────────────────────────────
export interface DeleteConfirmModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Called when the user dismisses without confirming */
  onClose: () => void;
  /** Called when the user confirms deletion */
  onConfirm: () => void | Promise<void>;
  /** Shows spinner and disables buttons while true */
  loading?: boolean;
  /**
   * Optional human-readable name of the item being deleted.
   * Renders as: "Are you sure you want to delete this [itemName]?"
   * Falls back to "item" when omitted.
   */
  itemName?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  itemName,
}: DeleteConfirmModalProps) {
  const label = itemName ?? "item";

  // Prevent backdrop dismiss while deletion is in progress
  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── Backdrop ── */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            onClick={handleBackdropClick}
          />

          {/* ── Modal Panel ── */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-3xl border border-red-100/60 dark:border-red-900/30 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
            variants={modalVariants}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#9B111E] via-[#C41E3A] to-[#9B111E]" />

            {/* ── Header ── */}
            <div className="flex items-start justify-between p-6 pb-0">
              {/* Warning icon container */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#9B111E]" />
                </div>
                <div className="text-left">
                  <h2
                    id="delete-modal-title"
                    className="text-sm font-serif font-extrabold text-slate-900 dark:text-white uppercase tracking-wide"
                  >
                    Confirm Deletion
                  </h2>
                  <p className="text-[9px] font-bold text-[#9B111E] uppercase tracking-wider mt-0.5">
                    Irreversible action
                  </p>
                </div>
              </div>

              {/* Close button — only shown when not loading */}
              {!loading && (
                <button
                  onClick={onClose}
                  aria-label="Close confirmation dialog"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── Body ── */}
            <div className="px-6 pt-5 pb-2 space-y-3 text-left">
              {/* Personalised confirmation message */}
              <p
                id="delete-modal-description"
                className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                Are you sure you want to delete this{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {label}
                </span>
                ?
              </p>

              {/* Warning callout */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20">
                <AlertTriangle className="w-3.5 h-3.5 text-[#9B111E] shrink-0 mt-0.5" />
                <p className="text-[10px] font-semibold text-red-700 dark:text-red-400 leading-relaxed">
                  This action{" "}
                  <span className="font-extrabold uppercase tracking-wide">
                    cannot be undone
                  </span>
                  . The record will be permanently removed from the database.
                </p>
              </div>
            </div>

            {/* ── Footer Buttons ── */}
            <div className="flex items-center justify-end gap-3 px-6 py-5">
              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {/* Delete Permanently */}
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#9B111E] hover:bg-[#800F19] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-red-900/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
