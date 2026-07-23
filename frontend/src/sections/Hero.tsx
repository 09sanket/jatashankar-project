"use client";

import React from "react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full bg-white pt-20 sm:pt-24 pb-8 lg:pb-12"
    >
      <div className="w-full max-w-[1920px] mx-auto px-0 sm:px-4 lg:px-8">
        <div className="w-full rounded-none sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm sm:shadow-lg relative">
          <img
            src="/branding/Homemain.jpeg"
            alt="Jatashankar Institute Hero Banner"
            className="w-full h-auto min-h-[40vh] max-h-[85vh] object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
