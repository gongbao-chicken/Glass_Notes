import { currentLang, langText } from './language.js';
import BlockEditor from './markdown.js';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

// 便签数据存储
let currentColor = '#ffff88'; // 默认黄色

// 新建便签快捷键的默认配置（key 为 e.code 键名，读取处共用这一份定义）
export const DEFAULT_NOTE_SHORTCUT = { ctrl: true, alt: false, shift: false, meta: false, key: 'KeyN' };

// 读取新建便签快捷键，容错旧格式或损坏的存储数据
export function loadNoteShortcut() {
  try {
    const saved = JSON.parse(localStorage.getItem('noteShortcut') || 'null');
    if (!saved || typeof saved.key !== 'string') return { ...DEFAULT_NOTE_SHORTCUT };
    return {
      ctrl: !!saved.ctrl,
      alt: !!saved.alt,
      shift: !!saved.shift,
      meta: !!saved.meta,
      key: saved.key
    };
  } catch (err) {
    console.error('Failed to parse note shortcut:', err);
    return { ...DEFAULT_NOTE_SHORTCUT };
  }
}

// 防抖保存：缩放等高频事件只在停下来之后写一次存储
let saveTimer = null;
export function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveNotes();
  }, 200);
}

// 计算新便签的初始位置：按已有数量级联偏移，保证不超出屏幕
function initialPosition() {
  const count = document.querySelectorAll('.note').length;
  const offset = 40 + (count % 8) * 30;
  return {
    top: Math.min(offset, Math.max(0, window.innerHeight - 220)),
    left: Math.min(offset + 120, Math.max(0, window.innerWidth - 240))
  };
}

// 恢复便签时把坐标夹在当前视口内，避免分辨率/显示器变化后便签跑到屏幕外不可见
function clampPosition(top, left) {
  const maxTop = Math.max(0, window.innerHeight - 80);
  const maxLeft = Math.max(0, window.innerWidth - 80);
  const t = parseFloat(top);
  const l = parseFloat(left);
  return {
    top: isFinite(t) ? Math.min(Math.max(t, 0), maxTop) : null,
    left: isFinite(l) ? Math.min(Math.max(l, 0), maxLeft) : null
  };
}

// 创建新便签；传入 noteData 时按保存的数据恢复。
// persist=false 供批量加载使用，跳过逐条写存储，避免加载中途用未回填的 DOM 覆写掉已保存的便签
export function createNote(noteData = null, { persist = true } = {}) {
  const note = document.createElement('div');
  note.className = 'note';
  note.style.backgroundColor = currentColor;
  note.style.position = 'absolute';
  const initPos = initialPosition();
  note.style.top = `${initPos.top}px`;
  note.style.left = `${initPos.left}px`;
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

  // 分块 Markdown 编辑器（所见即所得）：聚焦块显示原文，其余块实时渲染
  const editorHost = document.createElement('div');
  editorHost.className = 'md-editor';
  contentContainer.appendChild(editorHost);
  note.appendChild(contentContainer);

  // CSS resize 不触发任何事件，用 ResizeObserver 监听缩放并防抖保存尺寸
  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => scheduleSave());
    resizeObserver.observe(note);
  }

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
    // 删除按钮紧贴拖拽热区，无确认的即时删除曾导致误删丢数据
    if (!confirm(langText[currentLang].deleteConfirm)) return;
    note.remove();
    if (resizeObserver) resizeObserver.unobserve(note);
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

  // 按保存的数据恢复颜色、位置和尺寸
  if (noteData) {
    const color = noteData.color || currentColor;
    note.style.backgroundColor = color;
    currentColor = color;
    const pos = clampPosition(noteData.top, noteData.left);
    if (pos.top !== null) note.style.top = `${pos.top}px`;
    if (pos.left !== null) note.style.left = `${pos.left}px`;
    if (noteData.width) note.style.width = noteData.width;
    if (noteData.height) note.style.height = noteData.height;
  }

  // 构建编辑器（传入 noteData 时按保存的内容恢复，仍是 markdown 字符串）
  const initialContent =
    noteData && typeof noteData.content === 'string' ? noteData.content : '';
  const editor = new BlockEditor(editorHost, initialContent, { onInput: () => saveNotes() });
  note.__editor = editor;

  // 添加到容器
  document.getElementById('notes-container').appendChild(note);
  if (!noteData) editor.focusFirstBlock();
  if (persist) saveNotes();
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
    const content = note.__editor ? note.__editor.getContent() : '';
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
      content: note.__editor ? note.__editor.getContent() : '',
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
  let savedNotes = [];
  try {
    savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
  } catch (err) {
    console.error('Failed to parse saved notes:', err);
  }
  if (!Array.isArray(savedNotes)) savedNotes = [];
  // 批量恢复期间不逐条写存储，全部回填完成后再完整保存一次
  savedNotes.forEach(noteData => createNote(noteData, { persist: false }));
  if (savedNotes.length > 0) saveNotes();
}
