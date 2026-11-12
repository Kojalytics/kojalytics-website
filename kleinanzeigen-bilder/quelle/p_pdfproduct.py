from lib import *

# the 19 tools exactly as in the PdfKoja sidebar, with the app's icon colours
TOOLS = [
    ("file-output", "PDF exportieren", "#2a66d8"), ("pen-line", "Ausfüllen und unterschreiben", "#8a5cf6"),
    ("file-pen", "PDF bearbeiten", "#e03690"), ("file-plus", "PDF erstellen", "#e5484d"),
    ("files", "Dateien zusammenführen", "#2a66d8"), ("layout-grid", "Seiten organisieren", "#1d9d54"),
    ("message-square-text", "Kommentare hinzufügen", "#ef8a1b"), ("scan-text", "Scan und OCR", "#1d9d54"),
    ("shield-check", "PDF schützen", "#2a66d8"), ("rectangle-horizontal", "PDF schwärzen", "#e5484d"),
    ("file-down", "PDF komprimieren", "#e03690"), ("text-cursor-input", "Formular vorbereiten", "#8a5cf6"),
    ("stamp", "Stempel hinzufügen", "#8a5cf6"), ("badge-check", "Zertifikat verwenden", "#11a58a"),
    ("printer", "Druckproduktion verwenden", "#8a5cf6"), ("ruler", "Objekte messen", "#e03690"),
    ("git-compare", "Dateien vergleichen", "#e03690"), ("list-checks", "Geführte Aktionen verwenden", "#8a5cf6"),
    ("person-standing", "Für Barrierefreiheit vorbereiten", "#a78bfa"),
]
GROUPS = [
    ("file-pen", "#e03690", "Bearbeiten &amp; organisieren", "Text und Bilder bearbeiten, Seiten organisieren, Dateien zusammenführen, kommentieren"),
    ("pen-line", "#8a5cf6", "Ausfüllen &amp; unterschreiben", "Formulare ausfüllen und vorbereiten, E-Signatur, Stempel"),
    ("scan-text", "#1d9d54", "Erstellen &amp; konvertieren", "PDF erstellen, PDF exportieren, Scan und OCR, komprimieren"),
    ("shield-check", "#2a66d8", "Schützen &amp; schwärzen", "Passwortschutz bis AES-256, Schwärzen, Zertifikate"),
    ("git-compare", "#ef8a1b", "Für Profis", "Dateien vergleichen, Objekte messen, Druckproduktion, Barrierefreiheit"),
]

