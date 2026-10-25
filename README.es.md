<p align="center">
  <img src="glass-notes/app-icon.png" width="120" alt="Glass Notes logo">
</p>

<h1 align="center">Glass Notes</h1>

<p align="center">
  Notas adhesivas de cristal a pantalla completa, a un solo atajo de distancia — captura ideas en cualquier momento y lugar<br/>
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
  <b>Español</b> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## ✨ Características

- **🔥 Invocación con atajo global** — Muestra u oculta la capa de notas con `Ctrl+Alt+Space` por defecto; se superpone a cualquier aplicación, incluso en pantalla completa. Se admiten todos los modificadores — `Ctrl` / `Alt` / `Shift` / `Cmd⌘` (Win) — y el atajo se puede volver a grabar en Ajustes.
- **🪟 Auténtico cristal esmerilado** — Windows usa el efecto Acrylic del sistema; macOS ofrece tres efectos de fondo conmutables: totalmente transparente, cristal líquido (`NSGlassEffectView`, macOS 26+, con retroceso automático en sistemas anteriores) y cristal esmerilado NS.
- **📝 Edición Markdown WYSIWYG por bloques** — El contenido se divide en bloques por líneas en blanco. El bloque que estás editando muestra el Markdown original con resaltado de sintaxis en vivo, mientras el resto se renderiza al instante como texto enriquecido. Admite bloques de código, listas ordenadas / sin orden / de tareas, citas y más; las casillas de tareas se alternan con un clic.
- **🗒 Disposición libre de las notas** — Arrastra las notas a donde quieras y redimensiónalas con libertad; las notas nuevas se disponen en cascada y las coordenadas se reajustan al área visible al restaurar.
- **🌍 8 idiomas de interfaz** — 简体中文 (predeterminado), English, Español, 日本語, 한국어, Русский, Français, Deutsch.
- **🔒 Almacenamiento totalmente local** — Todos los datos de las notas viven en el localStorage de tu equipo. Sin sincronización en la nube, sin telemetría, sin acceso a la red.
- **⚙️ Más detalles** — Exportación a archivo con un clic, inicio automático opcional, protección de instancia única (relanzar la app invoca la ventana existente).

## ⌨️ Atajos de teclado

| Acción | Por defecto | Descripción |
| --- | --- | --- |
| Mostrar / ocultar la capa de notas | `Ctrl+Alt+Space` | Atajo global del sistema, personalizable en Ajustes |
| Nota nueva | `Ctrl+N` | Atajo interno de la app, personalizable en Ajustes |
| Al editar: dividir en un bloque nuevo | `Enter` | El Markdown se edita por bloques; una línea en blanco los separa |
| Al editar: salto de línea dentro del bloque | `Shift+Enter` | Se renderiza como salto suave |
| En una lista: sangrar / desangrar | `Tab` / `Shift+Tab` | Para listas de varios niveles |

## 📦 Instalación

Descarga el instalador de tu plataforma desde la página **Releases** de este repositorio:

- **Windows**: instalador / MSIX
- **macOS**: imagen dmg

> Los efectos de fondo en macOS dependen de APIs privadas (`macOSPrivateApi`). El nivel de cristal líquido requiere macOS 26 o superior y retrocede automáticamente a cristal esmerilado NS en sistemas anteriores.

## 🛠 Compilar desde el código fuente

Requisitos: [Node.js](https://nodejs.org/) ≥ 18 y la cadena de herramientas estable de [Rust](https://www.rust-lang.org/).

```bash
cd glass-notes
npm install

npm run tauri dev     # desarrollo con recarga en caliente
npm run tauri build   # compilar los instaladores de publicación
```

## 📁 Estructura del proyecto

```
glass-notes/
├── package.json         # Dependencias y scripts del frontend; los comandos npm se ejecutan aquí
├── vite.config.mjs
├── src/                 # Código fuente del frontend (JS puro, sin framework)
│   ├── main.js          # Panel de ajustes, cambio de idioma, grabación de atajos
│   ├── notefunc.js      # CRUD de notas, arrastrar/redimensionar, exportación, persistencia
│   ├── markdown.js      # Editor Markdown WYSIWYG por bloques
│   ├── language.js      # Todos los textos de la interfaz en 8 idiomas
│   └── marked.esm.js    # Copia incluida de marked
└── src-tauri/           # Backend en Rust (entrada: src/main.rs)
    └── src/main.rs      # Registro de atajos globales, ventana / efectos de cristal, adaptación por plataforma
```

## 🔒 Privacidad

Glass Notes no recoge ningún dato del usuario. Las notas se guardan únicamente en el almacenamiento del navegador (localStorage) de tu equipo, y la exportación siempre la activas tú. Consulta [privacy.md](privacy.md).

## 📄 Licencia

[MIT](LICENSE) © 2025 鱼香肉丝
