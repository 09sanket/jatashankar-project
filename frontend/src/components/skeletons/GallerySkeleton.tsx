"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium GallerySkeleton mirroring Gallery.tsx grid, tabs, and layout.
 */
export default function GallerySkeleton() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-950 text-slate-800 border-b border-slate-100 dark:border-slate-900">
      {/* Background soft cream gradient and accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FFF8E7]/50 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-[#C91D1D]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-10">
        
        {/* Centered Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 flex flex-col items-center">
          <SkeletonBase className="h-7 w-28 rounded-full" />
          <SkeletonBase className="h-10 w-11/12 sm:w-4/5 rounded-xl" />
          <SkeletonBase className="h-6 w-9/12 sm:w-3/5 rounded-lg" />
          <SkeletonBase className="h-4 w-10/12 sm:w-4/5 mt-4" variant="text" />
          <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full mt-4" />
        </div>

        {/* Category Tabs Skeleton */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-brand-cream-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-full shadow-sm max-w-max">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBase key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[350px]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="relative h-[280px] overflow-hidden rounded-3xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-sm flex flex-col justify-between p-5"
            >
              {/* Main Image Shimmer Backdrop */}
              <SkeletonBase className="absolute inset-0 rounded-3xl z-0" />
              
              {/* Top Badge Overlay */}
              <div className="relative z-10 self-start">
                <SkeletonBase className="h-5 w-24 rounded-full bg-white/30 dark:bg-slate-850/50" />
              </div>

              {/* Bottom Details Overlay */}
              <div className="relative z-10 self-end w-full space-y-2 text-left">
                <SkeletonBase className="h-5 w-3/4 rounded bg-white/30 dark:bg-slate-850/50" variant="text" />
                <SkeletonBase className="h-3.5 w-11/12 rounded bg-white/20 dark:bg-slate-900/40" variant="text" />
                <SkeletonBase className="h-3.5 w-4/5 rounded bg-white/20 dark:bg-slate-900/40" variant="text" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Area */}
        <div className="mt-16 text-center space-y-6 flex flex-col items-center">
          <SkeletonBase className="h-4 w-80" variant="text" />
          <SkeletonBase className="h-11 w-44 rounded-full" />
        </div>

      </div>
    </section>
  );
}
