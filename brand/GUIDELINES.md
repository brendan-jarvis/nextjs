# Brand guidelines

Internal. The system to build toward. The captured sheets in this folder are the site as it shipped on 6 Oct 2026.

Borrowed from three public systems, then applied here:

- Linear publishes two colours and keeps indigo for focus, not decoration. Here, six hues stay, and only citrus may act.
- Stripe uses a gradient as a signature edge, not as chrome. The spectrum is that edge.
- Vercel separates symbol and logotype, and writes a misuse list. Wordmark first. Monogram only at 16–32px.

## Principles

1. Paper, not white. The ground is `#F7F4EF`, not `#FFFFFF` and not Tailwind stone.
2. Citrus is the only signal. Links, the sweep, focus, and the primary button. Lilac, seafoam, orchid, and yellow do not get buttons.
3. The spectrum is a rule. Six hues, one 4px bar, in order: citrus, sunny, seafoam, orchid, lilac, plum. Card foot, OG image, CV header. Three places.
4. Type leads. Borders leave. No 1px stone border, no hover that raises the border, no shadow.
5. Say the specific thing. The Parole Board hearing system, a motorcycle test in Porirua, a seasons project. “Full-stack web developer” is the category, and it goes small.

## Colour

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Ink | bj-navy | `#16223B` | Text, mark, primary surface |
| Paper | warm paper | `#F7F4EF` | Page ground |
| Signal | citrus-blaze | `#EA6E4B` | Button, link, focus, sweep |
| Spectrum | sunny-yellow | `#FAF26F` | Rule only. Never type |
| Spectrum | seafoam-green | `#ABE3D2` | Rule, and the writing label |
| Spectrum | orchid-pink | `#D653A9` | Rule, and one project label |
| Spectrum | soft-lilac | `#CDA8E2` | Rule, and large display only |
| Inverse | night-plum | `#3A1E66` | Dark ground, if it ships |

Body text is navy on paper. Citrus type is allowed at 16px and above, on paper only. Buttons use paper text on a citrus fill. A project may take one spectrum colour as its label. Seasoned takes seafoam. It does not recolour the page. Flat bands only — do not blend the bar.

Dark mode, if it ships, is plum as the ground and paper as the text. Until it ships, it stays out of the public sheet.

## Type

Newsreader for the name and titles. Newsreader italic for one phrase a page (“Kia ora”). Outfit for body, nav, and buttons. IBM Plex Mono for dates, hex, and labels.

| Role | Face | Size | Weight |
| --- | --- | --- | --- |
| Display | Newsreader | 36–48 | 400 |
| Display italic | Newsreader italic | 20–28 | 400 |
| Title | Newsreader | 22–28 | 400 |
| Body | Outfit | 16–18 web | 400 |
| UI | Outfit | 14–15 | 500 |
| Meta | IBM Plex Mono | 11–12 | 400 |

No black weights. No Inter on a rebuilt page. Do not fall back to Fraunces.

## Mark

The wordmark is the name in Newsreader, regular, not bold, not letterspaced. Navy on paper, paper on navy, paper on plum. It does not take a colour from the spectrum.

The existing single-colour monogram stays. Favicon, app icon, and the 20px header mark when the wordmark will not fit. It is not redrawn in Newsreader.

- Clear space: at least a quarter of the mark height.
- Colour: navy, paper, or white. One colour. Strokes are never different hues.
- Small size: the 16px favicon uses the pixel-hinted master.
- Lockup: mark, 12px gap, wordmark at 15–18px. One line. No tagline in the lockup.
- Do not rotate it, outline it, put it on citrus, or combine it with another logo.

## Voice

Kia ora once, on the homepage, in Newsreader italic. Not in the nav, the footer, or every card. Numerals, not words. One claim a line. NZ stays in — Porirua, the Parole Board, Aotearoa.

Retired: “Passionate full-stack developer crafting seamless experiences.”

In use: “Kia ora. I build and maintain production systems.” Then the specific system.

## Components

Two buttons, one link, one card. The shadcn variant matrix is documentation of a library, not this site.

- Primary button: citrus fill, paper label, 2px radius.
- Inverse button: navy fill, paper label.
- Quiet: hairline, rare. No ghost, no outline-as-default, no destructive red unless something is being deleted.
- Hover darkens the fill by mixing 8% navy. Focus is a 2px citrus offset outline.
- Link: navy text, citrus rule 3px below the baseline. No arrow unless it leaves the site.
- Card: type on paper, no border, 4px spectrum rule at the foot. A label in Plex, uppercase, in that item’s spectrum colour.

## Applications

The same three moves everywhere: Newsreader wordmark, citrus as the only signal, the spectrum rule at the foot.

Open Graph is 1200×630. The bar is wired into the image. One spectrum label in the corner — Portfolio, Writing, or Project — in that item’s colour. Not a rainbow pill.

CV and email header: navy band, wordmark in paper, one seafoam secondary line, the rule along the bottom.

## Misuse

- Do not set body text in Inter on a rebuilt page.
- Do not recolour the monogram with the spectrum.
- Do not use yellow, lilac, or seafoam as text.
- Do not border every card.
- Do not show a dark theme that is not switched on.
- Do not put Kia ora in the nav.
- Do not blend the bar into a gradient.
- Do not add an eighth accent.
