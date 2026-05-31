"use client";

import React from "react";
import SkeletonBase from "./SkeletonBase";

/**
 * Premium NavbarSkeleton matching Header.tsx navigation structure exactly.
 */
export default function NavbarSkeleton() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 py-4 bg-white border-b border-slate-100 dark:bg-slate-950 dark:border-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 flex justify-between items-center">
        
        {/* Left Side Branding */}
        <div className="flex items-center space-x-3 shrink-0 min-w-[200px]">
          {/* Logo Circle/Square */}
          <SkeletonBase className="w-12 h-12 rounded-xl" />
          {/* Text Lines */}
          <div className="flex flex-col justify-center space-y-1.5 py-1">
            <SkeletonBase className="h-4 w-28" variant="text" />
            <SkeletonBase className="h-3 w-36" variant="text" />
          </div>
        </div>

        {/* Center Menu Links (Desktop) */}
        <nav className="hidden xl:flex items-center space-x-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <SkeletonBase key={i} className="h-4 w-12 rounded-full" />
          ))}
        </nav>

        {/* Right Side Action Buttons (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3">
          <SkeletonBase className="h-9 w-24 rounded-full" />
          <SkeletonBase className="h-9 w-28 rounded-full" />
          <SkeletonBase className="h-10 w-36 rounded-xl" />
        </div>

        {/* Mobile Control Trigger Skeletons */}
        <div className="flex items-center space-x-2 lg:hidden">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-xl" />
        </div>

      </div>
    </div>
  );
}
