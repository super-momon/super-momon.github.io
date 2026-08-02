"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { trackEvent } from "@/lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandSparkles,
  faBriefcase,
  faCode,
  faBuilding,
  faGamepad,
  faArrowRight,
  faAtom,
  faExpand,
  faTimes,
  faCheckCircle,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

import InlineQuizTeaser from "@/components/common/InlineQuizTeaser";
import SectionHeader from "@/components/common/SectionHeader";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  type: string;
  live: string | null;
  withAi: boolean;
  icon: any;
}

const projects: Project[] = [
  {
    id: "open-post",
    title: "Open Post",
    subtitle: "Infinite anonymous spatial canvas board",
    description:
      "An open, interactive spatial canvas board where anyone can drop sticky notes anonymously with zero sign-up friction. Features real-time multi-user synchronization powered by Supabase Realtime & Next.js, nested comment threads, upvote reactions, board search, and tag filtering.",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Supabase", "Realtime", "Framer Motion", "AI-Coded"],
    type: "app",
    live: "https://openboard-post.vercel.app/",
    withAi: true,
    icon: faComments,
  },
  {
    id: "job-manager",
    title: "Job Manager",
    subtitle: "Blazor & .NET recruiting platform",
    description:
      "A job posting management tool built on .Net both frontend and backend. A client facing application where clients can manage their job postings. I contributed to the development of new features, integration with other services, and performance improvements to enhance user experience and operational efficiency.",
    tags: [".NET", "Blazor", "MSSQL", "Rest API", "Bootstrap", "AI Integration"],
    type: "work",
    live: null,
    withAi: true,
    icon: faBriefcase,
  },
  {
    id: "internal-admin",
    title: "Internal Admin",
    subtitle: "ASP.NET backend operations panel",
    description:
      "A full-stack admin dashboard built on ASP.NET. A legacy application I maintained and enhanced with new features, bug fixes, and performance optimizations to support internal operations and data management.",
    tags: ["C#", "ASP.NET", "MSSQL", "Bootstrap", "jQuery"],
    type: "work",
    live: null,
    withAi: false,
    icon: faCode,
  },
  {
    id: "client-apps",
    title: "Several Client Facing Apps",
    subtitle: "Scalable SaaS client platforms",
    description:
      "Various client-facing application built on different tech stacks. I contributed to the development and maintenance of several client-facing applications across different technology stacks. My work involved implementing new features, optimizing performance, and ensuring seamless integration with backend services to enhance user experience and meet client requirements.",
    tags: ["React", "Next.js", ".NET", "MSSQL", "Rest API", "Node.js", "GraphQL", "AWS", "Docker"],
    type: "work",
    live: null,
    withAi: true,
    icon: faBuilding,
  },
  {
    id: "quiz-game",
    title: "Developer Quiz",
    subtitle: "Interactive Next.js trivia game",
    description:
      "An interactive trivia game challenging developers with comprehensive coding questions on JavaScript, React, Next.js, and web systems. Developed as an optimized Next.js client application with dynamic feedback and score keeping. Coded entirely using advanced AI pairing instructions.",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion", "AI-Coded"],
    type: "game",
    live: "/games/quiz",
    withAi: true,
    icon: faGamepad,
  },
  {
    id: "chain-reaction",
    title: "Chain Reaction",
    subtitle: "Cascading physics board game",
    description:
      "A strategic board game with tactical cascade animation physics, local pass-and-play multiplayer capabilities, and real-time lobby segments. Players claim grid cells and trigger reaction cascading explosions to eliminate rivals. Coded entirely using AI pairing assistance.",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion", "AI-Coded"],
    type: "game",
    live: "/games/chain-reaction",
    withAi: true,
    icon: faAtom,
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Trap Escape key & prevent background scroll when detail modal is active
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 px-6 bg-background overflow-hidden"
    >
      {/* Ambient orbs */}
      <motion.div
        style={skipParallax ? undefined : { y: orb1Y }}
        className="absolute top-1/4 left-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />
      <motion.div
        style={skipParallax ? undefined : { y: orb2Y }}
        className="absolute bottom-1/4 right-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-noise" />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Selected Work"
          titlePrefix="Projects &"
          titleItalic="Contributions"
          subtitle="A selection of applications and games I have worked on, designed, and optimized."
        />

        {/* Feature Grid Layout - Strict Uniform Dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between h-auto md:h-[420px] shadow-md shadow-black/5 dark:shadow-black/25 hover:border-accent/50 hover:bg-surface/100 transition-all duration-300"
            >
              <div className="flex flex-col flex-1 min-h-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FontAwesomeIcon icon={project.icon} className="text-accent text-lg" />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-foreground/5 border border-border/80 text-[9px] font-bold uppercase tracking-wider text-foreground/85 mb-1">
                        {project.type === "game" ? "Interactive Game" : "Production Platform"}
                      </span>
                      <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors truncate">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {project.withAi && (
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-accent/60 text-accent bg-accent/10 whitespace-nowrap shadow-xs shrink-0"
                      title="Coded with AI Assistance"
                    >
                      <FontAwesomeIcon icon={faWandSparkles} className="text-[10px]" />
                      AI Coded
                    </span>
                  )}
                </div>

                <p className="text-xs text-accent font-semibold mb-2.5 shrink-0 truncate">
                  {project.subtitle}
                </p>

                {/* Clamped description for perfect card symmetry */}
                <p className="text-sm text-foreground/85 leading-relaxed line-clamp-3 mb-3">
                  {project.description}
                </p>

                {/* Modal Trigger for extra details or teaser */}
                <div className="mt-auto mb-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-background/60 hover:bg-background border border-border/70 hover:border-accent/50 text-xs text-foreground/80 hover:text-accent font-medium transition-all group/btn cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faExpand} className="text-[10px] text-accent/80 group-hover/btn:scale-110 transition-transform" />
                      <span>{project.id === "quiz-game" ? "Preview Quiz Teaser & Overview" : "View Architectural Details"}</span>
                    </span>
                    <span className="text-[10px] font-mono text-accent">Details →</span>
                  </button>
                </div>
              </div>

              {/* Bottom Section: Tech Tags & Primary Action */}
              <div className="shrink-0 pt-3 border-t border-border/30">
                {/* Tech Tags - Clamped to 1 row preview */}
                <div className="flex flex-wrap gap-1.5 mb-4 max-h-[34px] overflow-hidden">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-background/80 border border-border/70 text-foreground/80 group-hover:border-accent/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-accent/10 border border-accent/20 text-accent font-semibold">
                      +{project.tags.length - 4} more
                    </span>
                  )}
                </div>

                {/* CTA Link */}
                <div className="flex items-center justify-between">
                  {project.live ? (
                    <a
                      href={project.live}
                      target={project.live.startsWith("http") ? "_blank" : undefined}
                      rel={project.live.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() =>
                        trackEvent("portfolio_project_open", {
                          project_id: project.id,
                          project_type: project.type,
                          destination: project.live || "",
                        })
                      }
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group/link focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <span>{project.type === "game" ? "Play Interactive Game" : "View Live Project"}</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-[10px] transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs text-foreground/75 font-mono">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                        className="opacity-80"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Enterprise / Internal
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Morphing Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-surface/95 dark:bg-surface/95 border border-border/80 dark:border-border/60 rounded-3xl shadow-2xl z-10 backdrop-blur-xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header - Fixed Top */}
              <div className="flex items-start justify-between gap-4 p-6 md:px-8 md:pt-8 md:pb-5 border-b border-border/40 shrink-0 bg-surface/95 dark:bg-surface/95 backdrop-blur-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={selectedProject.icon} className="text-accent text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-foreground/5 border border-border/80 text-[9px] font-bold uppercase tracking-wider text-foreground/85">
                        {selectedProject.type === "game" ? "Interactive Game" : "Production Platform"}
                      </span>
                      {selectedProject.withAi && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-accent/60 text-accent bg-accent/10">
                          <FontAwesomeIcon icon={faWandSparkles} className="text-[8px]" />
                          AI Coded
                        </span>
                      )}
                    </div>
                    <h3 id="project-modal-title" className="text-xl font-bold text-foreground tracking-tight">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs text-accent font-semibold">{selectedProject.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-background/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              </div>

              {/* Scrollable Body Container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                <div>
                  <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                    Project Overview
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Inline quiz teaser inside Developer Quiz modal */}
                {selectedProject.id === "quiz-game" && (
                  <div className="p-4 rounded-2xl bg-background/60 border border-accent/20">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-3">
                      Interactive Trivia Teaser
                    </h4>
                    <InlineQuizTeaser />
                  </div>
                )}

                {/* Complete Tech Stack */}
                <div>
                  <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2.5">
                    Technologies & Architecture
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-background border border-border/80 text-foreground/90 shadow-xs"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="text-accent text-[10px]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-background/60 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target={selectedProject.live.startsWith("http") ? "_blank" : undefined}
                      rel={selectedProject.live.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => {
                        trackEvent("portfolio_project_open", {
                          project_id: selectedProject.id,
                          project_type: selectedProject.type,
                          destination: selectedProject.live || "",
                        });
                        setSelectedProject(null);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      <span>{selectedProject.type === "game" ? "Play Game Now" : "Launch Project"}</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

