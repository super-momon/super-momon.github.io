"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry } from "@fortawesome/free-solid-svg-icons";

const experiences = [
  {
    role: "Full Stack Software Developer",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Feb 2025 — Present",
    description:
      "Architecting event-driven backend solutions using AWS services (Lambda, SQS, SNS, S3) to support scalable application workflows. Developing and enhancing features across client-facing and internal services while contributing to UI modernization initiatives. Diagnosing complex production issues and optimizing database operations across MS SQL Server, PostgreSQL, and MongoDB, working with diverse technology stacks and architectures.",
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

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="sm:pl-16 relative"
    >
      {/* Timeline dot */}
      <div className="hidden sm:block absolute top-3" style={{ left: "7px" }}>
        <motion.div
          animate={{ scale: exp.current || isHovered ? 1.3 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-5 h-5 rounded-full bg-accent flex items-center justify-center"
        >
          <motion.div
            animate={{ opacity: exp.current || isHovered ? 0.6 : 0.2 }}
            transition={{ duration: 0.3 }}
            className="absolute w-5 h-5 rounded-full bg-accent blur-md"
            style={{ transform: "scale(1.6)" }}
          />
          <div className="relative w-2 h-2 rounded-full bg-white" />
        </motion.div>
      </div>

      {/* Card */}
      <div
        className="p-7 rounded-2xl border backdrop-blur-sm"
        style={{
          borderColor: exp.current || isHovered ? "var(--color-accent)" : "var(--color-border)",
          transition: "border-color 0.3s ease",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1.5">
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {exp.role}
              </h3>
              {exp.current && (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-accent text-white">
                  Active
                </span>
              )}
            </div>
            <p className="text-accent text-base font-semibold mb-2">{exp.company}</p>
            <p className="text-sm text-muted flex items-center gap-2">
              <FontAwesomeIcon icon={faIndustry} className="text-accent text-xs" />
              <span className="font-medium">Industry:</span>
              <span>{exp.industry}</span>
            </p>
          </div>
          <span className="text-sm text-muted shrink-0 font-mono tracking-tight lg:text-right">
            {exp.period}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted mb-5">{exp.description}</p>

        <div className="flex flex-wrap gap-2">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface border border-border text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

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
        <div className="mb-16 text-center">
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-2 bottom-0 w-px bg-linear-to-b from-accent/60 via-border to-transparent hidden sm:block" style={{ left: "17px" }} />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <ExperienceCard key={exp.role + exp.company} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
