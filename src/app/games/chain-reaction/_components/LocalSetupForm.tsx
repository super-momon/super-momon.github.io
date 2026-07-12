'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faVolumeUp, 
  faVolumeMute, 
  faBorderAll, 
  faUsers, 
  faDice, 
  faPlus, 
  faMinus 
} from '@fortawesome/free-solid-svg-icons';
import { PlayerSetup, SpecialCellsConfig, DEFAULT_SPECIAL_CELLS } from './SetupScreen';
import PlayerConfigRow from './PlayerConfigRow';
import { PRESET_COLORS, useIsDark } from './colors';

interface LocalSetupFormProps {
  onStartGame: (players: PlayerSetup[], rows: number, cols: number, soundEnabled: boolean, turnSecondsLimit: number, specialCells: SpecialCellsConfig) => void;
}

const DEFAULT_NAMES = ['Player One', 'Player Two', 'Player Three', 'Player Four', 'Player Five', 'Player Six'];

export default function LocalSetupForm({ onStartGame }: LocalSetupFormProps) {
  const isDark = useIsDark();
  
  // Local-specific states
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [rows, setRows] = useState<number | ''>(15);
  const [cols, setCols] = useState<number | ''>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [turnSecondsLimit, setTurnSecondsLimit] = useState<number | ''>(30);
  const [specialCells, setSpecialCells] = useState<SpecialCellsConfig>(DEFAULT_SPECIAL_CELLS);

  const handleSpecialCellChange = (key: keyof SpecialCellsConfig, increment: boolean) => {
    setSpecialCells(prev => {
      const current = prev[key];
      const totalCells = Object.values(prev).reduce((a, b) => a + b, 0);

      if (increment) {
        if (current >= 5 || totalCells >= 10) return prev;
        return { ...prev, [key]: current + 1 };
      } else {
        return { ...prev, [key]: Math.max(0, current - 1) };
      }
    });
  };

  const decrementTurnSeconds = () => {
    setTurnSecondsLimit((prev) => {
      const val = prev === '' ? 30 : prev;
      return Math.max(10, val - 5);
    });
  };

  const incrementTurnSeconds = () => {
    setTurnSecondsLimit((prev) => {
      const val = prev === '' ? 30 : prev;
      return Math.min(120, val + 5);
    });
  };

  // Initialize local players config
  const [players, setPlayers] = useState<PlayerSetup[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      name: DEFAULT_NAMES[i] || `Player ${i + 1}`,
      color: PRESET_COLORS[i] || PRESET_COLORS[0],
    }))
  );

  const decrementRows = () => {
    setRows((prev) => {
      const val = prev === '' ? 15 : prev;
      return Math.max(6, val - 1);
    });
  };

  const incrementRows = () => {
    setRows((prev) => {
      const val = prev === '' ? 15 : prev;
      return Math.min(20, val + 1);
    });
  };

  const decrementCols = () => {
    setCols((prev) => {
      const val = prev === '' ? 20 : prev;
      return Math.max(6, val - 1);
    });
  };

  const incrementCols = () => {
    setCols((prev) => {
      const val = prev === '' ? 20 : prev;
      return Math.min(25, val + 1);
    });
  };

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

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRows = Math.max(6, Math.min(20, Number(rows) || 15));
    const finalCols = Math.max(6, Math.min(25, Number(cols) || 20));
    const finalTurnSeconds = Math.max(10, Math.min(120, Number(turnSecondsLimit) || 30));
    setRows(finalRows);
    setCols(finalCols);
    setTurnSecondsLimit(finalTurnSeconds);
    const activePlayers = players.slice(0, playerCount);
    onStartGame(activePlayers, finalRows, finalCols, soundEnabled, finalTurnSeconds, specialCells);
  };

  return (
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
          Number of Players (2 - 6)
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[2, 3, 4, 5, 6].map((num) => (
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
            <PlayerConfigRow
              key={players[i].id}
              index={i}
              player={players[i]}
              isDark={isDark}
              onNameChange={handleNameChange}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </div>

      {/* Step 3: Board Size & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface)]/30 rounded-2xl p-4 border border-[var(--color-border)]/40 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[var(--color-foreground)]/80 flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faBorderAll} className="text-[var(--color-accent)]" />
              Grid Board Dimensions
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[var(--color-muted)] block mb-1.5">Rows (6 - 20)</span>
                <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
                  <button
                    key="rows-dec"
                    type="button"
                    onClick={decrementRows}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input
                    type="number"
                    min={6}
                    max={20}
                    value={rows}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setRows('');
                      } else {
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed)) setRows(parsed);
                      }
                    }}
                    onBlur={() => {
                      const num = Number(rows);
                      if (isNaN(num) || num < 6) setRows(6);
                      else if (num > 20) setRows(20);
                      else setRows(num);
                    }}
                    className="w-12 bg-transparent text-sm font-bold text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    key="rows-inc"
                    type="button"
                    onClick={incrementRows}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--color-muted)] block mb-1.5">Columns (6 - 25)</span>
                <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
                  <button
                    key="cols-dec"
                    type="button"
                    onClick={decrementCols}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input
                    type="number"
                    min={6}
                    max={25}
                    value={cols}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setCols('');
                      } else {
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed)) setCols(parsed);
                      }
                    }}
                    onBlur={() => {
                      const num = Number(cols);
                      if (isNaN(num) || num < 6) setCols(6);
                      else if (num > 25) setCols(25);
                      else setCols(num);
                    }}
                    className="w-12 bg-transparent text-sm font-bold text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    key="cols-inc"
                    type="button"
                    onClick={incrementCols}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)]/30 pt-3.5">
            <label className="text-xs font-bold text-[var(--color-muted)] flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Turn Time Limit (10 - 120s)
            </label>
            <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 transition-all focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
              <button
                type="button"
                onClick={decrementTurnSeconds}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={10}
                  max={120}
                  value={turnSecondsLimit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setTurnSecondsLimit('');
                    } else {
                      const parsed = parseInt(val, 10);
                      if (!isNaN(parsed)) setTurnSecondsLimit(parsed);
                    }
                  }}
                  onBlur={() => {
                    const num = Number(turnSecondsLimit);
                    if (isNaN(num) || num < 10) setTurnSecondsLimit(30);
                    else if (num > 120) setTurnSecondsLimit(120);
                    else setTurnSecondsLimit(num);
                  }}
                  className="w-12 bg-transparent text-sm font-bold text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-[var(--color-muted)] select-none pr-1">sec</span>
              </div>
              <button
                type="button"
                onClick={incrementTurnSeconds}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Special Cells & Sound */}
        <div className="bg-[var(--color-surface)]/30 rounded-2xl p-4 border border-[var(--color-border)]/40 flex flex-col">
          <label className="text-sm font-semibold text-[var(--color-foreground)]/80 flex items-center gap-2 mb-3">
            <span className="text-[var(--color-accent)]">✨</span>
            Special Cells (Randomly Placed)
          </label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {(['walls', 'portals', 'multipliers', 'blackholes'] as const).map(key => (
              <div key={key} className="bg-[var(--color-background)]/50 p-2.5 rounded-xl border border-[var(--color-border)]/30 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] tracking-wider flex items-center gap-1.5">
                  {key === 'walls' && '🧱'}
                  {key === 'portals' && '🌀'}
                  {key === 'multipliers' && '✨'}
                  {key === 'blackholes' && '⚫'}
                  {key}
                </span>
                <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1 shadow-sm">
                   <button
                    type="button"
                    onClick={() => handleSpecialCellChange(key, false)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="text-sm font-extrabold w-6 text-center text-[var(--color-foreground)]">{specialCells[key]}</span>
                  <button
                    type="button"
                    onClick={() => handleSpecialCellChange(key, true)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/50 active:scale-95 transition-all text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-[var(--color-border)]/30 pt-4 flex justify-between items-center">
            <div>
              <span className="text-sm font-semibold text-[var(--color-foreground)]/80 block mb-0.5">Sound Effects</span>
              <span className="text-[10px] text-[var(--color-muted)]">Synthesized retro play sounds</span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20 shadow-inner'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
              }`}
            >
              <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} className="text-base" />
            </button>
          </div>
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
  );
}
