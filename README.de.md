<p align="center">
  <img src="glass-notes/app-icon.png" width="120" alt="Glass Notes logo">
</p>

<h1 align="center">Glass Notes</h1>

<p align="center">
  Vollbild-Glas-Notizen auf einen Tastendruck — Ideen jederzeit und überall festhalten<br/>
  <i>A beautiful sticky notes tool which can call out anywhere.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.0-blue" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey" alt="platform">
  <img src="https://img.shields.io/badge/Tauri-2-orange" alt="tauri">
</p>

<p align="center">
  <a href="README.md">简体中文</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.fr.md">Français</a> ·
  <b>Deutsch</b>
</p>

---

## ✨ Funktionen

- **🔥 Aufruf per globaler Tastenkombination** — Die Notizebene wird standardmäßig mit `Ctrl+Alt+Space` ein- und ausgeblendet und legt sich über alle Anwendungen, auch im Vollbild. Alle Modifikatortasten — `Ctrl` / `Alt` / `Shift` / `Cmd⌘` (Win) — werden unterstützt; die Kombination lässt sich in den Einstellungen neu aufnehmen.
- **🪟 Echtes Milchglas** — Windows nutzt den Acrylic-Effekt des Systems; macOS bietet drei umschaltbare Hintergrundeffekte: vollkommen transparent, Liquid Glass (`NSGlassEffectView`, macOS 26+, automatischer Fallback auf älteren Systemen) und NS-Milchglas.
- **📝 Blockweise WYSIWYG-Markdown-Editor** — Inhalte werden an Leerzeilen in Blöcke geteilt. Der bearbeitete Block zeigt das rohe Markdown mit Live-Syntax-Hervorhebung, alle anderen Blöcke werden sofort als Rich-Text gerendert. Unterstützt Codeblöcke, geordnete / ungeordnete / Aufgabenlisten, Zitate und mehr; Kontrollkästchen lassen sich per Klick umschalten.
- **🗒 Freies Notiz-Layout** — Notizen frei verschieben und in der Größe ändern; neue Notizen ordnen sich automatisch kaskadierend an, und die Koordinaten werden beim Wiederherstellen zurück in den sichtbaren Bereich geholt.
- **🌍 8 Oberflächensprachen** — 简体中文 (Standard), English, Español, 日本語, 한국어, Русский, Français, Deutsch.
- **🔒 Rein lokale Speicherung** — Alle Notizdaten liegen im localStorage Ihres Rechners. Keine Cloud-Synchronisierung, keine Telemetrie, keine Netzwerkzugriffe.
- **⚙️ Weitere Details** — Export in eine Datei mit einem Klick, optionaler Autostart, Single-Instance-Schutz (ein erneuter Start weckt das bestehende Fenster).

## ⌨️ Tastenkombinationen

| Aktion | Standard | Hinweis |
| --- | --- | --- |
| Notizebene ein-/ausblenden | `Ctrl+Alt+Space` | Systemweite globale Tastenkombination, in den Einstellungen änderbar |
| Neue Notiz | `Ctrl+N` | App-interne Tastenkombination, in den Einstellungen änderbar |
| Beim Bearbeiten: in einen neuen Block teilen | `Enter` | Markdown wird blockweise bearbeitet; eine Leerzeile teilt Blöcke |
| Beim Bearbeiten: Zeilenumbruch im Block | `Shift+Enter` | Wird als weicher Zeilenumbruch gerendert |
| In einer Liste: ein-/ausrücken | `Tab` / `Shift+Tab` | Für mehrstufige Listen |

## 📦 Installation

Laden Sie den Installer für Ihre Plattform von der **Releases**-Seite dieses Repositorys herunter:

- **Windows**: Installer / MSIX
- **macOS**: dmg-Abbild

> Die Hintergrundeffekte der macOS-Version beruhen auf privaten APIs (`macOSPrivateApi`). Die Liquid-Glass-Stufe erfordert macOS 26 oder neuer; ältere Systeme fallen automatisch auf NS-Milchglas zurück.

## 🛠 Aus dem Quellcode bauen

Voraussetzungen: [Node.js](https://nodejs.org/) ≥ 18 und eine stabile [Rust](https://www.rust-lang.org/)-Toolchain.

```bash
cd glass-notes
npm install

npm run tauri dev     # Entwicklung mit Hot Reload
npm run tauri build   # Release-Installer bauen
```

## 📁 Projektstruktur

```
glass-notes/
├── package.json         # Frontend-Abhängigkeiten und -Skripte; npm-Befehle werden hier ausgeführt
├── vite.config.mjs
├── src/                 # Frontend-Quellcode (pures JS, ohne Framework)
│   ├── main.js          # Einstellungsfeld, Sprachwechsel, Aufnahme von Tastenkombinationen
│   ├── notefunc.js      # Notizen anlegen/löschen/bearbeiten, ziehen/skalieren, Export, Persistenz
│   ├── markdown.js      # Blockweise WYSIWYG-Markdown-Editor
│   ├── language.js      # Sämtliche UI-Texte in 8 Sprachen
│   └── marked.esm.js    # Mitgelieferte Kopie von marked
└── src-tauri/           # Rust-Backend (Einstiegspunkt: src/main.rs)
    └── src/main.rs      # Registrierung globaler Tastenkombinationen, Fenster-/Glas-Effekte, Plattform-Anpassung
```

## 🔒 Datenschutz

Glass Notes sammelt keine Benutzerdaten. Notizen liegen ausschließlich im Browserspeicher (localStorage) Ihres Rechners, und ein Export wird stets von Ihnen selbst ausgelöst. Details unter [privacy.md](privacy.md).

## 📄 Lizenz

[MIT](LICENSE) © 2025 鱼香肉丝
