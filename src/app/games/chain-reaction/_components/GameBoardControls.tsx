'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRotateRight, 
  faVolumeUp, 
  faVolumeMute,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { Player } from './GameBoard';

interface GameBoardControlsProps {
  isOnline: boolean;
  isHost: boolean;
  isAnimating: boolean;
  activePlayer: { name: string; color: string };
  activePlayerThemeColor: string;
  isMyTurn: boolean;
  totalOrbsCount: number;
  secondsElapsed: number;
  myPlayer: Player | undefined;
  myPlayerColor: string;
  zoomLevel: 'sm' | 'md' | 'lg';
  setZoomLevel: (lvl: 'sm' | 'md' | 'lg') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onQuitClick: () => void;
  onResetClick: () => void;
  onOpenGuide: () => void;
}

export function GameBoardControls({
  isOnline,
  isHost,
  isAnimating,
  activePlayer,
  activePlayerThemeColor,
  isMyTurn,
  totalOrbsCount,
  secondsElapsed,
  myPlayer,
  myPlayerColor,
  zoomLevel,
  setZoomLevel,
  soundEnabled,
  setSoundEnabled,
  onQuitClick,
  onResetClick,
  onOpenGuide,
}: GameBoardControlsProps) {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-[var(--color-surface)]/90 border border-[var(--color-border)] p-4 rounded-2xl shadow-sm backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <button
          onClick={onQuitClick}
          aria-label="Quit game and return to setup"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> {isOnline ? 'Leave Room' : 'Quit Setup'}
        </button>
        
        {(!isOnline || isHost) && (
          <button
            onClick={onResetClick}
            disabled={isAnimating}
            aria-label="Reset board to restart game"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faRotateRight} /> Reset
          </button>
        )}

        <button
          onClick={onOpenGuide}
          aria-label="Show gameplay rules"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faCircleInfo} /> Guide
        </button>
      </div>

      {/* Turn & Session Stats Indicator */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-muted)] tracking-wider uppercase">Turn</span>
          <div
            className="px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
            style={{
              borderColor: activePlayerThemeColor,
              backgroundColor: `${activePlayerThemeColor}15`,
              color: activePlayerThemeColor,
              boxShadow: `0 0 10px ${activePlayerThemeColor}25`,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: activePlayerThemeColor }}
            />
            {activePlayer.name}
            {isOnline && isMyTurn && (
              <span className="text-[10px] text-green-500 font-extrabold ml-1 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
                (You)
              </span>
            )}
          </div>
        </div>

        <div className="px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span className="text-[var(--color-muted)]">Total Orbs:</span>
          <span className="text-[var(--color-foreground)]">{totalOrbsCount}</span>
        </div>

        <div className="px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span className="text-[var(--color-muted)]">Duration:</span>
          <span className="text-[var(--color-foreground)]">{formatTime(secondsElapsed)}</span>
        </div>
      </div>

      {/* Board Zoom & Sound Controls */}
      <div className="flex items-center gap-3">
        {isOnline && (
          <div className="flex items-center gap-2 text-xs font-bold bg-[var(--color-surface)] px-3 py-1.5 rounded-xl border border-[var(--color-border)]/80">
            <span className="text-[var(--color-muted)]">You:</span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
              style={{
                backgroundColor: myPlayerColor,
              }}
            />
            <span className="text-[var(--color-foreground)] truncate max-w-[80px]">
              {myPlayer?.name}
            </span>
          </div>
        )}

        {/* Zoom Buttons */}
        <div className="flex bg-[var(--color-surface)] rounded-lg p-0.5 border border-[var(--color-border)]/80">
          {(['sm', 'md', 'lg'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setZoomLevel(lvl)}
              aria-label={`Set cell size to ${lvl}`}
              className={`p-1.5 px-2.5 text-xs font-bold rounded-md transition ${zoomLevel === lvl ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'}`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label={soundEnabled ? "Mute game sounds" : "Unmute game sounds"}
          className="w-8 h-8 rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
        >
          <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} />
        </button>
      </div>
    </div>
  );
}
