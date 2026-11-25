"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_DESIGN,
  DESIGN_URL_PARAM,
  isDesignId,
  isGameRoute,
  readDesignPreference,
  writeDesignPreference,
  type DesignId,
} from "@/lib/designSystem";

interface DesignContextValue {
  design: DesignId;
  isGameRoute: boolean;
  isMounted: boolean;
  setDesign: (design: DesignId) => void;
  toggleDesign: () => void;
}

const DesignContext = createContext<DesignContextValue | null>(null);

function resolveDesign(pathname: string): DesignId {
  if (isGameRoute(pathname)) {
    return "classic";
  }

  const urlValue = new URLSearchParams(window.location.search).get(DESIGN_URL_PARAM);
  if (isDesignId(urlValue)) {
    return urlValue;
  }

  return readDesignPreference() ?? DEFAULT_DESIGN;
}

export function DesignProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [design, setDesignState] = useState<DesignId>(DEFAULT_DESIGN);
  const [isMounted, setIsMounted] = useState(false);
  const gameRoute = isGameRoute(pathname);

  const applyDesign = useCallback((nextDesign: DesignId) => {
    setDesignState(nextDesign);
    document.documentElement.setAttribute("data-design", nextDesign);
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      if (!isGameRoute(pathname)) {
        const urlValue = new URLSearchParams(window.location.search).get(DESIGN_URL_PARAM);
        if (isDesignId(urlValue)) {
          writeDesignPreference(urlValue);
        }
      }
      applyDesign(resolveDesign(pathname));
    };

    syncFromLocation();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    window.addEventListener("popstate", syncFromLocation);

    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [applyDesign, pathname]);

  const setDesign = useCallback(
    (nextDesign: DesignId) => {
      if (gameRoute) {
        applyDesign("classic");
        return;
      }

      applyDesign(nextDesign);
      writeDesignPreference(nextDesign);

      const url = new URL(window.location.href);
      url.searchParams.set(DESIGN_URL_PARAM, nextDesign);
      router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
    },
    [applyDesign, gameRoute, router],
  );

  const toggleDesign = useCallback(() => {
    setDesign(design === "liquid-glass" ? "classic" : "liquid-glass");
  }, [design, setDesign]);

  const value = useMemo(
    () => ({
      design,
      isGameRoute: gameRoute,
      isMounted,
      setDesign,
      toggleDesign,
    }),
    [design, gameRoute, isMounted, setDesign, toggleDesign],
  );

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
}
