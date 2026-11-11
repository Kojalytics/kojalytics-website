from lib import *

HEAD_CSS = """
.head { display:flex; gap:22px; align-items:center; padding:30px 0 0; }
.head h1 { font-size: 46px; }
.head p { font-size: 19px; color: var(--muted); margin-top: 10px; line-height:1.4; }
.win { left: 44px; right: 44px; top: 214px; height: 600px; }
.tm { bottom: 69px; }
"""
def head(slug, h1, p):
    return f'<div class="head">{app_icon(slug, 84)}<div><h1 class="display">{h1}</h1><p>{p}</p></div></div>'

TM_MS = "Microsoft, Office und PowerPoint sind Marken der Microsoft Corporation. Kojalytics steht in keiner Verbindung zu Microsoft."
TM_AD = "Adobe, Acrobat und Photoshop sind Marken von Adobe Inc. Kojalytics steht in keiner Verbindung zu Adobe."

# ---------------- DeckKoja: presenter view ----------------
deck_css = HEAD_CSS + """
.win { background:#1c1d21; border-color:#2a2b30; }
.tb { background:#26272c; color:#ddd; border-bottom:1px solid #333; } .tb .t { color:#ddd; }
.top { height:50px; display:flex; align-items:center; gap:26px; padding:0 20px; color:#cfd0d4; font-size:13.5px; border-bottom:1px solid #2e2f35; }
.timer { font-family:GeistMono; font-size:24px; color:#fff; letter-spacing:.02em; }
.pill { border:1px solid #3a3b42; padding:5px 11px; border-radius:6px; display:flex; gap:7px; align-items:center; }
.pill svg { width:15px; height:15px; }
.cur { position:absolute; left:20px; top:104px; width:690px; height:388px; background:#fff; border-radius:3px; overflow:hidden; box-shadow:0 0 0 2px #ef641b; font-family:Geist; }
.lab { position:absolute; color:#9a9ba3; font-size:12px; font-family:GeistMono; letter-spacing:.12em; text-transform:uppercase; }
.next { position:absolute; left:732px; top:104px; width:358px; height:201px; background:#fff; border-radius:3px; overflow:hidden; }
.notes { position:absolute; left:732px; top:340px; width:358px; height:180px; color:#e8e8ea; font-size:15.5px; line-height:1.5; }
.notes li { margin: 0 0 8px 18px; }
.ctrl { position:absolute; left:20px; bottom:20px; display:flex; gap:10px; align-items:center; color:#cfd0d4; font-size:13px; }
.ctrl .btn { width:36px; height:36px; border:1px solid #3a3b42; border-radius:6px; display:flex; align-items:center; justify-content:center; }
.ctrl svg { width:18px; height:18px; }
.strip { position:absolute; right:20px; bottom:16px; display:flex; gap:8px; }
.strip div { width:62px; height:35px; background:#fff; border-radius:2px; opacity:.5; padding:6px 7px; }
.strip div::before { content:""; display:block; height:3px; width:60%; background:#ef641b; margin-bottom:4px; }
.strip div::after { content:""; display:block; height:12px; width:85%; background:#e4e4e7; }
.strip .on { opacity:1; outline:2px solid #ef641b; }
/* slide */
.s-pad { padding: 34px 40px; height:100%; position:relative; }
.s-kick { font-size:12px; font-weight:600; color:#ef641b; letter-spacing:.14em; text-transform:uppercase; }
.s-h { font-family:Archivo; font-stretch:110%; font-weight:700; font-size:32px; color:#18181b; margin-top:6px; letter-spacing:-.01em; }
.s-big { font-family:Archivo; font-stretch:115%; font-weight:800; font-size:76px; color:#ef641b; line-height:1; margin-top:30px; }
.s-sub { font-size:15px; color:#555; margin-top:8px; width:250px; line-height:1.4; }
.s-chart { position:absolute; right:40px; bottom:44px; display:flex; gap:16px; align-items:flex-end; height:220px; }
.s-chart div { width:60px; background:#f6c3a3; position:relative; }
.s-chart div.on { background:#ef641b; }
.s-chart span { position:absolute; bottom:-22px; left:0; right:0; text-align:center; font-size:12px; color:#666; }
.s-chart b { position:absolute; top:-21px; left:0; right:0; text-align:center; font-size:12px; color:#333; }
.s-foot { position:absolute; left:40px; bottom:14px; font-size:10px; color:#999; }
"""
bars = [("Q1", 120, ""), ("Q2", 150, ""), ("Q3", 178, "on")]
chart = "".join(f'<div class="{c}" style="height:{h}px"><b>{["412","515","608"][i]} T€</b><span>{l}</span></div>' for i, (l, h, c) in enumerate(bars))
slide_cur = f"""<div class="s-pad"><div class="s-kick">Quartalsbericht · Q3 2026</div><div class="s-h">Unser stärkstes Quartal</div>
<div class="s-big">+18 %</div><div class="s-sub">Umsatz gegenüber dem Vorquartal – getragen von 1.240 Neukunden.</div>
<div class="s-chart">{chart}</div><div class="s-foot">Café Rösterei Lindner · intern</div></div>"""
slide_next = """<div style="padding:18px 20px;font-family:Geist"><div class="s-kick" style="font-size:7px">Ausblick</div>
<div style="font-family:Archivo;font-stretch:110%;font-weight:700;font-size:18px;margin:4px 0 10px">Nächste Schritte für Q4</div>
<div style="font-size:10.5px;color:#444;line-height:1.7">① Zweite Filiale in Ehrenfeld<br>② Online-Shop mit Abo-Kaffee<br>③ Weihnachtsmarkt-Stand</div></div>"""
deck_body = head("deck-koja", 'Souverän <span class="hl">präsentieren</span>.',
                 "Folien gestalten, mit Morph-Übergängen vorführen, Notizen nur für dich sehen –<br>mit .pptx-Dateien wie gewohnt. Einmal kaufen statt Office-Abo.") + f"""
<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="t">Referentenansicht — Q3_Bericht.pptx</div></div>
 <div class="top"><span class="timer">00:07:42</span><span class="pill">{ico('pause')}Pause</span><span class="pill">{ico('rotate-ccw')}Zurücksetzen</span><span style="margin-left:auto">Folie <b style="color:#fff">5</b> von 12</span><span>14:32 Uhr</span></div>
 <div class="lab" style="left:20px;top:80px">Aktuelle Folie</div>
 <div class="cur">{slide_cur}</div>
 <div class="lab" style="left:732px;top:80px">Nächste Folie</div>
 <div class="next">{slide_next}</div>
 <div class="lab" style="left:732px;top:316px">Notizen</div>
 <ul class="notes"><li>Mit den 1.240 Neukunden einsteigen – das ist die Geschichte.</li><li>Auf den September zeigen: bester Monat seit Eröffnung.</li><li>Überleitung: Was heißt das für Q4?</li></ul>
 <div class="ctrl"><div class="btn">{ico('chevron-left')}</div><div class="btn">{ico('chevron-right')}</div><div class="btn">{ico('pen-line')}</div><div class="btn">{ico('laser-pointer') if os.path.exists(B+'/node_modules/lucide-static/icons/laser-pointer.svg') else ico('pointer')}</div><span style="margin-left:6px">Laserpointer · Stift · Folienübersicht</span></div>
 <div class="strip"><div></div><div></div><div></div><div></div><div class="on"></div><div></div></div>
</div>"""
page("06-deckkoja", deck_body, deck_css, label="DeckKoja · Präsentationen", idx="App 3/5", meta="Mac &amp; Windows",
     chips=[("check", "Öffnet &amp; speichert .pptx"), ("check", "Übergänge inkl. Morph"), ("check", "Referentenansicht"), ("badge-euro", "Kein Office-Abo nötig", "blue")], tm=TM_MS)

