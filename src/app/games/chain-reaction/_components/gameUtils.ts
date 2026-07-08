export interface Cell {
  ownerId: number | null;
  orbs: number;
}

export const getNeighbors = (r: number, c: number, rows: number, cols: number): [number, number][] => {
  const neighbors: [number, number][] = [];
  if (r > 0) neighbors.push([r - 1, c]);
  if (r < rows - 1) neighbors.push([r + 1, c]);
  if (c > 0) neighbors.push([r, c - 1]);
  if (c < cols - 1) neighbors.push([r, c + 1]);
  return neighbors;
};

export const getCellCriticalMass = (r: number, c: number, rows: number, cols: number): number => {
  let count = 0;
  if (r > 0) count++;
  if (r < rows - 1) count++;
  if (c > 0) count++;
  if (c < cols - 1) count++;
  return count;
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
