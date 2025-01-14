
// 设置面板交互
function initSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const recordBtn = document.getElementById('record-shortcut');
  const currentShortcut = document.getElementById('current-shortcut');

  if (settingsBtn && settingsPanel && recordBtn && currentShortcut) {
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
      currentShortcut.textContent = '按下新的快捷键...';
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
      currentShortcut.textContent = '按下新的快捷键...';
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
  
  // 添加内容编辑区域
  const textarea = document.createElement('textarea');
  textarea.style.width = '100%';
  textarea.style.height = '100%';
  textarea.style.border = 'none';
  textarea.style.background = 'transparent';
  textarea.style.resize = 'both';
  textarea.style.pointerEvents='auto';
  note.appendChild(textarea);

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

  // 添加到容器
  document.getElementById('notes-container').appendChild(note);
  saveNotes();
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
