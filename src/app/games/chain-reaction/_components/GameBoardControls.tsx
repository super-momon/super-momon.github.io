'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRotateRight, 
  faVolumeUp, 
  faVolumeMute,
  faCircleInfo,
  faClock,
  faCircleDot,
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

  const actionButtonClass = 'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] px-2.5 text-xs font-bold text-[var(--color-muted)] transition hover:bg-[var(--color-surface)]/80 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer';

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="game-controls-toolbar grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="game-controls-actions flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onQuitClick}
            aria-label="Quit game and return to setup"
            className={actionButtonClass}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{isOnline ? 'Leave' : 'Quit'}</span>
          </button>

          {(!isOnline || isHost) && (
            <button
              type="button"
              onClick={onResetClick}
              disabled={isAnimating}
              aria-label="Reset board to restart game"
              className={`${actionButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenGuide}
            aria-label="Show gameplay rules"
            className={actionButtonClass}
          >
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Guide</span>
          </button>
        </div>

        <div className="game-controls-preferences flex min-w-0 items-center justify-between gap-1.5 sm:justify-end">
          {isOnline && myPlayer && (
            <div className="hidden max-w-36 items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1.5 text-xs font-bold md:flex">
              <span className="text-xs font-bold uppercase text-[var(--color-muted)]">You:</span>
              <span
                className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                style={{ backgroundColor: myPlayerColor }}
              />
              <span className="text-[var(--color-foreground)] truncate max-w-[80px]">
                {myPlayer?.name}
              </span>
            </div>
          )}

          <div
            role="group"
            aria-label="Cell size"
            className="flex min-w-0 items-center gap-0.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-1"
          >
            <span className="hidden select-none px-1 text-xs font-bold uppercase text-[var(--color-muted)] md:inline">
              Zoom
            </span>
            {(['fit', 'sm', 'md', 'lg'] as const).map((lvl) => {
              const isSelected = zoomLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setZoomLevel(lvl)}
                  aria-label={`Set cell zoom to ${lvl}`}
                  aria-pressed={isSelected}
                  className={`flex min-h-10 min-w-9 items-center justify-center rounded-lg px-1.5 text-xs font-extrabold uppercase transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer sm:min-w-10 ${
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-xs text-[var(--color-muted)] transition hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer"
          >
            <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} />
          </button>
        </div>
      </div>

      <div className="game-controls-status flex min-w-0 flex-wrap items-center justify-between gap-1.5 border-t border-[var(--color-border)]/50 pt-2">
        <div
          className="flex min-w-[120px] flex-1 items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-colors"
          style={{
            borderColor: activePlayerThemeColor ? `${activePlayerThemeColor}50` : 'var(--color-border)',
            backgroundColor: activePlayerThemeColor ? `${activePlayerThemeColor}10` : 'var(--color-surface)',
            color: activePlayerThemeColor,
          }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 animate-pulse rounded-full"
              style={{ backgroundColor: activePlayerThemeColor }}
            />
            <span className="sr-only shrink-0 text-xs font-extrabold uppercase tracking-wider text-[var(--color-muted)] sm:not-sr-only">
              Turn
            </span>
            <span className="truncate font-bold" title={activePlayer.name}>
              {activePlayer.name}
            </span>
          </div>

          {isOnline && isMyTurn && (
            <span
              aria-label="Your turn"
              className="shrink-0 rounded-full border border-[var(--color-status-easy)]/30 bg-[var(--color-status-easy)]/15 px-1.5 py-1 text-xs font-extrabold leading-none text-[var(--color-status-easy)]"
            >
              YOU
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div
            role="group"
            aria-label="Current game stats"
            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 text-xs font-bold"
          >
            <FontAwesomeIcon icon={faCircleDot} className="text-[var(--color-muted)]" aria-hidden="true" />
            <span className="font-mono tabular-nums text-[var(--color-foreground)]">{totalOrbsCount}</span>
            <span className="game-stats-label sr-only text-xs font-bold uppercase text-[var(--color-muted)] sm:not-sr-only">Orbs</span>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 text-xs font-bold">
            <FontAwesomeIcon icon={faClock} className="text-[var(--color-muted)]" aria-hidden="true" />
            <span className="font-mono tabular-nums text-[var(--color-foreground)]">{formatTime(secondsElapsed)}</span>
            <span className="game-stats-label sr-only text-xs font-bold uppercase text-[var(--color-muted)] sm:not-sr-only">Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
