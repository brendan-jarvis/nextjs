import { Press_Start_2P } from "next/font/google";
import type { Metadata } from "next";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Asteroids - A Three.js Game",
  description: "Classic Asteroids game built with Three.js and React Three Fiber",
};

export default function AsteroidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${pressStart2P.variable} fixed inset-0 overflow-hidden bg-black`}>
      {children}
    </div>
  );
}
