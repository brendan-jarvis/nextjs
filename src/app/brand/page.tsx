import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Newsreader, Outfit } from "next/font/google";

import BJMark from "@/app/_components/BJMark";
import { cn } from "@/lib/utils";

// Internal reference page: not linked from the nav, not in the sitemap.
export const metadata: Metadata = {
  title: "Brand",
  robots: { index: false, follow: false },
};

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
});

const spectrum = [
  { name: "Citrus", hex: "#EA6E4B", job: "Signal too" },
  { name: "Sunny", hex: "#FAF26F", job: "Rule only" },
  { name: "Seafoam", hex: "#ABE3D2", job: "Writing" },
  { name: "Orchid", hex: "#D653A9", job: "A project" },
  { name: "Lilac", hex: "#CDA8E2", job: "Display" },
  { name: "Plum", hex: "#3A1E66", job: "Inverse" },
];

const roles = [
  {
    role: "Ink",
    name: "bj-navy",
    hex: "#16223B",
    job: "Text, mark, primary surface.",
    fg: "#F7F4EF",
  },
  {
    role: "Paper",
    name: "warm paper",
    hex: "#F7F4EF",
    job: "Page ground. Not pure white.",
    fg: "#16223B",
  },
  {
    role: "Signal",
    name: "citrus-blaze",
    hex: "#EA6E4B",
    job: "Button, link, focus, sweep.",
    fg: "#F7F4EF",
  },
];

const misuse = [
  "Do not set body text in Inter on a rebuilt page.",
  "Do not recolour the monogram with the spectrum.",
  "Do not use yellow, lilac, or seafoam as text.",
  "Do not border every card. The rule replaces the border.",
  "Do not show a dark theme that is not switched on.",
  "Do not put Kia ora in the nav.",
  "Do not blend the bar into a gradient.",
  "Do not add an eighth accent.",
];

function Rule({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-1", className)} aria-hidden="true">
      {spectrum.map((band) => (
        <span
          key={band.hex}
          className="flex-1"
          style={{ background: band.hex }}
        />
      ))}
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  note,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 py-12">
      <p className={cn(plex.className, "text-[11px] tracking-wide text-[#EA6E4B]")}>
        {kicker}
      </p>
      <h2 className={cn(newsreader.className, "mt-2 text-3xl text-[#16223B]")}>
        {title}
      </h2>
      {note && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5C6578]">{note}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
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
          "flex aspect-square items-center justify-center",
          border && "border border-[#E4DCD2]",
        )}
        style={{ background: bg, color: fg }}
      >
        <BJMark className="h-1/2 w-auto" label={label} />
      </div>
      <figcaption
        className={cn(plex.className, "mt-2 text-[10px] text-[#5C6578]")}
      >
        {label}
      </figcaption>
    </figure>
  );
}

