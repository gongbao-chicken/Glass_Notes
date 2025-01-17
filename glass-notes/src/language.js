// 语言设置
export let currentLang = localStorage.getItem('glass-notes-lang') || 'zh';

export function setCurrentLang(lang) {
  currentLang = lang;
  localStorage.setItem('glass-notes-lang', lang);
}

// 语言文本
export const langText = {
      zh: {
          shortcut: '呼出界面快捷键',
          record: '重置快捷键',
          apply: '应用',
          language: '语言',
          chinese: '中文',
          english: 'English',
          spanish: 'Español',
          japanese: '日本語',
          korean: '한국어',
          shortcutHint: '点击"重置快捷键"后按下新的快捷键组合，然后点击"应用"',
          pressShortcut: '按下新的快捷键...',
          shortcutFailed: '设置失败，请重试',
          noteShortcutLabel:'新建便签快捷键',
          exportNote: '导出便签',
          exportSuccess: '便签导出成功！',
          exportFailed: '便签导出失败，请重试',
          autoStart: '开机自启动',
          autoStartEnabled: '已启用',
          autoStartDisabled: '已禁用',
          markdownPreview: 'Markdown预览',
          markdownPreviewEnabled: '已启用',
          markdownPreviewDisabled: '已禁用',
          about: '关于 Glass notes',
          aboutinfo:'本应用基于TAURI平台，由AI辅助生成，用户数据全部离线保存在本地，不涉及任何信息外发，特此声明。<br>联系方式：pinyinzhenhao@aliyun.com'
        },
    en: {
      shortcut: 'Shortcut key to open the interface',
      record: 'Reset Shortcut',
      apply: 'Apply',
      language: 'Language',
      chinese: '中文',
      english: 'English',
      spanish: 'Español',
      japanese: 'Japanese',
      korean: 'Korean',
      shortcutHint: 'Click "Reset Shortcut", then press new shortcut combination, and click "Apply"',
      pressShortcut: 'Press new shortcut...',
      shortcutFailed: 'Failed to set shortcut, please try again',
      noteShortcutLabel:'Shortcut for New Sticky Notes',
      exportNote: 'Export Note',
      exportSuccess: 'Note exported successfully!',
      exportFailed: 'Failed to export note, please try again',
      autoStart: 'Auto Start',
      autoStartEnabled: 'Enabled',
      autoStartDisabled: 'Disabled',
      markdownPreview: 'Markdown Preview',
      markdownPreviewEnabled: 'Enabled',
      markdownPreviewDisabled: 'Disabled',
      about: 'About Glass notes',
      aboutinfo: 'This application is based on the TAURI platform, AI-assisted development. All user data is stored locally offline, no information is sent out. <br> Contact: pinyinzhenhao@aliyun.com'
    },
    es: {
      shortcut: 'Tecla de acceso rápido para abrir la interfaz',
      record: 'Restablecer atajo',
      apply: 'Aplicar',
      language: 'Idioma',
      chinese: 'Chino',
      english: 'Inglés',
      spanish: 'Español',
      japanese: 'Japonés',
      korean: 'Coreano',
      shortcutHint: 'Haga clic en "Restablecer atajo", luego presione la nueva combinación de teclas y haga clic en "Aplicar"',
      pressShortcut: 'Presione un nuevo atajo...',
      shortcutFailed: 'Error al configurar el atajo, intente nuevamente',
      noteShortcutLabel:'Atajo para nuevas notas adhesivas',
      exportNote: 'Exportar nota',
      exportSuccess: '¡Nota exportada con éxito!',
      exportFailed: 'Error al exportar la nota, por favor inténtelo de nuevo',
      autoStart: 'Inicio automático',
      autoStartEnabled: 'Habilitado',
      autoStartDisabled: 'Deshabilitado',
      markdownPreview: 'Vista previa de Markdown',
      markdownPreviewEnabled: 'Habilitado',
      markdownPreviewDisabled: 'Deshabilitado',
      about: 'Acerca de Glass notes',
      aboutinfo: 'Esta aplicación está basada en la plataforma TAURI, desarrollada con asistencia de IA. Todos los datos del usuario se almacenan localmente sin conexión, no se envía ninguna información. <br>Contacto: pinyinzhenhao@aliyun.com'
    },
    ja: {
      shortcut: 'インターフェースを開くショートカットキー',
      record: 'ショートカットをリセット',
      apply: '適用',
      language: '言語',
      chinese: '中国語',
      english: '英語',
      spanish: 'スペイン語',
      japanese: '日本語',
      korean: '韓国語',
      shortcutHint: '「ショートカットをリセット」をクリックし、新しいショートカットを押して、「適用」をクリックします',
      pressShortcut: '新しいショートカットを入力してください...',
      shortcutFailed: 'ショートカットの設定に失敗しました。もう一度お試しください',
      noteShortcutLabel:'新規付箋のショートカット',
      exportNote: 'ノートをエクスポート',
      exportSuccess: 'ノートのエクスポートが成功しました！',
      exportFailed: 'ノートのエクスポートに失敗しました。再試行してください',
      autoStart: '自動起動',
      autoStartEnabled: '有効',
      autoStartDisabled: '無効',
      markdownPreview: 'Markdownプレビュー',
      markdownPreviewEnabled: '有効',
      markdownPreviewDisabled: '無効',
      about: 'Glass notesについて',
      aboutinfo: 'このアプリケーションはTAURIプラットフォームに基づいており、AI支援開発です。すべてのユーザーデータはローカルにオフラインで保存され、情報は送信されません。<br>連絡先: pinyinzhenhao@aliyun.com'
    },
    ko: {
      shortcut: '인터페이스 호출 단축키',
      record: '단축키 재설정',
      apply: '적용',
      language: '언어',
      chinese: '중국어',
      english: '영어',
      spanish: '스페인어',
      japanese: '일본어',
      korean: '한국어',
      shortcutHint: '"단축키 재설정"을 클릭한 후 새로운 단축키 조합을 누르고 "적용"을 클릭하세요',
      pressShortcut: '새로운 단축키를 입력하세요...',
      shortcutFailed: '단축키 설정에 실패했습니다. 다시 시도해 주세요',
      noteShortcutLabel:'새 스티커 메모 단축키',
      exportNote: '노트 내보내기',
      exportSuccess: '노트 내보내기 성공!',
      exportFailed: '노트 내보내기 실패, 다시 시도해 주세요',
      autoStart: '자동 시작',
      autoStartEnabled: '활성화됨',
      autoStartDisabled: '비활성화됨',
      markdownPreview: 'Markdown 미리보기',
      markdownPreviewEnabled: '활성화됨',
      markdownPreviewDisabled: '비활성화됨',
      about: 'Glass notes 정보',
      aboutinfo: '이 애플리케이션은 TAURI 플랫폼을 기반으로 하며 AI 지원 개발입니다. 모든 사용자 데이터는 로컬에서 오프라인으로 저장되며 정보는 전송되지 않습니다. <br>연락처: pinyinzhenhao@aliyun.com'
    },
    ru: {
      shortcut: 'Горячая клавиша для вызова интерфейса',
      record: 'Сбросить сочетание',
      apply: 'Применить',
      language: 'Язык',
      chinese: 'Китайский',
      english: 'Английский',
      spanish: 'Испанский',
      japanese: 'Японский',
      korean: 'Корейский',
      french: 'Французский',
      german: 'Немецкий',
      russian: 'Русский',
      shortcutHint: 'Нажмите "Сбросить сочетание", затем введите новую комбинацию и нажмите "Применить"',
      pressShortcut: 'Введите новое сочетание клавиш...',
      shortcutFailed: 'Не удалось установить сочетание клавиш, попробуйте снова',
      noteShortcutLabel:'Сочетание клавиш для новых стикеров',
      exportNote: 'Экспорт заметки',
      exportSuccess: 'Заметка успешно экспортирована!',
      exportFailed: 'Не удалось экспортировать заметку, попробуйте снова',
      autoStart: 'Автозапуск',
      autoStartEnabled: 'Включено',
      autoStartDisabled: 'Отключено',
      markdownPreview: 'Предпросмотр Markdown',
      markdownPreviewEnabled: 'Включено',
      markdownPreviewDisabled: 'Отключено',
      about: 'О Glass notes',
      aboutinfo: 'Это приложение основано на платформе TAURI, разработано с помощью ИИ. Все пользовательские данные хранятся локально в автономном режиме, информация не передается.<br>Контакты: pinyinzhenhao@aliyun.com'
    },
    fr: {
      shortcut: 'Raccourci clavier pour ouvrir l\'interface',
      record: 'Réinitialiser le raccourci',
      apply: 'Appliquer',
      language: 'Langue',
      chinese: 'Chinois',
      english: 'Anglais',
      spanish: 'Espagnol',
      japanese: 'Japonais',
      korean: 'Coréen',
      french: 'Français',
      german: 'Allemand',
      russian: 'Русский',
      shortcutHint: 'Cliquez sur "Réinitialiser le raccourci", puis appuyez sur la nouvelle combinaison et cliquez sur "Appliquer"',
      pressShortcut: 'Appuyez sur une nouvelle combinaison de touches...',
      shortcutFailed: 'Échec de la configuration du raccourci, veuillez réessayer',
      noteShortcutLabel:'Raccourci pour de nouvelles notes autocollantes',
      exportNote: 'Exporter la note',
      exportSuccess: 'Note exportée avec succès !',
      exportFailed: 'Échec de l\'exportation de la note, veuillez réessayer',
      autoStart: 'Démarrage automatique',
      autoStartEnabled: 'Activé',
      autoStartDisabled: 'Désactivé',
      markdownPreview: 'Aperçu Markdown',
      markdownPreviewEnabled: 'Activé',
      markdownPreviewDisabled: 'Désactivé',
      about: 'À propos de Glass notes',
      aboutinfo: 'Cette application est basée sur la plateforme TAURI, développée avec l\'aide de l\'IA. Toutes les données utilisateur sont stockées localement hors ligne, aucune information n\'est transmise.<br>Contact : pinyinzhenhao@aliyun.com'
    },
    de: {
      shortcut: 'Tastenkürzel zum Aufrufen der Benutzeroberfläche',
      record: 'Tastenkürzel zurücksetzen',
      apply: 'Übernehmen',
      language: 'Sprache',
      chinese: 'Chinesisch',
      english: 'Englisch',
      spanish: 'Spanisch',
      japanese: 'Japanisch',
      korean: 'Koreanisch',
      french: 'Französisch',
      german: 'Deutsch',
      russian: 'Russisch',
      shortcutHint: 'Klicken Sie auf "Tastenkürzel zurücksetzen", drücken Sie dann die neue Tastenkombination und klicken Sie auf "Übernehmen"',
      pressShortcut: 'Neue Tastenkombination drücken...',
      shortcutFailed: 'Fehler beim Festlegen der Tastenkombination, bitte versuchen Sie es erneut',
      noteShortcutLabel:'Tastenkürzel für neue Haftnotizen',
      exportNote: 'Notiz exportieren',
      exportSuccess: 'Notiz erfolgreich exportiert!',
      exportFailed: 'Export der Notiz fehlgeschlagen, bitte versuchen Sie es erneut',
      autoStart: 'Autostart',
      autoStartEnabled: 'Aktiviert',
      autoStartDisabled: 'Deaktiviert',
      markdownPreview: 'Markdown-Vorschau',
      markdownPreviewEnabled: 'Aktiviert',
      markdownPreviewDisabled: 'Deaktiviert',
      about: 'Über Glass notes',
      aboutinfo: 'Diese Anwendung basiert auf der TAURI-Plattform und wurde mit KI-Unterstützung erstellt. Alle Benutzerdaten werden lokal offline gespeichert, es erfolgt keine Übermittlung von Informationen nach außen. Hierwith wird dies ausdrücklich erklärt. <br>Kontakt: pinyinzhenhao@aliyun.com'
    }
  // ... 其他语言保持不变
};

