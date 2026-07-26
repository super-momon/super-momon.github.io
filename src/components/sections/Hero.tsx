"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { trackEvent } from "@/lib/analytics";
import { useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.6,
      delay,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  });

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 overflow-hidden"
      >
        {/* Soft bottom gradient arc */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[65vh] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 100% at 50% 100%, rgba(0, 199, 88, 0.10), transparent 70%)",
          }}
        />

        {/* Lightweight 3D backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: shouldReduceMotion ? 0.5 : 0.8 }}
        >
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>

        {/* Atmospheric noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise mix-blend-overlay"
        />

        {/* Centered content wrapper */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center my-auto">
          {/* Availability badge */}
          <m.div
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full 
                       bg-surface/70 backdrop-blur-md border border-border/60 shadow-xs"
            {...fadeUp(0.1)}
          >
            <m.span
              className="w-1.5 h-1.5 rounded-full bg-accent"
              animate={
                shouldReduceMotion
                  ? {}
                  : { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs font-medium text-foreground/70 tracking-wide">
              Available for Work
            </span>
          </m.div>

          {/* Main headline */}
          <m.h1
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
              const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
              e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
            }}
            className="text-[clamp(2.75rem,8vw,5rem)] font-bold leading-[1.08] tracking-tight mb-6 text-center transition-transform duration-200 ease-out cursor-default select-none"
            {...fadeUp(0.2)}
          >
            Mark Raymond{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--color-accent), #34d399)",
              }}
            >
              Ayade
            </span>
          </m.h1>

          {/* Subheadline */}
          <m.p
            className="text-lg md:text-xl text-muted font-light leading-relaxed max-w-2xl mb-8 text-center text-balance"
            {...fadeUp(0.35)}
          >
            Full Stack Developer with 4+ years of experience crafting scalable web applications and high-performance backends, proficient in AI-assisted development.
          </m.p>

          {/* Primary CTAs */}
          <m.div
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
            {...fadeUp(0.5)}
          >
            <a
              href="#projects"
              className="group relative px-7 py-3 rounded-full bg-accent text-white font-semibold text-sm
                         overflow-hidden transition-all duration-300 ease-out
                         hover:shadow-[0_0_30px_rgba(0,199,88,0.35)] hover:-translate-y-0.5
                         active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span className="relative z-10">View Projects</span>
              <m.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </a>

            <a
              href="#contact"
              className="px-7 py-3 rounded-full border border-border text-foreground font-semibold text-sm
                         transition-all duration-300 ease-out bg-surface/70 backdrop-blur-md
                         hover:border-accent hover:bg-surface/90 hover:-translate-y-0.5
                         active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Let&apos;s Talk
            </a>
          </m.div>

          {/* Highlights Ribbon */}
          <m.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-6 px-4 py-2.5 rounded-2xl
                       bg-surface/60 backdrop-blur-md border border-border/50 text-xs font-mono text-foreground/80 shadow-xs"
            {...fadeUp(0.55)}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span><strong className="text-foreground font-semibold">4+</strong> Years Exp</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span><strong className="text-foreground font-semibold">Full Stack</strong> .NET & React</span>
            </div>
            <span className="hidden sm:inline text-border">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span><strong className="text-foreground font-semibold">AWS & Cloud</strong> Integration</span>
            </div>
          </m.div>

          {/* Resume link */}
          <m.div {...fadeUp(0.65)}>
            <a
              href="/resume.pdf"
              download="Mark_Raymond_Ayade_Resume.pdf"
              data-analytics-skip-auto
              onClick={() => trackEvent("resume_download", { method: "hero_link" })}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors
                         focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg px-3 py-1.5"
            >
              <FontAwesomeIcon icon={faDownload} className="text-xs" />
              Download Resume
            </a>
          </m.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <m.div
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
          {...fadeUp(0.75)}
        >
          <m.a
            href="#about"
            aria-label="Scroll to About section"
            className="group flex flex-col items-center gap-2 text-muted/60 hover:text-accent transition-all duration-300
                       focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-full p-2"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-muted/50 group-hover:text-accent transition-colors">
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border-2 border-border/80 group-hover:border-accent/60 transition-colors flex justify-center p-1 bg-surface/30 backdrop-blur-xs shadow-xs">
              <m.div
                className="w-1 h-2 rounded-full bg-accent"
                animate={shouldReduceMotion ? {} : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <FontAwesomeIcon icon={faArrowDown} className="text-[10px] text-muted/40 group-hover:text-accent group-hover:translate-y-0.5 transition-all" />
          </m.a>
        </m.div>
      </section>
    </LazyMotion>
  );
}

