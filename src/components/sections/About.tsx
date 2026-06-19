"use client";

import { FadeIn } from "@/components/FadeIn";

export default function About() {
  return (
    <section id="about" className="py-32 px-6">
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

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-[var(--color-muted)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <i className="fa-solid fa-location-dot text-[var(--color-primary)]"></i>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted)] opacity-75">Based in</p>
                  <p className="font-medium text-[var(--color-foreground)]">Cebu, Philippines</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--color-muted)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <i className="fa-solid fa-briefcase text-[var(--color-primary)]"></i>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted)] opacity-75">Current Employer</p>
                  <p className="font-medium text-[var(--color-foreground)]">Talleco.com Inc. | JobTarget PH</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                <i className="fa-solid fa-code text-xl text-[var(--color-primary)] mb-2"></i>
                <span className="text-xs text-[var(--color-muted)] text-center">Full Stack Dev</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                <i className="fa-solid fa-database text-xl text-[var(--color-primary)] mb-2"></i>
                <span className="text-xs text-[var(--color-muted)] text-center">Data Integration</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                <i className="fa-solid fa-cloud text-xl text-[var(--color-primary)] mb-2"></i>
                <span className="text-xs text-[var(--color-muted)] text-center">Cloud Services</span>
              </div>
            </div>


            <div className="mt-6">
              <a
                href="/workplace-insights.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-3 p-4 pl-5 rounded-lg bg-[#002554] transition-all duration-300 group shadow-lg shadow-[var(--color-primary)]/10 hover:shadow-xl hover:shadow-[var(--color-primary)]/30"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white transition-all shadow-md group-hover:shadow-[var(--color-primary)]/40">
                  <i className="fa-solid fa-file-lines text-xl text-black transition-transform"></i>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white font-semibold mb-1">📊 Professional Assessment</p>
                  <p className="font-bold text-white group-hover:text-[var(--color-accent)] transition-colors text-lg">
                    Workplace Insight Test
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="inline-flex items-center px-2 py-1 rounded bg-[#002554]">
                      <img
                        src="/Criteria-logo-web-white.png"
                        alt="Criteria Corp"
                        className="h-4 opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-white text-lg opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"></i>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
