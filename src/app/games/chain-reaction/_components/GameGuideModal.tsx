'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameGuideModal({
  isOpen,
  onClose,
}: GameGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity" 
      />
      
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-3xl p-6 shadow-2xl overflow-hidden glass-panel text-xs text-[var(--color-muted)] z-10 animate-in fade-in zoom-in duration-200">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[var(--color-border)]/30 pb-3">
          <h4 className="text-[var(--color-foreground)] font-bold text-sm flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCircleInfo} className="text-[var(--color-accent)] text-base" />
            Critical Mass Explosion Guide
          </h4>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-muted)]/50 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-background)] transition cursor-pointer font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Guide Grid */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Corners</span>
            <span className="text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">2 Orbs</span>
            <span className="text-[9px] text-[var(--color-muted)] leading-tight mt-0.5">Explodes to 2 neighbors</span>
          </div>
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Edges</span>
            <span className="text-[10px] text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">3 Orbs</span>
            <span className="text-[9px] text-[var(--color-muted)] leading-tight mt-0.5">Explodes to 3 neighbors</span>
          </div>
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Inner Cells</span>
            <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">4 Orbs</span>
            <span className="text-[9px] text-[var(--color-muted)] leading-tight mt-0.5">Explodes to 4 neighbors</span>
          </div>
        </div>

        <p className="leading-relaxed text-center border-t border-[var(--color-border)]/30 pt-3">
          <strong className="text-[var(--color-foreground)]">How to win:</strong> Place orbs on empty or owned cells. When a cell reaches critical mass (orbs = adjacent neighbors), it explodes, claiming and distributing orbs to neighbors. Eliminate all other players to dominate!
        </p>
      </div>
    </div>
  );
}
