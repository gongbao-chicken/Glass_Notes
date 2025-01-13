// 设置面板交互
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const blurRange = document.getElementById('blur-range');

settingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
});

blurRange.addEventListener('input', (e) => {
  document.body.style.backdropFilter = `blur(${e.target.value}px)`;
});

// 便签数据存储
let notes = [];
let currentColor = '#ffff88'; // 默认黄色

// 初始化
window.addEventListener("DOMContentLoaded", () => {
  // 创建主容器
  const container = document.createElement('div');
  container.id = 'notes-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
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
  note.style.width = '200px';
  note.style.height = '200px';
  note.style.padding = '10px';
  note.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
  note.style.pointerEvents = 'auto';
  note.style.resize = 'both';
  note.style.overflow = 'auto';
  
  // 添加内容编辑区域
  const textarea = document.createElement('textarea');
  textarea.style.width = '100%';
  textarea.style.height = '100%';
  textarea.style.border = 'none';
  textarea.style.background = 'transparent';
  textarea.style.resize = 'none';
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
  colorPicker.style.bottom = '0';
  colorPicker.style.right = '0';
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
  element.onmousedown = dragMouseDown;

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
