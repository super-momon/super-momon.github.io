"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

/**
 * Theme toggle button with magnetic hover effect.
 * Renders a placeholder during SSR to avoid hydration mismatch.
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useMagneticEffect(0.3);

  useEffect(() => {
    // Needed for SSR hydration — safe to call here as this runs only once after mount
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      ref={buttonRef}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      style={{ transitionProperty: "color, background-color, border-color" }}
    >
      <div className="relative w-[18px] h-[18px] flex items-center justify-center">
        {resolvedTheme === "dark" ? (
          <FontAwesomeIcon icon={faSun} className="text-base" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="text-base" />
        )}
      </div>
    </button>
  );
}