# ---------------- PdfKoja ----------------
pdf_css = HEAD_CSS + """
.tb { background:#f4f4f3; }
.tool { height:44px; display:flex; align-items:center; gap:6px; padding:0 12px; border-bottom:1px solid #e3e3e3; font-size:12.5px; color:#333; }
.tool .t2 { display:flex; gap:6px; align-items:center; padding:6px 10px; border-radius:6px; }
.tool .t2.on { background:#e6f5f1; color:#0b7a66; font-weight:600; }
.tool svg { width:16px; height:16px; stroke-width:1.8; }
.cmdk { margin-left:auto; border:1px solid #d6d6d6; border-radius:6px; padding:5px 10px; color:#888; width:230px; display:flex; justify-content:space-between; }
.side { position:absolute; left:0; top:78px; bottom:0; width:232px; border-right:1px solid #e3e3e3; background:#fafafa; padding:14px; font-size:13px; }
.side h6 { font-family:GeistMono; font-size:11px; letter-spacing:.14em; color:#888; font-weight:500; margin-bottom:10px; }
.bm { display:flex; gap:8px; align-items:center; padding:7px 8px; border-radius:5px; color:#222; }
.bm svg { width:15px; height:15px; color:#11a58a; flex:none; }
.bm.on { background:#e6f5f1; }
.bm small { margin-left:auto; color:#999; white-space:nowrap; }
.grid { position:absolute; left:232px; right:0; top:78px; bottom:0; background:#eceef0; padding:22px 26px; display:grid; grid-template-columns:repeat(5, 1fr); gap:20px 22px; align-content:start; }
.pg { display:flex; flex-direction:column; align-items:center; gap:7px; font-size:11.5px; color:#666; }
.sheet { width:120px; height:170px; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.18); padding:12px 11px; font-size:6.5px; color:#333; position:relative; }
.sheet .tt { font-weight:700; font-size:8.5px; line-height:1.2; margin-bottom:6px; color:#111; }
.sheet .ln { height:3px; background:#d9dbde; margin:4px 0; border-radius:1px; }
.sheet .bx { border:1px solid #cfd2d6; height:26px; margin:6px 0; }
.sheet .logo { width:26px; height:6px; background:#11a58a; margin-bottom:8px; opacity:.7; }
.pg.sel .sheet { outline:3px solid #11a58a; outline-offset:3px; }
.pg.drag { opacity:.9; transform:rotate(-4deg) translate(0,-6px); }
.pg.drag .sheet { box-shadow:0 14px 28px rgba(0,0,0,.25); }
.pg .badge { font-family:GeistMono; font-size:10px; color:#0b7a66; }
.modal { position:absolute; right:30px; bottom:26px; width:360px; background:#fff; border-radius:10px; box-shadow:0 20px 50px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.06); padding:20px 22px; font-size:13.5px; }
.modal h3 { font-size:17px; font-weight:600; display:flex; gap:10px; align-items:center; margin-bottom:4px; }
.modal h3 svg { width:20px; height:20px; color:#11a58a; }
.modal .d { color:#666; margin-bottom:14px; font-size:13px; }
.fl { font-size:12px; color:#555; margin:10px 0 5px; }
.in { border:1px solid #cfd2d6; border-radius:6px; height:34px; display:flex; align-items:center; padding:0 10px; font-size:18px; letter-spacing:.18em; color:#222; }
.in.sel2 { font-size:13.5px; letter-spacing:0; justify-content:space-between; }
.st { display:flex; gap:4px; margin-top:7px; } .st i { flex:1; height:4px; background:#11a58a; border-radius:2px; } .st i.o { background:#e1e3e6; }
.btns { display:flex; justify-content:flex-end; gap:10px; margin-top:18px; }
.btns span { padding:8px 16px; border-radius:6px; border:1px solid #d0d0d0; }
.btns .pri { background:#11a58a; color:#fff; border-color:#11a58a; font-weight:600; }
"""
docs = [
    ("Lohnsteuer-<br>bescheinigung 2026", "Lohnsteuer", 0, ""),
    ("Lohnsteuer-<br>bescheinigung 2026", "Lohnsteuer", 1, ""),
    ("Rechnung<br>Malerbetrieb Kunz", "Handwerker", 0, "sel"),
    ("Nebenkosten-<br>abrechnung 2026", "Nebenkosten", 0, ""),
    ("Nebenkosten-<br>abrechnung 2026", "Nebenkosten", 1, ""),
    ("Zuwendungs-<br>bestätigung", "Spende", 0, "drag"),
    ("Rechnung<br>Zahnarztpraxis", "Arzt", 0, ""),
    ("Riester-<br>Bescheinigung", "Riester", 0, ""),
    ("Kontoauszug<br>Dezember", "Konto", 0, ""),
    ("Fahrtkosten-<br>aufstellung", "Fahrtkosten", 0, ""),
]
def sheet(title, cont):
    if cont:
        inner = "".join('<div class="ln" style="width:%d%%"></div>' % w for w in [92, 85, 96, 70, 90, 88, 60, 94, 80, 90, 72])
        return f'<div class="sheet"><div class="logo"></div>{inner}</div>'
    inner = "".join('<div class="ln" style="width:%d%%"></div>' % w for w in [90, 76, 84])
    inner2 = "".join('<div class="ln" style="width:%d%%"></div>' % w for w in [94, 66, 88, 72])
    return f'<div class="sheet"><div class="logo"></div><div class="tt">{title}</div>{inner}<div class="bx"></div>{inner2}</div>'
