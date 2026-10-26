'use client';

import type { SpecialCellsConfig } from './SetupScreen';

const SPECIAL_CELL_TYPES = [
  { key: 'walls', kind: 'wall', label: 'Walls', singular: 'wall' },
  { key: 'portals', kind: 'portal', label: 'Portals', singular: 'portal' },
  { key: 'multipliers', kind: 'multiplier', label: 'Multipliers', singular: 'multiplier' },
  { key: 'blackholes', kind: 'blackhole', label: 'Black holes', singular: 'black hole' },
] as const;

type SpecialCellKind = (typeof SPECIAL_CELL_TYPES)[number]['kind'];

interface ArenaBlueprintProps {
  rows: number | '';
  cols: number | '';
  specialCells?: SpecialCellsConfig;
}

export default function ArenaBlueprint({
  rows,
  cols,
  specialCells,
}: ArenaBlueprintProps) {
  const safeRows = Math.min(20, Math.max(6, Number(rows) || 15));
  const safeCols = Math.min(25, Math.max(6, Number(cols) || 20));
  const cellCount = safeRows * safeCols;
  const counts = {
    walls: Math.min(5, Math.max(0, Math.floor(Number(specialCells?.walls) || 0))),
    portals: Math.min(5, Math.max(0, Math.floor(Number(specialCells?.portals) || 0))),
    multipliers: Math.min(5, Math.max(0, Math.floor(Number(specialCells?.multipliers) || 0))),
    blackholes: Math.min(5, Math.max(0, Math.floor(Number(specialCells?.blackholes) || 0))),
  };
  const totalSpecialCells = Object.values(counts).reduce((total, count) => total + count, 0);

  const remaining = { ...counts };
  const occupied = new Set<number>();
  const markers: Array<{ position: number; kind: SpecialCellKind }> = [];
  let markerIndex = 0;

  while (markers.length < totalSpecialCells) {
    for (const { key, kind } of SPECIAL_CELL_TYPES) {
      if (remaining[key] <= 0) continue;

      let position = Math.floor(((markerIndex + 1) * cellCount) / (totalSpecialCells + 1));
      while (occupied.has(position)) {
        position = (position + 1) % cellCount;
      }

      occupied.add(position);
      markers.push({ position, kind });
      remaining[key] -= 1;
      markerIndex += 1;
    }
  }

  const markerByPosition = new Map(markers.map(({ position, kind }) => [position, kind]));
  const specialCellSummary = SPECIAL_CELL_TYPES
    .filter(({ key }) => counts[key] > 0)
    .map(({ key, label, singular }) => `${counts[key]} ${counts[key] === 1 ? singular : label.toLowerCase()}`)
    .join(', ');

  return (
    <section
      className="arena-blueprint"
      aria-labelledby="arena-blueprint-title"
    >
      <div className="arena-blueprint__header">
        <div>
          <h3 id="arena-blueprint-title" className="text-base font-bold text-[var(--color-foreground)]">
            Arena blueprint
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            A schematic preview; special cells are randomized at game start.
          </p>
        </div>
        <div className="arena-blueprint__dimensions" aria-label={`${safeCols} columns by ${safeRows} rows`}>
          <span>{safeCols}</span>
          <span aria-hidden="true">×</span>
          <span>{safeRows}</span>
          <span className="arena-blueprint__dimension-label">COLS × ROWS</span>
        </div>
      </div>

      <div className="arena-blueprint__stage">
        <div
          className="arena-blueprint__frame"
          style={{ width: `min(100%, ${Math.round((220 * safeCols) / safeRows)}px)` }}
        >
          <div
            role="img"
            aria-label={`Schematic preview of a ${safeRows}-row by ${safeCols}-column board${specialCellSummary ? ` with ${specialCellSummary}` : ''}. Special cell locations are randomized when a game starts.`}
            className="arena-blueprint__grid"
            style={{
              gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${safeRows}, minmax(0, 1fr))`,
              aspectRatio: `${safeCols} / ${safeRows}`,
            }}
          >
            {Array.from({ length: cellCount }, (_, index) => {
              const kind = markerByPosition.get(index);

              return (
                <span
                  key={index}
                  aria-hidden="true"
                  className={`arena-blueprint__cell${kind ? ` arena-blueprint__cell--${kind}` : ''}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="arena-blueprint__legend" aria-label="Special cell counts" role="list">
        {SPECIAL_CELL_TYPES.map(({ key, kind, label, singular }) => (
          <div
            key={key}
            className="arena-blueprint__legend-item"
            role="listitem"
            aria-label={`${counts[key]} ${counts[key] === 1 ? singular : label.toLowerCase()}`}
          >
            <span className={`arena-blueprint__swatch arena-blueprint__swatch--${kind}`} aria-hidden="true" />
            <span className="min-w-0 truncate">{label}</span>
            <span className="font-mono font-bold tabular-nums text-[var(--color-foreground)]">{counts[key]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
