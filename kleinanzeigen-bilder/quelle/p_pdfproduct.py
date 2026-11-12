from lib import *

css = """
.head { display:flex; gap:22px; align-items:center; padding:24px 0 0; }
.head h1 { font-size: 42px; }
.head p { font-size: 18.5px; color: var(--muted); margin-top: 9px; line-height:1.4; }
.win { left:44px; top:190px; width:560px; height:432px; }
.tool { height:38px; display:flex; align-items:center; gap:4px; padding:0 10px; border-bottom:1px solid #e3e3e3; font-size:11.5px; color:#333; }
.tool .t2 { display:flex; gap:5px; align-items:center; padding:5px 8px; border-radius:5px; }
.tool .t2.on { background:#e6f5f1; color:#0b7a66; font-weight:600; }
.tool svg { width:14px; height:14px; stroke-width:1.8; }
.thumbs { position:absolute; left:0; top:72px; bottom:0; width:92px; background:#fafafa; border-right:1px solid #e3e3e3; padding:12px 0; display:flex; flex-direction:column; align-items:center; gap:10px; font-size:10px; color:#777; }
.th { width:54px; height:74px; background:#fff; box-shadow:0 1px 2px rgba(0,0,0,.2); padding:6px; }
.th i { display:block; height:2px; background:#d9dbde; margin:3px 0; }
.th.on { outline:2px solid #11a58a; outline-offset:2px; }
.view { position:absolute; left:92px; right:0; top:72px; bottom:0; background:#eceef0; overflow:hidden; }
.doc { position:absolute; left:28px; top:16px; width:410px; height:520px; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.18); padding:24px 28px; font-size:11.5px; color:#222; }
.doc .lg { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #1d7a43; padding-bottom:8px; margin-bottom:12px; }
.doc .lg b { font-size:14px; color:#1d4d2e; }
.doc h4 { font-size:15px; margin-bottom:10px; }
.fld { margin-bottom:9px; } .fld span { display:block; color:#666; font-size:10px; margin-bottom:3px; }
.fld div { height:24px; background:#e6efff; border:1px solid #9ab8ef; border-radius:2px; padding:0 7px; display:flex; align-items:center; font-size:12px; }
.fld div.act { border:2px solid #2a66d8; background:#fff; }
.two { display:flex; gap:10px; } .two .fld { flex:1; }
.cb { display:flex; gap:16px; margin:4px 0 10px; font-size:11.5px; } .cb span { display:flex; gap:6px; align-items:center; }
.cb i { width:13px; height:13px; border:1px solid #9ab8ef; background:#e6efff; display:inline-flex; align-items:center; justify-content:center; font-style:normal; font-size:11px; color:#2a66d8; font-weight:700; }
.sig { height:40px; border:1px dashed #9ab8ef; background:#f2f6ff; display:flex; align-items:center; justify-content:center; color:#5a7fc8; font-size:11px; gap:6px; }
.sig svg { width:14px; height:14px; }
.pal { position:absolute; left:120px; top:92px; width:330px; background:#fff; border-radius:10px; box-shadow:0 18px 44px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.08); overflow:hidden; font-size:13px; }
.pal .q { display:flex; gap:9px; align-items:center; padding:11px 13px; border-bottom:1px solid #eee; font-size:14.5px; }
.pal .q svg { width:16px; height:16px; color:#888; }
.pal .q kbd { margin-left:auto; font-family:GeistMono; font-size:11px; color:#888; border:1px solid #ddd; border-radius:4px; padding:1px 5px; }
.pal .it { display:flex; gap:9px; align-items:center; padding:8px 13px; color:#333; }
.pal .it svg { width:15px; height:15px; color:#11a58a; }
.pal .it.on { background:#e6f5f1; color:#0b5c4d; font-weight:600; }
.pal .it small { margin-left:auto; color:#999; font-size:11px; }
.caret { display:inline-block; width:1.5px; height:17px; background:#2a66d8; margin-left:1px; vertical-align:-3px; }
/* features */
.feat { position:absolute; left:630px; right:44px; top:190px; display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border); }
.f { background:#fff; padding:12px 14px; height:86px; display:flex; gap:12px; }
.f .ib { width:34px; height:34px; border:1px solid var(--strong); display:flex; align-items:center; justify-content:center; flex:none; }
.f .ib svg { width:17px; height:17px; stroke-width:1.7; color:#0b7a66; }
.f b { font-size:15px; font-weight:600; display:block; letter-spacing:-.005em; }
.f span { font-size:12.5px; color:var(--muted); line-height:1.35; display:block; margin-top:3px; }
/* comparison */
.cmp { position:absolute; left:44px; right:44px; top:642px; height:138px; display:grid; grid-template-columns:1fr 1.15fr; gap:0; border:1px solid var(--border); }
.cmp > div { padding:16px 24px; position:relative; }
.cmp .old { background:var(--surface); }
.cmp .new { background:#fff; border-left:1px solid var(--border); }
.cmp .hud { font-size:11.5px; }
.cmp .p { font-family:Archivo; font-weight:700; font-stretch:125%; letter-spacing:-.02em; font-size:34px; margin-top:10px; line-height:1; }
.cmp .old .p { color:#6a6a70; }
.cmp .old .p s { text-decoration-thickness:3px; text-decoration-color:#e5484d; }
.cmp .s { font-size:14.5px; color:var(--muted); margin-top:10px; line-height:1.4; }
.cmp .new .p { color:var(--accent); }
.cmp .tag { position:absolute; right:22px; top:16px; background:var(--accent); color:#fff; font-family:GeistMono; font-size:11px; letter-spacing:.14em; padding:5px 9px; }
.cmp .vs { position:absolute; padding:0; left:calc(46.5% - 22px); top:53px; width:44px; height:44px; border-radius:50%; background:#fff; border:1px solid var(--strong); display:flex; align-items:center; justify-content:center; font-family:GeistMono; font-size:13px; color:var(--muted); z-index:2; }
.note { position:absolute; left:44px; right:44px; top:788px; font-size:10.5px; color:var(--faint); line-height:1.4; }
"""

