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

type GamePhase = 'setup' | 'lobby' | 'playing' | 'winner';

export interface LobbyPresenceUser {
  clientId: string;
  name: string;
  color: string;
  isHost: boolean;
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

  // Initial name/color used to prefill lobby input
  const [initialOnlineName, setInitialOnlineName] = useState<string>('Player');
  const [initialOnlineColor, setInitialOnlineColor] = useState<string>('#08ca5f');

  // Refs for tracking
  const myClientIdRef = useRef<string>('');
  if (!myClientIdRef.current) {
    myClientIdRef.current = 'client_' + Math.random().toString(36).substr(2, 9);
  }
  const myClientId = myClientIdRef.current;
  
  const lobbyChannelRef = useRef<RealtimeChannel | null>(null);
  const joinedAtRef = useRef<number>(Date.now());

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
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const presences = Object.values(state)
          .flatMap((p) => p) as unknown as LobbyPresenceUser[];
        
        // Deduplicate presences by clientId to prevent duplication on color/name updates
        const uniquePresencesMap: Record<string, LobbyPresenceUser> = {};
        presences.forEach((p) => {
          if (p.clientId) {
            // If duplicate exists, keep the latest one based on joinedAt, or simply overwrite
            uniquePresencesMap[p.clientId] = p;
          }
        });

        const uniquePresences = Object.values(uniquePresencesMap);
        const sorted = uniquePresences.sort((a, b) => a.joinedAt - b.joinedAt);

        // Enforce 5-player limit
        const myIndex = sorted.findIndex((p) => p.clientId === myClientId);
        if (myIndex >= 5) {
          alert('This lobby is full (maximum 5 players).');
          cleanupOnlineSession();
          setPhase('setup');
          return;
        }

        setLobbyPlayers(sorted);
      })
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
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setConnectionStatus('error');
        }
      });

    return () => {
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
  };

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
