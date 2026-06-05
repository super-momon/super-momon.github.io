"use client";

import { FadeIn } from "@/components/FadeIn";

const skills = [
  {
    category: "Frontend",
    // items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    items: [
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
      }
    ]
  },
  {
    category: "Backend",
    // items: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST / GraphQL"],
    items: [
      {
        name: ".Net",
        icon: "devicon-dotnetcore-plain",
      },
      {
        name: "Node.js",
        icon: "devicon-nodejs-plain-wordmark",
      },
      {
        name: "MS SQL Server",
        icon: "devicon-microsoftsqlserver-plain",
      },
      {
        name: "PostgreSQL",
        icon: "devicon-postgresql-plain",
      },
      {
        name: "MongoDB",
        icon: "devicon-mongodb-plain",
      }
    ]
  },
  {
    category: "DevOps & Tools",
    // items: ["Git", "Docker", "GitHub Actions", "Vercel", "Linux"],
    items: [
      {
        name: "Git",
        icon: "devicon-git-plain",
      },
      {
        name: "Docker",
        icon: "devicon-docker-plain",
      }
    ]
  },
  {
    category: "Testing",
    // items: ["Jest", "Vitest", "React Testing Library", "Playwright"],
    items: [
      {
        name: "TypeScript",
        icon: "devicon-typescript-plain",
      }
    ]
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4 text-center">
            Skills &amp; Tech Stack
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-12 max-w-xl mx-auto">
            Technologies I work with on a daily basis.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((group, i) => (
            <FadeIn key={group.category} delay={i * 0.1}>
              <div className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] h-full">
                <h3 className="font-semibold text-[var(--color-foreground)] mb-4 text-sm tracking-wide uppercase">
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center gap-2 text-sm text-[var(--color-muted)]"
                    >

                      <i className={item.icon} style={{ fontSize: "1.5rem" }}></i>

                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