FEATS = [
    ("files", "PDFs zusammenfügen", "Beliebig viele Dateien, jede mit eigenem Lesezeichen"),
    ("layout-grid", "Seiten ordnen", "Drehen, löschen, verschieben, Seiten einfügen"),
    ("scissors", "PDFs teilen", "Ausgewählte Seiten als neue Datei speichern"),
    ("text-cursor-input", "Formulare ausfüllen", "Kontrollkästchen, Listen, Unterschriftsfelder"),
    ("lock", "Passwortschutz", "Verschlüsselung bis AES-256, Berechtigungen"),
    ("search", "Suchen beim Tippen", "Ganzes Dokument, nächster Treffer mit ⌘G"),
    ("message-square-text", "Kommentare &amp; Anhänge", "Unterhaltungen lesen, Anhänge öffnen"),
    ("command", "Befehlspalette ⌘K", "Jedes Werkzeug per Suche finden"),
    ("book-open", "Originalgetreu lesen", "Doppelseite, Lesemodus, hell oder dunkel"),
    ("shield-check", "Original bleibt erhalten", "Sicheres Speichern, Auto-Backup jede Minute"),
]
feat = "".join(f'<div class="f"><div class="ib">{ico(i)}</div><div><b>{t}</b><span>{d}</span></div></div>' for i, t, d in FEATS)

