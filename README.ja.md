<p align="center">
  <img src="glass-notes/app-icon.png" width="120" alt="Glass Notes logo">
</p>

<h1 align="center">Glass Notes</h1>

<p align="center">
  ワンキーで呼び出せるフルスクリーンのガラス付箋 —— いつでもどこでもアイデアを記録<br/>
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
  <b>日本語</b> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## ✨ 機能

- **🔥 グローバルショートカットで呼び出し** — デフォルトの `Ctrl+Alt+Space` で付箋レイヤーを表示 / 非表示にできます。全画面アプリの上にもそのまま重ねて使えます。修飾キーは `Ctrl` / `Alt` / `Shift` / `Cmd⌘`（Win）すべてに対応し、設定から録り直せます。
- **🪟 本物のすりガラスの質感** — Windows はシステムのアクリル（Acrylic）効果を使用。macOS は完全透明、リキッドグラス（`NSGlassEffectView`、macOS 26+、旧システムでは自動フォールバック）、NS すりガラスの 3 段階の背景効果を切り替えられます。
- **📝 ブロック単位の WYSIWYG Markdown エディタ** — 内容は空行でブロックに分割されます。編集中のブロックは構文ハイライト付きの Markdown 原文を表示し、他のブロックは即座にリッチテキストへレンダリングされます。コードブロック、番号付き / 黒丸 / タスクリスト、引用などに対応し、チェックボックスはクリックで切替できます。
- **🗒 自由な付箋レイアウト** — ドラッグで自由に移動・リサイズできます。新規付箋は自動でカスケード配置され、復元時には座標が画面内へ自動調整されます。
- **🌍 8 つの UI 言語** — 简体中文（デフォルト）、English、Español、日本語、한국어、Русский、Français、Deutsch。
- **🔒 完全ローカル保存** — 付箋データはすべて端末内の localStorage に保存されます。クラウド同期・テレメトリ・通信は一切ありません。
- **⚙️ その他の機能** — ワンクリックでのファイル書き出し、オプションの自動起動、シングルインスタンス保護（再起動すると既存のウィンドウを呼び起こします）。

## ⌨️ ショートカット

| 操作 | デフォルト | 説明 |
| --- | --- | --- |
| 付箋レイヤーの表示 / 非表示 | `Ctrl+Alt+Space` | システム全体のグローバルショートカット、設定で変更可能 |
| 新規付箋 | `Ctrl+N` | アプリ内ショートカット、設定で変更可能 |
| 編集中：新しいブロックに分割 | `Enter` | Markdown はブロック単位で編集、空行でブロックを分割 |
| 編集中：ブロック内の改行 | `Shift+Enter` | ソフト改行としてレンダリング |
| リスト行：インデント / インデント解除 | `Tab` / `Shift+Tab` | 多段リストの作成 |

## 📦 インストール

本リポジトリの **Releases** ページから、お使いのプラットフォームのインストーラーをダウンロードしてください：

- **Windows**：インストーラー / MSIX
- **macOS**：dmg イメージ

> macOS 版の背景効果はプライベート API（`macOSPrivateApi`）に依存します。リキッドグラスの段階には macOS 26 以降が必要で、旧システムでは NS すりガラスへ自動フォールバックします。

## 🛠 ソースからビルド

要件：[Node.js](https://nodejs.org/) ≥ 18、[Rust](https://www.rust-lang.org/) stable ツールチェーン。

```bash
cd glass-notes
npm install

npm run tauri dev     # 開発（ホットリロード）
npm run tauri build   # リリース用インストーラーをビルド
```

## 📁 ディレクトリ構成

```
glass-notes/
├── package.json         # フロントエンドの依存関係とスクリプト、npm コマンドはこのディレクトリで実行
├── vite.config.mjs
├── src/                 # フロントエンドのソース（フレームワークなしの純 JS）
│   ├── main.js          # 設定パネル、言語切替、ショートカット録音
│   ├── notefunc.js      # 付箋の追加・削除・編集、ドラッグ / リサイズ、書き出し、永続化
│   ├── markdown.js      # ブロック単位の WYSIWYG Markdown エディタ
│   ├── language.js      # 8 言語のすべての UI 文言
│   └── marked.esm.js    # 同梱の marked コピー
└── src-tauri/           # Rust バックエンド（エントリは src/main.rs）
    └── src/main.rs      # グローバルショートカット登録、ウィンドウ / ガラス効果、プラットフォーム適応
```

## 🔒 プライバシー

Glass Notes はユーザーデータを一切収集しません。付箋の内容は端末のブラウザストレージ（localStorage）にのみ保存され、書き出しは常にユーザー自身の操作で行われます。詳細は [privacy.md](privacy.md) を参照してください。

## 📄 ライセンス

[MIT](LICENSE) © 2025 鱼香肉丝
