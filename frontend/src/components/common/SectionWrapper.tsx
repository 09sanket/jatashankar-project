"use client";

import React from "react";
import { motion } from "framer-motion";
import { slideUp } from "../../animations/transitions";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  category?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  centerHeader?: boolean;
}

export default function SectionWrapper({
  id,
  category,
  title,
  subtitle,
  children,
  className,
  centerHeader = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-padding relative overflow-hidden transition-colors duration-300",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUp}
          className={cn(
            "mb-16 sm:mb-20 space-y-4 max-w-3xl",
            centerHeader ? "mx-auto text-center" : "text-left"
          )}
        >
          {category && (
            <span className="text-[10px] font-bold tracking-widest text-brand-red-500 uppercase block">
              {category}
            </span>
          )}
          <h2
            className={cn(
              "font-serif font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight leading-tight",
              centerHeader ? "title-accent-bar-center" : "title-accent-bar"
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={cn(
              "font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed",
              centerHeader ? "mt-6" : "mt-6"
            )}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Section Body */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUp}
          transition={{ delay: 0.15 }}
          className="w-full"
        >
          {children}
        </motion.div>
        
      </div>
    </section>
  );
}
