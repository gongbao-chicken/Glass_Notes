<p align="center">
  <img src="glass-notes/app-icon.png" width="120" alt="Glass Notes logo">
</p>

<h1 align="center">Glass Notes</h1>

<p align="center">
  단축키 하나로 불러오는 전체 화면 유리 스티커 메모 — 언제 어디서나 아이디어를 기록하세요<br/>
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
  <b>한국어</b> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## ✨ 기능

- **🔥 전역 단축키로 호출** — 기본값 `Ctrl+Alt+Space`로 메모 레이어를 표시하거나 숨깁니다. 전체 화면 앱 위에도 그대로 덮어 쓸 수 있습니다. 보조키는 `Ctrl` / `Alt` / `Shift` / `Cmd⌘`(Win)를 모두 지원하며, 설정에서 다시 녹화할 수 있습니다.
- **🪟 진짜 서리 유리 질감** — Windows는 시스템 아크릴(Acrylic) 효과를 사용하고, macOS는 완전 투명, 리퀴드 글래스(`NSGlassEffectView`, macOS 26+, 이전 시스템에서는 자동 폴백), NS 서리 유리의 3단계 배경 효과를 전환할 수 있습니다.
- **📝 블록 단위 WYSIWYG Markdown 편집** — 내용은 빈 줄 기준으로 블록으로 나뉩니다. 편집 중인 블록은 구문 강조가 실시간으로 적용된 Markdown 원문을 보여 주고, 나머지 블록은 즉시 리치 텍스트로 렌더링됩니다. 코드 블록, 번호 / 불릿 / 작업 목록, 인용 등을 지원하며 체크박스는 클릭으로 토글할 수 있습니다.
- **🗒 자유로운 메모 배치** — 메모를 자유롭게 드래그 이동하고 크기를 조절할 수 있습니다. 새 메모는 자동으로 계단식으로 배치되고, 복원 시 좌표는 화면 안으로 자동 조정됩니다.
- **🌍 8가지 인터페이스 언어** — 简体中文(기본값), English, Español, 日本語, 한국어, Русский, Français, Deutsch.
- **🔒 완전한 로컬 저장** — 모든 메모 데이터는 기기의 localStorage에만 저장됩니다. 클라우드 동기화, 텔레메트리, 네트워크 통신이 없습니다.
- **⚙️ 더 많은 세부 기능** — 원클릭 파일 내보내기, 선택적 자동 시작, 단일 인스턴스 보호(다시 실행하면 기존 창을 불러옵니다).

## ⌨️ 단축키

| 동작 | 기본 키 | 설명 |
| --- | --- | --- |
| 메모 레이어 표시 / 숨기기 | `Ctrl+Alt+Space` | 시스템 전역 단축키, 설정에서 변경 가능 |
| 새 메모 | `Ctrl+N` | 앱 내 단축키, 설정에서 변경 가능 |
| 편집 중: 새 블록으로 분할 | `Enter` | Markdown은 블록 단위로 편집, 빈 줄이 블록을 나눕니다 |
| 편집 중: 블록 내 줄바꿈 | `Shift+Enter` | 소프트 줄바꿈으로 렌더링 |
| 목록에서: 들여쓰기 / 내어쓰기 | `Tab` / `Shift+Tab` | 다단 계층 목록 작성 |

## 📦 설치

이 저장소의 **Releases** 페이지에서 사용 중인 플랫폼의 설치 파일을 내려받으세요:

- **Windows**: 설치 파일 / MSIX
- **macOS**: dmg 이미지

> macOS 버전의 배경 효과는 비공개 API(`macOSPrivateApi`)에 의존합니다. 리퀴드 글래스 단계는 macOS 26 이상이 필요하며 이전 시스템에서는 NS 서리 유리로 자동 폴백됩니다.

## 🛠 소스에서 빌드

요구 사항: [Node.js](https://nodejs.org/) ≥ 18, [Rust](https://www.rust-lang.org/) stable 툴체인.

```bash
cd glass-notes
npm install

npm run tauri dev     # 개발 디버깅(핫 리로드)
npm run tauri build   # 배포용 설치 파일 빌드
```

## 📁 디렉터리 구조

```
glass-notes/
├── package.json         # 프런트엔드 의존성과 스크립트, npm 명령은 이 디렉터리에서 실행
├── vite.config.mjs
├── src/                 # 프런트엔드 소스(프레임워크 없는 순수 JS)
│   ├── main.js          # 설정 패널, 언어 전환, 단축키 녹화
│   ├── notefunc.js      # 메모 추가/삭제/편집, 드래그/크기 조절, 내보내기, 영속화
│   ├── markdown.js      # 블록 단위 WYSIWYG Markdown 편집기
│   ├── language.js      # 8개 언어의 모든 UI 문구
│   └── marked.esm.js    # 내장된 marked 사본
└── src-tauri/           # Rust 백엔드(진입점은 src/main.rs)
    └── src/main.rs      # 전역 단축키 등록, 창/유리 효과, 플랫폼 대응
```

## 🔒 개인정보 보호

Glass Notes는 사용자 데이터를 일절 수집하지 않습니다. 메모 내용은 기기의 브라우저 저장소(localStorage)에만 저장되며, 내보내기는 항상 사용자가 직접 실행합니다. 자세한 내용은 [privacy.md](privacy.md)를 참고하세요.

## 📄 라이선스

[MIT](LICENSE) © 2025 鱼香肉丝
