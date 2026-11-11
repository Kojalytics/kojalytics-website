from lib import *

css = """
.head { display:flex; gap:22px; align-items:center; padding:30px 0 0; }
.head h1 { font-size: 46px; }
.head p { font-size: 19px; color: var(--muted); margin-top: 10px; line-height:1.4; }
.win { left: 44px; right: 44px; top: 214px; height: 600px; border-radius: 10px; }
.tabs { display:flex; gap:22px; padding: 0 16px; height: 32px; align-items:center; font-size: 13px; color:#333; background:#fff; }
.tabs .on { color:#1f4fbf; font-weight:600; border-bottom:2px solid #1f4fbf; padding: 7px 0 5px; }
.rib { height: 78px; display:flex; align-items:stretch; border-bottom:1px solid #e3e3e3; background:#fafafa; font-size:11.5px; color:#444; }
.grp { display:flex; flex-direction:column; justify-content:space-between; padding:8px 14px 5px; border-right:1px solid #e6e6e6; }
.grp .cap { text-align:center; color:#888; font-size:10.5px; }
.row { display:flex; gap:6px; align-items:center; }
.dd { border:1px solid #cfcfcf; background:#fff; height:22px; padding:0 8px; display:flex; align-items:center; border-radius:3px; font-size:12px; }
.b { width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-family: Carlito; font-size:14px; color:#222; border-radius:3px; }
.b svg { width:15px; height:15px; stroke-width:1.8; }
.big { display:flex; flex-direction:column; align-items:center; gap:4px; font-size:11.5px; }
.big svg { width:26px; height:26px; color:#2c5bd0; stroke-width:1.5; }
.sty { display:flex; gap:5px; }
.sty div { width:86px; height:44px; border:1px solid #ddd; background:#fff; display:flex; flex-direction:column; justify-content:center; padding:0 7px; font-family: Carlito; }
.sty div small { font-family: Geist; font-size:9.5px; color:#777; margin-top:2px; }
.sty .on { border-color:#2c5bd0; box-shadow: inset 0 0 0 1px #2c5bd0; }
.canvas { position:absolute; top:146px; left:0; right:250px; bottom:24px; background:#ebebee; overflow:hidden; }
.paper { position:absolute; left:50%; transform:translateX(-50%); top:18px; width:560px; height:800px; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.15); padding:46px 60px; font-family: Carlito; font-size:13px; color:#1a1a1a; line-height:1.42; }
.paper .sender { font-size:11px; color:#555; border-bottom:1px solid #999; padding-bottom:2px; display:inline-block; margin-bottom:10px; }
.paper .two { display:flex; justify-content:space-between; }
.paper .betreff { font-weight:700; margin: 18px 0 12px; font-size:13.5px; }
.paper p { margin-bottom: 9px; }
.paper .name { font-size: 20px; font-weight:700; letter-spacing:.01em; color:#1f3e8a; }
.paper .contact { font-size:11px; color:#555; margin-bottom: 14px; }
.sp { text-decoration: underline wavy #d33; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.ins { color:#1d7a43; text-decoration: underline; text-decoration-color:#1d9d54; }
.sel { background:#cfe0ff; }
.side { position:absolute; top:146px; right:0; width:250px; bottom:24px; background:#fff; border-left:1px solid #e3e3e3; padding:14px; font-size:12.5px; }
.side h4 { font-size:13px; font-weight:600; margin-bottom:12px; display:flex; justify-content:space-between; }
.cm { border:1px solid #e1e1e1; border-left:3px solid #2c5bd0; padding:10px 11px; margin-bottom:10px; border-radius:4px; background:#fff; }
.cm .who { display:flex; gap:8px; align-items:center; font-weight:600; margin-bottom:5px; }
.av { width:22px; height:22px; border-radius:50%; background:#2c5bd0; color:#fff; font-size:10px; display:flex; align-items:center; justify-content:center; }
.cm .t { color:#333; line-height:1.4; }
.cm .when { color:#999; font-size:11px; margin-top:6px; }
.sug { border:1px solid #e1e1e1; padding:10px 11px; border-radius:4px; }
.sug .k { color:#888; font-size:11px; margin-bottom:6px; }
.sug .opt { padding:4px 6px; border-radius:3px; } .sug .opt.on { background:#e9f0ff; font-weight:600; }
.status { position:absolute; left:0; right:0; bottom:0; height:24px; background:#f4f4f3; border-top:1px solid #e3e3e3; font-size:11.5px; color:#555; display:flex; align-items:center; gap:22px; padding:0 14px; }
"""

