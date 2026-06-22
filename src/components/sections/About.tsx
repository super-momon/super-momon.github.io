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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 22 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center gap-4 p-4 rounded-xl bg-surface/50 backdrop-blur-sm border will-change-transform"
      style={{
        borderColor: isHovered ? "var(--color-accent)" : "var(--color-border)",
        transition: "border-color 0.25s ease",
      }}
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-accent/10 border border-accent/20 shrink-0">
        <FontAwesomeIcon icon={icon} className="text-accent text-base" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted mb-0.5 font-medium uppercase tracking-wider">{label}</p>
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 22 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative p-5 rounded-xl bg-surface/30 backdrop-blur-sm border will-change-transform"
      style={{
        borderColor: isHovered ? "var(--color-accent)" : "var(--color-border)",
        transition: "border-color 0.25s ease",
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 rounded-xl bg-accent/5 pointer-events-none"
      />
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-4">
          <FontAwesomeIcon
            icon={icon}
            className="text-xl text-accent"
            style={{ filter: isHovered ? "drop-shadow(0 0 6px var(--color-accent))" : "none", transition: "filter 0.25s ease" }}
          />
        </div>
        <h3
          className="text-base font-bold mb-2"
          style={{
            color: isHovered ? "var(--color-accent)" : "var(--color-foreground)",
            transition: "color 0.25s ease",
          }}
        >
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
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
      title: "Full Stack Architecture",
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
      className="relative py-28 px-6 bg-background overflow-hidden"
    >
      <motion.div
        style={{ y: orb1Y }}
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent/6 blur-3xl pointer-events-none opacity-60"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none opacity-40"
      />

      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-16 text-center">
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
            className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold text-foreground tracking-tight leading-[1.1] mb-4"
          >
            About{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover"
              style={{ fontStyle: "italic" }}
            >
              Me
            </span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="w-14 h-px mx-auto bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-1"
          >
            <div className="sticky top-24">
              <motion.div
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 200, damping: 20 } }}
                className="relative rounded-2xl overflow-hidden border-2 border-border will-change-transform"
                style={{ aspectRatio: "1 / 1" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.PNG"
                  alt="Mark Raymond Ayade"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { value: "4+", label: "Years Exp" },
                  { value: "10+", label: "Technologies" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                    className="p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-border text-center will-change-transform"
                  >
                    <div className="text-2xl font-bold text-accent mb-1">{stat.value}</div>
                    <div className="text-xs text-muted uppercase tracking-wide">{stat.label}</div>
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
            className="col-span-2 space-y-8"
          >
            <div className="space-y-4">
              <p className="text-muted leading-relaxed text-base">
                Full Stack Software Developer with{" "}
                <span className="text-accent font-semibold">4+ years</span> of experience designing,
                developing, and maintaining scalable web applications, internal platforms,
                and data integration solutions. Proficient in{" "}
                <span className="text-foreground font-medium">
                  .NET, C#, JavaScript, SQL, PostgreSQL, MongoDB, REST APIs,
                </span>{" "}
                and <span className="text-foreground font-medium">AWS cloud services</span>.
              </p>
              <p className="text-muted leading-relaxed text-base">
                Specialized in backend development, third-party integrations, event-driven architectures,
                and performance optimization. Committed to software engineering best practices,
                system reliability, and delivering maintainable, production-ready code.
              </p>
            </div>

            <div className="space-y-3">
              <InfoCard icon={faMapMarkerAlt} label="Location" value="Cebu, Philippines" />
              <InfoCard icon={faBuilding} label="Current Company" value="Talleco.com Inc. | JobTarget PH" />
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2.5">
                <div className="w-1 h-5 bg-accent rounded-full" />
                Core Expertise
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {expertiseAreas.map((area, i) => (
                  <ExpertiseCard key={area.title} {...area} index={i} />
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-[#002554] to-[#003d7a] rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
              <a
                href="/workplace-insights.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-4 p-5 rounded-xl bg-linear-to-r from-[#002554] to-[#003570] border border-white/10 overflow-hidden will-change-transform transition-transform duration-300 group-hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <FontAwesomeIcon icon={faChartLine} className="text-2xl text-[#002554]" />
                </div>

                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                      Professional Assessment
                    </span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>
                  <p className="font-bold text-white text-lg mb-1">Workplace Insight Report</p>
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/Criteria-logo-web-white.png"
                      alt="Criteria Corp"
                      className="h-4 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="relative text-white text-xl opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
