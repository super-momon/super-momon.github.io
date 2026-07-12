export type CellType = 'normal' | 'wall' | 'portal' | 'multiplier' | 'blackhole';

export interface Cell {
  ownerId: number | null;
  orbs: number;
  type: CellType;
  portalTarget?: { r: number, c: number }; // Where the portal leads
  portalLabel?: string; // Partner identifier letter (A, B, C...)
  statusEffect?: 'shielded' | 'frozen';
  statusDuration?: number; // Turns remaining for effect
}

export const getNeighbors = (r: number, c: number, rows: number, cols: number, board?: Cell[][]): [number, number][] => {
  const neighbors: [number, number][] = [];
  if (r > 0) neighbors.push([r - 1, c]);
  if (r < rows - 1) neighbors.push([r + 1, c]);
  if (c > 0) neighbors.push([r, c - 1]);
  if (c < cols - 1) neighbors.push([r, c + 1]);
  
  if (board) {
    return neighbors.filter(([nr, nc]) => board[nr][nc].type !== 'wall');
  }
  return neighbors;
};

export const getCellCriticalMass = (r: number, c: number, rows: number, cols: number, board?: Cell[][]): number => {
  return getNeighbors(r, c, rows, cols, board).length;
};

export const countPlayerOrbs = (boardState: Cell[][], playerId: number): number => {
  let count = 0;
  const rows = boardState.length;
  const cols = boardState[0]?.length || 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardState[r][c].ownerId === playerId) {
        count += boardState[r][c].orbs;
      }
    }
  }
  return count;
};
