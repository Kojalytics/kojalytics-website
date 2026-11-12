from p_more import photo_css, head, TM_AD
from lib import *

css = photo_css + """
.poster { position:relative; width:690px; height:458px; overflow:hidden; }
.poster svg.bg { position:absolute; inset:0; }
.ptxt { position:absolute; left:0; right:0; top:62px; text-align:center; color:#fff; }
.ptxt .k { font-family:GeistMono; font-size:15px; letter-spacing:.32em; opacity:.95; }
.ptxt .h { font-family:Archivo; font-weight:800; font-stretch:118%; font-size:68px; display:inline-block; position:relative; letter-spacing:-.02em; line-height:1; margin-top:12px;
  text-shadow: 0 10px 18px rgba(80,20,40,.38); }
.ptxt .d { display:inline-block; margin-top:18px; font-size:19px; font-weight:600; background:#fff; color:#b33a3a; padding:7px 16px; border-radius:30px; }
.selbox { position:absolute; left:-12px; right:-12px; top:-8px; bottom:-6px; border:1px dashed #fff; outline:1px dashed rgba(0,0,0,.5); outline-offset:-2px; }
.selbox i { position:absolute; width:9px; height:9px; background:#fff; border:1px solid #333; }
.fx { margin-left:auto; font-style:italic; font-family:Georgia, serif; color:#aaa; font-size:13px; }
.sl { display:flex; align-items:center; gap:10px; margin:9px 0; }
.sl span:first-child { width:78px; color:#bbb; }
.sl .tr { flex:1; height:4px; background:#4a4b52; border-radius:2px; position:relative; }
.sl .tr b { position:absolute; left:0; top:0; bottom:0; background:#4a7ce0; border-radius:2px; }
.sl .tr i { position:absolute; top:-5px; width:14px; height:14px; border-radius:50%; background:#fff; margin-left:-7px; }
.sl .v { width:52px; text-align:right; background:#26272b; border:1px solid #45464d; border-radius:4px; padding:2px 6px; font-size:11.5px; }
"""

hills = """<svg class="bg" viewBox="0 0 690 458" width="690" height="458">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a59"/><stop offset=".55" stop-color="#ffb36b"/><stop offset="1" stop-color="#ffd89a"/></linearGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d6"/><stop offset="1" stop-color="#ffe08a"/></radialGradient></defs>
<rect width="690" height="458" fill="url(#sky)"/>
<circle cx="345" cy="330" r="96" fill="url(#sun)" opacity=".95"/>
<path d="M0 330 C 90 290 170 300 250 330 S 420 290 520 315 S 640 300 690 310 L690 458 L0 458Z" fill="#e8705a"/>
<path d="M0 370 C 110 340 210 352 320 372 S 520 340 690 360 L690 458 L0 458Z" fill="#c9485b"/>
<path d="M0 410 C 130 390 260 400 380 414 S 590 392 690 404 L690 458 L0 458Z" fill="#8f2f57"/>
<g fill="#5c1f45">""" + "".join(f'<path d="M{x} 412 l14 -44 l14 44 z"/><rect x="{x+12}" y="410" width="4" height="10"/>' for x in (40, 70, 590, 620, 650)) + """</g>
<g fill="#fff" opacity=".9">""" + "".join(f'<circle cx="{x}" cy="{y}" r="2.2"/>' for x, y in ((120, 40), (560, 52), (610, 30), (80, 90), (640, 110))) + """</g>
<path d="M60 28 Q 345 -20 630 28" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7"/>
<g>""" + "".join(f'<path d="M{60+i*38} {28 - 18*__import__("math").sin(3.1416*i/15)*1.6:.0f} l8 16 l8 -16 z" fill="{["#fff","#2a66d8","#ffd34d","#1d9d54"][i%4]}"/>' for i in range(15)) + """</g>
</svg>"""

poster = f"""<div class="poster">{hills}
<div class="ptxt"><div class="k">STADTPARK · EINTRITT FREI</div><div><div class="h">SOMMERFEST<div class="selbox"><i style="left:-5px;top:-5px"></i><i style="right:-5px;top:-5px"></i><i style="left:-5px;bottom:-5px"></i><i style="right:-5px;bottom:-5px"></i></div></div></div><div class="d">Samstag, 18. Juli · ab 14 Uhr</div></div>
</div>"""

