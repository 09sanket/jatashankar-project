"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Megaphone } from "lucide-react";
import { getAnnouncements, Announcement } from "../services/announcement.service";

export default function Announcements() {
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await getAnnouncements();
        setAnnouncementsList(data);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === announcementsList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? announcementsList.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <section id="announcements" className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-950 min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-5xl px-4">
          <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
          <div className="h-[400px] bg-slate-100 dark:bg-slate-900 rounded-3xl"></div>
        </div>
      </section>
    );
  }

  if (announcementsList.length === 0) {
    return (
      <section id="announcements" className="relative py-20 lg:py-28 bg-white dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#9B111E]/10 flex items-center justify-center mb-4">
          <Megaphone className="w-8 h-8 text-[#9B111E]" />
        </div>
        <h2 className="font-serif font-extrabold text-2xl text-slate-800 dark:text-slate-200">No Announcements</h2>
      </section>
    );
  }

  const currentItem = announcementsList[currentIndex];

  return (
    <section 
      id="announcements" 
      className="relative py-20 lg:py-28 overflow-hidden bg-white text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-800"
    >
      {/* Background decorations */}
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#FFF8F2]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block relative">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
              LATEST NOTICES
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#9B111E] rounded-full" />
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight">
            Information <span className="text-[#9B111E]">Bulletin</span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto rounded-[2rem] bg-[#FFF8F2]/40 dark:bg-slate-900/40 border border-brand-cream-350 dark:border-slate-800 shadow-premium overflow-hidden">
          
          {/* Main Carousel Area */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0"
            >
              
              {/* Left Side: Text Content */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center min-h-[400px]">
                <div className="space-y-6 max-w-xl">
                  {/* Notice Tag */}
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-[#9B111E] text-xs font-bold uppercase tracking-wider">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Latest Update</span>
                  </div>

                  <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-snug">
                    {currentItem.title}
                  </h3>
                  
                  <p className="font-sans text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {currentItem.description}
                  </p>
                </div>
              </div>

              {/* Right Side: Image Content */}
              <div className="relative h-64 sm:h-80 md:h-auto min-h-[400px] w-full bg-slate-100 dark:bg-slate-800 md:border-l border-brand-cream-350 dark:border-slate-700">
                {currentItem.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={currentItem.imageUrl} 
                    alt={currentItem.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-brand-cream-50/50 dark:bg-slate-800/50">
                    <Megaphone className="w-16 h-16 opacity-20" />
                    <span className="mt-4 font-serif font-bold uppercase tracking-widest text-xs opacity-50">Notice Information</span>
                  </div>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Overlay - Positioned in the middle of text and image */}
          {announcementsList.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 pointer-events-none flex flex-col md:flex-row items-center justify-center">
              
              {/* Mobile controls (bottom center) */}
              <div className="md:hidden flex space-x-4 pb-6 pointer-events-auto">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#9B111E] hover:bg-[#9B111E] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#9B111E] hover:bg-[#9B111E] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Desktop controls (centered between the two columns) */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col space-y-4 pointer-events-auto z-20">
                <button 
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-2xl border-4 border-[#FFF8F2] dark:border-slate-900 flex items-center justify-center text-[#9B111E] hover:scale-110 hover:bg-[#9B111E] hover:text-white transition-all duration-300 -translate-y-4"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-2xl border-4 border-[#FFF8F2] dark:border-slate-900 flex items-center justify-center text-[#9B111E] hover:scale-110 hover:bg-[#9B111E] hover:text-white transition-all duration-300 translate-y-4"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

            </div>
          )}
          
        </div>

        {/* Indicators */}
        {announcementsList.length > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {announcementsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx 
                    ? "w-8 h-2.5 bg-[#9B111E]" 
                    : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`Go to announcement ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
