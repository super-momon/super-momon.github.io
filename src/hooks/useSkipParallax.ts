"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Hook to determine if scroll-driven parallax animations should be bypassed.
 * Returns true if the screen is mobile/tablet width (< 768px) or if the user
 * prefers reduced motion.
 */
export function useSkipParallax() {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile || !!prefersReducedMotion;
}
