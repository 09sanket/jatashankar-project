"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium FacilitiesSkeleton matching Facilities.tsx layout and spacing exactly.
 */
export default function FacilitiesSkeleton() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-950 text-slate-800 border-b border-slate-100 dark:border-slate-900">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#FFF8E7]/50 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#D4A017]/4 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-10">
        
        {/* 1. TOP CENTER CONTENT */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 flex flex-col items-center">
          <SkeletonBase className="h-7 w-28 rounded-full" />
          <SkeletonBase className="h-10 w-11/12 sm:w-4/5 rounded-xl" />
          <SkeletonBase className="h-6 w-9/12 sm:w-3/5 rounded-lg" />
          <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full mt-4" />
          <SkeletonBase className="h-4 w-10/12 sm:w-4/5 mt-4" variant="text" />
        </div>

        {/* 2. MIDDLE SPLIT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-start mb-20">
          
          {/* Left Column: Telemetry mock */}
          <div className="lg:col-span-6 w-full relative min-h-[460px] flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full bg-[#FFF8E7] blur-2xl -z-10 opacity-70" />
            
            <div className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl p-5 overflow-hidden flex flex-col justify-between space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                <SkeletonBase className="h-4 w-32" variant="text" />
                <SkeletonBase className="h-5 w-20 rounded-full" />
              </div>

              {/* Heart rate scan telemetry block */}
              <div className="rounded-2xl p-4 bg-slate-950 h-32 flex flex-col justify-between">
                <SkeletonBase className="h-4 w-28 rounded bg-slate-800" variant="text" />
                <SkeletonBase className="h-12 w-full rounded-lg bg-slate-900/50" />
                <div className="flex justify-between">
                  <div />
                  <SkeletonBase className="h-5 w-16 rounded bg-slate-800" />
                </div>
              </div>

              {/* Progress bar mock */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <SkeletonBase className="h-4.5 w-36" variant="text" />
                  <SkeletonBase className="h-4 w-8" variant="text" />
                </div>
                <SkeletonBase className="h-2.5 w-full rounded-full" />
              </div>

              {/* Accreditations mock */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3">
                <SkeletonBase className="h-4 w-24" variant="text" />
                <SkeletonBase className="h-4 w-24" variant="text" />
              </div>
            </div>

            {/* Floating items */}
            <div className="absolute -top-4 left-4 bg-white/95 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-lg flex items-center space-x-3 max-w-[170px] z-20">
              <SkeletonBase className="w-8 h-8 rounded-xl" />
              <div className="space-y-1">
                <SkeletonBase className="h-3 w-16" variant="text" />
                <SkeletonBase className="h-2.5 w-20" variant="text" />
              </div>
            </div>

            <div className="absolute -bottom-4 right-4 bg-white/95 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-lg flex items-center space-x-3 max-w-[170px] z-20">
              <SkeletonBase className="w-8 h-8 rounded-xl" />
              <div className="space-y-1">
                <SkeletonBase className="h-3 w-16" variant="text" />
                <SkeletonBase className="h-2.5 w-20" variant="text" />
              </div>
            </div>
          </div>

          {/* Right Column: Highlights cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col items-start space-y-3"
              >
                <SkeletonBase className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5 w-full text-left">
                  <SkeletonBase className="h-4.5 w-2/3" variant="text" />
                  <SkeletonBase className="h-3 w-11/12" variant="text" />
                  <SkeletonBase className="h-3 w-4/5" variant="text" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 3. BOTTOM FACILITIES GRID */}
        <div className="space-y-8 sm:space-y-12">
          {/* Sub Header */}
          <div className="text-center max-w-xl mx-auto space-y-2 flex flex-col items-center">
            <SkeletonBase className="h-6 w-80" variant="text" />
            <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full" />
          </div>

          {/* Grid of 8 facility cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-2xl p-5 flex flex-row items-center justify-between text-left space-x-6 w-full"
              >
                <div className="space-y-3 flex-grow">
                  <SkeletonBase className="w-10 h-10 rounded-xl" />
                  <SkeletonBase className="h-5 w-1/2" variant="text" />
                  <SkeletonBase className="h-3.5 w-11/12" variant="text" />
                </div>
                <SkeletonBase className="w-20 h-20 rounded-2xl shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. BOTTOM CTA */}
        <div className="text-center max-w-2xl mx-auto mt-20 space-y-6 flex flex-col items-center">
          <SkeletonBase className="h-5 w-96" variant="text" />
          <SkeletonBase className="h-11 w-40 rounded-full" />
        </div>

      </div>
    </section>
  );
}
