"use client";

import { FadeIn } from "@/components/FadeIn";
import { trackEvent } from "@/lib/analytics";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";

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
  return (
    <section id="contact" className="py-24 px-6 bg-[var(--color-surface)]">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
            Let&apos;s Connect! <i className="fa-solid fa-handshake"></i>
          </h2>
          <p className="text-[var(--color-muted)] leading-relaxed mb-10">
            I&apos;m currently open to new opportunities. Whether you have a
            project in mind, a question, or just want to say hi — my inbox is
            always open.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <a
            href={`mailto:${EMAIL}`}
            onClick={() =>
              trackEvent("cta_click", {
                event_category: "contact",
                event_label: "send_message",
              })
            }
            className="inline-block px-8 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium transition-colors mb-12"
          >
            Send me a message <i className="fa-solid fa-message"></i>
          </a>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex items-center justify-center gap-6">
            {socialLinks.map((link) => (
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
                className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:scale-110 transition-all"
              >
                <i className={`text-2xl ${link.icon}`}></i>
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
