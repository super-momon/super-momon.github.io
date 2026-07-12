"use client";

import React from "react";

export interface NavTriggerProps {
  label: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

export default function NavTrigger({ label, isOpen, onMouseEnter, onMouseLeave, children }: NavTriggerProps) {
  return (
    <li className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="relative px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 group overflow-hidden flex items-center gap-1.5 cursor-default focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
