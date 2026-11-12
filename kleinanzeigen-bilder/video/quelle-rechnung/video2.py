import sys, os, json, re
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(D))
from lib import ico

TOTAL = 31.0
EV = []
EO = "cubic-bezier(.16,1,.3,1)"; EIO = "cubic-bezier(.65,0,.35,1)"
def A(n, t, d, e=EO, f="both"): return f"{n} {d}s {e} {t}s {f}"
def st(*a, extra=""): return f'style="animation:{", ".join(a)};{extra}"'
def scene(t0, t1, inner, cls=""):
    return f'<div class="scene {cls}" {st(A("sceneIn", t0, .01, "linear"), A("sceneOut", t1 - .35, .35, EIO, "forwards"))}>{inner}</div>'

# window geometry (frame coords)
WX, WY, WW, WH = 372, 132, 1452, 864
SBW = 300; TOP = 92
PW, PH = 509, 720
PX = SBW + (WW - SBW - PW) // 2; PY = TOP + 22          # page in window coords
def fp(x, y): return WX + PX + x, WY + PY + y          # page -> frame
def fw(x, y): return WX + x, WY + y                    # window -> frame

TOOLS = [("file-output", "PDF exportieren", "#2a66d8"), ("pen-line", "Ausfüllen und unterschreiben", "#8a5cf6"),
    ("file-pen", "PDF bearbeiten", "#e03690"), ("file-plus", "PDF erstellen", "#e5484d"),
    ("files", "Dateien zusammenführen", "#2a66d8"), ("layout-grid", "Seiten organisieren", "#1d9d54"),
    ("message-square-text", "Kommentare hinzufügen", "#ef8a1b"), ("scan-text", "Scan und OCR", "#1d9d54"),
    ("shield-check", "PDF schützen", "#2a66d8"), ("rectangle-horizontal", "PDF schwärzen", "#e5484d"),
    ("file-down", "PDF komprimieren", "#e03690"), ("text-cursor-input", "Formular vorbereiten", "#8a5cf6"),
    ("stamp", "Stempel hinzufügen", "#8a5cf6"), ("badge-check", "Zertifikat verwenden", "#11a58a"),
    ("printer", "Druckproduktion verwenden", "#8a5cf6"), ("ruler", "Objekte messen", "#e03690"),
    ("git-compare", "Dateien vergleichen", "#e03690"), ("list-checks", "Geführte Aktionen verwenden", "#8a5cf6")]
ROW0, ROWH = TOP + 58, 37
def tool_y(i): return ROW0 + i * ROWH + ROWH / 2

