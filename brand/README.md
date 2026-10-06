# Brand

Reference copies of the brand sheets. This folder is **not served**. Usable
assets live in [`public/brand/`](../public/brand) (served at `/brand/...`),
and the live reference page is [`/brand`](../src/app/brand/page.tsx), which is
noindex and not linked from the nav.

## Contents

| File                                        | What                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `brand-sheet-1-mark-colour-type.png`        | Mark, colour and type (captured from `/brand`)      |
| `brand-sheet-2-components-icons-social.png` | Buttons/links, cards, icons, social images          |
| `brand-sheets.pdf`                          | The same two sections as vector pages               |
| `og/*.html`                                 | Sources for the example 1200×630 OG images          |
| `capture.py`                                | Regenerates the sheets, PDF, OG PNGs and mark PNGs  |
| `source-2026-10-06.png`                     | The original ~91px mark the vector was redrawn from |

## The mark

A B/J monogram. It's single-colour and never recoloured beyond navy, black or
white. Keep clear space of at least a quarter of the mark height around it.
The aspect ratio is 450:535.

| Asset                                                      | Use                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `public/brand/mark-navy.svg` / `-black.svg` / `-white.svg` | Master vector (source-faithful geometry), transparent                       |
| `public/brand/mark-{navy,black,white}-512.png`             | 512px-tall transparent PNGs                                                 |
| `public/brand/app-icon.svg`                                | Navy mark on the white rounded tile (master for the app icons)              |
| `src/app/_components/BJMark.tsx`                           | Same geometry inline with `currentColor` (site header)                      |
| `src/app/icon.svg`                                         | **Pixel-hinted** 16-unit version, used by browser tabs. Not for large sizes |
| `src/app/favicon.ico`, `icon1-3.png`, `apple-icon.png`     | 16/32/48 ICO, 32/192/512 PNG, 180 Apple (full bleed)                        |

## Colours

| Token           | Hex       | Notes                                 |
| --------------- | --------- | ------------------------------------- |
| `bj-navy`       | `#16223B` | The mark: favicon, app icons, OG mark |
| `night-plum`    | `#3A1E66` | Accent                                |
| `soft-lilac`    | `#CDA8E2` | Project title sweep, post underline   |
| `citrus-blaze`  | `#EA6E4B` | Default highlight sweep, cursor block |
| `sunny-yellow`  | `#FAF26F` | Accent                                |
| `seafoam-green` | `#ABE3D2` | Section heading sweep                 |
| `orchid-pink`   | `#D653A9` | Accent                                |

They're defined in `src/styles/globals.css` (`@theme`, as `--color-*`) and in
`tailwind.config.ts`. Use them as `bg-*`/`text-*` or `var(--color-*)`.

Theme tokens are the shadcn "stone" set in `globals.css`, used as
`hsl(var(--token))`:

- Light: background `#FFFFFF`, foreground `#0C0A09`, muted-foreground `#78716C`, border `#E7E5E4`.
- Dark (`.dark`): background `#0C0A09`, foreground `#FAFAF9`, muted-foreground `#A8A29E`, border `#292524`.

`.dark` is defined but not switched on anywhere yet.

Type is Inter (`next/font/google`) throughout, on Tailwind's default scale.
`--radius` is 0.5rem.

## Regenerating

```sh
bun install
SKIP_ENV_VALIDATION=1 bun run build && bun run start   # serves http://localhost:3000
pip install playwright pillow && python -m playwright install chromium
python brand/capture.py --base http://localhost:3000
```

The OG HTML loads Inter from a local install, or failing that from Google
Fonts. Opaque PNGs are palette-quantised to stay small; transparent ones are
lossless.
