'use client';

import { PlayerSetup } from './SetupScreen';
import { PRESET_COLORS, getThemeColor } from './colors';

interface PlayerConfigRowProps {
  index: number;
  player: PlayerSetup;
  isDark: boolean;
  onNameChange: (index: number, newName: string) => void;
  onColorChange: (index: number, newColor: string) => void;
}

export default function PlayerConfigRow({
  index,
  player,
  isDark,
  onNameChange,
  onColorChange,
}: PlayerConfigRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-xl p-3">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span
          className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
          style={{
            backgroundColor: getThemeColor(player.color, isDark),
            boxShadow: `0 0 10px ${getThemeColor(player.color, isDark)}40`,
          }}
        />
        <span className="text-xs font-bold text-[var(--color-muted)] whitespace-nowrap min-w-16">
          Player {index + 1}
        </span>
      </div>

      <input
        type="text"
        required
        maxLength={15}
        value={player.name}
        onChange={(e) => onNameChange(index, e.target.value)}
        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition"
        placeholder={`Player ${index + 1} Name`}
      />

      <div className="flex gap-1.5 mt-2 sm:mt-0 flex-shrink-0">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(index, color)}
            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
              player.color === color ? 'border-[var(--color-foreground)] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: getThemeColor(color, isDark) }}
          />
        ))}
      </div>
    </div>
  );
}
