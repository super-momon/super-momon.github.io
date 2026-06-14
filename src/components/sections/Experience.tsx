"use client";

import { FadeIn } from "@/components/FadeIn";

const experiences = [
  {
    role: "Full Stack Software Developer",
    company: "Talleco.com Inc. | JobTarget PH",
    period: "Feb 2025 — Present",
    description:
      "Implemented event-driven backend solutions using AWS services (Lambda, SQS, SNS, S3) to support scalable application workflows. Developed and enhanced features across client-facing and internal services while contributing to UI modernization initiatives. Diagnosed complex production issues and optimized database operations across MS SQL Server, PostgreSQL, and MongoDB, working with diverse technology stacks and architectures.",
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
  return (
    <section id="experience" className="py-24 px-6 bg-[var(--color-surface)]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-12 text-center">
            Relevant & Professional Experience
          </h2>
        </FadeIn>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-border)] hidden sm:block" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <FadeIn key={exp.role + exp.company} delay={i * 0.1}>
                <div className="sm:pl-12 relative">
                  {/* Dot */}
                  <div
                    className={`hidden sm:block absolute left-[11px] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--color-background)] ${exp.current
                      ? "bg-[var(--color-accent)] shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]"
                      : "bg-[var(--color-accent)]"
                      }`}
                  />

                  <div
                    className={`p-6 rounded-xl border transition-all ${exp.current
                      ? "bg-[var(--color-background)] border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/10"
                      : "bg-[var(--color-background)] border-[var(--color-border)]"
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-[var(--color-foreground)]">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[var(--color-accent)] text-white">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--color-accent)] text-sm font-medium">
                          {exp.company}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-1.5">
                          <i className="fa-solid fa-industry"></i>
                          <span>Industry: </span>
                          {exp.industry}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--color-muted)] shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-3">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)]"
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
