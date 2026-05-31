"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium TestimonialsSkeleton mirroring Testimonials.tsx layout and styling exactly.
 */
export default function TestimonialsSkeleton() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-brand-cream-50/30 dark:bg-slate-950 text-slate-800 border-b border-brand-cream-350 dark:border-slate-855">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#FFF8F2] blur-3xl pointer-events-none -z-10 dark:bg-amber-955/5" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-955/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10 w-full space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
          <SkeletonBase className="h-4 w-28 rounded-full" />
          <SkeletonBase className="h-12 w-11/12 sm:w-4/5 rounded-xl" />
          <SkeletonBase className="h-6 w-9/12 sm:w-3/5 rounded-lg" />
          <SkeletonBase className="h-4 w-full" variant="text" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative p-6 sm:p-8 rounded-[2rem] border border-brand-cream-350 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex flex-col justify-between space-y-6 text-left"
            >
              {/* Rating & badge */}
              <div className="flex justify-between items-center w-full">
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-6 w-20 rounded-full" />
              </div>

              {/* Review content */}
              <div className="space-y-3">
                <SkeletonBase className="h-3.5 w-full" variant="text" />
                <SkeletonBase className="h-3.5 w-11/12" variant="text" />
                <SkeletonBase className="h-3.5 w-4/5" variant="text" />
              </div>

              {/* Bottom profile row */}
              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <SkeletonBase className="w-12 h-12 rounded-full" variant="circle" />
                <div className="space-y-2 flex-grow">
                  <SkeletonBase className="h-4 w-24" variant="text" />
                  <SkeletonBase className="h-3 w-32" variant="text" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Callout Banner */}
        <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-r from-red-800 to-red-950 text-white text-left relative overflow-hidden shadow-premium border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 flex-grow">
            <SkeletonBase className="h-4.5 w-48 rounded-full bg-white/20" />
            <SkeletonBase className="h-6 w-4/5 rounded bg-white/20" variant="text" />
            <SkeletonBase className="h-4 w-11/12 rounded bg-white/10" variant="text" />
          </div>
          <SkeletonBase className="h-11 w-48 rounded-full shrink-0 bg-white/20" />
        </div>

      </div>
    </section>
  );
}
