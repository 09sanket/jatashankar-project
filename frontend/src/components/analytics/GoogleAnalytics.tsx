"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Inner component to track page views on route changes.
 * Wrapped in Suspense to prevent Next.js from de-optimizing pages to client-side rendering.
 */
function AnalyticsTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId) return;
    
    // Construct dynamic page URL including query params
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Trigger config call with the new URL for routing changes tracking
    if (typeof window.gtag === "function") {
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gaId]);

  return null;
}

/**
 * Production-ready Google Analytics integration component.
 * - Dynamically fetches Google Analytics Measurement ID G-XXXXXXXXXX from WebsiteSettingsContext.
 * - Inject script tag only if tracking ID exists and loaded successfully.
 * - Captures page view transitions and avoids duplicate script injection.
 */
export default function GoogleAnalytics() {
  const { settings, loading } = useWebsiteSettings();
  const gaId = settings?.googleAnalyticsId;

  // Render nothing if settings are fetching, or GA ID is not configured
  if (loading || !gaId || gaId.trim() === "") {
    return null;
  }

  return (
    <>
      {/* Global Gtag script tag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      
      {/* Page view config setup */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* Route changes tracking wrapper */}
      <Suspense fallback={null}>
        <AnalyticsTracker gaId={gaId} />
      </Suspense>
    </>
  );
}
