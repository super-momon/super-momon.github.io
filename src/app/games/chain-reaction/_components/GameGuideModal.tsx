'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useDialogFocus } from '@/hooks/useDialogFocus';

interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameGuideModal({
  isOpen,
  onClose,
}: GameGuideModalProps) {
  const dialogRef = useDialogFocus<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chain-reaction-guide-title"
        tabIndex={-1}
        className="relative z-10 max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-4 text-xs text-slate-800 shadow-2xl glass-panel dark:text-slate-200 sm:max-h-[90vh] sm:rounded-3xl sm:p-6 animate-in fade-in zoom-in duration-200 custom-scrollbar"
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-[var(--color-border)]/30 pb-2.5 sm:pb-3 sticky top-0 bg-[var(--color-surface)]/95 backdrop-blur-md z-20">
          <h4 id="chain-reaction-guide-title" className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-foreground)]">
            <FontAwesomeIcon icon={faCircleInfo} className="text-[var(--color-accent)] text-base" />
            Critical Mass Explosion Guide
          </h4>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close guide modal"
            data-dialog-autofocus
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-xs font-bold text-[var(--color-muted)] transition hover:border-[var(--color-muted)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Guide Grid */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Corners</span>
            <span className="rounded-full border border-[var(--color-status-medium)]/20 bg-[var(--color-status-medium)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-status-medium)]">2 Orbs</span>
            <span className="mt-0.5 text-xs leading-tight text-slate-600 dark:text-slate-400">Explodes to 2 neighbors</span>
          </div>
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Edges</span>
            <span className="rounded-full border border-[var(--color-status-hard)]/20 bg-[var(--color-status-hard)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-status-hard)]">3 Orbs</span>
            <span className="mt-0.5 text-xs leading-tight text-slate-600 dark:text-slate-400">Explodes to 3 neighbors</span>
          </div>
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Inner Cells</span>
            <span className="rounded-full border border-[var(--color-status-extra-hard)]/20 bg-[var(--color-status-extra-hard)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-status-extra-hard)]">4 Orbs</span>
            <span className="mt-0.5 text-xs leading-tight text-slate-600 dark:text-slate-400">Explodes to 4 neighbors</span>
          </div>
        </div>

        <p className="leading-relaxed text-center border-t border-[var(--color-border)]/30 pt-3">
          <strong className="text-[var(--color-foreground)]">How to win:</strong> Place orbs on empty or owned cells. When a cell reaches critical mass (orbs = adjacent neighbors), it explodes, claiming and distributing orbs to neighbors. Eliminate all other players to dominate!
        </p>

        {/* Special Mechanics Guide */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]/30">
          <h5 className="text-[var(--color-foreground)] font-bold text-sm mb-3">Special Cells</h5>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl">
              <span className="text-[var(--color-foreground)] font-bold block mb-1">🧱 Wall</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Impenetrable cell. Orbs cannot enter or explode into it.</span>
            </div>
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl">
              <span className="text-[var(--color-foreground)] font-bold block mb-1">🌀 Portal</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Teleports exploding orbs directly to its linked destination cell.</span>
            </div>
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl">
              <span className="text-[var(--color-foreground)] font-bold block mb-1">✨ Multiplier</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Place an orb here and it counts as 2 orbs, letting you reach critical mass faster.</span>
            </div>
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl">
              <span className="text-[var(--color-foreground)] font-bold block mb-1">⚫ Black Hole</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Absorbs all incoming exploding orbs throughout the entire game session.</span>
            </div>
          </div>
        </div>

        {/* Player Abilities Guide */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]/30">
          <h5 className="text-[var(--color-foreground)] font-bold text-sm mb-3">Player Abilities (Consumes Turn)</h5>
          <div className="grid grid-cols-1 gap-2 text-left">
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2 rounded-lg flex items-center gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold w-16 flex-shrink-0">🛡️ Shield</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Protects one of your cells from being overtaken by an enemy explosion until your next turn.</span>
            </div>
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2 rounded-lg flex items-center gap-3">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold w-16 flex-shrink-0">❄️ Freeze</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Prevents an enemy cell from exploding until your next turn.</span>
            </div>
            <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2 rounded-lg flex items-center gap-3">
              <span className="text-red-600 dark:text-red-400 font-bold w-16 flex-shrink-0">🧨 Detonate</span>
              <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">Forces one of your cells to explode immediately, costing 1 orb.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
