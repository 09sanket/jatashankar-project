"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

/**
 * Premium base Skeleton loader component with smooth shimmer effect and opacity pulse.
 */
export default function SkeletonBase({ className = "", variant = "rect" }: SkeletonProps) {
  const roundedClass = 
    variant === "circle" 
      ? "rounded-full" 
      : variant === "text" 
      ? "rounded-md" 
      : "rounded-2xl";

  return (
    <motion.div
      // Infinite pulse animation for elegant UX
      animate={{ opacity: [0.45, 0.9, 0.45] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800/60 ${roundedClass} ${className}`}
    >
      {/* Subtle linear Shimmer Gradient overlay */}
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -skew-x-12"
      />
    </motion.div>
  );
}
