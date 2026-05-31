"use client";

import { FadeIn } from "@/components/FadeIn";

const experiences = [
  {
    role: "Senior Frontend Engineer",
    company: "Tech Company Inc.",
    period: "Jan 2023 — Present",
    description:
      "Led the migration of a legacy React app to Next.js 14 App Router, reducing TTFB by 40%. Mentored 3 junior engineers and drove adoption of design tokens across the product.",
    tags: ["Next.js", "TypeScript", "Design Systems"],
  },
  {
    role: "Full-Stack Developer",
    company: "Startup Studio",
    period: "Jun 2021 — Dec 2022",
    description:
      "Built and shipped 4 client products end-to-end. Implemented real-time features using WebSockets and designed a multi-tenant architecture on PostgreSQL with Row Level Security.",
    tags: ["React", "Node.js", "PostgreSQL", "WebSockets"],
  },
  {
    role: "Junior Developer",
    company: "Digital Agency",
    period: "Jul 2020 — May 2021",
    description:
      "Developed marketing sites and internal tools. Introduced automated testing with Jest, raising test coverage from 0% to 65% across three projects.",
    tags: ["Vue.js", "PHP", "MySQL", "Jest"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-[var(--color-surface)]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-12 text-center">
            Work Experience
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
                  <div className="hidden sm:block absolute left-[11px] top-1.5 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-background)]" />

                  <div className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                      <div>
                        <h3 className="font-semibold text-[var(--color-foreground)]">
                          {exp.role}
                        </h3>
                        <p className="text-[var(--color-accent)] text-sm font-medium">
                          {exp.company}
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
