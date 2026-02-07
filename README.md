# Flow-Demo

Kleine, statische Web-Demo zur Stromflussanzeige mit animierten Verbindungen zwischen Sonne, Haus und Netz.

## Start

1. Öffne `public/index.html` direkt im Browser (Doppelklick genügt).
2. Optional: Falls lokale Dateizugriffe blockiert werden, starte einen kleinen Webserver:
   ```bash
   python3 -m http.server --directory public 8000
   ```
   und rufe `http://localhost:8000` auf.

## Inhalt

- `public/index.html`: Layout und SVG-Verbindungen
- `public/styles.css`: Gestaltung
- `public/app.js`: Animation und Steuerung
