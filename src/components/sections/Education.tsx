"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useSkipParallax } from "@/hooks/useSkipParallax";
import { trackEvent } from "@/lib/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faArrowUpRightFromSquare,
  faAward,
  faTimes,
  faCheckCircle,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { faAws, faLinkedin, faFreeCodeCamp } from "@fortawesome/free-brands-svg-icons";

import SectionHeader from "@/components/common/SectionHeader";

interface CertificationUrl {
  label: string;
  url: string;
}

interface Certification {
  title: string;
  urls: CertificationUrl[];
}

interface EducationItem {
  id: string;
  icon: any;
  topic: string;
  institution: string;
  period: string;
  details: string;
  skills: string[];
  certifications: Certification[];
}

const education: EducationItem[] = [
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
            url: "https://www.credly.com/badges/e79b80ec-8669-4174-8817-7b0d2303f10a/linked_in_profile",
          },
        ],
      },
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
            url: "https://www.linkedin.com/learning/certificates/c5fc73084a608efd872113187397a5764ab41f7f4396aa9276ce773d581188b3",
          },
          {
            label: "Docker: Your First Project",
            url: "https://www.linkedin.com/learning/certificates/cc3882d1e1ce99b6464a00d3d0e9e788e13f5559e299b8463407404bcafe0213",
          },
          {
            label: "Learning Docker",
            url: "https://www.linkedin.com/learning/certificates/f05a665c91e7bb6d6895ffc34b3a577249c1d5eb4d381288d50d0df8cfb7b06a",
          },
        ],
      },
      {
        title: "AWS Services",
        urls: [
          {
            label: "AWS for Developers: Identity Access Management (IAM)",
            url: "https://www.linkedin.com/learning/certificates/f05a665c91e7bb6d6895ffc34b3a577249c1d5eb4d381288d50d0df8cfb7b06a",
          },
          {
            label: "Learning Amazon Web Services (AWS) for Developers",
            url: "https://www.linkedin.com/learning/certificates/15857f4ad7860b63681d218220ec7edea9c8b1419595e287ecc7dd254089bc36",
          },
          {
            label: "Prepare for AWS Certified Cloud Practioner (CLF-C02) Certification",
            url: "https://www.linkedin.com/learning/certificates/7c8dfc9484355396e44996eb44118df941814859b079c5f664d21869d1a1e0a7",
          },
          {
            label: "AWS Certified Cloud Practitioner (CLF-C02) Cert Prep: 3 Cloud Technology and Services",
            url: "https://www.linkedin.com/learning/certificates/ba977aedd7322240da0e4c701558a59582247c1530365b6b05de82071bd73e65",
          },
          {
            label: "AWS Certified Cloud Practitioner (CLF-C02) Cert Prep: 4 Billing, Pricing, and Support",
            url: "https://www.linkedin.com/learning/certificates/812e86276a78a5394412a2ecd294047bd4d715ac0c8570b2fcc02149a51ee4ba",
          },
        ],
      },
      {
        title: "Web Development",
        urls: [
          {
            label: "React & Next.js Ecosystem",
            url: "https://www.linkedin.com/learning/certificates/f05a665c91e7bb6d6895ffc34b3a577249c1d5eb4d381288d50d0df8cfb7b06a",
          },
        ],
      },
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
            url: "https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/javascript-algorithms-and-data-structures",
          },
        ],
      },
      {
        title: "Responsive Web Design",
        urls: [
          {
            label: "Certificate",
            url: "https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/responsive-web-design",
          },
        ],
      },
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

