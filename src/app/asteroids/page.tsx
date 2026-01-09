"use client";

import dynamic from "next/dynamic";

const AsteroidsGame = dynamic(
  () => import("./_components/AsteroidsGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <p className="font-[family-name:var(--font-press-start)] text-white">Loading...</p>
      </div>
    ),
  }
);

export default function AsteroidsPage() {
  return <AsteroidsGame />;
}
