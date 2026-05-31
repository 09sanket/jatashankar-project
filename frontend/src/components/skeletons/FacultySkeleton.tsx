"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium FacultySkeleton mirroring Faculty.tsx layout and components exactly.
 */
export default function FacultySkeleton() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-slate-950 text-slate-800 border-b border-slate-100 dark:border-slate-900">
      {/* Background Gradients */}
      <div className="absolute top-12 left-6 w-96 h-96 rounded-full bg-[#FFF8F2]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-12 right-6 w-[500px] h-[500px] rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-10 space-y-16 lg:space-y-24">
        
        {/* 1. TOP SPLIT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Details Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <SkeletonBase className="h-4 w-20 rounded-full" />
              <SkeletonBase className="h-10 sm:h-12 w-3/5 rounded-xl" />
              <SkeletonBase className="h-6 w-4/5 rounded-lg" />
            </div>

            <div className="space-y-2.5">
              <SkeletonBase className="h-4 w-full" variant="text" />
              <SkeletonBase className="h-4 w-11/12" variant="text" />
            </div>

            {/* Feature Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3 relative">
                  <SkeletonBase className="w-12 h-12 rounded-2xl" />
                  <SkeletonBase className="h-4 w-16" variant="text" />
                  {i < 4 && (
                    <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-slate-150 dark:bg-slate-800" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Area */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full">
            <div className="absolute w-[95%] h-[95%] rounded-full bg-gradient-to-tr from-[#D4A017]/10 to-transparent blur-2xl -z-10" />

            {/* Visual Container */}
            <div className="relative w-full aspect-[4/3] max-w-[460px] lg:max-w-none rounded-[3.5rem] rounded-tr-[1.5rem] rounded-bl-[1.5rem] overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-[#FFF8F2]/20 dark:bg-slate-900/40">
              <SkeletonBase className="absolute inset-0" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 w-[240px] sm:w-[280px] p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl space-y-3">
              <SkeletonBase className="w-8 h-8 rounded-full" />
              <SkeletonBase className="h-5 w-4/5" variant="text" />
              <SkeletonBase className="h-3 w-1/2" variant="text" />
            </div>
          </div>

        </div>

        {/* 2. FACULTY CARDS GRID */}
        <div className="space-y-6">
          <div className="text-left border-l-4 border-[#9B111E] pl-4 space-y-2">
            <SkeletonBase className="h-6 w-56" variant="text" />
            <SkeletonBase className="h-4 w-96" variant="text" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 rounded-[2rem] border border-slate-150 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center text-center space-y-5"
              >
                {/* Round Image Wrap */}
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-1 flex items-center justify-center">
                  <SkeletonBase className="w-full h-full rounded-full" variant="circle" />
                </div>

                {/* Details */}
                <div className="space-y-2 flex flex-col items-center w-full">
                  <SkeletonBase className="h-5 w-3/5" variant="text" />
                  <SkeletonBase className="h-4 w-2/5" variant="text" />
                  <SkeletonBase className="h-3 w-1/2" variant="text" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-1 w-full">
                  <SkeletonBase className="h-6 w-24 rounded-full" />
                  <SkeletonBase className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. BOTTOM STATS STRIP */}
        <div className="w-full p-6 sm:p-8 rounded-[2rem] sm:rounded-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 xl:px-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4 text-left w-full md:w-auto justify-start md:justify-center relative">
              <SkeletonBase className="w-12 h-12 rounded-full" />
              <div className="space-y-1">
                <SkeletonBase className="h-5 w-16" variant="text" />
                <SkeletonBase className="h-4 w-24" variant="text" />
              </div>
              {i < 4 && (
                <div className="hidden lg:block absolute -right-6 xl:-right-10 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
