'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Cell, getNeighbors, getCellCriticalMass, countPlayerOrbs } from './gameUtils';
import { GameCell } from './GameCell';
import { PlayerStandings } from './PlayerStandings';
import { GameBoardControls } from './GameBoardControls';
import { ShoutBanner } from './ShoutBanner';
import { GameGuideModal } from './GameGuideModal';
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
  turnSecondsLimit?: number;
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
  disconnectSecondsLeft?: number;
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
  turnSecondsLimit = 30,
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
  const [turnSecondsLeft, setTurnSecondsLeft] = useState<number>(turnSecondsLimit);

  // Session Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const isChatOpenRef = useRef<boolean>(false);

  // Shout Alerts & Board Shake State
  const [activeAlerts, setActiveAlerts] = useState<ChatMessage[]>([]);
  const [isShoutShaking, setIsShoutShaking] = useState<boolean>(false);

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

    // Add alert to stack
    setActiveAlerts((prev) => [...prev, message]);

    // Trigger board shake
    setIsShoutShaking(true);
    setTimeout(() => {
      setIsShoutShaking(false);
    }, 450);

    // Auto-remove this specific alert after 3.5 seconds
    setTimeout(() => {
      setActiveAlerts((prev) => prev.filter((a) => a.id !== message.id));
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
    isTimeout?: boolean;
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

  // Grace period timers: when a player's presence fires 'leave', we delay
  // marking them disconnected by DISCONNECT_GRACE_MS. If a 'join' for the
  // same clientId arrives before the timer fires, we cancel it — it was just
  // a Supabase websocket reconnect, not a real disconnect.
  const DISCONNECT_GRACE_MS = 5000;
  const disconnectTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Ref for the periodic presence re-track interval on the game channel
  const presenceRetrackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref for request-sync retry timer
  const syncRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncRetryCountRef = useRef<number>(0);
  const MAX_SYNC_RETRIES = 2;

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
      const { board: syncedBoard, players: syncedPlayers, currentPlayerIndex: syncedCurrentPlayerIndex, isTimeout } = payload.payload;
      
      if (isTimeout) {
        const prevActivePlayer = playersRef.current[currentPlayerIndexRef.current];
        if (prevActivePlayer) {
          setToast({ message: `${prevActivePlayer.name}'s turn timed out!`, type: 'info' });
          setTimeout(() => setToast(null), 3000);
        }
      }

      if (isAnimatingRef.current) {
        pendingSyncStateRef.current = {
          board: syncedBoard,
          players: syncedPlayers,
          currentPlayerIndex: syncedCurrentPlayerIndex,
          isTimeout,
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

        // Cancel any pending disconnect grace timers for reconnecting clients
        joinedClientIds.forEach((cid) => {
          if (cid && disconnectTimersRef.current[cid]) {
            clearTimeout(disconnectTimersRef.current[cid]);
            delete disconnectTimersRef.current[cid];
          }
        });

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
        const leftClientIds = leftPresences.map((p: any) => p.clientId).filter(Boolean) as string[];

        // Start a grace period timer for each leaving client. If they
        // reconnect within DISCONNECT_GRACE_MS, the timer is cancelled by
        // the 'join' handler above and no disconnect is shown.
        leftClientIds.forEach((cid) => {
          // Don't start a timer if one is already pending
          if (disconnectTimersRef.current[cid]) return;

          const playerName = playersRef.current.find((p) => p.clientId === cid)?.name || 'A player';

          disconnectTimersRef.current[cid] = setTimeout(() => {
            delete disconnectTimersRef.current[cid];

            setPlayers((prevPlayers) => {
              const updated = prevPlayers.map((p) => {
                if (p.clientId === cid && p.connected) {
                  setToast({ message: `${p.name} disconnected. Waiting for them to reconnect…`, type: 'error' });
                  setTimeout(() => setToast(null), 4000);
                  return { ...p, connected: false };
                }
                return p;
              });
              return updated;
            });
          }, DISCONNECT_GRACE_MS);
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
            syncRetryCountRef.current = 0;
            const sendSyncRequest = () => {
              gameChannel.send({
                type: 'broadcast',
                event: 'request-sync',
                payload: { clientId: myClientId },
              });
            };
            sendSyncRequest();

            // Retry up to MAX_SYNC_RETRIES times if no sync-state arrives
            if (syncRetryTimerRef.current) clearTimeout(syncRetryTimerRef.current);
            const scheduleRetry = () => {
              syncRetryTimerRef.current = setTimeout(() => {
                syncRetryCountRef.current += 1;
                if (syncRetryCountRef.current <= MAX_SYNC_RETRIES) {
                  sendSyncRequest();
                  scheduleRetry();
                }
                syncRetryTimerRef.current = null;
              }, 3000);
            };
            scheduleRetry();
          }
          hasSubscribedRef.current = true;

          // Start periodic presence re-track (every 30s) to keep presence
          // fresh even after Supabase internal reconnects.
          if (presenceRetrackIntervalRef.current) clearInterval(presenceRetrackIntervalRef.current);
          presenceRetrackIntervalRef.current = setInterval(() => {
            const currentMe = playersRef.current.find((p) => p.clientId === myClientId);
            if (currentMe && channelRef.current) {
              channelRef.current.track({
                clientId: myClientId,
                name: currentMe.name,
                color: currentMe.color,
                isHost,
              });
            }
          }, 30000);
        }
      });

    // Clear sync retry timer when a sync-state is received
    const originalHandleSyncState = handleSyncStateBroadcast;
    // We clear the retry on sync-state receipt inside the handler above,
    // but also attach a supplemental listener via the ref:
    const clearSyncRetry = () => {
      if (syncRetryTimerRef.current) {
        clearTimeout(syncRetryTimerRef.current);
        syncRetryTimerRef.current = null;
      }
      syncRetryCountRef.current = 0;
    };
    // Wrap the sync-state handler to also clear retry timers
    const wrappedSyncState = (payload: any) => {
      clearSyncRetry();
      originalHandleSyncState(payload);
    };
    // Re-register with wrapped handler (replace the one set above)
    gameChannel.on('broadcast', { event: 'sync-state' }, wrappedSyncState);

    return () => {
      // Clean up disconnect grace timers
      Object.values(disconnectTimersRef.current).forEach(clearTimeout);
      disconnectTimersRef.current = {};
      // Clean up periodic re-track interval
      if (presenceRetrackIntervalRef.current) {
        clearInterval(presenceRetrackIntervalRef.current);
        presenceRetrackIntervalRef.current = null;
      }
      // Clean up sync retry timer
      if (syncRetryTimerRef.current) {
        clearTimeout(syncRetryTimerRef.current);
        syncRetryTimerRef.current = null;
      }
      gameChannel.unsubscribe();
      supabase.removeChannel(gameChannel);
      channelRef.current = null;
      hasSubscribedRef.current = false;
    };
  }, [isOnline, roomCode, myClientId, isHost]);

  // Gracefully skip disconnected players' turns.
  // Only skips if the player is truly disconnected (i.e. their grace period
  // timer has already expired and `connected` is false — not during a brief
  // network blip where the grace timer is still pending).
  useEffect(() => {
    if (!isOnline || players.length === 0 || isAnimating) return;

    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    // Only skip if the player is inactive (eliminated) or confirmed
    // disconnected (grace period expired). If there's a pending disconnect
    // timer for this client, the grace period hasn't expired yet — don't skip.
    const hasGracePending = currentPlayer.clientId
      ? !!disconnectTimersRef.current[currentPlayer.clientId]
      : false;

    if (!currentPlayer.active || (!currentPlayer.connected && !hasGracePending)) {
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

  // Player disconnect timeout (120 seconds)
  useEffect(() => {
    if (!isOnline || players.length === 0) return;

    const interval = setInterval(() => {
      setPlayers((prevPlayers) => {
        let changed = false;
        const newPlayers = prevPlayers.map((p) => {
          if (p.active && !p.connected) {
            const currentLeft = p.disconnectSecondsLeft ?? 120;
            if (currentLeft <= 1) {
              changed = true;
              return { ...p, active: false, disconnectSecondsLeft: 0 };
            }
            changed = true;
            return { ...p, disconnectSecondsLeft: currentLeft - 1 };
          } else if (p.active && p.connected && p.disconnectSecondsLeft !== undefined) {
            changed = true;
            const newP = { ...p };
            delete newP.disconnectSecondsLeft;
            return newP;
          }
          return p;
        });

        return changed ? newPlayers : prevPlayers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnline, players.length]);

  // Game win condition evaluation (for when players are eliminated by disconnect)
  useEffect(() => {
    if (players.length === 0 || isAnimating) return;

    const activePlayers = players.filter((p) => p.active);
    const movedPlayers = players.filter((p) => p.hasMoved);
    
    // Only declare a winner if someone has actually moved (prevents instant win before game starts)
    if (movedPlayers.length > 0 && activePlayers.length === 1 && players.length > 1) {
      const winner = activePlayers[0];
      const winnerOrbs = countPlayerOrbs(board, winner.id);
      
      setIsAnimating(false);
      isAnimatingRef.current = false;
      audioSynth.playVictory();
      onGameFinished(winner.name, winner.color, winnerOrbs);
    }
  }, [players, board, isAnimating, onGameFinished]);

  // Reset turn timer when currentPlayerIndex changes or when animation finishes
  useEffect(() => {
    if (!isAnimating) {
      setTurnSecondsLeft(turnSecondsLimit);
    }
  }, [currentPlayerIndex, isAnimating, turnSecondsLimit]);

  // Turn timer countdown effect
  useEffect(() => {
    if (isAnimating) return;

    const activePlayers = playersRef.current.filter((p) => p.active);
    if (activePlayers.length <= 1) return;

    const interval = setInterval(() => {
      setTurnSecondsLeft((prev) => {
        const activePlayer = playersRef.current[currentPlayerIndex];
        const isMyTurn = isOnline ? (activePlayer?.clientId === myClientId) : true;
        
        // Active player times out at 0, host enforces fallback at -3 to prevent race conditions and duplicate messages
        const timeoutThreshold = isMyTurn ? 0 : -3;

        if (prev <= timeoutThreshold + 1) {
          clearInterval(interval);
          
          const shouldAct = isMyTurn || (isHost && !isMyTurn);
          if (shouldAct) {
            setTimeout(() => {
              skipCurrentPlayerTurn();
            }, 0);
          }
          return turnSecondsLimit;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayerIndex, isAnimating, isOnline, isHost, myClientId, turnSecondsLimit]);

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

  // Reusable functions countPlayerOrbs and getCellCriticalMass are now imported from gameUtils.ts

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
          const limit = getCellCriticalMass(r, c, rows, cols);
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

  const skipCurrentPlayerTurn = () => {
    const currentPlayers = playersRef.current;
    const currentIdx = currentPlayerIndexRef.current;
    const currentActivePlayer = currentPlayers[currentIdx];
    if (!currentActivePlayer) return;

    let nextIdx = (currentIdx + 1) % currentPlayers.length;
    let foundNext = false;
    for (let i = 0; i < currentPlayers.length; i++) {
      const p = currentPlayers[nextIdx];
      const isPlayerAvailable = isOnline ? (p.active && p.connected) : p.active;
      if (isPlayerAvailable) {
        foundNext = true;
        break;
      }
      nextIdx = (nextIdx + 1) % currentPlayers.length;
    }

    if (foundNext) {
      setCurrentPlayerIndex(nextIdx);
      setTurnSecondsLeft(turnSecondsLimit);

      // Show toast alert on the local machine that triggered the skip (works for both offline play and the online player/host who handled the skip)
      setToast({ message: `${currentActivePlayer.name}'s turn timed out!`, type: 'info' });
      setTimeout(() => setToast(null), 3000);

      if (isOnline) {
        const isMyTurn = currentActivePlayer.clientId === myClientId;
        if (isMyTurn || isHost) {
          if (channelRef.current) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'sync-state',
              payload: {
                board: boardRef.current,
                players: currentPlayers,
                currentPlayerIndex: nextIdx,
                isTimeout: true,
              },
            });
          }
        }
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
      <GameBoardControls
        isOnline={isOnline}
        isHost={isHost}
        isAnimating={isAnimating}
        activePlayer={activePlayer}
        activePlayerThemeColor={activePlayerThemeColor}
        isMyTurn={isMyTurn}
        totalOrbsCount={totalOrbsCount}
        secondsElapsed={secondsElapsed}
        myPlayer={myPlayer}
        myPlayerColor={myPlayerColor}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onQuitClick={handleQuitClick}
        onResetClick={handleResetClick}
        onOpenGuide={() => setIsInfoOpen(true)}
      />

      {/* Players Standings / Leaderboard Header */}
      <PlayerStandings
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        isAnimating={isAnimating}
        board={board}
        myClientId={myClientId}
        isOnline={isOnline}
        isDark={isDark}
        turnSecondsLeft={turnSecondsLeft}
      />

      {/* Board & Chat Responsive Layout Grid */}
      <div className="w-full relative">
        {/* Shout Alert Overlay Banner */}
        <ShoutBanner
          activeAlerts={activeAlerts}
          isDark={isDark}
          onDismiss={(id) => {
            setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
          }}
        />

        {/* Grid Canvas Wrapper */}
        <div 
          className={`w-full bg-[var(--color-surface)]/20 border rounded-3xl p-4 sm:p-6 overflow-hidden glass-panel flex items-center justify-center transition-all duration-500 ${
            isShoutShaking ? 'shout-shake' : ''
          }`}
          style={{
            borderColor: activePlayerThemeColor ? `${activePlayerThemeColor}40` : 'var(--color-border)',
            boxShadow: activePlayerThemeColor ? `0 8px 30px ${activePlayerThemeColor}10, inset 0 0 0 1px ${activePlayerThemeColor}15` : 'none',
          }}
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

                  const limit = getCellCriticalMass(r, c, rows, cols);
                  const isCritical = cell.orbs > 0 && cell.orbs === limit - 1;
                  const currentPlayerColor = getThemeColor(players[currentPlayerIndex]?.color, isDark);

                  return (
                    <GameCell
                      key={`${r}-${c}`}
                      r={r}
                      c={c}
                      cell={cell}
                      ownerColor={ownerColor}
                      currentPlayerColor={currentPlayerColor}
                      isExploding={!!isExploding}
                      isCritical={isCritical}
                      isCellDisabled={isCellDisabled}
                      limit={limit}
                      onClick={() => handleCellClick(r, c)}
                    />
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
      <GameGuideModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
