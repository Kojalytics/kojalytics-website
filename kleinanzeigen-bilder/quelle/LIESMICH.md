# Quellen der Kleinanzeigen-Bilder

Die Bilder sind HTML-Seiten, die Chromium (Playwright) mit doppelter Auflösung rendert. Dadurch ist jede Schrift echte Vektorschrift.
`photo.jpg` (Urlaubsfoto für PhotoKoja) ist mit Higgsfield erstellt.

Neu erzeugen (in einem Arbeitsordner):
1. Diese Dateien kopieren, `npm i @fontsource-variable/archivo @fontsource/geist-sans @fontsource/geist-mono lucide-static`
2. `icons/<slug>.png` und `shots/<slug>_<datei>.jpg` aus `public/apps/` erzeugen (siehe Kommentar in der Session)
3. `python3 p_word.py && python3 p_grid.py && python3 p_more.py && python3 p_general.py`
4. `node render.js <seitenname> …` → `out/<seitenname>.png`
