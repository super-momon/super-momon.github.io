"use client";

import { FadeIn } from "@/components/FadeIn";

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-12 text-center">
            About Me
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="flex justify-center">
              <div className="w-56 h-56 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                {/* Replace src with your actual photo */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted)]"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div className="space-y-4">
              <p className="text-[var(--color-muted)] leading-relaxed text-lg">
                Hi! I&apos;m a passionate full-stack developer with a love for
                building products that live at the intersection of great
                engineering and great design.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                I enjoy turning complex problems into simple, elegant solutions.
                When I&apos;m not writing code, you&apos;ll find me exploring
                open-source projects, reading about distributed systems, or
                perfecting my coffee brewing technique.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["TypeScript", "React", "Node.js", "PostgreSQL"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
