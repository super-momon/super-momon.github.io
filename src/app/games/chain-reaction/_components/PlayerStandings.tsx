'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faSnowflake, faBomb } from '@fortawesome/free-solid-svg-icons';
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
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
      {players.map((p, idx) => {
        const isCurrent = idx === currentPlayerIndex && p.active && !isAnimating;
        const totalOrbs = countPlayerOrbs(board, p.id);
        const isLocalPlayer = isOnline && p.clientId === myClientId;
        const playerThemeColor = getThemeColor(p.color, isDark);
        
        return (
          <div
            key={p.id}
            className={`relative overflow-hidden p-3.5 rounded-2xl border transition-all duration-300 ${
              isCurrent 
                ? 'scale-103 bg-[var(--color-surface)] z-10 shadow-md shadow-black/5' 
                : 'bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)] shadow-sm'
            } ${!p.active ? 'opacity-40 grayscale line-through' : ''} ${isOnline && !p.connected ? 'border-dashed opacity-65' : ''}`}
            style={{
              borderColor: isCurrent ? playerThemeColor : 'var(--color-border)',
              boxShadow: isCurrent ? `0 4px 15px ${playerThemeColor}15, inset 0 0 0 1px ${playerThemeColor}15` : 'none',
            }}
          >
            {/* Top border colored bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1" 
              style={{ backgroundColor: playerThemeColor }}
            />

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center justify-between h-6 min-w-0 mb-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span 
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCurrent ? 'animate-pulse' : ''}`}
                    style={{ 
                      backgroundColor: playerThemeColor,
                      boxShadow: `0 0 6px ${playerThemeColor}` 
                    }}
                  />
                  <span 
                    className="text-xs font-bold truncate" 
                    style={{ color: playerThemeColor }}
                    title={p.name}
                  >
                    {p.name}
                  </span>
                  {isLocalPlayer && (
                    <span className="text-[8px] font-bold bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-1 py-0.25 rounded border border-[var(--color-accent)]/20 flex-shrink-0 leading-none">
                      YOU
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-1 h-7">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] text-[var(--color-muted)] font-semibold uppercase tracking-wider">Orbs</span>
                  <span className="text-xl font-black text-[var(--color-foreground)] tracking-tight leading-none">
                    {totalOrbs}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!p.active && (
                    <span className="text-[8px] font-black text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider leading-none">
                      OUT
                    </span>
                  )}
                  {isOnline && !p.connected && p.active && (
                    <span className="text-[8px] font-extrabold text-red-500 bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 leading-none">
                      OFFLINE
                      <span className="opacity-80 font-mono">({p.disconnectSecondsLeft ?? 120}s)</span>
                    </span>
                  )}
                  {isCurrent && p.connected && (
                    <span 
                      className={`text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded-md border flex-shrink-0 transition-all duration-300 leading-none ${
                        turnSecondsLeft <= 10 
                          ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                          : 'bg-[var(--color-background)]/85 border-[var(--color-border)]'
                      }`}
                      style={{
                        borderColor: turnSecondsLeft <= 10 ? undefined : playerThemeColor,
                        color: turnSecondsLeft <= 10 ? undefined : playerThemeColor
                      }}
                    >
                      {Math.max(0, turnSecondsLeft)}s
                    </span>
                  )}
                </div>
              </div>

              {/* Power Ups display */}
              <div className="flex items-center justify-around w-full gap-2 mt-2 pt-2 border-t border-[var(--color-border)]/30">
                {(['shield', 'freeze', 'detonate'] as const).map((ability) => {
                  const count = p.powers[ability];
                  const icon = ability === 'shield' ? faShieldHalved : ability === 'freeze' ? faSnowflake : faBomb;
                  const isSelected = activeAbility === ability && isCurrent;
                  const canInteract = isCurrent && (!isOnline || isLocalPlayer) && !isAnimating;

                  const hasPower = count > 0;
                  let buttonClass = '';
                  let badgeClass = '';

                  if (isSelected) {
                    if (ability === 'shield') {
                      buttonClass = 'bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse ring-2 ring-blue-500/20 scale-105';
                      badgeClass = 'bg-blue-700 text-white border border-blue-400';
                    } else if (ability === 'freeze') {
                      buttonClass = 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse ring-2 ring-cyan-500/20 scale-105';
                      badgeClass = 'bg-cyan-700 text-white border border-cyan-400';
                    } else {
                      buttonClass = 'bg-orange-500 border-orange-400 text-white shadow-[0_0_10px_rgba(249,115,22,0.6)] animate-pulse ring-2 ring-orange-500/20 scale-105';
                      badgeClass = 'bg-orange-700 text-white border border-orange-400';
                    }
                  } else if (hasPower) {
                    if (canInteract) {
                      if (ability === 'shield') {
                        buttonClass = 'bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 border-blue-500/30 hover:border-blue-500/60 text-blue-600 dark:text-blue-400 cursor-pointer hover:scale-105 active:scale-95';
                        badgeClass = 'bg-blue-600 text-white';
                      } else if (ability === 'freeze') {
                        buttonClass = 'bg-cyan-500/10 hover:bg-cyan-500/20 dark:bg-cyan-500/15 dark:hover:bg-cyan-500/25 border-cyan-500/30 hover:border-cyan-500/60 text-cyan-600 dark:text-cyan-400 cursor-pointer hover:scale-105 active:scale-95';
                        badgeClass = 'bg-cyan-600 text-white';
                      } else {
                        buttonClass = 'bg-orange-500/10 hover:bg-orange-500/20 dark:bg-orange-500/15 dark:hover:bg-orange-500/25 border-orange-500/30 hover:border-orange-500/60 text-orange-600 dark:text-orange-400 cursor-pointer hover:scale-105 active:scale-95';
                        badgeClass = 'bg-orange-600 text-white';
                      }
                    } else {
                      if (ability === 'shield') {
                        buttonClass = 'bg-blue-500/5 border-blue-500/20 text-blue-500/60 dark:text-blue-400/50 opacity-70 cursor-default';
                        badgeClass = 'bg-blue-500/70 text-white/90';
                      } else if (ability === 'freeze') {
                        buttonClass = 'bg-cyan-500/5 border-cyan-500/20 text-cyan-500/60 dark:text-cyan-400/50 opacity-70 cursor-default';
                        badgeClass = 'bg-cyan-500/70 text-white/90';
                      } else {
                        buttonClass = 'bg-orange-500/5 border-orange-500/20 text-orange-500/60 dark:text-orange-400/50 opacity-70 cursor-default';
                        badgeClass = 'bg-orange-500/70 text-white/90';
                      }
                    }
                  } else {
                    buttonClass = 'bg-[var(--color-surface)] border-[var(--color-border)]/40 text-[var(--color-muted)] opacity-20 cursor-default';
                    badgeClass = 'bg-[var(--color-muted)] text-white';
                  }

                  return (
                    <button
                      key={ability}
                      type="button"
                      disabled={!canInteract || count === 0}
                      onClick={() => {
                        if (canInteract && count > 0) {
                          setActiveAbility(isSelected ? null : ability);
                        }
                      }}
                      className={`w-9 h-9 flex items-center justify-center relative rounded-xl border transition-all duration-300 ${buttonClass}`}
                      title={
                        canInteract && count > 0
                          ? `Click to use ${ability} (1 turn)`
                          : `${ability}: ${count} available`
                      }
                    >
                      <FontAwesomeIcon icon={icon} className="text-xs" />
                      {count > 0 && (
                        <span className={`absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm ${badgeClass}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
