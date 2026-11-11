import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import ico

TOTAL = 47.5
EV = []  # sound events (time, kind)
EO = "cubic-bezier(.16,1,.3,1)"      # ease-out expo-ish
EIO = "cubic-bezier(.65,0,.35,1)"

def A(name, t, d, ease=EO, fill="both"):
    return f"{name} {d}s {ease} {t}s {fill}"

def st(*anims, extra=""):
    return f'style="animation:{", ".join(anims)};{extra}"'

def scene(t0, t1, inner, cls="", out="sceneOut"):
    return f'<div class="scene {cls}" {st(A("sceneIn", t0, .01, "linear"), A(out, t1 - .35, .35, EIO, "forwards"))}>{inner}</div>'

def icon_img(slug, size, extra=""):
    return f'<img src="../icons/{slug}.png" style="width:{size}px;height:{size}px;display:block;{extra}">'

CSS = """
@font-face { font-family: "Archivo"; src: url("../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: "Geist"; src: url("../node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2"); font-weight: 400; }
@font-face { font-family: "Geist"; src: url("../node_modules/@fontsource/geist-sans/files/geist-sans-latin-500-normal.woff2"); font-weight: 500; }
@font-face { font-family: "Geist"; src: url("../node_modules/@fontsource/geist-sans/files/geist-sans-latin-600-normal.woff2"); font-weight: 600; }
@font-face { font-family: "GeistMono"; src: url("../node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2"); font-weight: 500; }
:root { --fg:#0e0e10; --muted:#5a5a60; --faint:#8a8a90; --border:#e3e3e1; --strong:#c9c9c6; --surface:#f6f6f5; --accent:#2a66d8; --ok:#1d9d54; }
* { box-sizing:border-box; margin:0; padding:0; }
html, body { width:1920px; height:1080px; overflow:hidden; background:#fff; color:var(--fg); font-family:Geist, sans-serif; -webkit-font-smoothing:antialiased; }
.display { font-family:Archivo; font-weight:700; font-stretch:125%; font-variation-settings:"wdth" 125; letter-spacing:-.025em; line-height:1.0; }
.hud { font-family:GeistMono; font-weight:500; font-size:18px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
.hl { color:var(--accent); }
span > svg { width:100%; height:100%; display:block; }
.scene { position:absolute; inset:0; }
.dark { background:#0e0e10; color:#fff; }
.abs { position:absolute; }
.line { overflow:hidden; display:block; padding-bottom:.08em; }
.line > span { display:inline-block; }
/* frame */
.rail { position:absolute; top:0; bottom:0; width:1px; background:var(--border); transform-origin:top; }
.hr { position:absolute; left:0; right:0; height:1px; background:var(--border); transform-origin:left; }
.x { position:absolute; width:17px; height:17px; }
.x::before, .x::after { content:""; position:absolute; background:var(--faint); }
.x::before { left:8px; top:0; width:1px; height:17px; } .x::after { top:8px; left:0; height:1px; width:17px; }
.wm { font-family:Archivo; font-weight:700; font-stretch:125%; font-variation-settings:"wdth" 125; letter-spacing:-.01em; }
.ruler { position:absolute; left:96px; right:96px; bottom:40px; height:14px; }
.ruler .base { position:absolute; left:0; right:0; top:6px; height:1px; background:var(--border); }
.ruler .fill { position:absolute; left:0; top:5px; height:3px; background:var(--accent); width:100%; transform-origin:left; }
.ruler i { position:absolute; top:0; width:1px; height:13px; background:var(--strong); }
/* keyframes */
@keyframes sceneIn { from { opacity:0 } to { opacity:1 } }
@keyframes sceneOut { from { opacity:1; transform:none } to { opacity:0; transform:translateY(-24px) } }
@keyframes sceneOutL { from { opacity:1; transform:none } to { opacity:0; transform:translateX(-80px) } }
@keyframes fade { from { opacity:0 } to { opacity:1 } }
@keyframes rise { from { transform:translateY(105%) } to { transform:none } }
@keyframes up { from { opacity:0; transform:translateY(34px) } to { opacity:1; transform:none } }
@keyframes pop { 0% { opacity:0; transform:scale(.4) } 60% { opacity:1; transform:scale(1.08) } 100% { opacity:1; transform:scale(1) } }
@keyframes drawX { from { transform:scaleX(0) } to { transform:scaleX(1) } }
@keyframes drawY { from { transform:scaleY(0) } to { transform:scaleY(1) } }
@keyframes slideR { from { opacity:0; transform:translateX(160px) rotateY(-8deg) } to { opacity:1; transform:none } }
@keyframes zoom { from { transform:scale(1) } to { transform:scale(1.045) } }
@keyframes ring { 0% { opacity:0; transform:scale(1.25) } 30% { opacity:1; transform:scale(1) } 70% { opacity:1; transform:scale(1) } 100% { opacity:.9; transform:scale(1) } }
@keyframes pulse { 0%,100% { box-shadow:0 0 0 0 rgba(42,102,216,.0) } 50% { box-shadow:0 0 0 14px rgba(42,102,216,.16) } }
@keyframes marquee { from { transform:translateX(0) } to { transform:translateX(-1900px) } }
@keyframes dash { from { stroke-dashoffset:1 } to { stroke-dashoffset:0 } }
@keyframes strike { from { transform:scaleX(0) } to { transform:scaleX(1) } }
@keyframes dim { from { opacity:1 } to { opacity:.28 } }
@keyframes slider { 0% { clip-path:inset(0 50% 0 0) } 35% { clip-path:inset(0 12% 0 0) } 75% { clip-path:inset(0 70% 0 0) } 100% { clip-path:inset(0 50% 0 0) } }
@keyframes sliderL { 0% { left:50% } 35% { left:88% } 75% { left:30% } 100% { left:50% } }
@keyframes btnPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.04) } }
@keyframes count { from { width:0 } to { width:100% } }
"""

