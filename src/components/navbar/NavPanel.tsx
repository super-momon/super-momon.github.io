"use client";

import { useState } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { type NavLink } from "@/lib/constants";

export interface NavPanelProps {
  links: NavLink[];
  icons: Record<string, IconDefinition>;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

const LINK_METADATA: Record<
  string,
  {
    title: string;
    subtitle: string;
    detailTitle: string;
    detailDescription: string;
    detailCta: string;
    tag?: string;
  }
> = {
  "/": {
    title: "Home Portal",
    subtitle: "Back to the beginning",
    detailTitle: "Developer Workspace",
    detailDescription: "Welcome to my digital home. Explore interactive features, scroll animations, and dynamic widgets.",
    detailCta: "Go Home",
    tag: "Start Here"
  },
  "/#about": {
    title: "About Me",
    subtitle: "My story & background",
    detailTitle: "Mark Raymond Ayade",
    detailDescription: "A Full Stack Developer specializing in AI-assisted coding, modern React architectures, and seamless user experiences.",
    detailCta: "Meet Mark",
    tag: "Bio"
  },
  "/#experience": {
    title: "Experience",
    subtitle: "My professional journey",
    detailTitle: "Work & Contributions",
    detailDescription: "Explore my role history, software projects, and how I help teams ship clean code faster.",
    detailCta: "View History",
    tag: "Career"
  },
  "/#projects": {
    title: "Projects",
    subtitle: "Things I have built",
    detailTitle: "Featured Projects",
    detailDescription: "A curated collection of web apps, tools, and platforms showing full stack proficiency.",
    detailCta: "See Projects",
    tag: "Portfolio"
  },
  "/#skills": {
    title: "Tech Stack",
    subtitle: "My development toolkit",
    detailTitle: "Skills & Languages",
    detailDescription: "Proficient in TypeScript, React, Next.js, Node.js, Python, CSS Grid, and responsive design systems.",
    detailCta: "View Stack",
    tag: "Capabilities"
  },
  "/#education": {
    title: "Education",
    subtitle: "Credentials & studies",
    detailTitle: "Academic & Training",
    detailDescription: "Degrees, certifications, and continuous self-improvement tracks that shape my engineering expertise.",
    detailCta: "View Certs",
    tag: "Learning"
  },
  "/#contact": {
    title: "Contact",
    subtitle: "Let's work together",
    detailTitle: "Get in Touch",
    detailDescription: "Have an exciting project, a job opening, or just want to say hi? Drop me a message directly.",
    detailCta: "Connect Now",
    tag: "Direct Line"
  },
  "/games/quiz": {
    title: "Developer Quiz",
    subtitle: "Test your coding knowledge",
    detailTitle: "Code Trivia Challenge",
    detailDescription: "Challenge yourself with interactive dev questions! Compete for the high score and test your frontend mastery.",
    detailCta: "Play Game",
    tag: "Interactive"
  }
};

export default function NavPanel({ links, icons, isOpen, onMouseEnter, onMouseLeave, onClose }: NavPanelProps) {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setHoveredHref(null);
    }
  }

  const activeHref = hoveredHref || links[0]?.href;
  const activeMeta = LINK_METADATA[activeHref] || {
    title: activeHref ? (links.find(l => l.href === activeHref)?.label || "Explore") : "Explore",
    subtitle: "Navigate the site",
    detailTitle: "More Details",
    detailDescription: "Hover over menu links to see more details about this section.",
    detailCta: "Learn More"
  };

  const isSingleLink = links.length === 1;
  const widthClass = isSingleLink ? "w-[480px]" : "w-[580px]";

  return (
    <div
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 transition-all duration-250 ease-out z-50 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 translate-y-2 pointer-events-none invisible"
      } ${widthClass}`}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Caret */}
      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[var(--color-surface)] border-l border-t border-[var(--color-border)] z-10" />

      <div className="relative bg-[var(--color-surface)]/98 backdrop-blur-2xl border border-[var(--color-border)] rounded-2xl shadow-2xl shadow-black/35 p-3 overflow-hidden flex gap-3">
        {/* Visual glass gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/10 to-transparent pointer-events-none rounded-2xl" />

        {/* Left Column: Link List */}
        <div className="relative z-10 flex flex-col gap-1 flex-1 min-w-0">
          {links.map((link) => {
            const meta = LINK_METADATA[link.href];
            const isHovered = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={onClose}
                onMouseEnter={() => setHoveredHref(link.href)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                  isHovered
                    ? "bg-[var(--color-background)]/80 shadow-sm border border-[var(--color-border)]/50"
                    : "hover:bg-[var(--color-background)]/40 border border-transparent"
                }`}
              >
                {/* Active Indicator on Left */}
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--color-accent)] rounded-full transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                }`} />

                {/* Icon block */}
                <span className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isHovered
                    ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] shadow-sm"
                    : "bg-[var(--color-background)]/80 text-[var(--color-muted)] group-hover/link:bg-[var(--color-accent)]/10 group-hover/link:text-[var(--color-accent)]"
                }`}>
                  {icons[link.href] && (
                    <FontAwesomeIcon
                      icon={icons[link.href]}
                      className="text-xs transition-transform duration-300 group-hover/link:scale-110"
                      aria-hidden="true"
                    />
                  )}
                </span>

                {/* Text Content */}
                <div className="flex flex-col text-left min-w-0">
                  <span className={`text-xs font-semibold leading-tight transition-colors duration-300 ${
                    isHovered ? "text-[var(--color-foreground)]" : "text-[var(--color-foreground)]/75 group-hover/link:text-[var(--color-foreground)]"
                  }`}>
                    {meta?.title || link.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-foreground)]/60 font-normal leading-normal mt-0.5 max-w-[200px] truncate group-hover/link:text-[var(--color-foreground)]/80 transition-colors duration-300">
                    {meta?.subtitle || "Explore this page section"}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Column Divider */}
        <div className="w-[1px] bg-[var(--color-border)] self-stretch my-1 shrink-0" aria-hidden="true" />

        {/* Right Column: Detail View */}
        <div className="relative z-10 w-[220px] bg-[var(--color-background)]/50 border border-[var(--color-border)]/70 rounded-xl p-4 flex flex-col justify-between shrink-0 select-none">
          <div>
            {/* Tag */}
            {activeMeta.tag && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[9px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                {activeMeta.tag}
              </span>
            )}

            {/* Title */}
            <h4 className="text-xs font-bold text-[var(--color-foreground)] mt-2.5 tracking-tight line-clamp-1">
              {activeMeta.detailTitle}
            </h4>

            {/* Description */}
            <p className="text-[11px] text-[var(--color-foreground)]/80 leading-relaxed mt-2 font-normal">
              {activeMeta.detailDescription}
            </p>
          </div>

          {/* CTA Link (Visual indicator) */}
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-accent)] font-semibold mt-4 group/cta cursor-pointer">
            <span>{activeMeta.detailCta}</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-[9px] transition-transform duration-300 group-hover/cta:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
