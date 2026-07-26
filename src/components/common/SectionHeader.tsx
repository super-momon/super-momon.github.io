"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  titlePrefix: string;
  titleItalic: string;
  subtitle?: string;
}

export default function SectionHeader({
  eyebrow,
  titlePrefix,
  titleItalic,
  subtitle,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="text-center mb-10 md:mb-12">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="inline-block mb-2 text-xs font-mono font-semibold tracking-[0.2em] uppercase text-accent"
      >
        {eyebrow}
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3 text-balance"
      >
        {titlePrefix}{" "}
        <span
          className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover italic pr-1"
        >
          {titleItalic}
        </span>
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="text-foreground/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
