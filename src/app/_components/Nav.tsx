import BlogButton from "./BlogButton";
import ProjectsButton from "./ProjectsButton";
import HomeButton from "./HomeButton";
//import LoginButton from "./LoginButton";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/app/_components/ui/button";

export const dynamic = "force-dynamic";

const LoginButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Button
          variant="ghost"
          className="rounded-md px-3 py-2 font-semibold no-underline hover:underline"
          asChild
        >
          <SignInButton />
        </Button>
      </SignedOut>
    </>
  );
};

export default async function Nav() {
  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
        <HomeButton />
        <BlogButton />
        <ProjectsButton />
        <LoginButton />
      </div>
    </nav>
  );
}
