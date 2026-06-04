import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import MarqueeBanner from "@/components/common/MarqueeBanner";

export default function Home() {
  return (
    <main>
      <Hero />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

      <About />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

      <Skills />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

      <Projects />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

      <Experience />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

      <Education />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

      <Contact />

      <MarqueeBanner text="Work In Progress : Content is being updated and may be incomplete, outdated or a dummy data. Please check back later for the latest information."
        separator="⚠️"
        repeat={12}
        bgColor="var(--color-warning)"
        textColor="#0f172a" />

    </main>
  );
}