// 更新界面语言
export function updateUILanguage() {
  const lang = langText[currentLang];
  document.getElementById('shortcut-label').textContent = lang.shortcut;
  document.getElementById('record-shortcut').textContent = lang.record;
  document.getElementById('apply-shortcut').textContent = lang.apply;
  document.getElementById('language-label').textContent = lang.language;
  document.querySelectorAll('.hint').forEach(el => 
    el.textContent = lang.shortcutHint || 'Click "Reset Shortcut", then press new shortcut combination, and click "Apply"'
  );
  document.getElementById('markdown-preview-label').textContent = lang.markdownPreview;
  document.getElementById('about-title').textContent = lang.about;
  document.getElementById('note-shortcut-label').textContent = lang.noteShortcutLabel;
  document.getElementById('record-note-shortcut').textContent = lang.record;
  document.getElementById('apply-note-shortcut').textContent = lang.apply;
  updateMDpreviewLabel();
  updateAutoStartLabel();
}

// 更新自启动标签
export function updateAutoStartLabel() {
  const lang = langText[currentLang];
  const autoStartLabel = document.getElementById('auto-start-label');
  const autoStartSwitch = document.getElementById('auto-start-switch');
  autoStartLabel.textContent = `${lang.autoStart}: ${autoStartSwitch.checked ? lang.autoStartEnabled : lang.autoStartDisabled}`;
}
export function updateMDpreviewLabel() {
  const lang = langText[currentLang];
  const MDpreviewLabel = document.getElementById('markdown-preview-label');
  const MDpreviewSwitch = document.getElementById('markdown-preview-switch');
  MDpreviewLabel.textContent = `${lang.markdownPreview}: ${MDpreviewSwitch.checked ? lang.markdownPreviewEnabled : lang.markdownPreviewDisabled}`;
}