#!/usr/bin/env python3
"""
Keygarden LinkedIn Carousel Builder
Run from tools/: python build-carousel.py
Output: ../docs/images/marketing/keygarden-carousel.pdf

When PNGs arrive from Claude Code, drop them in docs/images/marketing/
with the filenames listed in SLIDES below, then re-run.
"""

import os
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader

# ── Keygarden calm-analyst color system ──────────────────────────────────────
BG          = HexColor("#eef1f5")   # page background
PANEL       = HexColor("#ffffff")   # card white
ACCENT      = HexColor("#2f6df0")   # blue
ACCENT_D    = HexColor("#1a4db8")   # deep blue (cover gradient strip)
ACCENT_MUTED= HexColor("#4080f8")   # lighter blue glyph
ACCENT_TEXT = HexColor("#b8ccf8")   # caption on blue bg
INK         = HexColor("#1a2335")   # primary text
DIM         = HexColor("#5b6470")   # muted text
CARD_BORDER = HexColor("#dce2ec")   # card stroke
PLACEHOLDER = HexColor("#d4d8e0")   # gray image slot

W, H = 1080, 1080   # LinkedIn square carousel

# ── Slide definitions ────────────────────────────────────────────────────────
# type "cover" / "cta" = full accent-blue slide (no image)
# type "shot"          = branded light-bg slide with image slot
SLIDES = [
    {
        "type": "cover",
        "glyph": "{ }",
        "title": "Type the symbols your\njob actually uses.",
        "caption": "Not a speed test. Not a game.\nKeygarden drills the brackets, operators,\nand shortcuts your field runs on.",
        "url": "michaelnocito.github.io/keygarden",
    },
    {
        "type": "shot",
        "shot": 1,
        "img": "01-field-select.png",
        "title": "Start here. Calm, no pressure.",
        "caption": "Pick your field before you're asked to type anything.\nOrient first, practice second.",
    },
    {
        "type": "shot",
        "shot": 2,
        "img": "02-field-picker.png",
        "title": "Six fields. Your symbols, not some generic list.",
        "caption": "Data & Analytics · Software/Web · Healthcare · Finance · Cybersecurity · General\n"
                   "Each one ships with its own symbol set and real-world snippets.",
    },
    {
        "type": "shot",
        "shot": 3,
        "img": "03-mid-drill.png",
        "title": "One symbol at a time. Easiest first.",
        "caption": "Warm up on individual keys, then graduate to words, phrases, and full lines.\n"
                   "The order adapts to the keys you actually fumble.",
    },
    {
        "type": "shot",
        "shot": 4,
        "img": "04-miss-coaching.png",
        "title": "Missed a key? You'll know exactly where to go.",
        "caption": "Spatial coaching names the direction. The on-screen keyboard shows the finger.\n"
                   "No vague 'try again' — just clear, direct guidance.",
    },
    {
        "type": "shot",
        "shot": 5,
        "img": "05-garden-sketch.png",
        "title": "No timer. No score. Just a garden that grows.",
        "caption": "A biodiversity garden unlocks as you practice — birdbaths, bee houses, native oaks.\n"
                   "Nothing wilts. Nothing decays. No guilt cycle.",
    },
    {
        "type": "cta",
        "badge": "Try it free →",
        "title": "Free. Offline-ready.\nInstalls in one click.",
        "caption": "No login. No tracking. No timer.\nJust the practice.",
        "url": "michaelnocito.github.io/keygarden",
    },
]

TOTAL = len(SLIDES)

# ── Helpers ──────────────────────────────────────────────────────────────────

def accent_bar(c):
    """8pt accent stripe across the very top of the slide."""
    c.setFillColor(ACCENT)
    c.rect(0, H - 8, W, 8, stroke=0, fill=1)

def brand_mark(c, light=False):
    """'{ } Keygarden' small mark — top-left, below the bar."""
    color = white if light else DIM
    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(color)
    c.drawString(38, H - 44, "{ }  Keygarden")

