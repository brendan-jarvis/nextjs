import Image from "next/image";
import type { Metadata } from "next";
import { allPosts, allProjects } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code,
  ExternalLink,
  FileText,
  Gamepad2,
  Github,
  Linkedin,
  Mail,
  X,
  type LucideIcon,
} from "lucide-react";

import BJMark from "@/app/_components/BJMark";
import { ContactLinks } from "@/app/_components/ContactLinks";
import { ProjectLinks } from "@/app/_components/ProjectLinks";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";

// Internal reference page: not linked from the nav, not in the sitemap.
export const metadata: Metadata = {
  title: "Brand",
  robots: { index: false, follow: false },
};

const accents = [
  { name: "night-plum", hex: "#3A1E66", use: "Deep accent" },
  {
    name: "soft-lilac",
    hex: "#CDA8E2",
    use: "Project title sweep, post underline",
  },
  {
    name: "citrus-blaze",
    hex: "#EA6E4B",
    use: "Highlight sweep, cursor block",
  },
  { name: "sunny-yellow", hex: "#FAF26F", use: "Accent" },
  { name: "seafoam-green", hex: "#ABE3D2", use: "Section heading sweep" },
  { name: "orchid-pink", hex: "#D653A9", use: "Accent" },
  { name: "bj-navy", hex: "#16223B", use: "B/J mark: favicon and app icons" },
];

// Values from src/styles/globals.css (:root and .dark), shadcn "stone".
const themeTokens: { token: string; light: string; dark: string }[] = [
  { token: "background", light: "#FFFFFF", dark: "#0C0A09" },
  { token: "foreground", light: "#0C0A09", dark: "#FAFAF9" },
  { token: "primary", light: "#1C1917", dark: "#FAFAF9" },
  { token: "primary-foreground", light: "#FAFAF9", dark: "#1C1917" },
  { token: "secondary / muted / accent", light: "#F5F5F4", dark: "#292524" },
  { token: "muted-foreground", light: "#78716C", dark: "#A8A29E" },
  { token: "border / input", light: "#E7E5E4", dark: "#292524" },
  { token: "ring", light: "#0C0A09", dark: "#D6D3D1" },
  { token: "destructive", light: "#EF4444", dark: "#7F1D1D" },
];

const typeScale = [
  {
    role: "Hero name",
    cls: "text-5xl font-bold tracking-tight",
    spec: "text-5xl → sm:text-6xl · 48/60px · line-height 1 · 700 · tracking-tight",
    sample: "Brendan Jarvis",
  },
  {
    role: "Page title",
    cls: "text-4xl tracking-tight",
    spec: "text-4xl → lg:text-5xl · 36px/40px · 400 · tracking-tight",
    sample: "Projects",
  },
  {
    role: "Section heading",
    cls: "text-2xl font-semibold tracking-tight",
    spec: "text-2xl · 24px/32px · 600 · tracking-tight",
    sample: "Featured projects",
  },
  {
    role: "Card title (list)",
    cls: "text-2xl font-extrabold",
    spec: "text-2xl · 24px/32px · 800",
    sample: "Three.js Asteroids game",
  },
  {
    role: "Card title (home)",
    cls: "text-lg font-semibold",
    spec: "text-lg · 18px/28px · 600",
    sample: "Whisper Subtitles",
  },
  {
    role: "Lead",
    cls: "text-xl",
    spec: "text-xl · 20px/28px · 400",
    sample: "Kia ora, I am a full-stack web developer.",
  },
  {
    role: "Body",
    cls: "text-base",
    spec: "text-base · 16px/24px · 400",
    sample: "I build and maintain production systems.",
  },
  {
    role: "UI / small",
    cls: "text-sm font-medium",
    spec: "text-sm · 14px/20px · 500 (nav 600–700)",
    sample: "All projects →",
  },
  {
    role: "Caption",
    cls: "text-xs text-muted-foreground",
    spec: "text-xs · 12px/16px · 400 · muted-foreground",
    sample: "New Zealand-based",
  },
];

