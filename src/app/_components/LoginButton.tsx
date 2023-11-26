import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Button variant="ghost" asChild>
      <Link
        href="/login"
        className="rounded-md px-3 py-2 font-semibold no-underline hover:underline"
      >
        Login
      </Link>
    </Button>
  );
}