parts = []

# ---------- persistent frame ----------
frame = f"""
<div class="rail" style="left:96px;{''}" {st(A('drawY', .0, 1.0, EIO))}></div>
<div class="rail" style="right:96px" {st(A('drawY', .1, 1.0, EIO))}></div>
<div class="hr" style="top:96px" {st(A('drawX', .2, 1.0, EIO))}></div>
<div class="x" style="left:88px;top:88px" {st(A('fade', .9, .4))}></div><div class="x" style="right:88px;top:88px" {st(A('fade', .9, .4))}></div>
<div class="abs hud" style="left:96px;top:36px;color:var(--fg)" {st(A('fade', .6, .5))}>Kojalytics&nbsp;&nbsp;<span style="color:var(--muted)">· 13 Apps · 1 Lizenz</span></div>
<div class="abs hud" style="right:96px;top:36px" {st(A('fade', .7, .5))}>Mac &amp; Windows · Kein Abo</div>
<div class="ruler" {st(A('fade', .8, .5))}><div class="base"></div>{''.join(f'<i style="left:{p}%"></i>' for p in range(0, 101, 10))}<div class="fill" {st(A('drawX', 0, TOTAL, 'linear'))}></div></div>
"""

# ---------- S1 intro 0–4 ----------
s1 = f"""
<div class="abs" style="left:96px;right:96px;top:300px;text-align:center">
 <div class="hud" {st(A('fade', .5, .6))}>Software-Lizenz · für Mac &amp; Windows</div>
 <div class="display" style="font-size:150px;margin-top:40px">
  <span class="line"><span {st(A('rise', .8, .9))}>13 Profi-Apps.</span></span>
  <span class="line"><span {st(A('rise', 1.35, .9))}><span class="hl">Eine</span> Lizenz.</span></span>
 </div>
</div>"""
parts.append(scene(0, 4.0, s1))
EV += [(0.0, "pad_in"), (0.8, "whoosh_soft"), (1.35, "whoosh_soft")]

