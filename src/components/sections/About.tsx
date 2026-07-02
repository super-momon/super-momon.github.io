"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faPlug,
  faGaugeHigh,
  faMapMarkerAlt,
  faBuilding,
  faChartLine,
  faArrowRight,
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
      className="group flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-surface/30 hover:bg-surface/50 backdrop-blur-md border border-border/40 transition-all duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background/50 shadow-xs border border-border/50 shrink-0 group-hover:bg-background/80 transition-colors duration-300">
        <FontAwesomeIcon icon={icon} className="text-foreground/70 text-lg md:text-xl group-hover:text-foreground transition-colors duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] md:text-[11px] text-muted/80 mb-1 font-bold uppercase tracking-widest">{label}</p>
        <p className="font-semibold text-foreground/90 text-sm truncate">{value}</p>
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
      className="group relative p-5 md:p-7 rounded-2xl bg-surface/30 hover:bg-surface/50 backdrop-blur-md border border-border/40 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative z-10 flex-1">
        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background/50 shadow-xs border border-border/50 mb-6 group-hover:bg-background/80 group-hover:scale-105 transition-all duration-300">
          <FontAwesomeIcon
            icon={icon}
            className="text-lg md:text-xl text-foreground/70 group-hover:text-foreground transition-colors duration-300"
          />
        </div>
        <h3 className="text-base font-bold text-foreground/90 mb-3 group-hover:text-foreground transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted/90 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -30]);

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
        style={{ y: orb1Y }}
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-foreground/5 blur-3xl pointer-events-none opacity-40"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-foreground/5 blur-3xl pointer-events-none opacity-30"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <div className="sticky top-28 space-y-6">
              <motion.div
                className="relative rounded-3xl overflow-hidden border border-border/40 shadow-sm bg-surface/20"
                style={{ aspectRatio: "4 / 5" }}
              >
                <div className="absolute inset-0 bg-linear-to-tr from-background/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.PNG"
                  alt="Mark Raymond Ayade"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "4+", label: "Years Exp" },
                  { value: "10+", label: "Technologies" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                    className="p-5 rounded-2xl bg-surface/30 backdrop-blur-md border border-border/40 text-center will-change-transform flex flex-col justify-center min-h-[100px]"
                  >
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-[10px] text-muted font-semibold uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-7 xl:col-span-8 space-y-12"
          >
            <div className="space-y-6">
              <p className="text-muted/90 leading-relaxed text-base font-light">
                Full Stack Software Developer with{" "}
                <span className="text-foreground font-semibold">4+ years</span> of experience designing,
                developing, and maintaining scalable web applications, internal platforms,
                and data integration solutions. Proficient in{" "}
                <span className="text-foreground font-medium">
                  .NET, C#, JavaScript, SQL, PostgreSQL, MongoDB, REST APIs,
                </span>{" "}
                and <span className="text-foreground font-medium">AWS cloud services</span>.
              </p>
              <p className="text-muted/90 leading-relaxed text-base font-light">
                Specialized in backend development, third-party integrations, event-driven architectures,
                and performance optimization. Committed to software engineering best practices,
                system reliability, and delivering maintainable, production-ready code.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={faMapMarkerAlt} label="Location" value="Cebu, Philippines" />
              <InfoCard icon={faBuilding} label="Current Company" value="Talleco.com Inc. | JobTarget PH" />
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-mono font-bold text-muted uppercase tracking-widest mb-6 flex items-center gap-4">
                Core Expertise
                <div className="flex-1 h-px bg-border/40" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {expertiseAreas.map((area, i) => (
                  <ExpertiseCard key={area.title} {...area} index={i} />
                ))}
              </div>
            </div>

            <div className="relative group pt-4">
              <div className="absolute inset-0 bg-linear-to-r from-foreground/5 to-foreground/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mt-4" />
              <a
                href="/workplace-insights.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-surface/40 hover:bg-surface/60 backdrop-blur-md border border-border/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-background/80 shadow-sm border border-border/50 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <FontAwesomeIcon icon={faChartLine} className="text-xl text-foreground/80 group-hover:text-foreground transition-colors" />
                </div>

                <div className="relative flex-1 w-full sm:w-auto text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
                    <span className="text-[10px] md:text-[11px] text-muted font-bold uppercase tracking-widest">
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
                      className="h-4 opacity-60 group-hover:opacity-100 transition-opacity invert dark:invert-0"
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
        </div>
      </div>
    </section>
  );
}
