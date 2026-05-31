"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export interface FormErrorProps {
  id?: string;
  message?: string;
  className?: string;
}

export default function FormError({ id, message, className = "" }: FormErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id={id}
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`flex items-start gap-1.5 text-[11px] font-semibold text-[#9B111E] mt-1.5 select-none overflow-hidden ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
