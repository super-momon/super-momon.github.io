"use client";

import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";
import MarqueeBanner from "./common/MarqueeBanner";
import React, { useRef, useEffect } from "react";

// Magnetic button hook for premium interactions
function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate(0, 0)";
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const linkRef = useMagneticEffect(0.2);

  return (
    <a
      ref={linkRef}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="group relative w-9 h-9 md:w-10 h-10 rounded-xl flex items-center justify-center text-foreground/80 hover:text-white bg-surface/80 dark:bg-surface/40 hover:bg-accent border border-border/85 dark:border-border/50 hover:border-accent shadow-xs hover:shadow-md transition-all duration-300 will-change-transform overflow-hidden"
    >
      {/* Glow effect on hover */}
      <span className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all duration-300 rounded-xl" />

      {/* Icon */}
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 scale-90">
        {children}
      </span>

      {/* Bottom shine line */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-6 transition-all duration-300" />
    </a>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative text-xs md:text-sm text-foreground/80 hover:text-foreground transition-all duration-300 py-1.5 inline-flex items-center gap-1.5 font-medium"
    >
      <span className="w-1 h-1 rounded-full bg-accent/0 group-hover:bg-accent transition-colors duration-300" />
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
      </span>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Skills", href: "/#skills" },
  ];

  const gameLinks = [
    { label: "Developer Quiz", href: "/games/quiz" },
    { label: "Chain Reaction", href: "/games/chain-reaction" },
  ];

  return (
    <React.Fragment>
      <footer className="relative border-t border-border/80 dark:border-border/50 mt-32 overflow-hidden bg-surface/30 dark:bg-surface/10 backdrop-blur-xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-accent/3 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "12s", animationDelay: "2s" }} />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Main footer content */}
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12">

          {/* Grid section - Brand, Navigation, Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 mb-12 pb-12 border-b border-border/30">

            {/* Brand & Socials (Spans 4 cols) */}
            <div className="md:col-span-4 flex flex-col items-start">
              <a href="#hero" className="text-xl font-bold text-foreground hover:text-accent transition-colors group mb-4 inline-block">
                <span className="relative inline-block">
                  &lt;momon /&gt;
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </span>
              </a>
              <p className="text-foreground/80 mb-6 max-w-xs leading-relaxed font-normal text-xs">
                A passionate Full Stack Developer crafting beautiful, intuitive, and performant web experiences.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <SocialLink href={GITHUB_URL} label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </SocialLink>
                <SocialLink href={LINKEDIN_URL} label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialLink>
                <SocialLink href={`mailto:${EMAIL}`} label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </SocialLink>
              </div>
            </div>

            {/* Quick Links (Spans 2 cols) */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <nav className="flex flex-col gap-0.5">
                {quickLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Games Links (Spans 2 cols) */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                Games
              </h3>
              <nav className="flex flex-col gap-0.5">
                {gameLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Info (Spans 4 cols) */}
            <div className="md:col-span-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                Location &amp; Info
              </h3>

              <div className="space-y-4">
                <div className="group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface/80 dark:bg-surface/45 border border-border/80 dark:border-border/50 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60 group-hover:text-accent transition-colors" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/70 font-mono mb-0.5 uppercase tracking-wider font-semibold">Based in</p>
                    <p className="text-xs font-semibold text-foreground">Cebu, Philippines</p>
                    <p className="text-[11px] text-foreground/80 font-normal">Available for Remote</p>
                  </div>
                </div>

                <div className="group flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface/80 dark:bg-surface/45 border border-border/80 dark:border-border/50 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60 group-hover:text-accent transition-colors" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/70 font-mono mb-0.5 uppercase tracking-wider font-semibold">Response Time</p>
                    <p className="text-xs font-semibold text-foreground">Within 24 hours</p>
                    <p className="text-[11px] text-foreground/80 font-normal">Always ready to connect</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom section - Copyright and branding */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-foreground/80 font-medium order-2 md:order-1">
              © {year} Mark Raymond Ayade
            </p>

            <div className="order-1 md:order-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-surface/95 dark:bg-surface/40 border border-border/85 dark:border-border/50 text-foreground/80 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
                aria-label="Back to top"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:-translate-y-1">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </footer>

      <MarqueeBanner />
    </React.Fragment>
  );
}
