import { createClient } from "@/utils/supabase/server";
import { Button } from "components/ui/button";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action="/auth/sign-out" method="post">
        <Button className="rounded-md px-4 py-2 no-underline" variant="outline">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Button variant="outline" asChild>
      <Link href="/login" className="rounded-md px-3 py-2 no-underline">
        Login
      </Link>
    </Button>
  );
}
