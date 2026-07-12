"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { trackEvent } from "@/lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry, faBriefcase } from "@fortawesome/free-solid-svg-icons";

const experiences = [
  {
    role: "Full Stack Software Developer",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Feb 2025 — Present",
    description: [
      "Implemented event-driven backend solutions using AWS services including Lambda, SQS, SNS, and S3 to support scalable and reliable application workflows.",
      "Developed and enhanced application features across multiple client-facing and internal services, improving maintainability and operational efficiency.",
      "Contributed to modernization initiatives including UI redesigns and usability improvements for multiple client-facing applications.",
      "Diagnosed and resolved complex software and data-related issues affecting production workflows and internal applications.",
      "Optimized application data flow and database operations using MS SQL Server, PostgreSQL, and MongoDB.",
      "Worked across multiple services and applications utilizing different technology stacks and architectures.",
    ],
    tags: ["AWS", "Lambda", "SQS", "SNS", "S3", "MS SQL Server", "PostgreSQL", "MongoDB", "Event-Driven Architecture"],
    current: true,
    industry: "Human Capital Management - Recruitment Software",
  },
  {
    role: "Software Developer (Mid-Level)",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Mar 2024 — Jan 2025",
    description: [
      "Developed and maintained web application features with third-party system integrations.",
      "Implemented secure client profile management workflows supporting data retrieval, updates, and access control.",
      "Optimized data retrieval and reporting processes for improved performance and accuracy.",
      "Configured and maintained data integrations from multiple sources including XML, RSS, and API feeds.",
      "Investigated and resolved data issues using SQL and scripting.",
    ],
    tags: ["Web Development", "API Integration", "SQL", "Data Management", "Security", "XML", "RSS"],
    current: false,
    industry: "Human Capital Management - Recruitment Software",
  },
  {
    role: "Software Developer (Junior)",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Jul 2022 — Feb 2024",
    description: [
      "Developed and maintained web application features with third-party system integrations into company platforms and internal tools.",
      "Configured data integrations from multiple sources and investigated data issues using SQL and scripting for reporting and operational support.",
      "Contributed to client profile management workflows and data retrieval processes.",
    ],
    tags: ["JavaScript", "SQL", "API Integration", "Web Development", "Data Integration"],
    current: false,
    industry: "Human Capital Management - Recruitment Software",
  },
];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const active = experiences[activeIndex];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-28 px-6 bg-surface overflow-hidden"
    >
      {/* Ambient orbs */}
      <motion.div
        style={skipParallax ? undefined : { y: orb1Y }}
        className="absolute top-1/4 right-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />
      <motion.div
        style={skipParallax ? undefined : { y: orb2Y }}
        className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-block mb-3 text-xs font-mono font-semibold tracking-[0.18em] uppercase text-accent"
          >
            Career History
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4 text-balance"
          >
            Professional{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 pr-2 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Journey
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="text-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Chronicling my evolution in software development — from foundational work to architecting scalable solutions.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="w-14 h-px mx-auto mt-6 bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Split layout: role selector + detail panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Column: Selector */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">

            {/* Career Hub Header Card */}
            <div className="relative p-5 rounded-3xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30 flex flex-col gap-4 items-center text-center">
              <div className="relative w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faIndustry} className="text-accent text-2xl" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground tracking-tight">Career Hub</h3>
                <p className="text-xs text-foreground/75 font-mono font-medium tracking-wide">Professional Journey</p>
              </div>
            </div>

            {/* Interactive Tabs list */}
            <div className="flex flex-col gap-2 p-2 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30">

              {/* Mobile tabs row */}
              <div
                style={{ scrollbarWidth: "none" }}
                className="flex flex-row lg:hidden gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
              >
                {experiences.map((exp, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveIndex(i);
                        trackEvent("portfolio_experience_change", { role: exp.role, index: i, device: "mobile" });
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border cursor-pointer whitespace-nowrap ${isActive
                          ? "bg-background/85 shadow-xs border-border/50 text-accent font-bold"
                          : "bg-transparent border-transparent text-foreground/75 hover:text-foreground hover:bg-background/20"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-accent" : "bg-foreground/40"}`} />
                      <span className="text-[10px] font-semibold tracking-tight">{exp.role.split(" ").slice(0, 2).join(" ")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop vertical tabs */}
              <div className="hidden lg:flex flex-col gap-1.5">
                {experiences.map((exp, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveIndex(i);
                        trackEvent("portfolio_experience_change", { role: exp.role, index: i, device: "desktop" });
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
                          icon={faBriefcase}
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
                          {exp.role}
                        </span>
                        <span className="text-[10px] text-foreground/60 font-normal leading-normal mt-0.5 max-w-[200px] truncate group-hover:text-foreground/85 transition-colors duration-300">
                          {exp.period}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detail Panel */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div className="relative min-h-[320px] h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 rounded-2xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/35 h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-foreground tracking-tight">
                            {active.role}
                          </h3>
                          {active.current && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-accent text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-accent text-sm font-semibold mb-1.5">{active.company}</p>
                        <p className="text-xs text-foreground/75 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faIndustry} className="text-accent text-[10px]" />
                          {active.industry}
                        </p>
                      </div>

                      <span className="shrink-0 self-start text-xs font-mono text-foreground/80 border border-border/80 rounded-lg px-3 py-1.5 bg-surface/90 shadow-xs">
                        {active.period}
                      </span>
                    </div>

                    <div className="h-px bg-border/60 mb-4" />

                    <ul className="space-y-2.5 mb-5">
                      {active.description.map((point, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/30">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-background border border-border/80 text-foreground/80"
                      >
                        {tag}
                      </span>
                    ))}
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
