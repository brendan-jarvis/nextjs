import Link from "next/link";

export default function BlogButton() {
  return (
    <Link
      className="text-sm font-medium no-underline underline-offset-4 hover:underline hover:decoration-citrus-blaze hover:decoration-2"
      href="/blog"
    >
      Writing
    </Link>
  );
}
