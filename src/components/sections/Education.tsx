"use client";

import { FadeIn } from "@/components/FadeIn";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faArrowUpRightFromSquare, faXmark, faAward, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
      'https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/javascript-algorithms-and-data-structures',
      'https://www.freecodecamp.org/certification/fcc4e2e9e02-23a3-4ff6-bba0-ce4e3dc66009/responsive-web-design',
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

const MAX_TEXT_LENGTH = 120;
const MAX_SKILLS_PREVIEW = 5;

export default function Education() {
  const [selectedItem, setSelectedItem] = useState<typeof education[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selectedItem) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [selectedItem]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <section id="education" className="relative py-32 px-6 overflow-hidden">
      {/* Atmospheric noise overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold text-[var(--color-foreground)] leading-[0.95] tracking-tight mb-6">
              Continuous
              <br />
              <span className="text-[var(--color-accent)]">Learning Journey</span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto font-light">
              A curated collection of formal education, certifications, and self-directed learning
              that shapes my engineering perspective and technical foundation.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-6">
          {education.map((item, i) => (
            <FadeIn key={item.topic} delay={i * 0.1}>
              <div
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => setSelectedItem(item)}
                onMouseMove={(e) => handleCardMouseMove(e, i)}
                onMouseLeave={() => handleCardMouseLeave(i)}
                className="group relative h-[280px] p-8 rounded-2xl border border-[var(--color-border)] 
                           bg-[var(--color-surface)] flex flex-col cursor-pointer
                           transition-all duration-300 ease-out
                           hover:border-[var(--color-accent)]
                           hover:shadow-[0_20px_60px_-15px_rgba(0,199,88,0.2)]
                           active:scale-[0.98]"
                style={{
                  transition: 'transform 0.1s ease-out, border-color 0.3s, box-shadow 0.3s',
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-[var(--color-accent)] opacity-0 
                                group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />

                <div className="flex gap-4 mb-4 relative z-10">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center
                                    group-hover:bg-[var(--color-accent)]/20 transition-colors duration-300
                                    group-hover:shadow-[0_0_20px_rgba(0,199,88,0.3)]">
                      <FontAwesomeIcon icon={item.icon} className="text-[var(--color-accent)] text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-[var(--color-foreground)] text-lg group-hover:text-[var(--color-accent)] 
                                     transition-colors duration-300">
                        {item.topic}
                      </h3>
                      <span className="text-xs text-[var(--color-muted)] shrink-0 font-medium uppercase tracking-wider">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-[var(--color-accent)] text-sm font-semibold">
                      {item.institution}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                    {truncateText(item.details, MAX_TEXT_LENGTH)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.skills.slice(0, MAX_SKILLS_PREVIEW).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-[var(--color-muted)] bg-[var(--color-accent)]/5 
                                   border border-[var(--color-border)] rounded-full px-3 py-1.5
                                   transition-all duration-300
                                   group-hover:border-[var(--color-accent)]/30 group-hover:bg-[var(--color-accent)]/10"
                      >
                        {skill}
                      </span>
                    ))}
                    {item.skills.length > MAX_SKILLS_PREVIEW && (
                      <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent)]/10 
                                       border border-[var(--color-accent)]/30 rounded-full px-3 py-1.5 font-semibold">
                        +{item.skills.length - MAX_SKILLS_PREVIEW}
                      </span>
                    )}
                  </div>
                </div>

                {/* Click indicator */}
                <div className="absolute bottom-6 right-6 text-[var(--color-muted)] text-xs 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Premium Modal */}
      {selectedItem && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 
                      ${modalOpen ? 'opacity-100' : 'opacity-0'}
                      transition-opacity duration-300`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(12px)',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={`bg-[var(--color-surface)] rounded-3xl shadow-2xl max-w-2xl w-full 
                        max-h-[90vh] overflow-y-auto border-2 border-[var(--color-accent)]/20
                        ${modalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                        transition-all duration-300 ease-out`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 199, 88, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10">
              {/* Header */}
              <div className="flex gap-5 mb-8">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center
                                  shadow-[0_0_30px_rgba(0,199,88,0.2)] border border-[var(--color-accent)]/20">
                    <FontAwesomeIcon icon={selectedItem.icon} className="text-[var(--color-accent)] text-2xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-[var(--color-foreground)] text-3xl leading-tight">
                      {selectedItem.topic}
                    </h3>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="shrink-0 w-10 h-10 rounded-xl hover:bg-[var(--color-accent)]/10 
                                 flex items-center justify-center transition-all duration-300
                                 hover:scale-110 active:scale-95 group"
                      aria-label="Close modal"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-[var(--color-muted)] text-xl group-hover:text-[var(--color-accent)] transition-colors" />
                    </button>
                  </div>
                  <p className="text-[var(--color-accent)] text-lg font-bold mb-1">
                    {selectedItem.institution}
                  </p>
                  <p className="text-sm text-[var(--color-muted)] font-medium uppercase tracking-widest">
                    {selectedItem.period}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mb-8" />

              {/* Content */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-accent)] mb-3 uppercase tracking-widest">
                    Overview
                  </h4>
                  <p className="text-base text-[var(--color-foreground)] leading-relaxed">
                    {selectedItem.details}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[var(--color-accent)] mb-4 uppercase tracking-widest">
                    Skills & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedItem.skills.map((skill, index) => (
                      <span
                        key={skill}
                        className="text-sm text-[var(--color-foreground)] bg-[var(--color-accent)]/10 
                                   border border-[var(--color-accent)]/30 rounded-xl px-5 py-2.5 font-medium
                                   hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/50
                                   transition-all duration-300 hover:scale-105 hover:shadow-lg
                                   cursor-default"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {selectedItem.certifications && selectedItem.certifications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-accent)] mb-4 uppercase tracking-widest">
                      Certifications
                    </h4>
                    <div className="space-y-3">
                      {selectedItem.certifications.map((cert, index) => {
                        // Extract domain/platform from URL for display
                        let platformName = "View Certificate";
                        try {
                          const url = new URL(cert);
                          const hostname = url.hostname.replace('www.', '');
                          platformName = hostname.split('.')[0];
                          platformName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
                        } catch (e) {
                          // Keep default if URL parsing fails
                        }

                        return (
                          <a
                            key={index}
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-between gap-4 p-4 rounded-xl
                                       bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20
                                       hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/40
                                       hover:shadow-[0_8px_30px_rgba(0,199,88,0.15)]
                                       transition-all duration-300 hover:translate-x-1
                                       active:scale-[0.98] overflow-hidden"
                            style={{
                              animationDelay: `${index * 75}ms`,
                            }}
                          >
                            {/* Animated glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)]/10 to-transparent 
                                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </div>

                            <div className="flex items-center gap-3 flex-1 relative z-10">
                              <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 
                                              border border-[var(--color-accent)]/30
                                              flex items-center justify-center shrink-0
                                              group-hover:bg-[var(--color-accent)]/20 
                                              group-hover:shadow-[0_0_15px_rgba(0,199,88,0.3)]
                                              transition-all duration-300">
                                <FontAwesomeIcon icon={faAward} className="text-[var(--color-accent)]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[var(--color-foreground)] 
                                              group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                  {platformName} Certification
                                </p>
                                <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                                  {cert}
                                </p>
                              </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-2 text-[var(--color-accent)] shrink-0">
                              <span className="text-xs font-medium uppercase tracking-wider opacity-0 
                                               group-hover:opacity-100 transition-opacity duration-300">
                                View
                              </span>
                              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
