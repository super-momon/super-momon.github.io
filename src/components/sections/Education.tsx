"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import { useState, useRef } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faArrowUpRightFromSquare, faAward, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faAws, faLinkedin, faFreeCodeCamp } from "@fortawesome/free-brands-svg-icons";

const education = [
  {
    id: "aws-services",
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
    id: "linkedin-learning",
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
    id: "freecodecamp",
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
    id: "university",
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

export default function Education() {
  const [activeTopicId, setActiveTopicId] = useState("aws-services");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const active = education.find((item) => item.id === activeTopicId) || education[0];

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative py-28 px-6 bg-background overflow-hidden"
    >
      {/* Ambient orbs */}
      <motion.div
        style={skipParallax ? undefined : { y: orb1Y }}
        className="absolute top-1/4 right-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />
      <motion.div
        style={skipParallax ? undefined : { y: orb2Y }}
        className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
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
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4 text-balance"
          >
            Learning &amp;{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 pr-2 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Journey
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="text-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
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

        {/* Split layout: dashboard explorer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Column: Selector */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Learning Hub Header Card */}
            <div className="relative p-5 rounded-3xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30 flex flex-col gap-4 items-center text-center">
              <div className="relative w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faBookOpen} className="text-accent text-2xl" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground tracking-tight">Credentials Hub</h3>
                <p className="text-xs text-foreground/75 font-mono font-medium tracking-wide">Academics &amp; Certs</p>
              </div>
            </div>

            {/* Interactive Tabs list */}
            <div className="flex flex-col gap-2 p-2 rounded-2xl bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 shadow-md shadow-black/5 dark:shadow-black/30">
              
              {/* Mobile tabs row */}
              <div 
                style={{ scrollbarWidth: "none" }}
                className="flex flex-row lg:hidden gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
              >
                {education.map((item) => {
                  const isActive = activeTopicId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTopicId(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-background/85 shadow-xs border-border/50 text-accent font-bold"
                          : "bg-transparent border-transparent text-foreground/75 hover:text-foreground hover:bg-background/20"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className={`text-xs ${isActive ? "text-accent" : "text-foreground/50"}`} />
                      <span className="text-[10px] font-semibold tracking-tight">{item.topic.split(" ").pop()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop vertical tabs */}
              <div className="hidden lg:flex flex-col gap-1.5">
                {education.map((item) => {
                  const isActive = activeTopicId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTopicId(item.id)}
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
                          icon={item.icon}
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
                          {item.topic}
                        </span>
                        <span className="text-[10px] text-foreground/60 font-normal leading-normal mt-0.5 max-w-[200px] truncate group-hover:text-foreground/85 transition-colors duration-300">
                          {item.institution}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detail Panel */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div className="relative min-h-[320px] h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopicId}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 md:p-8 rounded-2xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/35 h-full flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pb-4 border-b border-border/30">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight leading-tight mb-1">
                          {active.topic}
                        </h3>
                        <p className="text-accent text-sm font-semibold mb-1.5">{active.institution}</p>
                      </div>
                      <span className="shrink-0 self-start text-xs font-mono text-foreground/80 border border-border/80 rounded-lg px-3 py-1.5 bg-surface/90 shadow-xs">
                        {active.period}
                      </span>
                    </div>

                    {/* Details Description */}
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/60 mb-2 uppercase tracking-widest">
                        Overview &amp; Experience
                      </h4>
                      <p className="text-sm text-foreground/85 leading-relaxed font-normal">
                        {active.details}
                      </p>
                    </div>

                    {/* Certifications (if any) */}
                    {active.certifications.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-[10px] font-bold text-foreground/60 mb-3 uppercase tracking-widest">
                          Certifications Links
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {active.certifications.map((cert, i) => {
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
                                className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/80 hover:bg-background hover:border-accent transition-all duration-300 group/cert cursor-pointer"
                              >
                                <div className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center shrink-0">
                                  <FontAwesomeIcon
                                    icon={faAward}
                                    className="text-foreground/75 text-sm group-hover/cert:text-accent transition-colors"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-foreground group-hover/cert:text-accent transition-colors duration-200 truncate">
                                    {platformName}
                                  </p>
                                  <p className="text-[10px] text-foreground/50 truncate">{cert.replace("https://", "")}</p>
                                </div>
                                <FontAwesomeIcon
                                  icon={faArrowUpRightFromSquare}
                                  className="text-foreground/50 text-[10px] group-hover/cert:text-accent transition-colors shrink-0"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-6 mt-6 border-t border-border/30">
                    {active.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-foreground/80 bg-background border border-border/80 rounded-md px-2.5 py-1 font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