def slide_number(c, n, light=False):
    """Slide counter — top-right."""
    color = white if light else DIM
    c.setFont("Helvetica", 13)
    c.setFillColor(color)
    c.drawRightString(W - 38, H - 44, f"{n} / {TOTAL}")

def progress_dots(c, n, light=False):
    """Small progress dots at the bottom center."""
    r = 4
    gap = 16
    total_w = TOTAL * r * 2 + (TOTAL - 1) * (gap - r * 2)
    ox = (W - total_w) / 2
    y = 28
    for i in range(TOTAL):
        active = (i == n - 1)
        if light:
            c.setFillColor(white if active else HexColor("#5070c0"))
        else:
            c.setFillColor(ACCENT if active else HexColor("#c4ccd8"))
        c.circle(ox + r + i * gap, y, r, stroke=0, fill=1)


# ── Cover slide ──────────────────────────────────────────────────────────────

def draw_cover(c, slide, n):
    # Full accent background
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    # Darker strip at top
    c.setFillColor(ACCENT_D)
    c.rect(0, H - 72, W, 72, stroke=0, fill=1)

    brand_mark(c, light=True)
    slide_number(c, n, light=True)

    # Big glyph watermark
    c.setFont("Helvetica-Bold", 110)
    c.setFillColor(ACCENT_MUTED)
    c.drawCentredString(W / 2, H / 2 + 160, slide.get("glyph", "{ }"))

    # Title
    c.setFont("Helvetica-Bold", 46)
    c.setFillColor(white)
    ty = H / 2 + 60
    for line in slide["title"].split("\n"):
        c.drawCentredString(W / 2, ty, line)
        ty -= 60

    # Caption
    c.setFont("Helvetica", 20)
    c.setFillColor(ACCENT_TEXT)
    cy = ty - 20
    for line in slide["caption"].split("\n"):
        c.drawCentredString(W / 2, cy, line)
        cy -= 28

    # URL pill
    if "url" in slide:
        url = slide["url"]
        uw = c.stringWidth(url, "Helvetica-Bold", 17) + 44
        ux = (W - uw) / 2
        uy = 92
        c.setFillColor(white)
        c.roundRect(ux, uy, uw, 36, 9, stroke=0, fill=1)
        c.setFont("Helvetica-Bold", 17)
        c.setFillColor(ACCENT)
        c.drawCentredString(W / 2, uy + 10, url)

    progress_dots(c, n, light=True)


# ── CTA slide ────────────────────────────────────────────────────────────────

