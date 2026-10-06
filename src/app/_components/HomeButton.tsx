import Link from "next/link";
import BJMark from "./BJMark";

export default function HomeButton() {
  return (
    <Link
      className="flex items-center gap-3 text-base no-underline"
      href="/"
      aria-label="Brendan Jarvis, home"
    >
      <BJMark className="h-5 w-auto shrink-0" />
      <span className="font-display">Brendan Jarvis</span>
    </Link>
  );
}
