import { createClient } from "@/utils/supabase/server";
import AccountForm from "./account-form";

export default async function Account() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <AccountForm session={session} />;
}
