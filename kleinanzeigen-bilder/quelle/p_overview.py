from lib import *

APPS = [
    ("word-koja", "WordKoja", "Textverarbeitung", "Büro"), ("grid-koja", "GridKoja", "Tabellen", "Büro"),
    ("deck-koja", "DeckKoja", "Präsentationen", "Büro"), ("pdf-koja", "PdfKoja", "PDF-Editor", "Büro"),
    ("cad-koja", "CADKoja", "2D-CAD", "Büro"),
    ("photo-koja", "PhotoKoja", "Bildbearbeitung", "Foto"), ("light-koja", "LightKoja", "RAW-Fotos", "Foto"),
    ("vector-koja", "VectorKoja", "Vektorgrafik", "Foto"), ("design-koja", "DesignKoja", "Layout", "Foto"),
    ("fig-koja", "FigKoja", "Interface-Design", "Foto"),
    ("film-koja", "FilmKoja", "Videoschnitt", "Video"), ("effect-koja", "EffectKoja", "Motion Graphics", "Video"),
    ("sound-koja", "SoundKoja", "Audio", "Video"),
]
COLORS = ["#3c5bdc", "#1d9d54", "#ef641b", "#11a58a", "#13a4c7", "#2f7bf5", "#f3a617", "#e7573e", "#7ab51b"]

# Koja Office suite icon: squircle with a 3x3 mosaic of app colours
mosaic = "".join(f'<i style="background:{c}"></i>' for c in COLORS)
def suite_icon(size):
    return f'<div class="suite" style="width:{size}px;height:{size}px;border-radius:{size*0.23:.0f}px"><div class="mo">{mosaic}</div></div>'

css = """
.top { display:flex; gap:24px; align-items:center; padding:20px 0 0; }
.suite { background: linear-gradient(150deg, #1b2240 0%, #0e0e10 100%); position:relative; box-shadow: 0 18px 36px -16px rgba(20,30,70,.55), inset 0 1px 0 rgba(255,255,255,.12); display:flex; align-items:center; justify-content:center; flex:none; }
.suite .mo { width:62%; height:62%; display:grid; grid-template-columns:repeat(3,1fr); gap:9%; }
.suite .mo i { display:block; border-radius:22%; box-shadow: inset 0 1px 0 rgba(255,255,255,.35); }
.top h1 { font-size: 52px; }
.top p { font-size: 19px; color: var(--muted); margin-top: 8px; line-height: 1.4; }
.ver { display:inline-block; font-family:GeistMono; font-size:12px; letter-spacing:.14em; color:var(--accent); border:1px solid var(--accent); padding:4px 8px; margin-left:12px; vertical-align: 14px; }
.win { left:44px; right:44px; top:198px; height:620px; }
.tb { height:40px; }
.tb .t { display:flex; align-items:center; justify-content:center; gap:8px; font-weight:600; }
.side { position:absolute; left:0; top:40px; bottom:0; width:212px; background:#f7f7f6; border-right:1px solid #e6e6e4; padding:16px 12px; font-size:14px; }
.side h6 { font-family:GeistMono; font-weight:500; font-size:10.5px; letter-spacing:.16em; color:#8a8a90; margin:6px 8px 8px; }
.nv { display:flex; align-items:center; gap:9px; padding:8px 9px; border-radius:6px; color:#2a2a2e; }
.nv svg { width:17px; height:17px; stroke-width:1.8; color:#5a5a60; }
.nv b { margin-left:auto; font-weight:500; color:#8a8a90; font-size:12.5px; }
.nv.on { background:#e8eefb; color:#1f4fbf; font-weight:600; } .nv.on svg { color:#1f4fbf; } .nv.on b { color:#1f4fbf; }
.lic { position:absolute; left:12px; right:12px; bottom:14px; border:1px solid #d9d9d6; background:#fff; border-radius:8px; padding:12px; font-size:12.5px; }
.lic .ok { display:flex; gap:7px; align-items:center; color:var(--ok); font-weight:600; font-size:13.5px; }
.lic .ok svg { width:17px; height:17px; stroke-width:2.4; }
.lic .r { display:flex; justify-content:space-between; color:#5a5a60; margin-top:7px; }
.lic .r span:last-child { color:#0e0e10; font-weight:500; }
.main { position:absolute; left:212px; right:0; top:40px; bottom:0; padding:16px 20px; }
.bar2 { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.bar2 h3 { font-size:20px; font-weight:600; letter-spacing:-.01em; }
.srch { margin-left:auto; width:240px; height:32px; border:1px solid #d6d6d4; border-radius:7px; display:flex; align-items:center; gap:8px; padding:0 10px; color:#9a9aa0; font-size:13px; }
.srch svg { width:15px; height:15px; }
.upd { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--ok); font-weight:500; }
.upd svg { width:16px; height:16px; stroke-width:2.4; }
.grid { display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; }
.tile { border:1px solid #e6e6e4; border-radius:10px; padding:12px 10px 10px; display:flex; flex-direction:column; align-items:center; text-align:center; background:#fff; height:152px; position:relative; }
.tile .n { font-weight:600; font-size:15.5px; margin-top:9px; }
.tile .k { font-family:GeistMono; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#7a7a80; margin-top:3px; }
.tile .st { margin-top:auto; font-size:12px; font-weight:500; color:var(--ok); display:flex; gap:4px; align-items:center; }
.tile .st svg { width:13px; height:13px; stroke-width:2.6; }
.tile.sel { border-color:#2a66d8; box-shadow:0 0 0 3px rgba(42,102,216,.15), 0 10px 22px -12px rgba(20,40,90,.35); }
.tile .open { margin-top:auto; background:#2a66d8; color:#fff; font-size:12px; font-weight:600; padding:5px 16px; border-radius:6px; }
.tile.more { background:#f6f6f5; border-style:dashed; justify-content:center; gap:6px; color:#5a5a60; font-size:13px; }
.tile.more svg { width:26px; height:26px; color:#2a66d8; stroke-width:1.8; }
.tile.more b { color:#0e0e10; font-size:14.5px; }
"""

