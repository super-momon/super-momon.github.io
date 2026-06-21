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

// Magnetic skill card component with 3D hover effect
function SkillCard({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          delay: index * 0.03,
          ease: [0.22, 1, 0.36, 1] // Cubic bezier for smooth easing
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <motion.div
        animate={{
          x: mousePosition.x * 0.15,
          y: mousePosition.y * 0.15,
          rotateX: mousePosition.y * 0.1,
          rotateY: mousePosition.x * -0.1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.5
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="relative flex flex-col items-center justify-center p-6 rounded-2xl
                   bg-background 
                   border border-border
                   hover:border-accent
                   w-32.5 h-32.5
                   backdrop-blur-sm
                   transition-colors duration-300
                   will-change-transform
                   overflow-hidden"
      >
        {/* Glassmorphism overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent"
          style={{ transform: "translateZ(0)" }}
        />

        {/* Atmospheric grain texture */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Icon with subtle float on hover */}
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            z: isHovered ? 20 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <i
            className={skill.icon}
            style={{
              fontSize: "2.5rem",
              filter: isHovered ? "drop-shadow(0 0 8px var(--color-accent))" : "none",
              transition: "filter 0.3s ease"
            }}
          />
        </motion.div>

        {/* Name with depth */}
        <motion.span
          animate={{
            z: isHovered ? 15 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="mt-4 text-sm font-medium text-center text-foreground
                     transition-colors duration-300"
        >
          {skill.name}
        </motion.span>

        {/* Glow effect on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl blur-xl bg-accent"
          style={{
            transform: "translateZ(-10px)",
            zIndex: -1
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect for heading
  const headingY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32 px-6 bg-surface overflow-hidden"
    >
      {/* Background decorative elements */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute top-20 left-[10%] w-72 h-72 rounded-full 
                   bg-accent/5 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full 
                   bg-accent/5 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium heading with dramatic scale */}
        <motion.div
          ref={headingRef}
          style={{
            y: headingY,
            opacity: headingOpacity
          }}
          className="mb-20 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1
            }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold 
                       text-foreground mb-6
                       tracking-tight leading-none"
            style={{
              fontVariantNumeric: "proportional-nums",
            }}
          >
            Skills &amp; <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-linear-to-r 
                           from-accent to-accent-hover">
              Tech Stack
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2
            }}
            className="text-muted text-lg md:text-xl 
                       max-w-2xl mx-auto leading-relaxed"
          >
            Technologies I worked with and have hands-on experience in.
            I&apos;m always eager to learn new tools and frameworks.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4
            }}
            className="w-24 h-1 mx-auto mt-8 rounded-full
                       bg-linear-to-r from-transparent via-accent to-transparent"
          />
        </motion.div>

        {/* Skills grid with magnetic cards */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 perspective-1000">
          {skills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 
                      bg-linear-to-t from-surface to-transparent 
                      pointer-events-none" />
    </section>
  );
}
