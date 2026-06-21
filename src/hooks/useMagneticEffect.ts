"use client";

import { useRef, useEffect } from "react";

/**
 * Creates a magnetic hover effect on a button element.
 * The button follows the cursor within its boundaries for a premium micro-interaction.
 *
 * @param strength - Multiplier for magnetic pull intensity (default: 0.4)
 * @returns Ref to attach to the target button element
 */
export function useMagneticEffect(strength = 0.4) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      button.style.transform = "translate(0, 0) scale(1)";
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
