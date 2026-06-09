"use client";

import { FadeIn } from "@/components/FadeIn";
import { useState } from "react";

const education = [
  {
    icon: "fa-brands fa-aws",
    topic: "AWS Services",
    institution: "AWS Skill Builder",
    period: "2024 - Present",
    details:
      "Gained hands-on experience with AWS services including EC2, S3, Lambda, and RDS. Contributed to several projects using AWS Services, learning about cloud architecture, serverless computing, and best practices for scalability and security.",
    skills: ["AWS", "Cloud Computing", "Serverless", "DevOps"],
  },
  {
    icon: "fa-brands fa-linkedin",
    topic: "Various Programming Courses",
    institution: "LinkedIn Learning",
    period: "2022 - Present",
    details:
      "80+ LinkedIn Learning Certificates. Continuously expanding my knowledge through courses on JavaScript, TypeScript, Next.js, Software architecture, and intermediate to advanced topics. Focused on best practices, design patterns, and modern development workflows.",
    skills: ["Best Practices", "UI/UX", "Software Architecture", "Software Development Cycle"],
  },
  {
    icon: "fa-brands fa-free-code-camp",
    topic: "Programming Bootcamp",
    institution: "Freecodecamp",
    period: "2021 - 2022",
    details:
      "Completed a comprehensive web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and database management.",
    skills: ["Responsive Design", "JavaScript", "Data Structures", "Algorithms"],
  },
  {
    icon: "fa-solid fa-graduation-cap",
    topic: "B.S. in Information Technology",
    institution: "University of Cebu - Lapulapu and Mandaue",
    period: "2018 - 2022",
    details:
      "Focused on algorithms, distributed systems, and human-computer interaction. Capstone project: An online platform for asynchronous learning and collaboration.",
    skills: ["Programming", "Web Development", "UI/UX", "OOP", "Data Structures"],
  },
];

const MAX_TEXT_LENGTH = 120;
const MAX_SKILLS_PREVIEW = 5;

export default function Education() {
  const [selectedItem, setSelectedItem] = useState<typeof education[0] | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-12 text-center">
            Educational Journey & Growth
          </h2>
        </FadeIn>

        <div className="space-y-6 grid sm:grid-cols-2 gap-6">
          {education.map((item, i) => (
            <FadeIn key={item.topic} delay={i * 0.1}>
              <div
                onClick={() => setSelectedItem(item)}
                className="h-[250px] p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col cursor-pointer hover:border-[var(--color-accent)] transition-colors duration-200 hover:shadow-lg"
              >
                <div className="flex gap-4 mb-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                      <i className={`text-[var(--color-accent)] ${item.icon || "fa-solid fa-graduation-cap"}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <h3 className="font-semibold text-[var(--color-foreground)] text-base">
                        {item.topic}
                      </h3>
                      <span className="text-xs text-[var(--color-muted)] shrink-0">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-[var(--color-accent)] text-sm font-medium mt-1">
                      {item.institution}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-3">
                    {truncateText(item.details, MAX_TEXT_LENGTH)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.skills.slice(0, MAX_SKILLS_PREVIEW).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs text-[var(--color-muted)] bg-[var(--color-accent)]/5 border border-[var(--color-border)] rounded-full px-3 py-1"
                      >
                        {skill}
                      </span>
                    ))}
                    {item.skills.length > MAX_SKILLS_PREVIEW && (
                      <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/30 rounded-full px-3 py-1 font-medium">
                        +{item.skills.length - MAX_SKILLS_PREVIEW} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[var(--color-surface)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--color-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex gap-4 mb-6">
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <i className={`text-[var(--color-accent)] text-xl ${selectedItem.icon || "fa-solid fa-graduation-cap"}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-[var(--color-foreground)] text-2xl">
                      {selectedItem.topic}
                    </h3>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="shrink-0 w-8 h-8 rounded-lg hover:bg-[var(--color-accent)]/10 flex items-center justify-center transition-colors"
                      aria-label="Close modal"
                    >
                      <i className="fa-solid fa-xmark text-[var(--color-muted)] text-lg" />
                    </button>
                  </div>
                  <p className="text-[var(--color-accent)] text-base font-semibold">
                    {selectedItem.institution}
                  </p>
                  <p className="text-sm text-[var(--color-muted)] mt-1">
                    {selectedItem.period}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-2 uppercase tracking-wide">
                    Details
                  </h4>
                  <p className="text-base text-[var(--color-muted)] leading-relaxed">
                    {selectedItem.details}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-3 uppercase tracking-wide">
                    Skills & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm text-[var(--color-muted)] bg-[var(--color-accent)]/5 border border-[var(--color-border)] rounded-full px-4 py-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
