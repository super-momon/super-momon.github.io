import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://super-momon.github.io"),
  title: {
    default: "Mark Raymond Ayade | Full Stack Developer",
    template: "%s | Mark Raymond Ayade",
  },
  description:
    "Full Stack Developer specializing in AI-assisted development. Explore my projects, skills, and experience.",
  keywords: [
    "Mark Raymond Ayade",
    "Full Stack Developer",
    "AI Development",
    "Web Developer",
    "React",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Mark Raymond Ayade", url: "https://super-momon.github.io" }],
  creator: "Mark Raymond Ayade",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: "https://super-momon.github.io",
    title: "Mark Raymond Ayade | Full Stack Developer",
    description:
      "Full Stack Developer specializing in AI-assisted development. Explore my projects, skills, and experience.",
    siteName: "Mark Raymond Ayade — Portfolio",
    images: [
      {
        url: "/logo.PNG",
        width: 1200,
        height: 630,
        alt: "Mark Raymond Ayade — Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Raymond Ayade | Full Stack Developer",
    description:
      "Full Stack Developer specializing in AI-assisted development. Explore my projects, skills, and experience.",
    images: ["/logo.PNG"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C3EYYVGG42"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C3EYYVGG42');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mark Raymond Ayade",
              url: "https://super-momon.github.io",
              image: "https://super-momon.github.io/logo.PNG",
              jobTitle: "Full Stack Developer",
              description:
                "Full Stack Developer specializing in AI-assisted development. Explore my projects, skills, and experience.",
              sameAs: [
                "https://www.linkedin.com/in/super-momon",
                "https://github.com/super-momon",
              ],
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