CSS = open(os.path.join(os.path.dirname(D), "video", "video.py")).read().split('CSS = """')[1].split('"""')[0]
CSS += """
.win { position:absolute; left:%dpx; top:%dpx; width:%dpx; height:%dpx; background:#f1f1f3; border:1px solid #c9c9c6; border-radius:12px; overflow:hidden; box-shadow:0 40px 90px -30px rgba(20,20,30,.35),0 12px 26px -12px rgba(20,20,30,.2); }
.tb2 { height:40px; display:flex; align-items:center; gap:14px; padding:0 14px; background:#e9e9ec; border-bottom:1px solid #dcdce0; font-size:15px; }
.dots { display:flex; gap:8px; } .dots i { width:13px; height:13px; border-radius:50%%; background:#ff5f57; display:block; } .dots i:nth-child(2){background:#febc2e} .dots i:nth-child(3){background:#28c840}
.tab { display:flex; gap:8px; align-items:center; background:#fff; border:1px solid #dcdce0; border-bottom:0; height:32px; margin-top:8px; padding:0 14px; border-radius:7px 7px 0 0; font-size:14px; }
.tab svg { width:15px; height:15px; color:#e5484d; }
.tbar { height:52px; display:flex; align-items:center; gap:22px; padding:0 18px; background:#fff; border-bottom:1px solid #e3e3e6; font-size:16px; color:#555; white-space:nowrap; }
.tbar .on { color:#111; font-weight:600; }
.tbar .se { margin-left:auto; width:300px; height:34px; border:1px solid #d6d6da; border-radius:17px; display:flex; align-items:center; gap:8px; padding:0 14px; color:#888; font-size:14px; }
.tbar .ic { display:flex; gap:16px; color:#555; } .tbar svg { width:19px; height:19px; }
.sb { position:absolute; left:0; top:%dpx; bottom:0; width:%dpx; background:#fff; border-right:1px solid #e3e3e6; padding:10px 14px; }
.sb .hd { font-weight:600; font-size:17px; padding:6px 8px 12px; border-bottom:1px solid #ececef; }
.tl { position:absolute; left:14px; right:14px; height:%dpx; display:flex; align-items:center; gap:12px; font-size:15.5px; padding:0 10px; border-radius:7px; }
.tl svg { width:19px; height:19px; stroke-width:1.7; }
.tlh { position:absolute; left:14px; right:14px; height:%dpx; border-radius:7px; background:#e6efff; box-shadow: inset 0 0 0 1.5px #9ab8ef; opacity:0; }
.mv { position:absolute; left:%dpx; right:0; top:%dpx; bottom:0; }
.page { position:absolute; left:%dpx; top:%dpx; width:%dpx; height:%dpx; background:#fff; box-shadow:0 2px 10px rgba(0,0,0,.18); }
.page img { width:100%%; height:100%%; display:block; }
.cursor { position:absolute; left:0; top:0; width:34px; height:34px; z-index:50; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
.ripple { position:absolute; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%%; border:3px solid #2a66d8; z-index:49; opacity:0; }
@keyframes ripple { 0%% { opacity:.9; transform:scale(.3) } 100%% { opacity:0; transform:scale(1.4) } }
@keyframes stampIn { 0%% { opacity:0; transform:rotate(-8deg) scale(2.2) } 70%% { opacity:1; transform:rotate(-8deg) scale(.94) } 100%% { opacity:1; transform:rotate(-8deg) scale(1) } }
@keyframes hl { 0%% { opacity:0 } 100%% { opacity:1 } }
@keyframes hlOut { from { opacity:1 } to { opacity:0 } }
@keyframes dlg { 0%% { opacity:0; transform:translate(-50%%,-46%%) scale(.94) } 100%% { opacity:1; transform:translate(-50%%,-50%%) scale(1) } }
@keyframes dlgOut { from { opacity:1 } to { opacity:0 } }
@keyframes flyOut { 0%% { opacity:0; transform:translate(0,30px) scale(.9) } 25%% { opacity:1; transform:none } 75%% { opacity:1; transform:translate(260px,-40px) scale(.9) } 100%% { opacity:0; transform:translate(330px,-60px) scale(.6) } }
@keyframes steps { from { width:0 } to { width:100%% } }
""" % (WX, WY, WW, WH, TOP, SBW, ROWH, ROWH, SBW, TOP, PX - SBW, PY - TOP, PW, PH)

parts = []
# ---------- frame ----------
frame = f"""
<div class="rail" style="left:96px" {st(A('drawY', 0, 1.0, EIO))}></div><div class="rail" style="right:96px" {st(A('drawY', .1, 1.0, EIO))}></div>
<div class="hr" style="top:96px" {st(A('drawX', .2, 1.0, EIO))}></div>
<div class="abs hud" style="left:96px;top:36px;color:var(--fg)" {st(A('fade', .6, .5))}>PdfKoja&nbsp;&nbsp;<span style="color:var(--muted)">· Praxis · Rechnung bearbeiten</span></div>
<div class="abs hud" style="right:96px;top:36px" {st(A('fade', .7, .5))}>Koja Office · Mac &amp; Windows</div>
<div class="ruler" {st(A('fade', .8, .5))}><div class="base"></div>{''.join(f'<i style="left:{p}%"></i>' for p in range(0, 101, 10))}<div class="fill" {st(A('drawX', 0, TOTAL, 'linear'))}></div></div>"""

# ---------- S1 intro ----------
s1 = f"""<div class="abs" style="left:96px;right:96px;top:300px;text-align:center">
 <div style="display:flex;justify-content:center" {st(A('pop', .3, .6))}><img src="../icons/pdf-koja.png" style="width:150px"></div>
 <div class="display" style="font-size:104px;margin-top:40px"><span class="line"><span {st(A('rise', .7, .8))}>Rechnung fertig –</span></span>
 <span class="line"><span {st(A('rise', 1.1, .8))}>in <span class="hl">30 Sekunden</span>.</span></span></div></div>"""
parts.append(scene(0, 3.5, s1))
EV += [(.3, "pop"), (.7, "whoosh_soft"), (1.1, "whoosh_soft")]

# ---------- steps column ----------
STEPS = [("Öffnen", 3.6, 7.0), ("Stempel setzen", 7.0, 10.5), ("Unterschreiben", 10.5, 14.5), ("Mit Passwort schützen", 14.5, 18.5), ("Speichern &amp; senden", 18.5, 22.8)]
steps = ""
for i, (n, a, b) in enumerate(STEPS):
    steps += f"""<div style="position:relative;padding:18px 0 16px;border-bottom:1px solid var(--border)" {st(A('up', 3.7 + i * .08, .5))}>
 <div class="hud" style="font-size:14px">Schritt 0{i+1}</div>
 <div style="font-size:22px;font-weight:600;margin-top:6px;opacity:.35;animation:{A('fade', a, .3, EO, 'forwards')}">{n}</div>
 <div style="position:absolute;left:0;bottom:-1px;height:3px;background:var(--accent);animation:{A('steps', a, b - a, 'linear')}"></div></div>"""
