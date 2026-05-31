"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium FooterSkeleton mirroring Footer.tsx responsive layout, grid columns, and sub-blocks exactly.
 */
export default function FooterSkeleton() {
  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-brand-cream-350 dark:border-slate-900 overflow-hidden py-16 sm:py-20 text-slate-600">
      {/* Background soft cream gradient and accents */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#FFF8F2] blur-3xl pointer-events-none -z-10 dark:bg-amber-955/5" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#9B111E]/5 blur-3xl pointer-events-none -z-10 dark:bg-red-955/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">
        
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-start pb-12 sm:pb-16 border-b border-slate-100 dark:border-slate-800/80">
          
          {/* LEFT: Branding block */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="flex items-center space-x-3.5">
              <SkeletonBase className="w-12 h-12 rounded-2xl" />
              <div className="flex flex-col space-y-1.5 py-1">
                <SkeletonBase className="h-5 w-28" variant="text" />
                <SkeletonBase className="h-3 w-36" variant="text" />
              </div>
            </div>
            
            <div className="space-y-2 max-w-sm">
              <SkeletonBase className="h-4 w-full" variant="text" />
              <SkeletonBase className="h-4 w-11/12" variant="text" />
              <SkeletonBase className="h-4 w-4/5" variant="text" />
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-3.5 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBase key={i} className="w-10 h-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* COLUMN 1: Quick Links */}
          <div className="lg:col-span-2 text-left space-y-5">
            <SkeletonBase className="h-4 w-24 rounded-full" />
            <ul className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i} className="flex items-center">
                  <SkeletonBase className="w-1.5 h-1.5 rounded-full mr-2 shrink-0" />
                  <SkeletonBase className="h-3.5 w-16" variant="text" />
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: Courses */}
          <div className="lg:col-span-2 text-left space-y-5">
            <SkeletonBase className="h-4 w-20 rounded-full" />
            <ul className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-center">
                  <SkeletonBase className="w-1.5 h-1.5 rounded-full mr-2 shrink-0" />
                  <SkeletonBase className="h-3.5 w-20" variant="text" />
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Contact Info */}
          <div className="lg:col-span-3 text-left space-y-5">
            <SkeletonBase className="h-4 w-28 rounded-full" />
            <ul className="space-y-4">
              <li className="flex items-start space-x-3.5">
                <SkeletonBase className="w-5 h-5 rounded-full shrink-0" />
                <SkeletonBase className="h-4 w-48" variant="text" />
              </li>
              <li className="flex items-start space-x-3.5">
                <SkeletonBase className="w-5 h-5 rounded-full shrink-0" />
                <div className="space-y-1.5 w-full">
                  <SkeletonBase className="h-4 w-28" variant="text" />
                  <SkeletonBase className="h-3 w-16" variant="text" />
                </div>
              </li>
              <li className="flex items-center space-x-3.5">
                <SkeletonBase className="w-5 h-5 rounded-full shrink-0" />
                <SkeletonBase className="h-4 w-36" variant="text" />
              </li>
              <li className="flex items-center space-x-3.5">
                <SkeletonBase className="w-5 h-5 rounded-full shrink-0" />
                <SkeletonBase className="h-4 w-40" variant="text" />
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 space-y-4 sm:space-y-0">
          <SkeletonBase className="h-4 w-64 rounded-md" variant="text" />
          <SkeletonBase className="h-4 w-80 rounded-md" variant="text" />
        </div>

      </div>
    </footer>
  );
}
