export const DESIGN_IDS = ["classic", "liquid-glass"] as const;

export type DesignId = (typeof DESIGN_IDS)[number];

export interface DesignDefinition {
  id: DesignId;
  label: string;
  description: string;
}

export const DEFAULT_DESIGN: DesignId = "liquid-glass";
export const DESIGN_STORAGE_KEY = "design-preference";
export const DESIGN_URL_PARAM = "design";

export const DESIGN_REGISTRY: Record<DesignId, DesignDefinition> = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "The classic, solid interface",
  },
  "liquid-glass": {
    id: "liquid-glass",
    label: "Liquid Glass",
    description: "The translucent Liquid Glass interface",
  },
};

export function isDesignId(value: string | null | undefined): value is DesignId {
  return value === "classic" || value === "liquid-glass";
}

export function isGameRoute(pathname: string): boolean {
  return pathname === "/games" || pathname.startsWith("/games/");
}

export function readDesignPreference(): DesignId | null {
  try {
    const stored = window.localStorage.getItem(DESIGN_STORAGE_KEY);
    return isDesignId(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function writeDesignPreference(design: DesignId): void {
  try {
    window.localStorage.setItem(DESIGN_STORAGE_KEY, design);
  } catch {
    // Storage can be unavailable (private mode or denied access).
  }
}
