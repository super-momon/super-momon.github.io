'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faRotateRight, 
  faVolumeUp, 
  faVolumeMute,
  faCircleInfo,
  faComments,
  faPaperPlane,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons';
import { PlayerSetup } from './SetupScreen';
import { audioSynth } from './AudioSynth';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getThemeColor, useIsDark } from './colors';
import GameChat from './GameChat';
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
  // True when this board was restored from a persisted session after a page
  // reload, so it should immediately pull the current state from peers.
  resumed?: boolean;
}

interface Cell {
  ownerId: number | null;
  orbs: number;
}

export interface Player {
  id: number;
  clientId?: string;
  name: string;
  color: string;
  active: boolean;
  hasMoved: boolean;
  // Whether this player's client is currently connected to the realtime
  // channel. Distinct from `active` (which tracks elimination) so that a
  // player who drops offline can rejoin and resume instead of being removed.
  connected: boolean;
}

export interface ChatMessage {
  id: string;
  clientId: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: number;
  isAlert?: boolean;
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
  resumed = false,
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
      connected: true,
    }))
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSound);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [explodingCells, setExplodingCells] = useState<Record<string, boolean>>({});

  // Session Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const isChatOpenRef = useRef<boolean>(false);

  // Shout Alerts & Board Shake State
  const [activeAlert, setActiveAlert] = useState<ChatMessage | null>(null);
  const [isShoutShaking, setIsShoutShaking] = useState<boolean>(false);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen((open) => {
      if (!open) {
        setUnreadCount(0);
      }
      return !open;
    });
  };



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

  // Temporary notification toast for player disconnects and reconnects
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Match Duration Timer State
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerAlert = (message: ChatMessage) => {
    if (!message.isAlert) return;
    
    // Play alert sound if enabled
    if (soundEnabled) {
      audioSynth.playAlert();
    }

    // Set active alert
    setActiveAlert(message);

    // Trigger board shake
    setIsShoutShaking(true);
    setTimeout(() => {
      setIsShoutShaking(false);
    }, 450);

    // Clear existing timeout
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    // Auto-hide alert after 3.5 seconds
    alertTimeoutRef.current = setTimeout(() => {
      setActiveAlert(null);
      alertTimeoutRef.current = null;
    }, 3500);
  };

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
  // Tracks whether we've completed an initial channel subscription, so a
  // subsequent SUBSCRIBED (from Supabase auto-reconnect) can be treated as a
  // reconnection and trigger a state resync.
  const hasSubscribedRef = useRef<boolean>(false);
  // Kept in a ref so the (async) subscribe callback can read the latest value
  // without adding it to the channel effect deps and forcing a resubscribe.
  const resumedRef = useRef<boolean>(resumed);
  useEffect(() => {
    resumedRef.current = resumed;
  }, [resumed]);

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

    const handleChatBroadcast = (payload: any) => {
      const { message } = payload.payload;
      setMessages((prev) => [...prev, message]);
      
      // Use ref to read fresh state without re-running subscription useEffect
      if (!isChatOpenRef.current) {
        setUnreadCount((c) => c + 1);
      }

      if (message.isAlert) {
        triggerAlert(message);
      }
    };

    const handleGoToLobbyBroadcast = () => {
      if (onGoToLobby) onGoToLobby();
    };

    const handleQuitGameBroadcast = () => {
      onQuit();
    };

    // A reconnecting client asks its peers for the current game state. To
    // avoid a flood of conflicting replies, exactly one peer answers: the
    // connected player with the lowest id (a deterministic choice all clients
    // agree on). This also covers the host reconnecting, since another
    // connected player will respond in its place.
    const handleRequestSyncBroadcast = (payload: { payload?: { clientId?: string } }) => {
      const requesterId = payload?.payload?.clientId;
      if (!requesterId || requesterId === myClientId) return;
      if (isAnimatingRef.current) return;

      const responder = playersRef.current
        .filter((p) => p.connected && p.clientId && p.clientId !== requesterId)
        .sort((a, b) => a.id - b.id)[0];
      if (!responder || responder.clientId !== myClientId) return;

      channelRef.current?.send({
        type: 'broadcast',
        event: 'sync-state',
        payload: {
          board: boardRef.current,
          players: playersRef.current,
          currentPlayerIndex: currentPlayerIndexRef.current,
        },
      });
    };

    gameChannel
      .on('broadcast', { event: 'move' }, handleMoveBroadcast)
      .on('broadcast', { event: 'sync-state' }, handleSyncStateBroadcast)
      .on('broadcast', { event: 'reset-game' }, handleResetGameBroadcast)
      .on('broadcast', { event: 'chat' }, handleChatBroadcast)
      .on('broadcast', { event: 'go-to-lobby' }, handleGoToLobbyBroadcast)
      .on('broadcast', { event: 'quit-game' }, handleQuitGameBroadcast)
      .on('broadcast', { event: 'request-sync' }, handleRequestSyncBroadcast)
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const joinedClientIds = newPresences.map((p) => (p as { clientId?: string }).clientId);

        setPlayers((prevPlayers) =>
          prevPlayers.map((p) => {
            // Flip a previously-dropped player back to connected so their
            // turns are no longer skipped and they can keep playing. The
            // reconnecting client pulls fresh state via `request-sync`.
            if (p.clientId && joinedClientIds.includes(p.clientId) && !p.connected) {
              setToast({ message: `${p.name} reconnected!`, type: 'success' });
              setTimeout(() => setToast(null), 3000);
              return { ...p, connected: true };
            }
            return p;
          })
        );
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const leftClientIds = leftPresences.map((p: any) => p.clientId);

        setPlayers((prevPlayers) => {
          // Mark the player as disconnected rather than eliminated so they
          // keep their board position and can reconnect to continue.
          const updated = prevPlayers.map((p) => {
            if (p.clientId && leftClientIds.includes(p.clientId) && p.connected) {
              setToast({ message: `${p.name} disconnected. Waiting for them to reconnect…`, type: 'error' });
              setTimeout(() => setToast(null), 3000);
              return { ...p, connected: false };
            }
            return p;
          });
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

          if (hasSubscribedRef.current || resumedRef.current) {
            // Either Supabase auto-reconnect fired SUBSCRIBED again, or this
            // board was restored after a reload: pull the latest authoritative
            // state so we resume exactly where play stands.
            gameChannel.send({
              type: 'broadcast',
              event: 'request-sync',
              payload: { clientId: myClientId },
            });
          }
          hasSubscribedRef.current = true;
        }
      });

    return () => {
      gameChannel.unsubscribe();
      supabase.removeChannel(gameChannel);
      channelRef.current = null;
      hasSubscribedRef.current = false;
    };
  }, [isOnline, roomCode, myClientId, isHost]);

  // Gracefully skip disconnected players' turns
  useEffect(() => {
    if (!isOnline || players.length === 0 || isAnimating) return;

    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer && (!currentPlayer.active || !currentPlayer.connected)) {
      // Find next active, connected player
      let nextIdx = (currentPlayerIndex + 1) % players.length;
      let found = false;
      for (let i = 0; i < players.length; i++) {
        if (players[nextIdx].active && players[nextIdx].connected) {
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
      connected: true,
    }));

    setBoard(freshBoard);
    setPlayers(freshPlayers);
    setCurrentPlayerIndex(0);
    setIsAnimating(false);
    isAnimatingRef.current = false;
    setExplodingCells({});
    setSecondsElapsed(0);
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
          if (tempPlayers[nextIdx].active && tempPlayers[nextIdx].connected) {
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

  const sendChatMessage = (text: string, isAlert?: boolean) => {
    if (!text.trim() || !channelRef.current) return;
    
    const me = players.find((p) => p.clientId === myClientId);
    if (!me) return;

    const chatMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: myClientId,
      senderName: me.name,
      senderColor: me.color,
      text: text.trim(),
      timestamp: Date.now(),
      isAlert,
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'chat',
      payload: { message: chatMsg },
    }).then(() => {
      setMessages((prev) => [...prev, chatMsg]);
      if (isAlert) {
        triggerAlert(chatMsg);
      }
    }).catch((err) => {
      console.error('Error broadcasting chat:', err);
    });
  };

  const activePlayer = players[currentPlayerIndex] || { name: '', color: '#08ca5f' };
  const activePlayerThemeColor = getThemeColor(activePlayer.color, isDark);
  const isMyTurn = isOnline ? (activePlayer.clientId === myClientId) : true;

  const myPlayer = players.find((p) => p.clientId === myClientId);
  const myPlayerColor = myPlayer ? getThemeColor(myPlayer.color, isDark) : 'transparent';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12 flex flex-col items-center">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce text-white ${
            toast.type === 'success' 
              ? 'bg-green-600/90 border-green-500/40 shadow-green-500/10' 
              : toast.type === 'error' 
                ? 'bg-red-600/90 border-red-500/40 shadow-red-500/10' 
                : 'bg-indigo-600/90 border-indigo-500/40 shadow-indigo-500/10'
          }`}
        >
          <FontAwesomeIcon icon={faCircleInfo} />
          {toast.message}
        </div>
      )}

      {/* Control / Info Bar */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-[var(--color-surface)]/90 border border-[var(--color-border)] p-4 rounded-2xl shadow-sm backdrop-blur-md">
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

          <button
            onClick={() => setIsInfoOpen(true)}
            aria-label="Show gameplay rules"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faCircleInfo} /> Guide
          </button>
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

          <div className="px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="text-[var(--color-muted)]">Duration:</span>
            <span className="text-[var(--color-foreground)]">{formatTime(secondsElapsed)}</span>
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

      {/* Board & Chat Responsive Layout Grid */}
      <div className="w-full relative">
        {/* Shout Alert Overlay Banner */}
        {activeAlert && (
          <div className="shout-banner-overlay">
            <div 
              className="shout-banner animate-shout-banner"
              style={{
                '--shout-color': getThemeColor(activeAlert.senderColor, isDark),
                '--shout-glow': `${getThemeColor(activeAlert.senderColor, isDark)}40`,
              } as any}
            >
              <div className="shout-title">
                <FontAwesomeIcon icon={faBullhorn} className="text-sm" />
                {activeAlert.senderName} Shouts
              </div>
              <div className="shout-message">
                {activeAlert.text}
              </div>
            </div>
          </div>
        )}

        {/* Grid Canvas Wrapper */}
        <div 
          className={`w-full bg-[var(--color-surface)]/20 border border-[var(--color-border)]/50 rounded-3xl p-4 sm:p-6 overflow-hidden glass-panel flex items-center justify-center transition-all ${
            isShoutShaking ? 'shout-shake' : ''
          }`}
        >
          <div className="w-full overflow-auto max-h-[85vh] lg:max-h-none custom-scrollbar p-1 sm:p-2">
            <div
              className={`grid gap-[2px] p-2 bg-[var(--color-background)]/60 rounded-2xl border border-[var(--color-border)]/40 select-none shadow-xl mx-auto zoom-${zoomLevel}`}
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

        {/* Floating Chat Component */}
        {isOnline && (
          <GameChat
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            unreadCount={unreadCount}
            messages={messages}
            roomCode={roomCode}
            myClientId={myClientId}
            sendChatMessage={sendChatMessage}
            isDark={isDark}
            players={players}
          />
        )}
      </div>

      {/* Gameplay & Critical Mass Guide (Modal overlay) */}
      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsInfoOpen(false)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity" 
          />
          
          <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-3xl p-6 shadow-2xl overflow-hidden glass-panel text-xs text-[var(--color-muted)] z-10 animate-in fade-in zoom-in duration-200">
            {/* Glow Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-[var(--color-border)]/30 pb-3">
              <h4 className="text-[var(--color-foreground)] font-bold text-sm flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCircleInfo} className="text-[var(--color-accent)] text-base" />
                Critical Mass Explosion Guide
              </h4>
              <button
                onClick={() => setIsInfoOpen(false)}
                className="w-8 h-8 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-muted)]/50 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-background)] transition cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Guide Grid */}
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
      )}
    </div>
  );
}
