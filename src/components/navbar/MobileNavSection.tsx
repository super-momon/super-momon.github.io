"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { type NavLink } from "@/lib/constants";

export interface MobileNavSectionProps {
  label: string;
  links: NavLink[];
  icons: Record<string, IconDefinition>;
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: (link: NavLink) => void;
  slideDelay?: string;
}

export default function MobileNavSection({
  label,
  links,
  icons,
  isOpen,
  onToggle,
  onLinkClick,
  slideDelay = "0s",
}: MobileNavSectionProps) {
  return (
    <li style={{ animation: `mobileMenuItemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${slideDelay} backwards` }}>
      <button
        onClick={onToggle}
        className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
                onClick={() => onLinkClick(link)}
                className="relative flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-200 group/sub overflow-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
