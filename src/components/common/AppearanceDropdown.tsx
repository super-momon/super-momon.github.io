"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import DesignToggle from "./DesignToggle";
import ThemeToggle from "./ThemeToggle";
import { isGameRoute } from "@/lib/designSystem";

export default function AppearanceDropdown() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const gameRoute = isGameRoute(pathname);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const handleScroll = () => setIsOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Appearance settings"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="design-elevated-control relative w-11 h-11 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7h10" />
          <path d="M18 7h2" />
          <circle cx="16" cy="7" r="2" />
          <path d="M4 17h2" />
          <path d="M10 17h10" />
          <circle cx="8" cy="17" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+12px)] w-56 origin-top-right z-50"
          style={
            shouldReduceMotion
              ? undefined
              : { animation: "dropdownSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }
          }
          role="menu"
        >
          <div className="absolute -top-[6px] right-[14px] w-3 h-3 rotate-45 bg-[var(--color-surface)] border-l border-t border-[var(--color-border)] z-10" />
          <div className="design-elevated-control relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/98 p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="px-3 pb-2 pt-1 text-sm font-bold text-[var(--color-foreground)]">
              Appearance
            </div>
            {!gameRoute && (
              <div
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-medium text-[var(--color-foreground)]"
                role="menuitem"
              >
                <span>Design</span>
                <DesignToggle />
              </div>
            )}
            <div
              className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-medium text-[var(--color-foreground)]"
              role="menuitem"
            >
              <span>Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
