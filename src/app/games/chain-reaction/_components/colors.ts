import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const PRESET_COLORS = [
  '#08ca5f', // Emerald Green
  '#ff4b4b', // Coral Red
  '#00d4ff', // Cyan / Neon Blue
  '#d946ef', // Neon Pink / Magenta
  '#f97316', // Gold / Orange
];

export const getThemeColor = (color: string, isDark: boolean) => {
  switch (color) {
    case '#08ca5f':
      return isDark ? '#08ca5f' : '#15803d';
    case '#ff4b4b':
      return isDark ? '#ff4b4b' : '#b91c1c';
    case '#00d4ff':
      return isDark ? '#00d4ff' : '#0369a1';
    case '#d946ef':
      return isDark ? '#d946ef' : '#a21caf';
    case '#f97316':
      return isDark ? '#f97316' : '#c2410c';
    default:
      return color;
  }
};

export function useIsDark() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return true;
  return resolvedTheme === 'dark';
}