const cleanDisplayUrl = (rawUrl: string) => {
  try {
    const urlObj = new URL(rawUrl);
    urlObj.search = "";
    const cleanPath =
      urlObj.pathname.length > 28
        ? urlObj.pathname.slice(0, 25) + "..."
        : urlObj.pathname;
    return `${urlObj.hostname}${cleanPath}`;
  } catch {
    return rawUrl.replace(/^https?:\/\//, "");
  }
};

export default function Education() {
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const skipParallax = useSkipParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Trap Escape key & prevent background scroll when detail modal is active
  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  const getTotalLinksCount = (item: EducationItem) => {
    return item.certifications.reduce((acc, cert) => acc + cert.urls.length, 0);
  };

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

        {/* Card Grid Layout - Strict Uniform Dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {education.map((item, index) => {
            const totalLinks = getTotalLinksCount(item);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-3xl border border-border/80 dark:border-border/50 bg-surface/95 dark:bg-surface/40 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between h-auto md:h-[420px] shadow-md shadow-black/5 dark:shadow-black/25 hover:border-accent/50 hover:bg-surface/100 transition-all duration-300"
              >
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-border/30 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FontAwesomeIcon icon={item.icon} className="text-accent text-lg" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-foreground tracking-tight leading-tight group-hover:text-accent transition-colors truncate">
                          {item.topic}
                        </h3>
                        <p className="text-accent text-xs font-semibold mt-0.5 truncate">{item.institution}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-mono text-foreground/80 border border-border/80 rounded-lg px-2.5 py-1 bg-background/80 shadow-xs">
                      {item.period}
                    </span>
                  </div>

                  {/* Details - Line Clamped for Uniform Layout */}
                  <p className="text-sm text-foreground/85 leading-relaxed line-clamp-3 my-3">
                    {item.details}
                  </p>

                  {/* Uniform Credential Preview Button Trigger */}
                  <div className="mt-auto mb-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-background/60 hover:bg-background border border-border/70 hover:border-accent transition-all duration-300 group/btn cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FontAwesomeIcon
                          icon={item.id === "university" ? faGraduationCap : faAward}
                          className="text-accent text-xs shrink-0 group-hover/btn:scale-110 transition-transform"
                        />
                        <span className="text-xs font-semibold text-foreground group-hover/btn:text-accent transition-colors truncate">
                          {item.certifications.length > 0
                            ? `${item.certifications.length} Cert ${item.certifications.length === 1 ? "Track" : "Tracks"} (${totalLinks} ${totalLinks === 1 ? "Link" : "Links"})`
                            : "Bachelor Degree Credential"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-accent shrink-0 ml-2">
                        View Details →
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bottom Section: Skills preview */}
                <div className="shrink-0 pt-3 border-t border-border/30">
                  <div className="flex flex-wrap gap-1.5 max-h-[34px] overflow-hidden">
                    {item.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-foreground/80 bg-background/80 border border-border/70 rounded-md px-2.5 py-0.5 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                    {item.skills.length > 4 && (
                      <span className="text-[10px] text-accent bg-accent/10 border border-accent/20 rounded-md px-2 py-0.5 font-mono font-semibold">
                        +{item.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Overdrive Education Details & Credentials Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edu-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-surface/95 dark:bg-surface/95 border border-border/80 dark:border-border/60 rounded-3xl shadow-2xl z-10 backdrop-blur-xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header - Fixed Top */}
              <div className="flex items-start justify-between gap-4 p-6 md:px-8 md:pt-8 md:pb-5 border-b border-border/40 shrink-0 bg-surface/95 dark:bg-surface/95 backdrop-blur-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={selectedItem.icon} className="text-accent text-xl" />
                  </div>
                  <div>
                    <h3 id="edu-modal-title" className="text-xl font-bold text-foreground tracking-tight leading-tight">
                      {selectedItem.topic}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-accent font-semibold">{selectedItem.institution}</p>
                      <span className="text-foreground/40">•</span>
                      <span className="text-xs font-mono text-foreground/75">{selectedItem.period}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-background/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              </div>

              {/* Scrollable Body Container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                <div>
                  <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                    Journey Details
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {selectedItem.details}
                  </p>
                </div>

                {/* Certifications or Degree Badge */}
                <div>
                  <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-3">
                    {selectedItem.certifications.length > 0
                      ? `Certifications & Verified Badges (${getTotalLinksCount(selectedItem)})`
                      : "Degree Credential"}
                  </h4>

                  {selectedItem.certifications.length > 0 ? (
                    <div className="space-y-4">
                      {selectedItem.certifications.map((cert, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-background/50 border border-border/70 space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faAward} className="text-accent text-xs shrink-0" />
                            <h5 className="text-xs font-bold text-foreground">{cert.title}</h5>
                          </div>
                          <div className="grid grid-cols-1 gap-2 pl-4">
                            {cert.urls.map((link, j) => (
                              <a
                                key={j}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  trackEvent("portfolio_certification_click", {
                                    certification_url: link.url,
                                    title: cert.title,
                                  });
                                }}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/80 hover:border-accent transition-all group/link cursor-pointer"
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="text-xs font-semibold text-foreground group-hover/link:text-accent transition-colors truncate">
                                    {link.label}
                                  </p>
                                  <p className="text-[9px] text-foreground/50 truncate font-mono mt-0.5">
                                    {cleanDisplayUrl(link.url)}
                                  </p>
                                </div>
                                <FontAwesomeIcon
                                  icon={faArrowUpRightFromSquare}
                                  className="text-foreground/50 text-xs group-hover/link:text-accent transition-colors shrink-0"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-background/50 border border-border/70 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-accent text-base shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Bachelor of Science in Information Technology
                          </p>
                          <p className="text-[10px] text-foreground/60">
                            University of Cebu - Lapulapu and Mandaue
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-accent font-semibold">
                        Graduated 2022
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills Focus */}
                <div>
                  <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2.5">
                    Skills & Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-background border border-border/80 text-foreground/90 shadow-xs"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="text-accent text-[10px]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Close action */}
                <div className="pt-4 border-t border-border/40 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}


