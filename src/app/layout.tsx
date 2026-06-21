import "~/styles/globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Nav from "@/app/_components/Nav";
import Footer from "@/app/_components/Footer";
import { Toaster } from "@/app/_components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/app/providers";

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
  metadataBase: new URL("https://brendanjjarvis.com"),
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
          <ClerkProvider
            publishableKey={
              process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
              // Valid-format dummy key for static prerender during builds/CI without real Clerk keys.
              // See isPublishableKey in @clerk/shared (must be pk_test_ + base64(frontendApi + "$") with dot in api)
              "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k"
            }
          >
            <main className="flex min-h-screen flex-col items-center">
              <Nav />
              {children}
              <Footer />
            </main>
            <Toaster />
          </ClerkProvider>
        </Providers>
      </body>
    </html>
  );
}
