<p align="center">
  <img src="glass-notes/app-icon.png" width="120" alt="Glass Notes logo">
</p>

<h1 align="center">Glass Notes · 玻璃便签</h1>

<p align="center">
  呼之即来的全屏玻璃便签 —— 一个快捷键，随时随地记录灵感<br/>
  <i>A beautiful sticky notes tool which can call out anywhere.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.0-blue" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey" alt="platform">
  <img src="https://img.shields.io/badge/Tauri-2-orange" alt="tauri">
</p>

<p align="center">
  <b>简体中文</b> ·
  <a href="README.en.md">English</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## ✨ 功能特性

- **🔥 全局快捷键呼出** — 默认 `Ctrl+Alt+Space` 一键呼出/隐藏，任何应用全屏时也能直接覆盖在最上层使用；修饰键支持 `Ctrl` / `Alt` / `Shift` / `Cmd⌘`，快捷键可在设置中自定义录制。
- **🪟 真毛玻璃质感** — Windows 使用系统亚克力（Acrylic）效果；macOS 提供三档背景效果可切换：全透明、液态玻璃（macOS 26+ 的 `NSGlassEffectView`，老系统自动回退）、NS 毛玻璃。
- **📝 Markdown 分块所见即所得编辑** — 内容按空行分块，正在编辑的块显示 Markdown 原文并实时语法高亮，其余块即时渲染成富文本；支持代码块、有序/无序/待办列表、引用等，待办方框可直接点击勾选。
- **🗒 便签自由排版** — 便签可任意拖拽移动、自由缩放，新建便签自动级联排布，恢复时坐标自动回到视口内。
- **🌍 8 种界面语言** — 简体中文（默认）、English、Español、日本語、한국어、Русский、Français、Deutsch。
- **🔒 纯本地存储** — 所有便签数据保存在本机 localStorage，无云端同步、无遥测、不联网。
- **⚙️ 更多细节** — 便签一键导出为文件、可选开机自启动、单实例保护（重复启动自动唤起已有窗口）。

## ⌨️ 快捷键

| 操作 | 默认按键 | 说明 |
| --- | --- | --- |
| 呼出 / 隐藏便签层 | `Ctrl+Alt+Space` | 系统级全局快捷键，可在设置中修改 |
| 新建便签 | `Ctrl+N` | 前端快捷键，可在设置中修改 |
| 编辑中：拆分新块 | `Enter` | Markdown 按块编辑，空行即分块 |
| 编辑中：块内换行 | `Shift+Enter` | 渲染为软换行 |
| 列表行：缩进 / 反缩进 | `Tab` / `Shift+Tab` | 制作多级列表 |

## 📦 安装

前往本仓库的 **Releases** 页面下载对应平台的安装包：

- **Windows**：安装包 / MSIX
- **macOS**：dmg 镜像

> macOS 版背景效果依赖私有 API（`macOSPrivateApi`），液态玻璃档位需 macOS 26 及以上，老系统自动回退为 NS 毛玻璃。

## 🛠 从源码构建

环境要求：[Node.js](https://nodejs.org/) ≥ 18、[Rust](https://www.rust-lang.org/) stable 工具链。

```bash
cd glass-notes
npm install

npm run tauri dev     # 开发调试（热更新）
npm run tauri build   # 构建各平台发布安装包
```

## 📁 目录结构

```
glass-notes/
├── package.json         # 前端依赖与脚本，npm 命令在此目录执行
├── vite.config.mjs
├── src/                 # 前端源码（原生 JS，无框架）
│   ├── main.js          # 设置面板、语言切换、快捷键录制
│   ├── notefunc.js      # 便签增删改、拖拽/缩放、导出、持久化
│   ├── markdown.js      # 分块所见即所得 Markdown 编辑器
│   ├── language.js      # 8 种语言的全部 UI 文案
│   └── marked.esm.js    # 内置的 marked 副本
└── src-tauri/           # Rust 后端（入口 src/main.rs）
    └── src/main.rs      # 全局快捷键注册、窗口/毛玻璃效果、平台适配
```

## 🔒 隐私

Glass Notes 不收集任何用户数据，便签内容仅保存在本机浏览器存储（localStorage）中，导出完全由用户主动触发。详见 [privacy.md](privacy.md)。

## 📄 许可证

[MIT](LICENSE) © 2025 鱼香肉丝
