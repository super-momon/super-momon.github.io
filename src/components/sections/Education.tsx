"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faArrowUpRightFromSquare, faXmark, faAward } from "@fortawesome/free-solid-svg-icons";
import { faAws, faLinkedin, faFreeCodeCamp } from "@fortawesome/free-brands-svg-icons";

const education = [
  {
    icon: faAws,
    topic: "AWS Services",
    institution: "AWS Skill Builder",
    period: "2024 - Present",
    details:
      "Gained hands-on experience with AWS services including EC2, S3, Lambda, and RDS. Contributed to several projects using AWS Services, learning about cloud architecture, serverless computing, and best practices for scalability and security.",
    skills: ["AWS", "Cloud Computing", "Serverless", "DevOps"],
    certifications: [],
  },
  {
    icon: faLinkedin,
    topic: "Various Programming Courses",
    institution: "LinkedIn Learning",
    period: "2022 - Present",
    details:
      "80+ LinkedIn Learning Certificates. Continuously expanding my knowledge through courses on JavaScript, TypeScript, Next.js, Software architecture, and intermediate to advanced topics. Focused on best practices, design patterns, and modern development workflows.",
    skills: ["Best Practices", "UI/UX", "Software Architecture", "Software Development Cycle"],
    certifications: [],
  },
  {
    icon: faFreeCodeCamp,
    topic: "Programming Bootcamp",
    institution: "Freecodecamp",
    period: "2021 - 2022",
    details:
      "Completed a comprehensive web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and database management.",
    skills: ["Responsive Design", "JavaScript", "Data Structures", "Algorithms"],
    certifications: [
      "https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/javascript-algorithms-and-data-structures",
      "https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/responsive-web-design",
    ],
  },
  {
    icon: faGraduationCap,
    topic: "B.S. in Information Technology",
    institution: "University of Cebu - Lapulapu and Mandaue",
    period: "2018 - 2022",
    details:
      "Focused on algorithms, distributed systems, and human-computer interaction. Capstone project: An online platform for asynchronous learning and collaboration.",
    skills: ["Programming", "Web Development", "UI/UX", "OOP", "Data Structures"],
    certifications: [],
  },
];

const PREVIEW_LENGTH = 130;

type EducationItem = typeof education[0];

function EducationCard({
  item,
  index,
  onClick,
}: {
  item: EducationItem;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const preview =
    item.details.length > PREVIEW_LENGTH
      ? item.details.slice(0, PREVIEW_LENGTH).trimEnd() + "…"
      : item.details;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative flex flex-col min-h-56 p-7 rounded-2xl border bg-surface backdrop-blur-sm cursor-pointer"
      style={{
        borderColor: isHovered ? "var(--color-accent)" : "var(--color-border)",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Hover fill */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 rounded-2xl bg-accent/5 pointer-events-none"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex gap-4 mb-5">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <FontAwesomeIcon
                icon={item.icon}
                className="text-accent text-lg"
                style={{
                  filter: isHovered ? "drop-shadow(0 0 5px var(--color-accent))" : "none",
                  transition: "filter 0.25s ease",
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
              <h3
                className="font-bold text-lg leading-snug"
                style={{
                  color: isHovered ? "var(--color-accent)" : "var(--color-foreground)",
                  transition: "color 0.25s ease",
                }}
              >
                {item.topic}
              </h3>
              <span className="text-xs text-muted shrink-0 font-mono tracking-tight">
                {item.period}
              </span>
            </div>
            <p className="text-accent text-sm font-semibold">{item.institution}</p>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-sm text-muted leading-relaxed flex-1 mb-4">{preview}</p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs text-muted bg-background/70 border border-border rounded-md px-2.5 py-1"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* View indicator */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-5 right-5 text-accent text-xs flex items-center gap-1.5 font-medium"
      >
        <span>Details</span>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
      </motion.div>
    </motion.div>
  );
}

export default function Education() {
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative py-28 px-6 bg-background overflow-hidden"
    >
      {/* Ambient orbs */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute top-1/4 right-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-block mb-3 text-xs font-mono font-semibold tracking-[0.18em] uppercase text-accent"
          >
            Academic Background
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4"
          >
            Learning &amp;{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Journey
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Formal education, certifications, and self-directed learning that shape my engineering perspective.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="w-14 h-px mx-auto mt-6 bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-5">
          {education.map((item, i) => (
            <EducationCard
              key={item.topic}
              item={item}
              index={i}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)" }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              key="panel"
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-accent/20"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Modal header */}
                <div className="flex gap-5 mb-7">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={selectedItem.icon} className="text-accent text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-foreground text-2xl leading-tight">
                        {selectedItem.topic}
                      </h3>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="w-9 h-9 rounded-lg hover:bg-accent/10 flex items-center justify-center transition-colors duration-200 shrink-0"
                        aria-label="Close"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-muted text-base" />
                      </button>
                    </div>
                    <p className="text-accent text-base font-semibold mb-1">
                      {selectedItem.institution}
                    </p>
                    <p className="text-xs text-muted font-mono tracking-wider">
                      {selectedItem.period}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-linear-to-r from-transparent via-border to-transparent mb-7" />

                <div className="space-y-7">
                  {/* Overview */}
                  <div>
                    <h4 className="text-xs font-semibold text-accent mb-3 uppercase tracking-widest">
                      Overview
                    </h4>
                    <p className="text-base text-foreground leading-relaxed">
                      {selectedItem.details}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-xs font-semibold text-accent mb-3 uppercase tracking-widest">
                      Skills &amp; Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-sm text-foreground bg-accent/8 border border-accent/25 rounded-lg px-4 py-2 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {selectedItem.certifications.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-accent mb-3 uppercase tracking-widest">
                        Certifications
                      </h4>
                      <div className="space-y-2.5">
                        {selectedItem.certifications.map((cert, i) => {
                          let platformName = "Certificate";
                          try {
                            const url = new URL(cert);
                            const part = url.hostname.replace("www.", "").split(".")[0];
                            platformName =
                              part.charAt(0).toUpperCase() + part.slice(1) + " Certification";
                          } catch {
                            // keep default
                          }
                          return (
                            <a
                              key={i}
                              href={cert}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3.5 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-colors duration-200 group/cert"
                            >
                              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                <FontAwesomeIcon
                                  icon={faAward}
                                  className="text-accent text-sm"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground group-hover/cert:text-accent transition-colors duration-200">
                                  {platformName}
                                </p>
                                <p className="text-xs text-muted truncate">{cert}</p>
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                                className="text-accent text-xs opacity-60 group-hover/cert:opacity-100 transition-opacity shrink-0"
                              />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
