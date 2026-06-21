"use client";

import { useEffect, useState } from "react";

/**
 * Client component wrapper that forces re-mounting when browser navigation occurs
 * This fixes the issue where FadeIn animations don't re-trigger after browser back/forward
 */
export function ClientPageWrapper({ children }: { children: React.ReactNode }) {
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => {
    // Listen for browser back/forward navigation (popstate)
    const handlePopState = () => {
      console.log("[ClientPageWrapper] popstate event fired");
      // Scroll to top to ensure InView observers work correctly
      window.scrollTo(0, 0);
      // Force complete re-mount by updating key
      setPageKey((prev) => prev + 1);
    };

    // Listen for page show event (triggered when navigating back to cached page)
    const handlePageShow = (event: PageTransitionEvent) => {
      console.log("[ClientPageWrapper] pageshow event fired, persisted:", event.persisted);
      if (event.persisted) {
        // Page was restored from cache (bfcache), force re-mount
        window.scrollTo(0, 0);
        setPageKey((prev) => prev + 1);
      }
    };

    // Listen for focus event (sometimes triggered when coming back to page)
    const handleFocus = () => {
      console.log("[ClientPageWrapper] window focus event");
      // Don't re-mount on focus, just ensure scroll position
      if (document.hidden === false && window.history.state) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);

    console.log("[ClientPageWrapper] Event listeners attached");

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return <div key={pageKey}>{children}</div>;
}
