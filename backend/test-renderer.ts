import { renderMarkdown } from './renderer.ts';

console.log('=== Testing Math Rendering ===');
const mathTest = `Inline math: $E = mc^2$

Block math:
$$
\\int_0^\\infty e^{-x} dx = 1
$$`;
console.log(renderMarkdown(mathTest));

console.log('\n=== Testing Code Highlighting ===');
const codeTest = `\`\`\`javascript
console.log("Hello, world!");
const x = 42;
\`\`\``;
console.log(renderMarkdown(codeTest));

console.log('\n=== Testing Mermaid ===');
const mermaidTest = `\`\`\`mermaid
graph TD
A[Start] --> B[Process]
B --> C[End]
\`\`\``;
console.log(renderMarkdown(mermaidTest));

console.log('\n=== Testing Graphviz ===');
const graphvizTest = `\`\`\`dot
digraph G {
  A -> B;
  B -> C;
}
\`\`\``;
console.log(renderMarkdown(graphvizTest));

console.log('\n=== Testing GFM Table ===');
const tableTest = `| Column 1 | Column 2 |
|----------|----------|
| Cell A   | Cell B   |
| Cell C   | Cell D   |`;
console.log(renderMarkdown(tableTest));

console.log('\n=== Testing Task Lists ===');
const taskTest = `- [x] Completed task
- [ ] Pending task
- [x] Another done`;
console.log(renderMarkdown(taskTest));

console.log('\n=== Testing Footnotes ===');
const footnoteTest = `Here is a footnote reference[^1].

[^1]: This is the footnote content.`;
console.log(renderMarkdown(footnoteTest));

console.log('\n=== Testing Strikethrough ===');
const strikeTest = `~~This text is crossed out~~`;
console.log(renderMarkdown(strikeTest));

console.log('\n=== Testing HTML Blocking (Security) ===');
const htmlTest = `<script>alert("XSS")</script>

<img src=x onerror="alert('XSS')">

Normal text`;
console.log(renderMarkdown(htmlTest));
