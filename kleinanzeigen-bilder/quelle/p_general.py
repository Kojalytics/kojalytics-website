from lib import *

APPS = [
    ("photo-koja", "PhotoKoja", "Bildbearbeitung", "Fotos und PSD-Dateien mit Ebenen, Masken und Einstellungsebenen.", "photo-koja_adjustments"),
    ("light-koja", "LightKoja", "RAW-Entwicklung", "Fotos verwalten und RAW-Dateien entwickeln, Originale bleiben unverändert.", "light-koja_grading"),
    ("vector-koja", "VectorKoja", "Vektorgrafik", "Logos, Icons und Illustrationen mit Zeichenstift und Pathfinder.", "vector-koja_bezier"),
    ("design-koja", "DesignKoja", "Layout", "Flyer, Broschüren und Magazine mit Musterseiten und PDF/X-Export.", "design-koja_hero"),
    ("fig-koja", "FigKoja", "Interface-Design", "App- und Web-Oberflächen mit Auto Layout, Komponenten, Prototypen.", "fig-koja_components"),
    ("film-koja", "FilmKoja", "Videoschnitt", "Mehrspur-Timeline, Farbkorrektur und Export als H.264 oder ProRes.", "film-koja_hero"),
    ("effect-koja", "EffectKoja", "Motion Graphics", "Titel und Animationen mit Keyframes, über 250 Effekte, 3D.", "effect-koja_3d"),
    ("sound-koja", "SoundKoja", "Audioproduktion", "Musik und Podcasts aufnehmen, schneiden und mischen.", "sound-koja_mix"),
    ("word-koja", "WordKoja", "Textverarbeitung", "Briefe und Hausarbeiten, öffnet und speichert .docx.", "word-koja_hero"),
    ("grid-koja", "GridKoja", "Tabellen", "Formeln, Pivot-Tabellen und Diagramme, öffnet .xlsx.", "grid-koja_budget"),
    ("deck-koja", "DeckKoja", "Präsentationen", "Folien mit Morph-Übergängen, öffnet und speichert .pptx.", "deck-koja_hero"),
    ("pdf-koja", "PdfKoja", "PDF", "PDFs ordnen, zusammenfügen und mit Passwort schützen.", "pdf-koja_organize"),
    ("cad-koja", "CADKoja", "2D-CAD", "Grundrisse und technische Zeichnungen, DWG und DXF.", "cad-koja_layout"),
]
A = {a[0]: a for a in APPS}

GEN_CSS = """
.hero { padding: 34px 0 26px; }
.hero h1 { font-size: 58px; }
.hero p { font-size: 20px; color: var(--muted); margin-top: 14px; line-height: 1.45; max-width: 980px; }
.cells { display:grid; gap:1px; background: var(--border); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.cells > * { background:#fff; }
"""

# ---------- 01 Übersicht ----------
ov_css = GEN_CSS + """
.cells { grid-template-columns: repeat(7, 1fr); }
.ap { height: 262px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; position:relative; }
.ap .n { font-weight:600; font-size:17px; }
.ap .k { font-family:GeistMono; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-top:-6px; }
.ap .i { position:absolute; top:12px; right:14px; font-family:GeistMono; font-size:11px; color:var(--faint); }
.plus { background: var(--surface) !important; padding: 0 20px; text-align:center; }
.plus b { font-family:Archivo; font-stretch:125%; font-size:34px; color:var(--accent); display:block; line-height:1; }
.plus span { font-size:14.5px; color:var(--fg); font-weight:500; line-height:1.35; margin-top:8px; display:block; }
"""
cells = "".join(f'<div class="ap"><span class="i">{i+1:02d}</span>{app_icon(s, 84)}<div class="n">{n}</div><div class="k">{k}</div></div>' for i, (s, n, k, _, _) in enumerate(APPS))
cells += '<div class="ap plus"><b>+</b><span>Alle Updates<br>inklusive</span></div>'
ov = f"""<div class="hero"><h1 class="display">13 Profi-Apps. <span class="hl">Eine</span> Lizenz.</h1>
<p>Bildbearbeitung, Videoschnitt, Office, PDF und CAD für Mac &amp; Windows – einmal kaufen und dauerhaft nutzen, statt jeden Monat mehrere Abos zu bezahlen.</p></div>
<div class="cells">{cells}</div>"""
page("01-uebersicht", ov, ov_css, label="Software-Lizenz · Dauerhaft", idx="Übersicht", meta="Mac &amp; Windows",
     chips=[("infinity", "Dauerhafte Lizenz, kein Abo", "blue"), ("monitor-smartphone", "Bis zu 3 Geräte", "blue"), ("mail-check", "Schlüssel per E-Mail + Post", "blue")])

