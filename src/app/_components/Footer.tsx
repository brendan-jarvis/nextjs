import Link from "next/link";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

import { contact } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-foreground/10 mt-8 flex w-full flex-col justify-center border-t p-8 text-center text-xs">
      <nav
        aria-label="Contact"
        className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
      >
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          GitHub
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <Linkedin className="h-4 w-4" aria-hidden="true" />
          LinkedIn
        </a>
        <a
          href={contact.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          CV
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {contact.email}
        </a>
      </nav>
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
          href="https://supabase.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
        </Link>
        {", "}
        <Link
          href="https://authjs.dev/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Auth.js
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
      <p className="mt-2">
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
      </p>
    </footer>
  );
}
