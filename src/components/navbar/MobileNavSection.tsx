"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { type NavLink, isLinkActive } from "@/lib/constants";

export interface MobileNavSectionProps {
  label: string;
  links: NavLink[];
  icons: Record<string, IconDefinition>;
  isOpen: boolean;
  activeSection?: string;
  pathname?: string;
  onToggle: () => void;
  onLinkClick: (link: NavLink) => void;
  slideDelay?: string;
}

export default function MobileNavSection({
  label,
  links,
  icons,
  isOpen,
  activeSection,
  pathname,
  onToggle,
  onLinkClick,
  slideDelay = "0s",
}: MobileNavSectionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const currentPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
  const sectionActive = activeSection || "/";

  const hasActiveLink = links.some((l) => isLinkActive(l.href, sectionActive, currentPath));
  const disclosureId = `mobile-nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-links`;

  return (
    <li
      style={
        shouldReduceMotion
          ? undefined
          : { animation: `mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${slideDelay} backwards` }
      }
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={disclosureId}
        className={`design-elevated-control relative flex w-full items-center justify-between overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          hasActiveLink ? "text-[var(--color-foreground)] bg-[var(--color-surface)]/60" : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        }`}
      >
        <span className="absolute inset-0 bg-[var(--color-surface)]/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
        <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />
        <span className="relative z-10 flex min-w-0 items-center gap-2">
          {hasActiveLink && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)] shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{label}</span>
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`relative z-10 text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-accent)] group-hover:h-8 transition-all duration-300" />
      </button>

      <div
        id={disclosureId}
        className={`overflow-x-hidden overflow-y-auto overscroll-contain transition-[height,opacity] duration-300 ease-out ${isOpen ? "h-40 opacity-100" : "h-0 opacity-0"}`}
        aria-hidden={!isOpen}
      >
        <ul className="pl-4 flex flex-col gap-0.5 pt-1 pb-1">
          {links.map((link, i) => {
            const isCurrentSection = isLinkActive(link.href, sectionActive, currentPath);


            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => onLinkClick(link)}
                  tabIndex={isOpen ? undefined : -1}
                  className={`relative min-h-11 flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group/sub overflow-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    isCurrentSection
                      ? "text-[var(--color-foreground)] bg-[var(--color-accent)]/10 font-semibold"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                  style={{ transitionDelay: `${i * 20}ms` }}
                >
                  <span className="absolute inset-0 bg-[var(--color-surface)]/40 translate-x-[-100%] group-hover/sub:translate-x-0 transition-transform duration-200 rounded-xl" />
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-[var(--color-accent)] transition-all duration-200 rounded-full ${
                    isCurrentSection ? "h-5" : "h-0 group-hover/sub:h-5"
                  }`} />
                  <span className="relative z-10 flex min-w-0 items-center gap-2">
                    {icons[link.href] && (
                      <FontAwesomeIcon
                        icon={icons[link.href]}
                        className={`text-xs ${isCurrentSection ? "text-[var(--color-accent)] opacity-100" : "text-[var(--color-accent)] opacity-60"}`}
                      />
                    )}
                    <span className="truncate">{link.label}</span>
                  </span>
                  {isCurrentSection ? (
                    <span className="relative z-10 rounded bg-[var(--color-accent)]/20 px-1.5 py-0.5 text-xs font-bold text-[var(--color-accent)]">
                      Current
                    </span>
                  ) : (
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="relative z-10 text-xs opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-200"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