tiles = ""
for i, (s, n, k, g) in enumerate(APPS):
    sel = i == 0
    status = '<span class="open">Öffnen</span>' if sel else f'<span class="st">{ico("circle-check")}Installiert</span>'
    tiles += f'<div class="tile {"sel" if sel else ""}">{app_icon(s, 62)}<div class="n">{n}</div><div class="k">{k}</div>{status}</div>'
tiles += f'<div class="tile more">{ico("refresh-cw")}<b>Updates</b>inklusive</div>'
tiles += f'<div class="tile more">{ico("infinity")}<b>Lizenz</b>für immer</div>'

nav = [("layout-grid", "Alle Apps", "13", True), ("briefcase", "Büro", "5", False), ("palette", "Foto &amp; Design", "5", False), ("clapperboard", "Video &amp; Audio", "3", False)]
nav_html = "".join(f'<div class="nv {"on" if on else ""}">{ico(i)}<span>{t}</span><b>{c}</b></div>' for i, t, c, on in nav)
nav2 = [("download", "Updates", "aktuell"), ("monitor-smartphone", "Geräte", "1 / 3")]
nav2_html = "".join(f'<div class="nv">{ico(i)}<span>{t}</span><b>{c}</b></div>' for i, t, c in nav2)

body = f"""
<div class="top">{suite_icon(94)}<div>
 <h1 class="display">Koja <span class="hl">Office</span><span class="ver">2026</span></h1>
 <p>13 Profi-Apps in einer Software für Mac &amp; Windows. Einmal zahlen, für immer nutzen.</p></div></div>

<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="t">{suite_icon(20).replace('box-shadow', 'x-box-shadow')}<span>Koja Office</span></div></div>
 <div class="side">
  <h6>BIBLIOTHEK</h6>{nav_html}
  <h6 style="margin-top:16px">KONTO</h6>{nav2_html}
  <div class="lic"><div class="ok">{ico('shield-check')}Lizenz aktiv</div>
   <div class="r"><span>Laufzeit</span><span>Unbegrenzt</span></div>
   <div class="r"><span>Abo</span><span>Keins</span></div></div>
 </div>
 <div class="main">
  <div class="bar2"><h3>Alle Apps</h3><span class="upd">{ico('circle-check')}Alles auf dem neuesten Stand</span><div class="srch">{ico('search')}App suchen …</div></div>
  <div class="grid">{tiles}</div>
 </div>
</div>
"""

page("01-uebersicht", body, css, label="Software-Lizenz · Dauerhaft", idx="Koja Office", meta="Mac &amp; Windows",
     chips=[("infinity", "Dauerhafte Lizenz, kein Abo", "blue"), ("monitor-smartphone", "Bis zu 3 Geräte", "blue"), ("refresh-cw", "Updates inklusive", "blue"), ("mail-check", "Schlüssel per E-Mail + Post", "blue")])
