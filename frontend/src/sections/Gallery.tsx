"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, ArrowRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { slideUp } from "../animations/transitions";
import { getGalleryItems, GalleryItem } from "../services/gallery.service";

// These EXACTLY match the categories in admin panel → gallery.schema.ts
const CATEGORIES = [
  { id: "Campus",            label: "Campus",           hindiLabel: "कैंपस" },
  { id: "Laboratories",      label: "Laboratories",     hindiLabel: "प्रयोगशालाएं" },
  { id: "Clinical Training", label: "Clinical Training",hindiLabel: "क्लिनिकल" },
  { id: "Student Activities",label: "Students",         hindiLabel: "विद्यार्थी" },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("Campus");
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all gallery items from Firestore once
  useEffect(() => {
    getGalleryItems()
      .then(setAllItems)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Filter locally by active tab
  const filteredItems = allItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="gallery"
      className="relative py-20 lg:py-28 overflow-hidden bg-white text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-800"
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FFF8E7]/50 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-[#C91D1D]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#C91D1D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C91D1D]/5 border border-[#C91D1D]/15 text-[#C91D1D] font-sans font-bold text-xs tracking-wider uppercase shadow-sm"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C91D1D]" />
            <span>Gallery</span>
          </motion.div>

          <motion.h2
            variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white"
          >
            Campus Life & <span className="text-[#C91D1D]">Practical Learning</span>
          </motion.h2>

          <motion.h3
            variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-serif font-semibold text-[#D4A017] text-sm sm:text-base leading-snug"
          >
            हर अनुभव सीखने और सफलता की नई कहानी बनाता है
          </motion.h3>

          <div className="w-20 h-1 bg-[#D4A017] mx-auto rounded-full mt-4" />
        </div>

        {/* Category Tabs — horizontal scrollable on mobile */}
        <div
          className="flex justify-start sm:justify-center mb-12 overflow-x-auto pb-4 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex flex-nowrap items-center gap-2 p-2 bg-brand-cream-50 dark:bg-slate-900 border border-brand-cream-350 dark:border-slate-800 rounded-full shadow-sm min-w-max mx-auto sm:mx-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-8 sm:px-12 py-3 rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-[#C91D1D] dark:hover:text-[#D4A017]"
                  }`}
                >
                  <span className="relative z-10 flex flex-col items-center">
                    <span>{cat.label}</span>
                    <span className="text-[10px] sm:text-xs opacity-90 normal-case font-medium mt-0.5">{cat.hindiLabel}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C91D1D] to-[#b01717] shadow-lg shadow-[#C91D1D]/30"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="min-h-[350px]">
          {isLoading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-[320px] rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C91D1D]/5 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-[#C91D1D]/40" />
              </div>
              <h4 className="font-serif font-bold text-slate-700 dark:text-slate-300">No Images Yet</h4>
              <p className="text-sm text-slate-400 max-w-xs">
                Admin panel se <strong>{activeCategory}</strong> category me images add karein — yahan automatically dikhai dengi.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="group relative h-[320px] overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image */}
                    <div className="absolute inset-0 w-full h-full z-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 transition-opacity duration-500 opacity-90 group-hover:opacity-100 z-10" />
                    </div>

                    {/* Top badge */}
                    <div className="relative z-20 p-5 self-end">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <MapPin className="w-3 h-3 text-[#D4A017] shrink-0" />
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Bottom text */}
                    <div className="relative z-20 p-6 self-end w-full text-left space-y-2">
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight leading-snug drop-shadow-md group-hover:text-[#D4A017] transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed drop-shadow-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center space-y-6"
        >
          <p className="font-sans text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 max-w-xl mx-auto uppercase tracking-wider leading-relaxed">
            हमारे कैंपस और प्रैक्टिकल लर्निंग वातावरण की और झलकियां देखें
          </p>
          <a
            href="#enquiry"
            className="inline-flex items-center space-x-2.5 px-8 py-3.5 bg-[#C91D1D] hover:bg-[#b01717] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <span>Explore Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
