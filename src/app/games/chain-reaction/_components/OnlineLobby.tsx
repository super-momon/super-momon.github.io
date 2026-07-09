'use client';

import { useState, useEffect } from 'react';
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
  faUser,
  faMinus,
  faPlus
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
  turnSecondsLimit: number;
  onSettingsChange: (rows: number, cols: number, turnSecondsLimit: number) => void;
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
  turnSecondsLimit,
  onSettingsChange,
  onLeave,
  onStartGame,
  myClientId,
}: OnlineLobbyProps) {
  const isDark = useIsDark();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [localName, setLocalName] = useState(playerName);
  const [localRows, setLocalRows] = useState<string>(rows.toString());
  const [localCols, setLocalCols] = useState<string>(cols.toString());
  const [localTurnSeconds, setLocalTurnSeconds] = useState<string>(turnSecondsLimit.toString());

  // Sync localName if playerName prop changes from parent
  useEffect(() => {
    setLocalName(playerName);
  }, [playerName]);

  // Sync localRows/localCols if props change
  useEffect(() => {
    setLocalRows(rows.toString());
  }, [rows]);

  useEffect(() => {
    setLocalCols(cols.toString());
  }, [cols]);

  useEffect(() => {
    setLocalTurnSeconds(turnSecondsLimit.toString());
  }, [turnSecondsLimit]);

  // Clipboard copy helper
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInviteLink = () => {
    if (typeof window === 'undefined') return;
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDecrementRows = () => {
    const val = parseInt(localRows, 10);
    const newVal = isNaN(val) ? 15 : val;
    const finalRows = Math.max(6, newVal - 1);
    setLocalRows(finalRows.toString());
    onSettingsChange(finalRows, cols, turnSecondsLimit);
  };

  const handleIncrementRows = () => {
    const val = parseInt(localRows, 10);
    const newVal = isNaN(val) ? 15 : val;
    const finalRows = Math.min(20, newVal + 1);
    setLocalRows(finalRows.toString());
    onSettingsChange(finalRows, cols, turnSecondsLimit);
  };

  const handleDecrementCols = () => {
    const val = parseInt(localCols, 10);
    const newVal = isNaN(val) ? 20 : val;
    const finalCols = Math.max(6, newVal - 1);
    setLocalCols(finalCols.toString());
    onSettingsChange(rows, finalCols, turnSecondsLimit);
  };

  const handleIncrementCols = () => {
    const val = parseInt(localCols, 10);
    const newVal = isNaN(val) ? 20 : val;
    const finalCols = Math.min(25, newVal + 1);
    setLocalCols(finalCols.toString());
    onSettingsChange(rows, finalCols, turnSecondsLimit);
  };

  const handleDecrementTurnSeconds = () => {
    const val = parseInt(localTurnSeconds, 10);
    const newVal = isNaN(val) ? 30 : val;
    const finalSeconds = Math.max(10, newVal - 5);
    setLocalTurnSeconds(finalSeconds.toString());
    onSettingsChange(rows, cols, finalSeconds);
  };

  const handleIncrementTurnSeconds = () => {
    const val = parseInt(localTurnSeconds, 10);
    const newVal = isNaN(val) ? 30 : val;
    const finalSeconds = Math.min(120, newVal + 5);
    setLocalTurnSeconds(finalSeconds.toString());
    onSettingsChange(rows, cols, finalSeconds);
  };

  // Find which colors are already occupied by other players
  const occupiedColors = lobbyPlayers
    .filter((p) => p.clientId !== myClientId)
    .map((p) => p.color);

  // Determine the single true host of the lobby to prevent display inconsistencies.
  // We prioritize the local player if they are the host, otherwise we find the oldest
  // player marked as host, falling back to the oldest player in the lobby.
  const hostCandidate = lobbyPlayers.find((p) => p.isHost);
  const trueHostClientId = isHost
    ? myClientId
    : (hostCandidate ? hostCandidate.clientId : (lobbyPlayers[0]?.clientId || ''));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
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
        <div className="text-center mb-8 bg-[var(--color-surface)]/60 rounded-2xl p-6 border border-[var(--color-border)]/40 space-y-4">
          <div>
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
                title="Copy Room Code"
                className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-background)] hover:scale-105 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-green-500' : ''} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-[var(--color-border)]/35 pt-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-muted)] mb-2">
              Or Share Invite Link
            </span>
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:scale-102 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={copiedLink ? faCheck : faCopy} className={copiedLink ? 'text-green-500' : ''} />
              {copiedLink ? 'Invite Link Copied!' : 'Copy Direct Invite Link'}
            </button>
          </div>

          <p className="text-[var(--color-muted)] text-[11px]">
            Friends opening the invite link will be directed straight to this room.
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
                  maxLength={20}
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  onBlur={(e) => {
                    const trimmed = e.target.value.trim();
                    const finalName = trimmed || 'Player';
                    setLocalName(finalName);
                    setPlayerName(finalName);
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

            {/* Lobby Configuration */}
            <div className="bg-[var(--color-background)]/60 border border-[var(--color-border)]/50 rounded-2xl p-4 space-y-3">
              <label className="text-xs text-[var(--color-muted)] font-bold flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBorderAll} className="text-[var(--color-accent)]" />
                Lobby Game Settings
              </label>

              {isHost ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-[var(--color-muted)] block mb-1.5">Rows (6 - 20)</span>
                      <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
                        <button
                          type="button"
                          onClick={handleDecrementRows}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input
                          type="number"
                          min={6}
                          max={20}
                          value={localRows}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalRows(val);
                            if (val !== '') {
                              const parsed = parseInt(val, 10);
                              if (!isNaN(parsed)) {
                                onSettingsChange(Math.max(6, Math.min(20, parsed)), cols, turnSecondsLimit);
                              }
                            }
                          }}
                          onBlur={() => {
                            const num = parseInt(localRows, 10);
                            let finalRows = num;
                            if (isNaN(num) || num < 6) finalRows = 6;
                            else if (num > 20) finalRows = 20;
                            setLocalRows(finalRows.toString());
                            onSettingsChange(finalRows, cols, turnSecondsLimit);
                          }}
                          className="w-12 bg-transparent text-sm font-bold text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={handleIncrementRows}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-muted)] block mb-1.5">Columns (6 - 25)</span>
                      <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
                        <button
                          type="button"
                          onClick={handleDecrementCols}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input
                          type="number"
                          min={6}
                          max={25}
                          value={localCols}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalCols(val);
                            if (val !== '') {
                              const parsed = parseInt(val, 10);
                              if (!isNaN(parsed)) {
                                onSettingsChange(rows, Math.max(6, Math.min(25, parsed)), turnSecondsLimit);
                              }
                            }
                          }}
                          onBlur={() => {
                            const num = parseInt(localCols, 10);
                            let finalCols = num;
                            if (isNaN(num) || num < 6) finalCols = 6;
                            else if (num > 25) finalCols = 25;
                            setLocalCols(finalCols.toString());
                            onSettingsChange(rows, finalCols, turnSecondsLimit);
                          }}
                          className="w-12 bg-transparent text-sm font-bold text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={handleIncrementCols}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--color-border)]/30 pt-3">
                    <span className="text-[10px] text-[var(--color-muted)] block mb-1.5">Turn Time Limit (10 - 120s)</span>
                    <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
                      <button
                        type="button"
                        onClick={handleDecrementTurnSeconds}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={10}
                          max={120}
                          value={localTurnSeconds}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalTurnSeconds(val);
                            if (val !== '') {
                              const parsed = parseInt(val, 10);
                              if (!isNaN(parsed)) {
                                onSettingsChange(rows, cols, Math.max(10, Math.min(120, parsed)));
                              }
                            }
                          }}
                          onBlur={() => {
                            const num = parseInt(localTurnSeconds, 10);
                            let finalSeconds = num;
                            if (isNaN(num) || num < 10) finalSeconds = 30;
                            else if (num > 120) finalSeconds = 120;
                            setLocalTurnSeconds(finalSeconds.toString());
                            onSettingsChange(rows, cols, finalSeconds);
                          }}
                          className="w-12 bg-transparent text-sm font-bold text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-[var(--color-muted)] select-none pr-1">sec</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleIncrementTurnSeconds}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[var(--color-foreground)] flex items-center justify-between">
                    <span>Current Dimensions:</span>
                    <span className="bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded-lg">
                      {rows} × {cols}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[var(--color-foreground)] flex items-center justify-between">
                    <span>Turn Time Limit:</span>
                    <span className="bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded-lg">
                      {turnSecondsLimit}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Connected Players */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[var(--color-foreground)]/80">Players ({lobbyPlayers.length}/6)</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                Max 6 players
              </span>
            </div>

            <div className="bg-[var(--color-background)]/60 border border-[var(--color-border)]/50 rounded-2xl p-4 min-h-[190px] max-h-[220px] overflow-y-auto custom-scrollbar space-y-2">
              <AnimatePresence initial={false}>
                {lobbyPlayers.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[150px] gap-2 text-[var(--color-muted)]"
                  >
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg" />
                    <span className="text-xs font-semibold">Waiting for players...</span>
                  </motion.div>
                ) : (
                  lobbyPlayers.map((player) => {
                    const isMe = player.clientId === myClientId;
                    // Use live local props for own entry to avoid stale presence data
                    const displayName = isMe ? playerName : player.name;
                    const displayColor = isMe ? playerColor : player.color;
                    return (
                      <motion.div
                        key={player.clientId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                            style={{
                              backgroundColor: getThemeColor(displayColor, isDark),
                              boxShadow: `0 0 8px ${getThemeColor(displayColor, isDark)}40`,
                            }}
                          />
                          <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                            <span 
                              className="text-sm font-semibold text-[var(--color-foreground)] break-words whitespace-normal flex-1 min-w-[100px]" 
                              title={displayName}
                            >
                              {displayName}
                            </span>
                            {isMe && (
                              <span className="text-[9px] font-bold bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-1.5 py-0.5 rounded border border-[var(--color-accent)]/20 flex-shrink-0">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {player.clientId === trueHostClientId ? (
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
                    );
                  })
                )}
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
