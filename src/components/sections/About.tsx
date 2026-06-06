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
                <img
                  src="/logo.PNG"
                  alt="Mark Raymond Ayade"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div className="space-y-4">
              <p className="text-[var(--color-muted)] leading-relaxed">
                Full Stack Software Developer with 4+ years of experience designing,
                developing, and maintaining scalable web applications, internal platforms,
                and data integration solutions. Experienced in .NET, C#, JavaScript, SQL,
                PostgreSQL, MongoDB, REST APIs, and AWS cloud services.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Skilled in backend development,
                third-party integrations, event-driven architectures, and performance optimization.
                Strong understanding of software engineering best practices, system reliability,
                and maintainable application design.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
