"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry } from "@fortawesome/free-solid-svg-icons";

const experiences = [
  {
    role: "Full Stack Software Developer",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Feb 2025 — Present",
    description:
      "Implemented event-driven backend solutions using AWS services including Lambda, SQS, SNS, and S3 to support scalable and reliable application workflows. Developed and enhanced application features across multiple client-facing and internal services, improving maintainability and operational efficiency. Contributed to modernization initiatives including UI redesigns and usability improvements for multiple client-facing applications. Diagnosed and resolved complex software and data-related issues affecting production workflows and internal applications. Optimized application data flow and database operations using MS SQL Server, PostgreSQL, and MongoDB. Worked across multiple services and applications utilizing different technology stacks and architectures.",
    tags: ["AWS", "Lambda", "SQS", "SNS", "S3", "MS SQL Server", "PostgreSQL", "MongoDB", "Event-Driven Architecture"],
    current: true,
    industry: "Human Capital Management - Recruitment Software",
  },
  {
    role: "Software Developer (Mid-Level)",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Mar 2024 — Jan 2025",
    description:
      "Developed and maintained web application features with third-party system integrations. Implemented secure client profile management workflows supporting data retrieval, updates, and access control. Optimized data retrieval and reporting processes for improved performance and accuracy. Configured and maintained data integrations from multiple sources including XML, RSS, and API feeds, while investigating and resolving data issues using SQL and scripting.",
    tags: ["Web Development", "API Integration", "SQL", "Data Management", "Security", "XML", "RSS"],
    current: false,
    industry: "Human Capital Management - Recruitment Software",
  },
  {
    role: "Software Developer (Junior)",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Jul 2022 — Feb 2024",
    description:
      "Developed and maintained web application features with third-party system integrations into company platforms and internal tools. Configured data integrations from multiple sources and investigated data issues using SQL and scripting for reporting and operational support. Contributed to client profile management workflows and data retrieval processes.",
    tags: ["JavaScript", "SQL", "API Integration", "Web Development", "Data Integration"],
    current: false,
    industry: "Human Capital Management - Recruitment Software",
  },
];

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

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
        style={{ y: orb1Y }}
        className="absolute top-1/4 right-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
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
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4"
          >
            Professional{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Journey
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed"
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
          className="flex flex-col lg:grid lg:grid-cols-[230px_1fr] gap-3 lg:gap-8 lg:items-start"
        >
          {/* Role selector — horizontal scroll on mobile, vertical stack on desktop */}
          <div
            style={{ scrollbarWidth: "none" }}
            className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0 lg:sticky lg:top-24 [&::-webkit-scrollbar]:hidden"
          >
            {experiences.map((exp, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="relative shrink-0 lg:shrink lg:w-full text-left px-3.5 py-3 rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
                style={{
                  borderColor: activeIndex === i ? "var(--color-accent)" : "var(--color-border)",
                }}
              >
                {/* Animated background highlight */}
                {activeIndex === i && (
                  <motion.div
                    layoutId="roleHighlight"
                    className="absolute inset-0 rounded-xl bg-accent/[0.07]"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}

                <div className="relative flex items-start gap-2.5">
                  {/* Status dot */}
                  <motion.div
                    animate={{
                      backgroundColor:
                        activeIndex === i || exp.current
                          ? "var(--color-accent)"
                          : "var(--color-border)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="mt-1.75 w-1.5 h-1.5 rounded-full shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs font-semibold leading-snug whitespace-nowrap lg:whitespace-normal transition-colors duration-200"
                      style={{
                        color:
                          activeIndex === i
                            ? "var(--color-foreground)"
                            : "var(--color-muted)",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      className="text-[11px] font-mono mt-0.5 whitespace-nowrap transition-opacity duration-200"
                      style={{
                        color: "var(--color-muted)",
                        opacity: activeIndex === i ? 0.9 : 0.5,
                      }}
                    >
                      {exp.period}
                    </p>
                  </div>

                  {exp.current && (
                    <span className="shrink-0 ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-accent text-white self-center">
                      Now
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel — fixed height prevents layout shift on tab switch */}
          <div className="relative h-110 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 rounded-2xl border border-accent/30 backdrop-blur-sm"
              >
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
                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faIndustry} className="text-accent text-[10px]" />
                      {active.industry}
                    </p>
                  </div>

                  <span className="shrink-0 self-start text-xs font-mono text-muted border border-border rounded-lg px-3 py-1.5 bg-surface/60">
                    {active.period}
                  </span>
                </div>

                <div className="h-px bg-border mb-4" />

                <p className="text-sm leading-relaxed text-muted mb-5">{active.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface border border-border text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
