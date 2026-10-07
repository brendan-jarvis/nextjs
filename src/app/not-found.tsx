import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start py-16">
      <p className="font-mono text-[10px] tracking-wide text-citrus-blaze">
        404
      </p>
      <h1 className="mt-2 text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        That link does not go anywhere. The page may have moved, or the
        address is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium underline decoration-citrus-blaze decoration-2 underline-offset-4"
      >
        Back to home
      </Link>
    </div>
  );
}
