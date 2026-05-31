"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, ArrowUpRight, ChevronRight, Megaphone 
} from "lucide-react";
import { SPRING_TRANSITION } from "../animations/transitions";
import { getAnnouncements, Announcement } from "../services/announcement.service";

export default function Announcements() {
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "admissions" | "campus">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await getAnnouncements();
        setAnnouncementsList(data);
        // Expand the first announcement by default if any exist
        if (data.length > 0) {
          setExpandedId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load announcements from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  // Filter based on Tab selection (type maps to category concept)
  const filteredAnnouncements = announcementsList.filter((item) => {
    if (activeTab === "all") return true;
    const typeNorm = (item.type || "").toLowerCase();
    if (activeTab === "admissions") {
      return typeNorm.includes("admission") || typeNorm.includes("exam");
    }
    if (activeTab === "campus") {
      return typeNorm.includes("event") || typeNorm.includes("workshop") || typeNorm.includes("holiday") || typeNorm.includes("placement");
    }
    return true;
  });

  return (
    <section 
      id="announcements" 
      className="relative py-20 lg:py-28 overflow-hidden bg-white text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-800"
    >
      {/* Background decorations */}
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#FFF8F2]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Grid layout for 2-column Bulletin board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* ==============================================
              LEFT COLUMN: Bulletin Info and Tab Controls
              ============================================== */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            
            <div className="space-y-4 text-left">
              <div className="inline-block relative">
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
                  LATEST NOTICES
                </span>
                <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-[#9B111E] rounded-full" />
              </div>

              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight pt-2">
                Information <span className="text-[#9B111E]">Bulletin</span>
              </h2>

              <div className="flex items-center space-x-2 pt-1">
                <Megaphone className="w-5 h-5 text-[#D4A017] shrink-0 animate-bounce" />
                <h3 className="font-serif font-semibold text-base sm:text-lg text-[#9B111E] tracking-wide">
                  नवीनतम घोषणाएँ एवं प्रवेश सूचनाएं
                </h3>
              </div>

              <p className="font-sans text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                जटाशंकर ग्रुप ऑफ इंस्टीट्यूशंस से जुड़ी सभी महत्वपूर्ण घोषणाएँ, शैक्षणिक कैलेंडर, छात्रवृत्ति योजनाएँ और नए लैब्स की घोषणाओं की जानकारी यहाँ प्राप्त करें।
              </p>
            </div>

            {/* Live Indicator Alert Card */}
            <div className="p-5 rounded-[1.5rem] border border-brand-cream-350 dark:border-slate-800 bg-[#FFF8F2]/60 dark:bg-slate-900 shadow-premium text-left flex items-start space-x-4">
              <div className="relative flex h-3.5 w-3.5 mt-1 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#9B111E]"></span>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Update Bulletin
                </h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                  सत्र 2026-27 के लिए पैरामेडिकल, फिजियोथेरेपी (BPT) एवं लैब टेक्नोलॉजी पाठ्यक्रमों में प्रवेश फॉर्म जमा करने की प्रक्रिया चालू है।
                </p>
              </div>
            </div>

            {/* Bulletin Tab Filter Selector */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-brand-cream-50 dark:bg-slate-900 border border-brand-cream-350 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 min-w-[90px] py-3.5 px-4 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "all"
                    ? "bg-[#9B111E] text-white shadow-sm"
                    : "text-slate-650 hover:text-[#9B111E] hover:bg-[#FFF8F2] dark:text-slate-400 dark:hover:text-[#D4A017]"
                }`}
              >
                All Notices
              </button>
              <button
                onClick={() => setActiveTab("admissions")}
                className={`flex-1 min-w-[90px] py-3.5 px-4 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "admissions"
                    ? "bg-[#9B111E] text-white shadow-sm"
                    : "text-slate-650 hover:text-[#9B111E] hover:bg-[#FFF8F2] dark:text-slate-400 dark:hover:text-[#D4A017]"
                }`}
              >
                Admissions
              </button>
              <button
                onClick={() => setActiveTab("campus")}
                className={`flex-1 min-w-[90px] py-3.5 px-4 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "campus"
                    ? "bg-[#9B111E] text-white shadow-sm"
                    : "text-slate-650 hover:text-[#9B111E] hover:bg-[#FFF8F2] dark:text-slate-400 dark:hover:text-[#D4A017]"
                }`}
              >
                Campus News
              </button>
            </div>

          </div>

          {/* ==============================================
              RIGHT COLUMN: Interactive Notices List
              ============================================== */}
          <div className="lg:col-span-7 w-full">
            <motion.div 
              layout 
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  /* Loading Skeletons */
                  [1, 2, 3].map((n) => (
                    <div 
                      key={n}
                      className="p-6 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-brand-cream-50/10 dark:bg-slate-900/10 flex flex-col space-y-4 animate-pulse"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-5 bg-slate-150 dark:bg-slate-800 rounded" />
                        <div className="w-24 h-4 bg-slate-100 dark:bg-slate-850 rounded" />
                      </div>
                      <div className="w-3/4 h-5 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-full h-4 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                  ))
                ) : filteredAnnouncements.length === 0 ? (
                  /* Empty notices fallback */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-16 px-4 text-center rounded-[1.8rem] border border-dashed border-brand-cream-350 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col items-center justify-center space-y-4 text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#9B111E]/5 flex items-center justify-center text-[#9B111E]">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-extrabold text-slate-800 dark:text-slate-200">No Announcements Available</h4>
                      <p className="text-xs text-slate-400 font-semibold max-w-sm">
                        There are no announcements posted under this filter category at this time.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  filteredAnnouncements.map((item) => {
                    const isExpanded = expandedId === item.id;
                    
                    // Setting color tokens based on type and importance tag
                    let tagStyles = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
                    if (item.important) {
                      tagStyles = "bg-red-50 text-[#9B111E] dark:bg-red-950/20 dark:text-[#EF4444] border-[#9B111E]/10";
                    } else if (item.type === "Admission" || item.type === "Placement") {
                      tagStyles = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-500/10";
                    } else if (item.type === "Event" || item.type === "Workshop") {
                      tagStyles = "bg-amber-50 text-[#D4A017] dark:bg-amber-950/20 dark:text-[#F1DD4D] border-[#D4A017]/10";
                    }

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={SPRING_TRANSITION}
                        key={item.id}
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className={`group p-6 rounded-[1.8rem] border text-left cursor-pointer transition-all duration-300 ${
                          isExpanded 
                            ? "bg-white border-[#D4A017]/40 shadow-premium dark:bg-slate-900" 
                            : "bg-brand-cream-50/20 hover:bg-white border-brand-cream-350 hover:border-[#D4A017]/25 dark:bg-slate-900/30 dark:border-slate-800 dark:hover:bg-slate-900"
                        }`}
                      >
                        {/* Notice Header info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Tags & Date info */}
                          <div className="flex items-center space-x-2.5">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${tagStyles}`}>
                              {item.important ? "URGENT NOTICE" : item.type}
                            </span>
                            
                            <div className="flex items-center text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              <span>{item.date}</span>
                            </div>
                          </div>

                          {/* Dropdown Indicator Icon */}
                          <div className={`w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-450 group-hover:text-[#9B111E] transition-all duration-300 ${isExpanded ? "rotate-90 bg-[#FFF8F2]" : ""}`}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Headings */}
                        <div className="mt-3.5 space-y-1">
                          <h4 className="font-serif font-extrabold text-base sm:text-lg text-slate-950 dark:text-white transition-colors group-hover:text-[#9B111E]">
                            {item.title}
                          </h4>
                        </div>

                        {/* Expandable Notice details */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                  {item.description}
                                </p>

                                {/* Apply button redirecting to admissions */}
                                <div className="pt-2 flex flex-wrap gap-3">
                                  <a 
                                    href="#enquiry" 
                                    onClick={(e) => e.stopPropagation()} // Prevents collapsing notice board click bubble
                                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#9B111E] hover:bg-[#b01717] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
                                  >
                                    <span>Apply / Online Enquiry</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}

