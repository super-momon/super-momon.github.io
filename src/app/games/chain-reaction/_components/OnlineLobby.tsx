'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faCheck, 
  faCrown, 
  faArrowLeft, 
  faPlay, 
  faBorderAll, 
  faSpinner, 
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { LobbyPresenceUser } from '../ChainReactionGame';
import { PRESET_COLORS, getThemeColor, useIsDark } from './colors';

interface OnlineLobbyProps {
  roomCode: string;
  playerName: string;
  setPlayerName: (name: string) => void;
  playerColor: string;
  setPlayerColor: (color: string) => void;
  isHost: boolean;
  lobbyPlayers: LobbyPresenceUser[];
  connectionStatus: 'connecting' | 'connected' | 'error';
  rows: number;
  cols: number;
  onSettingsChange: (rows: number, cols: number) => void;
  onLeave: () => void;
  onStartGame: () => void;
  myClientId: string;
}

export default function OnlineLobby({
  roomCode,
  playerName,
  setPlayerName,
  playerColor,
  setPlayerColor,
  isHost,
  lobbyPlayers,
  connectionStatus,
  rows,
  cols,
  onSettingsChange,
  onLeave,
  onStartGame,
  myClientId,
}: OnlineLobbyProps) {
  const isDark = useIsDark();
  const [copied, setCopied] = useState(false);

  // Clipboard copy helper
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find which colors are already occupied by other players
  const occupiedColors = lobbyPlayers
    .filter((p) => p.clientId !== myClientId)
    .map((p) => p.color);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-[var(--color-border)]/50 bg-[var(--color-surface)]/40 backdrop-blur-xl">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-lg hover:bg-[var(--color-surface)] transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Leave Lobby
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-muted)]">Status:</span>
            {connectionStatus === 'connecting' && (
              <span className="text-yellow-500 text-xs font-bold flex items-center gap-1">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Connecting
              </span>
            )}
            {connectionStatus === 'connected' && (
              <span className="text-green-500 text-xs font-bold">● Connected</span>
            )}
            {connectionStatus === 'error' && (
              <span className="text-red-500 text-xs font-bold">▲ Error</span>
            )}
          </div>
        </div>

        {/* Room Code Display */}
        <div className="text-center mb-8 bg-[var(--color-surface)]/60 rounded-2xl p-6 border border-[var(--color-border)]/40">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-[var(--color-muted)] mb-2">
            Room Join Code
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-black tracking-wider text-[var(--color-foreground)] uppercase">
              {roomCode}
            </span>
            <button
              onClick={copyRoomCode}
              aria-label="Copy room join code"
              className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-background)] hover:scale-105 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-green-500' : ''} />
            </button>
          </div>
          <p className="text-[var(--color-muted)] text-xs mt-2">
            Share this code with your friends to join the game session.
          </p>
        </div>

        {/* Main Section split: Customize profile & Connected players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Customize Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-foreground)]/80">Your Setup</h3>
            
            <div className="bg-[var(--color-background)]/60 border border-[var(--color-border)]/50 rounded-2xl p-4 space-y-4">
              <div>
                <label className="text-xs text-[var(--color-muted)] block mb-1">Nickname</label>
                <input
                  type="text"
                  maxLength={15}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onBlur={(e) => {
                    const trimmed = e.target.value.trim();
                    setPlayerName(trimmed || 'Player');
                  }}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[var(--color-accent)] transition"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--color-muted)] block mb-1.5">Color</label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color) => {
                    const isOccupied = occupiedColors.includes(color);
                    const isSelected = playerColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setPlayerColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative ${
                          isSelected 
                            ? 'border-[var(--color-foreground)] scale-110 shadow-lg' 
                            : isOccupied 
                              ? 'opacity-20 cursor-not-allowed scale-90' 
                              : 'border-transparent hover:scale-105 hover:border-[var(--color-border)]'
                        }`}
                        style={{ backgroundColor: getThemeColor(color, isDark) }}
                        title={isOccupied ? 'Color chosen by another player' : ''}
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grid Configuration (Host Only) */}
            <div className="bg-[var(--color-background)]/60 border border-[var(--color-border)]/50 rounded-2xl p-4 space-y-3">
              <label className="text-xs text-[var(--color-muted)] font-bold flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBorderAll} className="text-[var(--color-accent)]" />
                Grid Board Sizing
              </label>

              {isHost ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-[var(--color-muted)] block mb-0.5">Rows (6 - 20)</span>
                    <input
                      type="number"
                      min={6}
                      max={20}
                      value={rows}
                      onChange={(e) => onSettingsChange(Math.max(6, Math.min(20, parseInt(e.target.value) || 15)), cols)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-2 py-1.5 text-xs font-bold text-center focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-muted)] block mb-0.5">Cols (6 - 25)</span>
                    <input
                      type="number"
                      min={6}
                      max={25}
                      value={cols}
                      onChange={(e) => onSettingsChange(rows, Math.max(6, Math.min(25, parseInt(e.target.value) || 20)))}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-2 py-1.5 text-xs font-bold text-center focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs font-bold text-[var(--color-foreground)] flex items-center justify-between">
                  <span>Current Dimensions:</span>
                  <span className="bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded-lg">
                    {rows} × {cols}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Connected Players */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[var(--color-foreground)]/80">Players ({lobbyPlayers.length}/5)</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                Max 5 players
              </span>
            </div>

            <div className="bg-[var(--color-background)]/60 border border-[var(--color-border)]/50 rounded-2xl p-4 min-h-[190px] max-h-[220px] overflow-y-auto custom-scrollbar space-y-2">
              <AnimatePresence initial={false}>
                {lobbyPlayers.map((player) => (
                  <motion.div
                    key={player.clientId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: getThemeColor(player.color, isDark),
                          boxShadow: `0 0 8px ${getThemeColor(player.color, isDark)}40`,
                        }}
                      />
                      <span className="text-sm font-semibold text-[var(--color-foreground)] truncate max-w-[140px]">
                        {player.name}
                        {player.clientId === myClientId && (
                          <span className="text-[10px] text-[var(--color-muted)] font-normal ml-1">(You)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {player.isHost ? (
                        <span className="text-[10px] text-yellow-500 font-extrabold flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                          <FontAwesomeIcon icon={faCrown} /> Host
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--color-muted)] font-bold flex items-center gap-1 bg-[var(--color-background)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                          <FontAwesomeIcon icon={faUser} /> Guest
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Start Game Action */}
        {isHost ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={lobbyPlayers.length < 2}
            onClick={onStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] font-extrabold tracking-wide text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlay} />
            Start Online Game
          </motion.button>
        ) : (
          <div className="text-center py-3 bg-[var(--color-surface)]/20 border border-[var(--color-border)]/30 rounded-2xl text-[var(--color-muted)] text-sm font-bold animate-pulse">
            Waiting for Host to start the game...
          </div>
        )}
      </div>
    </motion.div>
  );
}