const icons: { Icon: LucideIcon; name: string; where: string }[] = [
  { Icon: Github, name: "Github", where: "Contact links" },
  { Icon: Mail, name: "Mail", where: "Contact links" },
  { Icon: Linkedin, name: "Linkedin", where: "Contact links" },
  { Icon: FileText, name: "FileText", where: "Contact links (CV)" },
  { Icon: ExternalLink, name: "ExternalLink", where: "Project: live site" },
  { Icon: Code, name: "Code", where: "Project: source" },
  { Icon: Gamepad2, name: "Gamepad2", where: "Project: on this site" },
  { Icon: ChevronLeft, name: "ChevronLeft", where: "Back links" },
  { Icon: ChevronRight, name: "ChevronRight", where: "Dropdown submenu" },
  { Icon: Check, name: "Check", where: "Dropdown checkbox" },
  { Icon: Circle, name: "Circle", where: "Dropdown radio" },
  { Icon: X, name: "X", where: "Toast close" },
];

// One real project for each link style: on-site, GitHub source, live site.
function oneProjectPerLinkKind<T extends { url: string }>(list: T[]) {
  const kind = (url: string) =>
    url.startsWith("/")
      ? "internal"
      : url.includes("github.com")
        ? "repo"
        : "live";
  return list.filter(
    (p, i) => list.findIndex((q) => kind(q.url) === kind(p.url)) === i,
  );
}

const linkButton =
  "border-input bg-background inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition";

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">
        <span className="sweep-highlight px-1 py-0.5 [--sweep-color:var(--color-seafoam-green)]">
          {title}
        </span>
      </h2>
      {note && (
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">{note}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mt-2 text-xs font-medium">{children}</p>
  );
}

function MarkTile({
  bg,
  fg,
  label,
  border,
}: {
  bg: string;
  fg: string;
  label: string;
  border?: boolean;
}) {
  return (
    <figure>
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-lg",
          border && "border",
        )}
        style={{ background: bg, color: fg }}
      >
        <BJMark className="h-1/2 w-auto" label={label} />
      </div>
      <Label>{label}</Label>
    </figure>
  );
}

