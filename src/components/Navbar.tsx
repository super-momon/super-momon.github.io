"use client";

import { useState, useEffect, useRef } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronDown,
  faUser,
  faBriefcase,
  faCode,
  faWrench,
  faGraduationCap,
  faEnvelope,
  faGamepad,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import MarqueeBanner from "./common/MarqueeBanner";
import NotificationDropdown from "./common/NotificationDropdown";
import ThemeToggle from "./common/ThemeToggle";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { PORTFOLIO_LINKS, GAME_LINKS, type NavLink } from "@/lib/constants";

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
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavPanelProps {
  links: NavLink[];
  icons: Record<string, IconDefinition>;
  cols: number;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

interface NavTriggerProps {
  label: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

interface MobileNavSectionProps {
  label: string;
  links: NavLink[];
  icons: Record<string, IconDefinition>;
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
  slideDelay?: string;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

/** Creates enter/leave hover handlers with a 120ms leave delay to bridge cursor gaps. */
function makeHandlers(
  setter: React.Dispatch<React.SetStateAction<boolean>>,
  ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
) {
  return {
    onEnter: () => { if (ref.current) clearTimeout(ref.current); setter(true); },
    onLeave: () => { ref.current = setTimeout(() => setter(false), 120); },
  };
}

// ─── Shared landscape panel ───────────────────────────────────────────────────
function NavPanel({ links, icons, cols, isOpen, onMouseEnter, onMouseLeave, onClose }: NavPanelProps) {
  return (
    <div
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 transition-all duration-200 ease-out ${isOpen
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-2 pointer-events-none"
        }`}
    >
      {/* Caret */}
      <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[var(--color-surface)] border-l border-t border-[var(--color-border)]/40 z-10" />

      <div className="relative bg-[var(--color-background)]/95 backdrop-blur-2xl border border-[var(--color-border)]/40 rounded-2xl shadow-2xl shadow-black/20 p-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/20 to-transparent pointer-events-none rounded-2xl" />

        {/* Landscape tile grid — cols set inline so Tailwind purge is bypassed */}
        <div
          className="relative grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(72px, 1fr))` }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={onClose}
              className="relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl text-center group/tile overflow-hidden transition-colors duration-200"
            >
              <span className="absolute inset-0 bg-[var(--color-surface)]/60 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-200 rounded-xl" />
              <span className="relative z-10 w-7 h-7 rounded-lg bg-[var(--color-surface)] flex items-center justify-center group-hover/tile:bg-[var(--color-accent)]/15 transition-colors duration-200 shrink-0">
                {icons[link.href] && (
                  <FontAwesomeIcon
                    icon={icons[link.href]}
                    className="text-[11px] text-[var(--color-muted)] group-hover/tile:text-[var(--color-accent)] transition-colors duration-200"
                  />
                )}
              </span>
              <span className="relative z-10 text-[11px] font-medium text-[var(--color-muted)] group-hover/tile:text-[var(--color-foreground)] transition-colors duration-200 whitespace-nowrap leading-none">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Shared hover trigger ─────────────────────────────────────────────────────
function NavTrigger({ label, isOpen, onMouseEnter, onMouseLeave, children }: NavTriggerProps) {
  return (
    <li className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="relative px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden flex items-center gap-1.5 cursor-default"
      >
        <span className="absolute inset-0 bg-[var(--color-surface)]/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl" />
        <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />
        <span className="relative z-10">{label}</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-8 transition-all duration-300" />
      </button>
      {children}
    </li>
  );
}

// ─── Mobile accordion section ───────────────────────────────────────────────
function MobileNavSection({ label, links, icons, isOpen, onToggle, onLinkClick, slideDelay = "0s" }: MobileNavSectionProps) {
  return (
    <li style={{ animation: `mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${slideDelay} backwards` }}>
      <button
        onClick={onToggle}
        className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden"
      >
        <span className="absolute inset-0 bg-[var(--color-surface)]/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
        <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />
        <span className="relative z-10">{label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`relative z-10 text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-accent)] group-hover:h-8 transition-all duration-300" />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="pl-4 flex flex-col gap-0.5 pt-1 pb-1">
          {links.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onLinkClick}
                className="relative flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-200 group/sub overflow-hidden"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                <span className="absolute inset-0 bg-[var(--color-surface)]/40 translate-x-[-100%] group-hover/sub:translate-x-0 transition-transform duration-200 rounded-xl" />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-accent)] group-hover/sub:h-5 transition-all duration-200 rounded-full" />
                <span className="relative z-10 flex items-center gap-2">
                  {icons[link.href] && (
                    <FontAwesomeIcon icon={icons[link.href]} className="text-[10px] text-[var(--color-accent)] opacity-60" />
                  )}
                  {link.label}
                </span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="relative z-10 text-[9px] opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-200"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

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
    const handleScroll = () => {
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
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portfolioHandlers = makeHandlers(setPortfolioOpen, portfolioTimeoutRef);
  const gameHandlers = makeHandlers(setGameOpen, gameTimeoutRef);

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
        <a
          href="/#hero"
          className="relative text-lg font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-all duration-300 justify-self-start group z-10"
        >
          <span className="relative inline-block">
            &lt;momon /&gt;
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
          </span>
        </a>

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
              cols={3}
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
              cols={1}
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
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform"
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
          className="md:hidden bg-[var(--color-background)]/95 backdrop-blur-2xl border-b border-[var(--color-border)]/50 px-6 pb-4 overflow-hidden"
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

