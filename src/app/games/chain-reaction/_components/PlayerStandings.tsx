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
}

export function PlayerStandings({
  players,
  currentPlayerIndex,
  isAnimating,
  board,
  myClientId,
  isOnline,
  isDark,
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate max-w-[90px]" style={{ color: playerThemeColor }}>
                  {p.name}
                  {isLocalPlayer && (
                    <span className="text-[8px] font-normal text-[var(--color-muted)] ml-0.5">(You)</span>
                  )}
                </span>
                {!p.active && (
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">OUT</span>
                )}
                {isOnline && !p.connected && (
                  <span className="text-[8px] font-extrabold text-red-500 bg-red-500/10 border border-red-500/25 px-1 py-0.5 rounded uppercase tracking-wider scale-90">OFFLINE</span>
                )}
                {isCurrent && p.connected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                )}
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
