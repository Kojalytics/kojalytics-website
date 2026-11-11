import os, re
B = os.path.dirname(os.path.abspath(__file__))

def ico(name, cls=""):
    s = open(f"{B}/node_modules/lucide-static/icons/{name}.svg").read()
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)
    if cls:
        s = s.replace("<svg", f'<svg class="{cls}"', 1)
    return s.strip()

def app_icon(slug, size):
    return f'<img src="icons/{slug}.png" style="width:{size}px;height:{size}px;display:block" alt="">'

def page(name, body, css="", label="", idx="", meta="", chips=None, tm=""):
    chips_html = ""
    if chips:
        chips_html = '<div class="foot">' + "".join(
            f'<div class="chip {c[2] if len(c) > 2 else ""}">{ico(c[0])}<span>{c[1]}</span></div>' for c in chips
        ) + "</div>"
    tm_html = f'<div class="tm">{tm}</div>' if tm else ""
    html = f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<link rel="stylesheet" href="base.css"><style>{css}</style></head><body><div class="page">
<div class="rail" style="left:44px"></div><div class="rail" style="right:44px"></div>
<div class="x" style="left:38px;top:58px"></div><div class="x" style="right:38px;top:58px"></div>
<div class="bar"><div class="l"><span class="hud idx">{idx}</span><span class="hud">{label}</span></div><div class="l"><span class="hud">{meta}</span><span class="wordmark">Kojalytics</span></div></div>
{body}
{tm_html}{chips_html}
</div></body></html>"""
    open(f"{B}/{name}.html", "w").write(html)
