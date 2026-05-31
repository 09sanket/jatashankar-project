"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, RefreshCw, LogIn, WifiOff, Database } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
} as const;

export default function AuthErrorFallback({ error, onRetry }: AuthErrorFallbackProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate a brief feedback delay before retrying
    setTimeout(() => {
      onRetry();
      setIsRetrying(false);
    }, 1200);
  };

  const handleLoginRedirect = () => {
    // Clear localStorage to reset session hints
    try {
      localStorage.removeItem("admin_session_active");
    } catch (e) {
      console.warn("AuthErrorFallback: Failed to reset session key:", e);
    }
    router.replace("/login");
  };

  // Check if error is network related
  const isNetworkError = error?.message?.toLowerCase().includes("network") ||
                         error?.message?.toLowerCase().includes("connection") ||
                         error?.message?.toLowerCase().includes("fetch");

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#FFFDF9] via-[#FAF6EE] to-[#F3EDE0] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Brand Glowing Orbs */}
      <div className="absolute top-1/4 right-[-10%] w-96 h-96 rounded-full bg-[#D4A017]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#9B111E_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      <motion.div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-brand-cream-350 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden text-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#9B111E]" />

        {/* Error Icon Bubble */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-red-650 dark:text-red-400 mb-6 shadow-inner relative group">
          {isNetworkError ? (
            <WifiOff className="w-7 h-7 animate-pulse text-[#9B111E] dark:text-[#E25C65]" />
          ) : (
            <ShieldAlert className="w-7 h-7 text-[#9B111E] dark:text-[#E25C65]" />
          )}
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#D4A017] border-2 border-white dark:border-slate-900" />
        </div>

        {/* Header Text */}
        <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Secure Authentication Error
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-6">
          System Initialisation Failed
        </p>

        {/* Detailed Info Panel */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 mb-8 text-left space-y-3">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
            <Database className="w-3.5 h-3.5" />
            <span>Diagnostics Log</span>
          </div>
          <p className="text-xs font-semibold text-slate-650 dark:text-slate-350 leading-relaxed font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {error?.message || "An unresolved authorization connection error occurred while querying the secure server credential pipeline."}
          </p>
        </div>

        {/* Dynamic Warning Alert */}
        <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold leading-relaxed mb-8">
          This could be caused by strict firewall restrictions, an unstable network connection, or temporarily unavailable cloud services.
        </p>

        {/* Action Button Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Retry CTA */}
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3.5 bg-gradient-to-r from-[#9B111E] to-[#7a0c16] hover:from-[#7a0c16] hover:to-[#9B111E] disabled:from-slate-400 disabled:to-slate-400 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm transition-all duration-300 group cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D4A017] ${isRetrying ? "animate-spin" : "group-hover:rotate-12 transition-transform duration-300"}`} />
            <span>{isRetrying ? "Reconnecting..." : "Retry Connection"}</span>
          </button>

          {/* Login Fallback */}
          <button
            onClick={handleLoginRedirect}
            disabled={isRetrying}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 font-sans font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Go to Login</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