# ---------- S2 icons 4–8.5 ----------
APPS = [("photo-koja", "PhotoKoja"), ("light-koja", "LightKoja"), ("vector-koja", "VectorKoja"), ("design-koja", "DesignKoja"),
        ("fig-koja", "FigKoja"), ("film-koja", "FilmKoja"), ("effect-koja", "EffectKoja"), ("sound-koja", "SoundKoja"),
        ("word-koja", "WordKoja"), ("grid-koja", "GridKoja"), ("deck-koja", "DeckKoja"), ("pdf-koja", "PdfKoja"), ("cad-koja", "CADKoja")]
icons = ""
for i, (s, n) in enumerate(APPS):
    row, col = (0, i) if i < 7 else (1, i - 7)
    x = 96 + 1728 / 7 * col + (1728 / 14 if row == 1 else 0) + 1728 / 14 - 70
    y = 360 + row * 300
    t = 4.35 + i * .11
    EV.append((t, "pop"))
    icons += f'<div class="abs" style="left:{x:.0f}px;top:{y}px;width:140px;text-align:center" {st(A("pop", t, .55))}>{icon_img(s, 140)}<div style="font-weight:600;font-size:23px;margin-top:16px">{n}</div></div>'
s2 = f"""
<div class="abs" style="left:96px;top:150px"><div class="hud" {st(A('fade', 4.05, .5))}>01 · Das Paket</div>
<div class="display" style="font-size:72px;margin-top:22px"><span class="line"><span {st(A('rise', 4.1, .8))}>Alles in <span class="hl">einem</span> Paket.</span></span></div></div>
{icons}"""
parts.append(scene(4.0, 8.5, s2))
EV += [(4.0, "drop"), (4.1, "whoosh")]

