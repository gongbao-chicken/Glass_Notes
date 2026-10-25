import { marked } from './marked.esm.js';

// 按空行切块，用行状态机感知三类不能被空行切断的语法：
// 1. 围栏代码块（``` / ~~~ 内部不切）
// 2. 宽松列表（空行两侧都是列表项/其缩进续行 = 同一个列表）
// 3. 连续引用（空行两侧都是 > 行 = 同一个引用块）
function splitBlocks(content) {
  const lines = String(content || '').split('\n');
  const chunks = [];
  let cur = [];
  let inFence = false;
  const isFence = l => /^\s{0,3}(`{3,}|~{3,})/.test(l);
  const isQuote = l => /^\s{0,3}>/.test(l);
  const isListItem = l => /^(\s*)([-*+]|\d+\.)\s/.test(l);
  const isIndented = l => /^( {2,}|\t)/.test(l);
  const lastMeaningful = () => {
    for (let i = cur.length - 1; i >= 0; i--) if (cur[i].trim()) return cur[i];
    return null;
  };
  const nextMeaningful = from => {
    for (let j = from + 1; j < lines.length; j++) if (lines[j].trim()) return lines[j];
    return null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isFence(line)) inFence = !inFence;
    if (!line.trim() && !inFence && cur.some(l => l.trim())) {
      const last = lastMeaningful();
      const next = nextMeaningful(i);
      const keep =
        (last && isQuote(last) && next && isQuote(next)) ||
        (last && (isListItem(last) || isIndented(last)) &&
          next && (isListItem(next) || isIndented(next)));
      if (!keep) {
        chunks.push(cur.join('\n'));
        cur = [];
        continue; // 空行本身不进块
      }
    }
    cur.push(line);
  }
  if (cur.some(l => l.trim())) chunks.push(cur.join('\n'));
  return chunks.map(s => s.replace(/^\n+|\n+$/g, '')).filter(s => s.length > 0);
}

// ---------- 编辑态语法高亮（overlay 层） ----------
// 输入层是纯文本 contenteditable（IME 安全），高亮层在其下方用相同文字
// 渲染样式。规则必须逐字符保留原文（符号淡化但不删除），否则两层错位

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 单遍交替匹配，避免后一条规则命中前一条已保留的符号字符
const INLINE_RE =
  /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(\*[^*\n]+\*)|(_[^_\n]+_)|(~~[^~\n]+~~)|(\[[^\]\n]*\]\([^)\n]+\))/g;

function wrapSym(s) {
  return `<span class="hl-sym">${s}</span>`;
}

function highlightInline(text) {
  return text.replace(INLINE_RE, (m) => {
    if (m.startsWith('`')) {
      return wrapSym('`') + `<span class="hl-code">${m.slice(1, -1)}</span>` + wrapSym('`');
    }
    if (m.startsWith('**') || m.startsWith('__')) {
      const sym = m.slice(0, 2);
      return wrapSym(sym) + `<span class="hl-bold">${m.slice(2, -2)}</span>` + wrapSym(sym);
    }
    if (m.startsWith('~~')) {
      return wrapSym('~~') + `<span class="hl-strike">${m.slice(2, -2)}</span>` + wrapSym('~~');
    }
    if (m.startsWith('*') || m.startsWith('_')) {
      const sym = m[0];
      return wrapSym(sym) + `<span class="hl-ital">${m.slice(1, -1)}</span>` + wrapSym(sym);
    }
    // 链接 [text](url)
    const i = m.indexOf('](');
    const textPart = m.slice(1, i);
    const urlPart = m.slice(i + 2, -1);
    return wrapSym('[') + `<span class="hl-link">${textPart}</span>` +
      wrapSym('](') + `<span class="hl-url">${urlPart}</span>` + wrapSym(')');
  });
}

