"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Hospital, FlaskConical } from "lucide-react";
import { slideUp, staggerContainer } from "../animations/transitions";

export default function Stats() {
  const stats = [
    {
      icon: <GraduationCap className="w-6 h-6 text-brand-gold-500" />,
      number: "12,000+",
      label: "Graduated Clinical Alumni",
    },
    {
      icon: <Award className="w-6 h-6 text-brand-gold-500" />,
      number: "98.4%",
      label: "Board Exam Licensing Rate",
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-brand-gold-500" />,
      number: "35+",
      label: "Accredited Simulation Labs",
    },
    {
      icon: <Hospital className="w-6 h-6 text-brand-gold-500" />,
      number: "50+",
      label: "Affiliated Teaching Hospitals",
    },
  ];

  return (
    <section id="labs" className="relative py-20 lg:py-28 overflow-hidden bg-brand-dark text-white font-sans">
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Core Stats Block */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={slideUp}
              className="space-y-4 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight leading-none text-white">
                {stat.number}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 max-w-[200px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Informative Sub-Block */}
        <div className="mt-24 p-8 md:p-12 rounded-large border border-brand-gold-500/20 bg-slate-950/40 backdrop-blur-md max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-brand-gold-500 tracking-wider uppercase">
                Immersive Learning
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-white">
                State-of-the-Art Simulation Infrastructure
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-2">
                We believe healthcare is learned through practice. Our facilities include pediatric ICU rooms, patient telemetry wards, and virtual reality anatomy theatres where students practice complex operations in a safe environment.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <a
                href="#admissions"
                className="inline-flex items-center space-x-2 px-6 py-3.5 btn-academic-gold text-xs uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all"
              >
                <span>Schedule Campus Tour</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