# ---------- S3 app scenes ----------
WW = 1160; S = WW / 1112
APPSC = [
    ("word-koja", "WordKoja", "Bewerbungen, Briefe<br>und Hausarbeiten.", [".docx öffnen &amp; speichern", "Kommentare &amp; Änderungen", "Ohne Office-Abo"], "04-wordkoja", (862, 146, 250, 430)),
    ("grid-koja", "GridKoja", "Haushaltsbuch, Budgets<br>und Auswertungen.", [".xlsx öffnen &amp; speichern", "Über 500 Funktionen", "17 Diagrammtypen"], "05-gridkoja", (0, 124, 420, 32)),
    ("deck-koja", "DeckKoja", "Präsentieren wie<br>ein Profi.", [".pptx öffnen &amp; speichern", "Morph-Übergänge", "Referentenansicht"], "06-deckkoja", (0, 34, 380, 50)),
    ("pdf-koja", "PdfKoja", "PDFs ordnen, zusammen-<br>fügen und schützen.", ["Seiten per Drag &amp; Drop", "Passwortschutz AES-256", "Ohne Acrobat-Abo"], "07-pdfkoja", (737, 296, 360, 290)),
    ("photo-koja", "PhotoKoja", "Fotos, die<br>leuchten.", ["PSD mit Ebenen &amp; Masken", "16 Einstellungsebenen", "Ohne Adobe-Abo"], "08-photokoja", None),
]
for k, (slug, name, head, bullets, win, spot) in enumerate(APPSC):
    T = 8.5 + 4 * k
    EV += [(T, "whoosh"), (T + .2, "pop_soft")] + [(T + .85 + .2 * i, "tick") for i in range(3)]
    bl = "".join(f'<div style="display:flex;gap:14px;align-items:center;font-size:27px;font-weight:500;margin-top:18px" {st(A("up", T + .85 + .2 * i, .6))}>'
                 f'<span style="width:30px;height:30px;color:{"var(--accent)" if "Ohne" in b else "var(--ok)"}">{ico("badge-euro" if "Ohne" in b else "check")}</span>{b}</div>' for i, b in enumerate(bullets))
    overlay = ""
    if spot:
        x, y, w, h = [v * S for v in spot]
        overlay = f'<div class="abs" style="left:{x-8:.0f}px;top:{y-8:.0f}px;width:{w+16:.0f}px;height:{h+16:.0f}px;border:3px solid var(--accent);border-radius:10px;box-shadow:0 0 0 6px rgba(42,102,216,.15)" {st(A("ring", T + 1.5, .7))}></div>'
        EV.append((T + 1.5, "ping"))
    else:  # live before/after slider on the photo
        ix, iy, iw, ih = 84 * S, 107 * S, 690 * S, 458 * S
        overlay = f"""<div class="abs" style="left:{ix:.1f}px;top:{iy:.1f}px;width:{iw:.1f}px;height:{ih:.1f}px;overflow:hidden">
<img src="../photo.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.12) contrast(1.06)">
<img src="../photo.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.86) saturate(.5) contrast(.82) sepia(.12);animation:{A('slider', T + 1.0, 2.6, EIO)}">
<div style="position:absolute;top:0;bottom:0;width:2px;background:#fff;margin-left:-1px;animation:{A('sliderL', T + 1.0, 2.6, EIO)}"><div style="position:absolute;top:50%;left:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><span style="width:20px;height:20px;color:#222">{ico('move-horizontal')}</span></div></div>
<div style="position:absolute;left:13px;top:13px;background:rgba(20,20,22,.72);color:#fff;font-size:12px;font-weight:600;padding:5px 10px;border-radius:4px">VORHER</div>
<div style="position:absolute;right:13px;top:13px;background:rgba(20,20,22,.72);color:#fff;font-size:12px;font-weight:600;padding:5px 10px;border-radius:4px">NACHHER</div></div>"""
        EV += [(T + 1.0, "slide_swish"), (T + 1.9, "slide_swish")]
    sc = f"""
<div class="abs" style="left:96px;top:190px;width:560px">
 <div class="hud" {st(A('fade', T + .1, .5))}>02 · App {k+1} / 5</div>
 <div style="margin-top:34px" {st(A('pop', T + .2, .6))}>{icon_img(slug, 120)}</div>
 <div class="display" style="font-size:70px;margin-top:30px"><span class="line"><span {st(A('rise', T + .3, .8))}>{name}</span></span></div>
 <div style="font-size:33px;color:var(--muted);margin-top:16px;line-height:1.3" {st(A('up', T + .45, .7))}>{head}</div>
 <div style="margin-top:22px">{bl}</div>
</div>
<div class="abs" style="left:668px;top:{(1080 - WW * 600 / 1112) / 2 + 20:.0f}px;width:{WW}px;perspective:1600px">
 <div {st(A('slideR', T + .05, .9))}><div style="position:relative;transform-origin:30% 50%;animation:{A('zoom', T + .9, 3.1, 'linear')}">
  <img src="win/{win}.png" style="width:{WW}px;display:block;border-radius:10px;box-shadow:0 40px 80px -30px rgba(20,20,30,.35),0 12px 24px -12px rgba(20,20,30,.2)">
  {overlay}
 </div></div>
</div>"""
    parts.append(scene(T, T + 4, sc, out="sceneOutL"))

# ---------- S4 marquee 28.5–33 ----------
MORE = [("light-koja", "LightKoja", "RAW-Entwicklung", "light-koja_grading"), ("vector-koja", "VectorKoja", "Vektorgrafik", "vector-koja_bezier"),
        ("design-koja", "DesignKoja", "Layout", "design-koja_hero"), ("fig-koja", "FigKoja", "Interface-Design", "fig-koja_components"),
        ("film-koja", "FilmKoja", "Videoschnitt", "film-koja_hero"), ("effect-koja", "EffectKoja", "Motion Graphics", "effect-koja_3d"),
        ("sound-koja", "SoundKoja", "Audioproduktion", "sound-koja_mix"), ("cad-koja", "CADKoja", "2D-CAD", "cad-koja_layout")]
cards = "".join(f"""<div style="width:500px;flex:none;margin-right:36px">
 <div style="height:300px;border:1px solid var(--border);border-radius:10px;overflow:hidden;box-shadow:0 20px 40px -24px rgba(20,20,30,.3)"><img src="../shots/{sh}.jpg" style="width:100%;height:100%;object-fit:cover;object-position:left top"></div>
 <div style="display:flex;gap:14px;align-items:center;margin-top:18px">{icon_img(s, 56)}<div><div style="font-weight:600;font-size:26px">{n}</div><div class="hud" style="font-size:14px">{k}</div></div></div></div>""" for s, n, k, sh in MORE)
