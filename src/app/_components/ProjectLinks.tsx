import Link from "next/link";
import { Code, ExternalLink, Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { getProjectLinks } from "@/lib/project-links";

const icons = { live: ExternalLink, repo: Code, internal: Gamepad2 };

export function ProjectLinks({
  project,
  className,
}: {
  project: { title: string; url: string; repo?: string };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {getProjectLinks(project).map((link) => {
        const Icon = icons[link.kind];
        const classes =
          "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition";
        const content = (
          <>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
            {link.external && (
              <span className="sr-only">
                {" "}
                for {project.title} (opens in a new tab)
              </span>
            )}
          </>
        );
        return link.external ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {content}
          </a>
        ) : (
          <Link key={link.href} href={link.href} className={classes}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
