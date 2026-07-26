"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { trackEvent } from "@/lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faArrowUpRightFromSquare, faAward } from "@fortawesome/free-solid-svg-icons";
import { faAws, faLinkedin, faFreeCodeCamp } from "@fortawesome/free-brands-svg-icons";

import SectionHeader from "@/components/common/SectionHeader";

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
    certifications: [
      {
        title: "AWS Cloud Quest: Cloud Practitioner",
        urls: [
          {
            label: "Credly Badge",
            url: "https://www.credly.com/badges/e79b80ec-8669-4174-8817-7b0d2303f10a/linked_in_profile"
          }
        ]
      }
    ],
  },
  {
    id: "linkedin-learning",
    icon: faLinkedin,
    topic: "Various Software Engineering Courses",
    institution: "LinkedIn Learning",
    period: "2022 - Present",
    details:
      "80+ LinkedIn Learning Certificates. Continuously expanding my knowledge through courses on JavaScript, TypeScript, Next.js, Software architecture, and intermediate to advanced topics. Focused on best practices, design patterns, and modern development workflows.",
    skills: ["Best Practices", "UI/UX", "Software Architecture", "Software Development Cycle"],
    certifications: [
      {
        title: "Docker",
        urls: [
          {
            label: "Docker Foundations Professional",
            url: "https://www.linkedin.com/learning/certificates/c5fc73084a608efd872113187397a5764ab41f7f4396aa9276ce773d581188b3"
          },
          {
            label: "Docker: Your First Project",
            url: "https://www.linkedin.com/learning/certificates/cc3882d1e1ce99b6464a00d3d0e9e788e13f5559e299b8463407404bcafe0213"
          },
          {
            label: "Learning Docker",
            url: "https://www.linkedin.com/learning/certificates/f05a665c91e7bb6d6895ffc34b3a577249c1d5eb4d381288d50d0df8cfb7b06a"
          }
        ]
      },
      {
        title: "AWS Services",
        urls: [
          {
            label: "AWS for Developers: Identity Access Management (IAM)",
            url: "https://www.linkedin.com/learning/certificates/f05a665c91e7bb6d6895ffc34b3a577249c1d5eb4d381288d50d0df8cfb7b06a"
          },
          {
            label: "Learning Amazon Web Services (AWS) for Developers",
            url: "https://www.linkedin.com/learning/certificates/15857f4ad7860b63681d218220ec7edea9c8b1419595e287ecc7dd254089bc36"
          },
          {
            label: "Prepare for AWS Certified Cloud Practioner (CLF-C02) Certification",
            url: "https://www.linkedin.com/learning/certificates/7c8dfc9484355396e44996eb44118df941814859b079c5f664d21869d1a1e0a7"
          },
          {
            label: "AWS Certified Cloud Practitioner (CLF-C02) Cert Prep: 3 Cloud Technology and Services",
            url: "https://www.linkedin.com/learning/certificates/ba977aedd7322240da0e4c701558a59582247c1530365b6b05de82071bd73e65"
          },
          {
            label: "AWS Certified Cloud Practitioner (CLF-C02) Cert Prep: 4 Billing, Pricing, and Support",
            url: "https://www.linkedin.com/learning/certificates/812e86276a78a5394412a2ecd294047bd4d715ac0c8570b2fcc02149a51ee4ba"
          }
        ]
      },
      {
        title: "Web Development",
        urls: [
          {
            label: "React & Next.js Ecosystem",
            url: "https://www.linkedin.com/learning/certificates/f05a665c91e7bb6d6895ffc34b3a577249c1d5eb4d381288d50d0df8cfb7b06a"
          }
        ]
      }
    ],
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
      {
        title: "JavaScript Algorithms & Data Structures",
        urls: [
          {
            label: "Certificate",
            url: "https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/javascript-algorithms-and-data-structures"
          }
        ]
      },
      {
        title: "Responsive Web Design",
        urls: [
          {
            label: "Certificate",
            url: "https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/responsive-web-design"
          }
        ]
      }
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

interface CertificationUrl {
  label: string;
  url: string;
}

interface Certification {
  title: string;
  urls: CertificationUrl[];
}

const cleanDisplayUrl = (rawUrl: string) => {
  try {
    const urlObj = new URL(rawUrl);
    urlObj.search = "";
    const cleanPath = urlObj.pathname.length > 28
      ? urlObj.pathname.slice(0, 25) + "..."
      : urlObj.pathname;
    return `${urlObj.hostname}${cleanPath}`;
  } catch {
    return rawUrl.replace(/^https?:\/\//, "");
  }
};

export default function Education() {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Trap Escape key press & prevent background scrolling when modal is active
  useEffect(() => {
    if (!activeCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCert(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCert]);

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
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-noise" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Academic Background"
          titlePrefix="Learning &"
          titleItalic="Journey"
          subtitle="Formal education, certifications, and self-directed learning that shape my engineering perspective."
        />

        {/* Card Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between shadow-md shadow-black/5 dark:shadow-black/25 hover:border-accent/50 hover:bg-surface/100 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FontAwesomeIcon icon={item.icon} className="text-accent text-lg" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground tracking-tight leading-tight group-hover:text-accent transition-colors">
                        {item.topic}
                      </h3>
                      <p className="text-accent text-xs font-semibold mt-0.5">{item.institution}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-mono text-foreground/80 border border-border/80 rounded-lg px-2.5 py-1 bg-background/80 shadow-xs">
                    {item.period}
                  </span>
                </div>

                {/* Details */}
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {item.details}
                </p>

                {/* Certifications or Degree Badge */}
                {item.certifications.length > 0 ? (
                  <div className="pt-2">
                    <h4 className="text-[10px] font-bold text-foreground/60 mb-2.5 uppercase tracking-widest">
                      Certifications & Credentials
                    </h4>
                    <div className="flex flex-col gap-2">
                      {item.certifications.map((cert, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveCert(cert)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-background/60 border border-border/70 hover:bg-background hover:border-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300 group/cert cursor-pointer text-left w-full"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FontAwesomeIcon
                              icon={faAward}
                              className="text-foreground/70 text-xs group-hover/cert:text-accent transition-colors shrink-0"
                            />
                            <span className="text-xs font-semibold text-foreground group-hover/cert:text-accent transition-colors truncate">
                              {cert.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-accent/80 shrink-0 ml-2">
                            {cert.urls.length} link{cert.urls.length !== 1 ? "s" : ""} →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : item.id === "university" ? (
                  <div className="pt-2">
                    <h4 className="text-[10px] font-bold text-foreground/60 mb-2.5 uppercase tracking-widest">
                      Degree Credential
                    </h4>
                    <div className="p-2.5 rounded-xl bg-background/60 border border-border/70 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-accent text-xs shrink-0" />
                        <span className="text-xs font-semibold text-foreground truncate">
                          Major in Information Technology
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-accent/80 shrink-0 ml-2">
                        Bachelor Degree
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-6 border-t border-border/30">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs text-foreground/80 bg-background/80 border border-border/70 rounded-md px-2.5 py-1 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Certification Links Modal */}
      <AnimatePresence>
        {activeCert && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-surface/95 dark:bg-surface/90 border border-border/80 dark:border-border/60 rounded-2xl p-6 shadow-2xl z-10 backdrop-blur-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-5 pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faAward} className="text-accent text-lg" />
                  </div>
                  <div>
                    <h3 id="cert-modal-title" className="text-sm font-bold text-foreground tracking-tight leading-tight">
                      {activeCert.title}
                    </h3>
                    <p className="text-[10px] text-foreground/50 mt-0.5">Credential Links</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-background/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links list */}
              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {activeCert.urls.map((link, j) => (
                  <a
                    key={j}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent("portfolio_certification_click", {
                        certification_url: link.url,
                        title: activeCert.title,
                      });
                      setActiveCert(null);
                    }}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background/50 border border-border/80 hover:bg-background hover:border-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300 group/link cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground group-hover/link:text-accent transition-colors duration-200 truncate">
                        {link.label}
                      </p>
                      <p className="text-[9px] text-foreground/45 truncate mt-0.5 font-mono">{cleanDisplayUrl(link.url)}</p>
                    </div>
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="text-foreground/50 text-[10px] group-hover/link:text-accent transition-colors shrink-0"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

