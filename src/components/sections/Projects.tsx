"use client";

import { FadeIn } from "@/components/FadeIn";

const projects = [
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
    title: "Job Manager",
    description:
      "A job posting management tool built on .Net both frontend and backend. A client facing application where clients can manage their job postings. I contributed to the development of new features, integration with other services, and performance improvements to enhance user experience and operational efficiency.",
    tags: [".NET", "Blazor", "MSSQL", "Rest API", "Bootstrap", "AI Integration"],
    type: "work",
    live: null,
    withAi: true,
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

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4 text-center">
            Projects
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-12 max-w-xl mx-auto">
            A selection of things I worked on and contributed to.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.1}>
              <div className="group flex flex-col h-full p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide whitespace-nowrap flex-shrink-0
                        ${project.type === "work"
                          ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/20"
                          : project.type === "personal"
                            ? "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 border border-purple-500/20"
                            : "bg-green-500/10 text-green-600 dark:bg-green-400/10 dark:text-green-400 border border-green-500/20"
                        }
                      `}
                    >
                      {project.type}
                    </span>
                    {project.withAi && (
                      <span
                        className="relative px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-600 dark:text-violet-300 border-2 border-violet-500/40 shadow-lg shadow-violet-500/20 animate-pulse flex items-center gap-1"
                        title="AI-Powered"
                      >
                        <i className="fa-solid fa-wand-sparkles"></i>
                        AI
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
