'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRotateRight, 
  faVolumeUp, 
  faVolumeMute,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { PlayerSetup } from './SetupScreen';
import { audioSynth } from './AudioSynth';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getThemeColor, useIsDark } from './colors';
import '../chain-reaction.css';

interface GameBoardProps {
  initialPlayers: PlayerSetup[];
  rows: number;
  cols: number;
  soundEnabled: boolean;
  onQuit: () => void;
  onGameFinished: (winnerName: string, winnerColor: string, totalOrbs: number) => void;
  // Online Multiplayer Props
  isOnline?: boolean;
  myClientId?: string;
  roomCode?: string;
  isHost?: boolean;
  onGoToLobby?: () => void;
}

interface Cell {
  ownerId: number | null;
  orbs: number;
}

interface Player {
  id: number;
  clientId?: string;
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
  isOnline = false,
  myClientId = '',
  roomCode = '',
  isHost = false,
  onGoToLobby,
}: GameBoardProps) {
  const isDark = useIsDark();
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

  // Calculate total orbs in the session
  const totalOrbsCount = (() => {
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        count += board[r][c].orbs;
      }
    }
    return count;
  })();

  // Temporary notification toast for player disconnects
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAnimatingRef = useRef(false);

  // Refs to avoid stale closures in event listeners
  const boardRef = useRef(board);
  const playersRef = useRef(players);
  const currentPlayerIndexRef = useRef(currentPlayerIndex);
  const pendingSyncStateRef = useRef<{
    board: Cell[][];
    players: Player[];
    currentPlayerIndex: number;
  } | null>(null);

  useEffect(() => {
    boardRef.current = board;
    playersRef.current = players;
    currentPlayerIndexRef.current = currentPlayerIndex;
  }, [board, players, currentPlayerIndex]);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // Lazy audio synth configuration
  useEffect(() => {
    audioSynth.toggle(soundEnabled);
  }, [soundEnabled]);

  // Online game subscription listeners
  useEffect(() => {
    if (!isOnline || !roomCode) return;

    const channelName = `chain-reaction-game:${roomCode.toUpperCase()}`;
    const gameChannel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: myClientId },
      },
    });

    channelRef.current = gameChannel;

    const handleMoveBroadcast = (payload: any) => {
      const { r, c, playerIdx } = payload.payload;
      if (isOnline) {
        if (playerIdx !== currentPlayerIndexRef.current) {
          console.warn(`Desync detected: received move for player ${playerIdx} but local currentPlayerIndex is ${currentPlayerIndexRef.current}. Aligning.`);
          setCurrentPlayerIndex(playerIdx);
        }
        executeMove(r, c, playerIdx);
      }
    };

    const handleSyncStateBroadcast = (payload: any) => {
      const { board: syncedBoard, players: syncedPlayers, currentPlayerIndex: syncedCurrentPlayerIndex } = payload.payload;
      if (isAnimatingRef.current) {
        pendingSyncStateRef.current = {
          board: syncedBoard,
          players: syncedPlayers,
          currentPlayerIndex: syncedCurrentPlayerIndex,
        };
      } else {
        setBoard(syncedBoard);
        setPlayers(syncedPlayers);
        setCurrentPlayerIndex(syncedCurrentPlayerIndex);
      }
    };

    const handleResetGameBroadcast = () => {
      initializeGame();
    };

    const handleGoToLobbyBroadcast = () => {
      if (onGoToLobby) onGoToLobby();
    };

    const handleQuitGameBroadcast = () => {
      onQuit();
    };

    gameChannel
      .on('broadcast', { event: 'move' }, handleMoveBroadcast)
      .on('broadcast', { event: 'sync-state' }, handleSyncStateBroadcast)
      .on('broadcast', { event: 'reset-game' }, handleResetGameBroadcast)
      .on('broadcast', { event: 'go-to-lobby' }, handleGoToLobbyBroadcast)
      .on('broadcast', { event: 'quit-game' }, handleQuitGameBroadcast)
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const leftClientIds = leftPresences.map((p: any) => p.clientId);

        setPlayers((prevPlayers) => {
          let changed = false;
          const updated = prevPlayers.map((p) => {
            if (p.clientId && leftClientIds.includes(p.clientId) && p.active) {
              changed = true;
              setToastMessage(`${p.name} disconnected!`);
              setTimeout(() => setToastMessage(null), 3000);
              return { ...p, active: false };
            }
            return p;
          });

          if (changed) {
            audioSynth.playEliminated();
          }
          return updated;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const me = playersRef.current.find((p) => p.clientId === myClientId);
          if (me) {
            await gameChannel.track({
              clientId: myClientId,
              name: me.name,
              color: me.color,
              isHost,
            });
          }
        }
      });

    return () => {
      gameChannel.unsubscribe();
      supabase.removeChannel(gameChannel);
      channelRef.current = null;
    };
  }, [isOnline, roomCode, myClientId, isHost]);

  // Gracefully skip disconnected players' turns
  useEffect(() => {
    if (!isOnline || players.length === 0 || isAnimating) return;

    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer && !currentPlayer.active) {
      // Find next active player
      let nextIdx = (currentPlayerIndex + 1) % players.length;
      let found = false;
      for (let i = 0; i < players.length; i++) {
        if (players[nextIdx].active) {
          setCurrentPlayerIndex(nextIdx);
          found = true;
          break;
        }
        nextIdx = (nextIdx + 1) % players.length;
      }

      // If we are the host, sync this advanced turn state immediately
      if (isHost && found && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'sync-state',
          payload: {
            board,
            players,
            currentPlayerIndex: nextIdx,
          },
        });
      }
    }
  }, [players, currentPlayerIndex, isOnline, isHost, board, isAnimating]);

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
    isAnimatingRef.current = false;
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
    isAnimatingRef.current = true;
    let currentBoard = startBoard.map((row) => row.map((cell) => ({ ...cell })));
    let tempPlayers = currentPlayers.map((p) => ({ ...p }));

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let hasExplodedInWave = true;

    while (hasExplodedInWave) {
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
      audioSynth.playExplosion();

      setShakeBoard(true);
      const waveExploding: Record<string, boolean> = {};
      unstableCells.forEach((cell) => {
        waveExploding[`${cell.r},${cell.c}`] = true;
      });
      setExplodingCells(waveExploding);

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

      let newlyEliminated = false;
      tempPlayers = tempPlayers.map((p) => {
        if (!p.active) return p;
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

      const activePlayers = tempPlayers.filter((p) => p.active);
      const movedPlayers = tempPlayers.filter((p) => p.hasMoved);

      if (movedPlayers.length > 0 && activePlayers.length === 1) {
        const winner = activePlayers[0];
        const winnerOrbs = countPlayerOrbs(currentBoard, winner.id);
        setIsAnimating(false);
        isAnimatingRef.current = false;
        audioSynth.playVictory();
        onGameFinished(winner.name, winner.color, winnerOrbs);
        return;
      }

      await sleep(150);
      setShakeBoard(false);
      setExplodingCells({});
      await sleep(150);
    }
    // Add a short pause after explosions complete before allowing the next player to place their orb
    await sleep(500);

    setIsAnimating(false);
    isAnimatingRef.current = false;
    
    if (isOnline) {
      const isPlacer = tempPlayers[placerId]?.clientId === myClientId;
      if (isPlacer) {
        // Find next active player
        let nextIdx = (placerId + 1) % tempPlayers.length;
        let foundNext = false;
        for (let i = 0; i < tempPlayers.length; i++) {
          if (tempPlayers[nextIdx].active) {
            setCurrentPlayerIndex(nextIdx);
            foundNext = true;
            break;
          }
          nextIdx = (nextIdx + 1) % tempPlayers.length;
        }

        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'sync-state',
            payload: {
              board: currentBoard,
              players: tempPlayers,
              currentPlayerIndex: foundNext ? nextIdx : placerId,
            },
          });
        }
      } else {
        // Guest client: check for deferred sync state
        if (pendingSyncStateRef.current) {
          const pending = pendingSyncStateRef.current;
          setBoard(pending.board);
          setPlayers(pending.players);
          setCurrentPlayerIndex(pending.currentPlayerIndex);
          pendingSyncStateRef.current = null;
        }
      }
    } else {
      // Offline local game: advance turn index normally
      let nextIdx = (placerId + 1) % tempPlayers.length;
      let foundNext = false;
      for (let i = 0; i < tempPlayers.length; i++) {
        if (tempPlayers[nextIdx].active) {
          setCurrentPlayerIndex(nextIdx);
          foundNext = true;
          break;
        }
        nextIdx = (nextIdx + 1) % tempPlayers.length;
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isAnimatingRef.current) return;

    const cell = board[r][c];
    if (cell.ownerId !== null && cell.ownerId !== players[currentPlayerIndex].id) {
      return; // Invalid move
    }

    if (isOnline) {
      const activePlayer = players[currentPlayerIndex];
      // Lock click input if it isn't our turn
      if (activePlayer.clientId !== myClientId) {
        return;
      }

      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'move',
          payload: { r, c, playerIdx: currentPlayerIndex },
        });
      }
    }

    executeMove(r, c, currentPlayerIndex);
  };

  const executeMove = (r: number, c: number, playerIdx: number) => {
    audioSynth.playPlace();

    const currentBoard = boardRef.current;
    const currentPlayers = playersRef.current;

    const updatedBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
    updatedBoard[r][c].orbs += 1;
    updatedBoard[r][c].ownerId = currentPlayers[playerIdx].id;

    const updatedPlayers = currentPlayers.map((p, idx) =>
      idx === playerIdx ? { ...p, hasMoved: true } : p
    );

    setBoard(updatedBoard);
    setPlayers(updatedPlayers);

    runChainReaction(updatedBoard, updatedPlayers, playerIdx);
  };

  const handleResetClick = () => {
    if (isOnline) {
      if (isHost && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'reset-game',
        });
      } else {
        return; // Only host resets online game
      }
    }
    initializeGame();
  };

  const handleQuitClick = () => {
    if (isOnline && isHost && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'quit-game',
      });
    }
    onQuit();
  };

  const activePlayer = players[currentPlayerIndex] || { name: '', color: '#08ca5f' };
  const activePlayerThemeColor = getThemeColor(activePlayer.color, isDark);
  const isMyTurn = isOnline ? (activePlayer.clientId === myClientId) : true;

  const myPlayer = players.find((p) => p.clientId === myClientId);
  const myPlayerColor = myPlayer ? getThemeColor(myPlayer.color, isDark) : 'transparent';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12 flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600/90 text-white px-4 py-2.5 rounded-xl border border-red-500/40 shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <FontAwesomeIcon icon={faCircleInfo} />
          {toastMessage}
        </div>
      )}

      {/* Control / Info Bar */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/40 p-4 rounded-2xl glass-panel">
        <div className="flex gap-2 items-center">
          <button
            onClick={handleQuitClick}
            aria-label="Quit game and return to setup"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> {isOnline ? 'Leave Room' : 'Quit Setup'}
          </button>
          
          {(!isOnline || isHost) && (
            <button
              onClick={handleResetClick}
              disabled={isAnimating}
              aria-label="Reset board to restart game"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faRotateRight} /> Reset
            </button>
          )}
        </div>

        {/* Turn & Session Stats Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--color-muted)] tracking-wider uppercase">Turn</span>
            <div
              className="px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
              style={{
                borderColor: activePlayerThemeColor,
                backgroundColor: `${activePlayerThemeColor}15`,
                color: activePlayerThemeColor,
                boxShadow: `0 0 10px ${activePlayerThemeColor}25`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: activePlayerThemeColor }}
              />
              {activePlayer.name}
              {isOnline && isMyTurn && (
                <span className="text-[10px] text-green-500 font-extrabold ml-1 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
                  (You)
                </span>
              )}
            </div>
          </div>

          <div className="px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="text-[var(--color-muted)]">Total Orbs:</span>
            <span className="text-[var(--color-foreground)]">{totalOrbsCount}</span>
          </div>
        </div>

        {/* Board Zoom & Sound Controls */}
        <div className="flex items-center gap-3">
          {isOnline && (
            <div className="flex items-center gap-2 text-xs font-bold bg-[var(--color-surface)] px-3 py-1.5 rounded-xl border border-[var(--color-border)]/80">
              <span className="text-[var(--color-muted)]">You:</span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                style={{
                  backgroundColor: myPlayerColor,
                }}
              />
              <span className="text-[var(--color-foreground)] truncate max-w-[80px]">
                {myPlayer?.name}
              </span>
            </div>
          )}

          {/* Zoom Buttons */}
          <div className="flex bg-[var(--color-surface)] rounded-lg p-0.5 border border-[var(--color-border)]/80">
            {['sm', 'md', 'lg'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setZoomLevel(lvl as 'sm' | 'md' | 'lg')}
                aria-label={`Set cell size to ${lvl}`}
                className={`p-1.5 px-2.5 text-xs font-bold rounded-md transition ${zoomLevel === lvl ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'}`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Mute game sounds" : "Unmute game sounds"}
            className="w-8 h-8 rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
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
          const isLocalPlayer = isOnline && p.clientId === myClientId;
          const playerThemeColor = getThemeColor(p.color, isDark);
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden p-3.5 rounded-2xl border transition-all duration-300 ${
                isCurrent 
                  ? 'scale-103 bg-[var(--color-surface)]/80 z-10 shadow-lg shadow-black/5' 
                  : 'bg-[var(--color-surface)]/20 hover:bg-[var(--color-surface)]/30'
              } ${!p.active ? 'opacity-40 grayscale line-through' : ''}`}
              style={{
                borderColor: isCurrent ? playerThemeColor : 'var(--color-border)',
                boxShadow: isCurrent ? `0 0 15px ${playerThemeColor}20, inset 0 0 8px ${playerThemeColor}05` : 'none',
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

      {/* Grid Canvas Wrapper */}
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
                const rawOwnerColor = cell.ownerId !== null ? players.find((p) => p.id === cell.ownerId)?.color : null;
                const ownerColor = rawOwnerColor ? getThemeColor(rawOwnerColor, isDark) : null;
                const isExploding = explodingCells[`${r},${c}`];
                
                // Disable input if board is animating, or cell is owned by another, or if online and not our turn
                const isCellDisabled = 
                  isAnimating || 
                  (cell.ownerId !== null && cell.ownerId !== players[currentPlayerIndex].id) ||
                  (isOnline && !isMyTurn);

                const isOwned = cell.ownerId !== null;
                const limit = getCellCriticalMass(r, c);
                const isCritical = cell.orbs > 0 && cell.orbs === limit - 1;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`game-cell rounded-[6px] border ${
                      isOwned ? 'owned' : ''
                    } ${isExploding ? 'cell-explode' : ''} ${
                      isCritical ? 'critical-cell' : ''
                    } ${
                      isCellDisabled ? 'disabled cursor-not-allowed' : 'hover:scale-102 hover:shadow-sm'
                    }`}
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
                          style={{ backgroundColor: getThemeColor(players[currentPlayerIndex]?.color, isDark) }} 
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

      {/* Gameplay & Critical Mass Guide */}
      <div className="mt-8 w-full max-w-lg bg-[var(--color-surface)]/30 border border-[var(--color-border)]/40 p-5 rounded-2xl glass-panel text-xs text-[var(--color-muted)]">
        <h4 className="text-[var(--color-foreground)] font-bold mb-3 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[var(--color-accent)] text-sm" />
          Critical Mass Explosion Guide
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Corners</span>
            <span className="text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">2 Orbs</span>
            <span className="text-[9px] text-[var(--color-muted)] leading-tight mt-0.5">Explodes to 2 neighbors</span>
          </div>
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Edges</span>
            <span className="text-[10px] text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">3 Orbs</span>
            <span className="text-[9px] text-[var(--color-muted)] leading-tight mt-0.5">Explodes to 3 neighbors</span>
          </div>
          <div className="bg-[var(--color-background)]/50 border border-[var(--color-border)]/30 p-2.5 rounded-xl flex flex-col gap-1.5 items-center">
            <span className="text-[var(--color-foreground)] font-extrabold">Inner Cells</span>
            <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">4 Orbs</span>
            <span className="text-[9px] text-[var(--color-muted)] leading-tight mt-0.5">Explodes to 4 neighbors</span>
          </div>
        </div>
        <p className="leading-relaxed text-center border-t border-[var(--color-border)]/30 pt-3">
          <strong className="text-[var(--color-foreground)]">How to win:</strong> Place orbs on empty or owned cells. When a cell reaches critical mass (orbs = adjacent neighbors), it explodes, claiming and distributing orbs to neighbors. Eliminate all other players to dominate!
        </p>
      </div>
    </div>
  );
}
