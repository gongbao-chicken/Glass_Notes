<p align="center">
  <img src="glass-notes/app-icon.png" width="120" alt="Glass Notes logo">
</p>

<h1 align="center">Glass Notes</h1>

<p align="center">
  Fullscreen glass sticky notes, one keystroke away — capture ideas anytime, anywhere<br/>
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
  <b>English</b> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## ✨ Features

- **🔥 Summon with a global shortcut** — Show or hide the notes layer with `Ctrl+Alt+Space` by default; it overlays every application, even in fullscreen. All modifier keys — `Ctrl` / `Alt` / `Shift` / `Cmd⌘` (Win) — are supported, and the shortcut can be re-recorded in Settings.
- **🪟 Real frosted glass** — Windows uses the system Acrylic effect; macOS offers three switchable background effects: fully transparent, Liquid Glass (`NSGlassEffectView`, macOS 26+, automatic fallback on older systems) and NS frosted glass.
- **📝 Block-based WYSIWYG Markdown editing** — Content is split into blocks by blank lines. The block you are editing shows raw Markdown with live syntax highlighting, while every other block renders instantly as rich text. Supports code blocks, ordered / unordered / task lists, quotes and more; task checkboxes toggle with a click.
- **🗒 Free note layout** — Drag notes anywhere and resize them freely; new notes cascade automatically, and positions are clamped back into the viewport on restore.
- **🌍 8 interface languages** — 简体中文 (default), English, Español, 日本語, 한국어, Русский, Français, Deutsch.
- **🔒 Fully local storage** — All notes live in localStorage on your machine. No cloud sync, no telemetry, no network access.
- **⚙️ More details** — One-click export to a file, optional launch at startup, single-instance protection (launching again summons the existing window).

## ⌨️ Keyboard Shortcuts

| Action | Default | Notes |
| --- | --- | --- |
| Show / hide the notes layer | `Ctrl+Alt+Space` | System-wide global shortcut, customizable in Settings |
| New note | `Ctrl+N` | In-app shortcut, customizable in Settings |
| While editing: split into a new block | `Enter` | Markdown is edited block by block; a blank line splits blocks |
| While editing: line break within a block | `Shift+Enter` | Rendered as a soft line break |
| Inside a list: indent / outdent | `Tab` / `Shift+Tab` | For nested lists |

## 📦 Installation

Download the installer for your platform from the **Releases** page of this repository:

- **Windows**: installer / MSIX
- **macOS**: dmg image

> The macOS background effects rely on private APIs (`macOSPrivateApi`). The Liquid Glass level requires macOS 26 or later and falls back to NS frosted glass on older systems.

## 🛠 Build from Source

Requirements: [Node.js](https://nodejs.org/) ≥ 18 and a [Rust](https://www.rust-lang.org/) stable toolchain.

```bash
cd glass-notes
npm install

npm run tauri dev     # development with hot reload
npm run tauri build   # build release installers
```

## 📁 Project Structure

```
glass-notes/
├── package.json         # Frontend dependencies and scripts; run npm commands here
├── vite.config.mjs
├── src/                 # Frontend source (vanilla JS, no framework)
│   ├── main.js          # Settings panel, language switching, shortcut recorder
│   ├── notefunc.js      # Note CRUD, drag & resize, export, persistence
│   ├── markdown.js      # Block-based WYSIWYG Markdown editor
│   ├── language.js      # All UI strings in 8 languages
│   └── marked.esm.js    # Bundled copy of marked
└── src-tauri/           # Rust backend (entry: src/main.rs)
    └── src/main.rs      # Global shortcut registration, window / glass effects, platform adaptation
```

## 🔒 Privacy

Glass Notes collects no user data. Notes are stored only in the browser storage (localStorage) on your machine, and exporting is always triggered by you. See [privacy.md](privacy.md).

## 📄 License

[MIT](LICENSE) © 2025 鱼香肉丝
