import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import Nav from "@/app/_components/Nav";
import Footer from "@/app/_components/Footer";
import { Toaster } from "@/app/_components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Brendan Jarvis - Blog",
  description:
    "Brendan Jarvis's blog about software development, motorcyling, and other things.",
  authors: [{ name: "Brendan Jarvis", url: "https://x.com/brendanjjarvis" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <main className="flex min-h-screen flex-col items-center">
            <Nav />
            {children}
            <Footer />
          </main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