pages = "".join(f'<div class="pg {c}">{sheet(t, cont)}<span>{"<span class=badge>verschieben …</span>" if c=="drag" else f"Seite {i+1}"}</span></div>' for i, (t, _, cont, c) in enumerate(docs))
bms = [("Lohnsteuerbescheinigung", "1–2"), ("Handwerkerrechnung", "3"), ("Nebenkostenabrechnung", "4–5"), ("Spendenquittung", "6"), ("Arztrechnung", "7"), ("Riester-Bescheinigung", "8"), ("Kontoauszug", "9"), ("Fahrtkosten", "10")]
bm_html = "".join(f'<div class="bm {"on" if i==1 else ""}">{ico("bookmark")}<span>{n}</span><small>{p}</small></div>' for i, (n, p) in enumerate(bms))
pdf_body = head("pdf-koja", 'Steuerunterlagen in <span class="hl">einer</span> Datei.',
                "PDFs zusammenfügen, Seiten ordnen und mit Passwort schützen –<br>ohne Acrobat-Abo und ohne Upload in irgendeine Cloud.") + f"""
<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="t">Steuer_2026_komplett.pdf — PdfKoja</div></div>
 <div class="tool"><span class="t2">{ico('panel-left')}</span><span class="t2 on">{ico('layout-grid')}Seiten ordnen</span><span class="t2">{ico('files')}Zusammenfügen</span><span class="t2">{ico('rotate-cw')}Drehen</span><span class="t2">{ico('trash-2')}Löschen</span><span class="t2">{ico('lock')}Schützen</span><span class="cmdk"><span>Werkzeug suchen …</span><span>⌘K</span></span></div>
 <div class="side"><h6>LESEZEICHEN · 8 DATEIEN</h6>{bm_html}</div>
 <div class="grid">{pages}</div>
 <div class="modal"><h3>{ico('shield-check')}Dokument schützen</h3><div class="d">Ohne Passwort lässt sich die Datei nicht öffnen.</div>
  <div class="fl">Passwort zum Öffnen</div><div class="in">••••••••••••</div><div class="st"><i></i><i></i><i></i><i class="o"></i></div>
  <div class="fl">Verschlüsselung</div><div class="in sel2"><span>AES-256 (empfohlen)</span>{ico('chevron-down').replace('<svg','<svg style="width:15px;height:15px"')}</div>
  <div class="btns"><span>Abbrechen</span><span class="pri">Schützen</span></div></div>
</div>"""
page("07-pdfkoja", pdf_body, pdf_css, label="PdfKoja · PDF-Programm", idx="App 4/5", meta="Mac &amp; Windows",
     chips=[("check", "Zusammenfügen &amp; ordnen"), ("check", "Passwortschutz AES-256"), ("check", "Offline, ohne Cloud"), ("badge-euro", "Kein Acrobat-Abo nötig", "blue")], tm=TM_AD)

