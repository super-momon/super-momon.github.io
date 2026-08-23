'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faSnowflake, 
  faBomb, 
  faCrown, 
  faCircleDot, 
  faSkull, 
  faWifi 
} from '@fortawesome/free-solid-svg-icons';
import { Player } from './GameBoard';
import { Cell, countPlayerOrbs } from './gameUtils';
import { getThemeColor } from './colors';
import { Ability } from './GameBoardControls';

interface PlayerStandingsProps {
  players: Player[];
  currentPlayerIndex: number;
  isAnimating: boolean;
  board: Cell[][];
  myClientId: string;
  isOnline: boolean;
  isDark: boolean;
  turnSecondsLeft: number;
  activeAbility: Ability | null;
  setActiveAbility: (ability: Ability | null) => void;
}

export function PlayerStandings({
  players,
  currentPlayerIndex,
  isAnimating,
  board,
  myClientId,
  isOnline,
  isDark,
  turnSecondsLeft,
  activeAbility,
  setActiveAbility,
}: PlayerStandingsProps) {
  const activeCardRef = React.useRef<HTMLDivElement | null>(null);

  // Compute total orbs on board and leader count for dynamic HUD features
  const playerOrbCounts = React.useMemo(() => {
    return players.map((p) => ({ id: p.id, count: countPlayerOrbs(board, p.id) }));
  }, [players, board]);

  const totalBoardOrbs = React.useMemo(() => {
    return playerOrbCounts.reduce((acc, curr) => acc + curr.count, 0);
  }, [playerOrbCounts]);

  const maxOrbs = React.useMemo(() => {
    return Math.max(...playerOrbCounts.map((o) => o.count), 0);
  }, [playerOrbCounts]);

  const activePlayers = players.filter((p) => p.active);

  // Auto-scroll active player card into view on mobile devices during gameplay
  React.useEffect(() => {
    if (activeCardRef.current && typeof window !== 'undefined' && window.innerWidth < 640) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentPlayerIndex]);

  return (
    <div className="w-full mb-3 sm:mb-6 select-none">
      {/* Container: Horizontal Snap-Scroll Strip on Mobile (<640px), Centered Flex Wrap with Fixed-Width Cards on Desktop (>=640px) */}
      <div className="flex sm:flex-wrap items-stretch justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-visible pb-1.5 sm:pb-0 px-0.5 player-scroll-strip">
        {players.map((p, idx) => {
          const isCurrent = idx === currentPlayerIndex && p.active && !isAnimating;
          const totalOrbs = playerOrbCounts.find((o) => o.id === p.id)?.count || 0;
          const isLocalPlayer = isOnline && p.clientId === myClientId;
          const playerThemeColor = getThemeColor(p.color, isDark);
          const isLeader = totalOrbs > 0 && totalOrbs === maxOrbs && activePlayers.length > 1;
          const dominancePercent = totalBoardOrbs > 0 ? Math.round((totalOrbs / totalBoardOrbs) * 100) : 0;
          
          return (
            <div
              key={p.id}
              ref={isCurrent ? activeCardRef : null}
              className={`relative overflow-hidden p-3 pt-3.5 rounded-2xl border-2 transition-colors duration-200 flex-shrink-0 w-[182px] sm:w-[194px] flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-[var(--color-surface)] z-10' 
                  : 'bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)]'
              } ${!p.active ? 'opacity-40 grayscale pointer-events-none' : ''} ${isOnline && !p.connected && p.active ? 'border-dashed opacity-75' : ''}`}
              style={{
                borderColor: isCurrent ? playerThemeColor : 'var(--color-border)',
                boxShadow: isCurrent ? `0 0 16px ${playerThemeColor}30` : undefined,
              }}
            >
              {/* Top Accent Strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-all" 
                style={{ 
                  backgroundColor: playerThemeColor,
                  opacity: isCurrent ? 1 : 0.5,
                  boxShadow: isCurrent ? `0 0 8px ${playerThemeColor}` : undefined,
                }}
              />

              {/* Card Main Body */}
              <div className="relative flex flex-col gap-2 w-full">
                {/* Top Meta Bar: Avatar, Leader Crown, "YOU" Badge, and Fixed-Width Status Slot */}
                <div className="flex items-center justify-between gap-1.5 min-w-0 h-6">
                  {/* Left: Avatar + Leader Crown + "YOU" badge */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Flat Avatar Dot with pure playerThemeColor glow (no white ring artifact) */}
                    <div 
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex-shrink-0 transition-transform"
                      style={{ 
                        backgroundColor: playerThemeColor,
                        boxShadow: isCurrent ? `0 0 8px ${playerThemeColor}` : undefined,
                        border: `1.5px solid ${isCurrent ? playerThemeColor : 'rgba(0,0,0,0.2)'}`,
                      }}
                    />

                    {/* Leader Crown Badge */}
                    {isLeader && p.active && (
                      <span 
                        className="text-amber-400 text-xs flex-shrink-0 animate-leader-crown inline-flex items-center drop-shadow-sm" 
                        title="Current Board Leader"
                      >
                        <FontAwesomeIcon icon={faCrown} />
                      </span>
                    )}

                    {/* Local Player "YOU" Badge */}
                    {isLocalPlayer && (
                      <span className="text-xs font-extrabold uppercase bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-1 py-0.5 rounded border border-[var(--color-accent)]/30 flex-shrink-0 leading-none scale-75 origin-left">
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Right: Reserved Fixed-Width Status Badge Slot (Prevents Name Shift) */}
                  <div className="flex items-center justify-end flex-shrink-0 min-w-[60px] h-6">
                    {!p.active ? (
                      <span className="text-xs font-extrabold text-red-400 bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded-md flex items-center gap-1 leading-none font-mono uppercase scale-90 origin-right">
                        <FontAwesomeIcon icon={faSkull} className="text-xs" /> OUT
                      </span>
                    ) : isOnline && !p.connected ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded-md flex items-center gap-1 leading-none font-mono tabular-nums scale-90 origin-right">
                        <FontAwesomeIcon icon={faWifi} className="text-xs animate-pulse" /> {p.disconnectSecondsLeft ?? 120}s
                      </span>
                    ) : isCurrent && p.connected ? (
                      <span 
                        className={`text-xs font-bold font-mono tabular-nums px-1.5 py-0.5 rounded-md border flex items-center gap-1 leading-none transition-colors scale-90 origin-right ${
                          turnSecondsLeft <= 10 
                            ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                            : 'bg-[var(--color-background)] border-[var(--color-border)]'
                        }`}
                        style={{
                          borderColor: turnSecondsLeft <= 10 ? undefined : playerThemeColor,
                          color: turnSecondsLeft <= 10 ? undefined : playerThemeColor
                        }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: turnSecondsLeft <= 10 ? 'var(--color-warning)' : playerThemeColor }} 
                        />
                        {Math.max(0, turnSecondsLeft)}s
                      </span>
                    ) : (
                      /* Idle state placeholder maintaining exact height and alignment */
                      <span className="text-xs font-semibold text-[var(--color-muted)]/40 tracking-wider uppercase px-1 scale-90 origin-right">
                        WAIT
                      </span>
                    )}
                  </div>
                </div>

                {/* Dedicated Full Player Name Display (Full width, wraps without truncation) */}
                <div className="min-h-[2rem] flex items-center w-full">
                  <span 
                    className="text-xs sm:text-sm font-bold leading-snug break-words line-clamp-2 transition-colors w-full" 
                    style={{ color: isCurrent ? playerThemeColor : 'var(--color-foreground)' }}
                    title={p.name}
                  >
                    {p.name}
                  </span>
                </div>

                {/* Orb Dominance Bar & Count Display */}
                <div className="bg-[var(--color-background)]/70 rounded-xl px-2.5 py-2 border border-[var(--color-border)]/60 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1 scale-90 origin-left">
                      <FontAwesomeIcon icon={faCircleDot} className="text-xs" style={{ color: playerThemeColor }} />
                      Dominance
                    </span>
                    <div className="flex items-baseline gap-1 font-mono tabular-nums">
                      <span className="text-sm sm:text-base font-extrabold text-[var(--color-foreground)] leading-none">
                        {totalOrbs}
                      </span>
                      <span className="text-xs font-medium text-[var(--color-muted)] scale-90 origin-right">
                        ({dominancePercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Dominance Progress Bar */}
                  <div className="w-full h-1.5 bg-black/15 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300 ease-out"
                      style={{ 
                        width: `${Math.max(3, dominancePercent)}%`,
                        backgroundColor: p.active ? playerThemeColor : 'var(--color-muted)',
                      }}
                    />
                  </div>
                </div>

                {/* Power-Up Abilities Action Bar (Equal 3-column Grid, Zero Button Scale Shift) */}
                <div className="grid grid-cols-3 gap-1.5 pt-0.5 w-full">
                  {(['shield', 'freeze', 'detonate'] as const).map((ability) => {
                    const count = p.powers[ability];
                    const icon = ability === 'shield' ? faShieldHalved : ability === 'freeze' ? faSnowflake : faBomb;
                    const isSelected = activeAbility === ability && isCurrent;
                    const canInteract = isCurrent && (!isOnline || isLocalPlayer) && !isAnimating;
                    const hasPower = count > 0;

                    let buttonStyle = 'bg-[var(--color-background)]/30 border-[var(--color-border)]/30 text-[var(--color-muted)]/20 cursor-not-allowed opacity-30';

                    if (isSelected) {
                      if (ability === 'shield') {
                        buttonStyle = 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] ring-1 ring-blue-300';
                      } else if (ability === 'freeze') {
                        buttonStyle = 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] ring-1 ring-cyan-300';
                      } else {
                        buttonStyle = 'bg-amber-600 border-amber-400 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] ring-1 ring-amber-300';
                      }
                    } else if (hasPower) {
                      if (canInteract) {
                        if (ability === 'shield') {
                          buttonStyle = 'bg-blue-500/10 hover:bg-blue-500/25 border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 cursor-pointer shadow-xs active:scale-95';
                        } else if (ability === 'freeze') {
                          buttonStyle = 'bg-cyan-500/10 hover:bg-cyan-500/25 border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 cursor-pointer shadow-xs active:scale-95';
                        } else {
                          buttonStyle = 'bg-amber-500/10 hover:bg-amber-500/25 border-amber-500/40 hover:border-amber-400 text-amber-400 hover:text-amber-300 cursor-pointer shadow-xs active:scale-95';
                        }
                      } else {
                        if (ability === 'shield') {
                          buttonStyle = 'bg-blue-500/5 border-blue-500/20 text-blue-400/50 cursor-default';
                        } else if (ability === 'freeze') {
                          buttonStyle = 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400/50 cursor-default';
                        } else {
                          buttonStyle = 'bg-amber-500/5 border-amber-500/20 text-amber-400/50 cursor-default';
                        }
                      }
                    }

                    return (
                      <button
                        key={ability}
                        type="button"
                        disabled={!canInteract || !hasPower}
                        onClick={() => {
                          if (canInteract && hasPower) {
                            setActiveAbility(isSelected ? null : ability);
                          }
                        }}
                        aria-label={`Use ${ability} ability`}
                        className={`h-7.5 sm:h-8 flex items-center justify-center rounded-xl border transition-all duration-150 relative ${buttonStyle}`}
                        title={
                          canInteract && hasPower
                            ? `Activate ${ability} (1 turn action)`
                            : hasPower
                              ? `${ability} available`
                              : `${ability} used`
                        }
                      >
                        <FontAwesomeIcon icon={icon} className="text-xs" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


