import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import { ClientPageWrapper } from "@/components/ClientPageWrapper";
import { SITE_OWNER, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_OWNER} | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return (
    <ClientPageWrapper>
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </ClientPageWrapper>
  );
}


