"use client";

import { FadeIn } from "@/components/FadeIn";
import { trackEvent } from "@/lib/analytics";
import { EMAIL, GITHUB_URL, GITHUB_USERNAME, LINKEDIN_URL, LINKEDIN_USERNAME } from "@/lib/constants";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowRight, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const contactMethods = [
  {
    label: "GitHub",
    handle: `@${GITHUB_USERNAME}`,
    description: "See my open source work",
    href: GITHUB_URL,
    icon: faGithub,
  },
  {
    label: "LinkedIn",
    handle: `in/${LINKEDIN_USERNAME}`,
    description: "Connect professionally",
    href: LINKEDIN_URL,
    icon: faLinkedin,
  },
  {
    label: "Email",
    handle: EMAIL,
    description: "Drop me a line directly",
    href: `mailto:${EMAIL}`,
    icon: faEnvelope,
  },
];

export default function Contact() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const skipParallax = isMobile || !!prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ctaRef.current || !isHovering) return;

      const rect = ctaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 150;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        setMousePosition({
          x: x * strength * 0.3,
          y: y * strength * 0.3,
        });
      }
    };

    if (isHovering) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 px-6 bg-surface overflow-hidden"
    >
      {/* Ambient orbs */}
      <motion.div
        style={skipParallax ? undefined : { y: orb1Y }}
        className="absolute top-1/4 left-[5%] w-48 h-48 md:w-96 md:h-96 rounded-full bg-accent/6 blur-xl md:blur-3xl pointer-events-none will-change-transform"
      />
      <motion.div
        style={skipParallax ? undefined : { y: orb2Y }}
        className="absolute bottom-1/4 right-[5%] w-48 h-48 md:w-96 md:h-96 rounded-full bg-accent/6 blur-xl md:blur-3xl pointer-events-none will-change-transform"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow — bottom center */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-225 h-100 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent)",
        }}
      />

      {/* Ambient glow — top right */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-125 h-125 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 100% 0%, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Eyebrow label */}
        <FadeIn>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-10">
            Get In Touch
          </span>
        </FadeIn>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left col: headline + copy + CTA ── */}
          <div>
            <FadeIn delay={0.05}>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-foreground leading-tight tracking-tight mb-6">
                Let&apos;s Build
                <br />
                <span
                  className="text-accent"
                  style={{
                    textShadow: "0 0 60px color-mix(in srgb, var(--color-accent) 35%, transparent)",
                  }}
                >
                  Something Great
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-[1.05rem] leading-relaxed text-muted mb-10 max-w-md font-light">
                I&apos;m actively seeking opportunities to collaborate on ambitious
                projects. Whether you&apos;re building something transformative or
                exploring a technical challenge —{" "}
                <span className="text-foreground font-medium">
                  I&apos;d love to hear from you
                </span>
                .
              </p>
            </FadeIn>

            {/* Availability badge */}
            <FadeIn delay={0.15}>
              <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border border-border bg-surface">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span className="text-xs font-semibold text-muted tracking-wide">
                  Open to opportunities
                </span>
              </div>
            </FadeIn>

            {/* Magnetic CTA */}
            <FadeIn delay={0.2}>
              <a
                ref={ctaRef}
                href={`mailto:${EMAIL}`}
                onClick={() =>
                  trackEvent("cta_click", {
                    event_category: "contact",
                    event_label: "send_message",
                  })
                }
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setMousePosition({ x: 0, y: 0 });
                }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-base overflow-hidden active:scale-95"
                style={{
                  transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                  transition: isHovering
                    ? "transform 0.2s ease-out, box-shadow 0.3s"
                    : "all 0.5s ease-out",
                  boxShadow: isHovering ? "0 0 40px color-mix(in srgb, var(--color-accent) 40%, transparent)" : undefined,
                }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">Start a Conversation</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </FadeIn>
          </div>

          {/* ── Right col: contact method cards ── */}
          <div className="flex flex-col gap-3">
            {contactMethods.map((method, index) => (
              <FadeIn key={method.label} delay={0.1 + index * 0.09} direction="left">
                <a
                  href={method.href}
                  target={method.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("social_link_click", {
                      event_category: "contact",
                      event_label: method.label.toLowerCase(),
                    })
                  }
                  className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:border-accent"
                  style={{
                    boxShadow: undefined,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 8px 32px color-mix(in srgb, var(--color-accent) 12%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                  }}
                >
                  {/* Radial inner glow on hover */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 100% at 0% 50%, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent)",
                    }}
                  />

                  {/* Icon box */}
                  <div className="relative z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-background border border-border group-hover:border-accent group-hover:bg-accent transition-all duration-300 shrink-0">
                    <FontAwesomeIcon
                      icon={method.icon}
                      className="text-lg text-muted group-hover:text-white transition-colors duration-300"
                    />
                  </div>

                  {/* Text */}
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted mb-0.5">
                      {method.label}
                    </p>
                    <p className="text-sm font-medium text-foreground truncate leading-tight">
                      {method.handle}
                    </p>
                    <p className="text-xs text-muted mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {method.description}
                    </p>
                  </div>

                  {/* External link arrow */}
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="relative z-10 text-xs text-muted group-hover:text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0"
                  />
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
