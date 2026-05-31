"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium CoursesSkeleton mirroring CourseList.tsx layout perfectly.
 */
export default function CoursesSkeleton() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#FFF8E7]/10 dark:bg-slate-950 text-slate-800 border-b border-slate-100 dark:border-slate-900">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FFF8E7]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/5" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C91D1D]/3 blur-3xl pointer-events-none -z-10 dark:bg-red-950/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-10">
        
        {/* 1. TOP SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 flex flex-col items-center">
          <SkeletonBase className="h-7 w-32 rounded-full" />
          <SkeletonBase className="h-10 w-11/12 sm:w-4/5 rounded-xl" />
          <SkeletonBase className="h-6 w-9/12 sm:w-3/5 rounded-lg" />
          <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full mt-4" />
        </div>

        {/* 2. COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-3xl p-5 flex flex-col justify-between items-center text-center space-y-5"
            >
              <div className="w-full space-y-4 flex flex-col items-center">
                {/* Banner Area */}
                <div className="w-full h-32 rounded-2xl relative bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                  <SkeletonBase className="absolute inset-0 rounded-2xl" />
                  
                  {/* Overlapping Floating Course Icon */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-md z-20">
                    <SkeletonBase className="w-7 h-7 rounded-lg" />
                  </div>
                </div>

                {/* Typography details */}
                <div className="space-y-2 pt-4 flex flex-col items-center w-full">
                  <SkeletonBase className="h-4 w-16" variant="text" />
                  <SkeletonBase className="h-6 w-3/5" variant="text" />
                </div>

                {/* Description */}
                <div className="space-y-2 py-1 w-full flex flex-col items-center">
                  <SkeletonBase className="h-3 w-5/6" variant="text" />
                  <SkeletonBase className="h-3 w-4/5" variant="text" />
                </div>

                {/* Pills badges */}
                <div className="flex flex-wrap gap-2 justify-center pt-1 w-full">
                  <SkeletonBase className="h-6 w-20 rounded-full" />
                  <SkeletonBase className="h-6 w-24 rounded-full" />
                  <SkeletonBase className="h-6 w-28 rounded-full" />
                </div>
              </div>

              {/* Bottom footer in card */}
              <div className="pt-5 w-full border-t border-slate-50 dark:border-slate-800 mt-5 flex justify-between items-center">
                <SkeletonBase className="h-3.5 w-24" variant="text" />
                <SkeletonBase className="h-4 w-16" variant="text" />
              </div>
            </div>
          ))}
        </div>

        {/* 3. BOTTOM HIGHLIGHTS STRIP */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-full p-4 max-w-4xl mx-auto mt-16">
          <div className="flex flex-wrap items-center justify-around gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-2.5">
                <SkeletonBase className="w-8 h-8 rounded-full" />
                <SkeletonBase className="h-4 w-28" variant="text" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
