"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, FlaskConical, Stethoscope, ArrowRight, 
  GraduationCap, Briefcase, CheckCircle, HeartPulse, Scan, Star
} from "lucide-react";
import { slideUp, fadeIn } from "../animations/transitions";
import { getCourses, Course } from "../services/course.service";

// Icon mapping helper based on short name or metadata
function getCourseIcon(shortName: string): React.ReactNode {
  const norm = (shortName || "").toLowerCase();
  if (norm.includes("bpt")) return <Activity className="w-6 h-6 text-[#C91D1D]" />;
  if (norm.includes("bmlt")) return <FlaskConical className="w-6 h-6 text-[#D4A017]" />;
  if (norm.includes("dmlt")) return <CheckCircle className="w-6 h-6 text-[#C91D1D]" />;
  if (norm.includes("xrt") || norm.includes("ray") || norm.includes("bxrt")) return <Scan className="w-6 h-6 text-[#D4A017]" />;
  return <Stethoscope className="w-6 h-6 text-blue-600" />;
}

export default function CourseList() {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        // Display all courses from Firestore
        setCoursesList(data);
      } catch (err) {
        console.error("Failed to load courses from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, []);

  const highlights = [
    { text: "Experienced Faculty", icon: <GraduationCap className="w-5 h-5 text-[#D4A017]" /> },
    { text: "Modern Laboratories", icon: <FlaskConical className="w-5 h-5 text-[#C91D1D]" /> },
    { text: "Placement Assistance", icon: <Briefcase className="w-5 h-5 text-blue-600" /> },
    { text: "Practical Clinical Exposure", icon: <HeartPulse className="w-5 h-5 text-emerald-600" /> },
  ];

  // Updated grid for better spacing
  const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <section 
      id="courses" 
      className="relative py-20 lg:py-28 overflow-hidden bg-[#FFF8E7]/10 text-slate-800 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FFF8E7]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/5" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C91D1D]/3 blur-3xl pointer-events-none -z-10 dark:bg-red-950/5" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* 1. TOP SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C91D1D]/5 border border-[#C91D1D]/25 text-[#C91D1D] font-sans font-bold text-xs tracking-wider uppercase shadow-sm"
          >
            <span>Our Programs</span>
          </motion.div>

          <motion.h2
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#C91D1D] leading-none"
          >
            Empower Your Future with Professional Health-Science Programs
          </motion.h2>

          <motion.h3
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-serif font-semibold text-sm sm:text-base text-slate-500 leading-snug"
          >
            Choose high-demand healthcare programs with hands-on clinical exposure. Modern learning, secure future.
          </motion.h3>

          <div className="w-20 h-1 bg-[#D4A017] mx-auto rounded-full mt-4" />
        </div>

        {/* 2. COURSES GRID */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div 
                  key={n}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-3xl p-5 flex flex-col justify-between items-center space-y-5 animate-pulse"
                >
                  <div className="w-full h-32 bg-slate-150 dark:bg-slate-800 rounded-2xl" />
                  <div className="space-y-2 w-full flex flex-col items-center">
                    <div className="w-1/4 h-3 bg-slate-150 dark:bg-slate-800 rounded" />
                    <div className="w-3/5 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                    <div className="w-5/6 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
                  </div>
                  <div className="w-full h-10 bg-slate-150 dark:bg-slate-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : coursesList.length === 0 ? (
            /* Empty State Fallback */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-16 px-4 text-center rounded-3xl border border-dashed border-brand-cream-350 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#C91D1D]/5 flex items-center justify-center text-[#C91D1D]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-extrabold text-slate-800 dark:text-slate-200">No Courses Available</h4>
                <p className="text-xs text-slate-400 font-semibold max-w-sm">
                  Course syllabus lists are being uploaded. Check back soon for program catalogs.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={gridClass}
            >
              {coursesList.map((course, idx) => {
                return (
        <motion.div
          key={course.id || idx}
          variants={slideUp}
          className="bg-white dark:bg-slate-900 border border-brand-cream-350 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden h-full group"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          {/* Image top */}
          <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#FFF8E7] dark:bg-slate-800">
            {course.imageUrl ? (
              <Image src={course.imageUrl} alt={course.courseName} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <span className="flex h-full items-center justify-center text-4xl font-extrabold text-[#9B111E]/20 dark:text-slate-600">
                {course.shortName}
              </span>
            )}
          </div>
            
          {/* Text bottom */}
          <div className="flex flex-col p-5 sm:p-6 flex-1">
             <h4 className="text-lg font-bold text-[#9B111E] dark:text-white leading-snug mb-2">
               {course.courseName}
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
               {course.description}
             </p>
             
             {/* Admin Fields with proper dividers */}
             <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
               <div className="grid grid-cols-1 gap-2.5">
                 {course.duration && (
                   <div className="flex items-start justify-between text-sm">
                     <span className="font-bold text-slate-800 dark:text-slate-300 uppercase text-[11px] tracking-wider mt-0.5">Duration</span>
                     <span className="text-slate-600 dark:text-slate-400 font-medium text-right ml-4 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-xs">{course.duration}</span>
                   </div>
                 )}
                 {course.eligibility && (
                   <div className="flex items-start justify-between text-sm">
                     <span className="font-bold text-slate-800 dark:text-slate-300 uppercase text-[11px] tracking-wider mt-0.5">Eligibility</span>
                     <span className="text-slate-600 dark:text-slate-400 font-medium text-right ml-4 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-xs">{course.eligibility}</span>
                   </div>
                 )}
                 {course.careerScope && (
                   <div className="flex items-start justify-between text-sm">
                     <span className="font-bold text-slate-800 dark:text-slate-300 uppercase text-[11px] tracking-wider mt-0.5">Career</span>
                     <span className="text-slate-600 dark:text-slate-400 font-medium text-right ml-4 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-xs line-clamp-1" title={course.careerScope}>{course.careerScope}</span>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. BOTTOM HIGHLIGHTS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 shadow-sm rounded-full p-4 max-w-4xl mx-auto mt-16"
        >
          <div className="flex flex-wrap items-center justify-around gap-4">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                  {item.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