css = """
.head { display:flex; gap:20px; align-items:center; padding:22px 0 0; }
.head h1 { font-size: 37px; white-space:nowrap; }
.head p { font-size: 17.5px; color: var(--muted); margin-top: 8px; line-height:1.4; }
.win { left:44px; top:178px; width:712px; height:564px; background:#f1f1f3; border-radius:10px; overflow:visible; }
.tb2 { height:30px; display:flex; align-items:center; gap:10px; padding:0 10px; background:#e9e9ec; border-bottom:1px solid #dcdce0; font-size:12px; color:#222; border-radius:10px 10px 0 0; }
.tb2 .home { width:22px; height:20px; border:1px solid #9ab8ef; background:#e6efff; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#2a66d8; }
.tb2 .home svg, .tb2 .op svg, .tb2 .ri svg { width:12px; height:12px; }
.tb2 .op { display:flex; gap:4px; align-items:center; font-weight:500; }
.tb2 .ri { margin-left:auto; display:flex; gap:10px; color:#666; }
.tbar { height:40px; display:flex; align-items:center; gap:13px; white-space:nowrap; padding:0 12px; background:#fff; border-bottom:1px solid #e3e3e6; font-size:12.5px; color:#555; }
.tbar svg { width:14px; height:14px; }
.tbar .mn { display:flex; gap:6px; align-items:center; color:#222; padding-right:14px; border-right:1px solid #e3e3e6; }
.tbar .on { color:#111; font-weight:600; }
.tbar .se { margin-left:auto; width:168px; height:26px; border:1px solid #d6d6da; border-radius:13px; display:flex; align-items:center; gap:6px; padding:0 10px; color:#888; font-size:11.5px; }
.tbar .se kbd { margin-left:auto; font-family:GeistMono; font-size:10px; }
.sb { position:absolute; left:0; top:70px; bottom:0; width:248px; background:#fff; border-right:1px solid #e3e3e6; padding:8px 12px 0; border-radius:0 0 0 10px; }
.sb .hd { display:flex; justify-content:space-between; align-items:center; font-weight:600; font-size:13.5px; padding:4px 6px 8px; border-bottom:1px solid #ececef; margin-bottom:4px; }
.tl { display:flex; align-items:center; gap:10px; height:23.8px; font-size:12.4px; color:#1f1f23; padding:0 6px; border-radius:5px; }
.tl svg { width:15px; height:15px; stroke-width:1.7; flex:none; }
.tl.on { background:#eef3fd; }
.mainv { position:absolute; left:248px; right:0; top:70px; bottom:0; padding:18px 20px; }
.mainv h2 { font-size:21px; font-weight:600; letter-spacing:-.01em; }
.mainv .sub { font-size:12px; color:#666; margin-top:3px; }
.box { background:#fff; border:1px solid #e3e3e6; border-radius:9px; padding:12px 13px; margin-top:12px; }
.box h5 { font-size:13px; font-weight:600; margin-bottom:9px; }
.cards { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.cd { border:1px solid #e3e3e6; border-radius:7px; padding:8px 9px; }
.cd b { display:flex; gap:6px; align-items:center; font-size:12px; font-weight:600; }
.cd b svg { width:14px; height:14px; }
.cd span { display:block; font-size:10.5px; color:#777; margin-top:4px; line-height:1.3; }
.cd i { display:block; font-style:normal; font-size:10.5px; color:#2a66d8; font-weight:600; margin-top:5px; }
.priv { margin-top:12px; font-size:10.5px; color:#555; line-height:1.4; }
.priv b { font-family:GeistMono; font-size:9.5px; letter-spacing:.12em; color:#888; display:block; margin-bottom:3px; font-weight:500; }
.cnt { position:absolute; right:-10px; top:-12px; background:var(--accent); color:#fff; font-family:GeistMono; font-size:11px; letter-spacing:.12em; padding:5px 9px; z-index:3; }
/* groups */
.grp { position:absolute; left:776px; right:44px; top:178px; border:1px solid var(--border); }
.grp .gh { padding:12px 16px; border-bottom:1px solid var(--border); background:var(--surface); }
.grp .gh .hud { font-size:11px; }
.grp .gh b { display:block; font-size:16.5px; margin-top:4px; letter-spacing:-.01em; }
.g { display:flex; gap:12px; padding:12px 16px; border-bottom:1px solid var(--border); height:96px; }
.g:last-child { border-bottom:0; }
.g .ib { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex:none; }
.g .ib svg { width:19px; height:19px; stroke-width:1.8; }
.g b { font-size:15.5px; font-weight:600; display:block; }
.g span { font-size:12.5px; color:var(--muted); line-height:1.4; display:block; margin-top:3px; }
/* comparison */
.cmp { position:absolute; left:44px; right:44px; top:756px; height:100px; display:grid; grid-template-columns:1fr 1.15fr; border:1px solid var(--border); }
.cmp > div { padding:14px 22px; position:relative; }
.cmp .old { background:var(--surface); }
.cmp .new { border-left:1px solid var(--border); }
.cmp .hud { font-size:11px; }
.cmp .p { font-family:Archivo; font-weight:700; font-stretch:125%; letter-spacing:-.02em; font-size:27px; margin-top:7px; line-height:1; }
.cmp .old .p { color:#6a6a70; }
.cmp .new .p { color:var(--accent); }
.cmp .s { font-size:13px; color:var(--muted); margin-top:7px; }
.cmp .tag { position:absolute; right:18px; top:13px; background:var(--accent); color:#fff; font-family:GeistMono; font-size:10.5px; letter-spacing:.14em; padding:4px 8px; }
.cmp .vs { position:absolute; left:calc(46.5% - 19px); top:30px; width:38px; height:38px; border-radius:50%; background:#fff; border:1px solid var(--strong); display:flex; align-items:center; justify-content:center; font-family:GeistMono; font-size:12px; color:var(--muted); z-index:2; padding:0; }
.note { position:absolute; left:44px; right:44px; top:862px; font-size:10px; color:var(--faint); line-height:1.4; }
"""