# ---------- Kategorien ----------
cat_css = GEN_CSS + """
.hero { padding: 30px 0 22px; } .hero h1 { font-size: 46px; } .hero p { font-size: 18.5px; margin-top: 10px; }
.cell { padding: 22px 24px; position:relative; }
.cell .shot { height: 136px; border:1px solid var(--border); overflow:hidden; border-radius:6px; background:var(--surface); }
.cell .shot img { width:100%; height:100%; object-fit:cover; object-position: left top; display:block; }
.cell .nm { display:flex; gap:12px; align-items:center; margin-top:16px; }
.cell .nm b { font-size:19px; font-weight:600; display:block; }
.cell .nm small { font-family:GeistMono; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
.cell p { font-size:15px; color:var(--muted); line-height:1.45; margin-top:10px; }
.cell .i { position:absolute; top:10px; right:14px; font-family:GeistMono; font-size:11px; color:var(--faint); z-index:2; }
.sum { background: var(--surface) !important; display:flex; flex-direction:column; justify-content:center; padding: 30px; }
.sum .big { font-family:Archivo; font-stretch:125%; font-weight:700; font-size:30px; line-height:1.1; letter-spacing:-.02em; }
.sum p { font-size:15.5px; color:var(--muted); margin-top:12px; line-height:1.5; }
.sum ul { list-style:none; margin-top:14px; font-size:15px; }
.sum li { display:flex; gap:8px; align-items:center; margin:6px 0; } .sum li svg { width:18px; height:18px; color:var(--ok); stroke-width:2.4; }
"""
def cell(slug, i):
    s, n, k, d, shot = A[slug]
    return f'<div class="cell"><span class="i">{i:02d}</span><div class="shot"><img src="shots/{shot}.jpg"></div><div class="nm">{app_icon(s, 44)}<div><b>{n}</b><small>{k}</small></div></div><p>{d}</p></div>'

def summary(big, p, items):
    li = "".join(f'<li>{ico("check")}{t}</li>' for t in items)
    return f'<div class="sum"><div class="big">{big}</div><p>{p}</p><ul>{li}</ul></div>'

TM_AD = "Adobe ist eine Marke von Adobe Inc., Microsoft eine Marke der Microsoft Corporation. Kojalytics steht in keiner Verbindung zu diesen Unternehmen."

grid3 = '<div class="cells" style="grid-template-columns:repeat(3,1fr)">{}</div>'
fd = grid3.format("".join(cell(s, i+1) for i, s in enumerate(["photo-koja", "light-koja", "vector-koja", "design-koja", "fig-koja"])) +
                  summary('Das Kreativ-Paket, <span class="hl">ohne</span> Abo.', "Fünf Programme für Foto, Grafik, Layout und Interface-Design – bezahlt mit einer einzigen Lizenz.", ["Öffnet PSD, SVG, IDML, .ai", "Offline, ohne Konto"]))
