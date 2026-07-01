"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

const skills = [

  {
    name: "TypeScript",
    icon: "devicon-typescript-plain",
  },
  {
    name: "Blazor",
    icon: "devicon-blazor-original",
  },
  {
    name: "React",
    icon: "devicon-react-original",
  },
  {
    name: "Next.js",
    icon: "devicon-nextjs-line",
  },
  {
    name: ".Net",
    icon: "devicon-dotnetcore-plain",
  },
  {
    name: "Node.js",
    icon: "devicon-nodejs-plain-wordmark",
  },
  {
    name: "MSSQL Server",
    icon: "devicon-microsoftsqlserver-plain",
  },
  {
    name: "PostgreSQL",
    icon: "devicon-postgresql-plain",
  },
  {
    name: "MongoDB",
    icon: "devicon-mongodb-plain",
  },
  {
    name: "GraphQL",
    icon: "devicon-graphql-plain",
  },
  {
    name: "Git",
    icon: "devicon-git-plain",
  },
  {
    name: "Docker",
    icon: "devicon-docker-plain",
  },
  {
    name: "Postman",
    icon: "devicon-postman-plain",
  },
  {
    name: "AWS",
    icon: "devicon-amazonwebservices-plain-wordmark",
  },
  {
    name: "HTML",
    icon: "devicon-html5-plain",
  },
  {
    name: "C#",
    icon: "devicon-csharp-plain",
  },
  {
    name: "CSS",
    icon: "devicon-css3-plain",
  },
  {
    name: "Bootstrap",
    icon: "devicon-bootstrap-plain",
  },
  {
    name: "JavaScript",
    icon: "devicon-javascript-plain",
  },
  {
    name: "Entity Framework",
    icon: "devicon-entityframeworkcore-plain",
  },
  {
    name: "Figma",
    icon: "devicon-figma-plain",
  },
  {
    name: "Jira",
    icon: "devicon-jira-plain",
  },
  {
    name: "JQuery",
    icon: "devicon-jquery-plain",
  },
  {
    name: "JSON",
    icon: "devicon-json-plain",
  },
];

function SkillPill({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.45,
          delay: index * 0.022,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                 bg-background/70 backdrop-blur-sm
                 border cursor-default select-none will-change-transform"
      style={{
        borderColor: isHovered ? "var(--color-accent)" : "var(--color-border)",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Hover background fill */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-xl bg-accent/6 pointer-events-none"
      />

      <i
        className={skill.icon}
        style={{
          fontSize: "1.25rem",
          lineHeight: 1,
          filter: isHovered
            ? "drop-shadow(0 0 5px var(--color-accent))"
            : "none",
          transition: "filter 0.2s ease",
          position: "relative",
        }}
      />
      <span className="relative text-sm font-medium text-foreground whitespace-nowrap">
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-28 px-6 bg-surface overflow-hidden"
    >
      {/* Ambient background orbs */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute top-[5%] left-[8%] w-72 h-72 rounded-full bg-accent/6 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-[5%] right-[8%] w-72 h-72 rounded-full bg-accent/6 blur-3xl pointer-events-none"
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
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-block mb-3 text-xs font-mono font-semibold tracking-[0.18em] uppercase text-accent"
          >
            Technical Stack
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
            className="text-2xl md:text-3xl font-bold text-foreground
                       tracking-tight leading-tight mb-4"
          >
            Skills &amp;{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 inline-block"
              style={{ fontStyle: "italic" }}
            >
              Technologies
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Technologies I work with and have hands-on experience in.
            I&apos;m always eager to learn new tools and frameworks.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="w-14 h-px mx-auto mt-6 bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Skill pills */}
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          {skills.map((skill, i) => (
            <SkillPill key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24
                      bg-linear-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
