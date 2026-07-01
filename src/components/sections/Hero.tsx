"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { FadeIn } from "@/components/FadeIn";
import { HighlightText } from "@/components/common/HighlightText";
import { trackEvent } from "@/lib/analytics";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [charAnimations, setCharAnimations] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const ctaRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // Morphing gradient that follows cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Magnetic button effect
  useEffect(() => {
    const handleButtonMouseMove = (e: MouseEvent) => {
      if (!isHovering || !ctaRefs.current[isHovering]) return;

      const button = ctaRefs.current[isHovering];
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 80;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        button.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
      }
    };

    if (isHovering) {
      window.addEventListener("mousemove", handleButtonMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleButtonMouseMove);
  }, [isHovering]);

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
        {/* Morphing gradient blob - follows cursor */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-all duration-[800ms] ease-out opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 800px 600px at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(0,199,88,0.25) 0%, 
                transparent 50%),
              radial-gradient(ellipse 600px 500px at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
                rgba(99,102,241,0.20) 0%, 
                transparent 55%),
              radial-gradient(ellipse 500px 400px at 50% 50%, 
                rgba(110,192,56,0.12) 0%, 
                transparent 60%)
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
                         bg-surface/50 backdrop-blur-sm border border-border/50"
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
              className="text-[clamp(2rem,7vw,4rem)] font-bold leading-none tracking-tight mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block">
                <HighlightText className="text-[clamp(2rem,7vw,4rem)] px-3 md:px-4">
                  Ayade
                </HighlightText>
              </span>
            </m.h1>

            <div className="text-[clamp(1.2rem,3.5vw,2rem)] font-bold text-foreground/90 tracking-tight">
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                  className="text-accent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.4 }}
                >
                  •
                </m.span>
                <m.span
                  className="text-accent font-medium"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  AI-Assisted Development
                </m.span>
              </div>
            </div>
          </FadeIn>

          {/* Magnetic CTAs */}
          <FadeIn delay={1}>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <a
                ref={(el) => {
                  ctaRefs.current["projects"] = el;
                }}
                href="#projects"
                onMouseEnter={() => setIsHovering("projects")}
                onMouseLeave={() => {
                  setIsHovering(null);
                  if (ctaRefs.current["projects"]) {
                    ctaRefs.current["projects"].style.transform = "translate(0, 0)";
                  }
                }}
                className="group relative px-8 py-4 rounded-2xl bg-accent text-white font-semibold text-base
                           overflow-hidden transition-all duration-300 ease-out
                           hover:shadow-[0_0_40px_rgba(0,199,88,0.5)]
                           active:scale-95"
                style={{
                  transition: "transform 0.2s ease-out, box-shadow 0.3s",
                }}
              >
                <span className="relative z-10">View Projects</span>
                <m.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </a>

              <a
                ref={(el) => {
                  ctaRefs.current["contact"] = el;
                }}
                href="#contact"
                onMouseEnter={() => setIsHovering("contact")}
                onMouseLeave={() => {
                  setIsHovering(null);
                  if (ctaRefs.current["contact"]) {
                    ctaRefs.current["contact"].style.transform = "translate(0, 0)";
                  }
                }}
                className="group px-8 py-4 rounded-2xl border-2 border-border text-foreground font-semibold text-base
                           transition-all duration-300 ease-out backdrop-blur-sm
                           hover:border-accent hover:bg-surface/50 hover:shadow-lg
                           active:scale-95"
                style={{
                  transition: "transform 0.2s ease-out, border-color 0.3s, background-color 0.3s",
                }}
              >
                <span className="relative z-10">Let&apos;s Talk</span>
              </a>

              <a
                ref={(el) => {
                  ctaRefs.current["resume"] = el;
                }}
                href="/resume.pdf"
                download="Mark_Raymond_Ayade_Resume.pdf"
                onClick={() => trackEvent("resume_download", { method: "hero_button" })}
                onMouseEnter={() => setIsHovering("resume")}
                onMouseLeave={() => {
                  setIsHovering(null);
                  if (ctaRefs.current["resume"]) {
                    ctaRefs.current["resume"].style.transform = "translate(0, 0)";
                  }
                }}
                className="group px-8 py-4 rounded-2xl border-2 border-border text-foreground font-semibold text-base
                           transition-all duration-300 ease-out backdrop-blur-sm
                           hover:border-accent hover:bg-surface/50 hover:shadow-lg
                           active:scale-95"
                style={{
                  transition: "transform 0.2s ease-out, border-color 0.3s, background-color 0.3s",
                }}
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Resume
                  <FontAwesomeIcon icon={faArrowDown} className="transition-transform group-hover:translate-y-1" />
                </span>
              </a>
            </div>
          </FadeIn>

          {/* Scroll indicator with enhanced animation */}
          <FadeIn delay={1.4}>
            <m.a
              href="#about"
              aria-label="Scroll down"
              className="inline-flex flex-col items-center gap-2 text-muted hover:text-accent transition-colors"
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
              <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
            </m.a>
          </FadeIn>
        </div>
      </section>
    </LazyMotion>
  );
}
