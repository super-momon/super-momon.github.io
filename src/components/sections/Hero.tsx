"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [canvasAllowed, setCanvasAllowed] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const canvasMedia = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const updateCanvasAvailability = () => setCanvasAllowed(canvasMedia.matches);
    const frame = window.requestAnimationFrame(updateCanvasAvailability);

    canvasMedia.addEventListener("change", updateCanvasAvailability);
    return () => {
      window.cancelAnimationFrame(frame);
      canvasMedia.removeEventListener("change", updateCanvasAvailability);
    };
  }, []);

  useEffect(() => {
    if (!canvasAllowed || shouldReduceMotion) return;

    const timer = window.setTimeout(() => setCanvasReady(true), 700);
    return () => window.clearTimeout(timer);
  }, [canvasAllowed, shouldReduceMotion]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.6,
      delay: shouldReduceMotion ? 0 : delay,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  });

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        id="hero"
        className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-6 pt-16 pb-32 text-left sm:px-8 lg:px-12"
      >
        {/* Soft bottom gradient arc */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[65vh] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 100% at 50% 100%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 70%)",
          }}
        />

        {/* Lightweight 3D backdrop */}
        {canvasAllowed && canvasReady && !shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
          >
            <Suspense fallback={null}>
              <HeroCanvas reducedMotion={shouldReduceMotion} />
            </Suspense>
          </div>
        )}

        {/* Atmospheric noise texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise mix-blend-overlay"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:gap-20">
          <m.div className="flex flex-col items-start" {...fadeUp(0.1)}>
            <m.h1
              onMouseMove={shouldReduceMotion ? undefined : (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
              }}
              onMouseLeave={shouldReduceMotion ? undefined : (e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
              }}
              className="mb-6 max-w-4xl cursor-default select-none text-balance text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[1.08] tracking-tight transition-transform duration-200 ease-out"
            >
              Mark Raymond <span className="text-accent">Ayade</span>
            </m.h1>

            <p className="mb-8 max-w-2xl text-lg font-light leading-relaxed text-muted md:text-xl">
              Full Stack Developer with 4+ years of experience crafting scalable web applications and high-performance backends, proficient in AI-assisted development.
            </p>

            <div className="flex flex-wrap items-center justify-start gap-3">
              <a
                href="#projects"
                className="group relative overflow-hidden rounded-full bg-accent px-7 py-3 text-sm font-semibold text-[var(--color-accent-contrast)]
                           transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(8,202,95,0.22)]
                           active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <span className="relative z-10">View Projects</span>
                <m.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={shouldReduceMotion ? undefined : { x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </a>

              <a
                href="#contact"
                className="rounded-full border border-border bg-surface/70 px-7 py-3 text-sm font-semibold text-foreground backdrop-blur-md
                           transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:bg-surface/90
                           active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Let&apos;s Talk
              </a>
            </div>
          </m.div>

          <m.aside
            aria-label="Availability and experience highlights"
            className="w-full max-w-xl lg:justify-self-end"
            {...fadeUp(0.25)}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-3.5 py-1.5 shadow-xs backdrop-blur-md">
              <m.span
                className="h-1.5 w-1.5 rounded-full bg-accent"
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
              <span className="text-xs font-medium tracking-wide text-foreground/70">
                Available for Work
              </span>
            </div>

            <ul className="my-7 divide-y divide-border/60 border-y border-border/60 text-base text-foreground/80 sm:text-lg">
              <li className="py-4">
                <strong className="font-semibold text-foreground">4+</strong>{" "}Years Exp
              </li>
              <li className="py-4">
                <strong className="font-semibold text-foreground">Full Stack</strong>{" "}.NET &amp; React
              </li>
              <li className="py-4">
                <strong className="font-semibold text-foreground">AWS &amp; Cloud</strong>{" "}Integration
              </li>
            </ul>

            <a
              href="/resume.pdf"
              download="Mark_Raymond_Ayade_Resume.pdf"
              data-analytics-skip-auto
              onClick={() => trackEvent("resume_download", { method: "hero_link" })}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:text-accent
                         focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <FontAwesomeIcon icon={faDownload} className="text-xs" />
              Download Resume
            </a>
          </m.aside>
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/60 transition-colors group-hover:text-accent">
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
            <FontAwesomeIcon icon={faArrowDown} className="text-xs text-muted/50 group-hover:text-accent group-hover:translate-y-0.5 transition-all" />
          </m.a>
        </m.div>
      </section>
    </LazyMotion>
  );
}
