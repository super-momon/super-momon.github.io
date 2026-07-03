'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faVolumeUp, 
  faVolumeMute, 
  faBorderAll, 
  faUsers, 
  faDice, 
  faTv, 
  faGlobe, 
  faPlus, 
  faSignInAlt 
} from '@fortawesome/free-solid-svg-icons';
import { PRESET_COLORS, getThemeColor, useIsDark } from './colors';

export interface PlayerSetup {
  id: number;
  clientId?: string;
  name: string;
  color: string;
}

interface SetupScreenProps {
  onStartGame: (players: PlayerSetup[], rows: number, cols: number, soundEnabled: boolean) => void;
  onStartOnline: (mode: 'host' | 'join', name: string, color: string, code: string) => void;
}

const DEFAULT_NAMES = ['Player One', 'Player Two', 'Player Three', 'Player Four', 'Player Five'];

export default function SetupScreen({ onStartGame, onStartOnline }: SetupScreenProps) {
  const isDark = useIsDark();
  // Main Play mode: 'local' or 'online'
  const [playMode, setPlayMode] = useState<'local' | 'online'>('local');
  
  // Online-specific states
  const [onlineMode, setOnlineMode] = useState<'host' | 'join'>('host');
  const [onlineName, setOnlineName] = useState<string>('Player');
  const [onlineColor, setOnlineColor] = useState<string>(PRESET_COLORS[0]);
  const [roomCode, setRoomCode] = useState<string>('');

  // Local-specific states
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [rows, setRows] = useState<number>(15);
  const [cols, setCols] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize local players config
  const [players, setPlayers] = useState<PlayerSetup[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: DEFAULT_NAMES[i],
      color: PRESET_COLORS[i],
    }))
  );

  const handleNameChange = (index: number, newName: string) => {
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, name: newName } : p))
    );
  };

  const handleColorChange = (index: number, newColor: string) => {
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, color: newColor } : p))
    );
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activePlayers = players.slice(0, playerCount);
    onStartGame(activePlayers, rows, cols, soundEnabled);
  };

  const handleOnlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onlineMode === 'join' && roomCode.trim().length !== 6) {
      alert('Please enter a valid 6-character room code.');
      return;
    }
    onStartOnline(onlineMode, onlineName, onlineColor, roomCode.toUpperCase().trim());
  };

  const randomizeNames = () => {
    const funNames = [
      'Orbinator', 'Cascader', 'Wave Maker', 'Fusion Bomb', 'Critical Hits',
      'Neutron Star', 'Reactant', 'Chain Master', 'Pixel Orb', 'Atomic Blast'
    ];
    const shuffled = [...funNames].sort(() => Math.random() - 0.5);
    setPlayers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        name: shuffled[idx] || DEFAULT_NAMES[idx],
      }))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand / Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-accent)]/20"
          >
            <svg className="w-8 h-8 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)] mb-2">
            Chain Reaction
          </h1>
          <p className="text-[var(--color-muted)] text-sm max-w-md mx-auto">
            Take control of the board by causing cascades. Place your orbs, trigger explosions, and dominate the grid.
          </p>
        </div>

        {/* Tab Selector: Local vs Online */}
        <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)]/80 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setPlayMode('local')}
            className={`flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              playMode === 'local'
                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <FontAwesomeIcon icon={faTv} />
            Local Play
          </button>
          <button
            type="button"
            onClick={() => setPlayMode('online')}
            className={`flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              playMode === 'online'
                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <FontAwesomeIcon icon={faGlobe} />
            Online Multiplayer
          </button>
        </div>

        <AnimatePresence mode="wait">
          {playMode === 'local' ? (
            <motion.form
              key="local-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLocalSubmit}
              className="space-y-6"
            >
              {/* Step 1: Players Count */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-foreground)]/80 flex items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faUsers} className="text-[var(--color-accent)]" />
                  Number of Players (2 - 5)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPlayerCount(num)}
                      className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all duration-300 ${
                        playerCount === num
                          ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20 scale-102'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-muted)]/50'
                      }`}
                    >
                      {num} Players
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Player Configurations */}
              <div className="space-y-3 bg-[var(--color-surface)]/40 rounded-2xl p-5 border border-[var(--color-border)]/40">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-semibold text-[var(--color-foreground)]/80">Customize Players</h3>
                  <button
                    type="button"
                    onClick={randomizeNames}
                    className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1.5 font-medium transition-all"
                  >
                    <FontAwesomeIcon icon={faDice} /> Randomize Names
                  </button>
                </div>
                
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {Array.from({ length: playerCount }).map((_, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-xl p-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                          style={{
                            backgroundColor: getThemeColor(players[i].color, isDark),
                            boxShadow: `0 0 10px ${getThemeColor(players[i].color, isDark)}40`,
                          }}
                        />
                        <span className="text-xs font-bold text-[var(--color-muted)] whitespace-nowrap min-w-16">
                          Player {i + 1}
                        </span>
                      </div>

                      <input
                        type="text"
                        required
                        maxLength={15}
                        value={players[i].name}
                        onChange={(e) => handleNameChange(i, e.target.value)}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition"
                        placeholder={`Player ${i + 1} Name`}
                      />

                      <div className="flex gap-1.5 mt-2 sm:mt-0 flex-shrink-0">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColorChange(i, color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              players[i].color === color ? 'border-[var(--color-foreground)] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: getThemeColor(color, isDark) }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Board Size & Sound */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface)]/30 rounded-2xl p-4 border border-[var(--color-border)]/40 flex flex-col gap-3">
                  <label className="text-sm font-semibold text-[var(--color-foreground)]/80 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBorderAll} className="text-[var(--color-accent)]" />
                    Grid Board Dimensions
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-[var(--color-muted)] block mb-1">Rows (6 - 20)</span>
                      <input
                        type="number"
                        min={6}
                        max={20}
                        value={rows}
                        onChange={(e) => setRows(Math.max(6, Math.min(20, parseInt(e.target.value) || 15)))}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm font-bold text-center focus:outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--color-muted)] block mb-1">Columns (6 - 25)</span>
                      <input
                        type="number"
                        min={6}
                        max={25}
                        value={cols}
                        onChange={(e) => setCols(Math.max(6, Math.min(25, parseInt(e.target.value) || 20)))}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm font-bold text-center focus:outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--color-surface)]/30 rounded-2xl p-4 border border-[var(--color-border)]/40 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-semibold text-[var(--color-foreground)]/80 block mb-1">Sound Effects</span>
                    <span className="text-xs text-[var(--color-muted)]">Synthesized retro play sounds</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      soundEnabled
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20'
                        : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
                    }`}
                  >
                    <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] font-extrabold tracking-wide text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlay} />
                Start Local Game
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="online-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleOnlineSubmit}
              className="space-y-6"
            >
              {/* Online Sub-tabs: Host vs Join */}
              <div className="flex justify-center border-b border-[var(--color-border)]/40 pb-1 gap-6">
                <button
                  type="button"
                  onClick={() => setOnlineMode('host')}
                  className={`pb-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                    onlineMode === 'host'
                      ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                      : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Host A Room
                </button>
                <button
                  type="button"
                  onClick={() => setOnlineMode('join')}
                  className={`pb-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                    onlineMode === 'join'
                      ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                      : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Join A Room
                </button>
              </div>

              {/* Profile Config */}
              <div className="bg-[var(--color-surface)]/30 rounded-2xl p-5 border border-[var(--color-border)]/40 space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]/80">Your Profile</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--color-muted)] block mb-1">Nickname</label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      value={onlineName}
                      onChange={(e) => setOnlineName(e.target.value)}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[var(--color-muted)] block mb-1.5">Color</label>
                    <div className="flex gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setOnlineColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            onlineColor === color ? 'border-[var(--color-foreground)] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: getThemeColor(color, isDark) }}
                        >
                          {onlineColor === color && (
                            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Code Input (Join Mode only) */}
              {onlineMode === 'join' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[var(--color-surface)]/30 rounded-2xl p-5 border border-[var(--color-border)]/40"
                >
                  <label className="text-sm font-semibold text-[var(--color-foreground)]/80 block mb-2">
                    Enter 6-Digit Room Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-black tracking-widest text-center focus:outline-none focus:border-[var(--color-accent)] transition placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
                    placeholder="E.G. X8J9L2"
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] font-extrabold tracking-wide text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={onlineMode === 'host' ? faPlus : faSignInAlt} />
                {onlineMode === 'host' ? 'Create Online Lobby' : 'Join Online Room'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
