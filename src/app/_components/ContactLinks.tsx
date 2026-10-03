import { FileText, Github, Linkedin, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { contact } from "@/lib/site";

const links = [
  { href: contact.github, label: "GitHub", icon: Github, newTab: true },
  {
    href: `mailto:${contact.email}`,
    label: "Email",
    icon: Mail,
    newTab: false,
    title: contact.email,
  },
  { href: contact.linkedin, label: "LinkedIn", icon: Linkedin, newTab: true },
  {
    href: contact.cv,
    label: "CV",
    icon: FileText,
    newTab: true,
    srHint: "(PDF)",
  },
];

function hint(srHint: string | undefined, newTab: boolean) {
  return [srHint, newTab ? "(opens in a new tab)" : undefined]
    .filter(Boolean)
    .join(" ");
}

export function ContactLinks({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Contact"
      className={cn(
        "flex flex-wrap justify-center gap-1.5 sm:gap-2",
        className,
      )}
    >
      {links.map(({ href, label, icon: Icon, newTab, title, srHint }) => (
        <a
          key={label}
          href={href}
          title={title}
          {...(newTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : undefined)}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition sm:px-3"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
          {hint(srHint, newTab) && (
            <span className="sr-only"> {hint(srHint, newTab)}</span>
          )}
          {title && <span className="sr-only">: {title}</span>}
        </a>
      ))}
    </nav>
  );
}
