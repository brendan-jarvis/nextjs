import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-foreground/10 mt-8 flex w-full flex-col justify-center border-t p-8 text-center text-xs">
      <p>
        Powered by{" "}
        <Link
          href="https://nextjs.org/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Next.js
        </Link>
        {", "}
        <Link
          href="https://tailwindcss.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Tailwind CSS
        </Link>
        {", "}
        <Link
          href="https://clerk.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Clerk
        </Link>
        {", "}
        <Link
          href="https://supabase.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
        </Link>
        {", and "}
        <Link
          href="https://vercel.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Vercel
        </Link>
        .
      </p>
    </footer>
  );
}
