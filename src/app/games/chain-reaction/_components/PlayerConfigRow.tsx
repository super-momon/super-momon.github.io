'use client';

import { PlayerSetup } from './SetupScreen';
import { PRESET_COLORS, PRESET_COLOR_LABELS, getThemeColor } from './colors';

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
  const nameInputId = `player-name-${player.id}`;

  const colorButtons = (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-1.5">
      {PRESET_COLORS.map((color) => {
        const isSelected = player.color === color;

        return (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(index, color)}
            aria-label={`Set Player ${index + 1} color to ${PRESET_COLOR_LABELS[color] ?? color}`}
            aria-pressed={isSelected}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-transparent transition-colors hover:bg-[var(--color-background)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
          >
            <span
              aria-hidden="true"
              className={`h-6 w-6 rounded-full border-2 ${
                isSelected
                  ? 'scale-110 border-[var(--color-foreground)] shadow-sm ring-1 ring-[var(--color-accent)]'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: getThemeColor(color, isDark) }}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col items-start gap-2.5 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] p-2.5 sm:p-3 md:flex-row md:items-center md:gap-3">
      <div className="flex w-full items-center gap-2 md:w-auto md:shrink-0">
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 rounded-full border border-black/10 sm:h-5 sm:w-5"
          style={{
            backgroundColor: getThemeColor(player.color, isDark),
            boxShadow: `0 0 10px ${getThemeColor(player.color, isDark)}40`,
          }}
        />
        <span className="min-w-16 whitespace-nowrap text-xs font-bold text-[var(--color-muted)]">
            Player {index + 1}
        </span>
      </div>

      <label htmlFor={nameInputId} className="sr-only">
        Player {index + 1} name
      </label>
      <input
        id={nameInputId}
        type="text"
        required
        maxLength={20}
        autoComplete="off"
        autoCapitalize="words"
        value={player.name}
        onChange={(e) => onNameChange(index, e.target.value)}
        className="min-h-11 w-full min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-base font-medium transition focus:border-[var(--color-accent)] focus:outline-none sm:text-sm md:flex-1"
        placeholder={`Player ${index + 1} Name`}
      />

      <div className="md:hidden">{colorButtons}</div>
      <div className="hidden md:block">{colorButtons}</div>
    </div>
  );
}
