import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
      <p>
        Powered by{" "}
        <Link
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
        </Link>
      </p>
    </footer>
  );
}