tools = ["mouse-pointer-2", "square-dashed", "lasso", "wand-sparkles", "crop", "pipette", "brush", "stamp", "eraser", "type", "pen-tool", "hand", "zoom-in"]
tools_html = "".join(f'<div class="{"on" if t == "type" else ""}">{ico(t)}</div>' for t in tools)

def slider(label, pct, val):
    return f'<div class="sl"><span>{label}</span><span class="tr"><b style="width:{pct}%"></b><i style="left:{pct}%"></i></span><span class="v">{val}</span></div>'

body = head("photo-koja", 'Plakate, die <span class="hl">auffallen</span>.',
            "Bilder, Flyer und Social-Media-Posts gestalten – mit Ebenen, Masken und Ebenenstilen.<br>Öffnet und speichert PSD. Ohne monatliches Adobe-Abo.") + f"""
<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="menu"><b>PhotoKoja</b><span>Datei</span><span>Bearbeiten</span><span>Bild</span><span>Ebene</span><span>Schrift</span><span>Auswahl</span><span>Filter</span><span>Ansicht</span><span>Fenster</span></div></div>
 <div class="opt"><span class="dd2">Archivo · Extra Bold</span><span class="dd2">68 pt</span><span class="c"><span class="bx" style="background:#fff"></span>Textfarbe</span><span style="margin-left:auto">Arbeitsbereich: Grafik &amp; Web</span></div>
 <div class="tools">{tools_html}<div class="sw"><span style="position:absolute;left:0;top:0;width:15px;height:15px;background:#fff;border:1px solid #888"></span><span style="position:absolute;right:0;bottom:0;width:15px;height:15px;background:#c9485b;border:1px solid #888"></span></div></div>
 <div class="doc"><span>Sommerfest_Plakat.psd @ 50 % (SOMMERFEST, RGB/8) ✕</span></div>
 <div class="stage">{poster}</div>
 <div class="panel">
  <div class="ph"><span class="on">Ebenenstil</span><span>Zeichen</span><span>Absatz</span></div>
  <div class="prop">
   <div class="r"><span style="display:flex;gap:7px;align-items:center"><span class="bx" style="width:12px;height:12px;border:1px solid #888;border-radius:2px;background:#4a7ce0;display:inline-block"></span><b>Schlagschatten</b></span><span class="dd2">Multiplizieren</span></div>
   {slider("Deckkraft", 38, "38 %")}{slider("Winkel", 66, "120°")}{slider("Abstand", 24, "10 px")}{slider("Größe", 36, "18 px")}
   <div class="r" style="margin-top:10px;margin-bottom:0;color:#aaa"><span>Kontur · Verlaufsüberlagerung · Schein</span></div></div>
  <div class="ph"><span class="on">Ebenen</span><span>Kanäle</span><span>Pfade</span></div>
  <div class="layer on">{ico('eye')}<span class="th" style="background:#2b2c30;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px">T</span><span>SOMMERFEST</span><span class="fx">fx</span></div>
  <div class="layer">{ico('eye')}<span class="th" style="background:#2b2c30;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px">T</span><span>Datum</span></div>
  <div class="layer">{ico('eye')}<span class="th" style="background:linear-gradient(#e8705a,#8f2f57)"></span><span>Hügel</span></div>
  <div class="layer">{ico('eye')}<span class="th" style="background:radial-gradient(circle,#fff6d6,#ffb36b)"></span><span>Sonne</span></div>
  <div class="layer">{ico('eye')}<span class="th" style="background:linear-gradient(#ff7a59,#ffd89a)"></span><span>Verlauf</span>{ico('lock').replace('<svg','<svg style="margin-left:auto"')}</div>
 </div>
 <div class="status"><span>50 %</span><span>2480 × 1646 px (300 ppi)</span><span>5 Ebenen</span></div>
</div>"""

page("08-photokoja", body, css, label="PhotoKoja · Bildbearbeitung", idx="App 5/5", meta="Mac &amp; Windows",
     chips=[("check", "Öffnet &amp; speichert PSD"), ("check", "Ebenenstile, auch auf Text"), ("check", "Offline, ohne Konto"), ("badge-euro", "Kein Adobe-Abo nötig", "blue")], tm=TM_AD)