doc = f"""<div class="doc">
 <div class="lg"><b>TSV Grün-Weiß Köln e.V.</b><span style="color:#888;font-size:10px">Formular 03/2026</span></div>
 <h4>Aufnahmeantrag Mitgliedschaft</h4>
 <div class="two"><div class="fld"><span>Vorname</span><div>Lena</div></div><div class="fld"><span>Nachname</span><div>Hoffmann</div></div></div>
 <div class="two"><div class="fld"><span>Geburtsdatum</span><div>12.04.1994</div></div><div class="fld"><span>Telefon</span><div>0151 234 567 89</div></div></div>
 <div class="fld"><span>Straße, Hausnummer, PLZ, Ort</span><div class="act">Lindenstraße 12, 50674 Köln<span class="caret"></span></div></div>
 <span style="color:#666;font-size:10px">Mitgliedschaft</span>
 <div class="cb"><span><i>✓</i>Erwachsene</span><span><i></i>Familie</span><span><i></i>Jugend</span></div>
 <div class="fld"><span>Abteilung</span><div style="justify-content:space-between">Laufen &amp; Leichtathletik <span style="color:#666">▾</span></div></div>
 <span style="color:#666;font-size:10px">Unterschrift</span>
 <div class="sig">{ico('pen-line')}Hier unterschreiben</div>
</div>"""

pal = f"""<div class="pal"><div class="q">{ico('search')}dreh<span class="caret"></span><kbd>⌘K</kbd></div>
 <div class="it on">{ico('rotate-cw')}Seite nach rechts drehen<small>Seiten</small></div>
 <div class="it">{ico('rotate-ccw')}Seite nach links drehen<small>Seiten</small></div>
 <div class="it">{ico('layers')}Alle Seiten drehen<small>Dokument</small></div></div>"""

thumbs = "".join(f'<div class="th {"on" if i == 0 else ""}">' + "<i></i>" * 9 + f'</div><span>{i+1}</span>' for i in range(4))

body = f"""
<div class="head">{app_icon('pdf-koja', 84)}<div>
<h1 class="display">Die Alternative zu Adobe® <span class="hl">Acrobat®</span>.</h1>
<p>PdfKoja: PDFs lesen, ordnen, zusammenfügen, ausfüllen und schützen – offline und ohne Abo.</p></div></div>

<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="t">Aufnahmeantrag_TSV.pdf — PdfKoja</div></div>
 <div class="tool"><span class="t2 on">{ico('text-cursor-input')}Formular</span><span class="t2">{ico('layout-grid')}Seiten</span><span class="t2">{ico('files')}Zusammenfügen</span><span class="t2">{ico('lock')}Schützen</span><span class="t2" style="margin-left:auto">{ico('search')}</span></div>
 <div class="thumbs">{thumbs}</div>
 <div class="view">{doc}{pal}</div>
</div>

<div class="feat">{feat}</div>

<div class="cmp">
 <div class="old"><div class="hud">Adobe® Acrobat® Pro</div><div class="p">23,79 € im Monat</div>
  <div class="s">Jahres-Abo mit monatlicher Abrechnung,<br>also rund 285 € – jedes Jahr wieder.</div></div>
 <div class="vs">VS</div>
 <div class="new"><span class="tag">EINMALIG</span><div class="hud" style="color:var(--fg)">PdfKoja in Koja Office</div><div class="p">Einmal zahlen.</div>
  <div class="s">Dauerhafte Lizenz ohne Abo – und 12 weitere Apps<br>wie Word-, Excel- und Photoshop®-Alternativen inklusive.</div></div>
</div>
<div class="note">Acrobat-Preis laut Adobe-Website, Stand November 2026, inkl. MwSt., ohne Gewähr. PdfKoja ist eine frühe Version (Alpha): Office-Dateien in PDF umwandeln und Text in PDFs umschreiben kann es noch nicht.
Adobe®, Acrobat® und Photoshop® sind Marken von Adobe Inc., Word und Excel Marken der Microsoft Corporation. Kojalytics steht in keiner Verbindung zu diesen Unternehmen.</div>
"""

page("02-pdfkoja-produkt", body, css, label="PdfKoja · PDF-Programm", idx="Im Fokus", meta="Mac &amp; Windows",
     chips=[("check", "Offline, ohne Cloud"), ("check", "Ohne Konto"), ("check", "Mac &amp; Windows"), ("badge-euro", "Kein Acrobat-Abo nötig", "blue")])
