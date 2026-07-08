'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SetupScreen, { PlayerSetup } from './_components/SetupScreen';
import GameBoard from './_components/GameBoard';
import WinnerScreen from './_components/WinnerScreen';
import OnlineLobby from './_components/OnlineLobby';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { PRESET_COLORS } from './_components/colors';
import { trackEvent } from '@/lib/analytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'motion/react';

type GamePhase = 'setup' | 'lobby' | 'playing' | 'winner';

export interface LobbyPresenceUser {
  clientId: string;
  name: string;
  color: string;
  isHost: boolean;
  joinedAt: number;
  phase?: GamePhase;
}

// Persisted session shape stored in localStorage keyed by room code.
// Using localStorage (not sessionStorage) so sessions survive tab close and
// enable reconnection via room code from any tab or after a browser restart.
const ONLINE_SESSION_PREFIX = 'chain-reaction:session:';

interface PersistedOnlineSession {
  clientId: string;
  roomCode: string;
  isHost: boolean;
  name: string;
  color: string;
  phase: GamePhase;
  rows: number;
  cols: number;
  players: PlayerSetup[];
  joinedAt: number;
  /** Timestamp of when the session was last persisted, used to expire old entries. */
  lastUpdated: number;
}

/** Sessions older than 4 hours are considered stale and discarded. */
const SESSION_MAX_AGE_MS = 4 * 60 * 60 * 1000;

const getSessionKey = (roomCode: string) =>
  `${ONLINE_SESSION_PREFIX}${roomCode.toUpperCase()}`;