page("09-foto-design", f'<div class="hero"><h1 class="display">Foto &amp; <span class="hl">Design</span></h1><p>Alles, wofür man sonst ein Creative-Cloud-Abo abschließt.</p></div>{fd}',
     cat_css, label="Foto &amp; Design · 5 Apps", idx="Kategorie 1/3", meta="Mac &amp; Windows", tm="Creative Cloud ist eine Marke von Adobe Inc. Kojalytics steht in keiner Verbindung zu Adobe.",
     chips=[("check", "Öffnet PSD, SVG, IDML"), ("check", "RAW von Canon, Nikon, Sony, Fuji"), ("badge-euro", "Kein Creative-Cloud-Abo nötig", "blue")])

va_css = cat_css + ".cell .shot { height: 372px; } .cell p { font-size:16px; }"
va = grid3.format("".join(cell(s, i+1) for i, s in enumerate(["film-koja", "effect-koja", "sound-koja"])))
page("10-video-audio", f'<div class="hero"><h1 class="display">Video &amp; <span class="hl">Audio</span></h1><p>Schneiden, animieren, mischen – vom YouTube-Video bis zum Podcast.</p></div>{va}',
     va_css, label="Video &amp; Audio · 3 Apps", idx="Kategorie 2/3", meta="Mac &amp; Windows",
     chips=[("check", "Export als H.264, ProRes, DNxHR"), ("check", "Über 250 Effekte"), ("check", "Plugins: CLAP, VST3, Audio Units")])

bt = grid3.format("".join(cell(s, i+1) for i, s in enumerate(["word-koja", "grid-koja", "deck-koja", "pdf-koja", "cad-koja"])) +
                  summary('Das Büro-Paket, <span class="hl">ohne</span> Abo.', "Texte, Tabellen, Präsentationen, PDFs und Zeichnungen – deine Office-Dateien öffnen und speichern wie gewohnt.", [".docx, .xlsx, .pptx", "PDF, DWG und DXF"]))
page("11-buero-technik", f'<div class="hero"><h1 class="display">Büro &amp; <span class="hl">Technik</span></h1><p>Statt jedes Jahr für Microsoft 365 und Acrobat zu zahlen: einmal kaufen, dauerhaft nutzen.</p></div>{bt}',
     cat_css, label="Büro &amp; Technik · 5 Apps", idx="Kategorie 3/3", meta="Mac &amp; Windows", tm=TM_AD,
     chips=[("check", ".docx, .xlsx, .pptx"), ("check", "PDF, DWG &amp; DXF"), ("badge-euro", "Kein Microsoft-365-Abo nötig", "blue")])

