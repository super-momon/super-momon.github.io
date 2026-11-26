"use client";

import { usePathname } from "next/navigation";
import { isGameRoute } from "@/lib/designSystem";
import { useDesign } from "@/components/DesignProvider";

export default function DesignToggle() {
  const pathname = usePathname();
  const { design, isMounted, toggleDesign } = useDesign();

  if (isGameRoute(pathname)) return null;
  if (!isMounted) {
    return (
      <span
        aria-hidden="true"
        className="flex h-11 shrink-0 items-center justify-end gap-2.5 px-2.5"
      >
        <span className="h-3 w-[4.5rem] rounded bg-[var(--color-foreground)]/10" />
        <span className="block h-7 w-12 rounded-full bg-[var(--color-surface)]" />
      </span>
    );
  }

  const isLiquidGlass = design === "liquid-glass";
  const nextDesign = isLiquidGlass ? "classic" : "liquid-glass";
  const currentDesignLabel = isLiquidGlass ? "Liquid Glass" : "Classic";
  const label =
    nextDesign === "liquid-glass"
      ? "Switch to Liquid Glass design"
      : "Switch to classic design";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLiquidGlass}
      onClick={toggleDesign}
      aria-label={`${currentDesignLabel} design selected. ${label}`}
      title={label}
      className="relative flex min-h-11 shrink-0 items-center justify-end gap-2.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span className="text-xs font-semibold text-[var(--color-foreground)]">
        {currentDesignLabel}
      </span>
      <span
        aria-hidden="true"
        className={`relative block h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 ${
          isLiquidGlass
            ? "border-accent/70 bg-accent"
            : "border-[var(--color-border)] bg-[var(--color-surface)]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full border shadow-sm transition-[transform,background-color,border-color] duration-300 ${
            isLiquidGlass
              ? "translate-x-5 border-accent-contrast/30 bg-accent-contrast"
              : "translate-x-0 border-[var(--color-border)] bg-[var(--color-foreground)]"
          }`}
        />
      </span>
    </button>
  );
}
