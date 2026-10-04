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
  faUserSlash,
  faMinus,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { LobbyPresenceUser } from '../ChainReactionGame';
import { SpecialCellsConfig, DEFAULT_SPECIAL_CELLS } from './SetupScreen';
import { PRESET_COLORS, PRESET_COLOR_LABELS, getThemeColor, useIsDark } from './colors';

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
  specialCells?: SpecialCellsConfig;
  onSettingsChange: (rows: number, cols: number, turnSecondsLimit: number, specialCells?: SpecialCellsConfig) => void;
  onLeave: () => void;
  onStartGame: () => void;
  onKickPlayer?: (clientId: string) => void;
  myClientId: string;
}

export const clampSpecialCells = (config: SpecialCellsConfig): SpecialCellsConfig => {
  return {
    walls: Math.min(5, Math.max(0, config.walls || 0)),
    portals: Math.min(5, Math.max(0, config.portals || 0)),
    multipliers: Math.min(5, Math.max(0, config.multipliers || 0)),
    blackholes: Math.min(5, Math.max(0, config.blackholes || 0)),
  };
};

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
  specialCells,
  onSettingsChange,
  onLeave,
  onStartGame,
  onKickPlayer,
  myClientId,
}: OnlineLobbyProps) {
  const isDark = useIsDark();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [localName, setLocalName] = useState(playerName);
  const [localRows, setLocalRows] = useState<string>(rows.toString());
  const [localCols, setLocalCols] = useState<string>(cols.toString());
  const [localTurnSeconds, setLocalTurnSeconds] = useState<string>(turnSecondsLimit.toString());
  const [localSpecialCells, setLocalSpecialCells] = useState<SpecialCellsConfig>(
    specialCells ? clampSpecialCells(specialCells) : DEFAULT_SPECIAL_CELLS
  );

  // Apply authoritative lobby updates after the current frame while preserving
  // immediate edits to the local draft fields.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLocalName(playerName);
      setLocalRows(rows.toString());
      setLocalCols(cols.toString());
      setLocalTurnSeconds(turnSecondsLimit.toString());
      setLocalSpecialCells(
        specialCells ? clampSpecialCells(specialCells) : DEFAULT_SPECIAL_CELLS,
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [playerName, rows, cols, turnSecondsLimit, specialCells]);

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

  const getParsedCols = () => parseInt(localCols, 10) || cols;
  const getParsedRows = () => parseInt(localRows, 10) || rows;
  const getParsedSeconds = () => parseInt(localTurnSeconds, 10) || turnSecondsLimit;

  const handleDecrementRows = () => {
    const val = getParsedRows();
    const finalRows = Math.max(6, val - 1);
    setLocalRows(finalRows.toString());
    onSettingsChange(finalRows, getParsedCols(), getParsedSeconds(), localSpecialCells);
  };

  const handleIncrementRows = () => {
    const val = getParsedRows();
    const finalRows = Math.min(20, val + 1);
    setLocalRows(finalRows.toString());
    onSettingsChange(finalRows, getParsedCols(), getParsedSeconds(), localSpecialCells);
  };

  const handleDecrementCols = () => {
    const val = getParsedCols();
    const finalCols = Math.max(6, val - 1);
    setLocalCols(finalCols.toString());
    onSettingsChange(getParsedRows(), finalCols, getParsedSeconds(), localSpecialCells);
  };

  const handleIncrementCols = () => {
    const val = getParsedCols();
    const finalCols = Math.min(25, val + 1);
    setLocalCols(finalCols.toString());
    onSettingsChange(getParsedRows(), finalCols, getParsedSeconds(), localSpecialCells);
  };

  const handleDecrementTurnSeconds = () => {
    const val = getParsedSeconds();
    const finalSeconds = Math.max(10, val - 5);
    setLocalTurnSeconds(finalSeconds.toString());
    onSettingsChange(getParsedRows(), getParsedCols(), finalSeconds, localSpecialCells);
  };

  const handleIncrementTurnSeconds = () => {
    const val = getParsedSeconds();
    const finalSeconds = Math.min(120, val + 5);
    setLocalTurnSeconds(finalSeconds.toString());
    onSettingsChange(getParsedRows(), getParsedCols(), finalSeconds, localSpecialCells);
  };

  const handleSpecialCellChange = (key: keyof SpecialCellsConfig, increment: boolean) => {
    const current = localSpecialCells[key];
    const totalCells = Object.values(localSpecialCells).reduce((a, b) => a + b, 0);

    // Block increment if individual is at or above 5, or total is already at or above 10
    if (increment && (current >= 5 || totalCells >= 10)) {
      return;
    }

    const newVal = increment ? current + 1 : Math.max(0, current - 1);
    const updated = { ...localSpecialCells, [key]: newVal };
    
    setLocalSpecialCells(updated);
    onSettingsChange(getParsedRows(), getParsedCols(), getParsedSeconds(), updated);
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
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
    >
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden border border-[var(--color-border)]/50 bg-[var(--color-surface)]/40 backdrop-blur-xl">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]/60 rounded-xl hover:bg-[var(--color-surface)] active:scale-95 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Leave Lobby
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">Status:</span>
            {connectionStatus === 'connecting' && (
              <span className="flex items-center gap-1 text-xs font-bold text-[var(--color-status-medium)]">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Connecting
              </span>
            )}
            {connectionStatus === 'connected' && (
              <span className="text-xs font-bold text-[var(--color-status-easy)]">● Connected</span>
            )}
            {connectionStatus === 'error' && (
              <span className="text-xs font-bold text-[var(--color-status-extra-hard)]">▲ Error</span>
            )}
          </div>
        </div>

        {/* Room Code Display */}
        <div className="text-center mb-6 sm:mb-8 bg-[var(--color-surface)]/60 rounded-2xl p-4 sm:p-6 border border-[var(--color-border)]/40 space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[var(--color-muted)] mb-1.5">
              Room Join Code
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-black tracking-wider text-[var(--color-foreground)] uppercase font-mono">
                {roomCode}
              </span>
              <button
                onClick={copyRoomCode}
                aria-label="Copy room join code"
                title="Copy Room Code"
                className="w-11 h-11 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-background)] active:scale-90 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-[var(--color-status-easy)]' : ''} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-[var(--color-border)]/35 pt-4">
            <span className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">
              Or Share Invite Link
            </span>
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:scale-102 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={copiedLink ? faCheck : faCopy} className={copiedLink ? 'text-[var(--color-status-easy)]' : ''} />
              {copiedLink ? 'Invite Link Copied!' : 'Copy Direct Invite Link'}
            </button>
          </div>

          <p className="text-xs text-[var(--color-muted)]">
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
                <label htmlFor="online-player-name" className="mb-1 block text-xs text-[var(--color-muted)]">Nickname</label>
                <input
                  id="online-player-name"
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
                  className="min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-base font-semibold transition focus:border-[var(--color-accent)] focus:outline-none sm:text-sm"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-xs text-[var(--color-muted)]">Color</span>
                <div role="group" aria-label="Choose your player color" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                  {PRESET_COLORS.map((color) => {
                    const isOccupied = occupiedColors.includes(color);
                    const isSelected = playerColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setPlayerColor(color)}
                        aria-label={
                          isOccupied
                            ? `${PRESET_COLOR_LABELS[color] ?? color} color, already chosen by another player`
                            : `Set your color to ${PRESET_COLOR_LABELS[color] ?? color}`
                        }
                        aria-pressed={isSelected}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-transparent transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                          isSelected 
                            ? 'bg-[var(--color-surface)] shadow-lg'
                            : isOccupied 
                              ? 'opacity-20 cursor-not-allowed scale-90' 
                              : 'hover:scale-105 hover:bg-[var(--color-surface)]'
                        }`}
                        title={isOccupied ? 'Color chosen by another player' : ''}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-6 w-6 rounded-full border-2 ${isSelected ? 'border-[var(--color-foreground)]' : 'border-transparent'}`}
                          style={{ backgroundColor: getThemeColor(color, isDark) }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Connected Players */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[var(--color-foreground)]/80">Players ({lobbyPlayers.length}/6)</h3>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
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
                              <span className="shrink-0 rounded border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/15 px-1.5 py-0.5 text-xs font-bold text-[var(--color-accent)]">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {player.clientId === trueHostClientId ? (
                            <span className="flex items-center gap-1 rounded-full border border-[var(--color-status-medium)]/20 bg-[var(--color-status-medium)]/10 px-2 py-0.5 text-xs font-extrabold text-[var(--color-status-medium)]">
                              <FontAwesomeIcon icon={faCrown} /> Host
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-0.5 text-xs font-bold text-[var(--color-muted)]">
                                <FontAwesomeIcon icon={faUser} /> Guest
                              </span>
                              {isHost && !isMe && (
                                <button
                                  type="button"
                                  onClick={() => onKickPlayer?.(player.clientId)}
                                  className="flex min-h-11 items-center gap-1 rounded-full border border-[var(--color-status-extra-hard)]/20 bg-[var(--color-status-extra-hard)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-status-extra-hard)] shadow-sm transition hover:bg-[var(--color-status-extra-hard)]/20 hover:text-[var(--color-status-danger-strong)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer"
                                  title={`Kick ${displayName} from lobby`}
                                  aria-label={`Kick ${displayName} from lobby`}
                                >
                                  <FontAwesomeIcon icon={faUserSlash} className="text-xs" />
                                  Kick
                                </button>
                              )}
                            </div>
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

        {/* Lobby Configuration (Full Width) */}
        <div className="bg-[var(--color-background)]/60 border border-[var(--color-border)]/50 rounded-2xl p-5 mb-8">
          <label className="text-sm font-bold flex items-center gap-1.5 text-[var(--color-foreground)] mb-4">
            <FontAwesomeIcon icon={faBorderAll} className="text-[var(--color-accent)]" />
            Lobby Game Settings
          </label>

          {isHost ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Settings: Dimensions & Turn Time */}
              <div className="space-y-4 flex flex-col justify-center">
                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3.5">
                  {[
                    { name: 'Mobile', r: 8, c: 6 },
                    { name: 'Standard', r: 12, c: 8 },
                    { name: 'Classic', r: 15, c: 10 },
                    { name: 'Large', r: 20, c: 15 },
                  ].map((preset) => {
                    const isSelected = getParsedRows() === preset.r && getParsedCols() === preset.c;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setLocalRows(preset.r.toString());
                          setLocalCols(preset.c.toString());
                          onSettingsChange(preset.r, preset.c, getParsedSeconds(), localSpecialCells);
                        }}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center border transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] border-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/25 scale-[1.02]'
                            : 'bg-[var(--color-surface)] text-[var(--color-foreground)]/80 border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface)]/80'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-extrabold tracking-tight font-mono leading-none mb-1">
                          {preset.r}×{preset.c}
                        </span>
                        <span className={`text-xs font-semibold leading-none truncate max-w-full ${isSelected ? 'text-[var(--color-accent-contrast)]' : 'text-[var(--color-muted)]'}`}>
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="online-board-rows" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Rows (6 - 20)</label>
                    <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20 shadow-sm">
                      <button
                        type="button"
                        onClick={handleDecrementRows}
                        aria-label="Decrease rows"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        id="online-board-rows"
                        type="number"
                        min={6}
                        max={20}
                        value={localRows}
                        onChange={(e) => setLocalRows(e.target.value)}
                        onBlur={() => {
                          const num = parseInt(localRows, 10);
                          let finalRows = num;
                          if (isNaN(num) || num < 6) finalRows = 6;
                          else if (num > 20) finalRows = 20;
                          setLocalRows(finalRows.toString());
                          onSettingsChange(finalRows, getParsedCols(), getParsedSeconds(), localSpecialCells);
                        }}
                        className="min-h-11 w-12 bg-transparent text-base font-bold text-center text-[var(--color-foreground)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={handleIncrementRows}
                        aria-label="Increase rows"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="online-board-columns" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Columns (6 - 25)</label>
                    <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20 shadow-sm">
                      <button
                        type="button"
                        onClick={handleDecrementCols}
                        aria-label="Decrease columns"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        id="online-board-columns"
                        type="number"
                        min={6}
                        max={25}
                        value={localCols}
                        onChange={(e) => setLocalCols(e.target.value)}
                        onBlur={() => {
                          const num = parseInt(localCols, 10);
                          let finalCols = num;
                          if (isNaN(num) || num < 6) finalCols = 6;
                          else if (num > 25) finalCols = 25;
                          setLocalCols(finalCols.toString());
                          onSettingsChange(getParsedRows(), finalCols, getParsedSeconds(), localSpecialCells);
                        }}
                        className="min-h-11 w-12 bg-transparent text-base font-bold text-center text-[var(--color-foreground)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={handleIncrementCols}
                        aria-label="Increase columns"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)]/30 pt-3">
                  <label htmlFor="online-turn-time" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Turn Time Limit (10 - 120s)</label>
                  <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20 shadow-sm">
                    <button
                      type="button"
                      onClick={handleDecrementTurnSeconds}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <div className="flex items-center gap-1">
                      <input
                        id="online-turn-time"
                        type="number"
                        min={10}
                        max={120}
                        value={localTurnSeconds}
                        onChange={(e) => setLocalTurnSeconds(e.target.value)}
                        onBlur={() => {
                          const num = parseInt(localTurnSeconds, 10);
                          let finalSeconds = num;
                          if (isNaN(num) || num < 10) finalSeconds = 30;
                          else if (num > 120) finalSeconds = 120;
                          setLocalTurnSeconds(finalSeconds.toString());
                          onSettingsChange(getParsedRows(), getParsedCols(), finalSeconds, localSpecialCells);
                        }}
                        className="min-h-11 w-12 bg-transparent text-base font-bold text-center text-[var(--color-foreground)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-[var(--color-muted)] select-none pr-1">sec</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleIncrementTurnSeconds}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-90 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Settings: Special Cells */}
              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  <span className="text-[var(--color-accent)]">✨</span> Special Cells
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(['walls', 'portals', 'multipliers', 'blackholes'] as const).map(key => (
                    <div key={key} className="bg-[var(--color-surface)]/40 p-2.5 rounded-xl border border-[var(--color-border)]/30 flex flex-col gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {key === 'walls' && '🧱'}
                        {key === 'portals' && '🌀'}
                        {key === 'multipliers' && '✨'}
                        {key === 'blackholes' && '⚫'}
                        {key}
                      </span>
                      <div className="flex items-center justify-between bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() => handleSpecialCellChange(key, false)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="text-sm font-extrabold w-6 text-center text-[var(--color-foreground)]">{localSpecialCells[key]}</span>
                        <button
                          type="button"
                          onClick={() => handleSpecialCellChange(key, true)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-xs text-[var(--color-muted)] transition-all hover:bg-[var(--color-border)]/50 hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent active:scale-95 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Dimensions & Turn Time */}
              <div className="space-y-4 flex flex-col justify-center">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Current Dimensions</span>
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-center text-sm font-extrabold text-[var(--color-foreground)] shadow-sm">
                      {rows} × {cols}
                    </div>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Turn Time Limit</span>
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-center text-sm font-extrabold text-[var(--color-foreground)] shadow-sm">
                      {turnSecondsLimit}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Special Cells specific counts */}
              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  <span className="text-[var(--color-accent)]">✨</span> Special Cells Configured
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(['walls', 'portals', 'multipliers', 'blackholes'] as const).map(key => (
                    <div key={key} className="bg-[var(--color-surface)]/40 p-2.5 rounded-xl border border-[var(--color-border)]/30 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {key === 'walls' && '🧱'}
                        {key === 'portals' && '🌀'}
                        {key === 'multipliers' && '✨'}
                        {key === 'blackholes' && '⚫'}
                        {key}
                      </span>
                      <span className="bg-[var(--color-background)] border border-[var(--color-border)] px-2.5 py-0.5 rounded-md text-xs font-extrabold text-[var(--color-foreground)] shadow-sm">
                        {(specialCells ? clampSpecialCells(specialCells) : localSpecialCells)[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Game Action */}
        {isHost ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={lobbyPlayers.length < 2}
            onClick={onStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] font-extrabold tracking-wide text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
