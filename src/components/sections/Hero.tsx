"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { FadeIn } from "@/components/FadeIn";
import { HighlightText } from "@/components/common/HighlightText";
import { trackEvent } from "@/lib/analytics";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function Hero() {
  const [charAnimations, setCharAnimations] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Trigger character animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setCharAnimations(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const name = "Mark Raymond M.";
  const title = "Full Stack Developer";

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden"
      >
        {/* Subtle, elegant static gradient background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `
              radial-gradient(circle at 15% 50%, rgba(0, 199, 88, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* Atmospheric noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />

        <div className="relative z-10 max-w-5xl">
          <FadeIn delay={0.1}>
            <m.div
              className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full 
                         bg-surface/90 md:bg-surface/40 md:backdrop-blur-md border border-white/10 shadow-xl shadow-black/5"
            >
              <m.span
                className="w-2 h-2 rounded-full bg-highlight-01 shadow-[0_0_10px_rgba(110,192,56,0.8)]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-xs md:text-sm font-mono font-semibold text-foreground/80 tracking-wider uppercase">
                Available for Work
              </span>
            </m.div>
          </FadeIn>

          {/* Main heading with character-by-character reveal */}
          <div className="mb-3">
            <m.h1
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-none tracking-tight mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block">
                <HighlightText className="text-[clamp(2.5rem,8vw,5.5rem)] px-3 md:px-4">
                  Ayade
                </HighlightText>
              </span>
            </m.h1>

            <div className="text-[clamp(1.75rem,5vw,3.5rem)] font-bold text-foreground/90 tracking-tight">
              {charAnimations &&
                name.split("").map((char, i) => (
                  <m.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.03,
                      duration: 0.3,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    style={{ display: char === " " ? "inline" : "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </m.span>
                ))}
            </div>
          </div>

          {/* Animated role with split reveal */}
          <FadeIn delay={0.8}>
            <div className="mb-10">
              <div className="flex items-center justify-center gap-3 flex-wrap text-lg md:text-xl text-muted font-light">
                {title.split(" ").map((word, i) => (
                  <m.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.2 + i * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    {word}
                  </m.span>
                ))}
                <m.span
                  className="text-accent/60 mx-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.4 }}
                >
                  •
                </m.span>
                <m.span
                  className="text-accent font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.5, ease: "easeOut" }}
                >
                  AI Assisted Development
                </m.span>
              </div>
            </div>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={1}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              <a
                href="#projects"
                className="group relative px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm
                           overflow-hidden transition-all duration-300 ease-out
                           hover:shadow-[0_0_30px_rgba(0,199,88,0.4)]
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
                className="group px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm
                           transition-all duration-300 ease-out bg-surface/90 md:bg-surface/30 md:backdrop-blur-md
                           hover:border-accent hover:bg-surface/60 hover:shadow-lg hover:shadow-accent/5
                           active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Let&apos;s Talk
              </a>

              <a
                href="/resume.pdf"
                download="Mark_Raymond_Ayade_Resume.pdf"
                data-analytics-skip-auto
                onClick={() => trackEvent("resume_download", { method: "hero_button" })}
                className="group px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm
                           transition-all duration-300 ease-out bg-surface/90 md:bg-surface/30 md:backdrop-blur-md
                           hover:border-accent hover:bg-surface/60 hover:shadow-lg hover:shadow-accent/5
                           active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <span className="inline-flex items-center gap-2">
                  Resume
                  <FontAwesomeIcon icon={faDownload} className="transition-transform group-hover:translate-y-0.5" />
                </span>
              </a>
            </div>
          </FadeIn>

          {/* Scroll indicator with enhanced animation */}
          <FadeIn delay={1.4}>
            <m.a
              href="#about"
              aria-label="Scroll down"
              className="inline-flex flex-col items-center gap-2 text-muted hover:text-accent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl px-2 py-1"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
              <FontAwesomeIcon icon={faArrowDown} className="text-sm" />
            </m.a>
          </FadeIn>
        </div>
      </section>
    </LazyMotion>
  );
}
