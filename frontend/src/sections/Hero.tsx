"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { slideUp, fadeIn } from "../animations/transitions";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";

export default function Hero() {
  const { settings, loading } = useWebsiteSettings();

  const stats = [
    { value: "1000+", label: "Students Enrolled" },
    { value: "20+",   label: "Courses Offered"   },
    { value: "5+",    label: "Years Experience"  },
    { value: "100%",  label: "Dedicated Faculty" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
    >

      {/* ── BACKGROUND GEOMETRY ── */}

      {/* Right 50% — Full hero lab image as background banner */}
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none hidden lg:block">
        <img
          src="/branding/hero-lab.png"
          alt="MLT Laboratory & Physiotherapy Lab at Jatashankar Institute"
          className="w-full h-full object-cover"
        />
        {/* Left edge fade into white */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent w-[40%]" />
        {/* Bottom subtle fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
      </div>

      {/* Red vertical accent bar */}
      <div className="absolute top-0 bottom-0 right-[42%] w-[3px] bg-gradient-to-b from-transparent via-[#C91D1D] to-transparent opacity-30 pointer-events-none" />

      {/* Large decorative circle — right panel, bg */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute right-[4%] top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
          {/* Outer ring */}
          <circle cx="210" cy="210" r="200" stroke="#C91D1D" strokeWidth="1" strokeOpacity="0.12" />
          {/* Mid ring */}
          <circle cx="210" cy="210" r="150" stroke="#C91D1D" strokeWidth="1" strokeOpacity="0.08" />
          {/* Inner ring */}
          <circle cx="210" cy="210" r="100" stroke="#D4A017" strokeWidth="1.5" strokeOpacity="0.18" />
          {/* Center dot */}
          <circle cx="210" cy="210" r="6" fill="#C91D1D" fillOpacity="0.15" />
          {/* Cross lines */}
          <line x1="210" y1="60" x2="210" y2="360" stroke="#C91D1D" strokeWidth="0.8" strokeOpacity="0.08" />
          <line x1="60" y1="210" x2="360" y2="210" stroke="#C91D1D" strokeWidth="0.8" strokeOpacity="0.08" />
          {/* Diagonal tick marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 210 + 190 * Math.cos(rad);
            const y1 = 210 + 190 * Math.sin(rad);
            const x2 = 210 + 205 * Math.cos(rad);
            const y2 = 210 + 205 * Math.sin(rad);
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C91D1D" strokeWidth="1.5" strokeOpacity="0.2" />;
          })}
          {/* Medical cross at center */}
          <rect x="200" y="185" width="20" height="50" rx="3" fill="#C91D1D" fillOpacity="0.07" />
          <rect x="185" y="200" width="50" height="20" rx="3" fill="#C91D1D" fillOpacity="0.07" />
        </svg>
      </motion.div>

      {/* Floating dot cluster — top right */}
      <div className="absolute top-24 right-[8%] pointer-events-none opacity-40">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {[0,1,2,3].map(row => [0,1,2,3].map(col => (
            <circle key={`${row}-${col}`} cx={col*20+10} cy={row*20+10} r="2" fill="#C91D1D" opacity="0.3" />
          )))}
        </svg>
      </div>

      {/* Gold arc — bottom left */}
      <div className="absolute bottom-0 left-0 pointer-events-none opacity-40">
        <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
          <path d="M 0 120 Q 90 0 180 60" stroke="#D4A017" strokeWidth="2" fill="none" strokeOpacity="0.4" />
          <path d="M 0 120 Q 70 20 160 70" stroke="#D4A017" strokeWidth="1" fill="none" strokeOpacity="0.25" />
        </svg>
      </div>

      {/* Small top-left accent square */}
      <div className="absolute top-28 left-8 w-3 h-3 border-2 border-[#C91D1D]/20 rotate-45 pointer-events-none" />
      <div className="absolute top-36 left-14 w-1.5 h-1.5 bg-[#D4A017]/30 rounded-full pointer-events-none" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 sm:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-[calc(100vh-7rem)] gap-0">

          {/* LEFT — Text content */}
          <div className="flex flex-col justify-center gap-6 sm:gap-8 pr-0 lg:pr-12">

            {/* Badge */}
            <motion.div
              variants={slideUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C91D1D]/6 border border-[#C91D1D]/15 text-[#C91D1D] font-bold text-[10px] tracking-widest uppercase w-max"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{settings.heroBadgeText || "Healthcare & Paramedical Institute"}</span>
            </motion.div>

            {/* Hindi Heading */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-3 animate-pulse">
                  <div className="h-16 sm:h-20 lg:h-24 bg-slate-100 rounded-xl w-11/12" />
                  <div className="h-10 sm:h-14 bg-slate-100 rounded-xl w-2/5" />
                  <div className="h-4 bg-slate-100 rounded w-8/12 mt-6" />
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                  className="flex flex-col gap-2">

                  <motion.h1
                    variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
                    className="font-serif font-black text-slate-900 tracking-tight leading-[1.06]"
                    style={{ fontSize: "clamp(2rem, 6vw, 4.8rem)" }}
                  >
                    जटाशंकर ग्रुप ऑफ इंस्टीट्यूट
                  </motion.h1>

                  <motion.div
                    variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.18 }}
                    className="flex items-center gap-3"
                  >
                    {/* Short red line */}
                    <div className="w-10 h-[2.5px] bg-[#C91D1D] rounded-full shrink-0" />
                    <span
                      className="font-serif font-black text-[#C91D1D] tracking-tight leading-[1.06]"
                      style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.6rem)" }}
                    >
                      बालाघाट
                    </span>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.26 }}
                    className="text-slate-500 leading-relaxed mt-3 max-w-lg"
                    style={{ fontSize: "clamp(0.85rem, 1.3vw, 1rem)" }}
                  >
                    {settings.heroDescription ||
                      "Physiotherapy, X-Ray Technology एवं Allied Healthcare Education के लिए आधुनिक एवं प्रोफेशनल शिक्षण संस्थान"}
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.34 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 mt-4"
                  >
                    <a href="#enquiry"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C91D1D] hover:bg-[#b01717] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto text-center">
                      <span>Apply Now</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a href="#courses"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-slate-200 hover:border-[#C91D1D]/40 text-slate-700 hover:text-[#C91D1D] text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto text-center">
                      <span>Explore Courses</span>
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inline Image Showcase for Mobile & Tablet (< lg) */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:h-[400px] rounded-3xl overflow-hidden border border-slate-100 shadow-xl lg:hidden mt-6 mb-2">
              <img
                src="/branding/hero-lab.png"
                alt="MLT Laboratory & Physiotherapy Lab"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/10" />

              {/* Floating course tags inside the image card on mobile/tablet */}
              <div className="absolute inset-0 p-3 sm:p-5 pointer-events-none">
                {/* Tag 1: Top Left */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-full px-3.5 py-2 text-[9px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5 pointer-events-auto"
                >
                  <span>🏥</span>
                  <span>B.Sc. Physiotherapy</span>
                </motion.div>

                {/* Tag 2: Top Right (staggered slightly lower to avoid collision) */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  className="absolute top-14 right-3 bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-full px-3.5 py-2 text-[9px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5 pointer-events-auto"
                >
                  <span>🔬</span>
                  <span>Medical Lab Tech</span>
                </motion.div>

                {/* Tag 3: Bottom Left (staggered slightly higher to avoid collision) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-14 left-3 bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-full px-3.5 py-2 text-[9px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5 pointer-events-auto"
                >
                  <span>📡</span>
                  <span>X-Ray Tech</span>
                </motion.div>

                {/* Tag 4: Bottom Right */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.95 }}
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-full px-3.5 py-2 text-[9px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5 pointer-events-auto"
                >
                  <span>🩺</span>
                  <span>OT Technology</span>
                </motion.div>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.48 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-slate-100 rounded-2xl overflow-hidden mt-2 bg-white"
            >
              {stats.map((s, i) => (
                <div key={s.label}
                  className={`flex flex-col items-center py-4 px-2 hover:bg-slate-50/60 transition-colors duration-200
                    ${i % 2 === 0 ? "border-r border-slate-100" : ""}
                    ${i < 2 ? "border-b border-slate-100" : ""}
                    sm:border-b-0
                    ${i < 3 ? "sm:border-r sm:border-slate-100" : "sm:border-r-0"}
                  `}
                >
                  <span className="font-serif font-extrabold text-[#C91D1D] leading-none"
                    style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}>
                    {s.value}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 text-center leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Floating info tags on top of the bg image (Desktop only) */}
          <div className="hidden lg:flex items-center justify-center relative">

            {/* Floating Course/Info Tags overlaid on image */}
            {[
              { top: "12%", left: "-8%",  val: "B.Sc. Physiotherapy", icon: "🏥", delay: 0.5 },
              { top: "30%", right: "-5%", val: "X-Ray Technology",    icon: "📡", delay: 0.65 },
              { top: "50%", left: "-12%", val: "Medical Lab Tech",    icon: "🔬", delay: 0.8 },
              { top: "68%", right: "-8%", val: "OT Technology",       icon: "🩺", delay: 0.95 },
              { top: "85%", left: "5%",   val: "Community Medicine",  icon: "💊", delay: 1.1 },
            ].map((tag) => (
              <motion.div
                key={tag.val}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tag.delay, duration: 0.5 }}
                className="absolute bg-white/95 backdrop-blur-md border border-slate-100 shadow-lg rounded-full px-5 py-2.5 flex items-center gap-2.5 z-20"
                style={{ top: tag.top, left: tag.left, right: (tag as any).right }}
              >
                <span className="text-lg" aria-hidden="true">{tag.icon}</span>
                <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{tag.val}</span>
              </motion.div>
            ))}

            {/* Bottom-left stats badge on the image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-6"
            >
              <div className="text-center">
                <div className="font-serif font-extrabold text-[#C91D1D] text-2xl leading-none">1000+</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-1">Students</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <div className="font-serif font-extrabold text-[#D4A017] text-2xl leading-none">20+</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-1">Courses</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <div className="font-serif font-extrabold text-[#C91D1D] text-2xl leading-none">100%</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-1">Dedicated</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
