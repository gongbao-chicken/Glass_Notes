
// 导入marked
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// 语言设置
let currentLang = localStorage.getItem('sticky-notes-lang') || 'zh';

// 语言文本
  const langText = {
    zh: {
      shortcut: '快捷键',
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
      shortcutFailed: '设置失败，请重试'
    },
  en: {
    shortcut: 'Shortcut',
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
    shortcutFailed: 'Failed to set shortcut, please try again'
  },
    es: {
      shortcut: 'Atajo',
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
      shortcutFailed: 'Error al configurar el atajo, intente nuevamente'
    },
  ja: {
    shortcut: 'ショートカット',
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
    shortcutFailed: 'ショートカットの設定に失敗しました。もう一度お試しください'
  },
    ko: {
      shortcut: '단축키',
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
      shortcutFailed: '단축키 설정에 실패했습니다. 다시 시도해 주세요'
    },
    ru: {
      shortcut: 'Горячая клавиша',
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
      shortcutFailed: 'Не удалось установить сочетание клавиш, попробуйте снова'
    },
    fr: {
      shortcut: 'Raccourci',
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
      russian: 'Russe',
      shortcutHint: 'Cliquez sur "Réinitialiser le raccourci", puis appuyez sur la nouvelle combinaison et cliquez sur "Appliquer"',
      pressShortcut: 'Appuyez sur une nouvelle combinaison de touches...',
      shortcutFailed: 'Échec de la configuration du raccourci, veuillez réessayer'
    },
  de: {
    shortcut: 'Tastenkürzel',
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
    shortcutFailed: 'Fehler beim Festlegen der Tastenkombination, bitte versuchen Sie es erneut'
  }
};

// 更新界面语言
function updateUILanguage() {
  const lang = langText[currentLang];
  document.getElementById('shortcut-label').textContent = lang.shortcut;
  document.getElementById('record-shortcut').textContent = lang.record;
  document.getElementById('apply-shortcut').textContent = lang.apply;
  document.getElementById('language-label').textContent = lang.language;
  document.querySelector('.hint').textContent = lang.shortcutHint || 'Click "Reset Shortcut", then press new shortcut combination, and click "Apply"';
}

// 设置面板交互
function initSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const recordBtn = document.getElementById('record-shortcut');
  const currentShortcut = document.getElementById('current-shortcut');

  // 初始化界面语言
  updateUILanguage();

  // 语言切换事件
  document.getElementById('lang-zh').addEventListener('click', () => {
    currentLang = 'zh';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-en').addEventListener('click', () => {
    currentLang = 'en';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-es').addEventListener('click', () => {
    currentLang = 'es';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-ja').addEventListener('click', () => {
    currentLang = 'ja';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-ko').addEventListener('click', () => {
    currentLang = 'ko';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-ru').addEventListener('click', () => {
    currentLang = 'ru';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-fr').addEventListener('click', () => {
    currentLang = 'fr';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  document.getElementById('lang-de').addEventListener('click', () => {
    currentLang = 'de';
    localStorage.setItem('sticky-notes-lang', currentLang);
    updateUILanguage();
  });

  if (settingsBtn && settingsPanel && recordBtn && currentShortcut) {
    // 确保语言切换按钮可点击
    document.getElementById('lang-zh').style.pointerEvents = 'auto';
    document.getElementById('lang-en').style.pointerEvents = 'auto';
    // 确保按钮可点击
    settingsBtn.style.pointerEvents = 'auto';
    settingsBtn.style.zIndex = '1000';
    
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
    });

    // 快捷键记录状态
    let isRecording = false;
    let newShortcut = {
      ctrl: false,
      alt: false,
      shift: false,
      key: null
    };

    const applyBtn = document.getElementById('apply-shortcut');
    let pendingShortcut = null;

    recordBtn.addEventListener('click', () => {
      isRecording = true;
      currentShortcut.textContent = langText[currentLang].pressShortcut || '按下新的快捷键...';
      applyBtn.disabled = true;
    });

    // 捕获快捷键
    const handleKeyDown = (e) => {
      if (isRecording) {
        e.preventDefault();
        e.stopPropagation();
        
        // 只处理非修饰键
        if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
          return;
        }
        let keyName = e.code;
        pendingShortcut = {
          ctrl: e.ctrlKey,
          alt: e.altKey,
          shift: e.shiftKey,
          key: keyName
        };
        
        // 更新显示
        const keys = [];
        if (pendingShortcut.ctrl) keys.push('Ctrl');
        if (pendingShortcut.alt) keys.push('Alt');
        if (pendingShortcut.shift) keys.push('Shift');
        keys.push(keyName.toUpperCase());
        currentShortcut.textContent = keys.join('+');
        
        isRecording = false;
        applyBtn.disabled = false;
        
        // 移除事件监听器
        document.removeEventListener('keydown', handleKeyDown);
      }
    };

    recordBtn.addEventListener('click', () => {
      isRecording = true;
      currentShortcut.textContent = langText[currentLang].pressShortcut || '按下新的快捷键...';
      applyBtn.disabled = true;
      document.addEventListener('keydown', handleKeyDown);
    });

    // 应用快捷键
    applyBtn.addEventListener('click', () => {
      if (pendingShortcut) {
        try {
          window.__TAURI__.core.invoke('update_shortcut', { newShortcut: pendingShortcut });
            applyBtn.disabled = true;
            pendingShortcut = null;
          } 
         catch (err) {
          console.error('Failed to update shortcut:', err);
          currentShortcut.textContent = '设置失败，请重试';
          applyBtn.disabled = true;
        }
      }
    });
  }
}

