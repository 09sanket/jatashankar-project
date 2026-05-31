"use client";

import React from "react";
import dynamic from "next/dynamic";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Announcements from "../sections/Announcements";
import CourseList from "../sections/CourseList";
import Inquiry from "../sections/Inquiry";
import Placement from "../sections/Placement";

import Contact from "../sections/Contact";
import { ModalProvider } from "../context/ModalContext";
import AdmissionModal from "../components/common/AdmissionModal";

// Reusable premium skeleton loaders for dynamic fallback states
import FacilitiesSkeleton from "../components/skeletons/FacilitiesSkeleton";
import GallerySkeleton from "../components/skeletons/GallerySkeleton";
import TestimonialsSkeleton from "../components/skeletons/TestimonialsSkeleton";
import FacultySkeleton from "../components/skeletons/FacultySkeleton";

// Dynamic imports with corresponding high-fidelity skeleton suspensions
const Facilities = dynamic(() => import("../sections/Facilities"), {
  loading: () => <FacilitiesSkeleton />,
  ssr: true, // Keep SEO/SSR crawlable but deferred from main bundle chunks
});

const Gallery = dynamic(() => import("../sections/Gallery"), {
  loading: () => <GallerySkeleton />,
  ssr: true,
});

const Faculty = dynamic(() => import("../sections/Faculty"), {
  loading: () => <FacultySkeleton />,
  ssr: true,
});

const Testimonials = dynamic(() => import("../sections/Testimonials"), {
  loading: () => <TestimonialsSkeleton />, 
  ssr: true,
});

export default function Home() {

  return (
    <ModalProvider>
      <div className="relative min-h-screen bg-brand-cream-50 dark:bg-slate-950">
        {/* Sticky Navigation Bar */}
        <Header />

        {/* Main Content Layout Hierarchy */}
        <main>
          
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. About Section */}
          <About />

          {/* 3. Announcements Section */}
          <Announcements />

          {/* 4. Courses Section */}
          <CourseList />

          {/* 4.5 Faculty Section */}
          <Faculty />

          {/* 5. Facilities Section */}
          <Facilities />

          {/* 6. Gallery Section */}
          <Gallery />



          

          {/* 8. Placement Section */}
          <Placement />

          {/* 9. Testimonials Section */}
          <Testimonials />

          {/* 11. Enquiry Section */}
          <Inquiry />



          {/* 13. Contact Section */}
          <Contact />

        </main>

        {/* Footer Details */}
        <Footer />

        {/* Reusable Admission Modal */}
        <AdmissionModal />
      </div>
    </ModalProvider>
  );
}
