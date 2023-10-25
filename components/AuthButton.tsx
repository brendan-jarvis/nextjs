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
        <Button className="py-2 px-4 rounded-md no-underline" variant="outline">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Button variant="outline" asChild>
      <Link href="/login" className="py-2 px-3 rounded-md no-underline">
        Login
      </Link>
    </Button>
  );
}
