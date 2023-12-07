import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 flex w-full flex-col justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
      <p>
        Powered by{" "}
        <Link
          href="https://planetscale.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Planetscale
        </Link>
        {", "}
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
        {", and "}
        <Link
          href="https://clerk.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Clerk
        </Link>
        .
      </p>
    </footer>
  );
}
