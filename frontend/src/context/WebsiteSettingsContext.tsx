"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getWebsiteSettings, WebsiteSettings, FALLBACK_SETTINGS } from "../services/settings.service";

interface WebsiteSettingsContextType {
  /** The global website configuration settings */
  settings: WebsiteSettings;
  /** Global loading state for configuration data */
  loading: boolean;
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextType | undefined>(undefined);

/**
 * Global Website Settings Provider.
 * Fetches institutional settings on application startup and manages loading/fallback states.
 * Exposes logo, institute names, contacts, social URLs, hero content, SEO tags, and footer info.
 */
export function WebsiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const fetchedSettings = await getWebsiteSettings();
        setSettings(fetchedSettings);
      } catch (err) {
        console.error("Failed to load global website settings context:", err);
        setSettings(FALLBACK_SETTINGS);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const contextValue = React.useMemo(() => ({ settings, loading }), [settings, loading]);

  return (
    <WebsiteSettingsContext.Provider value={contextValue}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

/**
 * React hook to retrieve global website settings and loading state.
 * Throws an error if used outside a WebsiteSettingsProvider.
 */
export function useWebsiteSettings() {
  const context = useContext(WebsiteSettingsContext);
  if (!context) {
    throw new Error("useWebsiteSettings must be used within a WebsiteSettingsProvider");
  }
  return context;
}
