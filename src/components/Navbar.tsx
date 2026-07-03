"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faBriefcase,
  faCode,
  faWrench,
  faGraduationCap,
  faEnvelope,
  faGamepad,
  faStar,
  faAtom,
} from "@fortawesome/free-solid-svg-icons";
import MarqueeBanner from "./common/MarqueeBanner";
import NotificationDropdown from "./common/NotificationDropdown";
import ThemeToggle from "./common/ThemeToggle";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { PORTFOLIO_LINKS, GAME_LINKS } from "@/lib/constants";
import NavPanel from "./navbar/NavPanel";
import NavTrigger from "./navbar/NavTrigger";
import MobileNavSection from "./navbar/MobileNavSection";

// ─── Icon maps ────────────────────────────────────────────────────────────────
const PORTFOLIO_ICONS: Record<string, IconDefinition> = {
  "/": faStar,
  "/#about": faUser,
  "/#experience": faBriefcase,
  "/#projects": faCode,
  "/#skills": faWrench,
  "/#education": faGraduationCap,
  "/#contact": faEnvelope,
};

const GAME_ICONS: Record<string, IconDefinition> = {
  "/games/quiz": faGamepad,
  "/games/chain-reaction": faAtom,
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const [mobileGameOpen, setMobileGameOpen] = useState(false);
  const lastScrollY = useRef(0);
  const mobileButtonRef = useMagneticEffect(0.25);
  const portfolioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 20);
          if (currentScrollY < 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current) {
            setIsVisible(false);
            setIsMenuOpen(false);
            setPortfolioOpen(false);
            setGameOpen(false);
          } else {
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portfolioHandlers = {
    onEnter: () => {
      if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
      setPortfolioOpen(true);
    },
    onLeave: () => {
      portfolioTimeoutRef.current = setTimeout(() => setPortfolioOpen(false), 120);
    }
  };

  const gameHandlers = {
    onEnter: () => {
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);
      setGameOpen(true);
    },
    onLeave: () => {
      gameTimeoutRef.current = setTimeout(() => setGameOpen(false), 120);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isVisible ? "translate-y-0" : "-translate-y-full"
        } ${scrolled
          ? "bg-[var(--color-background)]/95 md:bg-[var(--color-background)]/80 md:backdrop-blur-2xl border-b border-[var(--color-border)]/50 shadow-lg shadow-black/5"
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

          {/* Portfolio */}
          <NavTrigger
            label="Portfolio"
            isOpen={portfolioOpen}
            onMouseEnter={portfolioHandlers.onEnter}
            onMouseLeave={portfolioHandlers.onLeave}
          >
            <NavPanel
              links={PORTFOLIO_LINKS}
              icons={PORTFOLIO_ICONS}
              isOpen={portfolioOpen}
              onMouseEnter={portfolioHandlers.onEnter}
              onMouseLeave={portfolioHandlers.onLeave}
              onClose={() => setPortfolioOpen(false)}
            />
          </NavTrigger>

          {/* Game */}
          <NavTrigger
            label="Games"
            isOpen={gameOpen}
            onMouseEnter={gameHandlers.onEnter}
            onMouseLeave={gameHandlers.onLeave}
          >
            <NavPanel
              links={GAME_LINKS}
              icons={GAME_ICONS}
              isOpen={gameOpen}
              onMouseEnter={gameHandlers.onEnter}
              onMouseLeave={gameHandlers.onLeave}
              onClose={() => setGameOpen(false)}
            />
          </NavTrigger>
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
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/90 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 transition-all duration-300"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-[var(--color-background)] border-b border-[var(--color-border)]/50 px-6 pb-4 overflow-hidden"
          style={{ animation: "mobileMenuSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/30 to-transparent pointer-events-none" />

          <ul className="relative flex flex-col gap-1 pt-2">

            <MobileNavSection
              label="Portfolio"
              links={PORTFOLIO_LINKS}
              icons={PORTFOLIO_ICONS}
              isOpen={mobilePortfolioOpen}
              onToggle={() => setMobilePortfolioOpen((p) => !p)}
              onLinkClick={() => { setIsMenuOpen(false); setMobilePortfolioOpen(false); }}
              slideDelay="0s"
            />

            <MobileNavSection
              label="Game"
              links={GAME_LINKS}
              icons={GAME_ICONS}
              isOpen={mobileGameOpen}
              onToggle={() => setMobileGameOpen((p) => !p)}
              onLinkClick={() => { setIsMenuOpen(false); setMobileGameOpen(false); }}
              slideDelay="0.05s"
            />
          </ul>
        </div>
      )}
    </header>
  );
}