s4 = f"""
<div class="abs" style="left:96px;top:150px"><div class="hud" {st(A('fade', 28.6, .5))}>03 · Und noch mehr</div>
<div class="display" style="font-size:72px;margin-top:22px"><span class="line"><span {st(A('rise', 28.65, .8))}>Plus <span class="hl">8</span> weitere Profi-Apps.</span></span></div>
<div style="font-size:30px;color:var(--muted);margin-top:16px" {st(A('up', 28.85, .7))}>Foto, Video, Audio, Design und CAD – alles inklusive.</div></div>
<div class="abs" style="left:0;top:480px;display:flex;padding-left:700px" {st(A('marquee', 28.5, 4.8, 'cubic-bezier(.3,.1,.4,1)'))}>{cards}</div>"""
parts.append(scene(28.5, 33.0, s4))
EV += [(28.5, "whoosh"), (28.7, "whoosh_long")]

# ---------- S5 price 33–39 (dark) ----------
months = ""
for i in range(24):
    t = 33.55 + i * .065
    EV.append((t, "coin_tick"))
    months += f'<div style="width:56px;height:56px;border:1px solid #3a3b42;display:flex;align-items:center;justify-content:center;font-family:GeistMono;font-size:20px;color:#cfd0d4" {st(A("pop", t, .3))}>€</div>'
s5 = f"""
<div class="scene dark" {st(A('fade', 33.0, .25))}>
 <div class="abs" style="left:96px;right:96px;top:150px" {st(A('dim', 35.95, .4, EIO, 'forwards'))}>
  <div class="hud" style="color:#9a9ba3" {st(A('fade', 33.1, .4))}>04 · Das Abo-Modell</div>
  <div class="display" style="font-size:72px;margin-top:22px"><span class="line"><span {st(A('rise', 33.15, .7))}>Jeden Monat zahlen …</span></span></div>
  <div style="display:grid;grid-template-columns:repeat(12,56px);gap:16px;margin-top:44px;position:relative">{months}
   <div style="position:absolute;left:-10px;right:180px;top:56%;height:4px;background:#e5484d;transform-origin:left" {st(A('strike', 35.35, .4, EIO))}></div></div>
  <div style="font-size:30px;color:#9a9ba3;margin-top:30px" {st(A('up', 35.1, .5))}>… und es hört nie auf.</div>
 </div>
 <div class="abs" style="left:96px;right:96px;top:540px;display:flex;align-items:center;gap:60px">
  <svg width="300" height="150" viewBox="0 0 300 150" {st(A('fade', 36.3, .2))}><path pathLength="1" d="M150 75 C 115 20, 30 20, 30 75 C 30 130, 115 130, 150 75 C 185 20, 270 20, 270 75 C 270 130, 185 130, 150 75 Z" fill="none" stroke="#2a66d8" stroke-width="16" stroke-linecap="round" style="stroke-dasharray:1;animation:{A('dash', 36.35, 1.3, EIO)}"/></svg>
  <div>
   <div class="hud" style="color:#9a9ba3" {st(A('fade', 36.1, .4))}>Kojalytics</div>
   <div class="display" style="font-size:96px;margin-top:14px"><span class="line"><span {st(A('rise', 36.1, .7))}><span style="color:#6f9cf0">Einmal</span> zahlen.</span></span>
   <span class="line"><span {st(A('rise', 36.6, .7))}>Unbegrenzt nutzen.</span></span></div>
  </div>
 </div>
</div>"""
parts.append(scene(33.0, 39.0, s5))
EV += [(33.0, "break"), (33.1, "whoosh"), (34.4, "riser"), (35.35, "strike"), (36.1, "impact"), (36.15, "chime")]

