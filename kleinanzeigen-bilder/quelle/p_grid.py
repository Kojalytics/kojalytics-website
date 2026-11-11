from lib import *
import math

css = """
.head { display:flex; gap:22px; align-items:center; padding:30px 0 0; }
.head h1 { font-size: 46px; }
.head p { font-size: 19px; color: var(--muted); margin-top: 10px; line-height:1.4; }
.win { left: 44px; right: 44px; top: 214px; height: 600px; }
.tb { background:#1d7a43; color:#fff; border-bottom:0; } .tb .t { color:#fff; }
.tabs { display:flex; gap:22px; padding: 0 16px; height: 32px; align-items:center; font-size: 13px; color:#333; background:#fff; }
.tabs .on { color:#1d7a43; font-weight:600; border-bottom:2px solid #1d7a43; padding: 7px 0 5px; }
.rib { height: 60px; display:flex; align-items:center; gap:18px; padding:0 14px; border-bottom:1px solid #e3e3e3; background:#fafafa; font-size:12px; color:#444; }
.rib .g { display:flex; gap:6px; align-items:center; padding-right:18px; border-right:1px solid #e6e6e6; height:40px; }
.rib svg { width:17px; height:17px; stroke-width:1.7; color:#333; }
.dd { border:1px solid #cfcfcf; background:#fff; height:24px; padding:0 8px; display:flex; align-items:center; border-radius:3px; }
.fx { height: 30px; display:flex; align-items:center; border-bottom:1px solid #e3e3e3; font-size:13px; }
.fx .nm { width:76px; border-right:1px solid #e3e3e3; height:100%; display:flex; align-items:center; padding-left:10px; color:#333; }
.fx .f { padding-left:12px; font-family: "GeistMono"; font-size:13px; color:#222; }
.fx .f b { color:#1d7a43; font-weight:500; } .fx .f i { color:#2a66d8; font-style:normal; } .fx .f u { color:#c2410c; text-decoration:none; }
table { border-collapse: collapse; font-family: Carlito; font-size: 14px; position:absolute; top:157px; left:0; }
td, th { border:1px solid #e2e2e2; height:25px; padding:0 7px; white-space:nowrap; }
th { background:#f3f3f3; font-weight:400; color:#666; font-family:Geist; font-size:11.5px; text-align:center; }
th.rh { width:34px; }
.num { text-align:right; }
.hd td { background:#1d7a43; color:#fff; font-weight:700; }
.title { font-size:19px; font-weight:700; color:#1d4d2e; border-color:transparent !important; }
.sum td { font-weight:700; border-top:2px solid #1d7a43; background:#eef7f1; }
.act { outline:2px solid #1d7a43; outline-offset:-2px; position:relative; }
.act::after { content:""; position:absolute; right:-4px; bottom:-4px; width:6px; height:6px; background:#1d7a43; border:1px solid #fff; }
.over { color:#b42318; background:#fde8e6; }
.ok { color:#1d7a43; }
td.dbar { position:relative; }
.db { position:absolute; left:2px; top:5px; bottom:5px; background:linear-gradient(90deg,#9ad1ae,#d9efe1); z-index:0; }
td.dbar span { position:relative; z-index:1; }
.chart { position:absolute; top:172px; right:22px; width:330px; height:356px; background:#fff; border:1px solid #d9d9d9; box-shadow:0 2px 8px rgba(0,0,0,.06); padding:14px 16px; font-family:Carlito; }
.chart h5 { font-size:15px; text-align:center; color:#333; font-weight:700; }
.leg { display:grid; grid-template-columns:1fr 1fr; gap:4px 10px; font-size:12.5px; color:#444; margin-top:6px; }
.leg i { display:inline-block; width:10px; height:10px; margin-right:5px; }
.sheets { position:absolute; bottom:24px; left:0; right:0; height:30px; display:flex; align-items:center; gap:2px; padding-left:40px; font-size:12.5px; background:#f4f4f3; border-top:1px solid #e3e3e3; }
.sheets span { padding:5px 14px; color:#555; } .sheets .on { background:#fff; color:#1d7a43; font-weight:600; border-bottom:2px solid #1d7a43; }
.status { position:absolute; left:0; right:0; bottom:0; height:24px; background:#f4f4f3; border-top:1px solid #e3e3e3; font-size:11.5px; color:#555; display:flex; align-items:center; gap:22px; padding:0 14px; }
"""

rows = [
    ("Miete", 950, 950), ("Lebensmittel", 450, 512), ("Strom &amp; Gas", 120, 118), ("Handy &amp; Internet", 60, 55),
    ("Versicherungen", 140, 140), ("Auto &amp; Tanken", 220, 247), ("Freizeit", 150, 96), ("Sparen", 300, 300),
]
def eur(v): return f"{v:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")
cols = "ABCDEFGHIJ"
th = '<tr><th class="rh"></th>' + "".join(f'<th style="width:{w}px">{c}</th>' for c, w in zip("ABCDE", [150, 98, 98, 98, 108])) + "</tr>"
trs = [th]
trs.append('<tr><th>1</th><td class="title" colspan="5">Haushaltsbuch · November 2026</td></tr>')
trs.append('<tr><th>2</th><td colspan="5" style="color:#888;font-family:Geist;font-size:12px;border-color:transparent">Nettoeinkommen: 2.640,00 €</td></tr>')
trs.append('<tr class="hd"><th>3</th><td>Kategorie</td><td class="num">Budget</td><td class="num">Ausgaben</td><td class="num">Differenz</td><td>Anteil</td></tr>')
tb = sum(r[1] for r in rows); ta = sum(r[2] for r in rows)
for i, (k, b, a) in enumerate(rows):
    d = b - a
    cls = "over" if d < 0 else "ok"
    pct = a / ta
    trs.append(f'<tr><th>{i+4}</th><td>{k}</td><td class="num">{eur(b)}</td><td class="num">{eur(a)}</td><td class="num {cls}">{eur(d)}</td>'
               f'<td class="dbar"><div class="db" style="width:{pct*100*2.2:.0f}%"></div><span>{str(round(pct*100,1)).replace('.',',')} %</span></td></tr>')
