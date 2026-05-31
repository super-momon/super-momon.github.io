"use client";

import { FadeIn } from "@/components/FadeIn";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16"
    >
      <FadeIn delay={0.1}>
        <p className="text-sm font-mono text-[var(--color-accent)] mb-4 tracking-widest uppercase">
          Hello, I&apos;m
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <h1 className="text-5xl sm:text-7xl font-bold text-[var(--color-foreground)] mb-4 leading-tight">
          Your Name
        </h1>
      </FadeIn>

      <FadeIn delay={0.3}>
        <p className="text-xl sm:text-2xl text-[var(--color-muted)] mb-8 max-w-2xl">
          Full-Stack Developer &amp; UI Engineer building fast, accessible, and
          beautiful web experiences.
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
  );
}
