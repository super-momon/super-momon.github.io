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
        className="flex h-11 min-w-[7.75rem] items-center justify-end gap-2"
      >
        <span className="h-3 w-16 rounded bg-[var(--color-foreground)]/10" />
        <span className="block h-6 w-11 rounded-full bg-[var(--color-surface)]" />
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
      className="relative flex min-h-11 items-center justify-end gap-2 rounded-xl px-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span className="text-xs font-semibold text-[var(--color-foreground)]">
        {currentDesignLabel}
      </span>
      <span
        aria-hidden="true"
        className={`relative block h-6 w-11 rounded-full border transition-colors duration-300 ${
          isLiquidGlass
            ? "border-accent/70 bg-accent"
            : "border-[var(--color-border)] bg-[var(--color-surface)]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[16px] w-[16px] rounded-full border shadow-sm transition-[left,background-color,border-color] duration-300 ${
            isLiquidGlass
              ? "left-[25px] border-accent-contrast/30 bg-accent-contrast"
              : "left-[3px] border-[var(--color-border)] bg-[var(--color-foreground)]"
          }`}
        />
      </span>
    </button>
  );
}
