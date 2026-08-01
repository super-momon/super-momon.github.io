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

const ORB_INDICES = [0, 1, 2, 3];

function GameCellComponent({
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
  const isDisabled = isCellDisabled || cell.type === 'wall';

  // Construct aria-label for accessibility
  const ariaLabel = `Row ${r + 1}, Column ${c + 1}: ${cell.orbs} of ${limit} orbs${
    isOwned ? `, owned` : ', unowned'
  }${cell.type !== 'normal' ? `, ${cell.type} cell` : ''}${
    cell.statusEffect ? `, ${cell.statusEffect}` : ''
  }${isDisabled ? ', disabled' : ''}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      className={`game-cell rounded-[6px] border ${
        isOwned ? 'owned' : ''
      } ${isExploding ? 'cell-explode' : ''} ${
        isCritical ? 'critical-cell' : ''
      } ${
        isDisabled
          ? 'disabled cursor-not-allowed'
          : 'hover:scale-102 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)] z-10'
      } cell-type-${cell.type || 'normal'} ${
        cell.statusEffect ? `status-${cell.statusEffect}` : ''
      }`}
      style={
        {
          '--owner-color': ownerColor || 'transparent',
          '--owner-bg': ownerColor ? `${ownerColor}15` : 'transparent',
          '--owner-bg-glow': ownerColor ? `${ownerColor}35` : 'transparent',
        } as React.CSSProperties
      }
    >
      {/* Explosion Particles */}
      {isExploding && ownerColor && (
        <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-20">
          <div
            className="explosion-particle particle-t"
            style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties}
          />
          <div
            className="explosion-particle particle-r"
            style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties}
          />
          <div
            className="explosion-particle particle-b"
            style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties}
          />
          <div
            className="explosion-particle particle-l"
            style={{ backgroundColor: ownerColor, color: ownerColor } as React.CSSProperties}
          />
        </div>
      )}

      {/* Orb layout depending on orb count */}
      {cell.orbs > 0 && ownerColor && (
        <div className="w-full h-full flex items-center justify-center relative z-10 pointer-events-none">
          {cell.orbs === 1 && (
            <div className="orb-layout-1">
              <div
                className="orb-simple"
                style={
                  {
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties
                }
              />
            </div>
          )}
          {cell.orbs === 2 && (
            <div className="orb-layout-2">
              <div
                className="orb-simple"
                style={
                  {
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties
                }
              />
              <div
                className="orb-simple"
                style={
                  {
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties
                }
              />
            </div>
          )}
          {cell.orbs === 3 && (
            <div className="orb-layout-3">
              <div
                className="orb-simple"
                style={
                  {
                    '--orb-color': ownerColor,
                    '--orb-glow': ownerColor,
                  } as React.CSSProperties
                }
              />
              <div className="orb-layout-3-row">
                <div
                  className="orb-simple"
                  style={
                    {
                      '--orb-color': ownerColor,
                      '--orb-glow': ownerColor,
                    } as React.CSSProperties
                  }
                />
                <div
                  className="orb-simple"
                  style={
                    {
                      '--orb-color': ownerColor,
                      '--orb-glow': ownerColor,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          )}
          {cell.orbs >= 4 && (
            <div className="orb-layout-4">
              {ORB_INDICES.slice(0, Math.min(cell.orbs, 4)).map((oIdx) => (
                <div
                  key={oIdx}
                  className="orb-simple"
                  style={
                    {
                      '--orb-color': ownerColor,
                      '--orb-glow': ownerColor,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Portal partner label */}
      {cell.type === 'portal' && cell.portalLabel && (
        <div className="absolute bottom-0.5 right-0.5 min-w-[14px] h-3.5 px-1 flex items-center justify-center text-[9px] font-black text-purple-200 bg-purple-950/90 rounded-full border border-purple-400/50 select-none pointer-events-none leading-none shadow-sm z-10">
          {cell.portalLabel}
        </div>
      )}

      {/* Critical mass hover threshold hint */}
      <div className="absolute top-0.5 right-0.5 text-[10px] font-mono px-1 py-0.25 bg-slate-900/90 text-slate-200 rounded border border-slate-700/80 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity select-none pointer-events-none font-bold z-10 shadow-sm">
        {cell.orbs}/{limit}
      </div>
    </button>
  );
}

function arePropsEqual(prevProps: GameCellProps, nextProps: GameCellProps) {
  return (
    prevProps.r === nextProps.r &&
    prevProps.c === nextProps.c &&
    prevProps.cell.orbs === nextProps.cell.orbs &&
    prevProps.cell.ownerId === nextProps.cell.ownerId &&
    prevProps.cell.type === nextProps.cell.type &&
    prevProps.cell.statusEffect === nextProps.cell.statusEffect &&
    prevProps.cell.portalLabel === nextProps.cell.portalLabel &&
    prevProps.ownerColor === nextProps.ownerColor &&
    prevProps.currentPlayerColor === nextProps.currentPlayerColor &&
    prevProps.isExploding === nextProps.isExploding &&
    prevProps.isCritical === nextProps.isCritical &&
    prevProps.isCellDisabled === nextProps.isCellDisabled &&
    prevProps.limit === nextProps.limit
  );
}

export const GameCell = React.memo(GameCellComponent, arePropsEqual);

