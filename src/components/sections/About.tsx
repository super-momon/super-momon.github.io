"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faPlug,
  faGaugeHigh,
  faMapMarkerAlt,
  faBuilding,
  faChartLine,
  faArrowRight,
  faUser,
  type IconDefinition
} from "@fortawesome/free-solid-svg-icons";

interface InfoCardProps {
  icon: IconDefinition;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 22 } }}
      className="group flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-xs shadow-black/5 dark:shadow-black/20 hover:bg-surface/100 dark:hover:bg-surface/50 hover:border-border/100 transition-all duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background/50 shadow-xs border border-border/50 shrink-0 group-hover:bg-background/80 transition-colors duration-300">
        <FontAwesomeIcon icon={icon} className="text-foreground/80 text-lg md:text-xl group-hover:text-foreground transition-colors duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] md:text-[11px] text-foreground/75 mb-1 font-bold uppercase tracking-widest">{label}</p>
        <p className="font-semibold text-foreground text-sm truncate">{value}</p>
      </div>
    </motion.div>
  );
}

interface ExpertiseCardProps {
  icon: IconDefinition;
  title: string;
  description: string;
  index: number;
}

function ExpertiseCard({ icon, title, description, index }: ExpertiseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-5 md:p-7 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-xs shadow-black/5 dark:shadow-black/20 hover:bg-surface/100 dark:hover:bg-surface/50 hover:border-border/100 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative z-10 flex-1">
        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background/50 shadow-xs border border-border/50 mb-6 group-hover:bg-background/80 group-hover:scale-105 transition-all duration-300">
          <FontAwesomeIcon
            icon={icon}
            className="text-lg md:text-xl text-foreground/80 group-hover:text-foreground transition-colors duration-300"
          />
        </div>
        <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-foreground transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-foreground/85 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const [activeTab, setActiveTab] = useState<"bio" | "expertise" | "insights">("bio");

  const tabs = [
    {
      id: "bio" as const,
      icon: faUser,
      label: "Professional Bio",
      subtitle: "Experience overview & focus",
      tag: "Biography",
    },
    {
      id: "expertise" as const,
      icon: faLayerGroup,
      label: "Core Expertise",
      subtitle: "Technical specializations",
      tag: "Capabilities",
    },
    {
      id: "insights" as const,
      icon: faChartLine,
      label: "Metrics & Assessment",
      subtitle: "Performance stats & reports",
      tag: "Credentials",
    },
  ];

  const expertiseAreas = [
    {
      icon: faLayerGroup,
      title: "Full Stack Development",
      description: "End-to-end development of scalable web applications with modern frameworks and cloud infrastructure",
    },
    {
      icon: faPlug,
      title: "System Integration",
      description: "Seamless third-party integrations, REST APIs, and event-driven architectures for connected ecosystems",
    },
    {
      icon: faGaugeHigh,
      title: "Performance Engineering",
      description: "Optimization of application performance, system reliability, and maintainable design patterns",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 px-6 bg-background overflow-hidden"
    >
      <motion.div
        style={skipParallax ? undefined : { y: orb1Y }}
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-foreground/5 blur-3xl pointer-events-none opacity-40 will-change-transform"
      />
      <motion.div
        style={skipParallax ? undefined : { y: orb2Y }}
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-foreground/5 blur-3xl pointer-events-none opacity-30 will-change-transform"
      />

      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-block mb-3 text-xs font-mono font-semibold tracking-[0.18em] uppercase text-accent"
          >
            Background
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4"
          >
            About{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Me
            </span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="w-14 h-px mx-auto mt-6 bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6"
          >
            {/* Profile Picture Card */}
            <div className="relative p-5 rounded-3xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30 flex flex-col gap-4 items-center text-center">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border border-border/60 shadow-inner group/avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.PNG"
                  alt="Mark Raymond Ayade"
                  className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500 scale-105 hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="space-y-1.5 flex flex-col items-center">
                <h3 className="text-lg font-bold text-foreground tracking-tight">Mark Raymond Ayade</h3>
                <span className="inline-block bg-foreground/5 border border-border/80 text-foreground/85 text-[10px] font-mono font-semibold tracking-wider px-2.5 py-0.5 rounded-full">
                  Full Stack Developer
                </span>
              </div>
            </div>

            {/* Interactive Tabs Control */}
            <div className="flex flex-col gap-2 p-2 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30">
              {/* Mobile tabs row */}
              <div className="grid grid-cols-3 lg:hidden gap-1.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border text-center cursor-pointer ${isActive
                        ? "bg-background/85 shadow-xs border-border/50 text-foreground font-bold"
                        : "bg-transparent border-transparent text-foreground/75 hover:text-foreground hover:bg-background/20"
                        }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} className={`text-sm mb-1.5 ${isActive ? "text-accent" : "text-foreground/60"}`} />
                      <span className="text-[10px] font-semibold tracking-tight leading-none">{tab.label.split(" ").pop()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop vertical tabs */}
              <div className="hidden lg:flex flex-col gap-1.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-left cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${isActive
                        ? "bg-background/80 shadow-xs border border-border/50"
                        : "hover:bg-background/30 border border-transparent"
                        }`}
                    >
                      {/* Active Indicator on Left */}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-full transition-all duration-350 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                          }`}
                      />

                      {/* Icon block */}
                      <span
                        className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${isActive
                          ? "bg-accent/15 text-accent shadow-xs"
                          : "bg-background/80 text-foreground/60 group-hover:bg-accent/10 group-hover:text-accent"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={tab.icon}
                          className="text-xs transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </span>

                      {/* Text Content */}
                      <div className="flex flex-col text-left min-w-0">
                        <span
                          className={`text-xs font-semibold leading-tight transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                            }`}
                        >
                          {tab.label}
                        </span>
                        <span className="text-[10px] text-foreground/70 font-normal leading-normal mt-0.5 max-w-[200px] truncate group-hover:text-foreground/80 transition-colors duration-300">
                          {tab.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Glassmorphic Panel */}
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
                  {/* Dynamic Header */}
                  {(() => {
                    const activeMeta = tabs.find((t) => t.id === activeTab)!;
                    return (
                      <div className="border-b border-border/30 pb-5 mb-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-foreground/5 border border-border/80 text-[9px] font-bold uppercase tracking-wider text-foreground/85 mb-2">
                          {activeMeta.tag}
                        </span>
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2.5">
                          <FontAwesomeIcon icon={activeMeta.icon} className="text-accent text-sm" />
                          {activeMeta.label}
                        </h3>
                      </div>
                    );
                  })()}

                  {/* Dynamic Content switching */}
                  <div className="w-full">
                    {activeTab === "bio" && (
                      <motion.div
                        key="bio"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <div className="space-y-4 text-foreground/85 leading-relaxed text-sm font-normal">
                          <p>
                            Full Stack Software Developer with{" "}
                            <span className="text-foreground font-semibold">4+ years</span> of experience designing,
                            developing, and maintaining scalable web applications, internal platforms,
                            and data integration solutions. Proficient in{" "}
                            <span className="text-foreground font-medium">
                              .NET, C#, JavaScript, SQL, PostgreSQL, MongoDB, REST APIs,
                            </span>{" "}
                            and <span className="text-foreground font-medium">AWS cloud services</span>.
                          </p>
                          <p>
                            Specialized in backend development, third-party integrations, event-driven architectures,
                            and performance optimization. Committed to software engineering best practices,
                            system reliability, and delivering maintainable, production-ready code.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <InfoCard icon={faMapMarkerAlt} label="Location" value="Cebu, Philippines" />
                          <InfoCard icon={faBuilding} label="Current Company" value="Talleco.com Inc. | JobTarget PH" />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "expertise" && (
                      <motion.div
                        key="expertise"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {expertiseAreas.map((area, i) => (
                            <ExpertiseCard key={area.title} {...area} index={i} />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "insights" && (
                      <motion.div
                        key="insights"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "4+", label: "Years Exp" },
                            { value: "10+", label: "Technologies" },
                          ].map((stat) => (
                            <motion.div
                              key={stat.label}
                              whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                              className="p-5 rounded-2xl bg-surface/90 md:bg-surface/30 md:backdrop-blur-xs border border-border/40 text-center will-change-transform flex flex-col justify-center min-h-[100px]"
                            >
                              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                              <div className="text-[10px] text-foreground/75 font-semibold uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="relative group pt-2">
                          <div className="absolute inset-0 bg-linear-to-r from-foreground/5 to-foreground/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mt-4" />
                          <a
                            href="/workplace-insights.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/25 hover:bg-surface/100 dark:hover:bg-surface/50 hover:border-border/100 transition-all duration-300 overflow-hidden cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                            <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-background/80 shadow-xs border border-border/50 shrink-0 group-hover:scale-105 transition-transform duration-300">
                              <FontAwesomeIcon icon={faChartLine} className="text-xl text-foreground/80 group-hover:text-foreground transition-colors" />
                            </div>

                            <div className="relative flex-1 w-full sm:w-auto text-center sm:text-left">
                              <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
                                <span className="text-[10px] md:text-[11px] text-foreground/75 font-bold uppercase tracking-widest">
                                  Professional Assessment
                                </span>
                                <div className="hidden sm:block flex-1 h-px bg-border/40" />
                              </div>
                              <p className="font-bold text-foreground text-sm mb-2">Workplace Insight Report</p>
                              <div className="flex items-center justify-center sm:justify-start">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="/Criteria-logo-web-white.png"
                                  alt="Criteria Corp"
                                  className="h-4 opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/40 group-hover:bg-foreground group-hover:border-foreground transition-colors duration-300 mt-2 sm:mt-0">
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-foreground group-hover:text-background text-sm transition-colors duration-300"
                              />
                            </div>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