// 便签数据存储
let notes = [];
let currentColor = '#ffff88'; // 默认黄色

// 初始化
window.addEventListener("DOMContentLoaded", async () => {
  // 初始化设置面板
  initSettings();
  // 创建主容器
  const container = document.createElement('div');
  container.id = 'notes-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'auto';
  container.style.zIndex = '0'; // 降低z-index确保设置按钮可点击
  document.body.appendChild(container);

  // 添加快捷键监听
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') { // Ctrl+N 新建便签
      createNote();
    }
  });

  // 加载保存的便签
  loadNotes();
});

// 创建新便签
function createNote() {
  const note = document.createElement('div');
  note.className = 'note';
  note.style.backgroundColor = currentColor;
  note.style.position = 'absolute';
  note.style.width = '180px';
  note.style.height = '180px';
  note.style.padding = '10px';
  note.style.pointerEvents = 'auto';
  note.style.resize = 'both';
  note.style.overflow = 'hidden';

  // 创建内容容器
  const contentContainer = document.createElement('div');
  contentContainer.style.width = '100%';
  contentContainer.style.height = '100%';
  contentContainer.style.position = 'relative';

  // 添加Markdown编辑区域
  const textarea = document.createElement('textarea');
  textarea.style.width = '100%';
  textarea.style.height = '100%';
  textarea.style.border = 'none';
  textarea.style.background = 'transparent';
  textarea.style.resize = 'none';
  textarea.style.pointerEvents = 'auto';
  textarea.style.display = 'block';

  // 添加HTML预览区域
  const preview = document.createElement('div');
  preview.className = 'markdown-preview';
  preview.style.width = '100%';
  preview.style.height = '100%';
  preview.style.overflow = 'auto';
  preview.style.display = 'none';
  preview.style.padding = '8px';

  // 添加视图切换按钮
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '预览';
  toggleBtn.style.position = 'absolute';
  toggleBtn.style.bottom = '40px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.zIndex = '100';
  toggleBtn.style.padding = '4px 8px';
  toggleBtn.style.borderRadius = '4px';
  toggleBtn.style.border = '1px solid rgba(0,0,0,0.1)';
  toggleBtn.style.background = 'rgba(255,255,255,0.8)';
  toggleBtn.style.cursor = 'pointer';

  // 视图切换逻辑
  let isPreview = false;
  toggleBtn.addEventListener('click', () => {
    isPreview = !isPreview;
    if (isPreview) {
      textarea.style.display = 'none';
      preview.style.display = 'block';
      preview.innerHTML = marked.parse(textarea.value);
      toggleBtn.textContent = '编辑';
    } else {
      textarea.style.display = 'block';
      preview.style.display = 'none';
      toggleBtn.textContent = '预览';
    }
  });

  // 实时Markdown解析
  textarea.addEventListener('input', () => {
    if (isPreview) {
      preview.innerHTML = marked.parse(textarea.value);
    }
    saveNotes();
  });

  contentContainer.appendChild(textarea);
  contentContainer.appendChild(preview);
  contentContainer.appendChild(toggleBtn);
  note.appendChild(contentContainer);

  // 添加删除按钮
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.style.position = 'absolute';
  deleteBtn.style.top = '0';
  deleteBtn.style.right = '0';
  deleteBtn.style.background = 'transparent';
  deleteBtn.style.border = 'none';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.onclick = () => {
    note.remove();
    saveNotes();
  };
  note.appendChild(deleteBtn);

  // 添加颜色选择器
  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.value = currentColor;
  colorPicker.style.position = 'absolute';
  colorPicker.style.bottom = '10px';
  colorPicker.style.right = '10px';
  colorPicker.onchange = (e) => {
    note.style.backgroundColor = e.target.value;
    currentColor = e.target.value;
    saveNotes();
  };
  note.appendChild(colorPicker);

  // 使便签可拖动
  makeDraggable(note);

  // 添加右键菜单
  note.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(note, e.clientX, e.clientY);
  });

  // 添加到容器
  document.getElementById('notes-container').appendChild(note);
  saveNotes();
}

