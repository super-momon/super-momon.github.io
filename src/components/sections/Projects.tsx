"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useCallback, useRef, useState, useEffect } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { trackEvent } from "@/lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCode,
  faBuilding,
  faGamepad,
  faArrowRight,
  faAtom,
  faBiohazard,
  faExpand,
  faTimes,
  faCheckCircle,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

import InlineQuizTeaser from "@/components/common/InlineQuizTeaser";
import SectionHeader from "@/components/common/SectionHeader";
import { useDialogFocus } from "@/hooks/useDialogFocus";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  outcome: string;
  aiContribution?: string;
  tags: string[];
  type: string;
  live: string | null;
  icon: IconProp;
}

const projects: Project[] = [
  {
    id: "open-post",
    title: "Open Post",
    subtitle: "Infinite anonymous spatial canvas board",
    description:
      "A sign-up-free spatial canvas where people can post sticky notes, react, comment, search, and filter boards in real time.",
    role: "Designed and built the full-stack Next.js application, including realtime synchronization and the content interactions.",
    outcome: "Shipped as a live prototype with anonymous sticky notes, nested comments, reactions, board search, tag filters, and Supabase Realtime updates.",
    aiContribution: "Used AI assistance for implementation support while directing the architecture and reviewing integrated changes.",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Supabase", "Realtime", "Framer Motion", "AI-Assisted"],
    type: "app",
    live: "https://openboard-post.vercel.app/",
    icon: faComments,
  },
  {
    id: "job-manager",
    title: "Job Manager",
    subtitle: "Blazor & .NET recruiting platform",
    description:
      "A recruiting operations platform for managing job postings across a Blazor and .NET application.",
    role: "Contributed to frontend and backend feature work, third-party integrations, and performance improvements.",
    outcome: "Delivered work across both the Blazor frontend and .NET backend, covering job-post management, service integrations, and operational reliability.",
    aiContribution: "Used AI-assisted development tools to investigate implementations and review changes before integration.",
    tags: [".NET", "Blazor", "MSSQL", "Rest API", "Bootstrap", "AI Integration"],
    type: "work",
    live: null,
    icon: faBriefcase,
  },
  {
    id: "internal-admin",
    title: "Internal Admin",
    subtitle: "ASP.NET backend operations panel",
    description:
      "A legacy ASP.NET operations panel used for internal data management and administrative workflows.",
    role: "Maintained the application, implemented feature changes, resolved defects, and improved data operations.",
    outcome: "Combined feature delivery and maintenance so internal users retained working MSSQL-backed administrative workflows.",
    tags: ["C#", "ASP.NET", "MSSQL", "Bootstrap", "jQuery"],
    type: "work",
    live: null,
    icon: faCode,
  },
  {
    id: "client-apps",
    title: "Several Client Facing Apps",
    subtitle: "Scalable SaaS client platforms",
    description:
      "A portfolio of client-facing applications delivered across React, Next.js, .NET, Node.js, and related services.",
    role: "Implemented features and integrations, maintained production workflows, and investigated performance and data issues.",
    outcome: "Worked across more than one client application and connected React, Next.js, .NET, Node.js, GraphQL, AWS, and database services.",
    aiContribution: "Used AI-assisted development tools to accelerate implementation and validation while reviewing domain-specific behavior.",
    tags: ["React", "Next.js", ".NET", "MSSQL", "Rest API", "Node.js", "GraphQL", "AWS", "Docker"],
    type: "work",
    live: null,
    icon: faBuilding,
  },
  {
    id: "quiz-game",
    title: "Developer Quiz",
    subtitle: "Interactive Next.js trivia game",
    description:
      "A timed trivia game with 12 categories, 3 game modes, dynamic scoring, and live leaderboard competition.",
    role: "Built the Next.js client, quiz state, timed interactions, result flow, and Supabase leaderboard integration.",
    outcome: "Supports 12 categories, 3 game modes, 15-second question timers, difficulty-based points, result metrics, and persistent leaderboard scores.",
    aiContribution: "Used AI-assisted implementation for rapid iteration while directing the architecture and reviewing integration behavior.",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion", "AI-Assisted"],
    type: "game",
    live: "/games/quiz",
    icon: faGamepad,
  },
  {
    id: "chain-reaction",
    title: "Chain Reaction",
    subtitle: "Cascading physics board game",
    description:
      "A board game built around cascade reactions, local pass-and-play sessions, and a real-time lobby.",
    role: "Built the game board, turn flow, cascade animations, setup controls, and lobby synchronization.",
    outcome: "Provides local pass-and-play, turn and player-state tracking, cascade reactions, and a lobby with realtime match setup.",
    aiContribution: "Used AI-assisted implementation to explore and refine game behavior while retaining final technical decisions.",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion", "AI-Assisted"],
    type: "game",
    live: "/games/chain-reaction",
    icon: faAtom,
  },
  {
    id: "colony-defense",
    title: "Colony Defense",
    subtitle: "Microscopic endless-defense prototype",
    description:
      "A playable colony-defense prototype about spreading biological growth, nutrient collection, and habitat survival.",
    role: "Built the simulation, placement controls, combat loop, and visual feedback for the colony-defense prototype.",
    outcome: "Includes colony growth, nutrient collection, turret placement, wall repair, cache interactions, and escalating enemy waves.",
    aiContribution: "Used AI-assisted implementation to iterate on the prototype and simulate gameplay states.",
    tags: ["Next.js", "React", "TypeScript", "Canvas 2D", "Game Prototype"],
    type: "game",
    live: "/games/colony-defense",
    icon: faBiohazard,
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const featuredProjectIds = new Set([
    "open-post",
    "job-manager",
    "client-apps",
    "quiz-game",
  ]);
  const visibleProjects = showAllProjects
    ? projects
    : projects.filter((project) => featuredProjectIds.has(project.id));
  const closeProjectModal = useCallback(() => setSelectedProject(null), []);
  const projectDialogRef = useDialogFocus<HTMLDivElement>(
    Boolean(selectedProject),
    closeProjectModal,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Prevent background scroll while project details are open.
  useEffect(() => {
    if (!selectedProject) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
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
          subtitle="Real applications and games, with the work I owned and the systems each project delivers."
        />

        {/* Project evidence grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="design-surface group relative flex flex-col rounded-2xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:bg-surface/100 md:p-8"
            >
              <div className="flex flex-1 flex-col">
                {/* Header */}
                <div className="mb-3 flex shrink-0 items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FontAwesomeIcon icon={project.icon} className="text-accent text-lg" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-accent">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-foreground/85">
                  {project.description}
                </p>

                <div className="mb-5 grid grid-cols-1 gap-4 border-y border-border/40 py-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground/70">
                      My Role
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {project.role}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground/70">
                      Outcome
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {project.outcome}
                    </p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-border/30 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    <FontAwesomeIcon icon={faExpand} className="text-xs text-accent/80" />
                    <span>{project.id === "quiz-game" ? "Preview the quiz" : "View project details"}</span>
                  </button>
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
                      className="liquid-glass-action inline-flex min-h-11 items-center gap-2 px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-[var(--color-accent-contrast)] text-xs font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group/link focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <span>{project.type === "game" ? "Play game" : "Open live project"}</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-foreground/75">
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
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-expanded={showAllProjects}
            onClick={() => setShowAllProjects((current) => !current)}
            className="design-elevated-control inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface/70 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {showAllProjects ? "Show featured work" : "Show all work"}
          </button>
        </div>
      </div>

      {/* Morphing Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            ref={projectDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjectModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="design-dialog relative w-full max-w-2xl bg-surface/95 dark:bg-surface/95 border border-border/80 dark:border-border/60 rounded-3xl shadow-2xl z-10 backdrop-blur-xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header - Fixed Top */}
              <div className="flex items-start justify-between gap-4 p-6 md:px-8 md:pt-8 md:pb-5 border-b border-border/40 shrink-0 bg-surface/95 dark:bg-surface/95 backdrop-blur-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={selectedProject.icon} className="text-accent text-xl" />
                  </div>
                  <div>
                    <h3 id="project-modal-title" className="text-xl font-bold text-foreground tracking-tight">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs text-accent font-semibold">{selectedProject.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeProjectModal}
                  data-dialog-autofocus
                  className="w-11 h-11 rounded-full border border-border/80 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-background/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer shrink-0"
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

                <div className="grid grid-cols-1 gap-5 border-y border-border/40 py-5 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                      My Role
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {selectedProject.role}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                      Outcome
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {selectedProject.outcome}
                    </p>
                  </div>
                </div>

                {selectedProject.aiContribution && (
                  <div>
                    <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                      AI-Assisted Approach
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {selectedProject.aiContribution}
                    </p>
                  </div>
                )}

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
                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs text-accent" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeProjectModal}
                    className="min-h-11 px-4 py-2 rounded-xl text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-background/60 transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
                        closeProjectModal();
                      }}
                      className="liquid-glass-action inline-flex min-h-11 items-center gap-2 px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-[var(--color-accent-contrast)] text-xs font-semibold transition-all duration-300 shadow-sm cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <span>{selectedProject.type === "game" ? "Play game" : "Open project"}</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
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