def draw_cta(c, slide, n):
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(ACCENT_D)
    c.rect(0, H - 72, W, 72, stroke=0, fill=1)

    brand_mark(c, light=True)
    slide_number(c, n, light=True)

    # Badge button
    badge = slide.get("badge", "Try it free →")
    bw = c.stringWidth(badge, "Helvetica-Bold", 20) + 52
    bx = (W - bw) / 2
    by = H / 2 + 160
    c.setFillColor(white)
    c.roundRect(bx, by, bw, 46, 10, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(ACCENT)
    c.drawCentredString(W / 2, by + 13, badge)

    # Title
    c.setFont("Helvetica-Bold", 46)
    c.setFillColor(white)
    ty = H / 2 + 68
    for line in slide["title"].split("\n"):
        c.drawCentredString(W / 2, ty, line)
        ty -= 60

    # Caption
    c.setFont("Helvetica", 20)
    c.setFillColor(ACCENT_TEXT)
    cy = ty - 20
    for line in slide["caption"].split("\n"):
        c.drawCentredString(W / 2, cy, line)
        cy -= 28

    # URL — large, white
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(white)
    c.drawCentredString(W / 2, 96, slide["url"])

    progress_dots(c, n, light=True)


# ── Screenshot slide ─────────────────────────────────────────────────────────

def draw_shot(c, slide, n, img_dir):
    # Light background
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    accent_bar(c)
    brand_mark(c, light=False)
    slide_number(c, n, light=False)

    # Layout dimensions
    H_PAD    = 52   # horizontal padding for card
    TOP_GAP  = 72   # brand area height
    BOT_GAP  = 172  # title + caption + dot area
    DOT_H    = 54

    card_x = H_PAD
    card_y = DOT_H + (BOT_GAP - DOT_H)   # = 172
    card_w = W - 2 * H_PAD               # = 976
    card_h = H - TOP_GAP - BOT_GAP       # = 836

    # White card
    c.setFillColor(PANEL)
    c.setStrokeColor(CARD_BORDER)
    c.setLineWidth(1)
    c.roundRect(card_x, card_y, card_w, card_h, 10, stroke=1, fill=1)

    # Accent top stripe on card (inside, flat)
    c.setFillColor(ACCENT)
    c.rect(card_x, card_y + card_h - 6, card_w, 6, stroke=0, fill=1)

    # Image area — inset 16pt inside card (minus the stripe)
    IMG_PAD = 16
    ix = card_x + IMG_PAD
    iy = card_y + IMG_PAD
    iw = card_w - 2 * IMG_PAD
    ih = card_h - 2 * IMG_PAD - 6   # -6 for stripe

    img_path = os.path.join(img_dir, slide["img"])
    if os.path.exists(img_path):
        try:
            ir = ImageReader(img_path)
            pw, ph = ir.getSize()
            ratio = min(iw / pw, ih / ph)
            dw = pw * ratio
            dh = ph * ratio
            dx = ix + (iw - dw) / 2
            dy = iy + (ih - dh) / 2
            c.drawImage(img_path, dx, dy, dw, dh,
                        preserveAspectRatio=True, mask="auto")
            print(f"    [OK] {slide['img']}")
        except Exception as e:
            print(f"    [WARN] Could not load {slide['img']}: {e}")
            _placeholder(c, ix, iy, iw, ih, slide["shot"])
    else:
        _placeholder(c, ix, iy, iw, ih, slide["shot"])

    # Title — just below the card
    title_y = card_y - 30
    c.setFont("Helvetica-Bold", 23)
    c.setFillColor(INK)
    c.drawCentredString(W / 2, title_y, slide["title"])

    # Caption — 1 or 2 lines
    cap_y = title_y - 30
    c.setFont("Helvetica", 16)
    c.setFillColor(DIM)
    for line in slide["caption"].split("\n"):
        c.drawCentredString(W / 2, cap_y, line)
        cap_y -= 22

    progress_dots(c, n, light=False)


def _placeholder(c, x, y, w, h, shot_num):
    c.setFillColor(PLACEHOLDER)
    c.roundRect(x, y, w, h, 6, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(DIM)
    c.drawCentredString(x + w / 2, y + h / 2 + 12, f"Shot {shot_num}")
    c.setFont("Helvetica", 14)
    c.drawCentredString(x + w / 2, y + h / 2 - 14, "(PNG from Claude Code goes here)")


# ── Build ─────────────────────────────────────────────────────────────────────

def build(out_path, img_dir):
    c = canvas.Canvas(out_path, pagesize=(W, H))
    c.setTitle("Keygarden — LinkedIn Carousel")
    c.setAuthor("Michael Nocito")

    for i, slide in enumerate(SLIDES):
        n = i + 1
        print(f"  Slide {n}/{TOTAL}: {slide['type']}  {slide.get('title','')[:50].replace(chr(10),' ')}")
        if slide["type"] == "cover":
            draw_cover(c, slide, n)
        elif slide["type"] == "cta":
            draw_cta(c, slide, n)
        else:
            draw_shot(c, slide, n, img_dir)
        c.showPage()

    c.save()
    print(f"\n  Saved -> {out_path}\n")


if __name__ == "__main__":
    tools_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(tools_dir)
    img_dir   = os.path.join(repo_root, "docs", "images", "marketing")
    out_path  = os.path.join(img_dir, "keygarden-carousel.pdf")
    os.makedirs(img_dir, exist_ok=True)
    print(f"Building Keygarden LinkedIn carousel")
    print(f"Image dir : {img_dir}")
    print(f"Output    : {out_path}\n")
    build(out_path, img_dir)
