'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faVolumeUp, faVolumeMute, faBorderAll, faUsers, faDice } from '@fortawesome/free-solid-svg-icons';

export interface PlayerSetup {
  id: number;
  name: string;
  color: string;
}

interface SetupScreenProps {
  onStartGame: (players: PlayerSetup[], rows: number, cols: number, soundEnabled: boolean) => void;
}

const PRESET_COLORS = [
  '#08ca5f', // Emerald Green
  '#ff4b4b', // Coral Red
  '#00d4ff', // Cyan / Neon Blue
  '#d946ef', // Neon Pink / Magenta
  '#f97316', // Gold / Orange
];

const DEFAULT_NAMES = ['Player One', 'Player Two', 'Player Three', 'Player Four', 'Player Five'];

export default function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [rows, setRows] = useState<number>(15);
  const [cols, setCols] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize players config
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Slice only the number of active players selected
    const activePlayers = players.slice(0, playerCount);
    onStartGame(activePlayers, rows, cols, soundEnabled);
  };

  const randomizeNames = () => {
    const funNames = [
      'Orbinator', 'Cascader', 'Wave Maker', 'Fusion Bomb', 'Critical Hits',
      'Neutron Star', 'Reactant', 'Chain Master', 'Pixel Orb', 'Atomic Blast'
    ];
    // Shuffle
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

        <div className="text-center mb-8">
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
                        backgroundColor: players[i].color,
                        boxShadow: `0 0 10px ${players[i].color}40`,
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
                        style={{ backgroundColor: color }}
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
            Start Chain Reaction Game
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
