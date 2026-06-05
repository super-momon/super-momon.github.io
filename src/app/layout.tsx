import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
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

