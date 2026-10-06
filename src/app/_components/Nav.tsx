import BlogButton from "./BlogButton";
import ProjectsButton from "./ProjectsButton";
import HomeButton from "./HomeButton";
import { LoginButton } from "./LoginButton";

export default function Nav() {
  return (
    <nav className="flex w-full justify-center">
      <div className="flex w-full max-w-4xl items-center justify-between px-4 py-4 text-sm">
        <HomeButton />
        <div className="flex items-center gap-5">
          <ProjectsButton />
          <BlogButton />
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}
