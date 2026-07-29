"use client";

import React from "react";

export interface NavTriggerProps {
  label: string;
  isOpen: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

export default function NavTrigger({
  label,
  isOpen,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}: NavTriggerProps) {
  return (
    <li className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={onClick}
        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden flex items-center gap-2 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          isOpen || isActive
            ? "text-[var(--color-foreground)] bg-[var(--color-surface)]/70"
            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        }`}
      >
        <span className="absolute inset-0 bg-[var(--color-surface)]/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl" />
        <span className="absolute inset-0 rounded-xl border border-[var(--color-border)]/0 group-hover:border-[var(--color-border)]/50 transition-all duration-300" />
        
        {isActive && (
          <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)] shrink-0" aria-hidden="true" />
        )}
        
        <span className="relative z-10">{label}</span>
        
        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-[var(--color-accent)] transition-all duration-300 ${
          isOpen || isActive ? "w-8" : "w-0 group-hover:w-8"
        }`} />
      </button>
      {children}
    </li>
  );
}

