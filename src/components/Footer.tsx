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
      element.style.transform = 'translate(0, 0)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
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
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className="group relative w-12 h-12 rounded-2xl flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[var(--color-surface)]/30 hover:bg-[var(--color-surface)] border border-[var(--color-border)]/30 hover:border-[var(--color-border)] backdrop-blur-sm transition-all duration-300 will-change-transform overflow-hidden"
    >
      {/* Glow effect on hover */}
      <span className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/5 transition-all duration-300 rounded-2xl" />

      {/* Icon */}
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {children}
      </span>

      {/* Bottom shine line */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-8 transition-all duration-300" />
    </a>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300 py-2 block"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
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

  const techStack = [
    "React", "Next.js", "TypeScript", "Node.js",
    "Python", "PostgreSQL", "AWS", "Docker"
  ];

  return (
    <React.Fragment>
      <footer className="relative border-t border-[var(--color-border)]/50 mt-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Main footer content */}
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12">
          {/* Grid section - Navigation, Tech Stack, Connect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12 border-b border-[var(--color-border)]/30">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-[var(--color-accent)] rounded-full" />
                Quick Links
              </h3>
              <nav className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-[var(--color-accent)] rounded-full" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] bg-[var(--color-surface)]/50 border border-[var(--color-border)]/30 rounded-lg hover:text-[var(--color-foreground)] hover:border-[var(--color-border)] transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-[var(--color-accent)] rounded-full" />
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                <SocialLink href={GITHUB_URL} label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </SocialLink>

                <SocialLink href={LINKEDIN_URL} label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialLink>

                <SocialLink href={`mailto:${EMAIL}`} label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </SocialLink>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[var(--color-surface)]/30 border border-[var(--color-border)]/30 backdrop-blur-sm">
                <p className="text-xs text-[var(--color-muted)] mb-2">Email me directly at:</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors break-all"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            {/* Location & Status */}
            <div>
              <h3 className="text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-[var(--color-accent)] rounded-full" />
                Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)] mb-1">Based in</p>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">Cebu, Philippines • Remote</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)] mb-1">Response Time</p>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Copyright and branding */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <a
                href="#hero"
                className="text-xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors group"
              >
                <span className="relative inline-block">
                  &lt;momon /&gt;
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
                </span>
              </a>
              <span className="hidden md:block w-1 h-1 rounded-full bg-[var(--color-border)]" />
              <p className="text-sm text-[var(--color-muted)]">
                © {year} Mark Raymond Ayade.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-300"
              >
                <span>Back to top</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:-translate-y-1">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </footer>

      <MarqueeBanner />
    </React.Fragment>
  );
}
