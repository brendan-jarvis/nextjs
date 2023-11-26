import BlogButton from "./BlogButton";
import HomeButton from "./HomeButton";
import LoginButton from "./LoginButton";

export const dynamic = "force-dynamic";

export default async function Nav() {
  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
        <HomeButton />
        <BlogButton />
        <LoginButton />
      </div>
    </nav>
  );
}
