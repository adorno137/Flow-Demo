# Flow-Demo

Kleine, statische Web-Demo zur Stromflussanzeige mit animierten Verbindungen zwischen Sonne, Haus und Netz.

## Start

1. Öffne `docs/index.html` direkt im Browser (Doppelklick genügt).
2. Optional: Falls lokale Dateizugriffe blockiert werden, starte einen kleinen Webserver:
   ```bash
   python3 -m http.server --directory docs 8000
   ```
   und rufe `http://localhost:8000` auf.

## Inhalt

- `docs/index.html`: Layout und SVG-Verbindungen
- `docs/styles.css`: Gestaltung
- `docs/app.js`: Animation und Steuerung

## Nutzung

- Stelle die PV-Leistung und den Hausverbrauch über die Regler ein.
- Die Anzeige "Netz" zeigt Load - PV:
  - positiv = Netzbezug
  - negativ = Einspeisung
- Aktive Linien und Punktgeschwindigkeiten spiegeln die jeweilige Leistung wider.
