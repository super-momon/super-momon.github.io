"use client";

import { FadeIn } from "@/components/FadeIn";

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
  {
    name: "PHP",
    icon: "devicon-php-plain",
  },
  {
    name: "Visual Studio",
    icon: "devicon-visualstudio-plain",
  },
  {
    name: "Visual Studio Code",
    icon: "devicon-vscode-plain",
  }
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
            Technologies I worked with and have hands-on experience in. I&apos;m always eager to learn new tools and
          </p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, i) => (
            <FadeIn key={skill.name} delay={i * 0.05}>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors w-[120px] h-[120px]">
                <i className={skill.icon} style={{ fontSize: "2.25rem" }}></i>
                <span className="mt-3 text-sm font-medium text-center text-[var(--color-foreground)]">
                  {skill.name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
