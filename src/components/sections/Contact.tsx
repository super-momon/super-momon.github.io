"use client";

import { FadeIn } from "@/components/FadeIn";
import { trackEvent } from "@/lib/analytics";
import { EMAIL, GITHUB_URL, GITHUB_USERNAME, LINKEDIN_URL, LINKEDIN_USERNAME } from "@/lib/constants";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowRight,
  faArrowUpRightFromSquare,
  faPaperPlane,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const contactMethods = [
  {
    id: "email",
    label: "Email",
    handle: EMAIL,
    description: "Drop me a line directly for projects, employment inquiries, or exploring technical collaborations.",
    href: `mailto:${EMAIL}`,
    icon: faEnvelope,
    actionText: "Send Direct Mail",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: `in/${LINKEDIN_USERNAME}`,
    description: "Connect professionally, view industry endorsements, and see my latest software engineering posts.",
    href: LINKEDIN_URL,
    icon: faLinkedin,
    actionText: "Visit LinkedIn Profile",
  },
  {
    id: "github",
    label: "GitHub",
    handle: `@${GITHUB_USERNAME}`,
    description: "Explore my code repositories, check out web templates, and see my active open-source contribution graphs.",
    href: GITHUB_URL,
    icon: faGithub,
    actionText: "Explore Repositories",
  },
];

export default function Contact() {
  const [activeMethodId, setActiveMethodId] = useState("email");
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const active = contactMethods.find((m) => m.id === activeMethodId) || contactMethods[0];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-28 px-6 bg-surface overflow-hidden"
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
        {/* Section header */}
        <div className="text-center mb-14">
          <FadeIn>
            <span className="inline-block text-xs font-mono font-semibold uppercase tracking-[0.22em] text-accent mb-3">
              Get In Touch
            </span>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4 text-balance">
              Let&apos;s Build{" "}
              <span
                className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 pr-2 inline-block"
                style={{ fontStyle: "italic" }}
              >
                Something Great
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              I&apos;m actively seeking opportunities to collaborate on ambitious projects. Whether you&apos;re building something transformative or exploring a technical challenge — I&apos;d love to hear from you.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="w-14 h-px mx-auto mt-6 bg-linear-to-r from-transparent via-accent to-transparent" />
          </FadeIn>
        </div>

        {/* Split layout: selector + details dossier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Column: Selector */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">

            {/* Communication Hub Header Card */}
            <div className="relative p-5 rounded-3xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30 flex flex-col gap-4 items-center text-center">
              <div className="relative w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faPaperPlane} className="text-accent text-2xl" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground tracking-tight">Reach Out</h3>
                <p className="text-xs text-foreground/75 font-mono font-medium tracking-wide">Communication Hub</p>
              </div>
            </div>

            {/* Interactive Tabs list */}
            <div className="flex flex-col gap-2 p-2 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30">

              {/* Mobile tabs row */}
              <div
                style={{ scrollbarWidth: "none" }}
                className="flex flex-row lg:hidden gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
              >
                {contactMethods.map((method) => {
                  const isActive = activeMethodId === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => {
                        setActiveMethodId(method.id);
                        trackEvent("portfolio_contact_method_select", { method: method.id, device: "mobile" });
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border cursor-pointer whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${isActive
                          ? "bg-background/85 shadow-xs border-border/50 text-accent font-bold"
                          : "bg-transparent border-transparent text-foreground/75 hover:text-foreground hover:bg-background/20"
                        }`}
                    >
                      <FontAwesomeIcon icon={method.icon} className={`text-xs ${isActive ? "text-accent" : "text-foreground/50"}`} />
                      <span className="text-[10px] font-semibold tracking-tight">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop vertical tabs */}
              <div className="hidden lg:flex flex-col gap-1.5">
                {contactMethods.map((method) => {
                  const isActive = activeMethodId === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => {
                        setActiveMethodId(method.id);
                        trackEvent("portfolio_contact_method_select", { method: method.id, device: "desktop" });
                      }}
                      className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-left cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${isActive
                          ? "bg-background/80 shadow-xs border border-border/50"
                          : "hover:bg-background/30 border border-transparent"
                        }`}
                    >
                      {/* Active Indicator on Left */}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-full transition-all duration-350 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                          }`}
                      />

                      {/* Icon block */}
                      <span
                        className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${isActive
                            ? "bg-accent/15 text-accent shadow-xs"
                            : "bg-background/80 text-foreground/60 group-hover:bg-accent/10 group-hover:text-accent"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={method.icon}
                          className="text-xs transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </span>

                      {/* Text Content */}
                      <div className="flex flex-col text-left min-w-0">
                        <span
                          className={`text-xs font-semibold leading-tight transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                            }`}
                        >
                          {method.label}
                        </span>
                        <span className="text-[10px] text-foreground/60 font-normal leading-normal mt-0.5 max-w-[200px] truncate group-hover:text-foreground/85 transition-colors duration-300">
                          {method.handle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability status badge */}
            <div className="hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-border/80 dark:border-border/60 bg-surface/95 dark:bg-surface/40 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <span className="text-xs font-bold text-foreground/80 tracking-wide">
                Currently Open to Opportunities
              </span>
            </div>
          </div>

          {/* Right Column: Contact Dossier Card */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div className="relative min-h-[360px] h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMethodId}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 md:p-8 rounded-2xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/35 h-full flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pb-4 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                          <FontAwesomeIcon icon={active.icon} className="text-accent text-lg" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground tracking-tight">
                            {active.label} Connection
                          </h3>
                          <p className="text-xs text-foreground/60 font-mono mt-0.5">{active.handle}</p>
                        </div>
                      </div>

                      {active.id === "email" && (
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                          </span>
                          <span className="text-[10px] font-bold text-foreground/80 tracking-wide uppercase">
                            Direct Channel
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details Description */}
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/60 mb-2 uppercase tracking-widest">
                        Channel Details
                      </h4>
                      <p className="text-sm text-foreground/85 leading-relaxed font-normal">
                        {active.description}
                      </p>
                    </div>

                    {/* Highlight Box / Address Copy */}
                    <div className="p-4 rounded-xl bg-background/50 border border-border/80 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">
                          Address / Link Handle
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate font-mono select-all">
                          {active.handle}
                        </p>
                      </div>

                      {active.id === "email" && (
                        <button
                          onClick={handleCopyEmail}
                          className="shrink-0 p-2.5 rounded-lg border border-border/80 bg-surface/90 hover:border-accent hover:bg-accent/5 text-foreground/80 hover:text-accent transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                          <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-xs" />
                          <span>{copied ? "Copied" : "Copy Address"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-6 mt-6 border-t border-border/30 flex flex-wrap items-center gap-3 justify-between">
                    <a
                      href={active.href}
                      target={active.id === "email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      data-analytics-skip-auto
                      onClick={() =>
                        trackEvent("social_link_click", {
                          event_category: "contact",
                          event_label: active.label.toLowerCase(),
                        })
                      }
                      className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <span>{active.actionText}</span>
                      <FontAwesomeIcon
                        icon={active.id === "email" ? faArrowRight : faArrowUpRightFromSquare}
                        className="text-xs transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      />
                    </a>

                    <span className="text-[11px] text-foreground/60 font-medium">
                      Typically responds within 24 hours
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
