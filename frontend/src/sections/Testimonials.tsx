"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Quote, GraduationCap, HeartPulse, FlaskConical, Scan, Award, Sparkles, Users 
} from "lucide-react";
import { slideUp, staggerContainer } from "../animations/transitions";
import { getTestimonials, Testimonial } from "../services/testimonial.service";

// Department/Course icon resolver helper to keep semantic design
function getCourseIcon(courseName: string): React.ReactNode {
  const norm = (courseName || "").toLowerCase();
  if (norm.includes("physio") || norm.includes("bpt")) return <HeartPulse className="w-3.5 h-3.5" />;
  if (norm.includes("lab") || norm.includes("technology") || norm.includes("bmlt") || norm.includes("dmlt")) return <FlaskConical className="w-3.5 h-3.5" />;
  if (norm.includes("x-ray") || norm.includes("radio") || norm.includes("bxrt")) return <Scan className="w-3.5 h-3.5" />;
  return <Award className="w-3.5 h-3.5" />;
}

export default function Testimonials() {
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        setTestimonialsList(data);
      } catch (err) {
        console.error("Failed to load testimonials from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section 
      id="testimonials" 
      className="relative py-20 lg:py-28 overflow-hidden bg-brand-cream-50/30 text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-855"
    >
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#FFF8F2] blur-3xl pointer-events-none -z-10 dark:bg-amber-955/5" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-955/5" />

      {/* Decorative Dots Pattern */}
      <div className="absolute left-6 top-10 opacity-[0.015] bg-[radial-gradient(#9B111E_1px,transparent_1px)] [background-size:16px_16px] w-48 h-48 rounded-full pointer-events-none -z-20" />
      <div className="absolute right-6 bottom-10 opacity-[0.015] bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px] w-48 h-48 rounded-full pointer-events-none -z-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block relative">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
              STUDENT STORIES
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#9B111E] rounded-full" />
          </div>

          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight pt-2">
            What Our <span className="text-[#9B111E]">Students</span> Say
          </h2>

          <div className="flex items-center justify-center space-x-2 pt-1">
            <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
            <h3 className="font-serif font-semibold text-base sm:text-lg text-[#9B111E] tracking-wide">
              हमारे विद्यार्थियों के वास्तविक अनुभव एवं सफलता की कहानियाँ
            </h3>
            <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
          </div>

          <p className="font-sans text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            जानिए उन छात्रों से जिन्होंने जटाशंकर ग्रुप ऑफ इंस्टीट्यूशंस में अपनी स्वास्थ्य सेवा शिक्षा पूरी की और विभिन्न प्रतिष्ठित चिकित्सा संस्थानों में एक नई शुरुआत की।
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {[1, 2].map((n) => (
                <div 
                  key={n}
                  className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col justify-between space-y-5 animate-pulse"
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="w-24 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                    <div className="w-16 h-5 bg-slate-100 dark:bg-slate-850 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3.5 bg-slate-150 dark:bg-slate-800 rounded" />
                    <div className="w-5/6 h-3.5 bg-slate-100 dark:bg-slate-850 rounded" />
                  </div>
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-slate-150 dark:bg-slate-800" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-1/3 h-4 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-2/5 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonialsList.length === 0 ? (
            /* Empty State Fallback */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-16 px-4 text-center rounded-[2rem] border border-dashed border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#9B111E]/5 flex items-center justify-center text-[#9B111E]">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-extrabold text-slate-800 dark:text-slate-200">No Testimonials Available</h4>
                <p className="text-xs text-slate-400 font-semibold max-w-sm">
                  Student reviews are currently being registered. Check back soon for student stories.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer(0.08, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
            >
              {testimonialsList.map((test, idx) => (
                <motion.div
                  key={test.id || idx}
                  variants={slideUp}
                  whileHover={{ y: -5 }}
                  className="h-full group relative p-6 sm:p-8 rounded-[2rem] border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium hover:shadow-lg hover:border-[#D4A017]/30 transition-all duration-300 flex flex-col justify-between text-left"
                >
                  {/* Top Quote Mark Icon decorative */}
                  <div className="absolute right-6 top-6 text-[#9B111E]/10 dark:text-[#D4A017]/10 pointer-events-none group-hover:scale-105 transition-transform duration-300">
                    <Quote className="w-14 h-14" />
                  </div>

                  <div className="space-y-6">
                    {/* Rating & Icons */}
                    <div className="flex items-center justify-between">
                      {/* Rating Stars */}
                      <div className="flex items-center space-x-0.5">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-4.5 h-4.5 fill-[#D4A017] text-[#D4A017]" />
                        ))}
                      </div>

                      {/* Program Badges */}
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFF8F2] dark:bg-slate-950 text-[#9B111E] dark:text-[#D4A017] text-[10px] font-bold uppercase tracking-wider border border-[#9B111E]/10 dark:border-[#D4A017]/10">
                        <span className="shrink-0">{getCourseIcon(test.course)}</span>
                        <span>{test.course}</span>
                      </span>
                    </div>

                    {/* Review Text Block */}
                    <div className="space-y-3.5">
                      <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        &ldquo;{test.review}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Bottom Student details */}
                  <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-cream-350 dark:border-slate-800 shrink-0 shadow-inner bg-slate-50">
                      {test.imageUrl ? (
                        <Image
                          src={test.imageUrl}
                          alt={test.studentName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                        {test.studentName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                        <span className="text-[#9B111E] dark:text-[#D4A017]">
                          {test.course}
                        </span>
                        {test.designation && (
                          <>
                            <span className="text-slate-400 dark:text-slate-550">•</span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {test.designation}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Institutional Callout */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-r from-[#9B111E] to-[#7a0c16] text-white text-left relative overflow-hidden shadow-premium border border-white/10"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-[#D4A017]" />
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#D4A017] uppercase font-bold">
                  YOUR FUTURE IN MEDICAL HEALTHCARE
                </span>
              </div>
              <h4 className="font-serif font-extrabold text-base sm:text-xl lg:text-2xl leading-snug">
                क्या आप भी चिकित्सा सेवा के क्षेत्र में एक सफल करियर बनाना चाहते हैं?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-sans max-w-2xl font-medium">
                जटाशंकर ग्रुप ऑफ इंस्टीट्यूशंस आपको विश्वस्तरीय शिक्षा, अनुभवी डॉक्टरों का मार्गदर्शन और 100% व्यावहारिक प्रशिक्षण प्रदान करता है। आज ही प्रवेश संबंधी परामर्श सत्र बुक करें।
              </p>
            </div>
            <div className="shrink-0 flex items-center">
              <a 
                href="#enquiry" 
                className="inline-flex items-center justify-center px-6 py-3.5 btn-academic-gold text-xs uppercase tracking-wider text-white shadow-md hover:shadow-lg w-full md:w-auto"
              >
                <span>काउंसलिंग सत्र बुक करें</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

