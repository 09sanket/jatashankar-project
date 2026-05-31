"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

export default function GlobalLoader() {
  const { settings } = useWebsiteSettings();
  const logoUrl = settings.logoUrl || "/branding/logo.jpeg";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center max-w-sm text-center">
        {/* Animated Accent Background Glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-cream/45 dark:bg-slate-900 rounded-full blur-3xl animate-pulse" />
        
        {/* Logo Container with Golden border & Subtle Pulse */}
        <motion.div
          className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-brand-gold/30 p-1.5 bg-brand-cream/20 shadow-lg mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: [0.9, 1.02, 1], opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            times: [0, 0.6, 1]
          }}
        >
          <div className="w-full h-full rounded-xl overflow-hidden relative bg-white">
            <Image
              src={logoUrl}
              alt="Jatashankar Group of Institutions Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
        </motion.div>

        {/* Elegant Spinner / Pulsing Rings */}
        <div className="relative w-12 h-12 mb-6">
          {/* Outer Gold Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-brand-gold/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner Deep Red Spinner */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-t-brand-red border-r-brand-red border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Loading Text */}
        <motion.h2
          className="font-academic text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Jatashankar Group
        </motion.h2>

        <motion.p
          className="text-xs md:text-sm font-sans font-medium text-slate-500 dark:text-slate-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ delay: 0.3, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading Jatashankar Group of Institute...
        </motion.p>
      </div>
    </motion.div>
  );
}