# ---------------- PhotoKoja ----------------
photo_css = HEAD_CSS + """
.win { background:#2b2c30; border-color:#1e1f22; }
.tb { background:#323338; color:#ddd; border-bottom:1px solid #222; } .tb .t { color:#ddd; }
.menu { position:absolute; left:110px; top:0; height:34px; display:flex; gap:16px; align-items:center; color:#ddd; font-size:12.5px; }
.opt { height:36px; display:flex; align-items:center; gap:14px; padding:0 12px; background:#323338; border-bottom:1px solid #1f2023; color:#cfcfd3; font-size:12px; }
.opt .c { display:flex; gap:6px; align-items:center; } .opt .bx { width:12px; height:12px; border:1px solid #888; border-radius:2px; background:#4a7ce0; }
.tools { position:absolute; left:0; top:70px; bottom:0; width:46px; background:#323338; border-right:1px solid #1f2023; display:flex; flex-direction:column; align-items:center; gap:4px; padding-top:10px; }
.tools div { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:5px; color:#d6d6da; }
.tools div.on { background:#4a4c54; }
.tools svg { width:17px; height:17px; stroke-width:1.7; }
.sw { width:22px; height:22px; margin-top:8px; position:relative; }
.doc { position:absolute; left:46px; top:70px; right:300px; height:26px; background:#2b2c30; border-bottom:1px solid #1f2023; font-size:12px; color:#ddd; display:flex; align-items:center; }
.doc span { background:#3a3b41; padding:5px 14px; height:100%; display:flex; align-items:center; gap:10px; }
.stage { position:absolute; left:46px; top:96px; right:300px; bottom:24px; background:#1f2023; display:flex; align-items:center; justify-content:center; }
.img { position:relative; width:690px; height:458px; overflow:hidden; }
.img img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.img .before { filter: brightness(.86) saturate(.5) contrast(.82) sepia(.12); clip-path: inset(0 50% 0 0); }
.img .after { filter: saturate(1.12) contrast(1.06); }
.split { position:absolute; left:50%; top:0; bottom:0; width:2px; background:#fff; transform:translateX(-1px); }
.handle { position:absolute; left:50%; top:50%; width:38px; height:38px; margin:-19px 0 0 -19px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,.35); }
.handle svg { width:18px; height:18px; color:#222; }
.tag2 { position:absolute; top:14px; background:rgba(20,20,22,.72); color:#fff; font-size:12.5px; font-weight:600; padding:5px 10px; border-radius:4px; letter-spacing:.04em; }
.panel { position:absolute; right:0; top:70px; bottom:24px; width:300px; background:#323338; border-left:1px solid #1f2023; color:#d6d6da; font-size:12.5px; }
.ph { height:30px; display:flex; gap:16px; align-items:center; padding:0 12px; border-bottom:1px solid #26272b; font-size:12px; color:#9a9ba2; }
.ph .on { color:#fff; font-weight:600; }
.prop { padding:12px; border-bottom:1px solid #26272b; }
.prop .r { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.dd2 { background:#26272b; border:1px solid #45464d; border-radius:4px; padding:3px 8px; font-size:11.5px; }
.layer { display:flex; align-items:center; gap:9px; height:40px; padding:0 10px; border-bottom:1px solid #2a2b2f; font-size:12.5px; }
.layer.on { background:#3d4a66; }
.layer svg { width:15px; height:15px; color:#bbb; }
.th { width:30px; height:22px; background:#fff; border:1px solid #555; }
.status { position:absolute; left:46px; right:0; bottom:0; height:24px; background:#323338; border-top:1px solid #1f2023; font-size:11.5px; color:#aaa; display:flex; align-items:center; gap:22px; padding:0 14px; }
"""
tools = ["mouse-pointer-2", "square-dashed", "lasso", "wand-sparkles", "crop", "pipette", "brush", "stamp", "eraser", "type", "pen-tool", "hand", "zoom-in"]
tools_html = "".join(f'<div class="{"on" if t=="crop" and False else ""}">{ico(t) if os.path.exists(f"{B}/node_modules/lucide-static/icons/{t}.svg") else ""}</div>' for t in tools)
curve = """<svg width="276" height="150" viewBox="0 0 276 150" style="display:block;background:#26272b;border:1px solid #45464d">
<g stroke="#3a3b41">""" + "".join(f'<line x1="{x}" y1="0" x2="{x}" y2="150"/>' for x in (69, 138, 207)) + "".join(f'<line x1="0" y1="{y}" x2="276" y2="{y}"/>' for y in (37.5, 75, 112.5)) + """</g>
<path d="M0,150 L0,140 C20,130 30,110 45,118 C60,126 70,90 90,82 C110,74 120,96 140,88 C160,80 170,40 190,52 C210,64 220,100 240,108 C255,114 265,128 276,140 L276,150Z" fill="#5c5e66" opacity=".8"/>
<line x1="0" y1="150" x2="276" y2="0" stroke="#666" stroke-dasharray="3 3"/>
<path d="M0,150 C60,148 80,118 138,75 C196,32 216,4 276,0" stroke="#fff" stroke-width="1.8" fill="none"/>
<circle cx="78" cy="122" r="4" fill="#fff"/><circle cx="196" cy="30" r="4" fill="#fff"/></svg>"""
photo_body = head("photo-koja", 'Urlaubsfotos, die <span class="hl">leuchten</span>.',
                  "Bilder mit Ebenen, Masken und Gradationskurven bearbeiten – öffnet und speichert PSD.<br>Ohne monatliches Adobe-Abo.") + f"""
<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="menu"><b>PhotoKoja</b><span>Datei</span><span>Bearbeiten</span><span>Bild</span><span>Ebene</span><span>Auswahl</span><span>Filter</span><span>Ansicht</span><span>Fenster</span><span>Hilfe</span></div></div>
 <div class="opt"><span class="c"><span class="bx"></span>Autom. auswählen</span><span class="dd2">Ebene</span><span class="c"><span class="bx"></span>Transformationsstrg.</span><span style="margin-left:auto">Arbeitsbereich: Fotografie</span></div>
 <div class="tools">{tools_html}<div class="sw"><span style="position:absolute;left:0;top:0;width:15px;height:15px;background:#fff;border:1px solid #888"></span><span style="position:absolute;right:0;bottom:0;width:15px;height:15px;background:#111;border:1px solid #888"></span></div></div>
 <div class="doc"><span>Urlaub_Ligurien.psd @ 33,3 % (Gradationskurve 1, RGB/16) ✕</span></div>
 <div class="stage"><div class="img"><img class="after" src="photo.jpg"><img class="before" src="photo.jpg"><div class="split"></div><div class="handle">{ico('move-horizontal')}</div><div class="tag2" style="left:14px">VORHER</div><div class="tag2" style="right:14px">NACHHER</div></div></div>
 <div class="panel">
  <div class="ph"><span class="on">Eigenschaften</span><span>Korrekturen</span></div>
  <div class="prop"><div class="r"><span style="display:flex;gap:7px;align-items:center">{ico('spline').replace('<svg','<svg style="width:15px;height:15px"')}<b>Gradationskurve</b></span></div>
   <div class="r"><span class="dd2">Vorgabe: Kontrast erhöhen</span><span class="dd2">RGB</span></div>{curve}
   <div class="r" style="margin-top:8px;margin-bottom:0;color:#aaa"><span>Eingabe: 64</span><span>Ausgabe: 48</span></div></div>
  <div class="ph"><span class="on">Ebenen</span><span>Kanäle</span><span>Pfade</span></div>
  <div class="prop" style="padding:8px 12px"><div class="r" style="margin:0"><span class="dd2">Normal</span><span>Deckkraft: <span class="dd2">100 %</span></span></div></div>
  <div class="layer">{ico('eye')}<span class="th" style="background:linear-gradient(90deg,#f7c84a,#e8533b)"></span><span>Dynamik 1</span></div>
  <div class="layer on">{ico('eye')}<span class="th" style="background:#fff"></span><span class="th" style="background:linear-gradient(90deg,#000,#fff)"></span><span>Gradationskurve 1</span></div>
  <div class="layer">{ico('eye')}<span class="th" style="background:url(photo.jpg) center/cover"></span><span>Hintergrund</span>{ico('lock').replace('<svg','<svg style="margin-left:auto"')}</div>
 </div>
 <div class="status"><span>33,33 %</span><span>4096 × 2720 px (300 ppi)</span><span>3 Ebenen</span></div>
</div>"""
page("08-photokoja", photo_body, photo_css, label="PhotoKoja · Bildbearbeitung", idx="App 5/5", meta="Mac &amp; Windows",
     chips=[("check", "Öffnet &amp; speichert PSD"), ("check", "16 Einstellungsebenen"), ("check", "Offline, ohne Konto"), ("badge-euro", "Kein Adobe-Abo nötig", "blue")], tm=TM_AD)