stepcol = f'<div class="abs" style="left:96px;top:150px;width:240px">{steps}</div>'

# ---------- the app window ----------
tools = "".join(f'<div class="tl" style="top:{ROW0 - TOP + i*ROWH}px"><span style="color:{c};display:flex">{ico(ic)}</span>{n}</div>' for i, (ic, n, c) in enumerate(TOOLS))
def tool_hl(i, t0, t1):
    return f'<div class="tlh" style="top:{ROW0 - TOP + i*ROWH}px;animation:{A("hl", t0, .2)}, {A("hlOut", t1, .3, EO, "forwards")}"></div>'
hls = tool_hl(12, 7.7, 10.4) + tool_hl(1, 11.2, 14.4) + tool_hl(8, 15.2, 18.4)

start_screen = f"""<div class="abs" style="left:0;right:0;top:0;bottom:0;padding:40px 48px;animation:{A('dlgOut', 5.2, .25, EO, 'forwards')}">
 <div style="font-size:32px;font-weight:600">Willkommen bei PdfKoja</div><div style="font-size:16px;color:#666;margin-top:6px">Lokal, privat und offline – deine PDFs bleiben auf deinem Rechner.</div>
 <div style="margin:36px auto 0;width:420px;height:200px;border:2px dashed #c9c9cf;border-radius:14px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
  <span style="width:48px;height:48px;color:#555">{ico('folder-open')}</span><b style="font-size:20px">Datei öffnen</b><span style="font-size:14px;color:#888">oder PDF hierher ziehen</span></div></div>"""

px, py = PX - SBW, PY - TOP
stamp = f"""<div class="abs" style="left:{143-110}px;top:{468-38}px;width:220px;height:76px;border:5px solid #c62f3a;border-radius:10px;color:#c62f3a;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Archivo;font-weight:800;font-stretch:115%;letter-spacing:.08em;mix-blend-mode:multiply;animation:{A('stampIn', 8.9, .35, 'cubic-bezier(.5,0,.6,1.4)')}">
 <span style="font-size:30px;line-height:1">BEZAHLT</span><span style="font-family:GeistMono;font-size:12px;letter-spacing:.14em;margin-top:3px">12.11.2026</span></div>"""
sig = f"""<svg class="abs" style="left:150px;top:586px" width="170" height="60" viewBox="0 0 170 60">
 <path pathLength="1" d="M6 40 C 14 12, 26 10, 24 34 C 22 52, 34 46, 40 30 C 44 20, 50 22, 48 36 C 47 46, 56 44, 62 30 C 66 22, 72 24, 70 36 C 69 44, 78 40, 86 28 C 92 20, 98 26, 96 38 C 95 46, 106 42, 114 32 C 122 22, 130 26, 128 36 M 120 48 C 136 44, 152 42, 166 40" fill="none" stroke="#1f3e8a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1;animation:{A('dash', 12.3, 1.4, 'cubic-bezier(.4,0,.6,1)')}"/></svg>"""
doc_view = f"""<div class="abs" style="left:0;right:0;top:0;bottom:0;animation:{A('fade', 5.3, .3)}">
 <div class="abs" style="left:{px}px;top:{py}px;width:{PW}px;height:{PH}px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.18);animation:{A('up', 5.35, .6)}">
  <img src="invoice.png" style="width:100%;height:100%;display:block">{stamp}{sig}
 </div>
 <div class="abs" style="right:24px;top:24px;display:flex;flex-direction:column;gap:12px" {st(A('fade', 5.8, .4))}>{''.join(f'<div style="width:40px;height:40px;border-radius:8px;background:#fff;border:1px solid #e3e3e6;display:flex;align-items:center;justify-content:center;color:#555"><span style="width:19px;height:19px;display:flex">{ico(i)}</span></div>' for i in ('zoom-in', 'zoom-out', 'rotate-cw'))}</div>
</div>"""