# ---------- Lieferung ----------
del_css = GEN_CSS + """
.hero { padding: 30px 0 22px; } .hero h1 { font-size: 46px; } .hero p { font-size: 18.5px; margin-top: 10px; }
.cells { grid-template-columns: 1fr 1.15fr 1.15fr; }
.st { height: 556px; padding: 22px 26px; position:relative; display:flex; flex-direction:column; }
.st h3 { display:flex; gap:12px; align-items:center; font-size:21px; font-weight:600; }
.st h3 .n { width:32px; height:32px; background:var(--fg); color:#fff; font-family:GeistMono; font-size:15px; display:flex; align-items:center; justify-content:center; }
.st h3 .n.b { background:var(--accent); }
.st .cap { font-size:15px; color:var(--muted); line-height:1.45; margin-top:auto; }
.vis { flex:1; display:flex; align-items:center; justify-content:center; }
.rc { width:230px; border:1px solid var(--strong); padding:16px; font-size:13.5px; }
.rc .ok { display:flex; gap:8px; align-items:center; color:var(--ok); font-weight:600; margin-bottom:12px; }
.rc .ok svg { width:20px; height:20px; stroke-width:2.4; }
.rc .r { display:flex; justify-content:space-between; padding:6px 0; border-top:1px solid var(--border); color:#333; }
.phone { width:226px; height:300px; border:9px solid #1b1b1e; border-bottom:0; border-radius:34px 34px 0 0; padding:14px 13px 0; overflow:hidden; background:#fff; position:relative; }
.phone .nt { position:absolute; left:50%; top:8px; transform:translateX(-50%); width:70px; height:18px; border-radius:10px; background:#1b1b1e; }
.phone .sb { display:flex; justify-content:space-between; font-size:11px; font-weight:600; margin:0 6px 14px; }
.ml .fr { display:flex; gap:8px; align-items:center; font-size:12px; margin-bottom:10px; }
.ml .av { width:28px; height:28px; border-radius:50%; background:var(--fg); color:#fff; font-family:Archivo; font-stretch:125%; font-weight:700; font-size:13px; display:flex; align-items:center; justify-content:center; }
.ml h4 { font-size:15px; line-height:1.25; margin-bottom:8px; }
.ml p { font-size:11.5px; color:#444; line-height:1.45; margin-bottom:8px; }
.key { font-family:GeistMono; font-size:12px; background:#eef3fd; color:var(--accent); border:1px solid #c9d9f7; padding:7px 8px; text-align:center; letter-spacing:.04em; }
.env { position:relative; width:270px; height:230px; }
.env .back { position:absolute; left:0; right:0; bottom:0; height:150px; background:#ecebe7; border:1px solid #d3d1cb; }
.env .card { position:absolute; left:22px; right:22px; top:6px; height:150px; background:#fff; border:1px solid var(--strong); box-shadow:0 6px 16px rgba(0,0,0,.08); padding:14px 16px; }
.env .card .wm { font-family:Archivo; font-stretch:125%; font-weight:700; font-size:14px; }
.env .card .hud { font-size:9.5px; margin:10px 0 6px; }
.env .front { position:absolute; left:0; right:0; bottom:0; height:110px; background:#f4f3ef; border:1px solid #d3d1cb; clip-path: polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%); }
.env .stamp { position:absolute; right:12px; bottom:12px; width:38px; height:44px; border:2px dashed #b9b6ae; display:flex; align-items:center; justify-content:center; }
.env .stamp svg { width:20px; height:20px; color:#9a978f; }
.next { display:flex; align-items:center; gap:0; height:90px; }
.next .lbl { font-family:GeistMono; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); width:190px; }
.next .s { display:flex; gap:10px; align-items:center; font-size:16.5px; font-weight:500; padding: 0 22px; border-left:1px solid var(--border); height:90px; }
.next .s i { font-style:normal; font-family:GeistMono; color:var(--accent); font-size:14px; }
"""
st1 = f"""<div class="st"><h3><span class="n">1</span>Kaufen</h3><div class="vis"><div class="rc"><div class="ok">{ico('circle-check')}Kauf bestätigt</div>
<div class="r"><span>Kojalytics-Lizenz</span><b>Dauerhaft</b></div><div class="r"><span>Apps</span><span>alle 13</span></div><div class="r"><span>Geräte</span><span>bis zu 3</span></div></div></div>
<div class="cap">Du kaufst die Lizenz ganz normal über die Anzeige.</div></div>"""
st2 = f"""<div class="st"><h3><span class="n b">2</span>Sofort per E-Mail</h3><div class="vis" style="align-items:flex-end"><div class="phone"><div class="nt"></div><div class="sb"><span>9:41</span><span>100 %</span></div>
<div class="ml"><div class="fr"><span class="av">K</span><div><b>Kojalytics</b><br><span style="color:#888">an dich · gerade eben</span></div></div><h4>Dein Kojalytics-Lizenzschlüssel</h4>
<p>Danke für deinen Kauf! Hier ist dein Schlüssel für alle 13 Koja-Apps:</p><div class="key">KOJA-7F3Q-M2XD-9KLA</div><p style="margin-top:8px">So installierst du die Apps: …</p></div></div></div>
<div class="cap" style="margin-top:16px"><b style="color:var(--fg)">Automatisch direkt nach dem Kauf</b> – mit Download-Link und Anleitung.</div></div>"""
st3 = f"""<div class="st"><h3><span class="n b">3</span>Zusätzlich per Post</h3><div class="vis"><div class="env"><div class="back"></div><div class="card"><div class="wm">Kojalytics</div><div class="hud">Lizenzkarte · Dauerhaft</div><div class="key" style="font-size:11.5px">KOJA-7F3Q-M2XD-9KLA</div><div style="font-size:10.5px;color:#777;margin-top:8px">13 Apps · Mac &amp; Windows · 3 Geräte</div></div><div class="front"></div><div class="stamp">{ico('mail')}</div></div></div>
<div class="cap"><b style="color:var(--fg)">Lizenzkarte im Umschlag</b> – für deine Unterlagen, falls die E-Mail mal verloren geht.</div></div>"""
nxt = f"""<div class="next"><span class="lbl">Danach</span><div class="s"><i>01</i>Launcher laden</div><div class="s"><i>02</i>Schlüssel eingeben</div><div class="s"><i>03</i>Apps installieren – fertig</div></div>"""
dl = f"""<div class="hero"><h1 class="display">Per <span class="hl">E-Mail</span> und per Post.</h1>
<p>Kein Warten auf den Briefträger – du kannst sofort nach dem Kauf loslegen.</p></div>
<div class="cells">{st1}{st2}{st3}</div>{nxt}"""
page("03-lizenz-lieferung", dl, del_css, label="So erhältst du deine Lizenz", idx="Lieferung", meta="Schlüssel · E-Mail + Post")

