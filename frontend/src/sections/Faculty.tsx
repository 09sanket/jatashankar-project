"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Award, Stethoscope, Users, HeartPulse, FlaskConical, Scan, Brain, Sparkles, BookOpen, Clock
} from "lucide-react";
import { slideUp, staggerContainer } from "../animations/transitions";
import { getFaculty, FacultyMember } from "../services/faculty.service";

// Department icon resolver helper to keep semantic design
function getDepartmentIcon(dept: string): React.ReactNode {
  const norm = (dept || "").toLowerCase();
  if (norm.includes("physio")) return <HeartPulse className="w-3.5 h-3.5" />;
  if (norm.includes("lab") || norm.includes("technology")) return <FlaskConical className="w-3.5 h-3.5" />;
  if (norm.includes("radio")) return <Scan className="w-3.5 h-3.5" />;
  if (norm.includes("anat")) return <Brain className="w-3.5 h-3.5" />;
  if (norm.includes("theatre") || norm.includes("ot")) return <Stethoscope className="w-3.5 h-3.5" />;
  return <Users className="w-3.5 h-3.5" />;
}

export default function Faculty() {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFaculty() {
      try {
        const data = await getFaculty();
        setFacultyList(data);
      } catch (err) {
        console.error("Failed to load faculty members from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFaculty();
  }, []);

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6 text-[#9B111E]" />,
      title: "अनुभवी फैकल्टी",
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-[#D4A017]" />,
      title: "व्यावहारिक शिक्षण",
    },
    {
      icon: <Users className="w-6 h-6 text-[#9B111E]" />,
      title: "व्यक्तिगत मार्गदर्शन",
    },
    {
      icon: <Award className="w-6 h-6 text-[#D4A017]" />,
      title: "गुणवत्तापूर्ण शिक्षा",
    }
  ];

  const stats = [
    {
      number: "25+",
      label: "अनुभवी फैकल्टी",
      icon: <GraduationCap className="w-5 h-5 text-[#9B111E]" />
    },
    {
      number: "10+",
      label: "विशेषज्ञ विभाग",
      icon: <FlaskConical className="w-5 h-5 text-[#D4A017]" />
    },
    {
      number: "5000+",
      label: "प्रशिक्षित विद्यार्थी",
      icon: <Users className="w-5 h-5 text-[#9B111E]" />
    },
    {
      number: "श्रेष्ठ शिक्षा",
      label: "हमारी पहचान",
      icon: <Award className="w-5 h-5 text-[#D4A017]" />
    }
  ];

  return (
    <section 
      id="faculty" 
      className="relative py-20 lg:py-28 overflow-hidden bg-white text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-800"
    >
      {/* Dynamic Background Decorations */}
      <div className="absolute top-12 left-6 w-96 h-96 rounded-full bg-[#FFF8F2]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-12 right-6 w-[500px] h-[500px] rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />

      {/* Decorative Vector Grid Circles */}
      <div className="absolute right-10 top-10 opacity-[0.015] bg-[radial-gradient(#9B111E_1px,transparent_1px)] [background-size:16px_16px] w-48 h-48 rounded-full pointer-events-none -z-20" />
      <div className="absolute left-10 bottom-10 opacity-[0.015] bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px] w-64 h-64 rounded-full pointer-events-none -z-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-16 lg:space-y-24">
        
        {/* ===================================================
            1. TOP SPLIT SECTION
            =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Details Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              {/* Section Label */}
              <div className="inline-block relative">
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
                  EXPERTS
                </span>
                <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-[#D4A017] rounded-full" />
              </div>

              {/* Main Heading */}
              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight pt-2">
                Our <span className="text-[#9B111E]">Medical</span> Faculty
              </h2>

              {/* Hindi Subheading with Gold Icons */}
              <div className="flex items-center space-x-2 pt-1">
                <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
                <h3 className="font-serif font-semibold text-base sm:text-lg text-[#9B111E] tracking-wide">
                  अनुभव, समर्पण और उत्कृष्टता का संगम
                </h3>
                <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
              </div>
            </div>

            {/* Paragraph Description */}
            <p className="font-sans text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              हमारे अनुभवी और समर्पित फैकल्टी सदस्य विद्यार्थियों को गुणवत्तापूर्ण शिक्षा, मार्गदर्शन और व्यावहारिक प्रशिक्षण प्रदान करने के लिए सदैव तत्पर रहते हैं।
            </p>

            {/* Feature Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-3 relative group">
                  {/* Icon Area */}
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF8F2] dark:bg-slate-900 border border-[#D4A017]/20 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  {/* Title */}
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                    {feature.title}
                  </p>
                  
                  {/* Vertical Separator Line */}
                  {idx < 3 && (
                    <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-slate-150 dark:bg-slate-800" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Area */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full">
            {/* Subtle Gradient Backglow */}
            <div className="absolute w-[95%] h-[95%] rounded-full bg-gradient-to-tr from-[#D4A017]/10 to-transparent blur-2xl -z-10" />

            {/* Asymmetrical Custom Image Container */}
            <div className="relative w-full aspect-[4/3] max-w-[460px] lg:max-w-none rounded-[3.5rem] rounded-tr-[1.5rem] rounded-bl-[1.5rem] overflow-hidden shadow-lg border border-brand-cream-350 dark:border-slate-800 bg-[#FFF8F2]">
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                alt="Jatashankar Medical Faculty Discussion"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Floating Red Gradient Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 sm:left-4 max-w-[240px] sm:max-w-[280px] p-5 sm:p-6 bg-gradient-to-br from-[#9B111E] to-[#7a0c16] rounded-3xl shadow-xl border border-white/10 text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#D4A017] mb-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-extrabold text-sm sm:text-base text-white leading-snug">
                हमारे विशेषज्ञ आपके सपनों को देंगे नई उड़ान
              </h4>
              <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#D4A017] uppercase font-bold">
                Shaping Futures, Changing Lives
              </p>
            </motion.div>
          </div>

        </div>

        {/* ===================================================
            2. FACULTY CARDS GRID
            =================================================== */}
        <div className="space-y-6">
          <div className="text-left border-l-4 border-[#9B111E] pl-4">
            <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Meet Our Senior Instructors
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Active medical experts steering our department syllabus and clinical practices.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Elegant Skeleton Loader Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((n) => (
                  <div 
                    key={n}
                    className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center space-y-5 animate-pulse"
                  >
                    <div className="w-28 h-28 rounded-full bg-slate-150 dark:bg-slate-800" />
                    <div className="space-y-2 w-full flex flex-col items-center">
                      <div className="w-3/5 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-2/5 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                    <div className="w-1/2 h-7 bg-slate-150 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            ) : facultyList.length === 0 ? (
              /* Premium Empty State Fallback */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full py-16 px-4 text-center rounded-[2rem] border border-dashed border-brand-cream-350 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#9B111E]/5 flex items-center justify-center text-[#9B111E]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-extrabold text-slate-800 dark:text-slate-200">No Faculty Data Available</h4>
                  <p className="text-xs text-slate-400 font-semibold max-w-sm">
                    Faculty rosters are being configured. Check back soon for list updates.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer(0.08, 0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {facultyList.map((fac, idx) => (
                  <motion.div
                    key={fac.id || idx}
                    variants={slideUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-slate-200 transition-all duration-300"
                  >
                    {/* Faculty Portrait exactly like reference */}
                    <div className="relative w-full h-48 flex justify-center items-end mb-2">
                      {/* Background Decorative Circle (light peach/pink) */}
                      <div className="absolute top-4 w-40 h-40 rounded-full bg-[#FFF0E6] dark:bg-slate-800 transition-transform duration-500 group-hover:scale-105"></div>
                      
                      {/* Foreground Image - Cutout style */}
                      <div className="relative z-10 w-44 h-48 overflow-hidden rounded-b-3xl">
                        {fac.imageUrl ? (
                          <Image
                            src={fac.imageUrl}
                            alt={fac.name}
                            fill
                            sizes="176px"
                            className="object-contain object-bottom"
                          />
                        ) : (
                          <div className="w-full h-full flex items-end justify-center pb-4 text-slate-300 dark:text-slate-600">
                            <Users className="w-16 h-16" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Typography details */}
                    <div className="space-y-1 w-full flex flex-col items-center flex-1">
                      <h4 className="font-serif font-bold text-lg text-[#9B111E] dark:text-red-400">
                        {fac.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {fac.designation}
                      </p>
                    </div>

                    {/* Department Badge at the bottom */}
                    <div className="w-full mt-auto pt-4 flex justify-center">
                      <div className="inline-flex items-center space-x-2">
                        {/* Icon Circle */}
                        <div className="w-7 h-7 rounded-full bg-[#9B111E] dark:bg-red-900/50 flex items-center justify-center text-white shrink-0 shadow-sm">
                          {getDepartmentIcon(fac.department)}
                        </div>
                        {/* Text */}
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          {fac.department}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===================================================
            3. BOTTOM STATS STRIP
            =================================================== */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full p-6 sm:p-8 rounded-[2rem] sm:rounded-full bg-white dark:bg-slate-900 border border-brand-cream-350 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 xl:px-12"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center space-x-4 text-left w-full md:w-auto justify-start md:justify-center relative group">
              {/* Circular Icon Wrap */}
              <div className="w-12 h-12 rounded-full bg-[#FFF8F2] dark:bg-slate-950 border border-[#D4A017]/25 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                {stat.icon}
              </div>
              {/* Number and Label */}
              <div className="space-y-0.5">
                <h4 className="font-serif font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl leading-none">
                  {stat.number}
                </h4>
                <p className="text-xs sm:text-sm font-serif font-semibold text-[#9B111E] tracking-wide leading-tight mt-0.5">
                  {stat.label}
                </p>
              </div>
              
              {/* Separator dots/lines for desktop layout */}
              {idx < 3 && (
                <div className="hidden lg:block absolute -right-6 xl:-right-10 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D4A017]/35" />
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
