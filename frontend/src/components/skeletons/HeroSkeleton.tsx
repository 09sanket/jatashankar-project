"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium HeroSkeleton matching Hero.tsx layout hierarchy and spacing exactly.
 */
export default function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 lg:pt-32 pb-16 overflow-hidden bg-white text-slate-800 dark:bg-slate-950">
      {/* Background Gradients to match original Hero.tsx */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#FFF8E7]/60 blur-3xl pointer-events-none -z-10 dark:bg-amber-950/5" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-[#D4A017]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-950/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 lg:space-y-8 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="mx-auto lg:mx-0">
              <SkeletonBase className="h-7 w-60 rounded-full" />
            </div>

            {/* Main Title Heading Skeleton */}
            <div className="space-y-3 flex flex-col items-center lg:items-start w-full">
              <SkeletonBase className="h-10 sm:h-12 lg:h-14 xl:h-16 w-11/12 sm:w-10/12 lg:w-4/5 rounded-2xl" />
              <SkeletonBase className="h-10 sm:h-12 lg:h-14 xl:h-16 w-8/12 sm:w-7/12 lg:w-3/5 rounded-2xl" />
            </div>

            {/* Description Subtitle Skeleton */}
            <div className="space-y-2.5 max-w-xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start w-full">
              <SkeletonBase className="h-4 w-full" variant="text" />
              <SkeletonBase className="h-4 w-11/12" variant="text" />
              <SkeletonBase className="h-4 w-4/5" variant="text" />
            </div>

            {/* CTA Buttons row */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 pt-2 w-full">
              <SkeletonBase className="h-12 w-full sm:w-40 rounded-xl" />
              <SkeletonBase className="h-12 w-full sm:w-32 rounded-xl" />
              <SkeletonBase className="h-12 w-full sm:w-28 rounded-xl" />
            </div>

            {/* Statistics Cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-2xl p-4 flex flex-col items-center lg:items-start space-y-3"
                >
                  <SkeletonBase className="w-8 h-8 rounded-lg" />
                  <SkeletonBase className="h-5 w-16" variant="text" />
                  <SkeletonBase className="h-3.5 w-12" variant="text" />
                </div>
              ))}
            </div>

            {/* Bottom Trust Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm w-full">
              <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <SkeletonBase className="w-4 h-4 rounded-full" />
                    <SkeletonBase className="h-4 w-28" variant="text" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column Visual campus image skeleton */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full">
            <div className="absolute w-[95%] h-[95%] rounded-full bg-gradient-to-tr from-[#D4A017]/8 to-[#FFF8E7]/40 blur-2xl -z-10 dark:from-amber-950/5" />
            
            {/* Main Visual Image Skeleton */}
            <SkeletonBase className="w-full aspect-square max-w-[450px] lg:max-w-none rounded-3xl shadow-xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
