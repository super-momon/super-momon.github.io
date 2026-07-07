'use client';

import { useState, useEffect, useRef } from 'react';
import SetupScreen, { PlayerSetup } from './_components/SetupScreen';
import GameBoard from './_components/GameBoard';
import WinnerScreen from './_components/WinnerScreen';
import OnlineLobby from './_components/OnlineLobby';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { PRESET_COLORS } from './_components/colors';
import { trackEvent } from '@/lib/analytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type GamePhase = 'setup' | 'lobby' | 'playing' | 'winner';

export interface LobbyPresenceUser {
  clientId: string;
  name: string;
  color: string;
  isHost: boolean;
  joinedAt: number;
}

// Key + shape for the online session persisted to sessionStorage so a full
// page reload can transparently rejoin the same room and resume play.
const ONLINE_SESSION_KEY = 'chain-reaction:online-session';

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
}


const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const encodeSession = (session: PersistedOnlineSession): string => {
  try {
    const jsonStr = JSON.stringify(session);
    return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  } catch (e) {
    console.error('Error encoding session:', e);
    return '';
  }
};

const decodeSession = (base64: string): PersistedOnlineSession => {
  const decoded = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(decoded) as PersistedOnlineSession;
};

const migrateSessionColors = (saved: PersistedOnlineSession): PersistedOnlineSession => {
  const migrateColor = (c: string) => {
    const cl = c.toLowerCase();
    if (cl === '#ec4899' || cl === '#d946ef') return '#06b6d4';
    return c;
  };
  return {
    ...saved,
    color: migrateColor(saved.color),
    players: saved.players ? saved.players.map((p) => ({ ...p, color: migrateColor(p.color) })) : [],
  };
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
  const [roomCode, setRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPresenceUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

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
    // Reuse the persisted client id after a reload so presence and player
    // slots line up; otherwise mint a fresh one.
    let persistedId = '';
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const reconnectParam = params.get('reconnect');
        if (reconnectParam) {
          const saved = decodeSession(reconnectParam);
          persistedId = saved.clientId || '';
        }
        if (!persistedId) {
          const raw = window.sessionStorage.getItem(ONLINE_SESSION_KEY);
          if (raw) persistedId = (JSON.parse(raw) as PersistedOnlineSession).clientId || '';
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
          name: initialOnlineName,
          color: initialOnlineColor,
          isHost,
          joinedAt: joinedAtRef.current,
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

      // Guarantee our own entry is always present. On join, the server can
      // echo the presence snapshot back before it has merged our own `track`,
      // which would otherwise render a list that is missing the local player.
      if (!uniquePresencesMap[myClientId]) {
        uniquePresencesMap[myClientId] = {
          clientId: myClientId,
          name: initialOnlineName,
          color: initialOnlineColor,
          isHost,
          joinedAt: joinedAtRef.current,
        };
      }

      const sorted = Object.values(uniquePresencesMap).sort(
        (a, b) => a.joinedAt - b.joinedAt
      );

      // Enforce 6-player limit
      const myIndex = sorted.findIndex((p) => p.clientId === myClientId);
      if (myIndex >= 6) {
        alert('This lobby is full (maximum 6 players).');
        cleanupOnlineSession();
        setPhase('setup');
        return;
      }

      setLobbyPlayers(sorted);
    };

    channel
      // sync  – fires on initial state snapshot and after each diff
      .on('presence', { event: 'sync' }, syncLobbyPlayers)
      // join  – fires when a new peer tracks their presence; sync may not fire
      .on('presence', { event: 'join' }, syncLobbyPlayers)
      // leave – fires when a peer disconnects or untracks
      .on('presence', { event: 'leave' }, syncLobbyPlayers)
      .on('broadcast', { event: 'settings-change' }, (payload) => {
        if (!isHost) {
          const { rows: newRows, cols: newCols } = payload.payload;
          if (newRows) setRows(newRows);
          if (newCols) setCols(newCols);
        }
      })
      .on('broadcast', { event: 'start-game' }, (payload) => {
        if (!isHost) {
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
  }, [isOnline, roomCode, isHost]);

  // Update presence whenever player name or color changes
  useEffect(() => {
    if (connectionStatus === 'connected' && lobbyChannelRef.current) {
      lobbyChannelRef.current.track({
        clientId: myClientId,
        name: initialOnlineName,
        color: initialOnlineColor,
        isHost,
        joinedAt: joinedAtRef.current,
      });
    }
  }, [initialOnlineName, initialOnlineColor, connectionStatus, isHost, myClientId]);

  // Automatically reconcile color conflicts in the lobby
  useEffect(() => {
    if (!isOnline || lobbyPlayers.length === 0) return;

    // Verify if our current color is already taken by someone else
    const myIndex = lobbyPlayers.findIndex((p) => p.clientId === myClientId);
    if (myIndex === -1) return;

    const occupiedColors = lobbyPlayers
      .filter((p) => p.clientId !== myClientId)
      .map((p) => p.color);

    if (occupiedColors.includes(initialOnlineColor)) {
      // Find first color from presets that is not occupied
      const availableColor = PRESET_COLORS.find((c) => !occupiedColors.includes(c));
      if (availableColor) {
        setInitialOnlineColor(availableColor);
      }
    }
  }, [lobbyPlayers, isOnline, myClientId, initialOnlineColor]);

  // Track page visit
  useEffect(() => {
    trackEvent('game_visit', { game_name: 'chain-reaction' });
  }, []);

  // Restore or prefill online session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // 1. URL Reconnect check (Highest Priority)
    const reconnectParam = params.get('reconnect');
    if (reconnectParam) {
      try {
        let saved = decodeSession(reconnectParam);
        if (saved) {
          saved = migrateSessionColors(saved);
          if (saved.roomCode && (saved.phase === 'lobby' || saved.phase === 'playing')) {
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
            setIsMounted(true);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to parse reconnect session from URL:', err);
      }
    }

    // 2. URL Invite Room check
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim().length === 6) {
      const code = roomParam.trim().toUpperCase();
      setInitialPlayMode('online');
      setInitialOnlineMode('join');
      setInitialRoomCodeVal(code);
      try {
        window.sessionStorage.removeItem(ONLINE_SESSION_KEY);
      } catch {}
      setIsMounted(true);
      return;
    }

    // 3. sessionStorage fallback
    let saved: PersistedOnlineSession | null = null;
    try {
      const raw = window.sessionStorage.getItem(ONLINE_SESSION_KEY);
      if (raw) saved = migrateSessionColors(JSON.parse(raw) as PersistedOnlineSession);
    } catch {
      saved = null;
    }

    if (saved && saved.roomCode && (saved.phase === 'lobby' || saved.phase === 'playing')) {
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
    }

    setIsMounted(true);
  }, []);

  // Persist the active online session (or clear it when we leave) so a reload
  // can restore it via the effect above.
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
        };
        window.sessionStorage.setItem(ONLINE_SESSION_KEY, JSON.stringify(session));

        const base64 = encodeSession(session);
        const newUrl = `${window.location.pathname}?reconnect=${encodeURIComponent(base64)}`;
        window.history.replaceState(null, '', newUrl);
      } else {
        window.sessionStorage.removeItem(ONLINE_SESSION_KEY);
        if (typeof window !== 'undefined' && window.location.search) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } catch (err) {
      /* sessionStorage or replaceState unavailable — ignore */
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
    color: string,
    code: string
  ) => {
    setInitialOnlineName(name);
    setInitialOnlineColor(color);
    setIsOnline(true);
    setResumed(false);
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
    setRoomCode('');
    setIsOnline(false);
    setIsHost(false);
    setLobbyPlayers([]);
    setResumed(false);
    try {
      window.sessionStorage.removeItem(ONLINE_SESSION_KEY);
    } catch {
      /* sessionStorage unavailable — ignore */
    }
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
    </div>
  );
}