trs.append(f'<tr class="sum"><th>12</th><td>Summe</td><td class="num">{eur(tb)}</td><td class="num act">{eur(ta)}</td><td class="num {"over" if tb-ta<0 else "ok"}">{eur(tb-ta)}</td><td>100 %</td></tr>')
trs.append(f'<tr><th>13</th><td colspan="5" style="border-color:transparent"></td></tr>')
trs.append(f'<tr><th>14</th><td style="color:#555">Übrig im Monat</td><td></td><td class="num" style="font-weight:700;color:#1d7a43">{eur(2640-ta)}</td><td colspan="2" style="border-color:transparent"></td></tr>')
for r in range(15, 15):
    trs.append(f'<tr><th>{r}</th>' + '<td></td>' * 5 + '</tr>')
table = "<table>" + "".join(trs).replace(".0 %", " %") + "</table>"
table = table.replace(">2,4 %", ">2,4 %")

# donut
pal = ["#1d7a43", "#2fa36b", "#7cc49a", "#b6dfc5", "#2a66d8", "#7fa6ea", "#f3a617", "#9aa0a6"]
cx, cy, R, r0 = 110, 110, 100, 58
ang = -math.pi / 2; paths = []
for (k, b, a), c in zip(rows, pal):
    sw = a / ta * 2 * math.pi
    a2 = ang + sw
    large = 1 if sw > math.pi else 0
    p = (f"M{cx+R*math.cos(ang):.2f},{cy+R*math.sin(ang):.2f} A{R},{R} 0 {large} 1 {cx+R*math.cos(a2):.2f},{cy+R*math.sin(a2):.2f} "
         f"L{cx+r0*math.cos(a2):.2f},{cy+r0*math.sin(a2):.2f} A{r0},{r0} 0 {large} 0 {cx+r0*math.cos(ang):.2f},{cy+r0*math.sin(ang):.2f} Z")
    paths.append(f'<path d="{p}" fill="{c}" stroke="#fff" stroke-width="2"/>')
    ang = a2
donut = (f'<svg width="220" height="220" viewBox="0 0 220 220" style="display:block;margin:6px auto 0">{"".join(paths)}'
         f'<text x="110" y="106" text-anchor="middle" font-family="Carlito" font-size="13" fill="#666">Ausgaben</text>'
         f'<text x="110" y="128" text-anchor="middle" font-family="Carlito" font-size="20" font-weight="700" fill="#222">{eur(ta)}</text></svg>')
legend = "".join(f'<div><i style="background:{c}"></i>{k}</div>' for (k, _, _), c in zip(rows, pal))
chart = f'<div class="chart"><h5>Wohin geht mein Geld?</h5>{donut}<div class="leg">{legend}</div></div>'

body = f"""
<div class="head">{app_icon('grid-koja', 84)}<div>
<h1 class="display">Haushaltsbuch im <span class="hl">Griff</span>.</h1>
<p>Budget planen, Ausgaben auswerten, Diagramm auf Knopfdruck – mit .xlsx-Dateien wie gewohnt.<br>Einmal kaufen statt jedes Jahr ein Office-Abo zahlen.</p></div></div>
<div class="win">
 <div class="tb"><div class="dots"><i></i><i></i><i></i></div><div class="t">Haushaltsbuch_2026.xlsx — GridKoja</div></div>
 <div class="tabs"><span>Datei</span><span>Start</span><span>Einfügen</span><span>Seitenlayout</span><span class="on">Formeln</span><span>Daten</span><span>Überprüfen</span><span>Ansicht</span></div>
 <div class="rib">
  <div class="g">{ico('sigma')}<span>AutoSumme</span></div>
  <div class="g">{ico('function-square')}<span>Funktion einfügen</span></div>
  <div class="g">{ico('chart-pie')}<span>Diagramm</span></div>
  <div class="g">{ico('table-2')}<span>PivotTable</span></div>
  <div class="g">{ico('paint-bucket')}<span>Bedingte Formatierung</span></div>
  <div class="g" style="border:0">{ico('arrow-down-wide-narrow')}<span>Sortieren &amp; Filtern</span></div>
 </div>
 <div class="fx"><div class="nm">C12</div><div style="padding:0 10px;color:#888;border-right:1px solid #e3e3e3;height:100%;display:flex;align-items:center">fx</div><div class="f">=<b>SUMME</b>(<i>C4:C11</i>)</div></div>
 {table}
 {chart}
 <div class="sheets"><span class="on">November</span><span>Oktober</span><span>Jahresübersicht</span><span>Urlaubskasse</span><span style="color:#999">+</span></div>
 <div class="status"><span>Bereit</span><span style="margin-left:auto">Summe: {eur(ta)}</span><span>100 %</span></div>
</div>
"""
page("05-gridkoja", body, css, label="GridKoja · Tabellenkalkulation", idx="App 2/5", meta="Mac &amp; Windows",
     chips=[("check", "Öffnet &amp; speichert .xlsx"), ("check", "500+ Funktionen"), ("check", "17 Diagrammtypen"), ("badge-euro", "Kein Office-Abo nötig", "blue")], tm="Microsoft und Office sind Marken der Microsoft Corporation. Kojalytics steht in keiner Verbindung zu Microsoft.")
