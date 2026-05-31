"use client";
import { motion } from "framer-motion";

export default function LearningGrowth() {
  const headings = ["Learning", "Growth", "Best Environment", "Innovation", "Excellence"];
  return (
    <section className="py-12 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Horizontal scrolling headline slider */}
        <div className="overflow-x-auto hide-scrollbar">
          <motion.div
            className="flex space-x-8 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {headings.concat(headings).map((text, i) => (
              <h2
                key={i}
                className="whitespace-nowrap text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                {text}
              </h2>
            ))}
          </motion.div>
        </div>
        {/* Call‑to‑action button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Admission Now
          </button>
        </div>
      </div>
    </section>
  );
}
