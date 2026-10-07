import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IBM_Plex_Mono, Newsreader, Outfit } from "next/font/google";
import type { Metadata } from "next";
import Nav from "@/app/_components/Nav";
import Footer from "@/app/_components/Footer";
import { Toaster } from "@/app/_components/ui/toaster";
import { Providers } from "@/app/providers";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-text",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  variable: "--font-display",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-meta",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: "Brendan Jarvis", url: "https://x.com/brendanjjarvis" }],
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "Brendan Jarvis",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${newsreader.variable} ${plex.variable} font-sans`}>
        <Providers>
          <main className="flex min-h-screen flex-col items-center">
            <Nav />
            {children}
            <Footer />
          </main>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
