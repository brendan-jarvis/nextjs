import BlogButton from "./BlogButton";
import ProjectsButton from "./ProjectsButton";
import HomeButton from "./HomeButton";
import { LoginButton } from "./LoginButton";

export default function Nav() {
  return (
    <nav className="border-b-foreground/10 flex h-16 w-full justify-center border-b">
      <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
        <HomeButton />
        <BlogButton />
        <ProjectsButton />
        <LoginButton />
      </div>
    </nav>
  );
}
