"use client";

import { FadeIn } from "@/components/FadeIn";

const education = [
  {
    degree: "B.S. in Information Technology",
    institution: "University of Cebu - Lapulapu and Mandaue",
    period: "2018 - 2022",
    details:
      "Focused on algorithms, distributed systems, and human-computer interaction. Capstone project: An online platform for asynchronous learning and collaboration.",
  },
];

export default function Education() {
  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-12 text-center">
            Learning Journey & Education
          </h2>
        </FadeIn>

        <div className="space-y-6">
          {education.map((item, i) => (
            <FadeIn key={item.degree} delay={i * 0.1}>
              <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex gap-5">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h3 className="font-semibold text-[var(--color-foreground)]">
                      {item.degree}
                    </h3>
                    <span className="text-xs text-[var(--color-muted)] shrink-0">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-[var(--color-accent)] text-sm font-medium mb-2">
                    {item.institution}
                  </p>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
