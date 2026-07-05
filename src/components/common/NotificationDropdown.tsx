"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faPalette,
  faChartLine,
  faBriefcase,
  faInbox,
  faArrowRight,
  faAtom,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

interface Notification {
  id: number;
  text: string;
  icon: IconDefinition;
  timestamp: string;
  color: string;
  link?: string;
  linkText?: string;
}

const notifications: Notification[] = [
  {
    id: 5,
    text: "⚛️ Introducing Chain Reaction! A tactical pass-and-play game of grid domination and explosive cascades. Challenge friends and dominate the board.",
    icon: faAtom,
    timestamp: "July 05, 2026",
    color: "text-emerald-500",
    link: "/games/chain-reaction",
    linkText: "Play Now",
  },
  {
    id: 4,
    text: "🎯 I built an interactive quiz app to sharpen and gauge my own programming skills — and for anyone else looking to do the same! Explore 12 topics: JavaScript, Python, AWS & more.",
    icon: faChartLine,
    timestamp: "June 29, 2026",
    color: "text-blue-500",
    link: "/games/quiz",
    linkText: "Play Now",
  },
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
    link: "/#about",
    linkText: "View Assessment",
  },
  {
    id: 1,
    text: "💼 Actively seeking new opportunities! Open to full-time roles and exciting projects",
    icon: faBriefcase,
    timestamp: "June 01, 2026",
    color: "text-green-500",
    link: "/#contact",
    linkText: "Get in touch",
  },
];

/**
 * Notification dropdown displaying recent portfolio updates.
 * Auto-closes on outside click or page scroll.
 */
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useMagneticEffect(0.25);

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

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/50 backdrop-blur-sm transition-all duration-300 will-change-transform group"
        style={{ transitionProperty: "color, background-color, border-color" }}
      >
        <span suppressHydrationWarning>
          <FontAwesomeIcon
            icon={faBell}
            className={`text-base transition-transform duration-300 ${isOpen ? "scale-110 rotate-12" : "group-hover:scale-110"
              }`}
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
          className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 mt-3 sm:w-[360px] max-w-[calc(100vw-2rem)] z-50 origin-top-right"
          style={{ animation: "dropdownSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          role="menu"
        >
          {/* Caret */}
          <div className="hidden sm:block absolute -top-[6px] right-[14px] w-3 h-3 rotate-45 bg-[var(--color-surface)] border-l border-t border-[var(--color-border)] z-10" />

          <div className="relative bg-[var(--color-surface)]/98 backdrop-blur-2xl border border-[var(--color-border)] rounded-2xl shadow-2xl shadow-black/35 overflow-hidden">
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)]/50 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/30">
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

            {/* Notifications list */}
            <div className="relative max-h-[480px] overflow-y-auto custom-scrollbar">
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
                notifications.map((notification, index) => {
                  const isClickable = !!notification.link;
                  const className = `relative flex items-start gap-3.5 px-5 py-4 hover:bg-[var(--color-surface)]/50 transition-all duration-300 border-b border-[var(--color-border)]/30 last:border-b-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`;
                  const style = {
                    animation: `notificationSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`,
                  };

                  const innerContent = (
                    <>
                      {/* Hover accent indicator */}
                      {isClickable && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--color-accent)] rounded-full transition-all duration-300 opacity-0 scale-y-50 group-hover:opacity-100 group-hover:scale-y-100" />
                      )}

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5 relative">
                        <div
                          className={`absolute inset-0 ${notification.color} opacity-20 blur-lg rounded-full`}
                        />
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)]/50 transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--color-accent)]/30">
                          <FontAwesomeIcon
                            icon={notification.icon}
                            className={`${notification.color} text-base transition-transform duration-300 group-hover:scale-110`}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-[var(--color-foreground)] leading-relaxed font-medium">
                          {notification.text}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-[10px]"
                            />
                            <span>{notification.timestamp}</span>
                          </div>

                          {isClickable && (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-accent)] group-hover:text-[var(--color-accent-hover)] bg-[var(--color-accent)]/5 group-hover:bg-[var(--color-accent)]/10 rounded-lg transition-all duration-300"
                            >
                              {notification.linkText}
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-[9px] translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300"
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
                        onClick={() => setIsOpen(false)}
                        role="menuitem"
                        className={className}
                        style={style}
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
                      style={style}
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
