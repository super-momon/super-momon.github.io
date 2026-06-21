"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MarqueeBanner from "./common/MarqueeBanner";
import NotificationDropdown from "./common/NotificationDropdown";
import ThemeToggle from "./common/ThemeToggle";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { NAV_LINKS } from "@/lib/constants";

/**
 * Main navigation bar with scroll-aware hide/show behavior.
 * Auto-hides on scroll down, reappears on scroll up.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const mobileButtonRef = useMagneticEffect(0.25);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isVisible ? "translate-y-0" : "-translate-y-full"
        } ${scrolled
          ? "bg-[var(--color-background)]/80 backdrop-blur-2xl border-b border-[var(--color-border)]/50 shadow-lg shadow-black/5"
          : "bg-transparent"
        }`}
      style={{ willChange: "transform" }}
    >
      <MarqueeBanner />

      <nav className="w-full max-w-6xl mx-auto px-6 h-16 flex justify-between items-center relative">
        {/* Logo */}
        <Link
          href="/#hero"
          className="relative text-lg font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-all duration-300 justify-self-start group z-10"
        >
          <span className="relative inline-block">
            &lt;momon /&gt;
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-[var(--color-surface)]/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl" />
                <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-8 transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-self-end z-10">
          <NotificationDropdown />
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileButtonRef}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform"
            style={{ transitionProperty: "color, background-color, border-color" }}
          >
            <div className="relative w-[18px] h-[18px]">
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="animate-[spin_0.3s_ease-out]"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-[var(--color-background)]/95 backdrop-blur-2xl border-b border-[var(--color-border)]/50 px-6 pb-4 overflow-hidden"
          style={{ animation: "mobileMenuSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/30 to-transparent pointer-events-none" />

          <ul className="relative flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link, index) => (
              <li
                key={link.href}
                style={{
                  animation: `mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`,
                }}
              >
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative block px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-[var(--color-surface)]/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
                  <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />
                  <span className="relative z-10 flex items-center justify-between">
                    <span>{link.label}</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </span>
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-accent)] group-hover:h-8 transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
