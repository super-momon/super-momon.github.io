'use client';

import React from 'react';
import { Cell } from './gameUtils';

interface GameCellProps {
  r: number;
  c: number;
  cell: Cell;
  ownerColor: string | null;
  currentPlayerColor: string;
  isExploding: boolean;
  isCritical: boolean;
  isCellDisabled: boolean;
  limit: number;
  onClick: () => void;
}

export function GameCell({
  r,
  c,
  cell,
  ownerColor,
  currentPlayerColor,
  isExploding,
  isCritical,
  isCellDisabled,
  limit,
  onClick,
}: GameCellProps) {
  const isOwned = cell.ownerId !== null;

  return (
    <div
      onClick={onClick}
      className={`game-cell rounded-[6px] border ${
        isOwned ? 'owned' : ''
      } ${isExploding ? 'cell-explode' : ''} ${
        isCritical ? 'critical-cell' : ''
      } ${
        isCellDisabled || cell.type === 'wall' ? 'disabled cursor-not-allowed' : 'hover:scale-102 hover:shadow-sm'
      } cell-type-${cell.type || 'normal'} ${cell.statusEffect ? `status-${cell.statusEffect}` : ''}`}
      style={{
        '--owner-color': ownerColor || 'transparent',
        '--owner-bg': ownerColor ? `${ownerColor}15` : 'transparent',
        '--owner-bg-glow': ownerColor ? `${ownerColor}35` : 'transparent',
      } as React.CSSProperties}
    >
      {/* Corner/Edge Indicator Dots */}
      {cell.orbs === 0 && !isCellDisabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <span 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: currentPlayerColor }} 
          />
        </div>
      )}

      {/* Explosion Particles */}
      {isExploding && ownerColor && (
        <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-20">
          <div className="explosion-particle particle-t" style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties} />
          <div className="explosion-particle particle-r" style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties} />
          <div className="explosion-particle particle-b" style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties} />
          <div className="explosion-particle particle-l" style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties} />
        </div>
      )}

      {/* Orb layout depending on orb count */}
      {cell.orbs > 0 && ownerColor && (
        <div className="w-full h-full flex items-center justify-center relative z-10">
          {cell.orbs === 1 && (
            <div className="orb-layout-1">
              <div
                className="orb-simple"
                style={{
                  '--orb-color': ownerColor,
                  '--orb-glow': ownerColor,
                } as React.CSSProperties}
              />
            </div>
          )}
          {cell.orbs === 2 && (
            <div className="orb-layout-2">
              <div
                className="orb-simple"
                style={{
                  '--orb-color': ownerColor,
                  '--orb-glow': ownerColor,
                } as React.CSSProperties}
              />
              <div
                className="orb-simple"
                style={{
                  '--orb-color': ownerColor,
                  '--orb-glow': ownerColor,
                } as React.CSSProperties}
              />
            </div>
          )}
          {cell.orbs === 3 && (
            <div className="orb-layout-3">
              <div
                className="orb-simple"
                style={{
                  '--orb-color': ownerColor,
                  '--orb-glow': ownerColor,
                } as React.CSSProperties}
              />
              <div className="orb-layout-3-row">
                <div
                  className="orb-simple"
                  style={{
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties}
                />
                <div
                  className="orb-simple"
                  style={{
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          )}
          {cell.orbs >= 4 && (
            <div className="orb-layout-4">
              {Array.from({ length: Math.min(cell.orbs, 4) }).map((_, oIdx) => (
                <div
                  key={oIdx}
                  className="orb-simple"
                  style={{
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Portal partner label */}
      {cell.type === 'portal' && cell.portalLabel && (
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black text-purple-600 dark:text-purple-400 bg-purple-500/15 dark:bg-purple-500/25 rounded-full border border-purple-500/35 select-none pointer-events-none leading-none">
          {cell.portalLabel}
        </div>
      )}

      {/* Critical mass hover threshold hint */}
      <div className="absolute top-0.5 right-0.5 text-[8px] text-[var(--color-muted)] opacity-0 hover:opacity-100 select-none pointer-events-none font-bold">
        {cell.orbs}/{limit}
      </div>
    </div>
  );
}
