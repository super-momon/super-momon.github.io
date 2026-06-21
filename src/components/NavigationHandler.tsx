"use client";

import { useEffect, useState } from "react";

interface NavigationHandlerProps {
  children: React.ReactNode;
}

/**
 * Handles browser back/forward navigation to force component re-mounting
 * Fixes issue where FadeIn animations don't re-trigger after browser back
 * Also triggers Font Awesome icon re-rendering
 */
export function NavigationHandler({ children }: NavigationHandlerProps) {
  const [navKey, setNavKey] = useState(0);

  useEffect(() => {
    // Listen for browser back/forward navigation
    const handlePopState = () => {
      // Force re-mount by updating key
      setNavKey((prev) => prev + 1);

      // Reinitialize Font Awesome icons after navigation
      // This ensures icons render properly after browser back/forward
      if (typeof window !== 'undefined' && (window as any).FontAwesome) {
        setTimeout(() => {
          (window as any).FontAwesome.dom.i2svg();
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Also listen for hash changes (for hash-based navigation)
    const handleHashChange = () => {
      // Don't re-mount on hash changes within the same page
      // Only on actual page navigation
    };

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return <div key={navKey}>{children}</div>;
}
