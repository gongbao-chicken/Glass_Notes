import { marked } from './marked.esm.js';

export default class MarkdownRenderer {
  constructor(textarea, preview) {
    this.textarea = textarea;
    this.preview = preview;
    this.renderTimeout = null;
    this.lastContent = '';
    this.isRendering = false;
  }

  // 检测是否需要渲染
  shouldRender(currentContent) {
    // 只要内容变化就渲染
    return currentContent !== this.lastContent;
  }

  // 安排渲染任务
  scheduleRender() {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    
    // 使用100ms的渲染间隔
    this.renderTimeout = setTimeout(() => {
      this.renderMarkdown();
    }, 100);
  }

  // 渲染Markdown内容
  renderMarkdown() {
    if (this.isRendering) return;
    
    const currentContent = this.textarea.value;
    
    // 仅在内容变化时更新
    if (currentContent !== this.lastContent) {
      this.isRendering = true;
      
      try {
        // 解析Markdown
        const renderedContent = marked.parse(currentContent);
        
        // 更新预览区域
        this.preview.innerHTML = renderedContent;
        
        // 保存当前内容
        this.lastContent = currentContent;
      } finally {
        this.isRendering = false;
      }
    }
  }
}
