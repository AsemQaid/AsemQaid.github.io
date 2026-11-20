# Builds project cover panels: hardware + dashboard side by side on a dark instrument panel.
# Run from the repository root:  python3 tools/make-covers.py public public/img/covers
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SRC = sys.argv[1]; OUT = sys.argv[2]
W, H = 1600, 1000
BG, GRID, RULE, INK2, AMBER = (11,17,19), (20,28,31), (44,54,58), (154,167,173), (237,178,58)
F = ImageFont.truetype(f"{SRC}/../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff", 22)

def panel():
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    for x in range(0, W, 40): d.line([(x,0),(x,H)], fill=GRID)
    for y in range(0, H, 40): d.line([(0,y),(W,y)], fill=GRID)
    return im

def load(name, crop=None):
    im = Image.open(f"{SRC}/img/{name}").convert("RGB")
    if crop:
        w, h = im.size; l, t, r, b = crop
        im = im.crop((int(l*w), int(t*h), int(r*w), int(b*h)))
    return im

def compose(items, out):
    im = panel(); d = ImageDraw.Draw(im)
    gap, top, bottom, side = 48, 110, 56, 64
    availW, availH = W - 2*side - gap*(len(items)-1), H - top - bottom
    ratios = [i[0].width / i[0].height for i in items]
    h = min(availH, availW / sum(ratios))
    widths = [int(h*r) for r in ratios]; h = int(h)
    x = (W - (sum(widths) + gap*(len(items)-1))) // 2
    y = top + (availH - h) // 2
    for (img, label), w in zip(items, widths):
        shadow = Image.new("RGBA", (w+60, h+60), (0,0,0,0))
        ImageDraw.Draw(shadow).rectangle([30,40,w+30,h+40], fill=(0,0,0,150))
        im.paste(shadow.filter(ImageFilter.GaussianBlur(16)), (x-30, y-30), shadow.filter(ImageFilter.GaussianBlur(16)))
        im.paste(img.resize((w, h), Image.LANCZOS), (x, y))
        d.rectangle([x-2, y-2, x+w+1, y+h+1], outline=RULE, width=2)
        d.rectangle([x-2, y-2, x+34, y+1], fill=AMBER)
        d.rectangle([x, y-38, x+10, y-28], fill=AMBER)
        d.text((x+22, y-44), label, font=F, fill=INK2)
        x += w + gap
    im.save(f"{OUT}/{out}.webp", "WEBP", quality=84, method=6)

def frame(im, d, img, x, y, w, h, label, lab_above=True):
    sh = Image.new("RGBA", (w+80, h+80), (0,0,0,0))
    ImageDraw.Draw(sh).rectangle([40,52,w+40,h+52], fill=(0,0,0,170)); sh = sh.filter(ImageFilter.GaussianBlur(18))
    im.paste(sh, (x-40, y-40), sh)
    im.paste(img.resize((w, h), Image.LANCZOS), (x, y))
    d.rectangle([x-2, y-2, x+w+1, y+h+1], outline=RULE, width=2)
    d.rectangle([x-2, y-2, x+34, y+1], fill=AMBER)
    ly = y-38 if lab_above else y+h+16
    tw = int(d.textlength(label, font=F))
    d.rectangle([x-2, ly-10, x+tw+34, ly+20], fill=BG)
    d.rectangle([x, ly, x+10, ly+10], fill=AMBER); d.text((x+22, ly-6), label, font=F, fill=INK2)

def pip(main, inset, out, inset_w=0.42):
    im = panel(); d = ImageDraw.Draw(im)
    (a, la), (b, lb) = main, inset
    side, top = 64, 100
    mw = W - 2*side - 260; mh = int(mw / (a.width/a.height))
    if mh > H - top - 150: mh = H - top - 150; mw = int(mh * a.width/a.height)
    frame(im, d, a, side, top, mw, mh, la)
    iw = int(W*inset_w); ih = int(iw / (b.width/b.height))
    if ih > 560: ih = 560; iw = int(ih * b.width/b.height)
    frame(im, d, b, W - side - iw, H - 64 - ih, iw, ih, lb, lab_above=False if (H-64) > H else True)
    im.save(f"{OUT}/{out}.webp", "WEBP", quality=84, method=6)

compose([(load("pn-photo.webp", (0.08,0.06,0.92,0.94)), "HARDWARE · SOLDERED PCB"), (load("pn-dash.webp"), "DASHBOARD · LIVE STATES")], "panel-protection")
pip((load("en-dashboard.webp"), "DASHBOARD · ENERGY COMMAND CENTER"), (load("en-schematic.webp"), "WIRING · DESIGNED"), "energy-copilot", 0.30)
pip((load("mp-hw.webp", (0.04,0.04,0.96,0.96)), "HARDWARE · BREADBOARD"), (load("mp-dash.webp"), "CONSOLE · TWO METHODS"), "mpu6050-speed", 0.40)
compose([(load("fl-photo.webp"), "HARDWARE · BREADBOARD"), (load("fl-nodered.webp"), "DASHBOARD · NODE-RED")], "flood-warning")
compose([(load("mq-eth2.webp", (0.22,0.0,1.0,1.0)), "HARDWARE · BREADBOARD"), (load("mq-ui.webp"), "CONSOLE · AIR QUALITY")], "mq135-gas")
compose([(load("dr-circuit.webp"), "PROTEUS · FULL SYSTEM SIMULATION")], "dryer-8086")
pip((load("ees-landing.webp", (0,0,1,0.62)), "WEB APP · DEPLOYED"), (load("ees-api.webp", (0,0,1,0.8)), "API · TESTED"), "ee-studio", 0.40)