function highlightLine(line) {
  let m;
  // 标题：符号淡化 + 文字加粗（不改字号，保证两层行高一致）
  if ((m = line.match(/^(#{1,6})(\s+)([\s\S]*)$/))) {
    return wrapSym(m[1] + m[2]) + `<span class="hl-h">${highlightInline(m[3])}</span>`;
  }
  // 引用
  if ((m = line.match(/^(&gt;)(\s*)([\s\S]*)$/))) {
    return wrapSym(m[1] + m[2]) + `<span class="hl-quote">${highlightInline(m[3])}</span>`;
  }
  // 列表标记（含嵌套的缩进），后随待办标记 [ ] / [x]
  if ((m = line.match(/^(\s*)([-*+]|\d+\.)(\s+)/))) {
    let rest = line.slice(m[0].length);
    let taskPrefix = '';
    const tm = rest.match(/^(\[[ xX]\])(\s+)/);
    if (tm) {
      const done = /x/i.test(tm[1]);
      taskPrefix = (done ? `<span class="hl-done">${tm[1]}</span>` : wrapSym(tm[1])) + wrapSym(tm[2]);
      rest = rest.slice(tm[0].length);
    }
    return m[1] + wrapSym(m[2] + m[3]) + taskPrefix + highlightInline(rest);
  }
  return highlightInline(line);
}

function highlightHtml(text) {
  let inFence = false;
  return text.split('\n').map(line => {
    // 围栏代码块：围栏行淡化，内容整体按代码底色显示，不做 markdown 着色
    if (/^\s{0,3}(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      return wrapSym(escapeHtml(line));
    }
    if (inFence) return `<span class="hl-code">${escapeHtml(line)}</span>`;
    return highlightLine(escapeHtml(line));
  }).join('\n');
}

// ---------- 光标工具 ----------

// 光标在块内的纯文本偏移量；不在该元素内返回 null
function getCaretOffset(el) {
  const sel = getSelection();
  if (!sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.startContainer)) return null;
  const pre = range.cloneRange();
  pre.selectNodeContents(el);
  pre.setEnd(range.startContainer, range.startOffset);
  return pre.toString().length;
}

// 把光标设到元素内指定文本偏移（超出则放末尾）
function setCaretOffset(el, offset) {
  const sel = getSelection();
  let remaining = offset;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const len = node.textContent.length;
    if (remaining <= len) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    remaining -= len;
  }
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// 在光标处插入纯文本（不经过 contentEditable 的富文本路径）
function insertTextAtCaret(el, text) {
  const sel = getSelection();
  if (!sel.rangeCount || !el.contains(sel.focusNode)) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

// 点击渲染态块时，按"渲染文本中的位置比例"估算原文中的光标位置
function caretRatioOffset(el, x, y, rawLength) {
  try {
    const pos = document.caretRangeFromPoint(x, y);
    if (!pos || !el.contains(pos.startContainer)) return rawLength;
    const pre = document.createRange();
    pre.selectNodeContents(el);
    pre.setEnd(pos.startContainer, pos.startOffset);
    const renderedLen = pre.toString().length;
    const total = el.textContent.length || 1;
    return Math.round((renderedLen / total) * rawLength);
  } catch (err) {
    return rawLength;
  }
}

// 分块 Markdown 编辑器（所见即所得）：
// 聚焦的块进入编辑态——原文输入层（纯文本，IME 安全）+ 语法高亮层，
// 输入时立即可见加粗/斜体等效果；其余块用 marked 实时渲染。
// 数据始终以块内原文为准，getContent() 拼回字符串，与旧版便签格式完全兼容
export default class BlockEditor {
  constructor(container, content, { onInput } = {}) {
    this.container = container;
    this.onInput = onInput || (() => {});
    this.blocks = [];
    const raws = splitBlocks(content);
    if (raws.length === 0) raws.push('');
    raws.forEach(raw => {
      const block = this.createBlock(raw);
      this.mountBlock(block);
      this.toRendered(block);
    });
  }

  createBlock(raw) {
    const el = document.createElement('div');
    el.className = 'md-block';
    el.tabIndex = -1; // 渲染态可通过点击聚焦进入编辑
    const block = { raw, el, input: null, hl: null, editing: false, pendingCaret: null };
    el.addEventListener('mousedown', (e) => {
      // 渲染态待办勾选：marked 生成的 checkbox 是 disabled 的（不派发鼠标事件），
      // 且设了 pointer-events:none，这里按坐标命中检测对应的方框并切换
      if (!block.editing) {
        const boxes = el.querySelectorAll('input[type="checkbox"]');
        for (const box of boxes) {
          const r = box.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right &&
              e.clientY >= r.top && e.clientY <= r.bottom) {
            e.preventDefault(); // 不让块进入编辑态
            this.toggleCheckbox(block, box);
            return;
          }
        }
      }
      // 记录点击位置对应的原文偏移，切编辑态后还原光标
      block.pendingCaret = caretRatioOffset(el, e.clientX, e.clientY, block.raw.length);
    });
    el.addEventListener('focusin', (e) => {
      if (!block.editing) {
        this.toEditing(block);
        block.input.focus(); // 触发一次嵌套 focusin，走下面 editing 分支
        setCaretOffset(block.input, block.pendingCaret ?? block.raw.length);
      }
      block.pendingCaret = null;
    });
    el.addEventListener('focusout', () => this.scheduleRender(block));
    el.addEventListener('input', () => {
      if (block.editing) {
        block.raw = block.input.textContent;
        this.paintHighlight(block);
        this.onInput();
      }
    });
    el.addEventListener('keydown', (e) => this.onKeyDown(e, block));
    el.addEventListener('paste', (e) => this.onPaste(e, block));
    return block;
  }

  mountBlock(block, afterBlock = null) {
    if (afterBlock) {
      this.blocks.splice(this.indexOf(afterBlock) + 1, 0, block);
      afterBlock.el.after(block.el);
    } else {
      this.blocks.push(block);
      this.container.appendChild(block.el);
    }
  }

  indexOf(block) {
    return this.blocks.indexOf(block);
  }

  removeBlock(block) {
    const i = this.indexOf(block);
    if (i >= 0) this.blocks.splice(i, 1);
    block.el.remove();
  }

  // 切到编辑态：原文输入层 + 高亮层。输入层是纯文本，组词期间只更新
  // 高亮层、绝不重建输入层 DOM，输入法不会被打断
  toEditing(block) {
    if (block.editing) return;
    block.editing = true;
    const el = block.el;
    el.classList.add('md-editing');
    el.innerHTML = '';
    const hl = document.createElement('div');
    hl.className = 'md-hl';
    const input = document.createElement('div');
    input.className = 'md-input';
    input.tabIndex = -1;
    input.contentEditable = 'plaintext-only';
    if (input.contentEditable !== 'plaintext-only') {
      // 旧引擎回退；Enter/粘贴均已接管，富文本的主要入口已封死
      input.contentEditable = 'true';
    }
    el.appendChild(hl);
    el.appendChild(input);
    block.hl = hl;
    block.input = input;
    input.textContent = block.raw;
    this.paintHighlight(block);
  }

  paintHighlight(block) {
    if (block.hl) block.hl.innerHTML = highlightHtml(block.input.textContent);
  }

  toRendered(block) {
    block.editing = false;
    block.input = null;
    block.hl = null;
    const el = block.el;
    el.classList.remove('md-editing');
    el.contentEditable = 'false';
    try {
      // breaks:true 让块内单换行（Shift+Enter）渲染成 <br>，
      // 与编辑态所见一致；否则渲染态会把软换行折叠成空格
      el.innerHTML = marked.parse(block.raw || '', { breaks: true });
    } catch (err) {
      console.error('Failed to render markdown block:', err);
      el.textContent = block.raw;
    }
  }

  // 失焦后稍等再渲染（给块间焦点转移留时间）；空块且非唯一时直接丢弃
  scheduleRender(block) {
    setTimeout(() => {
      if (block.editing && block.el.contains(document.activeElement)) return;
      const raw = block.editing ? block.input.textContent : block.raw;
      if (!raw.trim() && this.blocks.length > 1) {
        this.removeBlock(block);
        this.onInput();
        return;
      }
      if (block.editing) {
        block.raw = raw;
        this.toRendered(block);
      }
    }, 120);
  }

  onKeyDown(e, block) {
    // 输入法组词期间的按键（包括 Enter 确认候选字）一律放行给输入法
    if (e.isComposing) return;
    if (e.key === 'Tab') {
      // 列表内缩进/反缩进：次级条目的入口
      e.preventDefault();
      this.indentCurrentLine(block, e.shiftKey ? -1 : 1);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // 列表行优先续行（同块内换行并带上标记），否则拆块
      if (!this.enterContinueList(block)) this.splitBlock(block);
    } else if (e.key === 'Enter' && e.shiftKey) {
      // 块内软换行：手动插入 \n 文本节点，避免浏览器生成 <br>/<div>
      e.preventDefault();
      insertTextAtCaret(block.input, '\n');
      this.afterEditText(block);
    } else if (e.key === 'Backspace' && getCaretOffset(block.input) === 0) {
      // 光标在块首：与上一块合并（等于删除块间空行）
      if (this.indexOf(block) > 0) {
        e.preventDefault();
        this.mergeIntoPrevious(block);
      }
    }
  }

  // 文本被程序化改动后的统一收尾
  afterEditText(block) {
    block.raw = block.input.textContent;
    this.paintHighlight(block);
    this.onInput();
  }

  // 当前行缩进（dir=1 加两格，dir=-1 去掉最多两格），光标随行移动
  indentCurrentLine(block, dir) {
    const el = block.input;
    const off = getCaretOffset(el);
    if (off === null) return;
    const text = el.textContent;
    const lineStart = text.lastIndexOf('\n', off - 1) + 1;
    let lineEnd = text.indexOf('\n', off);
    if (lineEnd === -1) lineEnd = text.length;
    let insert = '  ';
    let remove = 0;
    if (dir < 0) {
      const lead = text.slice(lineStart, Math.min(lineStart + 2, lineEnd));
      remove = lead.match(/^ {1,2}/) ? lead.match(/^ {1,2}/)[0].length : 0;
      if (remove === 0) return;
      insert = '';
    }
    el.textContent = text.slice(0, lineStart) + insert + text.slice(lineStart + remove);
    setCaretOffset(el, off - remove + insert.length);
    this.afterEditText(block);
  }

  // 列表行内回车：同块内换到新行并延续标记（有序列表自动编号、待办续 [ ]）。
  // 空标记项回车 = 退出列表（清掉标记行）。返回 false 表示当前行不是列表
  enterContinueList(block) {
    const el = block.input;
    const off = getCaretOffset(el);
    if (off === null) return false;
    const text = el.textContent;
    const lineStart = text.lastIndexOf('\n', off - 1) + 1;
    let lineEnd = text.indexOf('\n', off);
    if (lineEnd === -1) lineEnd = text.length;
    const line = text.slice(lineStart, lineEnd);
    const m = line.match(/^(\s*)([-*+]|\d+\.)(\s+)(\[[ xX]\]\s+)?/);
    if (!m) return false;
    // 只剩标记本身：回车退出列表
    if (line === m[0]) {
      el.textContent = text.slice(0, lineStart) + text.slice(lineEnd);
      setCaretOffset(el, lineStart);
      this.afterEditText(block);
      return true;
    }
    let marker = m[2];
    const om = marker.match(/^(\d+)\.$/);
    if (om) marker = `${parseInt(om[1], 10) + 1}.`;
    const prefix = m[1] + marker + m[3] + (m[4] ? '[ ] ' : '');
    el.textContent = text.slice(0, off) + '\n' + prefix + text.slice(off);
    setCaretOffset(el, off + 1 + prefix.length);
    this.afterEditText(block);
    return true;
  }

  // 渲染态点击待办方框：把 raw 里对应的 [ ]/[x] 反转后重渲染并保存
  toggleCheckbox(block, box) {
    const boxes = block.el.querySelectorAll('input[type="checkbox"]');
    const idx = Array.prototype.indexOf.call(boxes, box);
    if (idx < 0) return;
    let seen = -1;
    const next = block.raw.replace(
      /(^|\n)(\s*)([-*+]|\d+\.)\s+\[([ xX])\]/g,
      (whole, nl, indent, marker, state) => {
        seen++;
        if (seen !== idx) return whole;
        return `${nl}${indent}${marker} ${state === ' ' ? '[x]' : '[ ]'}`;
      }
    );
    block.raw = next;
    this.toRendered(block);
    this.onInput();
  }

  // Enter：在光标处切块，前半留在当前块，后半进新块并聚焦
  splitBlock(block) {
    const offset = getCaretOffset(block.input);
    if (offset === null) return;
    const raw = block.input.textContent;
    const before = raw.slice(0, offset);
    const after = raw.slice(offset);
    block.raw = before;
    block.input.textContent = before;
    this.paintHighlight(block);
    const nb = this.createBlock(after);
    this.mountBlock(nb, block);
    this.toEditing(nb);
    nb.input.focus();
    setCaretOffset(nb.input, 0);
    this.onInput();
  }

  mergeIntoPrevious(block) {
    const i = this.indexOf(block);
    if (i <= 0) return;
    const prev = this.blocks[i - 1];
    const prevRaw = prev.editing ? prev.input.textContent : prev.raw;
    const curRaw = block.editing ? block.input.textContent : block.raw;
    const caretAt = prevRaw.length;
    const merged = prevRaw + curRaw;
    this.toEditing(prev);
    prev.input.textContent = merged;
    prev.raw = merged;
    this.paintHighlight(prev);
    this.removeBlock(block);
    prev.input.focus();
    setCaretOffset(prev.input, caretAt);
    this.onInput();
  }

  onPaste(e, block) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (!text) return;
    // 整段按空行拆块：第一段插入当前块光标处，其余依次挂为渲染块
    const pieces = splitBlocks(text);
    if (pieces.length <= 1) {
      insertTextAtCaret(block.input, text);
      block.raw = block.input.textContent;
      this.paintHighlight(block);
      this.onInput();
      return;
    }
    const offset = getCaretOffset(block.input);
    if (offset === null) return;
    const raw = block.input.textContent;
    const before = raw.slice(0, offset);
    const after = raw.slice(offset);
    block.input.textContent = before + pieces[0];
    block.raw = block.input.textContent;
    this.paintHighlight(block);
    const chunks = pieces.slice(1);
    if (after) chunks.push(after);
    let last = block;
    for (const p of chunks) {
      const nb = this.createBlock(p);
      this.mountBlock(nb, last);
      this.toRendered(nb);
      last = nb;
    }
    setCaretOffset(block.input, (before + pieces[0]).length);
    this.onInput();
  }

  focusFirstBlock() {
    if (!this.blocks.length) return;
    const b = this.blocks[0];
    this.toEditing(b);
    b.input.focus();
    setCaretOffset(b.input, b.raw.length);
  }

  // 拼回 markdown 字符串（块间以空行分隔），保存/导出共用
  getContent() {
    return this.blocks
      .map(b => (b.editing ? b.input.textContent : b.raw))
      .join('\n\n');
  }
}