# password dialog
dots = "".join(f'<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#222;margin-right:7px;animation:{A("pop", 15.8 + i*.12, .15)}"></span>' for i in range(10))
for i in range(10): EV.append((15.8 + i * .12, "type"))
DLG_W = 460
dialog = f"""<div class="abs" style="left:50%;top:50%;width:{DLG_W}px;background:#fff;border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.06);padding:26px 28px;z-index:20;animation:{A('dlg', 15.35, .35)}, {A('dlgOut', 17.7, .25, EO, 'forwards')}">
 <div style="display:flex;gap:12px;align-items:center;font-size:21px;font-weight:600"><span style="width:26px;height:26px;color:#2a66d8;display:flex">{ico('shield-check')}</span>PDF schützen</div>
 <div style="color:#666;font-size:15px;margin:6px 0 18px">Ohne Passwort lässt sich die Datei nicht öffnen.</div>
 <div style="font-size:14px;color:#555;margin-bottom:6px">Passwort zum Öffnen</div>
 <div style="height:44px;border:2px solid #2a66d8;border-radius:8px;display:flex;align-items:center;padding:0 14px">{dots}</div>
 <div style="font-size:14px;color:#555;margin:16px 0 6px">Verschlüsselung</div>
 <div style="height:44px;border:1px solid #cfd2d6;border-radius:8px;display:flex;align-items:center;padding:0 14px;font-size:16px">AES-256 (empfohlen)</div>
 <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:22px"><span style="padding:11px 20px;border:1px solid #d0d0d0;border-radius:8px;font-size:15px">Abbrechen</span><span style="padding:11px 22px;background:#2a66d8;color:#fff;border-radius:8px;font-size:15px;font-weight:600">Schützen</span></div>
</div>"""

toast = f"""<div class="abs" style="right:28px;bottom:28px;width:420px;background:#0e0e10;color:#fff;border-radius:12px;padding:16px 18px;display:flex;gap:14px;align-items:center;z-index:30;animation:{A('flyOut', 19.35, 2.6, EIO)}">
 <span style="width:44px;height:52px;border-radius:6px;background:#e5484d;display:flex;align-items:center;justify-content:center;font-family:Archivo;font-weight:800;font-size:13px">PDF</span>
 <div style="flex:1"><div style="font-weight:600;font-size:16px">Rechnung_KJ-2026-10482.pdf</div><div style="font-size:13px;color:#aaa;margin-top:3px">Gespeichert · 86 KB · AES-256 geschützt</div></div>
 <span style="width:26px;height:26px;color:#7ee2a8;display:flex">{ico('circle-check')}</span></div>"""

tab_lock = f'<span style="width:15px;height:15px;color:#1d9d54;display:none;animation:{A("pop", 17.8, .4)}">{ico("lock")}</span>'
window = f"""<div class="win" {st(A('up', 3.5, .7))}>
 <div class="tb2"><div class="dots"><i></i><i></i><i></i></div>
  <div class="tab" style="color:#888">{ico('house').replace('<svg','<svg style="color:#2a66d8"')}Start</div>
  <div class="tab" {st(A('fade', 5.3, .3))}>{ico('file-text')}Rechnung_KJ-2026-10482.pdf<span style="width:15px;height:15px;color:#1d9d54;display:flex" {st(A('pop', 17.8, .4))}>{ico('lock')}</span></div></div>
 <div class="tbar"><span style="display:flex;gap:8px;align-items:center;color:#222"><span style="width:19px;height:19px;display:flex">{ico('panel-left')}</span>Menü</span><span class="on">Alle Werkzeuge</span><span>Lesen</span><span>Bearbeiten</span><span>Konvertieren</span><span>E-Signatur</span>
  <span class="se"><span style="width:16px;height:16px;display:flex">{ico('search')}</span>Werkzeuge und Befehle suchen …</span><span class="ic">{ico('save')}{ico('printer')}</span></div>
 <div class="sb"><div class="hd">Alle Werkzeuge</div></div>
 <div class="abs" style="left:0;top:{TOP}px;width:{SBW}px;bottom:0">{hls}{tools}</div>
 <div class="mv">{start_screen}{doc_view}{dialog}{toast}</div>
</div>"""

# ---------- cursor path ----------
save_x, save_y = fw(WW - 18 - 19 - 16 - 19 + 9, 40 + 26)
dlg_btn = (WX + SBW + (WW - SBW) / 2 + DLG_W / 2 - 28 - 50, WY + TOP + (WH - TOP) / 2 + 150)
PATH = [(3.4, 1700, 1000), (4.0, 1700, 1000), (5.0, *fw(SBW + (WW - SBW) / 2, TOP + 40 + 100 + 120)),
        (6.8, *fw(SBW + (WW - SBW) / 2 + 40, TOP + 360)), (7.6, *fw(150, tool_y(12))), (8.1, *fw(150, tool_y(12))),
        (8.85, *fp(143, 468)), (10.4, *fp(150, 480)), (11.1, *fw(150, tool_y(1))), (11.6, *fw(150, tool_y(1))),
        (12.25, *fp(156, 626))]
