// 导入模块
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { langText, updateUILanguage, updateAutoStartLabel, currentLang, setCurrentLang } from './language.js';
import { createNote, loadNotes, loadNoteShortcut } from './notefunc.js';

// Mac 的 Command 键和 Windows 的 Win 键都映射到 e.metaKey
const IS_MAC = /Mac/i.test(navigator.userAgent);
const META_LABEL = IS_MAC ? 'Cmd' : 'Win';

// 把 e.code 格式化成可读键名（KeyN -> N、Digit1 -> 1，其余原样）
function formatKeyCode(code) {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
}

// 快捷键对象的统一显示格式
function formatShortcut(sc) {
  const keys = [];
  if (sc.ctrl) keys.push('Ctrl');
  if (sc.alt) keys.push('Alt');
  if (sc.shift) keys.push('Shift');
  if (sc.meta) keys.push(META_LABEL);
  keys.push(formatKeyCode(sc.key));
  return keys.join('+');
}




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

    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
    });

    // 背景模糊档位（仅 macOS 可调：Windows 亚克力是系统固定效果，无强度参数）
    const blurItem = document.getElementById('blur-level-item');
    if (!IS_MAC) {
      blurItem.style.display = 'none';
    } else {
      const blurButtons = document.querySelectorAll('#blur-level-item .blur-level-buttons button');
      const savedBlurLevel = () => {
        const v = parseInt(localStorage.getItem('blurLevel'), 10);
        return [0, 1, 2].includes(v) ? v : 1;
      };
      const applyBlurLevel = async (level) => {
        try {
          await window.__TAURI__.core.invoke('set_blur_level', { level });
          localStorage.setItem('blurLevel', String(level));
          blurButtons.forEach(btn =>
            btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === level));
        } catch (err) {
          console.error('Failed to set blur level:', err);
        }
      };
      blurButtons.forEach(btn => {
        btn.addEventListener('click', () => applyBlurLevel(parseInt(btn.dataset.level, 10)));
      });
      // 启动时应用保存的档位（Rust 侧初始化用的是默认液态玻璃档）
      applyBlurLevel(savedBlurLevel());
    }

    // 快捷键记录状态
    let isRecording = false;

    const applyBtn = document.getElementById('apply-shortcut');
    let pendingShortcut = null;

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
          meta: e.metaKey,
          key: keyName
        };

        // 更新显示
        currentShortcut.textContent = formatShortcut(pendingShortcut);
        
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

    // 应用呼出窗口快捷键（invoke 返回 Promise，必须 await 才能捕获 Rust 侧错误）
    applyBtn.addEventListener('click', async () => {
      if (pendingShortcut) {
        applyBtn.disabled = true;
        try {
          await window.__TAURI__.core.invoke('update_shortcut', { newShortcut: pendingShortcut });
          pendingShortcut = null;
        } catch (err) {
          console.error('Failed to update shortcut:', err);
          currentShortcut.textContent = langText[currentLang].shortcutFailed;
          applyBtn.disabled = false;
        }
      }
    });

    // 新建便签快捷键设置
    const noteRecordBtn = document.getElementById('record-note-shortcut');
    const noteApplyBtn = document.getElementById('apply-note-shortcut');
    const currentNoteShortcut = document.getElementById('current-note-shortcut');
    let notePendingShortcut = null;

    if (noteRecordBtn && noteApplyBtn && currentNoteShortcut) {
      // 独立的录制状态标志，避免与呼出窗口快捷键的录制互相干扰
      let isNoteRecording = false;
      noteRecordBtn.addEventListener('click', () => {
        isNoteRecording = true;
        currentNoteShortcut.textContent = langText[currentLang].pressShortcut || '按下新的快捷键...';
        noteApplyBtn.disabled = true;
        document.addEventListener('keydown', handleNoteShortcutKeyDown);
      });

      const handleNoteShortcutKeyDown = (e) => {
        if (isNoteRecording) {
          e.preventDefault();
          e.stopPropagation();
          
          if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
            return;
          }
          
          notePendingShortcut = {
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey,
            meta: e.metaKey,
            key: e.code
          };

          // 更新显示
          currentNoteShortcut.textContent = formatShortcut(notePendingShortcut);

          isNoteRecording = false;
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
      const savedNoteShortcut = loadNoteShortcut();
      currentNoteShortcut.textContent = formatShortcut(savedNoteShortcut);
      
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
    // 用 isEnabled 查询状态；enable 是"开启自启动"，误用会在每次启动时强行打开它
    const isAutoStartEnabled = await isEnabled();
    autoStartSwitch.checked = isAutoStartEnabled === true;
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
    // 处理新建便签快捷键（容错读取，损坏的存储数据不能让整个监听器失效）
    const noteShortcut = loadNoteShortcut();
    if (e.ctrlKey === noteShortcut.ctrl &&
        e.altKey === noteShortcut.alt &&
        e.shiftKey === noteShortcut.shift &&
        e.metaKey === noteShortcut.meta &&
        e.code.toLowerCase() === noteShortcut.key.toLowerCase()) {
      createNote();
    }
  });

  // 加载保存的便签
  loadNotes();
});