# ---------- Vorteile ----------
adv_css = GEN_CSS + """
.cells { grid-template-columns: repeat(3, 1fr); }
.ad { height: 342px; padding: 28px 30px; position:relative; }
.ad .ib { width:52px; height:52px; border:1px solid var(--strong); display:flex; align-items:center; justify-content:center; }
.ad .ib svg { width:24px; height:24px; color:var(--fg); stroke-width:1.6; }
.ad .i { position:absolute; top:28px; right:30px; font-family:GeistMono; font-size:12px; color:var(--faint); }
.ad h3 { font-size:24px; font-weight:600; margin-top:26px; letter-spacing:-.01em; }
.ad p { font-size:16px; color:var(--muted); margin-top:9px; line-height:1.45; }
.ad.hi { background: var(--surface) !important; }
.ad.hi h3 { color: var(--accent); }
"""
ads = [("monitor-smartphone", "Mac &amp; Windows", "Für macOS (Apple-Chip und Intel) sowie Windows 10 und 11."),
       ("laptop", "Bis zu 3 Geräte", "Mac und Windows-PC gemischt – z. B. Laptop, Desktop und Büro-PC."),
       ("infinity", "Dauerhafte Lizenz", "Einmal bezahlen, ohne Ablaufdatum. Kein Abo, keine Kündigung nötig.", "hi"),
       ("refresh-cw", "Alle Updates inklusive", "Der Kojalytics Launcher hält alle Apps automatisch aktuell."),
       ("wifi-off", "Offline &amp; ohne Konto", "Deine Dateien bleiben auf deinem Rechner, kein Cloud-Zwang."),
       ("headset", "Support aus Deutschland", "Fragen? Einfach auf die E-Mail mit deinem Schlüssel antworten.")]
adc = "".join(f'<div class="ad {a[3] if len(a)>3 else ""}"><span class="i">{i+1:02d}</span><div class="ib">{ico(a[0])}</div><h3>{a[1]}</h3><p>{a[2]}</p></div>' for i, a in enumerate(ads))
adv = f"""<div class="hero" style="padding-bottom:30px"><h1 class="display">Deine Vorteile auf einen <span class="hl">Blick</span>.</h1></div><div class="cells">{adc}</div>"""
page("02-vorteile", adv, adv_css, label="Was in der Lizenz steckt", idx="Vorteile", meta="13 Apps · 1 Lizenz")
