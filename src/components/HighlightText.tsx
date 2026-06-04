"use client";

import { m } from "motion/react";

interface HighlightTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Renders text with a solid marker-style background highlight and an
 * animated underline that draws in from left to right on mount.
 *
 * Must be rendered inside a <LazyMotion> provider.
 */
export function HighlightText({ children, className = "" }: HighlightTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Slow flickering background highlight */}
      <m.span
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.1em] rounded-sm"
        style={{ backgroundColor: "var(--color-accent)" }}
        animate={{ opacity: [0.22, 0.12, 0.28, 0.08, 0.24, 0.18, 0.3, 0.1, 0.22] }}
        transition={{
          duration: 6,
          times: [0, 0.15, 0.3, 0.45, 0.55, 0.68, 0.78, 0.9, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Text — sits above the highlight */}
      <span className="relative">{children}</span>
    </span>
  );
}
