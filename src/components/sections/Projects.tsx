"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandSparkles,
  faBriefcase,
  faCode,
  faBuilding,
  faGamepad,
  faArrowRight,
  faAtom,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

const projects = [
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
  const [activeProjectId, setActiveProjectId] = useState("job-manager");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

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
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-block mb-3 text-xs font-mono font-semibold tracking-[0.18em] uppercase text-accent"
          >
            Selected Work
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4 text-balance"
          >
            Projects &amp;{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 pr-2 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Contributions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="text-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            A selection of applications and games I have worked on, designed, and optimized.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="w-14 h-px mx-auto mt-6 bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Dashboard split-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Explorer Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6"
          >
            {/* Project Hub Header Card */}
            <div className="relative p-5 rounded-3xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30 flex flex-col gap-4 items-center text-center">
              <div className="relative w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faFolderOpen} className="text-accent text-2xl" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground tracking-tight">Project Explorer</h3>
                <p className="text-xs text-foreground/75 font-mono font-medium tracking-wide">Interactive Dossier</p>
              </div>
            </div>

            {/* Interactive Tabs List */}
            <div className="flex flex-col gap-2 p-2 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30">
              
              {/* Mobile tabs row */}
              <div className="grid grid-cols-5 lg:hidden gap-1">
                {projects.map((project) => {
                  const isActive = activeProjectId === project.id;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 border text-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                        isActive
                          ? "bg-background/85 shadow-xs border-border/50 text-accent font-bold"
                          : "bg-transparent border-transparent text-foreground/75 hover:text-foreground hover:bg-background/20"
                      }`}
                    >
                      <FontAwesomeIcon icon={project.icon} className={`text-sm mb-1 ${isActive ? "text-accent" : "text-foreground/60"}`} />
                      <span className="text-[9px] font-semibold tracking-tight leading-none truncate max-w-full">
                        {project.title.split(" ").pop()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop vertical tabs */}
              <div className="hidden lg:flex flex-col gap-1.5">
                {projects.map((project) => {
                  const isActive = activeProjectId === project.id;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-left cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                        isActive
                          ? "bg-background/80 shadow-xs border border-border/50"
                          : "hover:bg-background/30 border border-transparent"
                      }`}
                    >
                      {/* Active Indicator on Left */}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-full transition-all duration-350 ${
                          isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                        }`}
                      />

                      {/* Icon block */}
                      <span
                        className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isActive
                            ? "bg-accent/15 text-accent shadow-xs"
                            : "bg-background/80 text-foreground/60 group-hover:bg-accent/10 group-hover:text-accent"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={project.icon}
                          className="text-xs transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </span>

                      {/* Text Content */}
                      <div className="flex flex-col text-left min-w-0">
                        <span
                          className={`text-xs font-semibold leading-tight transition-colors duration-300 ${
                            isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                          }`}
                        >
                          {project.title}
                        </span>
                        <span className="text-[10px] text-foreground/60 font-normal leading-normal mt-0.5 max-w-[200px] truncate group-hover:text-foreground/85 transition-colors duration-300">
                          {project.subtitle}
                        </span>
                      </div>

                      {/* Glowing dot for AI items */}
                      {project.withAi && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Project Dossier Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-7 xl:col-span-8 flex flex-col"
          >
            <div className="relative bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[480px] shadow-lg shadow-black/5 dark:shadow-black/35 select-none">
              {/* Subtle glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-surface/10 to-transparent pointer-events-none rounded-3xl" />

              <div className="relative z-10 space-y-6 h-full flex flex-col justify-between">
                <div>
                  {/* Dossier Header */}
                  <div className="border-b border-border/30 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={activeProject.icon} className="text-accent text-lg" />
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-foreground/5 border border-border/80 text-[9px] font-bold uppercase tracking-wider text-foreground/85 mb-1">
                          {activeProject.type}
                        </span>
                        <h3 className="text-lg font-bold text-foreground tracking-tight leading-tight">
                          {activeProject.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeProject.withAi && (
                        <span
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-accent/60 text-accent bg-accent/10 whitespace-nowrap shadow-xs"
                          title="Coded with AI Assistance"
                        >
                          <FontAwesomeIcon icon={faWandSparkles} className="text-[10px]" />
                          AI Coded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dossier Description */}
                  <div className="w-full min-h-[160px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProject.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <p className="text-sm text-foreground/85 leading-relaxed font-normal">
                          {activeProject.description}
                        </p>

                        <div>
                          <h4 className="text-xs font-bold text-foreground/70 mb-3 uppercase tracking-widest">
                            Built with &amp; Tools
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeProject.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-background/70 border border-border/80 text-foreground/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Dossier Link Action */}
                <div className="pt-4 border-t border-border/30 mt-6 flex items-center justify-between">
                  {activeProject.live ? (
                    <a
                      href={activeProject.live}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group/link focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <span>{activeProject.type === "game" ? "Play Interactive Game" : "View Live Project"}</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-foreground/75 font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="opacity-80">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Proprietary / Internal Project
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
