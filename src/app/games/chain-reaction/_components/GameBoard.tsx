'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRotateRight, 
  faVolumeUp, 
  faVolumeMute
} from '@fortawesome/free-solid-svg-icons';
import { PlayerSetup } from './SetupScreen';
import { audioSynth } from './AudioSynth';
import '../chain-reaction.css';

interface GameBoardProps {
  initialPlayers: PlayerSetup[];
  rows: number;
  cols: number;
  soundEnabled: boolean;
  onQuit: () => void;
  onGameFinished: (winnerName: string, winnerColor: string, totalOrbs: number) => void;
}

interface Cell {
  ownerId: number | null;
  orbs: number;
}

interface Player {
  id: number;
  name: string;
  color: string;
  active: boolean;
  hasMoved: boolean;
}

const getNeighbors = (r: number, c: number, rows: number, cols: number) => {
  const neighbors: [number, number][] = [];
  if (r > 0) neighbors.push([r - 1, c]);
  if (r < rows - 1) neighbors.push([r + 1, c]);
  if (c > 0) neighbors.push([r, c - 1]);
  if (c < cols - 1) neighbors.push([r, c + 1]);
  return neighbors;
};

export default function GameBoard({
  initialPlayers,
  rows,
  cols,
  soundEnabled: initialSound,
  onQuit,
  onGameFinished,
}: GameBoardProps) {
  // Setup local state
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ ownerId: null, orbs: 0 }))
    )
  );
  const [players, setPlayers] = useState<Player[]>(() =>
    initialPlayers.map((p) => ({
      ...p,
      active: true,
      hasMoved: false,
    }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSound);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [explodingCells, setExplodingCells] = useState<Record<string, boolean>>({});
  const [shakeBoard, setShakeBoard] = useState<boolean>(false);

  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Lazy audio synth configuration
  useEffect(() => {
    audioSynth.toggle(soundEnabled);
  }, [soundEnabled]);

  // Initialize Board and Players
  const initializeGame = () => {
    const freshBoard: Cell[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ ownerId: null, orbs: 0 }))
    );

    const freshPlayers: Player[] = initialPlayers.map((p) => ({
      ...p,
      active: true,
      hasMoved: false,
    }));

    setBoard(freshBoard);
    setPlayers(freshPlayers);
    setCurrentPlayerIndex(0);
    setIsAnimating(false);
    setExplodingCells({});
    setShakeBoard(false);
  };

  const countPlayerOrbs = (boardState: Cell[][], playerId: number) => {
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (boardState[r][c].ownerId === playerId) {
          count += boardState[r][c].orbs;
        }
      }
    }
    return count;
  };

  const getCellCriticalMass = (r: number, c: number) => {
    // Critical mass is equal to the number of surrounding neighbor cells
    let count = 0;
    if (r > 0) count++;
    if (r < rows - 1) count++;
    if (c > 0) count++;
    if (c < cols - 1) count++;
    return count;
  };

  // Asynchronous Cascade / Chain Reaction Solver
  const runChainReaction = async (
    startBoard: Cell[][],
    currentPlayers: Player[],
    placerId: number
  ) => {
    setIsAnimating(true);
    let currentBoard = startBoard.map((row) => row.map((cell) => ({ ...cell })));
    let tempPlayers = currentPlayers.map((p) => ({ ...p }));

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let hasExplodedInWave = true;

    while (hasExplodedInWave) {
      // Find all cells exceeding their critical mass
      const unstableCells: { r: number; c: number; limit: number; owner: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const limit = getCellCriticalMass(r, c);
          if (currentBoard[r][c].orbs >= limit) {
            unstableCells.push({
              r,
              c,
              limit,
              owner: currentBoard[r][c].ownerId as number,
            });
          }
        }
      }

      if (unstableCells.length === 0) {
        hasExplodedInWave = false;
        break;
      }

      hasExplodedInWave = true;

      // Play explosion sound
      audioSynth.playExplosion();

      // Trigger board shaking & flash unstable cells
      setShakeBoard(true);
      const waveExploding: Record<string, boolean> = {};
      unstableCells.forEach((cell) => {
        waveExploding[`${cell.r},${cell.c}`] = true;
      });
      setExplodingCells(waveExploding);

      // Perform explosions simultaneously in this wave
      const nextBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

      unstableCells.forEach((cell) => {
        const { r, c, limit, owner } = cell;
        nextBoard[r][c].orbs -= limit;
        if (nextBoard[r][c].orbs === 0) {
          nextBoard[r][c].ownerId = null;
        }

        const neighbors = getNeighbors(r, c, rows, cols);
        neighbors.forEach(([nr, nc]) => {
          nextBoard[nr][nc].orbs += 1;
          nextBoard[nr][nc].ownerId = owner;
        });
      });

      currentBoard = nextBoard;
      setBoard(currentBoard);

      // Update player states and check for eliminations
      let newlyEliminated = false;
      tempPlayers = tempPlayers.map((p) => {
        if (!p.active) return p;
        // Count orbs in new board
        const orbs = countPlayerOrbs(currentBoard, p.id);
        if (p.hasMoved && orbs === 0) {
          newlyEliminated = true;
          return { ...p, active: false };
        }
        return p;
      });

      if (newlyEliminated) {
        audioSynth.playEliminated();
      }
      setPlayers(tempPlayers);

      // Check win condition: only one active player is left AND they have moved
      const activePlayers = tempPlayers.filter((p) => p.active);
      const movedPlayers = tempPlayers.filter((p) => p.hasMoved);

      if (movedPlayers.length > 0 && activePlayers.length === 1) {
        const winner = activePlayers[0];
        const winnerOrbs = countPlayerOrbs(currentBoard, winner.id);
        setIsAnimating(false);
        audioSynth.playVictory();
        onGameFinished(winner.name, winner.color, winnerOrbs);
        return;
      }

      // Reset animation visuals shortly after
      await sleep(150);
      setShakeBoard(false);
      setExplodingCells({});
      await sleep(150); // Pause before next cascade wave starts
    }

    // Done with animations. Pass turn to next player
    setIsAnimating(false);
    
    // Find next active player
    let nextIdx = (placerId + 1) % tempPlayers.length;
    for (let i = 0; i < tempPlayers.length; i++) {
      if (tempPlayers[nextIdx].active) {
        setCurrentPlayerIndex(nextIdx);
        break;
      }
      nextIdx = (nextIdx + 1) % tempPlayers.length;
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isAnimatingRef.current) return;

    const cell = board[r][c];
    // Rule: Cell must be empty or owned by current player
    if (cell.ownerId !== null && cell.ownerId !== players[currentPlayerIndex].id) {
      return; // Invalid move
    }

    audioSynth.playPlace();

    // Clone grid
    const updatedBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    updatedBoard[r][c].orbs += 1;
    updatedBoard[r][c].ownerId = players[currentPlayerIndex].id;

    // Mark current player as having moved
    const updatedPlayers = players.map((p, idx) =>
      idx === currentPlayerIndex ? { ...p, hasMoved: true } : p
    );

    setBoard(updatedBoard);
    setPlayers(updatedPlayers);

    // Resolve cascades
    runChainReaction(updatedBoard, updatedPlayers, currentPlayerIndex);
  };



  const activePlayer = players[currentPlayerIndex] || { name: '', color: '#08ca5f' };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12 flex flex-col items-center">
      {/* Control / Info Bar */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/40 p-4 rounded-2xl glass-panel">
        <div className="flex gap-2 items-center">
          <button
            onClick={onQuit}
            aria-label="Quit game and return to player setup"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:outline-none"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Quit Setup
          </button>
          <button
            onClick={initializeGame}
            disabled={isAnimating}
            aria-label="Reset board to restart game"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:outline-none"
          >
            <FontAwesomeIcon icon={faRotateRight} /> Reset
          </button>
        </div>

        {/* Turn Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[var(--color-muted)] tracking-wider uppercase">Turn</span>
          <div
            className="px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
            style={{
              borderColor: activePlayer.color,
              backgroundColor: `${activePlayer.color}15`,
              color: activePlayer.color,
              boxShadow: `0 0 10px ${activePlayer.color}25`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activePlayer.color }}
            />
            {activePlayer.name}
          </div>
        </div>

        {/* Board Zoom & Sound Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex bg-[var(--color-surface)] rounded-lg p-0.5 border border-[var(--color-border)]/80">
            <button
              onClick={() => setZoomLevel('sm')}
              aria-label="Set grid cell size to small"
              className={`p-1.5 px-2.5 text-xs font-bold rounded-md transition focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:outline-none ${zoomLevel === 'sm' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'}`}
              title="Small Cells"
            >
              S
            </button>
            <button
              onClick={() => setZoomLevel('md')}
              aria-label="Set grid cell size to medium"
              className={`p-1.5 px-2.5 text-xs font-bold rounded-md transition focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:outline-none ${zoomLevel === 'md' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'}`}
              title="Medium Cells"
            >
              M
            </button>
            <button
              onClick={() => setZoomLevel('lg')}
              aria-label="Set grid cell size to large"
              className={`p-1.5 px-2.5 text-xs font-bold rounded-md transition focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:outline-none ${zoomLevel === 'lg' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'}`}
              title="Large Cells"
            >
              L
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Mute game sounds" : "Unmute game sounds"}
            className="w-8 h-8 rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:outline-none"
          >
            <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} />
          </button>
        </div>
      </div>

      {/* Players Standings / Leaderboard Header */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {players.map((p, idx) => {
          const isCurrent = idx === currentPlayerIndex && p.active && !isAnimating;
          const totalOrbs = countPlayerOrbs(board, p.id);
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden p-3.5 rounded-2xl border transition-all duration-300 ${
                isCurrent 
                  ? 'scale-103 bg-[var(--color-surface)]/80 z-10 shadow-lg shadow-black/5' 
                  : 'bg-[var(--color-surface)]/20 hover:bg-[var(--color-surface)]/30'
              } ${!p.active ? 'opacity-40 grayscale line-through' : ''}`}
              style={{
                borderColor: isCurrent ? p.color : 'var(--color-border)',
                boxShadow: isCurrent ? `0 0 15px ${p.color}20, inset 0 0 8px ${p.color}05` : 'none',
              }}
            >
              {/* Top border colored bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: p.color }}
              />

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate max-w-[85px] text-[var(--color-foreground)]" style={{ color: p.color }}>
                    {p.name}
                  </span>
                  {!p.active && (
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">OUT</span>
                  )}
                  {isCurrent && (
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

      {/* Grid Canvas Wrapper with responsive scroll overflow */}
      <div 
        className="w-full bg-[var(--color-surface)]/20 border border-[var(--color-border)]/50 rounded-3xl p-4 sm:p-6 overflow-hidden glass-panel"
      >
        <div className="w-full overflow-auto max-h-[85vh] lg:max-h-none custom-scrollbar p-1 sm:p-2">
          <div
            className={`grid gap-[2px] p-2 bg-[var(--color-background)]/60 rounded-2xl border border-[var(--color-border)]/40 select-none shadow-xl mx-auto zoom-${zoomLevel} ${
              shakeBoard ? 'board-shake' : ''
            }`}
            style={{
              gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
              width: 'max-content',
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const ownerColor = cell.ownerId !== null ? players.find((p) => p.id === cell.ownerId)?.color : null;
                const isExploding = explodingCells[`${r},${c}`];
                const isCellDisabled = 
                  isAnimating || 
                  (cell.ownerId !== null && cell.ownerId !== players[currentPlayerIndex].id);
                const isOwned = cell.ownerId !== null;
                const limit = getCellCriticalMass(r, c);

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`game-cell rounded-[6px] border ${
                      isOwned ? 'owned' : ''
                    } ${isExploding ? 'cell-explode' : ''} ${
                      isCellDisabled ? 'disabled cursor-not-allowed' : ''
                    }`}
                    style={{
                      '--owner-color': ownerColor || 'transparent',
                      '--owner-bg': ownerColor ? `${ownerColor}15` : 'transparent',
                      '--owner-bg-glow': ownerColor ? `${ownerColor}35` : 'transparent',
                    } as React.CSSProperties}
                  >
                    {/* Corner/Edge Indicator Dots - Tiny preview dots of player owner if empty */}
                    {cell.orbs === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: players[currentPlayerIndex]?.color }} 
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
                      <div className="w-full h-full flex items-center justify-center">
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

                    {/* Critical mass hover threshold hint */}
                    <div className="absolute top-0.5 right-0.5 text-[8px] text-[var(--color-muted)] opacity-0 hover:opacity-100 select-none pointer-events-none font-bold">
                      {cell.orbs}/{limit}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Rules overlay / info */}
      <div className="mt-6 text-center text-xs text-[var(--color-muted)] max-w-lg">
        <p>
          <strong className="text-[var(--color-foreground)]">Rules:</strong> Place orbs on empty cells or cells you own. When a cell reaches critical mass (dots = adjacent cells), it explodes, distributing orbs to neighbors and claiming them.
        </p>
      </div>
    </div>
  );
}
