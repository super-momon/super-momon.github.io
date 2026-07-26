"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import SectionHeader from "@/components/common/SectionHeader";

const skillCategories = [
  {
    title: "Backend & Languages",
    description: "Core programming languages and backend frameworks",
    items: [
      { name: "C#", icon: "devicon-csharp-plain" },
      { name: ".Net", icon: "devicon-dotnetcore-plain" },
      { name: "TypeScript", icon: "devicon-typescript-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "Node.js", icon: "devicon-nodejs-plain-wordmark" },
    ],
  },
  {
    title: "Frontend & UI",
    description: "Modern web application frameworks and user interfaces",
    items: [
      { name: "React", icon: "devicon-react-original" },
      { name: "Next.js", icon: "devicon-nextjs-line" },
      { name: "Blazor", icon: "devicon-blazor-original" },
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "Bootstrap", icon: "devicon-bootstrap-plain" },
      { name: "JQuery", icon: "devicon-jquery-plain" },
    ],
  },
  {
    title: "Databases & APIs",
    description: "Data persistence, object-relational mapping, and query languages",
    items: [
      { name: "MSSQL Server", icon: "devicon-microsoftsqlserver-plain" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
      { name: "MongoDB", icon: "devicon-mongodb-plain" },
      { name: "GraphQL", icon: "devicon-graphql-plain" },
      { name: "Entity Framework", icon: "devicon-entityframeworkcore-plain" },
      { name: "JSON", icon: "devicon-json-plain" },
    ],
  },
  {
    title: "Cloud & Developer Tools",
    description: "Infrastructure, containers, version control, and collaboration",
    items: [
      { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
      { name: "Docker", icon: "devicon-docker-plain" },
      { name: "Git", icon: "devicon-git-plain" },
      { name: "Postman", icon: "devicon-postman-plain" },
      { name: "Figma", icon: "devicon-figma-plain" },
      { name: "Jira", icon: "devicon-jira-plain" },
    ],
  },
];

function SkillPill({ skill, index }: { skill: { name: string; icon: string }; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.35,
          delay: index * 0.03,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl
                 bg-background/80 dark:bg-background/50 backdrop-blur-md
                 border border-border/70 cursor-default select-none shadow-xs shadow-black/5"
      style={{
        borderColor: isHovered ? "var(--color-accent)" : undefined,
        transition: "all 0.3s ease",
      }}
    >
      <i
        className={skill.icon}
        style={{
          fontSize: "1.2rem",
          lineHeight: 1,
          filter: isHovered ? "drop-shadow(0 0 5px var(--color-accent))" : "none",
          transition: "filter 0.2s ease",
        }}
      />
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

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
        style={skipParallax ? undefined : { y: orb1Y }}
        className="absolute top-[5%] left-[8%] w-72 h-72 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />
      <motion.div
        style={skipParallax ? undefined : { y: orb2Y }}
        className="absolute bottom-[5%] right-[8%] w-72 h-72 rounded-full bg-accent/6 blur-3xl pointer-events-none will-change-transform"
      />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-noise" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Technical Stack"
          titlePrefix="Skills &"
          titleItalic="Technologies"
          subtitle="A categorized overview of the languages, frameworks, cloud services, and engineering tools I work with."
        />

        {/* Categorized Skill Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: catIdx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 md:p-7 rounded-2xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl shadow-md shadow-black/5 dark:shadow-black/25 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-background border border-border/70 text-foreground/75">
                    {category.items.length} Techs
                  </span>
                </div>
                <p className="text-xs text-foreground/70 mb-5 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIdx) => (
                    <SkillPill key={item.name} skill={item} index={itemIdx} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
