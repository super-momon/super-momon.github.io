import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const PRESET_COLORS = [
  '#10b981', // Emerald Green
  '#ef4444', // Coral Red
  '#3b82f6', // Royal Blue
  '#06b6d4', // Sky Cyan
  '#f59e0b', // Amber / Yellow
  '#8b5cf6', // Violet Purple
];

export const getThemeColor = (color: string, isDark: boolean) => {
  switch (color.toLowerCase()) {
    // New Presets
    case '#10b981':
      return isDark ? '#10b981' : '#16a34a';
    case '#ef4444':
      return isDark ? '#ef4444' : '#dc2626';
    case '#3b82f6':
      return isDark ? '#3b82f6' : '#2563eb';
    case '#06b6d4':
      return isDark ? '#06b6d4' : '#0891b2';
    case '#f59e0b':
      return isDark ? '#f59e0b' : '#d97706';
    case '#8b5cf6':
      return isDark ? '#8b5cf6' : '#7c3aed';

    // Backward Compatibility for old presets
    case '#ec4899':
      return isDark ? '#ec4899' : '#9d174d';
    case '#08ca5f':
      return isDark ? '#08ca5f' : '#15803d';
    case '#ff4b4b':
      return isDark ? '#ff4b4b' : '#b91c1c';
    case '#00d4ff':
      return isDark ? '#00d4ff' : '#0369a1';
    case '#d946ef':
      return isDark ? '#d946ef' : '#a21caf';
    case '#eab308':
      return isDark ? '#eab308' : '#a16207';
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
