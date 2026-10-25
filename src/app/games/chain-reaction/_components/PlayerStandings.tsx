'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faSnowflake, 
  faBomb, 
  faCrown, 
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

  // Keep the active player visible whenever the standings strip can scroll.
  React.useEffect(() => {
    const activeCard = activeCardRef.current;
    const strip = activeCard?.parentElement;

    if (activeCard && strip && strip.scrollWidth > strip.clientWidth) {
      activeCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentPlayerIndex]);

  return (
    <div className="w-full min-w-0 select-none">
      <div
        role="group"
        aria-label="Player standings"
        className="player-scroll-strip flex w-full flex-nowrap items-stretch gap-2 overflow-x-auto pb-1 px-0.5"
      >
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
              role="group"
              aria-label={`${p.name}: ${totalOrbs} orbs, ${dominancePercent}% of the board${isCurrent ? ', current turn' : ''}`}
              className={`relative flex w-[148px] shrink-0 flex-col gap-1 overflow-hidden rounded-xl border px-2 py-1 transition-colors duration-200 sm:mx-auto sm:max-w-[220px] sm:min-w-[120px] sm:flex-1 ${
                isCurrent
                  ? 'z-10 bg-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)]'
              } ${!p.active ? 'pointer-events-none opacity-40 grayscale' : ''} ${
                isOnline && !p.connected && p.active ? 'border-dashed opacity-75' : ''
              }`}
              style={{
                borderColor: isCurrent ? playerThemeColor : 'var(--color-border)',
                boxShadow: isCurrent ? `0 0 12px ${playerThemeColor}25` : undefined,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-0.5"
                style={{
                  backgroundColor: playerThemeColor,
                  opacity: isCurrent ? 1 : 0.5,
                }}
              />

              <div className="flex min-w-0 items-center justify-between gap-1.5 pt-0.5">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: playerThemeColor,
                      boxShadow: isCurrent ? `0 0 8px ${playerThemeColor}` : undefined,
                    }}
                  />
                  {isLeader && p.active && (
                    <span className="shrink-0 text-amber-400" title="Current board leader">
                      <FontAwesomeIcon icon={faCrown} />
                    </span>
                  )}
                  <span
                    className={`min-w-0 truncate text-xs font-bold ${
                      isCurrent ? '' : 'text-[var(--color-foreground)]'
                    }`}
                    style={{ color: isCurrent ? playerThemeColor : undefined }}
                    title={p.name}
                  >
                    {p.name}
                  </span>
                  {isLocalPlayer && (
                    <span className="shrink-0 rounded border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/15 px-1 py-0.5 text-xs font-extrabold leading-none text-[var(--color-accent)]">
                      YOU
                    </span>
                  )}
                </div>

                {!p.active ? (
                  <span className="shrink-0 rounded-md border border-red-500/25 bg-red-500/10 px-1 py-0.5 text-xs font-extrabold uppercase leading-none text-red-400">
                    OUT
                  </span>
                ) : isOnline && !p.connected ? (
                  <span
                    className="shrink-0 rounded-md border border-amber-500/25 bg-amber-500/10 px-1 py-0.5 text-xs font-bold font-mono tabular-nums leading-none text-amber-400"
                    title="Player disconnected"
                  >
                    {p.disconnectSecondsLeft ?? 120}s
                  </span>
                ) : isCurrent ? (
                  <span
                    role="timer"
                    className={`shrink-0 rounded-md border px-1 py-0.5 text-xs font-bold font-mono tabular-nums leading-none ${
                      turnSecondsLeft <= 10
                        ? 'animate-pulse border-red-500/50 bg-red-500/10 text-red-400'
                        : 'bg-[var(--color-background)]'
                    }`}
                    style={{
                      borderColor: turnSecondsLeft <= 10 ? undefined : playerThemeColor,
                      color: turnSecondsLeft <= 10 ? undefined : playerThemeColor,
                    }}
                    aria-label={`${Math.max(0, turnSecondsLeft)} seconds left`}
                  >
                    {Math.max(0, turnSecondsLeft)}s
                  </span>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[var(--color-muted)]">
                  Orbs <span className="font-mono font-bold text-[var(--color-foreground)]">{totalOrbs}</span>
                </span>
                <span className="font-mono tabular-nums text-[var(--color-muted)]">{dominancePercent}%</span>
              </div>

              <div
                role="progressbar"
                aria-label={`${p.name} orb control`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={dominancePercent}
                className="h-1 w-full overflow-hidden rounded-full bg-black/15 dark:bg-white/10"
              >
                <div
                  className="h-full w-full origin-left rounded-full transition-transform duration-300 ease-out"
                  style={{
                    transform: `scaleX(${Math.max(3, dominancePercent) / 100})`,
                    backgroundColor: p.active ? playerThemeColor : 'var(--color-muted)',
                  }}
                />
              </div>

              <div className="grid w-full grid-cols-3 gap-1 pt-0.5">
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
                    } else if (ability === 'shield') {
                      buttonStyle = 'bg-blue-500/5 border-blue-500/20 text-blue-400/50 cursor-default';
                    } else if (ability === 'freeze') {
                      buttonStyle = 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400/50 cursor-default';
                    } else {
                      buttonStyle = 'bg-amber-500/5 border-amber-500/20 text-amber-400/50 cursor-default';
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
                      aria-label={`Use ${ability} ability${hasPower ? `, ${count} remaining` : ', already used'}`}
                      aria-pressed={isSelected}
                      className={`flex min-h-10 min-w-0 items-center justify-center rounded-lg border text-xs transition-all duration-150 ${buttonStyle}`}
                      title={
                        canInteract && hasPower
                          ? `Activate ${ability} (1 turn action)`
                          : hasPower
                            ? `${ability} available`
                            : `${ability} used`
                      }
                    >
                      <FontAwesomeIcon icon={icon} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