export default function BrandPage() {
  return (
    <div
      className={cn(
        outfit.className,
        "w-full bg-[#F7F4EF] text-[#16223B]",
      )}
    >
      <Rule />
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <header>
          <p className={cn(plex.className, "text-[11px] tracking-wide text-[#EA6E4B]")}>
            BRAND GUIDELINES · INTERNAL · NOT INDEXED
          </p>
          <h1
            className={cn(
              newsreader.className,
              "mt-4 max-w-xl text-5xl leading-none text-[#16223B]",
            )}
          >
            Not a component library.
          </h1>
          <p
            className={cn(
              newsreader.className,
              "mt-2 text-3xl italic text-[#EA6E4B]",
            )}
          >
            A palette with jobs.
          </p>
          <p className="mt-6 max-w-xl text-sm leading-6 text-[#5C6578]">
            Newsreader for the name, Outfit for the work, citrus as the only
            signal, the spectrum as a rule. The site chrome above this page
            still ships Inter until those routes are rebuilt.
          </p>
        </header>

        <Section
          id="principles"
          kicker="01 — PRINCIPLES"
          title="Five rules. The rest follows."
        >
          <ol className="grid gap-6 sm:grid-cols-2">
            {[
              ["Paper, not white.", "Ground is #F7F4EF, not #FFFFFF and not Tailwind stone."],
              ["Citrus is the only signal.", "Links, the sweep, focus, and the primary button."],
              ["The spectrum is a rule.", "One 4px bar. Card foot, OG image, CV header."],
              ["Type leads. Borders leave.", "No stone border, no hover that raises it, no shadow."],
              ["Say the specific thing.", "The hearing system, Porirua, a seasons project. The category goes small."],
            ].map(([title, body], i) => (
              <li key={title}>
                <p className={cn(newsreader.className, "text-lg")}>
                  <span className="mr-2 text-[#EA6E4B]">0{i + 1}</span>
                  {title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5C6578]">{body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="colour"
          kicker="02 — COLOUR"
          title="Ink, paper, signal, spectrum."
          note="Navy and paper do the work. Citrus points. The other five appear in the rule, and one of them may mark a project."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {roles.map((role) => (
              <div key={role.role} style={{ background: role.hex, color: role.fg }} className="p-4">
                <p className={cn(plex.className, "text-[10px] tracking-wide")}>{role.role}</p>
                <p className={cn(newsreader.className, "mt-3 text-xl")}>{role.name}</p>
                <p className={cn(plex.className, "mt-2 text-[11px]")}>{role.hex}</p>
                <p className="mt-2 text-sm">{role.job}</p>
              </div>
            ))}
          </div>
          <p className={cn(plex.className, "mt-8 text-[11px] tracking-wide text-[#5C6578]")}>
            SPECTRUM — THE RULE, IN ORDER
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {spectrum.map((band) => (
              <div key={band.hex}>
                <div className="h-16" style={{ background: band.hex }} />
                <p className="mt-2 text-sm font-medium">{band.name}</p>
                <p className={cn(plex.className, "text-[10px] text-[#5C6578]")}>{band.hex}</p>
                <p className="text-xs text-[#5C6578]">{band.job}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="type"
          kicker="03 — TYPE"
          title="Newsreader for the name. Outfit for the work."
          note="A news serif, straight, with a real italic. Outfit stays geometric and plain. IBM Plex Mono for dates, hex, and labels."
        >
          <div className="bg-[#EFEAE3] p-6">
            <p className={cn(newsreader.className, "text-4xl")}>Brendan Jarvis</p>
            <p className={cn(newsreader.className, "mt-2 text-xl italic text-[#EA6E4B]")}>
              Kia ora, I build production systems.
            </p>
            <p className="mt-4 text-sm text-[#5C6578]">
              Outfit 400 — body, captions, interface.
            </p>
            <p className={cn(plex.className, "mt-1 text-[11px] text-[#5C6578]")}>
              PLEX MONO — HEX, DATES, LABELS
            </p>
          </div>
          <dl className="mt-6 divide-y divide-[#E4DCD2] text-sm">
            {[
              ["Display", "Newsreader 36–48 / 400", "Name, page title."],
              ["Display italic", "Newsreader italic 20–28", "One phrase a page. Kia ora."],
              ["Title", "Newsreader 22–28 / 400", "Section and card titles."],
              ["Body", "Outfit 16–18 / 400", "Sentences. Line height 1.5."],
              ["UI", "Outfit 14–15 / 500", "Buttons, nav, links."],
              ["Meta", "IBM Plex Mono 11–12", "Dates, hex, labels. Uppercase."],
            ].map(([role, face, use]) => (
              <div key={role} className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="font-medium">{role}</dt>
                <dd className={cn(plex.className, "text-[11px] text-[#5C6578]")}>{face}</dd>
                <dd className="text-[#5C6578]">{use}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section
          id="mark"
          kicker="04 — MARK"
          title="Wordmark first. Monogram when it must be small."
          note="The monogram stays single-colour: navy, paper, or white. Clear space is a quarter of the mark height. The 16px favicon uses the pixel-hinted master. It is not redrawn in Newsreader, and it is not filled with the spectrum."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-[#16223B] p-6 text-[#F7F4EF]">
              <p className={cn(newsreader.className, "text-2xl")}>Brendan Jarvis</p>
              <p className={cn(plex.className, "mt-4 text-[10px] text-[#9AA3B5]")}>ON NAVY</p>
            </div>
            <div className="border border-[#E4DCD2] p-6">
              <p className={cn(newsreader.className, "text-2xl")}>Brendan Jarvis</p>
              <p className={cn(plex.className, "mt-4 text-[10px] text-[#5C6578]")}>ON PAPER</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MarkTile bg="#F7F4EF" fg="#16223B" label="Navy on paper" border />
            <MarkTile bg="#16223B" fg="#F7F4EF" label="Paper on navy" />
            <MarkTile bg="#3A1E66" fg="#F7F4EF" label="Paper on plum" />
            <MarkTile bg="#FFFFFF" fg="#16223B" label="Navy on white" border />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <figure>
              <div className="flex items-end gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon3.png" alt="App icon" width={96} height={96} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/apple-icon.png" alt="Apple touch icon" width={64} height={64} />
              </div>
              <figcaption className={cn(plex.className, "mt-2 text-[10px] text-[#5C6578]")}>
                App tile 512 · Apple 180, full bleed
              </figcaption>
            </figure>
            <figure>
              <div className="flex items-end gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/favicon-16.png" alt="Favicon 16px" width={16} height={16} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon1.png" alt="Favicon 32px" width={32} height={32} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon2.png" alt="Icon 192px" width={48} height={48} />
              </div>
              <figcaption className={cn(plex.className, "mt-2 text-[10px] text-[#5C6578]")}>
                16 hinted · 32 · 48. Tabs use icon.svg
              </figcaption>
            </figure>
            <figure className="border border-[#E4DCD2] p-4">
              <div className="flex items-center gap-3">
                <BJMark className="h-5 w-auto" />
                <span className={cn(newsreader.className, "text-base")}>Brendan Jarvis</span>
              </div>
              <figcaption className={cn(plex.className, "mt-3 text-[10px] text-[#5C6578]")}>
                Lockup: 20px mark, 12px gap, Newsreader 16px. No tagline.
              </figcaption>
            </figure>
          </div>
        </Section>

        <Section
          id="voice"
          kicker="05 — VOICE"
          title="Plain verbs. Local nouns."
        >
          <div className="bg-[#EFEAE3] p-6">
            <p className={cn(plex.className, "text-[10px] text-[#5C6578]")}>RETIRED</p>
            <p className="mt-2 text-sm text-[#5C6578]">
              Passionate full-stack developer crafting seamless experiences.
            </p>
            <p className={cn(plex.className, "mt-5 text-[10px] text-[#EA6E4B]")}>IN USE</p>
            <p className={cn(newsreader.className, "mt-2 text-xl italic")}>
              Kia ora. I build and maintain production systems.
            </p>
            <p className="mt-1 text-sm">
              Hearing management for the New Zealand Parole Board, on Dynamics 365.
            </p>
          </div>
        </Section>

        <Section
          id="components"
          kicker="06 — COMPONENTS"
          title="Two buttons. One card. One link."
          note="Radius is 2px. Hover darkens the fill by mixing 8% navy. Focus is a 2px citrus offset outline. No ghost, no outline-as-default."
        >
          <div className="flex flex-wrap gap-3">
            <span className="rounded-sm bg-[#EA6E4B] px-4 py-2 text-sm font-medium text-[#F7F4EF]">
              View project
            </span>
            <span className="rounded-sm bg-[#16223B] px-4 py-2 text-sm font-medium text-[#F7F4EF]">
              Read the post
            </span>
            <span className="rounded-sm border border-[#E4DCD2] px-4 py-2 text-sm font-medium text-[#5C6578]">
              Source
            </span>
          </div>
          <p className="mt-8 text-sm font-medium">
            <span className="underline decoration-[#EA6E4B] decoration-2 underline-offset-4">
              All projects
            </span>
            <span className="ml-3 font-normal text-[#5C6578]">
              Navy text. Citrus rule. No arrow unless it leaves the site.
            </span>
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="bg-white">
              <div className="p-5">
                <p className={cn(plex.className, "text-[10px] text-[#3A1E66]")}>WRITING</p>
                <h3 className={cn(newsreader.className, "mt-2 text-2xl")}>
                  The restricted licence test in Porirua
                </h3>
                <p className="mt-2 text-sm text-[#5C6578]">
                  How to pass the motorcycle practical test.
                </p>
                <p className={cn(plex.className, "mt-4 text-[10px] text-[#5C6578]")}>
                  18 JAN 2023
                </p>
              </div>
              <Rule />
            </article>
            <article className="bg-[#16223B] text-[#F7F4EF]">
              <div className="p-5">
                <p className={cn(plex.className, "text-[10px] text-[#D653A9]")}>PROJECT</p>
                <h3 className={cn(newsreader.className, "mt-2 text-2xl")}>
                  Three.js Asteroids
                </h3>
                <p className="mt-2 text-sm text-[#C5CDD8]">
                  A playable game. React Three Fiber, on this site.
                </p>
                <p className="mt-4 text-sm font-medium underline decoration-[#EA6E4B] decoration-2 underline-offset-4">
                  Try it
                </p>
              </div>
              <Rule />
            </article>
          </div>
        </Section>

        <Section
          id="applications"
          kicker="07 — APPLICATIONS"
          title="The same three moves, everywhere."
        >
          <p className={cn(plex.className, "text-[10px] text-[#5C6578]")}>SITE HEADER</p>
          <div className="mt-2 flex items-center justify-between border border-[#E4DCD2] px-4 py-3">
            <span className={cn(newsreader.className, "text-lg")}>Brendan Jarvis</span>
            <span className="flex gap-4 text-sm font-medium">
              <span>Projects</span>
              <span className="underline decoration-[#EA6E4B] decoration-2 underline-offset-4">
                Writing
              </span>
            </span>
          </div>
          <p className={cn(plex.className, "mt-8 text-[10px] text-[#5C6578]")}>
            OPEN GRAPH · TARGET
          </p>
          <div className="mt-2 border border-[#E4DCD2] bg-[#F7F4EF]">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <span className={cn(newsreader.className, "text-lg")}>Brendan Jarvis</span>
                <span className={cn(plex.className, "text-[10px] text-[#ABE3D2]")}>PORTFOLIO</span>
              </div>
              <p className={cn(newsreader.className, "mt-6 max-w-md text-3xl leading-tight")}>
                Kia ora, I am a full-stack developer.
              </p>
              <p className="mt-3 text-sm text-[#5C6578]">Production systems. New Zealand.</p>
            </div>
            <Rule />
          </div>
          <p className={cn(plex.className, "mt-8 text-[10px] text-[#5C6578]")}>
            CV AND EMAIL HEADER
          </p>
          <div className="mt-2 bg-[#16223B] text-[#F7F4EF]">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <span className={cn(newsreader.className, "text-lg")}>Brendan Jarvis</span>
              <span className="text-sm text-[#ABE3D2]">Software engineer · Wellington</span>
            </div>
            <Rule />
          </div>
          <p className="mt-4 text-sm text-[#5C6578]">
            Dark mode, if it ships, is plum #3A1E66 as the ground. Until then it stays off this sheet.
          </p>
        </Section>

        <Section
          id="captured"
          kicker="08 — CAPTURED"
          title="The previous social images."
          note="These 1200×630 files still use Inter and the old sweeps. They are not wired into page metadata. The site still uses /images/profile.jpg."
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
                  alt={`${label} social image, previous system`}
                  width={1200}
                  height={630}
                  className="border border-[#E4DCD2]"
                />
                <figcaption className={cn(plex.className, "mt-2 text-[10px] text-[#5C6578]")}>
                  {label} · /brand/{file}.png · previous
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="misuse" kicker="09 — MISUSE" title="Paste this. Then stop adding.">
          <pre className={cn(plex.className, "overflow-x-auto bg-[#16223B] p-4 text-[11px] leading-5 text-[#ABE3D2]")}>{`:root {
  --paper: #F7F4EF;
  --ink: #16223B;
  --signal: #EA6E4B;
  --plum: #3A1E66;
  --lilac: #CDA8E2;
  --sunny: #FAF26F;
  --seafoam: #ABE3D2;
  --orchid: #D653A9;
  --rule: 4px;
  --radius: 2px;
  --font-display: "Newsreader", serif;
  --font-text: "Outfit", sans-serif;
  --font-meta: "IBM Plex Mono", monospace;
}`}</pre>
          <ul className="mt-6 space-y-2 text-sm">
            {misuse.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EA6E4B]" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
