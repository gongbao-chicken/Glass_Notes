// 导入模块
import MarkdownRenderer from './markdown.js';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { langText, updateUILanguage, updateAutoStartLabel, currentLang, setCurrentLang,updateMDpreviewLabel } from './language.js';
import { createNote, loadNotes } from './notefunc.js';




// 设置面板交互
function initSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const recordBtn = document.getElementById('record-shortcut');
  const currentShortcut = document.getElementById('current-shortcut');

  // 初始化界面语言
  updateUILanguage();
  // 自启动开关
  const autoStartSwitch = document.getElementById('auto-start-switch');
  autoStartSwitch.addEventListener('change', async (e) => {
    try {
      if (e.target.checked) {
        await enable();
      } else {
        await disable();
      }
      updateAutoStartLabel(e.target.checked);
    } catch (err) {
      console.error('Failed to update auto start:', err);
      autoStartSwitch.checked = !e.target.checked;
    }
  });

  // 语言切换事件
  document.getElementById('lang-zh').addEventListener('click', () => {
    setCurrentLang('zh');
    updateUILanguage();
  });

  document.getElementById('lang-en').addEventListener('click', () => {
    setCurrentLang ('en');
    updateUILanguage();
  });

  document.getElementById('lang-es').addEventListener('click', () => {
    setCurrentLang ('es');
    updateUILanguage();
  });

  document.getElementById('lang-ja').addEventListener('click', () => {
    setCurrentLang ('ja');
    updateUILanguage();
  });

  document.getElementById('lang-ko').addEventListener('click', () => {
    setCurrentLang ('ko');
    updateUILanguage();
  });

  document.getElementById('lang-ru').addEventListener('click', () => {
    setCurrentLang ('ru');
    updateUILanguage();
  });

  document.getElementById('lang-fr').addEventListener('click', () => {
    setCurrentLang ('fr');
    updateUILanguage();
  });

  document.getElementById('lang-de').addEventListener('click', () => {
    setCurrentLang ('de');
    updateUILanguage();
  });

  if (settingsBtn && settingsPanel && recordBtn && currentShortcut) {
    // 确保按钮可点击
    settingsBtn.style.pointerEvents = 'auto';
    settingsBtn.style.zIndex = '1000';
    
    // 初始化关于链接
    const aboutLink = document.getElementById('about-title');
    aboutLink.textContent = langText[currentLang].about;

    // Markdown预览开关事件
    const markdownPreviewSwitch = document.getElementById('markdown-preview-switch');
    const isPreviewEnabled = localStorage.getItem('markdownPreviewEnabled') === 'true';
    markdownPreviewSwitch.checked = isPreviewEnabled;

    markdownPreviewSwitch.addEventListener('change', (e) => {
      localStorage.setItem('markdownPreviewEnabled', e.target.checked);
      document.querySelectorAll('.note').forEach(note => {
        const preview = note.querySelector('.markdown-preview');
        const textarea = note.querySelector('textarea');
        preview.style.display = e.target.checked ? 'block' : 'none';
        textarea.style.width = e.target.checked ? '50%' : '100%';
      });
      updateMDpreviewLabel(e.target.checked)
    });
    
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

    // 应用呼出窗口快捷键
    applyBtn.addEventListener('click', () => {
      if (pendingShortcut) {
        try {
          window.__TAURI__.core.invoke('update_shortcut', { newShortcut: pendingShortcut });
          applyBtn.disabled = true;
          pendingShortcut = null;
        } catch (err) {
          console.error('Failed to update shortcut:', err);
          currentShortcut.textContent = '设置失败，请重试';
          applyBtn.disabled = true;
        }
      }
    });

    // 新建便签快捷键设置
    const noteRecordBtn = document.getElementById('record-note-shortcut');
    const noteApplyBtn = document.getElementById('apply-note-shortcut');
    const currentNoteShortcut = document.getElementById('current-note-shortcut');
    let notePendingShortcut = null;

    if (noteRecordBtn && noteApplyBtn && currentNoteShortcut) {
      noteRecordBtn.addEventListener('click', () => {
        isRecording = true;
        currentNoteShortcut.textContent = langText[currentLang].pressShortcut || '按下新的快捷键...';
        noteApplyBtn.disabled = true;
        document.addEventListener('keydown', handleNoteShortcutKeyDown);
      });

      const handleNoteShortcutKeyDown = (e) => {
        if (isRecording) {
          e.preventDefault();
          e.stopPropagation();
          
          if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
            return;
          }
          
          notePendingShortcut = {
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey,
            key: e.code
          };
          
          // 更新显示
          const keys = [];
          if (notePendingShortcut.ctrl) keys.push('Ctrl');
          if (notePendingShortcut.alt) keys.push('Alt');
          if (notePendingShortcut.shift) keys.push('Shift');
          keys.push(notePendingShortcut.key.toUpperCase());
          currentNoteShortcut.textContent = keys.join('+');
          
          isRecording = false;
          noteApplyBtn.disabled = false;
          document.removeEventListener('keydown', handleNoteShortcutKeyDown);
        }
      };

      noteApplyBtn.addEventListener('click', () => {
        if (notePendingShortcut) {
          try {
            localStorage.setItem('noteShortcut', JSON.stringify(notePendingShortcut));
            noteApplyBtn.disabled = true;
            notePendingShortcut = null;
          } catch (err) {
            console.error('Failed to update note shortcut:', err);
            currentNoteShortcut.textContent = '设置失败，请重试';
            noteApplyBtn.disabled = true;
          }
        }
      });

      // 初始化显示
      const savedNoteShortcut = JSON.parse(localStorage.getItem('noteShortcut') || '{"ctrl":true,"key":"n"}');
      const keys = [];
      if (savedNoteShortcut.ctrl) keys.push('Ctrl');
      if (savedNoteShortcut.alt) keys.push('Alt');
      if (savedNoteShortcut.shift) keys.push('Shift');
      keys.push(savedNoteShortcut.key.toUpperCase());
      currentNoteShortcut.textContent = keys.join('+');
      
    }
  }
}

