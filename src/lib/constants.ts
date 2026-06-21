// ─── Personal Info ────────────────────────────────────────────────────────────
export const SITE_OWNER = "Mark Raymond Ayade";
export const SITE_OWNER_DISPLAY = "Ayade Mark Raymond M.";
export const SITE_TITLE = "Full Stack Developer";
export const SITE_DESCRIPTION =
  "Full Stack Developer specializing in AI-assisted development. Explore my projects, skills, and experience.";

// ─── Contact ──────────────────────────────────────────────────────────────────
export const EMAIL = "raymond.ayade@gmail.com";

// ─── Social Links ─────────────────────────────────────────────────────────────
export const GITHUB_URL = "https://github.com/super-momon";
export const GITHUB_USERNAME = "super-momon";
export const LINKEDIN_URL = "https://linkedin.com/in/super-momon";
export const LINKEDIN_USERNAME = "super-momon";

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Education", href: "/#education" },
  { label: "Contact", href: "/#contact" },
];

// ─── Site ─────────────────────────────────────────────────────────────────────
export const SITE_URL = "https://super-momon.github.io";
export const SITE_NAME = `${SITE_OWNER} — Portfolio`;
export const OG_IMAGE = "/logo.PNG";
export const GA_ID = "G-C3EYYVGG42";
