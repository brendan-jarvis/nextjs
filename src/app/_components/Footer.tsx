import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-[#E4DCD2] text-xs text-muted-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p>Brendan Jarvis · Wellington</p>
        <p className="flex gap-4">
          <Link href="/privacy" className="underline-offset-4 hover:underline hover:decoration-citrus-blaze">
            Privacy
          </Link>
          <Link
            href="https://github.com/brendan-jarvis"
            className="underline-offset-4 hover:underline hover:decoration-citrus-blaze"
          >
            GitHub
          </Link>
        </p>
      </div>
    </footer>
  );
}