// 显示右键菜单
function showContextMenu(note, x, y) {
  // 移除已有的菜单
  const existingMenu = document.getElementById('note-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  // 创建菜单
  const menu = document.createElement('div');
  menu.id = 'note-context-menu';
  menu.style.position = 'fixed';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.backgroundColor = '#fff';
  menu.style.border = '1px solid #ccc';
  menu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
  menu.style.zIndex = '10000';

  // 添加导出选项
  const exportItem = document.createElement('div');
  exportItem.textContent = '导出便签';
  exportItem.style.padding = '8px 16px';
  exportItem.style.cursor = 'pointer';
  exportItem.addEventListener('click', () => exportNote(note));
  menu.appendChild(exportItem);

  document.body.appendChild(menu);

  // 点击其他地方关闭菜单
  const closeMenu = () => {
    menu.remove();
    document.removeEventListener('click', closeMenu);
  };
  document.addEventListener('click', closeMenu);
}

// 导出便签
async function exportNote(note) {
  try {
    const content = note.querySelector('textarea').value;
    const filePath = await window.__TAURI__.dialog.save({
      filters: [{
        name: 'Text',
        extensions: ['txt']
      }]
    });

    if (filePath) {
      await window.__TAURI__.fs.writeTextFile({
        path: filePath,
        contents: content
      });
      alert('便签导出成功！');
    }
  } catch (error) {
    console.error('导出失败:', error);
    alert('便签导出失败，请重试');
  }
}

// 使元素可拖动
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = (e)=>{
    const rect = element.getBoundingClientRect();
    const resizAreaSize = 15;
    const isInResizeArea =
      e.clientX > rect.right - resizAreaSize &&
      e.clientY > rect.bottom - resizAreaSize;
    if (!isInResizeArea && e.target === element){
      dragMouseDown(e);
    }
  };
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    saveNotes();
  }
}

// 保存便签
function saveNotes() {
  const notes = [];
  document.querySelectorAll('.note').forEach(note => {
    notes.push({
      content: note.querySelector('textarea').value,
      color: note.style.backgroundColor,
      top: note.style.top,
      left: note.style.left,
      width: note.style.width,
      height: note.style.height
    });
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}

// 加载便签
function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
  savedNotes.forEach(noteData => {
    createNote();
    const note = document.querySelector('.note:last-child');
    note.querySelector('textarea').value = noteData.content;
    note.style.backgroundColor = noteData.color;
    note.style.top = noteData.top;
    note.style.left = noteData.left;
    note.style.width = noteData.width;
    note.style.height = noteData.height;
    currentColor = noteData.color;
  });
}
