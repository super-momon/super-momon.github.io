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
export type ZoomLevel = 'fit' | 'xs' | 'sm' | 'md' | 'lg';

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
  zoomLevel: ZoomLevel;
  setZoomLevel: (lvl: ZoomLevel) => void;
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
    <div className="w-full flex flex-col gap-2.5 mb-3 sm:mb-5 bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 sm:p-3.5 rounded-2xl shadow-sm">
      {/* Top Row: Game Actions & View Settings */}
      <div className="flex items-center justify-between gap-2 w-full flex-wrap">
        {/* Left: Navigation, Reset, Rules */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onQuitClick}
            aria-label="Quit game and return to setup"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface)]/80 active:scale-95 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{isOnline ? 'Leave' : 'Quit'}</span>
          </button>
          
          {(!isOnline || isHost) && (
            <button
              onClick={onResetClick}
              disabled={isAnimating}
              aria-label="Reset board to restart game"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface)]/80 active:scale-95 transition disabled:opacity-40 cursor-pointer"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span className="hidden xs:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenGuide}
            aria-label="Show gameplay rules"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface)]/80 active:scale-95 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faCircleInfo} />
            <span className="hidden xs:inline">Rules</span>
          </button>
        </div>

        {/* Right: Online identity, Cell Size Toggle & Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isOnline && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-[var(--color-background)] px-2.5 py-1.5 rounded-xl border border-[var(--color-border)]">
              <span className="text-[var(--color-muted)] text-[10px] uppercase font-bold">You:</span>
              <span
                className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                style={{ backgroundColor: myPlayerColor }}
              />
              <span className="text-[var(--color-foreground)] truncate max-w-[80px]">
                {myPlayer?.name}
              </span>
            </div>
          )}

          {/* Cell Size Zoom Toggle (Fixed: White text on emerald accent for high contrast on both dark & light themes) */}
          <div className="flex items-center bg-[var(--color-background)] rounded-xl p-1 border border-[var(--color-border)] gap-0.5">
            <span className="text-[9px] font-bold text-[var(--color-muted)] uppercase px-1 hidden md:inline select-none">
              Size:
            </span>
            {(['fit', 'sm', 'md', 'lg'] as const).map((lvl) => {
              const isSelected = zoomLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setZoomLevel(lvl)}
                  aria-label={`Set cell zoom to ${lvl}`}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-extrabold rounded-lg transition-all active:scale-95 cursor-pointer uppercase ${
                    isSelected
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-sm'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Mute game sounds" : "Unmute game sounds"}
            className="w-8 h-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] active:scale-95 transition cursor-pointer text-xs"
          >
            <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Active Turn Banner + Orbs & Elapsed Time */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--color-border)]/50">
        {/* Active Player Turn Indicator */}
        <div
          className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition-colors"
          style={{
            borderColor: activePlayerThemeColor ? `${activePlayerThemeColor}50` : 'var(--color-border)',
            backgroundColor: activePlayerThemeColor ? `${activePlayerThemeColor}10` : 'var(--color-surface)',
            color: activePlayerThemeColor,
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
              style={{ backgroundColor: activePlayerThemeColor }}
            />
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-extrabold flex-shrink-0">
              TURN:
            </span>
            <span className="truncate font-bold" title={activePlayer.name}>
              {activePlayer.name}
            </span>
          </div>

          {isOnline && isMyTurn && (
            <span className="text-[8px] sm:text-[9px] text-green-500 font-extrabold bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/30 flex-shrink-0 leading-none">
              YOUR TURN
            </span>
          )}
        </div>

        {/* Stats: Total Orbs & Duration */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="px-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs font-bold flex items-center gap-1.5">
            <span className="text-[var(--color-muted)] text-[10px] uppercase font-bold">Orbs:</span>
            <span className="text-[var(--color-foreground)] font-mono font-bold">{totalOrbsCount}</span>
          </div>

          <div className="px-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs font-bold flex items-center gap-1.5">
            <span className="text-[var(--color-muted)] text-[10px] uppercase font-bold">Time:</span>
            <span className="text-[var(--color-foreground)] font-mono font-bold">{formatTime(secondsElapsed)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
