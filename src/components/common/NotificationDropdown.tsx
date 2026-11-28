"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChartLine,
  faBriefcase,
  faInbox,
  faArrowRight,
  faAtom,
  faComments,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Notification {
  id: number;
  headline?: string;
  text: string;
  icon: IconDefinition;
  timestamp: string;
  link?: string;
  linkText?: string;
}

const notifications: Notification[] = [
  {
    id: 7,
    headline: "Promotion: Full Stack Developer - Mid Level",
    text: "💼 Promoted to Full Stack Developer - Mid Level at Talleco.com Inc. | JobTarget PH.",
    icon: faBriefcase,
    timestamp: "August 2026",
    link: "/#experience",
    linkText: "View Experience",
  },
  {
    id: 6,
    headline: "Open Post is Live!",
    text: "📌 Introducing Open Post! An infinite anonymous spatial canvas board for posting sticky notes, nested comments, and real-time ideas with zero sign-up.",
    icon: faComments,
    timestamp: "August 02, 2026",
    link: "https://openboard-post.vercel.app/",
    linkText: "Visit Open Post",
  },
  {
    id: 5,
    headline: "Chain Reaction Game",
    text: "⚛️ Introducing Chain Reaction! A tactical pass-and-play game of grid domination and explosive cascades. Challenge friends and dominate the board.",
    icon: faAtom,
    timestamp: "July 05, 2026",
    link: "/games/chain-reaction",
    linkText: "Play Now",
  },
  {
    id: 4,
    headline: "Developer Quiz App",
    text: "🎯 I built an interactive quiz app to sharpen and gauge my own programming skills — and for anyone else looking to do the same! Explore 12 topics: JavaScript, Python, AWS & more.",
    icon: faChartLine,
    timestamp: "June 29, 2026",
    link: "/games/quiz",
    linkText: "Play Now",
  },
  {
    id: 3,
    headline: "Website Design Refresh",
    text: "✨ Refreshed website design with smooth animations, enhanced mobile experience, and modern aesthetic",
    icon: faPalette,
    timestamp: "June 21, 2026",
  },
  {
    id: 2,
    headline: "Workplace Assessment",
    text: "🎯 Completed Workplace Insight Professional Assessment by Criteria Corp",
    icon: faChartLine,
    timestamp: "June 20, 2026",
    link: "/#about",
    linkText: "View Assessment",
  },
  {
    id: 1,
    headline: "Open to Opportunities",
    text: "💼 Actively seeking new opportunities! Open to full-time roles and exciting projects",
    icon: faBriefcase,
    timestamp: "June 01, 2026",
    link: "/#contact",
    linkText: "Get in touch",
  },
];

/**
 * Notification dropdown displaying recent portfolio updates.
 * Auto-closes on outside click or page scroll.
 */
export default function NotificationDropdown() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

    const handleScroll = () => setIsOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="notification-menu"
        className={`design-elevated-control relative min-h-11 min-w-11 rounded-xl border px-2.5 sm:px-3 flex items-center gap-2 bg-[var(--color-surface)]/60 hover:bg-[var(--color-surface)] transition-all duration-300 group cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          isOpen
            ? "border-[var(--color-accent)]/50 text-[var(--color-foreground)]"
            : "border-[var(--color-border)]/60 text-[var(--color-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-foreground)]"
        }`}
        style={{ transitionProperty: "color, background-color, border-color, box-shadow" }}
      >
        <div className="relative flex items-center justify-center">
          <span suppressHydrationWarning>
            <FontAwesomeIcon
              icon={faBell}
              className={`text-sm sm:text-base transition-transform duration-300 ${
                isOpen ? "scale-110 rotate-12 text-[var(--color-accent)]" : "group-hover:scale-110 text-[var(--color-accent)]"
              }`}
              suppressHydrationWarning
            />
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          id="notification-menu"
          className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 mt-3 h-[480px] max-h-[calc(100dvh-7rem)] sm:w-[360px] max-w-[calc(100vw-2rem)] z-50 origin-top-right"
          style={
            shouldReduceMotion
              ? undefined
              : { animation: "dropdownSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }
          }
          role="menu"
        >
          {/* Caret */}
          <div className="design-dialog hidden sm:block absolute -top-[6px] right-[14px] w-3 h-3 rotate-45 border-l border-t border-[var(--color-border)] z-10" />

          <div className="design-dialog relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-2xl shadow-black/35">
            {/* Header */}
            <div className="relative shrink-0 border-b border-[var(--color-border)] px-5 py-4">
              <h3 className="text-sm font-bold text-[var(--color-foreground)] tracking-tight">
                Recent updates
              </h3>
            </div>

            {/* Notifications list */}
            <div className="relative min-h-0 flex-1 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface)]/50 mb-3">
                    <FontAwesomeIcon
                      icon={faInbox}
                      className="text-2xl text-[var(--color-muted)]"
                    />
                  </div>
                  <p className="text-sm text-[var(--color-muted)] font-medium">
                    All caught up!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const isClickable = !!notification.link;
                  const className = `relative grid h-32 grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border-b border-[var(--color-border)]/40 px-4 py-3 transition-colors duration-200 last:border-b-0 hover:bg-[var(--color-background)]/55 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`;

                  const innerContent = (
                    <>
                      {/* Hover accent indicator */}
                      {isClickable && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--color-accent)] rounded-full transition-all duration-300 opacity-0 scale-y-50 group-hover:opacity-100 group-hover:scale-y-100" />
                      )}

                      {/* Icon */}
                      <div className="design-elevated-control relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)]/50 transition-colors duration-200 group-hover:border-[var(--color-accent)]/30">
                        <FontAwesomeIcon
                          icon={notification.icon}
                          className="text-sm text-[var(--color-accent)]"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-col overflow-hidden">
                        {notification.headline && (
                          <h4 className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                            {notification.headline}
                          </h4>
                        )}
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                          {notification.text}
                        </p>

                        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-2">
                          <div className="flex min-w-0 items-center gap-1.5 text-xs text-[var(--color-muted)]">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="shrink-0 text-xs"
                            />
                            <span className="truncate">{notification.timestamp}</span>
                          </div>

                          {isClickable && (
                            <span
                              className="inline-flex min-w-0 shrink-0 items-center gap-1 text-xs font-semibold text-[var(--color-accent)] group-hover:text-[var(--color-accent-hover)]"
                            >
                              <span className="truncate">{notification.linkText}</span>
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="shrink-0 text-xs transition-transform duration-200 group-hover:translate-x-0.5"
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  );

                  if (isClickable) {
                    return (
                      <a
                        key={notification.id}
                        href={notification.link}
                        target={notification.link?.startsWith("http") ? "_blank" : undefined}
                        rel={notification.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                        onClick={() => setIsOpen(false)}
                        role="menuitem"
                        className={className}
                      >
                        {innerContent}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={notification.id}
                      role="menuitem"
                      className={className}
                    >
                      {innerContent}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
