import { updateUILanguage, updateAutoStartLabel, currentLang, langText } from './language.js';
import MarkdownRenderer from './markdown.js';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

// 便签数据存储
let notes = [];
let currentColor = '#ffff88'; // 默认黄色

// 创建新便签
export function createNote() {
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

  // 创建编辑和预览容器
  const editorContainer = document.createElement('div');
  editorContainer.style.display = 'flex';
  editorContainer.style.width = '100%';
  editorContainer.style.height = '100%';
  editorContainer.style.position = 'relative';

  // 添加Markdown编辑区域
  const textarea = document.createElement('textarea');
  textarea.style.width = '50%';
  textarea.style.height = '100%';
  textarea.style.border = 'none';
  textarea.style.background = 'transparent';
  textarea.style.resize = 'none';
  textarea.style.pointerEvents = 'auto';
  textarea.style.display = 'block';
  textarea.style.padding = '10px';

  // 添加HTML预览区域
  const preview = document.createElement('div');
  preview.className = 'markdown-preview';
  preview.style.width = '50%';
  preview.style.height = '100%';
  preview.style.overflow = 'auto';
  preview.style.padding = '10px';
  preview.style.borderLeft = '1px solid #ddd';

  // 根据预览开关状态初始化布局
  const isPreviewEnabled = localStorage.getItem('markdownPreviewEnabled') === 'true';
  preview.style.display = isPreviewEnabled ? 'block' : 'none';
  textarea.style.width = isPreviewEnabled ? '50%' : '100%';

  // 初始化Markdown渲染器
  const markdownRenderer = new MarkdownRenderer(textarea, preview);

  // 实时Markdown解析
  textarea.addEventListener('input', () => {
    markdownRenderer.scheduleRender();
    saveNotes();
  });

  editorContainer.appendChild(textarea);
  editorContainer.appendChild(preview);
  contentContainer.appendChild(editorContainer);
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
export function showContextMenu(note, x, y) {
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
  exportItem.textContent = langText[currentLang].exportNote;
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
export async function exportNote(note) {
  try {
    const content = note.querySelector('textarea').value;
    const filePath = await save({
      filters: [{
        name: 'Text',
        extensions: ['txt']
      }]
    });
    if (filePath) {
      await writeTextFile(filePath, content);
      alert(langText[currentLang].exportSuccess);
    }
  } catch (error) {
    console.error('导出失败:', error);
    alert(langText[currentLang].exportFailed);
  }
}

// 使元素可拖动
export function makeDraggable(element) {
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
export function saveNotes() {
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
export function loadNotes() {
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
