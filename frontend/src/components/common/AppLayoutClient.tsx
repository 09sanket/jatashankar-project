"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";
import GlobalLoader from "./GlobalLoader";
import PageTransition from "./PageTransition";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { loading } = useWebsiteSettings();

  return (
    <>
      {/* Render the brand loader while site settings are fetching */}
      <AnimatePresence mode="wait">
        {loading && <GlobalLoader />}
      </AnimatePresence>

      {/* Render page content and route change transitions after initialization */}
      {!loading && (
        <PageTransition>
          {children}
        </PageTransition>
      )}
    </>
  );
}
