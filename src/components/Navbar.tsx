"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import MarqueeBanner from "./common/MarqueeBanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faPalette,
  faChartLine,
  faBriefcase,
  faInbox,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// TypeScript Interfaces
interface NavLink {
  label: string;
  href: string;
}

interface Notification {
  id: number;
  text: string;
  icon: IconDefinition;
  timestamp: string;
  color: string;
  link?: string;
  linkText?: string;
}

// Navigation configuration
const navLinks: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Education", href: "/#education" },
  { label: "Contact", href: "/#contact" },
];

// Notifications data
const notifications: Notification[] = [
  {
    id: 3,
    text: "✨ Refreshed website design with smooth animations, enhanced mobile experience, and modern aesthetic",
    icon: faPalette,
    timestamp: "June 21, 2026",
    color: "text-purple-500",
  },
  {
    id: 2,
    text: "🎯 Completed Workplace Insight Professional Assessment by Criteria Corp",
    icon: faChartLine,
    timestamp: "June 20, 2026",
    color: "text-blue-500",
    link: "#about",
    linkText: "View Assessment",
  },
  {
    id: 1,
    text: "💼 Actively seeking new opportunities! Open to full-time roles and exciting projects",
    icon: faBriefcase,
    timestamp: "June 01, 2026",
    color: "text-green-500",
    link: "#contact",
    linkText: "Get in touch",
  },
];

/**
 * Custom hook for magnetic button effect that creates premium micro-interactions.
 * Button follows cursor movement within its boundaries.
 * 
 * @param strength - Multiplier for the magnetic effect intensity (default: 0.4)
 * @returns Ref to attach to the button element
 */
function useMagneticEffect(strength = 0.4) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0) scale(1)';
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * Theme toggle button component with magnetic hover effect.
 * Switches between light and dark themes.
 */
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useMagneticEffect(0.3);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      ref={buttonRef}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform"
      style={{ transitionProperty: 'color, background-color, border-color' }}
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

/**
 * Notification dropdown component displaying recent updates.
 * Auto-closes on outside click or scroll.
 */
function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useMagneticEffect(0.25);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTimeout(() => setHasAnimated(false), 300);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
        setTimeout(() => setHasAnimated(false), 300);
      }
    };

    if (isOpen) {
      setHasAnimated(true);
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform group"
        style={{ transitionProperty: 'color, background-color, border-color' }}
      >
        <span suppressHydrationWarning>
          <FontAwesomeIcon
            icon={faBell}
            className={`text-base transition-transform duration-300 ${isOpen ? 'scale-110 rotate-12' : 'group-hover:scale-110'}`}
            suppressHydrationWarning
          />
        </span>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 mt-3 sm:w-[360px] max-w-[calc(100vw-2rem)] bg-[var(--color-background)]/95 backdrop-blur-xl border border-[var(--color-border)]/50 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50 origin-top-right"
          style={{
            animation: 'dropdownSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)]/50 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative px-5 py-4 border-b border-[var(--color-border)]/50 bg-[var(--color-surface)]/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-foreground)] tracking-tight">
                Recent Updates
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--color-accent)]/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="text-[10px] font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                  {notifications.length} New
                </span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="relative max-h-[480px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface)]/50 mb-3">
                  <FontAwesomeIcon icon={faInbox} className="text-2xl text-[var(--color-muted)]" />
                </div>
                <p className="text-sm text-[var(--color-muted)] font-medium">
                  All caught up!
                </p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="relative px-5 py-4 hover:bg-[var(--color-surface)]/50 transition-all duration-300 border-b border-[var(--color-border)]/30 last:border-b-0 group cursor-pointer"
                  style={{
                    animation: hasAnimated
                      ? `notificationSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`
                      : 'none',
                  }}
                >
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent)] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                  <div className="flex items-start gap-3.5">
                    {/* Icon with glow effect */}
                    <div className="flex-shrink-0 mt-0.5 relative">
                      <div className={`absolute inset-0 ${notification.color} opacity-20 blur-lg rounded-full`} />
                      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)]/50">
                        <FontAwesomeIcon icon={notification.icon} className={`${notification.color} text-base`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[var(--color-foreground)] leading-relaxed font-medium">
                        {notification.text}
                      </p>

                      <div className="flex items-center justify-between mt-2.5 gap-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
                          <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                          <span>{notification.timestamp}</span>
                        </div>

                        {notification.link && (
                          <a
                            href={notification.link}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 rounded-lg transition-all duration-200 group/link"
                          >
                            {notification.linkText}
                            <FontAwesomeIcon icon={faArrowRight} className="text-[9px] group-hover/link:translate-x-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main navigation bar component with scroll-aware behavior.
 * Features: theme toggle, notifications, responsive mobile menu, magnetic interactions.
 * Auto-hides on scroll down, shows on scroll up.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const mobileButtonRef = useMagneticEffect(0.25);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state
      setScrolled(currentScrollY > 20);

      // Show/hide navbar based on scroll direction
      if (currentScrollY < 100) {
        // Always show at top
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setVisible(false);
        setMenuOpen(false); // Close mobile menu when hiding
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show navbar
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${visible ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled
          ? "bg-[var(--color-background)]/80 backdrop-blur-2xl border-b border-[var(--color-border)]/50 shadow-lg shadow-black/5"
          : "bg-transparent"
        }`}
      style={{ willChange: 'transform' }}
    >
      <MarqueeBanner />

      <nav className="w-full max-w-6xl mx-auto px-6 h-16 flex justify-between items-center relative">
        {/* Logo with premium hover effect */}
        <a
          href="/#hero"
          className="relative text-lg font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-all duration-300 justify-self-start group z-10"
        >
          <span className="relative inline-block">
            &lt;momon /&gt;
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden"
              >
                {/* Hover background with slide effect */}
                <span className="absolute inset-0 bg-[var(--color-surface)]/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl" />

                {/* Border glow effect */}
                <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />

                <span className="relative z-10">{link.label}</span>

                {/* Bottom accent line */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-8 transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-self-end z-10">
          <NotificationDropdown />
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            ref={mobileButtonRef}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform"
            style={{ transitionProperty: 'color, background-color, border-color' }}
          >
            <div className="relative w-[18px] h-[18px]">
              {menuOpen ? (
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
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-[var(--color-background)]/95 backdrop-blur-2xl border-b border-[var(--color-border)]/50 px-6 pb-4 overflow-hidden"
          style={{
            animation: 'mobileMenuSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/30 to-transparent pointer-events-none" />

          <ul className="relative flex flex-col gap-1 pt-2">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                style={{
                  animation: `mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`,
                }}
              >
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="relative block px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden"
                >
                  {/* Hover background */}
                  <span className="absolute inset-0 bg-[var(--color-surface)]/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />

                  {/* Border */}
                  <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />

                  {/* Content */}
                  <span className="relative z-10 flex items-center justify-between">
                    <span>{link.label}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </span>

                  {/* Left accent line */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-accent)] group-hover:h-8 transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Global animation styles */}
      <style jsx>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes notificationSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes mobileMenuSlideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        @keyframes mobileMenuItemSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-surface);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 10px;
          transition: background 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-muted);
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  );
}
