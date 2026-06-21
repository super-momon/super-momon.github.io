"use client";

import { FadeIn } from "@/components/FadeIn";
import { trackEvent } from "@/lib/analytics";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";
import { useRef, useEffect, useState } from "react";

const socialLinks = [
  {
    label: "GitHub",
    href: GITHUB_URL,
    icon: 'fa-brands fa-github',
  },
  {
    label: "LinkedIn",
    href: LINKEDIN_URL,
    icon: 'fa-brands fa-linkedin',
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    icon: 'fa-solid fa-envelope',
  },
];

export default function Contact() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ctaRef.current || !isHovering) return;

      const rect = ctaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 150;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        setMousePosition({
          x: x * strength * 0.3,
          y: y * strength * 0.3,
        });
      }
    };

    if (isHovering) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  return (
    <section id="contact" className="relative py-32 px-6 bg-[var(--color-surface)] overflow-hidden">
      {/* Atmospheric noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative">
        <FadeIn>
          <div className="mb-8">
            <h2 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold text-[var(--color-foreground)] leading-[0.95] tracking-tight mb-6">
              Let&apos;s Build
              <br />
              <span className="text-[var(--color-accent)] inline-block"
                style={{
                  textShadow: "0 0 40px var(--color-accent)",
                }}>
                Something Great
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
              I&apos;m actively seeking opportunities to collaborate on ambitious projects.
              Whether you&apos;re envisioning a transformative product,
              exploring a technical challenge, or simply want to connect—
              <span className="text-[var(--color-foreground)] font-medium"> I&apos;d love to hear from you</span>.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-16 mt-12">
            <a
              ref={ctaRef}
              href={`mailto:${EMAIL}`}
              onClick={() =>
                trackEvent("cta_click", {
                  event_category: "contact",
                  event_label: "send_message",
                })
              }
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setMousePosition({ x: 0, y: 0 });
              }}
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[var(--color-accent)] text-white font-semibold text-lg overflow-hidden
                         transition-all duration-300 ease-out
                         hover:shadow-[0_0_40px_rgba(0,199,88,0.4)]
                         active:scale-95"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                transition: isHovering ? "transform 0.2s ease-out, box-shadow 0.3s" : "all 0.5s ease-out",
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out
                              bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <span className="relative z-10">Start a Conversation</span>
              <i className="fa-solid fa-arrow-right relative z-10 transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="pt-8 border-t border-[var(--color-border)]">
            <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-6 font-medium">
              Connect With Me
            </p>
            <div className="flex items-center justify-center gap-8">
              {socialLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  onClick={() =>
                    trackEvent("social_link_click", {
                      event_category: "contact",
                      event_label: link.label.toLowerCase(),
                    })
                  }
                  className="group relative"
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="relative z-10 w-14 h-14 flex items-center justify-center rounded-full 
                                  bg-[var(--color-background)] border-2 border-[var(--color-border)]
                                  transition-all duration-300
                                  group-hover:border-[var(--color-accent)]
                                  group-hover:shadow-[0_0_20px_rgba(0,199,88,0.3)]
                                  group-hover:-translate-y-2
                                  group-active:scale-95"
                  >
                    <i className={`text-2xl ${link.icon} text-[var(--color-muted)] 
                                   transition-colors duration-300
                                   group-hover:text-[var(--color-accent)]`}></i>
                  </div>

                  {/* Label on hover */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                                   text-xs font-medium text-[var(--color-muted)] 
                                   opacity-0 group-hover:opacity-100 
                                   transition-opacity duration-300 whitespace-nowrap">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
