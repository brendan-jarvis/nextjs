import "~/styles/globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Nav from "@/app/_components/Nav";
import Footer from "@/app/_components/Footer";
import { Toaster } from "@/app/_components/ui/toaster";
import { Providers } from "@/app/providers";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: "Brendan Jarvis", url: "https://x.com/brendanjjarvis" }],
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/images/profile.jpg",
        width: 400,
        height: 400,
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
      <body className={`font-sans ${inter.variable}`}>
        <Providers>
          <main className="flex min-h-screen flex-col items-center">
            <Nav />
            {children}
            <Footer />
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
