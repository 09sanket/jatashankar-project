"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, GraduationCap, ArrowRight } from "lucide-react";
import { slideUp, staggerContainer } from "../animations/transitions";
import { getGuides, GuideMember } from "../services/guide.service";

const GuideCard = ({ guide }: { guide: GuideMember }) => (
  <motion.div
    variants={slideUp}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="h-full group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-slate-200 transition-all duration-300"
  >
    {/* Guide Portrait - Uniform Square */}
    <div className="relative w-full flex justify-center mb-4 mt-2">
      <div className="relative z-10 w-44 h-44 overflow-hidden rounded-2xl border-4 border-white dark:border-slate-800 shadow-md">
        {guide.imageUrl ? (
          <Image
            src={guide.imageUrl}
            alt={guide.name}
            fill
            sizes="176px"
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600">
            <Users className="w-16 h-16" />
          </div>
        )}
      </div>
    </div>

    {/* Typography details */}
    <div className="space-y-2 w-full flex flex-col items-center flex-1">
      <h4 className="font-serif font-bold text-lg text-[#9B111E] dark:text-red-400 leading-tight">
        {guide.name}
      </h4>
      <p className="text-xs text-[#D4A017] dark:text-amber-500 font-bold uppercase tracking-wider">
        {guide.designation}
      </p>
      {guide.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
          {guide.description}
        </p>
      )}
    </div>
  </motion.div>
);

export default function Guides() {
  const [guideList, setGuideList] = useState<GuideMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGuides() {
      let data: GuideMember[] = [];
      try {
        data = await getGuides();
      } catch (err) {
        console.warn("Firestore error, using fallback data:", err);
      } finally {
        if (data.length === 0) {
          // Fallback to dummy data if database is empty or failed
          setGuideList([
            {
              id: "dummy-1",
              name: "Dr. Vikram Singh",
              designation: "Chief Medical Advisor",
              description: "With over 20 years of experience in healthcare administration, Dr. Singh has been instrumental in shaping our clinical training programs and establishing partnerships with top hospitals across the region.",
              imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
              publicId: "dummy-1-pub",
              createdAt: new Date(),
            },
            {
              id: "dummy-2",
              name: "Prof. Anjali Sharma",
              designation: "Head of Academic Affairs",
              description: "Prof. Sharma leads our curriculum development initiatives, ensuring our paramedical and nursing programs meet the highest international standards of medical education.",
              imageUrl: "https://images.unsplash.com/photo-1594824436998-d50d2bc88d68?auto=format&fit=crop&q=80&w=400&h=400",
              publicId: "dummy-2-pub",
              createdAt: new Date(),
            },
            {
              id: "dummy-3",
              name: "Mr. Rajeev Verma",
              designation: "Operations Head",
              description: "Ensuring seamless institutional operations and fostering a collaborative learning environment.",
              imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
              publicId: "",
              createdAt: new Date(),
            },
            {
              id: "dummy-4",
              name: "Dr. Neha Kapoor",
              designation: "Clinical Coordinator",
              description: "Bridging the gap between theoretical knowledge and practical clinical application.",
              imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop",
              publicId: "",
              createdAt: new Date(),
            }
          ]);
        } else {
          setGuideList(data);
        }
        setIsLoading(false);
      }
    }
    loadGuides();
  }, []);

  return (
    <section 
      id="guides" 
      className="relative py-20 lg:py-24 overflow-hidden bg-white text-slate-800 border-b border-brand-cream-350 dark:bg-slate-950 dark:border-slate-800"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-12 lg:space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block relative">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9B111E] uppercase block">
              Leadership
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#D4A017] rounded-full" />
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Our Guiders <span className="text-slate-400 dark:text-slate-600 font-normal">/ हमारे मार्गदर्शक</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Visionary leaders guiding our institution towards excellence in medical education and healthcare.
          </p>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[1, 2, 3, 4].map((n) => (
                  <div 
                    key={n}
                    className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center space-y-5 animate-pulse"
                  >
                    <div className="w-44 h-44 rounded-2xl bg-slate-150 dark:bg-slate-800" />
                    <div className="space-y-2 w-full flex flex-col items-center">
                      <div className="w-3/5 h-5 bg-slate-150 dark:bg-slate-800 rounded" />
                      <div className="w-2/5 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : guideList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full py-16 px-4 text-center rounded-[2rem] border border-dashed border-brand-cream-350 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#9B111E]/5 flex items-center justify-center text-[#9B111E]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-extrabold text-slate-800 dark:text-slate-200">No Guides Data Available</h4>
                  <p className="text-xs text-slate-400 font-semibold max-w-sm">
                    Guide profiles are being configured. Check back soon.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer(0.08, 0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {guideList.map((guide, idx) => (
                  <GuideCard key={guide.id || idx} guide={guide} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
