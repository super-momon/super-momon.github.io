import type { Metadata } from "next";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/lib/icons'
config.autoAddCss = false

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import {
  SITE_OWNER,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_NAME,
  OG_IMAGE,
  GA_ID,
  GITHUB_URL,
  LINKEDIN_URL,
} from "@/lib/constants";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_OWNER} | ${SITE_TITLE}`,
    template: `%s | ${SITE_OWNER}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    SITE_OWNER,
    SITE_TITLE,
    "AI Development",
    "Web Developer",
    "React",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: SITE_OWNER, url: SITE_URL }],
  creator: SITE_OWNER,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_OWNER} | ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_OWNER} — ${SITE_TITLE} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_OWNER} | ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "https://github.githubassets.com/favicons/favicon.svg",
    shortcut: "https://github.githubassets.com/favicons/favicon.svg",
    apple: "https://github.githubassets.com/favicons/favicon.svg",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: SITE_OWNER,
              url: SITE_URL,
              image: `${SITE_URL}${OG_IMAGE}`,
              jobTitle: SITE_TITLE,
              description: SITE_DESCRIPTION,
              sameAs: [LINKEDIN_URL, GITHUB_URL],
            }),
          }}
        />

        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />

        {/* Font Awesome - Configure to prevent hydration mismatch */}
        {/* <Script
          id="font-awesome-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.FontAwesomeConfig = { autoReplaceSvg: false };
            `,
          }}
        /> */}
        {/* <Script
          src="https://kit.fontawesome.com/71cdb6ba78.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        /> */}
        {/* <Script
          id="font-awesome-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (window.FontAwesome) {
                window.FontAwesome.config.autoReplaceSvg = 'nest';
                window.FontAwesome.dom.i2svg();
              }
            `,
          }}
        /> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnalyticsTracker />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

