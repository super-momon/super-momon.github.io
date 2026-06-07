"use client";

import { FadeIn } from "@/components/FadeIn";

const projects = [
  {
    title: "Internal Admin",
    description:
      "A full-stack admin dashboard built on ASP.NET. A legacy application I maintained and enhanced with new features, bug fixes, and performance optimizations to support internal operations and data management.",
    tags: ["C#", "ASP.NET", "MSSQL", "Bootstrap", "jQuery"],
    type: "work" as const,
    // github: "https://github.com/super-momon/project-alpha",
    live: null,
  },
  {
    title: "Project Beta",
    description:
      "An open-source CLI tool that scaffolds monorepo projects with opinionated configs for ESLint, Prettier, Husky, and CI pipelines.",
    tags: ["Node.js", "TypeScript", "GitHub Actions"],
    type: "personal" as const,
    // github: "https://github.com/super-momon/project-beta",/
    live: null,
  },
  {
    title: "Project Gamma",
    description:
      "A real-time collaborative markdown editor with operational transformation, syntax highlighting, and shareable room links.",
    tags: ["React", "Socket.io", "Express", "MongoDB"],
    type: "personal" as const,
    // github: "https://github.com/super-momon/project-gamma",
    live: null,
  },
  {
    title: "Project Delta",
    description:
      "A headless e-commerce storefront using Next.js App Router and a custom Stripe checkout integration with webhook-based order fulfillment.",
    tags: ["Next.js", "Stripe", "Prisma", "Vercel"],
    type: "learning" as const,
    // github: "https://github.com/super-momon/project-delta",
    live: null,
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
                  {/* {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Code
                    </a>
                  )} */}
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