/** Read a persisted session for a room code from localStorage, or null. */
const loadSession = (roomCode: string): PersistedOnlineSession | null => {
  try {
    const raw = window.localStorage.getItem(getSessionKey(roomCode));
    if (!raw) return null;
    const session = JSON.parse(raw) as PersistedOnlineSession;
    // Discard stale sessions
    if (session.lastUpdated && Date.now() - session.lastUpdated > SESSION_MAX_AGE_MS) {
      window.localStorage.removeItem(getSessionKey(roomCode));
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

/** Persist the current session to localStorage, keyed by room code. */
const saveSession = (session: PersistedOnlineSession) => {
  try {
    window.localStorage.setItem(
      getSessionKey(session.roomCode),
      JSON.stringify({ ...session, lastUpdated: Date.now() })
    );
  } catch {
    /* localStorage unavailable — ignore */
  }
};

/** Remove a persisted session from localStorage. */
const removeSession = (roomCode: string) => {
  try {
    window.localStorage.removeItem(getSessionKey(roomCode));
  } catch {
    /* localStorage unavailable — ignore */
  }
};

/** Find any active session in localStorage (most recently updated). */
const findActiveSession = (): PersistedOnlineSession | null => {
  try {
    let best: PersistedOnlineSession | null = null;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(ONLINE_SESSION_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const session = JSON.parse(raw) as PersistedOnlineSession;
      // Skip stale
      if (session.lastUpdated && Date.now() - session.lastUpdated > SESSION_MAX_AGE_MS) {
        window.localStorage.removeItem(key);
        continue;
      }
      if (!best || (session.lastUpdated || 0) > (best.lastUpdated || 0)) {
        best = session;
      }
    }
    return best;
  } catch {
    return null;
  }
};

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function ChainReactionPage() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<PlayerSetup[]>([]);
  const [rows, setRows] = useState<number>(15);
  const [cols, setCols] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Winner stats
  const [winnerName, setWinnerName] = useState<string>('');
  const [winnerColor, setWinnerColor] = useState<string>('');
  const [winnerOrbs, setWinnerOrbs] = useState<number>(0);

  // Online Multiplayer State
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [customAlert, setCustomAlert] = useState<{
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
  } | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPresenceUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [disconnectCountdown, setDisconnectCountdown] = useState<number | null>(null);
  const [offlinePlayersCounted, setOfflinePlayersCounted] = useState<string[]>([]);

  // True only for a session restored from storage after a reload, so the
  // resumed game board knows to pull fresh state from peers on first connect.
  const [resumed, setResumed] = useState<boolean>(false);

  // Initial name/color used to prefill lobby input
  const [initialOnlineName, setInitialOnlineName] = useState<string>('Player');
  const [initialOnlineColor, setInitialOnlineColor] = useState<string>('#10b981');

  // Prefill settings for SetupScreen when joining via direct invite link
  const [initialPlayMode, setInitialPlayMode] = useState<'local' | 'online'>('local');
  const [initialOnlineMode, setInitialOnlineMode] = useState<'host' | 'join'>('host');
  const [initialRoomCodeVal, setInitialRoomCodeVal] = useState<string>('');

  const [isMounted, setIsMounted] = useState(false);

  // Refs for tracking
  const myClientIdRef = useRef<string>('');
  if (!myClientIdRef.current) {
    // Reuse the persisted client id from localStorage so presence and player
    // slots line up after a reload or reconnect; otherwise mint a fresh one.
    let persistedId = '';
    if (typeof window !== 'undefined') {
      try {
        // Check for a room code in the URL first, then fall back to any
        // active session in localStorage.
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        if (roomParam) {
          const saved = loadSession(roomParam);
          persistedId = saved?.clientId || '';
        }
        if (!persistedId) {
          const active = findActiveSession();
          persistedId = active?.clientId || '';
        }
      } catch {
        persistedId = '';
      }
    }
    myClientIdRef.current = persistedId || 'client_' + Math.random().toString(36).substr(2, 9);
  }
  const myClientId = myClientIdRef.current;
  
  const lobbyChannelRef = useRef<RealtimeChannel | null>(null);
  const joinedAtRef = useRef<number>(Date.now());
  // Timers used to re-reconcile the presence snapshot after subscribing, to
  // guard against missed/partial initial sync events on slower connections.
  const resyncTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Debounce timer for presence re-tracking to prevent flooding Supabase
  const retrackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if this is the client's first sync event after subscribing to the lobby
  const initialLobbySyncRef = useRef<boolean>(true);

  // Refs to break stale closures in Supabase Realtime event handlers.
  // The channel subscribes once and its callbacks capture the closure at that
  // time — these refs ensure the handlers always access current values.
  const onlineNameRef = useRef(initialOnlineName);
  const onlineColorRef = useRef(initialOnlineColor);
  const isHostRef = useRef(isHost);
  // Track whether a color conflict auto-reassignment is already in progress
  // to prevent the feedback loop where reassignment triggers re-track which
  // triggers sync which triggers reassignment again.
  const colorReassignInProgressRef = useRef(false);
  useEffect(() => { onlineNameRef.current = initialOnlineName; }, [initialOnlineName]);
  useEffect(() => { onlineColorRef.current = initialOnlineColor; }, [initialOnlineColor]);
  useEffect(() => { isHostRef.current = isHost; }, [isHost]);

  // Lobby channel lifecycle
  useEffect(() => {
    if (!isOnline || !roomCode) {
      setConnectionStatus('connecting');
      return;
    }

    const channelName = `chain-reaction-lobby:${roomCode.toUpperCase()}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: myClientId },
      },
    });

    lobbyChannelRef.current = channel;

    const trackPresence = async () => {
      try {
        await channel.track({
          clientId: myClientId,
          name: onlineNameRef.current,
          color: onlineColorRef.current,
          isHost: isHostRef.current,
          joinedAt: joinedAtRef.current,
          phase: phase,
        });
      } catch (err) {
        console.error('Error tracking lobby presence:', err);
      }
    };
    // Shared helper: rebuild the sorted, deduplicated player list from the
    // current presence state and push it into React state.
    const syncLobbyPlayers = () => {
      const state = channel.presenceState();
      const presences = Object.values(state)
        .flatMap((p) => p) as unknown as LobbyPresenceUser[];

      // Deduplicate by clientId (keeps latest on re-track / color update)
      const uniquePresencesMap: Record<string, LobbyPresenceUser> = {};
      presences.forEach((p) => {
        if (p.clientId) {
          uniquePresencesMap[p.clientId] = p;
        }
      });

      // Only inject our own entry if the server hasn't provided it yet.
      // This prevents showing stale local data alongside the server version.
      if (!uniquePresencesMap[myClientId]) {
        uniquePresencesMap[myClientId] = {
          clientId: myClientId,
          name: onlineNameRef.current,
          color: onlineColorRef.current,
          isHost: isHostRef.current,
          joinedAt: joinedAtRef.current,
        };
      }

      const sorted = Object.values(uniquePresencesMap).sort(
        (a, b) => a.joinedAt - b.joinedAt
      );

      // Enforce 6-player limit
      const myIndex = sorted.findIndex((p) => p.clientId === myClientId);
      if (myIndex >= 6) {
        setCustomAlert({
          title: 'Lobby Full',
          message: 'This lobby is full (maximum 6 players).',
          type: 'warning'
        });
        cleanupOnlineSession();
        setPhase('setup');
        return;
      }

      // Check if the game is already in progress.
      // We only run this blocker check on the client's initial join sync,
      // to prevent active guest players from being kicked out when the host
      // starts the game and updates their phase to 'playing'.
      if (initialLobbySyncRef.current) {
        const inProgressUser = sorted.find((p) => p.clientId !== myClientId && (p.phase === 'playing' || p.phase === 'winner'));
        if (inProgressUser && !resumed) {
          setCustomAlert({
            title: 'Game In Progress',
            message: 'This game is already in progress. You cannot join mid-game.',
            type: 'info'
          });
          cleanupOnlineSession();
          setPhase('setup');
          return;
        }
        if (sorted.length > 0) {
          initialLobbySyncRef.current = false;
        }
      }

      // One-shot color conflict resolution: if our color collides with
      // someone who joined earlier, auto-reassign to the first available
      // color. This runs inside sync (not a reactive useEffect) to avoid
      // the feedback loop of: reassign → re-track → sync → reassign.
      if (!colorReassignInProgressRef.current) {
        const myEntry = uniquePresencesMap[myClientId];
        const othersColors = sorted
          .filter((p) => p.clientId !== myClientId)
          .map((p) => p.color);

        if (myEntry && othersColors.includes(myEntry.color)) {
          // Find a player who joined earlier with the same color
          const conflictingEarlier = sorted.find(
            (p) => p.clientId !== myClientId && p.color === myEntry.color && p.joinedAt < myEntry.joinedAt
          );
          if (conflictingEarlier) {
            const allTaken = sorted.map((p) => p.color);
            const available = PRESET_COLORS.find((c) => !allTaken.includes(c) || c === myEntry.color);
            const newColor = PRESET_COLORS.find((c) => !othersColors.includes(c));
            if (newColor && newColor !== myEntry.color) {
              colorReassignInProgressRef.current = true;
              setInitialOnlineColor(newColor);
              // The debounced re-track effect will pick up the new color.
              // Reset the flag after a brief delay so future conflicts can
              // still be resolved.
              setTimeout(() => { colorReassignInProgressRef.current = false; }, 1500);
            }
          }
        }
      }

      // Promote new host if current host leaves the lobby
      let finalSorted = sorted;
      const hasHost = sorted.some((p) => p.isHost);
      if (!hasHost && sorted.length > 0) {
        const oldestPlayer = sorted[0];
        // Only promote if the guest has been in the lobby for at least 5 seconds,
        // to prevent race conditions during initial connection sync.
        const canPromote = Date.now() - joinedAtRef.current > 5000;
        if (canPromote) {
          if (oldestPlayer.clientId === myClientId) {
            setIsHost(true);
          }
          finalSorted = sorted.map((p, idx) =>
            idx === 0 ? { ...p, isHost: true } : p
          );
        }
      }

      setLobbyPlayers(finalSorted);
    };

    channel
      // sync  – fires on initial state snapshot and after each diff
      .on('presence', { event: 'sync' }, syncLobbyPlayers)
      // join  – fires when a new peer tracks their presence; sync may not fire
      .on('presence', { event: 'join' }, syncLobbyPlayers)
      // leave – fires when a peer disconnects or untracks
      .on('presence', { event: 'leave' }, syncLobbyPlayers)
      .on('broadcast', { event: 'settings-change' }, (payload) => {
        if (!isHostRef.current) {
          const { rows: newRows, cols: newCols } = payload.payload;
          if (newRows) setRows(newRows);
          if (newCols) setCols(newCols);
        }
      })
      .on('broadcast', { event: 'start-game' }, (payload) => {
        if (!isHostRef.current) {
          const { players: finalPlayers, rows: finalRows, cols: finalCols } = payload.payload;
          setPlayers(finalPlayers);
          setRows(finalRows);
          setCols(finalCols);
          setResumed(false);
          setPhase('playing');
        }
      })
      .on('broadcast', { event: 'go-to-lobby' }, () => {
        setPhase('lobby');
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          await trackPresence();
          // Immediately reconcile, then retry a few times. The very first
          // `sync` after subscribing can arrive before the server has merged
          // the full presence snapshot, and no further event fires while the
          // lobby is idle — leaving guests with an empty/partial player list.
          syncLobbyPlayers();
          resyncTimersRef.current.forEach(clearTimeout);
          resyncTimersRef.current = [250, 750, 1500, 3000].map((delay) =>
            setTimeout(syncLobbyPlayers, delay)
          );
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setConnectionStatus('error');
        }
      });

    return () => {
      resyncTimersRef.current.forEach(clearTimeout);
      resyncTimersRef.current = [];
      channel.unsubscribe();
      supabase.removeChannel(channel);
      lobbyChannelRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, roomCode]);

  // Debounced presence re-track: update presence when player name, color or phase
  // changes, but with a 500ms debounce to prevent flooding Supabase with
  // rapid re-track calls (e.g. during typing or phase transitions).
  useEffect(() => {
    if (connectionStatus !== 'connected' || !lobbyChannelRef.current) return;

    if (retrackTimerRef.current) clearTimeout(retrackTimerRef.current);

    retrackTimerRef.current = setTimeout(() => {
      lobbyChannelRef.current?.track({
        clientId: myClientId,
        name: initialOnlineName,
        color: initialOnlineColor,
        isHost: isHostRef.current,
        joinedAt: joinedAtRef.current,
        phase: phase,
      });
      retrackTimerRef.current = null;
    }, 500);

    return () => {
      if (retrackTimerRef.current) {
        clearTimeout(retrackTimerRef.current);
        retrackTimerRef.current = null;
      }
    };
  }, [initialOnlineName, initialOnlineColor, connectionStatus, isHost, myClientId, phase]);

  // Track page visit
  useEffect(() => {
    trackEvent('game_visit', { game_name: 'chain-reaction' });
  }, []);

  // Monitor player leaves/disconnects during gameplay
  useEffect(() => {
    if (!isOnline || phase !== 'playing' || players.length === 0) {
      if (disconnectCountdown !== null) setDisconnectCountdown(null);
      if (offlinePlayersCounted.length > 0) setOfflinePlayersCounted([]);
      return;
    }

    const currentOfflineClientIds = players
      .filter(p => !lobbyPlayers.some(lp => lp.clientId === p.clientId))
      .map(p => p.clientId)
      .filter(Boolean) as string[];

    if (currentOfflineClientIds.length === 0) {
      if (disconnectCountdown !== null) setDisconnectCountdown(null);
      if (offlinePlayersCounted.length > 0) setOfflinePlayersCounted([]);
      return;
    }

    // Check for any newly disconnected players
    const newOfflinePlayers = currentOfflineClientIds.filter(
      id => !offlinePlayersCounted.includes(id)
    );

    // Filter to retain only players who are still offline
    const stillOfflineCounted = offlinePlayersCounted.filter(
      id => currentOfflineClientIds.includes(id)
    );

    if (newOfflinePlayers.length > 0) {
      // Start/restart countdown for newly disconnected players
      setOfflinePlayersCounted(currentOfflineClientIds);
      setDisconnectCountdown(120); // 2 minutes
    } else if (stillOfflineCounted.length !== offlinePlayersCounted.length) {
      // Update our tracked list if some reconnected but others remain offline
      setOfflinePlayersCounted(stillOfflineCounted);
    }
  }, [isOnline, phase, players, lobbyPlayers, offlinePlayersCounted, disconnectCountdown]);

  // Countdown timer interval and game re-evaluation on timeout
  useEffect(() => {
    if (disconnectCountdown === null || disconnectCountdown <= 0) {
      if (disconnectCountdown === 0) {
        // Re-evaluate game: find who is currently online
        const onlineGamePlayers = players.filter(p =>
          lobbyPlayers.some(lp => lp.clientId === p.clientId)
        );
        if (onlineGamePlayers.length === 1) {
          const winner = onlineGamePlayers[0];
          handleGameFinished(winner.name, winner.color, 0);
        }
        setDisconnectCountdown(null);
        setOfflinePlayersCounted([]);
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisconnectCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [disconnectCountdown, players, lobbyPlayers]);

  // Restore or prefill online session on mount.
  // Priority: (1) URL ?room= with matching localStorage session → reconnect,
  //           (2) URL ?room= without session → treat as invite (fresh join),
  //           (3) Any active localStorage session → reconnect,
  //           (4) Nothing → show setup screen.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // Helper to restore state from a persisted session
    const restoreSession = (saved: PersistedOnlineSession) => {
      myClientIdRef.current = saved.clientId || myClientIdRef.current;
      joinedAtRef.current = saved.joinedAt || Date.now();
      setInitialOnlineName(saved.name);
      setInitialOnlineColor(saved.color);
      setRoomCode(saved.roomCode);
      setIsHost(saved.isHost);
      setRows(saved.rows);
      setCols(saved.cols);
      if (saved.players && saved.players.length > 0) {
        setPlayers(saved.players);
      }
      setIsOnline(true);
      setResumed(true);
      setPhase(saved.phase);
    };

    // 1. Check URL ?room= param
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim().length === 6) {
      const code = roomParam.trim().toUpperCase();

      // Check localStorage for an existing session for this room (reconnect)
      const existing = loadSession(code);
      if (existing && (existing.phase === 'lobby' || existing.phase === 'playing')) {
        restoreSession(existing);
        setIsMounted(true);
        return;
      }

      // No existing session — treat as a fresh invite link
      setInitialPlayMode('online');
      setInitialOnlineMode('join');
      setInitialRoomCodeVal(code);
      setIsMounted(true);
      return;
    }

    // 2. No URL param — check localStorage for any active session
    const active = findActiveSession();
    if (active && active.roomCode && (active.phase === 'lobby' || active.phase === 'playing')) {
      restoreSession(active);
      setIsMounted(true);
      return;
    }

    setIsMounted(true);
  }, []);

  // Persist the active online session to localStorage and update the URL
  // to a clean ?room=XXXX so the user can reconnect by room code alone.
  useEffect(() => {
    const isActiveOnline =
      isOnline && !!roomCode && (phase === 'lobby' || phase === 'playing');
    try {
      if (isActiveOnline) {
        const session: PersistedOnlineSession = {
          clientId: myClientId,
          roomCode,
          isHost,
          name: initialOnlineName,
          color: initialOnlineColor,
          phase,
          rows,
          cols,
          players,
          joinedAt: joinedAtRef.current,
          lastUpdated: Date.now(),
        };
        saveSession(session);

        // Keep the URL clean: just ?room=XXXX
        const expectedUrl = `${window.location.pathname}?room=${roomCode}`;
        if (window.location.search !== `?room=${roomCode}`) {
          window.history.replaceState(null, '', expectedUrl);
        }
      } else {
        // Clear the session for any room code that was active
        if (roomCode) removeSession(roomCode);
        if (typeof window !== 'undefined' && window.location.search) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } catch (err) {
      console.error('Error persisting active session state:', err);
    }
  }, [
    isOnline,
    roomCode,
    isHost,
    initialOnlineName,
    initialOnlineColor,
    phase,
    rows,
    cols,
    players,
    myClientId,
  ]);

  // Track game play when phase transitions to 'playing'
  useEffect(() => {
    if (phase === 'playing') {
      trackEvent('game_play', {
        game_name: 'chain-reaction',
        mode: isOnline ? 'online' : 'local',
        rows,
        cols,
        player_count: players.length,
      });
    }
  }, [phase, isOnline, rows, cols, players.length]);

  const handleStartGame = (
    setupPlayers: PlayerSetup[],
    gridRows: number,
    gridCols: number,
    sound: boolean
  ) => {
    setPlayers(setupPlayers);
    setRows(gridRows);
    setCols(gridCols);
    setSoundEnabled(sound);
    setIsOnline(false);
    setPhase('playing');
  };

  const handleStartOnline = (
    mode: 'host' | 'join',
    name: string,
    code: string
  ) => {
    // When joining, check localStorage for an existing session for this room.
    // If found, reuse the same clientId so the other players recognize us and
    // our player slot is preserved.
    if (mode === 'join' && code) {
      const existing = loadSession(code);
      if (existing && existing.clientId) {
        myClientIdRef.current = existing.clientId;
        joinedAtRef.current = existing.joinedAt || Date.now();
        // Restore name/color from the saved session so the user doesn't
        // appear as a new player with default values.
        setInitialOnlineName(existing.name || name);
        setInitialOnlineColor(existing.color || PRESET_COLORS[1]);
        setIsOnline(true);
        setResumed(true);
        setRoomCode(code);
        setIsHost(existing.isHost);
        if (existing.rows) setRows(existing.rows);
        if (existing.cols) setCols(existing.cols);
        if (existing.players && existing.players.length > 0) {
          setPlayers(existing.players);
        }
        // If the saved session was mid-game, go back to that phase
        setPhase(existing.phase === 'playing' ? 'playing' : 'lobby');
        return;
      }
    }

    setInitialOnlineName(name);
    // Auto-assign the first available preset color; host always gets index 0.
    // In the lobby the user can change it via the color picker.
    const assignedColor = mode === 'host' ? PRESET_COLORS[0] : PRESET_COLORS[1];
    setInitialOnlineColor(assignedColor);
    setIsOnline(true);
    setResumed(false);
    initialLobbySyncRef.current = true;
    joinedAtRef.current = Date.now();

    if (mode === 'host') {
      const generatedCode = generateRoomCode();
      setRoomCode(generatedCode);
      setIsHost(true);
    } else {
      setRoomCode(code);
      setIsHost(false);
    }

    setPhase('lobby');
  };

  const handleStartOnlineGame = () => {
    if (!isHost || lobbyPlayers.length < 2 || !lobbyChannelRef.current) return;

    // Map lobby players to PlayerSetup objects
    const finalPlayers: PlayerSetup[] = lobbyPlayers.map((p, index) => ({
      id: index,
      clientId: p.clientId,
      name: p.name.trim() || `Player ${index + 1}`,
      color: p.color,
    }));

    // Broadcast start game event to all guests
    lobbyChannelRef.current.send({
      type: 'broadcast',
      event: 'start-game',
      payload: {
        players: finalPlayers,
        rows,
        cols,
      },
    }).then(() => {
      setPlayers(finalPlayers);
      setResumed(false);
      setPhase('playing');
    }).catch((err) => {
      console.error('Error broadcasting start-game:', err);
      // Fallback
      setPlayers(finalPlayers);
      setPhase('playing');
    });
  };

  const handleSettingsChange = (newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    if (isHost && lobbyChannelRef.current) {
      lobbyChannelRef.current.send({
        type: 'broadcast',
        event: 'settings-change',
        payload: { rows: newRows, cols: newCols },
      });
    }
  };

  const handleGameFinished = (name: string, color: string, orbs: number) => {
    setWinnerName(name);
    setWinnerColor(color);
    setWinnerOrbs(orbs);
    setPhase('winner');
  };

  const handlePlayAgain = () => {
    if (isOnline) {
      if (isHost && lobbyChannelRef.current) {
        // Return all players to the lobby so they can adjust settings or ready up again
        lobbyChannelRef.current.send({
          type: 'broadcast',
          event: 'go-to-lobby',
        });
        setPhase('lobby');
      }
    } else {
      setPhase('playing');
    }
  };

  const handleBackToSetup = () => {
    cleanupOnlineSession();
    setPhase('setup');
  };

  const handleGoToLobby = () => {
    setPhase('lobby');
  };

  const cleanupOnlineSession = () => {
    // Remove the persisted session from localStorage before clearing state
    if (roomCode) removeSession(roomCode);
    setRoomCode('');
    setIsOnline(false);
    setIsHost(false);
    setLobbyPlayers([]);
    setResumed(false);
    initialLobbySyncRef.current = true;
  };

  if (!isMounted) {
    return (
      <div className="relative min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center border border-[var(--color-border)]/50 bg-[var(--color-surface)]/40 backdrop-blur-xl">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-[var(--color-accent)] mb-4" />
          <p className="text-sm font-semibold text-[var(--color-muted)]">Loading Game Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-background)]">
      {/* Cohesive Ambient Glow Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Top-left accent green orb */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '55%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(8,202,95,0.08) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Bottom-right indigo/cyan orb */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '50%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Mid magenta accent */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '45%',
            width: '35%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(217,70,239,0.05) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Subtle retro dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 pt-32 pb-12 sm:pt-36">
        <AnimatePresence>
          {disconnectCountdown !== null && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none"
            >
              <div className="glass-panel border border-yellow-500/30 bg-[var(--color-surface)]/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-xl shadow-yellow-500/5 pointer-events-auto">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 flex-shrink-0 animate-pulse">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-black uppercase tracking-wider text-yellow-500 mb-0.5">
                    Player Disconnected
                  </h4>
                  <p className="text-xs text-[var(--color-muted)] truncate">
                    Re-evaluating game in <span className="font-bold text-[var(--color-foreground)]">{Math.floor(disconnectCountdown / 60)}:{(disconnectCountdown % 60).toString().padStart(2, '0')}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'setup' && (
          <SetupScreen 
            onStartGame={handleStartGame} 
            onStartOnline={handleStartOnline}
            initialPlayMode={initialPlayMode}
            initialOnlineMode={initialOnlineMode}
            initialRoomCode={initialRoomCodeVal}
          />
        )}

        {phase === 'lobby' && (
          <OnlineLobby
            roomCode={roomCode}
            playerName={initialOnlineName}
            setPlayerName={setInitialOnlineName}
            playerColor={initialOnlineColor}
            setPlayerColor={setInitialOnlineColor}
            isHost={isHost}
            lobbyPlayers={lobbyPlayers}
            connectionStatus={connectionStatus}
            rows={rows}
            cols={cols}
            onSettingsChange={handleSettingsChange}
            onLeave={handleBackToSetup}
            onStartGame={handleStartOnlineGame}
            myClientId={myClientId}
          />
        )}

        {phase === 'playing' && (
          <GameBoard
            initialPlayers={players}
            rows={rows}
            cols={cols}
            soundEnabled={soundEnabled}
            onQuit={handleBackToSetup}
            onGameFinished={handleGameFinished}
            // Online multiplayer properties
            isOnline={isOnline}
            myClientId={myClientId}
            roomCode={roomCode}
            isHost={isHost}
            onGoToLobby={handleGoToLobby}
            resumed={resumed}
          />
        )}

        {phase === 'winner' && (
          <WinnerScreen
            winnerName={winnerName}
            winnerColor={winnerColor}
            totalOrbs={winnerOrbs}
            onPlayAgain={handlePlayAgain}
            onBackToSetup={handleBackToSetup}
            // Online properties
            isOnline={isOnline}
            isHost={isHost}
          />
        )}
      </div>

      {/* Custom Premium Alert Dialog */}
      <AnimatePresence>
        {customAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomAlert(null)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-3xl p-6 shadow-2xl overflow-hidden glass-panel z-10"
            >
              {/* Glow Accent based on type */}
              <div 
                className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
                  customAlert.type === 'error' 
                    ? 'bg-red-500/10' 
                    : customAlert.type === 'warning'
                      ? 'bg-yellow-500/10'
                      : 'bg-[var(--color-accent)]/10'
                }`} 
              />

              <div className="flex flex-col items-center text-center">
                {/* Icon Wrapper */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${
                    customAlert.type === 'error'
                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                      : customAlert.type === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                        : 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={customAlert.type === 'info' ? faCircleInfo : faExclamationTriangle} 
                    className="text-xl"
                  />
                </div>

                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">
                  {customAlert.title}
                </h3>
                
                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
                  {customAlert.message}
                </p>

                <button
                  onClick={() => setCustomAlert(null)}
                  className="w-full py-3 px-6 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-border)]/40 border border-[var(--color-border)] text-sm font-extrabold text-[var(--color-foreground)] transition-all active:scale-98 cursor-pointer shadow-sm"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
