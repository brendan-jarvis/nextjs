"""Regenerate the brand reference sheets and the public brand PNGs.

Usage (from the repo root, with the site running, e.g. `bun run build && bun run start`):

    pip install playwright pillow && python -m playwright install chromium
    python brand/capture.py --base http://localhost:3000

Writes:
  brand/brand-sheet-1-mark-colour-type.png        /brand: header, mark, colour, type
  brand/brand-sheet-2-components-icons-social.png /brand: buttons, cards, icons, social
  brand/brand-sheets.pdf                          the same two sections as vector pages
  public/brand/og-{home,blog,project}.png         from brand/og/*.html (1200x630)
  public/brand/mark-{navy,black,white}-512.png    from public/brand/mark-*.svg
"""
import argparse, base64, io, pathlib, urllib.parse
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
BRAND, PUBLIC = ROOT / "brand", ROOT / "public"


def save_png(img, path, colors=256):
    """Opaque: palette-quantise (no dither, keeps text crisp). Transparent: lossless. Saved optimised."""
    img = img.convert("RGBA")
    if img.getextrema()[3][0] == 255:  # fully opaque
        q = img.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    else:  # transparent: keep exact alpha; zero RGB under alpha 0 so it compresses
        px = img.load()
        for y in range(img.height):
            for x in range(img.width):
                if px[x, y][3] == 0:
                    px[x, y] = (0, 0, 0, 0)
        q = img
    q.save(path, optimize=True)
    print(f"  {path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB")


def png(page, **kw):
    return Image.open(io.BytesIO(page.screenshot(**kw)))


def light_images(route):
    """For the PDF only: serve page images as small JPEGs (cards show a 16:9 crop)."""
    q = urllib.parse.parse_qs(urllib.parse.urlparse(route.request.url).query)
    src = q.get("url", [""])[0]
    f = PUBLIC / src.lstrip("/")
    if not src.startswith("/") or not f.is_file():
        return route.continue_()
    im = Image.open(f).convert("RGB")
    if src.startswith("/images/"):  # card images: object-cover into aspect-video
        w, h = im.size
        tw, th = (w, round(w * 9 / 16)) if w * 9 / 16 <= h else (round(h * 16 / 9), h)
        im = im.crop(((w - tw) // 2, (h - th) // 2, (w + tw) // 2, (h + th) // 2))
    im.thumbnail((1200, 1200))
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=82, optimize=True)
    route.fulfill(status=200, content_type="image/jpeg", body=buf.getvalue())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:3000")
    ap.add_argument("--chrome", help="optional Chrome/Chromium executable")
    a = ap.parse_args()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=a.chrome) if a.chrome else p.chromium.launch()

        print("sheets")
        pg = b.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
        pg.goto(a.base + "/brand", wait_until="networkidle")
        pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); pg.wait_for_timeout(1000)
        pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(300)
        box = lambda sel: pg.eval_on_selector(sel, "e => { const r = e.getBoundingClientRect(); return [r.top + scrollY, r.bottom + scrollY]; }")
        top = box("main header")[0] - 24
        save_png(png(pg, full_page=True, clip={"x": 0, "y": top, "width": 1280, "height": box("#type")[1] - top}),
                 BRAND / "brand-sheet-1-mark-colour-type.png")
        y0, y1 = box("#buttons")[0], box("#social")[1]
        save_png(png(pg, full_page=True, clip={"x": 0, "y": y0, "width": 1280, "height": y1 - y0}),
                 BRAND / "brand-sheet-2-components-icons-social.png")
        pg.close()

        print("pdf")
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.route("**/_next/image?*", light_images)
        pg.goto(a.base + "/brand", wait_until="networkidle")
        pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); pg.wait_for_timeout(1000)
        pg.emulate_media(media="screen")
        pg.add_style_tag(content="body > main > nav, body > main > footer { display: none !important; }"
                                 " #buttons { break-before: page; } section { break-inside: avoid; }")
        h = max(box("#type")[1], box("#social")[1] - box("#buttons")[0])
        pg.pdf(path=str(BRAND / "brand-sheets.pdf"), width="1280px", height=f"{int(h + 360)}px", print_background=True,
               margin={"top": "24px", "bottom": "24px", "left": "0", "right": "0"})
        print(f"  brand/brand-sheets.pdf  {(BRAND / 'brand-sheets.pdf').stat().st_size // 1024} KB")
        pg.close()

        print("og images")
        pg = b.new_page(viewport={"width": 1200, "height": 630})
        for f in sorted((BRAND / "og").glob("*.html")):
            pg.goto(f.as_uri(), wait_until="networkidle"); pg.evaluate("document.fonts.ready")
            save_png(png(pg), PUBLIC / "brand" / f"{f.stem}.png")
        pg.close()

        print("mark pngs")
        pg = b.new_page(device_scale_factor=1)
        for c in ("navy", "black", "white"):
            svg = (PUBLIC / "brand" / f"mark-{c}.svg").read_text()
            vb = [float(v) for v in svg.split('viewBox="')[1].split('"')[0].split()]
            h = 512; w = round(h * vb[2] / vb[3])
            pg.set_viewport_size({"width": w, "height": h})
            pg.set_content(f'<body style="margin:0;background:transparent"><img width="{w}" height="{h}" style="display:block" '
                           f'src="data:image/svg+xml;base64,{base64.b64encode(svg.encode()).decode()}"></body>')
            save_png(png(pg, omit_background=True), PUBLIC / "brand" / f"mark-{c}-512.png")
        b.close()


if __name__ == "__main__":
    main()
