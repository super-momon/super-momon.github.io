"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initializeAutoLinkTracking, trackPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    initializeAutoLinkTracking();
  }, []);

  useEffect(() => {
    const pathWithQuery = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(pathWithQuery);
  }, [pathname, queryString]);

  return null;
}
