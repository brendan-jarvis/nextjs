# Brand

Reference copies. This folder is **not served**. Usable assets live in
[`public/brand/`](../public/brand) (served at `/brand/...`), and the live
reference page is [`/brand`](../src/app/brand/page.tsx), which is noindex and
not linked from the nav.

Two layers live here:

- **Guidelines** — the system to build toward. Newsreader, warm paper, citrus as the only signal, the spectrum as a rule.
- **Captured sheets** — what the site actually shipped on 6 Oct 2026 (Inter, shadcn stone, sweeps on several colours). `capture.py` still records that page. It has not been rebuilt.

## Contents

| File | What |
| --- | --- |
| `GUIDELINES.md` | The system, in text |
| `brendan-jarvis-brand.pdf` | The same system, set as a 10-page sheet |
| `brand-sheet-1-mark-colour-type.png` | Captured mark, colour and type, from `/brand` |
| `brand-sheet-2-components-icons-social.png` | Captured buttons, cards, icons, social images |
| `brand-sheets.pdf` | Those two captured sections as vector pages |
| `og/*.html` | Sources for the example 1200×630 OG images |
| `capture.py` | Regenerates the captured sheets, PDF, OG PNGs and mark PNGs |
| `source-2026-10-06.png` | The original ~91px mark the vector was redrawn from |

## Guidelines, short

Wordmark first: the name in Newsreader regular. The B/J monogram is the favicon, the app icon, and the header mark when the wordmark will not fit. Single colour — navy, black, or white. Never filled with the spectrum. Clear space of at least a quarter of the mark height. Aspect ratio 450:535.

| Role | Token | Hex | Job |
| --- | --- | --- | --- |
| Ink | `bj-navy` | `#16223B` | Text, mark, primary surface |
| Paper | `paper` | `#F7F4EF` | Page ground. Not pure white, not stone |
| Signal | `citrus-blaze` | `#EA6E4B` | Button, link, focus, the one sweep |
| Inverse | `night-plum` | `#3A1E66` | Dark ground, if dark mode ships |
| Spectrum | `sunny-yellow` | `#FAF26F` | Rule only. Never type |
| Spectrum | `seafoam-green` | `#ABE3D2` | Rule, and the writing label |
| Spectrum | `orchid-pink` | `#D653A9` | Rule, and one project label |
| Spectrum | `soft-lilac` | `#CDA8E2` | Rule, and large display only |

The rule is a 4px bar, flat bands, in this order: citrus, sunny, seafoam, orchid, lilac, plum. Three places: card foot, Open Graph image, CV header. Not a background, not a gradient.

Type: Newsreader for the name, titles, and the one italic (“Kia ora”, homepage only). Outfit for body, nav, and buttons. IBM Plex Mono for dates, hex, and labels. Inter is retired on rebuilt pages. Radius is 2px. Cards have no border; the rule replaces it.

```css
:root {
  --paper: #f7f4ef;
  --ink: #16223b;
  --signal: #ea6e4b;
  --plum: #3a1e66;
  --lilac: #cda8e2;
  --sunny: #faf26f;
  --seafoam: #abe3d2;
  --orchid: #d653a9;
  --rule: 4px;
  --radius: 2px;
  --font-display: "Newsreader", serif;
  --font-text: "Outfit", sans-serif;
  --font-meta: "IBM Plex Mono", monospace;
}
```

## The mark, as shipped

| Asset | Use |
| --- | --- |
| `public/brand/mark-navy.svg` / `-black.svg` / `-white.svg` | Master vector, transparent |
| `public/brand/mark-{navy,black,white}-512.png` | 512px-tall transparent PNGs |
| `public/brand/app-icon.svg` | Navy mark on the white rounded tile |
| `src/app/_components/BJMark.tsx` | Same geometry inline with `currentColor` |
| `src/app/icon.svg` | Pixel-hinted 16-unit version, for tabs only |
| `src/app/favicon.ico`, `icon1-3.png`, `apple-icon.png` | 16/32/48 ICO, 32/192/512 PNG, 180 Apple |

## As shipped, until a page is rebuilt

Colours are in `src/styles/globals.css` (`@theme`, as `--color-*`) and `tailwind.config.ts`. Theme tokens are still the shadcn stone set. Light background is `#FFFFFF`. `.dark` is defined and not switched on. Type is Inter. `--radius` is 0.5rem. Sweeps still use citrus, seafoam, and lilac. That is the captured sheet, not the guideline.

## Regenerating the captured sheets

```sh
bun install
SKIP_ENV_VALIDATION=1 bun run build && bun run start   # serves http://localhost:3000
pip install playwright pillow && python -m playwright install chromium
python brand/capture.py --base http://localhost:3000
```

The OG HTML loads Inter from a local install, or failing that from Google Fonts. Opaque PNGs are palette-quantised; transparent ones are lossless.
