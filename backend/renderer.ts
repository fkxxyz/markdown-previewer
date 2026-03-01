import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItAnchor from 'markdown-it-anchor';
import hljs from 'highlight.js';

// Initialize markdown-it with security settings
const md = new MarkdownIt({
  html: false, // CRITICAL: Disable HTML for security
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (err) {
        console.error('Highlight.js error:', err);
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// Enable GFM features
md.enable(['table', 'strikethrough']); // Tables and strikethrough are built-in

// Add plugins
md.use(markdownItKatex); // Math rendering
md.use(markdownItFootnote); // Footnotes
md.use(markdownItTaskLists); // Task lists
md.use(markdownItAnchor); // Anchors for headings

// Custom renderer for Mermaid diagrams
const defaultFenceRenderer = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const lang = token.info.trim();
  
  if (lang === 'mermaid') {
    return `<div class="mermaid">${md.utils.escapeHtml(token.content)}</div>`;
  }
  
  if (lang === 'dot' || lang === 'graphviz') {
    return `<div class="graphviz" data-dot="${md.utils.escapeHtml(token.content)}"></div>`;
  }
  
  return defaultFenceRenderer(tokens, idx, options, env, self);
};

// Custom link renderer to handle relative paths
const defaultLinkOpenRenderer = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');
  
  if (hrefIndex >= 0) {
    const href = token.attrs![hrefIndex][1];
    
    // Check if it's a relative path (not absolute, not URL)
    if (href && !href.startsWith('/') && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#')) {
      // Mark as relative path by adding data attribute
      token.attrPush(['data-relative-path', href]);
    }
  }
  
  return defaultLinkOpenRenderer(tokens, idx, options, env, self);
};

/**
 * Render markdown content to HTML
 * @param content - Markdown string to render
 * @returns Rendered HTML string
 */
export function renderMarkdown(content: string): string {
  try {
    return md.render(content);
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<div class="error">Failed to render markdown: ${err instanceof Error ? err.message : 'Unknown error'}</div>`;
  }
}