// 初始化
window.addEventListener("DOMContentLoaded", async () => {
  // 初始化设置面板
  initSettings();
  // 关于窗口逻辑
  const aboutLink = document.getElementById('about-title');
  const aboutModal = document.getElementById('about-modal');
  const closeBtn = document.querySelector('.close');
  
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = langText[currentLang];
    aboutLink.textContent = lang.about;
    document.getElementById('about-Glassnotes').textContent = lang.about;
    document.getElementById('about-content').innerHTML = `
      <p>${lang.aboutinfo}</p>
    `;
    aboutModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    aboutModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.style.display = 'none';
    }
  });

  // 初始化自启动状态
  const autoStartSwitch = document.getElementById('auto-start-switch');
  
  try {
    const isAutoStartEnabled = await enable();
    autoStartSwitch.checked = isAutoStartEnabled;
    updateAutoStartLabel();
  } catch (err) {
    console.error('Failed to get auto start status:', err);
  }

  // 创建主容器
  const container = document.createElement('div');
  container.id = 'notes-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'auto';
  container.style.zIndex = '0';
  document.body.appendChild(container);

  // 添加快捷键监听
  document.addEventListener('keydown', (e) => {
    // 处理新建便签快捷键
    const noteShortcut = JSON.parse(localStorage.getItem('noteShortcut') || '{"ctrl":true,"alt":false,"shift":false,"key":"n"}');
    if (e.ctrlKey === noteShortcut.ctrl &&
        e.altKey === noteShortcut.alt &&
        e.shiftKey === noteShortcut.shift &&
        e.code.toLowerCase() === noteShortcut.key.toLowerCase()) {
      createNote();
    }
  });

  // 加载保存的便签
  loadNotes();
});
