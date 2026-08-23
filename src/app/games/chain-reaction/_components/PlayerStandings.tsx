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

  return (
    <div className="w-full mb-3 sm:mb-6">
      {/* Container: Horizontal Swipeable Snap Strip on Mobile (<640px), Responsive Grid on Tablet & Desktop (>=640px) */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 player-scroll-strip">
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
              className={`relative overflow-hidden p-3 rounded-2xl border-2 transition-colors duration-150 flex-shrink-0 w-[170px] sm:w-auto ${
                isCurrent 
                  ? 'bg-[var(--color-surface)] z-10 shadow-sm' 
                  : 'bg-[var(--color-surface)]/75 hover:bg-[var(--color-surface)]'
              } ${!p.active ? 'opacity-40 grayscale' : ''} ${isOnline && !p.connected ? 'border-dashed opacity-65' : ''}`}
              style={{
                borderColor: isCurrent ? playerThemeColor : 'var(--color-border)',
              }}
            >
              {/* Top Solid Accent Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all" 
                style={{ backgroundColor: playerThemeColor }}
              />

              {/* Leader Crown Badge - Centered Right on the Top */}
              {isLeader && p.active && (
                <div 
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-yellow-400 text-xs animate-leader-crown filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-20 pointer-events-none"
                  title="Board Leader"
                >
                  <FontAwesomeIcon icon={faCrown} />
                </div>
              )}

              {/* Card Content */}
              <div className="relative flex flex-col gap-2 pt-0.5">
                {/* Header: Avatar, Name, Badges */}
                <div className="flex items-center justify-between gap-1.5 min-w-0 h-6">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {/* Flat Avatar Dot */}
                    <div 
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex-shrink-0 border border-black/15 shadow-2xs"
                      style={{ backgroundColor: playerThemeColor }}
                    />

                    {/* Player Name */}
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <span 
                        className="text-xs sm:text-sm font-bold truncate leading-tight" 
                        style={{ color: isCurrent ? playerThemeColor : 'var(--color-foreground)' }}
                        title={p.name}
                      >
                        {p.name}
                      </span>
                      {isLocalPlayer && (
                        <span className="text-[7px] sm:text-[8px] font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-1 py-0.25 rounded border border-[var(--color-accent)]/30 flex-shrink-0 leading-none">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badges: Turn Timer, Out, Offline */}
                  <div className="flex items-center gap-1 flex-shrink-0 h-5">
                    {!p.active && (
                      <span className="text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded-md flex items-center gap-1 leading-none uppercase">
                        <FontAwesomeIcon icon={faSkull} className="text-[7px]" /> OUT
                      </span>
                    )}
                    {isOnline && !p.connected && p.active && (
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded-md flex items-center gap-1 leading-none font-mono">
                        <FontAwesomeIcon icon={faWifi} className="text-[7px] animate-pulse" /> {p.disconnectSecondsLeft ?? 120}s
                      </span>
                    )}
                    {isCurrent && p.connected && (
                      <span 
                        className={`text-[9px] sm:text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md border flex items-center gap-1 leading-none transition-all ${
                          turnSecondsLeft <= 10 
                            ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                            : 'bg-[var(--color-background)] border-[var(--color-border)]'
                        }`}
                        style={{
                          borderColor: turnSecondsLeft <= 10 ? undefined : playerThemeColor,
                          color: turnSecondsLeft <= 10 ? undefined : playerThemeColor
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: turnSecondsLeft <= 10 ? '#ef4444' : playerThemeColor }} />
                        {Math.max(0, turnSecondsLeft)}s
                      </span>
                    )}
                  </div>
                </div>

                {/* Orb Dominance Bar & Count Display */}
                <div className="bg-[var(--color-background)]/60 rounded-xl p-2 border border-[var(--color-border)]/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider flex items-center gap-1">
                      <FontAwesomeIcon icon={faCircleDot} className="text-[7px]" style={{ color: playerThemeColor }} />
                      Dominance
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-sm sm:text-base font-bold text-[var(--color-foreground)] leading-none">
                        {totalOrbs}
                      </span>
                      <span className="text-[9px] text-[var(--color-muted)] font-semibold">
                        ({dominancePercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Dominance Progress Bar */}
                  <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300 ease-out"
                      style={{ 
                        width: `${Math.max(4, dominancePercent)}%`,
                        backgroundColor: p.active ? playerThemeColor : 'var(--color-muted)',
                      }}
                    />
                  </div>
                </div>

                {/* Power-Up Abilities Action Bar (Without Count Badges) */}
                <div className="flex items-center justify-between w-full gap-1.5 pt-0.5">
                  {(['shield', 'freeze', 'detonate'] as const).map((ability) => {
                    const count = p.powers[ability];
                    const icon = ability === 'shield' ? faShieldHalved : ability === 'freeze' ? faSnowflake : faBomb;
                    const isSelected = activeAbility === ability && isCurrent;
                    const canInteract = isCurrent && (!isOnline || isLocalPlayer) && !isAnimating;
                    const hasPower = count > 0;

                    let buttonStyle = 'bg-[var(--color-background)]/40 border-[var(--color-border)]/40 text-[var(--color-muted)]/30 opacity-30 cursor-default';

                    if (isSelected) {
                      if (ability === 'shield') {
                        buttonStyle = 'bg-blue-600 border-blue-400 text-white shadow-sm ring-1 ring-blue-400 scale-105';
                      } else if (ability === 'freeze') {
                        buttonStyle = 'bg-cyan-600 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400 scale-105';
                      } else {
                        buttonStyle = 'bg-orange-600 border-orange-400 text-white shadow-sm ring-1 ring-orange-400 scale-105';
                      }
                    } else if (hasPower) {
                      if (canInteract) {
                        if (ability === 'shield') {
                          buttonStyle = 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400 text-blue-500 cursor-pointer active:scale-95 hover:scale-102';
                        } else if (ability === 'freeze') {
                          buttonStyle = 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400 text-cyan-500 cursor-pointer active:scale-95 hover:scale-102';
                        } else {
                          buttonStyle = 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 hover:border-orange-400 text-orange-500 cursor-pointer active:scale-95 hover:scale-102';
                        }
                      } else {
                        if (ability === 'shield') {
                          buttonStyle = 'bg-blue-500/5 border-blue-500/20 text-blue-500/50 cursor-default';
                        } else if (ability === 'freeze') {
                          buttonStyle = 'bg-cyan-500/5 border-cyan-500/20 text-cyan-500/50 cursor-default';
                        } else {
                          buttonStyle = 'bg-orange-500/5 border-orange-500/20 text-orange-500/50 cursor-default';
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
                        className={`flex-1 h-7.5 sm:h-8 flex items-center justify-center rounded-xl border transition-all duration-150 ${buttonStyle}`}
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

