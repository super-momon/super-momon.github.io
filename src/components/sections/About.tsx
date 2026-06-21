"use client";

import { useState, useRef, useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";

interface InfoCardProps {
  icon: string;
  label: string;
  value: string;
  delay: number;
}

function InfoCard({ icon, label, value, delay }: InfoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform({ x, y, rotateX, rotateY });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        animationDelay: `${delay}ms`,
      }}
      className="relative flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-sm border border-[var(--color-border)] transition-all duration-300 will-change-transform group hover:border-[var(--color-accent)]/50 hover:shadow-lg hover:shadow-[var(--color-accent)]/10 animate-[slideUp_0.6s_ease-out_forwards] opacity-0"
    >
      <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 group-hover:scale-110 transition-transform duration-300">
        <i className={`${icon} text-xl text-[var(--color-accent)] group-hover:rotate-12 transition-transform duration-300`}></i>
        {isHovered && (
          <div
            className="absolute inset-0 rounded-lg bg-[var(--color-accent)]/20 blur-xl animate-pulse"
            style={{ zIndex: -1 }}
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-[var(--color-muted)] mb-1 font-medium uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-[var(--color-foreground)] text-sm">{value}</p>
      </div>
    </div>
  );
}

interface ExpertiseCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

function ExpertiseCard({ icon, title, description, index }: ExpertiseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
      className="relative group p-5 rounded-xl bg-[var(--color-surface)]/30 backdrop-blur-sm border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-500 will-change-transform hover:scale-[1.03] hover:shadow-xl hover:shadow-[var(--color-accent)]/10 animate-[slideUp_0.6s_ease-out_forwards] opacity-0"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/0 to-[var(--color-accent)]/0 group-hover:from-[var(--color-accent)]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <i className={`${icon} text-2xl text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300`}></i>
        </div>
        <h3 className="text-base font-bold text-[var(--color-foreground)] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      {isHovered && (
        <div className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/5 blur-2xl -z-10 animate-pulse" />
      )}
    </div>
  );
}

export default function About() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / windowHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const expertiseAreas = [
    {
      icon: "fa-solid fa-layer-group",
      title: "Full Stack Architecture",
      description: "End-to-end development of scalable web applications with modern frameworks and cloud infrastructure"
    },
    {
      icon: "fa-solid fa-plug",
      title: "System Integration",
      description: "Seamless third-party integrations, REST APIs, and event-driven architectures for connected ecosystems"
    },
    {
      icon: "fa-solid fa-gauge-high",
      title: "Performance Engineering",
      description: "Optimization of application performance, system reliability, and maintainable design patterns"
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl"
          style={{
            transform: `translate3d(0, ${scrollProgress * 50}px, 0)`,
            opacity: 0.3 + scrollProgress * 0.2
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 30}px, 0)`,
            opacity: 0.3 + scrollProgress * 0.2
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-16 text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
              <span className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                Crafting Digital Solutions
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4">
              About <span className="text-[var(--color-accent)]">Me</span>
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent rounded-full" />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Profile Image Section */}
          <FadeIn direction="left" className="col-span-1">
            <div className="sticky top-24">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative w-full aspect-square rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-border)] overflow-hidden group-hover:border-[var(--color-accent)]/50 transition-all duration-500 group-hover:scale-[1.02] will-change-transform">
                  <img
                    src="/logo.PNG"
                    alt="Mark Raymond Ayade"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-sm border border-[var(--color-border)] text-center group hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-[var(--color-accent)] mb-1">4+</div>
                  <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">Years Exp</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-sm border border-[var(--color-border)] text-center group hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl font-bold text-[var(--color-accent)] mb-1">10+</div>
                  <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">Technologies</div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Content Section */}
          <FadeIn direction="right" delay={0.15} className="col-span-2 space-y-8">
            {/* Bio */}
            <div className="space-y-4">
              <p className="text-[var(--color-muted)] leading-relaxed text-base">
                Full Stack Software Developer with <span className="text-[var(--color-accent)] font-semibold">4+ years</span> of experience designing,
                developing, and maintaining scalable web applications, internal platforms,
                and data integration solutions. Proficient in <span className="text-[var(--color-foreground)] font-medium">.NET, C#, JavaScript, SQL,
                  PostgreSQL, MongoDB, REST APIs,</span> and <span className="text-[var(--color-foreground)] font-medium">AWS cloud services</span>.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed text-base">
                Specialized in backend development, third-party integrations, event-driven architectures,
                and performance optimization. Committed to software engineering best practices,
                system reliability, and delivering maintainable, production-ready code.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <InfoCard
                icon="fa-solid fa-map-marker-alt"
                label="Location"
                value="Cebu, Philippines"
                delay={0}
              />
              <InfoCard
                icon="fa-solid fa-building"
                label="Current Company"
                value="Talleco.com Inc. | JobTarget PH"
                delay={100}
              />
            </div>

            {/* Expertise Areas */}
            <div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[var(--color-accent)] rounded-full" />
                Core Expertise
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {expertiseAreas.map((area, index) => (
                  <ExpertiseCard key={index} {...area} index={index} />
                ))}
              </div>
            </div>

            {/* Professional Assessment CTA */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#002554] to-[#003d7a] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <a
                href="/workplace-insights.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-[#002554] to-[#003570] border border-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl will-change-transform overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <i className="fa-solid fa-chart-line text-2xl text-[#002554]"></i>
                </div>

                <div className="relative flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Professional Assessment</span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>
                  <p className="font-bold text-white text-lg mb-1 group-hover:text-blue-200 transition-colors">
                    Workplace Insight Report
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src="/Criteria-logo-web-white.png"
                      alt="Criteria Corp"
                      className="h-4 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                <i className="relative fa-solid fa-arrow-right text-white text-xl opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
