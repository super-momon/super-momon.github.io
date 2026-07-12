'use client';

import React from 'react';
import { Player } from './GameBoard';
import { Cell, countPlayerOrbs } from './gameUtils';
import { getThemeColor } from './colors';

interface PlayerStandingsProps {
  players: Player[];
  currentPlayerIndex: number;
  isAnimating: boolean;
  board: Cell[][];
  myClientId: string;
  isOnline: boolean;
  isDark: boolean;
  turnSecondsLeft: number;
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
              <div className="h-6 flex items-center justify-between gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span 
                    className="text-xs font-bold truncate" 
                    style={{ color: playerThemeColor }}
                    title={p.name}
                  >
                    {p.name}
                  </span>
                  {isLocalPlayer && (
                    <span className="text-[8px] font-bold bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-1 py-0.25 rounded border border-[var(--color-accent)]/20 flex-shrink-0">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!p.active && (
                    <span className="text-[8px] font-black text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">OUT</span>
                  )}
                  {isOnline && !p.connected && p.active && (
                    <span className="text-[8px] font-extrabold text-red-500 bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                      OFFLINE
                      <span className="opacity-80">({p.disconnectSecondsLeft ?? 120}s)</span>
                    </span>
                  )}
                  {isCurrent && p.connected && (
                    <span 
                      className={`text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded-md border flex-shrink-0 transition-all duration-300 ${
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
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-[var(--color-muted)] font-medium">Orbs</span>
                <span className="text-lg font-black text-[var(--color-foreground)]">
                  {totalOrbs}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
