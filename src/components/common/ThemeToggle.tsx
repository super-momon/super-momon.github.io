"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle switch.
 * Renders a placeholder during SSR to avoid hydration mismatch.
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // Needed for SSR hydration — safe to call here as this runs only once after mount
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="flex h-11 min-w-[5.5rem] items-center justify-end gap-2"
      >
        <span className="h-3 w-8 rounded bg-[var(--color-foreground)]/10" />
        <span className="block h-6 w-11 rounded-full bg-[var(--color-surface)]" />
      </span>
    );
  }

  const isDark = resolvedTheme === "dark";
  const currentThemeLabel = isDark ? "Dark" : "Light";
  const nextThemeLabel = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`${currentThemeLabel} theme selected. Switch to ${nextThemeLabel} theme`}
      title={`Switch to ${nextThemeLabel} theme`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex min-h-11 items-center justify-end gap-2 rounded-xl px-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span className="text-xs font-semibold text-[var(--color-foreground)]">
        {currentThemeLabel}
      </span>
      <span
        aria-hidden="true"
        className={`relative block h-6 w-11 rounded-full border transition-colors duration-300 ${
          isDark
            ? "border-accent/70 bg-accent"
            : "border-[var(--color-border)] bg-[var(--color-surface)]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[16px] w-[16px] rounded-full border shadow-sm transition-[left,background-color,border-color] duration-300 ${
            isDark
              ? "left-[25px] border-accent-contrast/30 bg-accent-contrast"
              : "left-[3px] border-[var(--color-border)] bg-[var(--color-foreground)]"
          }`}
        />
      </span>
    </button>
  );
}
