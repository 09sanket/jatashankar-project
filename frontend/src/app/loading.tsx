"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * High-performance Next.js instant root loading screen.
 * Leverages purely CSS animations for zero-layout-shift and fast Lighthouse feedback.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="relative flex flex-col items-center max-w-sm text-center">
        {/* Animated Accent Background Glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-full blur-3xl animate-pulse" />
        
        {/* Logo Shimmer Placeholder */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-1.5 bg-slate-50 dark:bg-slate-900 shadow-lg mb-8 flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-400 animate-spin" />
        </motion.div>

        {/* Elegant Spinner / Pulsing Rings */}
        <div className="relative w-12 h-12 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-800 animate-ping opacity-25" />
          <div className="absolute inset-0 rounded-full border-2 border-t-red-600 border-r-red-600 border-b-transparent border-l-transparent animate-spin" />
        </div>

        {/* Static Title & Subtitle for Instant Load Feedback */}
        <h2 className="font-serif font-extrabold text-lg md:text-xl text-slate-700 dark:text-slate-200 mb-2">
          Jatashankar Group
        </h2>

        <p className="text-xs md:text-sm font-sans font-medium text-slate-450 dark:text-slate-500 tracking-wide animate-pulse">
          Initializing educational portal...
        </p>
      </div>
    </div>
  );
}
