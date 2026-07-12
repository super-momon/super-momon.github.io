import { Cell } from './gameUtils';
import { SpecialCellsConfig } from './SetupScreen';

/**
 * Returns true if the cell at (r, c) is within Manhattan distance 2 of any
 * existing special cell on the board (the cell itself is excluded).
 */
export const isTooCloseToSpecialCell = (r: number, c: number, board: Cell[][]): boolean => {
  const rows = board.length;
  const cols = board[0].length;
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      if (Math.abs(dr) + Math.abs(dc) === 0) continue;
      if (Math.abs(dr) + Math.abs(dc) <= 2) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc].type !== 'normal') {
            return true;
          }
        }
      }
    }
  }
  return false;
};

/**
 * Creates a fresh rows × cols Cell board with optional special cells
 * (walls, portals, multipliers, blackholes) placed randomly according to the
 * given config. Returns a plain all-normal board when `specialCells` is
 * undefined.
 */
export const buildBoardWithSpecialCells = (
  rows: number,
  cols: number,
  specialCells?: SpecialCellsConfig
): Cell[][] => {
  const freshBoard: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ ownerId: null, orbs: 0, type: 'normal' as const }))
  );

  if (!specialCells) return freshBoard;

  const allPositions: { r: number; c: number }[] = [];
  const innerPositions: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      allPositions.push({ r, c });
      if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) {
        innerPositions.push({ r, c });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }
  for (let i = innerPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [innerPositions[i], innerPositions[j]] = [innerPositions[j], innerPositions[i]];
  }

  let posIdx = 0;
  let innerPosIdx = 0;

  const placeCells = (type: 'wall' | 'portal' | 'multiplier' | 'blackhole', count: number) => {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < allPositions.length * 2) {
      attempts++;
      if (type === 'multiplier') {
        // Multipliers only go on inner tiles
        if (innerPosIdx < innerPositions.length) {
          const { r, c } = innerPositions[innerPosIdx++];
          if (freshBoard[r][c].type === 'normal') {
            if (isTooCloseToSpecialCell(r, c, freshBoard)) {
              innerPositions.push({ r, c }); // push back to try later
              continue;
            }
            freshBoard[r][c].type = type;
            placed++;
          }
        } else {
          break; // ran out of inner positions
        }
      } else {
        // Everything else can go anywhere
        if (posIdx < allPositions.length) {
          const { r, c } = allPositions[posIdx++];

          // Wall cell restriction: do not place beside any of the 4 corners
          if (type === 'wall') {
            const isBesideCorner =
              (r === 0 && c === 1) || (r === 1 && c === 0) || // Top-left corner adjacent
              (r === 0 && c === cols - 2) || (r === 1 && c === cols - 1) || // Top-right corner adjacent
              (r === rows - 1 && c === 1) || (r === rows - 2 && c === 0) || // Bottom-left corner adjacent
              (r === rows - 1 && c === cols - 2) || (r === rows - 2 && c === cols - 1); // Bottom-right corner adjacent
            if (isBesideCorner) {
              allPositions.push({ r, c }); // push back to reuse for other types
              continue;
            }
          }

          if (freshBoard[r][c].type === 'normal') {
            if (isTooCloseToSpecialCell(r, c, freshBoard)) {
              allPositions.push({ r, c }); // push back to try later
              continue;
            }
            freshBoard[r][c].type = type;
            placed++;
          }
        } else {
          break; // ran out of positions
        }
      }
    }
  };

  placeCells('wall', specialCells.walls || 0);

  // Place portals in linked pairs (each pair gets a matching label 'A', 'B', 'C' …)
  const getRandomAvailablePosition = (): { r: number; c: number } | null => {
    while (posIdx < allPositions.length) {
      const { r, c } = allPositions[posIdx++];
      if (freshBoard[r][c].type === 'normal') return { r, c };
    }
    return null;
  };

  const portalPairs = specialCells.portals || 0;
  let portalPairsPlaced = 0;
  let portalAttempts = 0;
  while (portalPairsPlaced < portalPairs && portalAttempts < allPositions.length * 2) {
    portalAttempts++;
    const p1 = getRandomAvailablePosition();
    if (!p1) break;

    freshBoard[p1.r][p1.c].type = 'portal'; // temporarily set for proximity check

    const p2 = getRandomAvailablePosition();
    if (!p2) {
      freshBoard[p1.r][p1.c].type = 'normal'; // revert
      break;
    }

    if (isTooCloseToSpecialCell(p1.r, p1.c, freshBoard) || isTooCloseToSpecialCell(p2.r, p2.c, freshBoard)) {
      freshBoard[p1.r][p1.c].type = 'normal'; // revert p1
      allPositions.push(p1, p2);
      continue;
    }

    const label = String.fromCharCode(65 + portalPairsPlaced); // 'A', 'B', 'C' …
    freshBoard[p1.r][p1.c].portalTarget = { r: p2.r, c: p2.c };
    freshBoard[p1.r][p1.c].portalLabel = label;
    freshBoard[p2.r][p2.c].type = 'portal';
    freshBoard[p2.r][p2.c].portalTarget = { r: p1.r, c: p1.c };
    freshBoard[p2.r][p2.c].portalLabel = label;
    portalPairsPlaced++;
  }

  placeCells('multiplier', specialCells.multipliers || 0);
  placeCells('blackhole', specialCells.blackholes || 0);

  return freshBoard;
};
