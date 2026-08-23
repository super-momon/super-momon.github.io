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
    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-start sm:items-center bg-[var(--color-surface)] border border-[var(--color-border)]/60 rounded-xl p-2.5 sm:p-3">
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-black/10 flex-shrink-0"
            style={{
              backgroundColor: getThemeColor(player.color, isDark),
              boxShadow: `0 0 10px ${getThemeColor(player.color, isDark)}40`,
            }}
          />
          <span className="text-xs font-bold text-[var(--color-muted)] whitespace-nowrap min-w-16">
            Player {index + 1}
          </span>
        </div>

        {/* Color swatches displayed inline on mobile for quick access */}
        <div className="flex sm:hidden gap-1.5 flex-shrink-0">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(index, color)}
              aria-label={`Select color for Player ${index + 1}`}
              className={`w-6 h-6 rounded-full border-2 transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
                player.color === color ? 'border-[var(--color-foreground)] scale-110 shadow-sm ring-1 ring-[var(--color-primary)]' : 'border-transparent'
              }`}
              style={{ backgroundColor: getThemeColor(color, isDark) }}
            />
          ))}
        </div>
      </div>

      <input
        type="text"
        required
        maxLength={20}
        autoComplete="off"
        autoCapitalize="words"
        value={player.name}
        onChange={(e) => onNameChange(index, e.target.value)}
        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition"
        placeholder={`Player ${index + 1} Name`}
      />

      {/* Color swatches on desktop */}
      <div className="hidden sm:flex gap-1.5 flex-shrink-0">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(index, color)}
            aria-label={`Select color for Player ${index + 1}`}
            className={`w-6 h-6 rounded-full border-2 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
              player.color === color ? 'border-[var(--color-foreground)] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: getThemeColor(color, isDark) }}
          />
        ))}
      </div>
    </div>
  );
}
