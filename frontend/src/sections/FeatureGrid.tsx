"use client";

import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Award, Monitor, Landmark } from "lucide-react";
import { slideUp, staggerContainer } from "../animations/transitions";

export default function FeatureGrid() {
  const features = [
    {
      icon: <Stethoscope className="w-6 h-6 text-brand-red-500" />,
      title: "Active Medical Faculty",
      desc: "Learn from working clinical nurses, specialists, and hospital practitioners who bring modern real-world cases into classrooms.",
    },
    {
      icon: <Monitor className="w-6 h-6 text-brand-gold-500" />,
      title: "Advanced Simulation Labs",
      desc: "Train inside virtual operating theatres, clinical triage mocks, and anatomical VR units mimicking true emergency settings.",
    },
    {
      icon: <Award className="w-6 h-6 text-brand-red-500" />,
      title: "Accredited Certifications",
      desc: "Prepare confidently for board exams with course materials fully aligned to international licensing and healthcare standards.",
    },
    {
      icon: <Landmark className="w-6 h-6 text-brand-gold-500" />,
      title: "Global Partner Networks",
      desc: "Gain immediate opportunities via direct clinical rotation agreements with premium hospital systems and research hubs.",
    },
  ];

  return (
    <section id="accreditation" className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-900 border-y border-brand-cream-350 dark:border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">
            Why Jatashankar
          </span>
          <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight title-accent-bar-center">
            Academic Excellence Meets Clinical Training
          </h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mt-6">
            Our multi-disciplinary learning ecosystem is designed to equip students with clinical skills that meet global healthcare demands.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={slideUp}
              className="h-full p-6 md:p-8 rounded-large border border-brand-cream-350 dark:border-slate-800 bg-brand-cream-50/40 dark:bg-slate-950/40 card-premium-hover flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-premium border border-brand-cream-350 dark:border-slate-800 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-serif font-extrabold text-lg text-brand-dark dark:text-slate-100 leading-snug">
                  {feature.title}
                </h3>
                <p className="font-sans text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
