"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { trackEvent } from "@/lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import SectionHeader from "@/components/common/SectionHeader";

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
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-noise" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Career History"
          titlePrefix="Professional"
          titleItalic="Journey"
          subtitle="Chronicling my evolution in software development — from foundational work to architecting scalable solutions."
        />

        {/* Timeline Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Vertical connecting spine line */}
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-border/40"
          />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-11 md:pl-20 group"
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute left-0 top-1.5 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    exp.current
                      ? "bg-background border-accent shadow-[0_0_15px_rgba(0,199,88,0.4)] text-accent scale-110"
                      : "bg-surface border-border text-foreground/60 group-hover:border-accent/80 group-hover:text-accent"
                  }`}
                >
                  <FontAwesomeIcon icon={faBriefcase} className="text-xs md:text-sm" />
                </div>

                {/* Role Card */}
                <div className="p-6 md:p-8 rounded-2xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl shadow-md shadow-black/5 dark:shadow-black/25 group-hover:border-accent/50 group-hover:bg-surface/100 transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
                          {exp.role}
                        </h3>
                        {exp.current && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-accent text-white shadow-xs">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-accent text-sm font-semibold mb-1.5">{exp.company}</p>
                      <p className="text-xs text-foreground/75 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faIndustry} className="text-accent text-[10px]" />
                        {exp.industry}
                      </p>
                    </div>

                    <span className="shrink-0 self-start text-xs font-mono text-foreground/80 border border-border/80 rounded-lg px-3 py-1.5 bg-background/80 shadow-xs">
                      {exp.period}
                    </span>
                  </div>

                  <div className="h-px bg-border/40 mb-4" />

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 mb-6">
                    {exp.description.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/30">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-background/80 border border-border/70 text-foreground/80 group-hover:border-accent/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