tools = "".join(f'<div class="tl {"on" if i == 2 else ""}" style="{"color:#9a9aa0" if i == 18 else ""}"><span style="color:{c};display:flex">{ico(ic)}</span>{n}</div>' for i, (ic, n, c) in enumerate(TOOLS))
cards = [("layout-grid", "#1d9d54", "Seiten organisieren", "Seitenraster · Drehen · Löschen"),
         ("message-square-text", "#ef8a1b", "Kommentare hinzufügen", "Notiz · Hervorheben · Unterstreichen"),
         ("file-pen", "#e03690", "PDF bearbeiten", "Text und Bilder bearbeiten"),
         ("shield-check", "#2a66d8", "PDF schützen", "Mit Passwort schützen")]
cards_html = "".join(f'<div class="cd"><b><span style="color:{c};display:flex">{ico(i)}</span>{t}</b><span>{d}</span><i>Jetzt verwenden</i></div>' for i, c, t, d in cards)
groups = "".join(f'<div class="g"><div class="ib" style="background:{c}1a;color:{c}">{ico(i)}</div><div><b>{t}</b><span>{d}</span></div></div>' for i, c, t, d in GROUPS)

body = f"""
<div class="head">{app_icon('pdf-koja', 78)}<div>
<h1 class="display">Alle PDF-Werkzeuge. <span class="hl">Ohne</span> Acrobat®-Abo.</h1>
<p>Bearbeiten, ausfüllen, unterschreiben, OCR, schützen, komprimieren – offline und einmal bezahlt.</p></div></div>

<div class="win">
 <div class="cnt">19 WERKZEUGE</div>
 <div class="tb2"><div class="dots"><i></i><i></i><i></i></div><span class="home">{ico('house')}</span><span class="op">{ico('plus')}Öffnen</span></div>
 <div class="tbar"><span class="mn">{ico('panel-left')}Menü</span><span class="on">Alle Werkzeuge</span><span>Lesen</span><span>Bearbeiten</span><span>Konvertieren</span><span>E-Signatur</span><span class="se">{ico('search')}Werkzeuge suchen …<kbd>⌘K</kbd></span></div>
 <div class="sb"><div class="hd"><span>Alle Werkzeuge</span><span style="color:#999;font-weight:400">✕</span></div>{tools}</div>
 <div class="mainv">
  <h2>Willkommen bei PdfKoja</h2><div class="sub">Lokal, privat und offline – deine PDFs bleiben auf deinem Rechner.</div>
  <div class="box"><h5>Empfohlene Werkzeuge</h5><div class="cards">{cards_html}</div></div>
  <div class="box" style="display:flex;align-items:center;gap:10px"><span style="width:30px;height:30px;color:#555;display:flex">{ico('folder-open')}</span><div><b style="font-size:12.5px">Datei öffnen</b><div style="font-size:10.5px;color:#777">Oder ein PDF einfach ins Fenster ziehen</div></div></div>
  <div class="priv"><b>DATENSCHUTZ</b>PdfKoja funktioniert offline. Keine Telemetrie, kein Konto und keine Cloud-Verarbeitung.</div>
 </div>
</div>

<div class="grp"><div class="gh"><div class="hud">Statt Acrobat®</div><b>Wofür du PdfKoja nutzt</b></div>{groups}</div>

<div class="cmp">
 <div class="old"><div class="hud">Adobe® Acrobat® Pro</div><div class="p">23,79 € im Monat</div><div class="s">Jahres-Abo, monatlich abgerechnet: rund 285 € – jedes Jahr wieder.</div></div>
 <div class="vs">VS</div>
 <div class="new"><span class="tag">EINMALIG</span><div class="hud" style="color:var(--fg)">PdfKoja in Koja Office</div><div class="p">Einmal zahlen.</div><div class="s">Dauerhafte Lizenz ohne Abo – plus 12 weitere Apps inklusive.</div></div>
</div>
<div class="note">Acrobat-Preis laut Adobe-Website, Stand November 2026, inkl. MwSt., ohne Gewähr. PdfKoja ist eine frühe Version (Alpha); einzelne Werkzeuge sind noch in Entwicklung.
Adobe® und Acrobat® sind Marken von Adobe Inc. Kojalytics steht in keiner Verbindung zu Adobe.</div>
"""

page("02-pdfkoja-produkt", body, css, label="PdfKoja · PDF-Programm", idx="Im Fokus", meta="Mac &amp; Windows")
