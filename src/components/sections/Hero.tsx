"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { FadeIn } from "@/components/FadeIn";
import { HighlightText } from "@/components/HighlightText";

export default function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16"
      >
        {/* Radial gradient background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 75% 15%, rgba(99,102,241,0.22) 0%, transparent 80%), " +
              "radial-gradient(ellipse 55% 45% at 20% 80%, rgba(110,192,56,0.17) 0%, transparent 75%), " +
              "radial-gradient(ellipse 40% 35% at 50% 50%, rgba(129,140,248,0.13) 0%, transparent 70%)",
          }}
        />
        <FadeIn delay={0.1}>
          <p className="text-sm font-mono text-[var(--color-accent)] mb-4 tracking-widest uppercase">
            Hello, I&apos;m
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl sm:text-7xl font-bold text-[var(--color-foreground)] mb-4 leading-tight">
            <HighlightText className="text-5xl sm:text-7xl px-2">Ayade</HighlightText> Mark Raymond M.
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg text-[var(--color-muted)] mb-8 max-w-3xl">
            Full Stack Developer | AI-Assisted Development |{" "}
            <m.span
              className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-highlight-01)] bg-[var(--color-highlight-01)]/10 rounded-full px-2.5 py-0.5"
              animate={{ opacity: [1, 0.45, 1, 0.7, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <m.span
                className="w-2 h-2 rounded-full bg-[var(--color-highlight-01)] inline-block shrink-0"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              Open to Opportunities
            </m.span>
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface)] font-medium transition-colors"
            >
              Contact Me
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] font-medium transition-colors"
            >
              Resume ↓
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} className="mt-16">
          <a
            href="#about"
            aria-label="Scroll down"
            className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors animate-bounce inline-block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
        </FadeIn>
      </section>
    </LazyMotion>
  );
}
