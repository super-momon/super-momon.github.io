"use client";

import { FadeIn } from "@/components/FadeIn";
import { useState } from "react";
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

export default function Experience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="py-32 px-6 bg-[var(--color-surface)] relative overflow-hidden">
      {/* Atmospheric background texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          mixBlendMode: 'overlay'
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <FadeIn>
          <div className="mb-20 text-center">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-[var(--color-foreground)] mb-6 leading-[1.1] tracking-tight">
              Professional <span className="text-[var(--color-accent)] inline-block" style={{ fontStyle: 'italic' }}>Journey</span>
            </h2>
            <p className="text-[clamp(1rem,2vw,1.125rem)] text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
              Chronicling my evolution in software development—from foundational work to architecting scalable solutions across diverse technology stacks.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Enhanced Timeline line with gradient */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-border)] to-transparent hidden sm:block"
            style={{
              boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.2)',
            }}
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <FadeIn key={exp.role + exp.company} delay={i * 0.15}>
                <div
                  className="sm:pl-16 relative group"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Enhanced animated dot */}
                  <div
                    className={`hidden sm:flex absolute left-[7px] top-2 w-5 h-5 rounded-full items-center justify-center transition-all duration-500 ${exp.current || hoveredIndex === i
                        ? "scale-125"
                        : "scale-100"
                      }`}
                    style={{
                      background: exp.current || hoveredIndex === i
                        ? 'radial-gradient(circle, var(--color-accent) 0%, var(--color-accent) 40%, transparent 70%)'
                        : 'var(--color-accent)',
                      boxShadow: exp.current || hoveredIndex === i
                        ? '0 0 20px rgba(var(--accent-rgb), 0.6), 0 0 40px rgba(var(--accent-rgb), 0.3)'
                        : '0 0 8px rgba(var(--accent-rgb), 0.4)',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div
                    className={`p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${exp.current
                        ? "bg-[var(--color-background)]/80 border-[var(--color-accent)] shadow-2xl shadow-[var(--color-accent)]/20"
                        : "bg-[var(--color-background)]/60 border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:shadow-xl hover:shadow-[var(--color-accent)]/10"
                      } ${hoveredIndex === i ? "translate-x-2" : "translate-x-0"
                      }`}
                    style={{
                      backdropFilter: 'blur(8px)',
                      willChange: hoveredIndex === i ? 'transform' : 'auto',
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-xl font-bold text-[var(--color-foreground)] tracking-tight">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30 animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--color-accent)] text-base font-semibold mb-2">
                          {exp.company}
                        </p>
                        <p className="text-sm text-[var(--color-muted)] flex items-center gap-2 mt-2">
                          <FontAwesomeIcon icon={faIndustry} className="text-[var(--color-accent)]" />
                          <span className="font-medium">Industry:</span>
                          <span>{exp.industry}</span>
                        </p>
                      </div>
                      <span className="text-sm text-[var(--color-muted)] shrink-0 font-mono tracking-tight lg:text-right">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-[15px] text-[var(--color-muted)] leading-relaxed mb-5 max-w-none">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2.5">
                      {exp.tags.map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-background)] transition-all duration-300 cursor-default"
                          style={{
                            transitionDelay: hoveredIndex === i ? `${tagIndex * 30}ms` : '0ms',
                            transform: hoveredIndex === i ? 'translateY(-2px)' : 'translateY(0)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
