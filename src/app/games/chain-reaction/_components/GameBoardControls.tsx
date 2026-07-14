'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRotateRight, 
  faVolumeUp, 
  faVolumeMute,
  faCircleInfo,
  faShieldHalved,
  faSnowflake,
  faBomb
} from '@fortawesome/free-solid-svg-icons';
import { Player } from './GameBoard';

export type Ability = 'shield' | 'freeze' | 'detonate';

interface GameBoardControlsProps {
  isOnline: boolean;
  isHost: boolean;
  isAnimating: boolean;
  activePlayer: Player;
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
    <div className="w-full flex flex-col lg:flex-row gap-4 items-center justify-between mb-6 bg-[var(--color-surface)]/90 border border-[var(--color-border)] p-3 sm:p-4 rounded-2xl shadow-sm backdrop-blur-md">
      {/* Action Buttons: Quit, Reset, Guide */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-2 items-center w-full lg:w-auto">
        <button
          onClick={onQuitClick}
          aria-label="Quit game and return to setup"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="hidden sm:inline">
            {isOnline ? 'Leave Room' : 'Quit Setup'}
          </span>
          <span className="sm:hidden">
            {isOnline ? 'Leave' : 'Quit'}
          </span>
        </button>
        
        {(!isOnline || isHost) && (
          <button
            onClick={onResetClick}
            disabled={isAnimating}
            aria-label="Reset board to restart game"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faRotateRight} /> Reset
          </button>
        )}

        <button
          onClick={onOpenGuide}
          aria-label="Show gameplay rules"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faCircleInfo} /> Guide
        </button>
      </div>

      {/* Turn & Session Stats Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-muted)] tracking-wider uppercase">Turn</span>
          <div
            className="w-[160px] sm:w-[220px] justify-center flex-shrink-0 px-3 sm:px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
            style={{
              borderColor: activePlayerThemeColor,
              backgroundColor: `${activePlayerThemeColor}15`,
              color: activePlayerThemeColor,
              boxShadow: `0 0 10px ${activePlayerThemeColor}25`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping flex-shrink-0"
              style={{ backgroundColor: activePlayerThemeColor }}
            />
            <div className="flex items-center justify-center gap-1.5 min-w-0 max-w-[calc(100%-16px)]">
              <span className="truncate max-w-[70px] sm:max-w-[120px]" title={activePlayer.name}>
                {activePlayer.name}
              </span>
              {isOnline && isMyTurn && (
                <span className="text-[8px] text-green-600 dark:text-green-400 font-extrabold bg-green-500/10 px-1 py-0.25 rounded border border-green-500/20 flex-shrink-0 leading-none">
                  YOU
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="px-3 sm:px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="text-[var(--color-muted)] hidden sm:inline">Total Orbs:</span>
            <span className="text-[var(--color-muted)] sm:hidden">Orbs:</span>
            <span className="text-[var(--color-foreground)]">{totalOrbsCount}</span>
          </div>

          <div className="px-3 sm:px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="text-[var(--color-muted)] hidden sm:inline">Duration:</span>
            <span className="text-[var(--color-muted)] sm:hidden">Time:</span>
            <span className="text-[var(--color-foreground)]">{formatTime(secondsElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Board Zoom & Sound Controls */}
      <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
        {isOnline && (
          <div className="flex items-center gap-1.5 text-xs font-bold bg-[var(--color-surface)] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--color-border)]/80">
            <span className="text-[var(--color-muted)] hidden sm:inline">You:</span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
              style={{
                backgroundColor: myPlayerColor,
              }}
            />
            <span className="text-[var(--color-foreground)] truncate max-w-[60px] sm:max-w-[80px]">
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
              className={`p-1 sm:p-1.5 px-2 sm:px-2.5 text-[10px] sm:text-xs font-bold rounded-md transition ${
                zoomLevel === lvl ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label={soundEnabled ? "Mute game sounds" : "Unmute game sounds"}
          className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition cursor-pointer"
        >
          <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} />
        </button>
      </div>
    </div>
  );
}
