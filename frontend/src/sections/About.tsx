"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users, BookOpen, Calendar, HeartPulse, Target, Eye, Heart } from "lucide-react";
import { slideUp, fadeIn } from "../animations/transitions";

export default function About() {
  const stats = [
    { count: "1000+", label: "छात्र",            icon: <Users      className="w-6 h-6 text-[#C91D1D]" /> },
    { count: "20+",   label: "कोर्सेज",          icon: <BookOpen   className="w-6 h-6 text-[#C91D1D]" /> },
    { count: "5+",    label: "वर्षों का अनुभव",   icon: <Calendar   className="w-6 h-6 text-[#C91D1D]" /> },
    { count: "100%",  label: "समर्पण",            icon: <HeartPulse className="w-6 h-6 text-[#C91D1D]" /> },
  ];

  const pillars = [
    {
      icon: <Target className="w-5 h-5 text-[#C91D1D]" />,
      title: "हमारा मिशन",
      desc:  "गुणवत्तापूर्ण शिक्षा, नैतिक मूल्यों और आधुनिक प्रशिक्षण के माध्यम से उत्कृष्ट स्वास्थ्य पेशेवर तैयार करना।",
    },
    {
      icon: <Eye className="w-5 h-5 text-[#C91D1D]" />,
      title: "हमारी दृष्टि",
      desc:  "स्वास्थ्य शिक्षा के क्षेत्र में एक अग्रणी संस्थान बनकर समाज में सकासात्मक परिवर्तन लाना।",
    },
    {
      icon: <Heart className="w-5 h-5 text-[#C91D1D]" />,
      title: "हमारे मूल्य",
      desc:  "ईमानदारी, समर्पण, करुणा, गुणवता और समाज सेवा के प्रति प्रतिबद्धता।",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-16 lg:py-20 bg-white overflow-hidden border-t border-slate-100"
    >
      {/* Faint dot pattern top-right */}
      <div className="absolute top-8 right-8 opacity-[0.06] pointer-events-none hidden xl:block">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="2.5" fill="#C91D1D" />
            ))
          )}
        </svg>
      </div>

      {/* Gold wave bottom-left accent */}
      <div className="absolute bottom-0 left-0 w-48 h-12 pointer-events-none opacity-60">
        <svg viewBox="0 0 192 48" className="w-full h-full" fill="none">
          <path d="M0 48 C48 20, 96 40, 192 10 L192 48 Z" fill="#D4A017" fillOpacity="0.15" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* Label */}
            <motion.div
              variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C91D1D]">
                About Us
              </span>
              <div className="mt-1.5 w-8 h-[2px] bg-[#C91D1D]" />
            </motion.div>

            {/* Main Hindi heading */}
            <motion.h2
              variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="font-serif font-black text-slate-900 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              हमारे बारे में
            </motion.h2>

            {/* Sub-heading */}
            <motion.p
              variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="font-serif text-slate-600 font-semibold text-base leading-snug"
            >
              स्वास्थ्य शिक्षा के क्षेत्र में उत्कृष्टता की ओर हमारी निरंतर यात्रा
            </motion.p>

            {/* Description */}
            <motion.div
              variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-slate-600 leading-relaxed space-y-3"
            >
              <p>
                जटाशंकर ग्रुप ऑफ इंस्टीट्यूट बालाघाट की स्थापना स्वास्थ्य एवं पैरामेडिकल शिक्षा को
                उच्च गुणवत्ता के साथ प्रदान करने के उद्देश्य से की गई है। हमारा संस्थान आधुनिक
                शिक्षण पद्धति, अनुभवी फैकल्टी, अत्याधुनिक प्रयोगशालाओं और क्लिनिकल प्रशिक्षण
                पर विशेष ध्यान देता है।
              </p>
              <p>
                हमारा लक्ष्य ऐसे कुशल, संवेदनशील और नैतिक स्वास्थ्य पेशेवर तैयार करना है जो
                समाज और देश की सेवा में महत्वपूर्ण योगदान दे सकें।
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.28 }}
              className="grid grid-cols-4 gap-2 pt-2"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center gap-1.5 py-3">
                  <div className="w-10 h-10 rounded-full bg-[#C91D1D]/6 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-serif font-extrabold text-xl text-[#C91D1D] leading-none">
                    {s.count}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.34 }}
            >
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C91D1D] hover:bg-[#b01717] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>हमारे संस्थान के बारे में और जानें</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* Building image — top, rounded with subtle shadow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-md"
            >
              <Image
                src="/branding/Homemain.jpeg"
                alt="Jatashankar Institute Building"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Bottom row: circle image + pillar cards */}
            <div className="grid grid-cols-[1fr_1.6fr] gap-4 items-stretch">

              {/* Circle / lab image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}
                className="relative aspect-square overflow-hidden rounded-full shadow-md border-4 border-white ring-1 ring-slate-100 self-center"
              >
                <Image
                  src="/branding/Homemain.jpeg"
                  alt="Students in Lab"
                  fill
                  sizes="200px"
                  className="object-cover object-center"
                />
              </motion.div>

              {/* Mission / Vision / Values */}
              <motion.div
                variants={fadeIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
              >
                {pillars.map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${i < pillars.length - 1 ? "pb-3 border-b border-slate-100" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C91D1D]/8 flex items-center justify-center shrink-0 mt-0.5">
                      {p.icon}
                    </div>
                    <div>
                      <p className="font-serif font-extrabold text-xs text-slate-900 mb-0.5">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