# ---------- S6 benefits 39–43 ----------
BEN = [("monitor-smartphone", "Mac &amp; Windows", "macOS und Windows 10/11"), ("laptop", "Bis zu 3 Geräte", "Mac und PC gemischt"),
       ("refresh-cw", "Alle Updates inklusive", "Immer aktuell, ohne Aufpreis"), ("mail-check", "Lizenz sofort per E-Mail", "und zusätzlich per Post")]
cells = ""
for i, (ic, t1, t2) in enumerate(BEN):
    t = 39.35 + i * .22
    EV.append((t, "pop_soft"))
    cells += f"""<div style="background:#fff;padding:40px 36px;height:400px;position:relative" {st(A('up', t, .6))}>
 <span class="hud" style="position:absolute;right:30px;top:36px;color:var(--faint)">0{i+1}</span>
 <div style="width:72px;height:72px;border:1px solid var(--strong);display:flex;align-items:center;justify-content:center"><span style="width:34px;height:34px">{ico(ic)}</span></div>
 <div style="font-size:34px;font-weight:600;margin-top:44px;letter-spacing:-.01em">{t1}</div><div style="font-size:24px;color:var(--muted);margin-top:12px">{t2}</div></div>"""
s6 = f"""
<div class="abs" style="left:96px;top:150px"><div class="hud" {st(A('fade', 39.05, .5))}>05 · Alles drin</div>
<div class="display" style="font-size:72px;margin-top:22px"><span class="line"><span {st(A('rise', 39.1, .8))}>Kaufen, loslegen, <span class="hl">fertig</span>.</span></span></div></div>
<div class="abs" style="left:96px;right:96px;top:400px;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">{cells}</div>"""
parts.append(scene(39.0, 43.0, s6))
EV += [(39.0, "whoosh")]

# ---------- S7 outro 43–47.5 ----------
s7 = f"""
<div class="abs" style="left:96px;right:96px;top:250px;text-align:center">
 <div class="hud" {st(A('fade', 43.2, .5))}>13 Apps · Mac &amp; Windows · Kein Abo</div>
 <div class="display" style="font-size:132px;margin-top:40px">
  <span class="line"><span {st(A('rise', 43.3, .8))}><span class="hl">Einmal</span> zahlen.</span></span>
  <span class="line"><span {st(A('rise', 43.75, .8))}>Für immer nutzen.</span></span></div>
 <div style="margin-top:64px;display:flex;justify-content:center" {st(A('up', 44.5, .6))}>
  <div style="background:var(--fg);color:#fff;font-family:GeistMono;font-size:24px;letter-spacing:.16em;padding:28px 48px;display:flex;gap:18px;align-items:center;animation:{A('btnPulse', 45.3, 1.0, EIO, 'none')}, {A('btnPulse', 46.3, 1.0, EIO, 'none')}">JETZT LIZENZ SICHERN <span style="width:26px;height:26px">{ico('arrow-right')}</span></div></div>
 <div class="wm" style="font-size:40px;margin-top:60px" {st(A('fade', 45.0, .6))}>Kojalytics</div>
</div>"""
parts.append(f'<div class="scene" {st(A("sceneIn", 43.0, .01, "linear"))}>{s7}</div>')
EV += [(43.0, "whoosh"), (43.3, "impact_soft"), (44.5, "pop_soft"), (45.3, "click")]

import re
def _merge(m):
    tag = m.group(0)
    styles = re.findall(r'style="([^"]*)"', tag)
    if len(styles) < 2: return tag
    tag = re.sub(r'\sstyle="[^"]*"', '', tag)
    return tag[:-1].rstrip() + ' style="' + ';'.join(x.strip(';') for x in styles) + '">'
parts = [re.sub(r'<[a-z]+\b[^<>]*>', _merge, p) for p in parts]
frame = re.sub(r'<[a-z]+\b[^<>]*>', _merge, frame)
html = f"""<!doctype html><html lang="de"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
{''.join(parts)}{frame}</body></html>"""
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "video.html"), "w").write(html)
json.dump({"total": TOTAL, "events": sorted(EV)}, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "events.json"), "w"), indent=0)
print("ok", len(EV), "events")
