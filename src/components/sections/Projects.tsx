"use client";

import { FadeIn } from "@/components/FadeIn";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandSparkles } from "@fortawesome/free-solid-svg-icons";

const projects = [
  {
    title: "Job Manager",
    description:
      "A job posting management tool built on .Net both frontend and backend. A client facing application where clients can manage their job postings. I contributed to the development of new features, integration with other services, and performance improvements to enhance user experience and operational efficiency.",
    tags: [".NET", "Blazor", "MSSQL", "Rest API", "Bootstrap", "AI Integration"],
    type: "work",
    live: null,
    withAi: true,
  },
  {
    title: "Internal Admin",
    description:
      "A full-stack admin dashboard built on ASP.NET. A legacy application I maintained and enhanced with new features, bug fixes, and performance optimizations to support internal operations and data management.",
    tags: ["C#", "ASP.NET", "MSSQL", "Bootstrap", "jQuery"],
    type: "work",
    live: null,
    withAi: false,
  },
  {
    title: "Several Client Facing Applications",
    description:
      "Various client-facing application built on different tech stacks. I contributed to the development and maintenance of several client-facing applications across different technology stacks. My work involved implementing new features, optimizing performance, and ensuring seamless integration with backend services to enhance user experience and meet client requirements.",
    tags: ["React", "Next.js", ".NET", "MSSQL", "Rest API", "Node.js", "GraphQL", "AWS", "Docker"],
    type: "work",
    live: null,
    withAi: true,
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const magneticStyle = isHovered
    ? {
      transform: `translateY(-8px) scale(1.02)`,
    }
    : {};

  return (
    <FadeIn delay={index * 0.15}>
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative h-full"
        style={{
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          ...magneticStyle,
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15), transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Main card with glassmorphism */}
        <div className="relative h-full p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-sm overflow-hidden transition-all duration-500 group-hover:border-[var(--color-accent)]/50 group-hover:bg-[var(--color-surface)]/80">
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`,
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header with badges */}
            <div className="flex items-start justify-between gap-3 mb-6">
              <h3 className="text-2xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors duration-300 leading-tight">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`
                    px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap
                    ${project.type === "work"
                      ? "bg-blue-500/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400 border border-blue-500/30"
                      : project.type === "personal"
                        ? "bg-purple-500/15 text-purple-600 dark:bg-purple-400/15 dark:text-purple-400 border border-purple-500/30"
                        : "bg-green-500/15 text-green-600 dark:bg-green-400/15 dark:text-green-400 border border-green-500/30"
                    }
                    transition-all duration-300 group-hover:scale-105
                  `}
                >
                  {project.type}
                </span>
                {project.withAi && (
                  <span
                    className="relative px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap overflow-hidden flex items-center gap-1.5 transition-all duration-500 group-hover:scale-110"
                    title="AI-Powered"
                  >
                    {/* Animated gradient background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30" />

                    {/* Glow effect */}
                    <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-shadow duration-500" />

                    {/* Border */}
                    <span className="absolute inset-0 rounded-full border-2 border-violet-400/60" />

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faWandSparkles} className="text-xs text-violet-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      <span className="text-violet-200 font-black drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]">AI</span>
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-[15px] text-[var(--color-muted)] leading-relaxed mb-6 min-h-[120px]">
              {project.description}
            </p>

            {/* Tags with staggered animation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag, i) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-background)]/70 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-muted)] transition-all duration-300 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-foreground)] hover:scale-105"
                  style={{
                    transitionDelay: `${i * 30}ms`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action area */}
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border)]/50">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-all duration-300 group/link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>View Project</span>
                </a>
              ) : (
                <span className="text-sm font-medium text-[var(--color-muted)]/50 italic">
                  Internal Project
                </span>
              )}
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>
    </FadeIn>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 px-6 overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header with enhanced typography */}
        <FadeIn>
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                Selected Work
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-foreground)] mb-6 tracking-tight">
              Projects
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
              A selection of things I worked on and contributed to.
            </p>
          </div>
        </FadeIn>

        {/* Projects grid with enhanced spacing */}
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
