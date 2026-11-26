"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGamepad,
  faAtom,
  faBiohazard,
} from "@fortawesome/free-solid-svg-icons";
import NotificationDropdown from "./common/NotificationDropdown";
import MarqueeBanner from "./common/MarqueeBanner";
import ThemeToggle from "./common/ThemeToggle";
import DesignToggle from "./common/DesignToggle";
import AppearanceDropdown from "./common/AppearanceDropdown";
import { GAME_LINKS, isLinkActive } from "@/lib/constants";
import { isGameRoute } from "@/lib/designSystem";
import NavPanel from "./navbar/NavPanel";
import NavTrigger from "./navbar/NavTrigger";
import MobileNavSection from "./navbar/MobileNavSection";
import { trackEvent } from "@/lib/analytics";

// ─── Icon maps ────────────────────────────────────────────────────────────────
const GAME_ICONS: Record<string, IconDefinition> = {
  "/games/quiz": faGamepad,
  "/games/chain-reaction": faAtom,
  "/games/colony-defense": faBiohazard,
};

const MOBILE_PORTFOLIO_LINKS = [
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [mobileGameOpen, setMobileGameOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(() => pathname || "/");

  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const gameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Scroll direction & backdrop handling ──────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 20);
          const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(
            scrollableHeight > 0
              ? Math.min(100, Math.max(0, (currentScrollY / scrollableHeight) * 100))
              : 0
          );
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Scrollspy for active section highlighting ──────────────────────────────
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = ["hero", "about", "experience", "projects", "skills", "education", "contact"];

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 140; // 140px header offset threshold

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            const activeHref = id === "hero" ? "/" : `/#${id}`;
            setActiveSection(activeHref);
            break;
          }
        }
      }
    };

    handleScrollSpy();
    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  // ─── Escape key menu dismiss ────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setGameOpen(false);
        if (isMenuOpen) {
          window.requestAnimationFrame(() => mobileButtonRef.current?.focus());
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, mobileButtonRef]);

  // ─── Mobile drawer body scroll locking ─────────────────────────────────────
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const gameHandlers = {
    onEnter: () => {
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);
      setGameOpen(true);
    },
    onLeave: () => {
      gameTimeoutRef.current = setTimeout(() => setGameOpen(false), 120);
    }
  };

  const currentActiveSection = pathname === "/" ? activeSection : pathname;
  const isGameActive = GAME_LINKS.some((l) => isLinkActive(l.href, currentActiveSection, pathname));
  const gameRoute = isGameRoute(pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative">
        <MarqueeBanner />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-[var(--color-accent-contrast)]/20"
        >
          <div
            className="h-full origin-left bg-[var(--color-accent-contrast)]/90 transition-[width] duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="px-3 pt-2 md:px-6 md:pt-3">
        <nav
          className={`design-navbar relative mx-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-2xl border border-[var(--color-border)]/80 px-2 md:h-16 md:px-4 ${
            scrolled
              ? "shadow-[0_22px_44px_-24px_rgba(0,0,0,0.55)]"
              : "shadow-[0_18px_38px_-24px_rgba(0,0,0,0.42)]"
          } transition-[box-shadow,transform,border-color] duration-500 ${
            shouldReduceMotion ? "" : "ease-[cubic-bezier(0.16,1,0.3,1)]"
          }`}
        >
        {/* Logo */}
        <Link
          href="/#hero"
          className="relative inline-flex min-h-11 items-center text-lg font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-all duration-300 justify-self-start group z-10"
        >
          <span className="relative inline-block">
            &lt;momon /&gt;
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Experience", href: "/#experience" },
            { label: "Projects", href: "/#projects" },
            { label: "Contact", href: "/#contact" },
          ].map((link) => {
            const active = isLinkActive(link.href, currentActiveSection, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          {/* Games */}
          <NavTrigger
            label="Games"
            isOpen={gameOpen}
            isActive={isGameActive}
            onClick={() => setGameOpen(true)}
            onMouseEnter={gameHandlers.onEnter}
            onMouseLeave={gameHandlers.onLeave}
          >
            <NavPanel
              links={GAME_LINKS}
              icons={GAME_ICONS}
              isOpen={gameOpen}
              activeSection={currentActiveSection}
              pathname={pathname}
              onMouseEnter={gameHandlers.onEnter}
              onMouseLeave={gameHandlers.onLeave}
              onClose={() => setGameOpen(false)}
              onLinkClick={(link) => {
                const gameName = link.href.replace("/games/", "");
                trackEvent("game_nav_click", {
                  game_name: gameName,
                  device: "desktop",
                  destination: link.href,
                });
              }}
            />
          </NavTrigger>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-self-end z-10">
          <NotificationDropdown />
          <AppearanceDropdown />

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileButtonRef}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="design-elevated-control md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/90 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            style={{ transitionProperty: "color, background-color, border-color" }}
          >
            <div className="relative w-[18px] h-[18px]">
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="animate-[spin_0.3s_ease-out]" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </div>
          </button>
        </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden px-3 pt-2 pb-3 overflow-hidden"
          style={
            shouldReduceMotion
              ? undefined
              : { animation: "mobileMenuSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }
          }
        >
          <div className="design-dialog relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[var(--color-border)]/80 px-3 pb-3 shadow-[0_16px_36px_-24px_rgba(0,0,0,0.38)]">
            <ul className="relative flex flex-col gap-1 pt-3">
            <li
              className="grid grid-cols-3 gap-1"
              style={
                shouldReduceMotion
                  ? undefined
                  : { animation: "mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0s backwards" }
              }
            >
              {MOBILE_PORTFOLIO_LINKS.map((link) => {
                const active = isLinkActive(link.href, currentActiveSection, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`design-elevated-control min-h-11 rounded-xl border px-2 py-2 text-center text-sm font-semibold transition-colors ${
                      active
                        ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "border-[var(--color-border)]/40 bg-[var(--color-surface)]/30 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </li>

            <MobileNavSection
              label="Games"
              links={GAME_LINKS}
              icons={GAME_ICONS}
              isOpen={mobileGameOpen}
              activeSection={currentActiveSection}
              pathname={pathname}
              onToggle={() => setMobileGameOpen((p) => !p)}
              onLinkClick={(link) => {
                setIsMenuOpen(false);
                setMobileGameOpen(false);
                const gameName = link?.href.replace("/games/", "");
                trackEvent("game_nav_click", {
                  game_name: gameName,
                  device: "mobile",
                  destination: link?.href,
                });
              }}
              slideDelay="0.05s"
            />
            {!gameRoute && (
              <li
                className="design-surface relative w-full min-h-11 flex items-center justify-between gap-3 px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] bg-[var(--color-surface)]/30 border border-[var(--color-border)]/40"
                style={
                  shouldReduceMotion
                    ? undefined
                    : { animation: "mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.075s backwards" }
                }
              >
                <span>Design</span>
                <DesignToggle />
              </li>
            )}
            <li
              className="design-surface relative w-full min-h-11 flex items-center justify-between gap-3 px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] bg-[var(--color-surface)]/30 border border-[var(--color-border)]/40"
              style={
                shouldReduceMotion
                  ? undefined
                  : { animation: "mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.0875s backwards" }
              }
            >
              <span>Theme</span>
              <ThemeToggle />
            </li>
            </ul>
          </div>
        </div>
      )}

    </header>
  );
}