# follow the signature roughly
for k in range(1, 8):
    PATH.append((12.3 + k * .2, *fp(156 + k * 22, 616 + (6 if k % 2 else -6))))
PATH += [(14.4, *fp(330, 640)), (15.1, *fw(150, tool_y(8))), (15.5, *fw(150, tool_y(8))),
         (17.3, *dlg_btn), (17.6, *dlg_btn), (19.1, save_x, save_y), (19.5, save_x, save_y), (22.6, save_x - 60, save_y + 140)]
kf = "".join(f"{t / TOTAL * 100:.3f}% {{ transform:translate({x:.0f}px,{y:.0f}px) }} " for t, x, y in PATH)
CSS += f"@keyframes cur {{ {kf} }}\n"
CLICKS = [(5.05, *PATH[2][1:]), (7.7, *fw(150, tool_y(12))), (8.9, *fp(143, 468)), (11.2, *fw(150, tool_y(1))),
          (15.2, *fw(150, tool_y(8))), (17.45, *dlg_btn), (19.2, save_x, save_y)]
ripples = "".join(f'<div class="ripple" style="left:{x:.0f}px;top:{y:.0f}px;animation:{A("ripple", t, .45, EO, "none")}"></div>' for t, x, y in CLICKS)
cursor = f"""<svg class="cursor" viewBox="0 0 24 24" style="animation:cur {TOTAL}s linear 0s both, {A('fade', 3.6, .3)}, {A('dlgOut', 22.7, .3, EO, 'forwards')}"><path d="M4 2 L4 19 L8.6 14.8 L11.6 21.4 L14.4 20.2 L11.4 13.7 L17.6 13.4 Z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>"""
EV += [(t, "click") for t, _, _ in CLICKS]
EV += [(3.5, "whoosh"), (3.55, "drop"), (5.3, "whoosh_soft"), (8.9, "stamp"), (12.3, "sign"), (15.35, "pop_soft"), (17.8, "ping"), (19.35, "save"), (20.3, "whoosh_long")]

parts.append(scene(3.5, 23.4, stepcol + window + ripples + cursor))

# ---------- S7 outro ----------
s7 = f"""<div class="abs" style="left:96px;right:96px;top:230px;text-align:center">
 <div class="hud" {st(A('fade', 23.6, .5))}>Stempel · Unterschrift · Passwortschutz · 19 Werkzeuge</div>
 <div class="display" style="font-size:120px;margin-top:40px"><span class="line"><span {st(A('rise', 23.7, .8))}>Alles in PdfKoja.</span></span>
 <span class="line"><span {st(A('rise', 24.15, .8))}><span class="hl">Ohne</span> Acrobat®-Abo.</span></span></div>
 <div style="margin-top:56px;display:flex;justify-content:center;gap:18px;align-items:center" {st(A('up', 25.0, .6))}>
  <div style="background:var(--fg);color:#fff;font-family:GeistMono;font-size:22px;letter-spacing:.16em;padding:24px 40px">KOJA OFFICE · EINMAL ZAHLEN</div></div>
 <div style="font-size:16px;color:var(--faint);margin-top:70px" {st(A('fade', 25.6, .6))}>Adobe® und Acrobat® sind Marken von Adobe Inc. Kojalytics steht in keiner Verbindung zu Adobe. Animierte Darstellung.</div>
</div>"""
parts.append(f'<div class="scene" {st(A("sceneIn", 23.4, .01, "linear"))}>{s7}</div>')
EV += [(23.4, "whoosh"), (23.7, "impact_soft"), (25.0, "pop_soft")]

def _merge(m):
    tag = m.group(0); styles = re.findall(r'style="([^"]*)"', tag)
    if len(styles) < 2: return tag
    tag = re.sub(r'\sstyle="[^"]*"', '', tag)
    return tag[:-1].rstrip() + ' style="' + ';'.join(x.strip(';') for x in styles) + '">'
html = f'<!doctype html><html lang="de"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(parts)}{frame}</body></html>'
html = re.sub(r'<[a-z]+\b[^<>]*>', _merge, html)
html = html.replace('url("../node_modules', 'url("../node_modules')
open(f"{D}/video.html", "w").write(html)
json.dump({"total": TOTAL, "events": sorted(EV), "break": [99, 99], "drop": 3.5}, open(f"{D}/events.json", "w"))
print("ok", len(EV))
