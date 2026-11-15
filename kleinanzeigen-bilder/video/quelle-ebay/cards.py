"""Renders caption overlays (transparent) and intro/end cards for the eBay listing video."""
import os, sys, json
B = "/tmp/claude-0/-home-user-kojalytics-website/fe6ba28e-c723-50a1-8f23-7edc7500d270/scratchpad/build"
sys.path.insert(0, B)
from lib import ico
D = os.path.dirname(os.path.abspath(__file__))
FONT = f"""
@font-face {{ font-family: "Archivo"; src: url("file://{B}/node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2"); font-weight: 100 900; font-stretch: 62% 125%; }}
@font-face {{ font-family: "Geist"; src: url("file://{B}/node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2"); font-weight: 400; }}
@font-face {{ font-family: "Geist"; src: url("file://{B}/node_modules/@fontsource/geist-sans/files/geist-sans-latin-600-normal.woff2"); font-weight: 600; }}
@font-face {{ font-family: "GeistMono"; src: url("file://{B}/node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2"); font-weight: 500; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:1920px; height:1080px; background:transparent; font-family:Geist; color:#0e0e10; -webkit-font-smoothing:antialiased; }}
.d {{ font-family:Archivo; font-weight:700; font-stretch:125%; letter-spacing:-.025em; line-height:1.02; }}
.hud {{ font-family:GeistMono; font-weight:500; letter-spacing:.16em; text-transform:uppercase; color:#5a5a60; }}
.hl {{ color:#2a66d8; }}
span > svg {{ width:100%; height:100%; display:block; }}
"""
def icon(slug, s): return f'<img src="file://{B}/icons/{slug}.png" style="width:{s}px;height:{s}px;display:block">'

pages = {}
# caption overlay: app icon + title + sub, top band (video sits at y 200..1000)
def cap(name, slug, title, sub, idx):
    return f"""<div style="position:absolute;left:320px;right:320px;top:44px;display:flex;align-items:center;gap:26px">
 {icon(slug, 108)}<div style="flex:1"><div class="hud" style="font-size:17px">{idx}</div>
 <div class="d" style="font-size:52px;margin-top:8px">{title}</div></div></div>
 <div style="position:absolute;left:320px;right:320px;top:1012px;display:flex;justify-content:space-between;align-items:center">
 <div style="font-size:27px;color:#3a3a40">{sub}</div><div class="d" style="font-size:24px">Koja Office</div></div>"""

SEG = [
    ("pdf", "pdf-koja", 'PdfKoja – statt Adobe® <span class="hl">Acrobat®</span>', "PDFs bearbeiten, kommentieren, Seiten organisieren", "01 · PDF"),
    ("word", "word-koja", 'WordKoja – für Word®-<span class="hl">Dateien</span>', "Briefe & Bewerbungen, öffnet und speichert .docx", "02 · Texte"),
    ("grid", "grid-koja", 'GridKoja – für Excel®-<span class="hl">Tabellen</span>', "Formeln, Pivot-Tabellen, Diagramme, .xlsx", "03 · Tabellen"),
    ("deck", "deck-koja", 'DeckKoja – für <span class="hl">PowerPoint®</span>', "Präsentationen mit Morph und Referentenansicht", "04 · Präsentationen"),
    ("photo", "photo-koja", 'PhotoKoja – für Photoshop®-<span class="hl">PSD</span>', "Ebenen, Masken, 16 Einstellungsebenen", "05 · Bildbearbeitung"),
]
for k, slug, t, s, idx in SEG:
    pages[f"cap_{k}"] = cap(k, slug, t, s, idx)
MORE = [("light-koja", "LightKoja", "RAW-Fotos"), ("vector-koja", "VectorKoja", "Vektorgrafik"), ("design-koja", "DesignKoja", "Layout"),
        ("fig-koja", "FigKoja", "App-Design"), ("film-koja", "FilmKoja", "Videoschnitt"), ("effect-koja", "EffectKoja", "Animation"),
        ("sound-koja", "SoundKoja", "Audio"), ("cad-koja", "CADKoja", "2D-CAD")]
for i, (slug, n, k) in enumerate(MORE):
    pages[f"cap_more{i}"] = cap("more", slug, f'{n} <span style="color:#8a8a90">· {k}</span>', "Plus 8 weitere Profi-Apps – alle inklusive", f"06 · Und noch mehr {i+1}/8")

# intro card (opaque)
pages["intro"] = f"""<div style="position:absolute;inset:0;background:#fff"></div>
<div style="position:absolute;left:0;right:0;top:250px;text-align:center">
 <div class="hud" style="font-size:22px">Software-Lizenz · Mac &amp; Windows</div>
 <div class="d" style="font-size:140px;margin-top:40px">13 Profi-Apps.<br><span class="hl">Eine</span> Lizenz.</div>
 <div style="font-size:34px;color:#5a5a60;margin-top:44px">Echte Aufnahmen aus Koja Office</div></div>"""

# end card (opaque): price anchor from kojalytics.com comparison tables (Stand November 2026)
row = lambda n, p: f'<div style="display:flex;justify-content:space-between;font-size:34px;padding:16px 0;border-bottom:1px solid #e3e3e1"><span>{n}</span><span style="color:#5a5a60">{p}</span></div>'
pages["end"] = f"""<div style="position:absolute;inset:0;background:#fff"></div>
<div style="position:absolute;left:200px;top:150px;width:700px">
 <div class="hud" style="font-size:20px">Im Abo pro Jahr</div>
 <div style="margin-top:22px">{row("Microsoft 365 Single", "99,00 €")}{row("Adobe® Photoshop®", "311,73 €")}{row("Adobe® Acrobat® Pro", "285,48 €")}</div>
 <div style="display:flex;justify-content:space-between;font-size:40px;font-weight:600;padding:20px 0"><span>Zusammen</span><span>696,21 € / Jahr</span></div>
 <div style="font-size:19px;color:#8a8a90;margin-top:6px">Preise laut Herstellern, Stand November 2026, ohne Gewähr.</div></div>
<div style="position:absolute;left:1000px;top:150px;width:720px;height:640px;background:#0e0e10;color:#fff;padding:60px 56px">
 <div class="hud" style="font-size:20px;color:#9a9ba3">Koja Office</div>
 <div class="d" style="font-size:96px;margin-top:30px"><span style="color:#6f9cf0">Einmal</span><br>zahlen.</div>
 <div style="font-size:34px;margin-top:40px;line-height:1.45;color:#d6d6da">13 Apps · Mac &amp; Windows<br>bis zu 3 Geräte · Updates inklusive<br>Lizenz sofort per E-Mail + Post</div></div>
<div style="position:absolute;left:200px;right:200px;top:860px;text-align:center">
 <div class="d" style="font-size:44px">Jetzt <span class="hl">sofort kaufen</span> – Schlüssel kommt automatisch.</div>
 <div style="font-size:17px;color:#8a8a90;margin-top:26px">Microsoft 365 ist eine Marke der Microsoft Corporation, Adobe, Photoshop und Acrobat sind Marken von Adobe Inc. Kojalytics steht in keiner Verbindung zu diesen Unternehmen. Frühe Version (Alpha).</div></div>"""

for name, body in pages.items():
    open(f"{D}/{name}.html", "w").write(f'<!doctype html><html><head><meta charset="utf-8"><style>{FONT}</style></head><body>{body}</body></html>')
json.dump(list(pages), open(f"{D}/pages.json", "w"))
print(len(pages), "pages")
