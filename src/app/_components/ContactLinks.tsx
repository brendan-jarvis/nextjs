import { FileText, Mail, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { contact } from "@/lib/site";

function BrandIcon({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

function Github(props: { className?: string }) {
  return (
    <BrandIcon
      {...props}
      path="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.09 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.61.24 2.79.12 3.09.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"
    />
  );
}

function Linkedin(props: { className?: string }) {
  return (
    <BrandIcon
      {...props}
      path="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"
    />
  );
}

const links: {
  href: string;
  label: string;
  icon: LucideIcon | typeof Github;
  newTab: boolean;
  title?: string;
  srHint?: string;
}[] = [
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
        "flex flex-wrap justify-start gap-1.5 sm:gap-2",
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
          className="inline-flex items-center gap-1.5 border border-[#E4DCD2] px-2.5 py-1.5 text-sm font-medium text-foreground transition hover:border-foreground sm:px-3"
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