function Swatch({
  hex,
  name,
  sub,
}: {
  hex: string;
  name: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="h-16 rounded-md border" style={{ background: hex }} />
      <p className="mt-2 text-sm font-semibold">{name}</p>
      <p className="font-mono text-xs">{hex}</p>
      {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
    </div>
  );
}

function ButtonMatrix() {
  const rows: {
    name: string;
    variant:
      "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
    hover: string;
  }[] = [
    { name: "default", variant: "default", hover: "bg-primary/90" },
    { name: "secondary", variant: "secondary", hover: "bg-secondary/80" },
    {
      name: "outline",
      variant: "outline",
      hover: "bg-accent text-accent-foreground",
    },
    {
      name: "ghost (nav)",
      variant: "ghost",
      hover: "bg-accent text-accent-foreground",
    },
    { name: "link", variant: "link", hover: "underline" },
    { name: "destructive", variant: "destructive", hover: "bg-destructive/90" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-muted-foreground text-xs">
          <tr>
            <th className="py-2 pr-4 font-medium">Variant</th>
            <th className="py-2 pr-4 font-medium">Rest</th>
            <th className="py-2 pr-4 font-medium">Hover</th>
            <th className="py-2 pr-4 font-medium">Focus-visible</th>
            <th className="py-2 pr-4 font-medium">Disabled</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t">
              <td className="py-3 pr-4 font-mono text-xs">{r.name}</td>
              <td className="py-3 pr-4">
                <Button variant={r.variant}>Button</Button>
              </td>
              <td className="py-3 pr-4">
                <Button variant={r.variant} className={r.hover}>
                  Button
                </Button>
              </td>
              <td className="py-3 pr-4">
                <Button
                  variant={r.variant}
                  className="ring-ring ring-offset-background ring-2 ring-offset-2"
                >
                  Button
                </Button>
              </td>
              <td className="py-3 pr-4">
                <Button variant={r.variant} disabled>
                  Button
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BrandPage() {
  const projects = allProjects
    .filter((p) => p.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  const post = allPosts
    .filter((p) => p.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))[0];
  const featured = projects[0];
  const withImage = projects.find((p) => p.image) ?? projects[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="flex items-center gap-4">
        <BJMark className="h-14 w-auto" label="B/J monogram" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Brand assets</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            The mark, colours, type and components as they ship on
            brendan-jarvis.vercel.app. Internal reference, not indexed.
          </p>
        </div>
      </header>

      <Section
        id="mark"
        title="The B/J mark"
        note="Single-colour monogram. The header uses one currentColor SVG (BJMark), so it is black on the light theme and would turn white under the .dark tokens. App and favicon versions are the navy mark on a white rounded tile. Keep clear space of at least a quarter of the mark height. The 16px favicon uses a pixel-hinted master."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          <MarkTile
            bg="#FFFFFF"
            fg="#16223B"
            label="Navy #16223B on white"
            border
          />
          <MarkTile bg="#FFFFFF" fg="#000000" label="Black on white" border />
          <MarkTile
            bg="#0C0A09"
            fg="#FFFFFF"
            label="White on foreground #0C0A09"
          />
          <MarkTile bg="#16223B" fg="#FFFFFF" label="White on navy" />
          <MarkTile bg="#F5F5F4" fg="#16223B" label="Navy on muted #F5F5F4" />
          <MarkTile bg="#EA6E4B" fg="#000000" label="Black on citrus-blaze" />
          <MarkTile bg="#ABE3D2" fg="#16223B" label="Navy on seafoam-green" />
          <MarkTile bg="#3A1E66" fg="#FFFFFF" label="White on night-plum" />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <figure className="rounded-lg border p-6">
            <div className="flex items-end gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon3.png" alt="App icon" width={96} height={96} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/apple-icon.png"
                alt="Apple touch icon"
                width={64}
                height={64}
                className="rounded-xl border"
              />
            </div>
            <Label>
              icon2/icon3.png 192/512 (tile) · apple-icon.png 180 (full bleed;
              iOS masks corners)
            </Label>
          </figure>
          <figure className="rounded-lg border p-6">
            <div className="flex items-end gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/favicon-16.png"
                alt="Favicon 16px"
                width={16}
                height={16}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon1.png" alt="Favicon 32px" width={32} height={32} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon2.png" alt="Icon 192px" width={48} height={48} />
            </div>
            <Label>
              Actual size: 16 (hinted) · 32 · 48 · tabs use icon.svg
              (16px-hinted master); favicon.ico holds 16/32/48
            </Label>
          </figure>
          <figure className="rounded-lg border p-6">
            <div className="flex items-center gap-1.5 font-bold">
              <BJMark className="h-5 w-auto" />
              <span className="text-sm">Brendan Jarvis</span>
            </div>
            <div className="dark bg-background text-foreground mt-4 flex items-center gap-1.5 rounded-md p-3 font-bold">
              <BJMark className="h-5 w-auto" />
              <span className="text-sm">Brendan Jarvis</span>
            </div>
            <Label>
              Header lockup: h-5 (20px) mark, text-sm bold, gap-1.5 (light /
              .dark tokens)
            </Label>
          </figure>
        </div>
      </Section>

      <Section
        id="colour"
        title="Colour"
        note="Brand accents come from @theme in globals.css and tailwind.config.ts (use as bg-*, text-*, or var(--color-*)). Theme tokens are the shadcn stone set, hsl(var(--token))."
      >
        <h3 className="text-lg font-semibold">Brand accents</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {accents.map((a) => (
            <Swatch key={a.name} hex={a.hex} name={a.name} sub={a.use} />
          ))}
        </div>
        <h3 className="mt-10 text-lg font-semibold">
          Theme tokens: light (:root) and dark (.dark)
        </h3>
        <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {themeTokens.map((t) => (
            <div key={t.token} className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-md border"
                style={{ background: t.light }}
              />
              <div
                className="h-10 w-10 shrink-0 rounded-md border border-stone-700"
                style={{ background: t.dark }}
              />
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-semibold">
                  --{t.token}
                </p>
                <p className="text-muted-foreground font-mono text-xs">
                  {t.light} / {t.dark}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          Radius: --radius 0.5rem (rounded-lg 8px, rounded-md 6px, rounded-sm
          4px). The dark set is defined but not switched on anywhere yet; the
          site renders light only.
        </p>
      </Section>

      <Section
        id="type"
        title="Type"
        note="Inter (next/font/google, --font-sans) for everything. Tailwind v4 default scale; headings use tracking-tight."
      >
        <div className="divide-y rounded-lg border">
          {typeScale.map((t) => (
            <div
              key={t.role}
              className="grid items-baseline gap-2 p-4 sm:grid-cols-[220px_1fr]"
            >
              <div>
                <p className="text-sm font-semibold">{t.role}</p>
                <p className="text-muted-foreground font-mono text-[11px] leading-4">
                  {t.spec}
                </p>
              </div>
              <p className={cn("truncate", t.cls)}>{t.sample}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          Page titles carry a font-heading class that is not defined, so they
          render in Inter 400.
        </p>
      </Section>

      <Section
        id="buttons"
        title="Buttons and links"
        note="shadcn Button (cva) variants. Hover and focus columns apply the state classes statically so they can be seen side by side."
      >
        <ButtonMatrix />

        <h3 className="mt-10 text-lg font-semibold">Bordered link buttons</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          ContactLinks (home hero) and ProjectLinks (project cards):
          border-input, rounded-md, px-3 py-1.5, text-sm medium, 16px lucide
          icon, gap-1.5.
        </p>
        <div className="mt-4 space-y-4">
          <ContactLinks className="justify-start" />
          <div className="flex flex-wrap gap-6">
            {oneProjectPerLinkKind(projects).map((p) => (
              <ProjectLinks key={p._id} project={p} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className={linkButton}>
              <Github className="h-4 w-4" aria-hidden="true" />
              Rest
            </span>
            <span
              className={cn(linkButton, "bg-accent text-accent-foreground")}
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Hover
            </span>
            <span
              className={cn(
                linkButton,
                "outline-2 outline-offset-2 outline-[#101010]",
              )}
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Focus (browser default ring)
            </span>
          </div>
        </div>

        <h3 className="mt-10 text-lg font-semibold">
          Text links and highlights
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <span className="text-muted-foreground text-sm font-medium">
              All projects →
            </span>
            <span className="ml-4 text-sm font-medium">All projects →</span>
            <Label>Section link: muted-foreground, hover foreground</Label>
          </div>
          <div className="rounded-lg border p-4">
            <span className="decoration-soft-lilac text-lg font-semibold underline">
              Post title
            </span>
            <span className="decoration-soft-lilac ml-4 text-lg font-semibold underline decoration-2">
              Post title
            </span>
            <Label>Post link: soft-lilac underline, hover decoration-2</Label>
          </div>
          <div className="rounded-lg border p-4">
            <span className="sweep-highlight p-1 text-xl">Kia ora</span>
            <span className="sweep-highlight ml-4 px-1 py-0.5 text-xl font-semibold [--sweep-color:var(--color-seafoam-green)]">
              Section
            </span>
            <span className="sweep-highlight ml-4 text-lg font-semibold [--sweep-color:var(--color-soft-lilac)]">
              Project
            </span>
            <Label>
              Sweep highlights: citrus-blaze (default), seafoam-green,
              soft-lilac
            </Label>
          </div>
          <div className="rounded-lg border p-4 text-xs">
            Powered by <span className="font-bold">Next.js</span>,{" "}
            <span className="font-bold underline">Tailwind CSS</span>
            <Label>Footer link: text-xs bold, hover underline</Label>
          </div>
        </div>
      </Section>

      <Section
        id="cards"
        title="Cards"
        note="Cards are bordered (rounded-lg or rounded-md), no fill beyond bg-card; hover raises the border to foreground/20."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-medium">
                <span className="hover-sweep [--sweep-color:var(--color-citrus-blaze)]">
                  Production systems in regulated environments
                </span>
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Own and support the NZ Parole Board Hearing Management System
                (PBHS) on Microsoft Dynamics 365.
              </p>
            </div>
            <Label>Home, &quot;What I bring&quot; card</Label>
          </div>
          {featured && (
            <div>
              <article className="group bg-card hover:border-foreground/20 relative flex flex-col rounded-lg border p-6 transition">
                <h3 className="text-lg font-semibold text-gray-900">
                  <span className="hover-sweep [--sweep-color:var(--color-soft-lilac)]">
                    {featured.title}
                  </span>
                </h3>
                <div className="pt-1 text-xs font-light text-gray-900">
                  {format(new Date(featured.date), "MMM yyyy")}
                </div>
                {featured.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                    {featured.description}
                  </p>
                )}
                <ProjectLinks
                  project={featured}
                  className="relative z-10 mt-auto pt-4"
                />
              </article>
              <Label>Home, featured project card</Label>
            </div>
          )}
          {withImage && (
            <div>
              <article className="group relative flex flex-col space-y-2">
                <div className="bg-muted aspect-video overflow-hidden rounded-md border">
                  <Image
                    src={
                      withImage.image ??
                      "/images/projects/project_placeholder2.jpg"
                    }
                    alt={withImage.title}
                    width={804}
                    height={452}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-extrabold">{withImage.title}</h3>
                {withImage.description && (
                  <p className="text-muted-foreground">
                    {withImage.description}
                  </p>
                )}
                <ProjectLinks project={withImage} className="pt-1" />
              </article>
              <Label>Projects page card</Label>
            </div>
          )}
          {post && (
            <div>
              <article className="group relative flex flex-col space-y-2">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={804}
                    height={452}
                    className="bg-muted aspect-video rounded-md border object-cover"
                  />
                )}
                <h3 className="text-2xl font-extrabold">{post.title}</h3>
                {post.description && (
                  <p className="text-muted-foreground">{post.description}</p>
                )}
                <p className="text-muted-foreground text-sm">
                  {format(new Date(post.date), "dd MMM yyyy")}
                </p>
              </article>
              <Label>Blog list card</Label>
            </div>
          )}
        </div>
        <div className="dark bg-background text-foreground mt-8 rounded-lg p-6">
          <p className="text-muted-foreground mb-4 text-xs font-medium">
            Same components under the .dark tokens
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-medium">
                End-to-end ownership &amp; integration
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Full-stack work across C#/.NET, Azure services, Oracle PL/SQL,
                and frontend.
              </p>
            </div>
            <div className="flex flex-wrap content-start items-start gap-2">
              <Button>Button</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <ContactLinks className="justify-start" />
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="icons"
        title="Icons"
        note="lucide-react, 24px grid, 2px stroke, rendered at h-4 w-4 (16px) next to text-sm labels."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {icons.map(({ Icon, name, where }) => (
            <div key={name} className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-semibold">{name}</p>
              <p className="text-muted-foreground text-xs">{where}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="social"
        title="Social images"
        note="Example 1200×630 Open Graph images using the mark, Inter and the accent palette. Not wired into page metadata; the site still uses /images/profile.jpg."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            ["og-home", "Home"],
            ["og-blog", "Blog post"],
            ["og-project", "Project"],
          ].map(([file, label]) => (
            <figure key={file}>
              <Image
                src={`/brand/${file}.png`}
                alt={`${label} social image example`}
                width={1200}
                height={630}
                className="rounded-md border"
              />
              <Label>
                {label} · /brand/{file}.png
              </Label>
            </figure>
          ))}
        </div>
      </Section>
    </div>
  );
}
