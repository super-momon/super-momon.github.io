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
          className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 mt-3 sm:w-[360px] max-w-[calc(100vw-2rem)] bg-[var(--color-background)]/95 backdrop-blur-xl border border-[var(--color-border)]/50 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50 origin-top-right"
          style={{ animation: "dropdownSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          role="menu"
        >
          {/* Glass overlay */}
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
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="relative px-5 py-4 hover:bg-[var(--color-surface)]/50 transition-all duration-300 border-b border-[var(--color-border)]/30 last:border-b-0 group cursor-pointer"
                  style={{
                    animation: `notificationSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s backwards`,
                  }}
                  role="menuitem"
                >
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent)] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                  <div className="flex items-start gap-3.5">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5 relative">
                      <div
                        className={`absolute inset-0 ${notification.color} opacity-20 blur-lg rounded-full`}
                      />
                      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)]/50">
                        <FontAwesomeIcon
                          icon={notification.icon}
                          className={`${notification.color} text-base`}
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

                        {notification.link && (
                          <a
                            href={notification.link}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 rounded-lg transition-all duration-200 group/link"
                          >
                            {notification.linkText}
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="text-[9px] group-hover/link:translate-x-0.5 transition-transform"
                            />
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