body = f"""
<div class="head">{app_icon('word-koja', 84)}<div>
<h1 class="display">Die Bewerbung, die <span class="hl">sitzt</span>.</h1>
<p>Briefe, Bewerbungen und Hausarbeiten schreiben – mit .docx-Dateien wie gewohnt.<br>Einmal kaufen statt jedes Jahr ein Office-Abo zahlen.</p></div></div>

<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="t">Bewerbung_Hoffmann.docx — WordKoja</div></div>
 <div class="tabs"><span>Datei</span><span class="on">Start</span><span>Einfügen</span><span>Entwurf</span><span>Layout</span><span>Referenzen</span><span>Sendungen</span><span>Überprüfen</span><span>Ansicht</span></div>
 <div class="rib">
  <div class="grp"><div class="big">{ico('clipboard-paste')}Einfügen</div><div class="cap">Zwischenablage</div></div>
  <div class="grp"><div class="row"><div class="dd" style="width:120px">Aptos</div><div class="dd" style="width:44px">11</div></div>
   <div class="row"><div class="b"><b>F</b></div><div class="b"><i>K</i></div><div class="b"><u>U</u></div><div class="b">{ico('highlighter')}</div><div class="b">{ico('baseline')}</div></div><div class="cap">Schriftart</div></div>
  <div class="grp"><div class="row"><div class="b">{ico('list')}</div><div class="b">{ico('list-ordered')}</div><div class="b">{ico('indent-increase')}</div></div>
   <div class="row"><div class="b" style="background:#e3ebff">{ico('align-left')}</div><div class="b">{ico('align-center')}</div><div class="b">{ico('align-right')}</div><div class="b">{ico('align-justify')}</div></div><div class="cap">Absatz</div></div>
  <div class="grp"><div class="sty"><div class="on">Standard<small>Standard</small></div><div style="font-size:15px;color:#1f3e8a">Titel<small>Titel</small></div><div style="color:#1f3e8a;font-weight:700">Betreff<small>Überschrift 1</small></div><div>Zitat<small>Zitat</small></div></div><div class="cap">Formatvorlagen</div></div>
  <div class="grp"><div class="row">{ico('search')}<span>Suchen</span></div><div class="row">{ico('replace')}<span>Ersetzen</span></div><div class="cap">Bearbeiten</div></div>
 </div>
 <div class="canvas"><div class="paper">
  <div class="name">Lena Hoffmann</div>
  <div class="contact">Lindenstraße 12 · 50674 Köln · 0151 234 567 89 · lena.hoffmann@mail.de</div>
  <div class="two"><div>Rheinwerk Logistik GmbH<br>Frau Sabine Becker<br>Personalabteilung<br>Hafenstraße 40<br>50668 Köln</div><div style="align-self:flex-end">Köln, 11. November 2026</div></div>
  <div class="betreff">Bewerbung als Projektkoordinatorin (m/w/d) – Ihre Anzeige vom 3. November</div>
  <p>Sehr geehrte Frau Becker,</p>
  <p>mit großem Interesse habe ich Ihre Stellenanzeige gelesen. Seit vier Jahren koordiniere ich bei einem Kölner Versanddienstleister Projekte mit bis zu zwölf Beteiligten – <span class="sel">von der ersten Planung bis zur termingerechten Übergabe</span>.</p>
    <p>Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr. <span class="ins">Ab dem 1. Februar 2027 stehe ich Ihnen zur Verfügung.</span></p>
 </div></div>
 <div class="side"><h4><span>Kommentare</span><span style="color:#999">2</span></h4>
  <div class="cm"><div class="who"><span class="av">MK</span>Markus K.</div><div class="t">Starker Einstieg! Vielleicht noch das Eintrittsdatum nennen?</div><div class="when">Heute, 09:41</div></div>
  <div class="cm" style="border-left-color:#1d9d54"><div class="who"><span class="av" style="background:#1d9d54">LH</span>Lena H.</div><div class="t">Gute Idee, ergänze ich im letzten Absatz.</div><div class="when">Heute, 09:47</div></div>
  <div class="sug"><div class="k">Änderungen nachverfolgen · 1</div><div style="margin-bottom:8px"><b>Eingefügt:</b> „Ab dem 1. Februar 2027 …“</div><div class="row"><span class="opt on">✓ Annehmen</span><span class="opt">Ablehnen</span></div></div>
 </div>
 <div class="status"><span>Seite 1 von 1</span><span>214 Wörter</span><span>Deutsch (Deutschland)</span><span style="margin-left:auto">100 %</span></div>
</div>
"""

page("04-wordkoja", body, css, label="WordKoja · Textverarbeitung", idx="App 1/5", meta="Mac &amp; Windows",
     chips=[("check", "Öffnet &amp; speichert .docx"), ("check", "Kommentare &amp; Änderungen"), ("check", "Offline, ohne Konto"), ("badge-euro", "Kein Office-Abo nötig", "blue")], tm="Microsoft und Office sind Marken der Microsoft Corporation. Kojalytics steht in keiner Verbindung zu Microsoft.")
