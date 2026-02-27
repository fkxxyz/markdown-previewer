import { renderMarkdown } from './renderer';

console.log("=== Math Test ===");
console.log(renderMarkdown('Inline: $E = mc^2$\n\nBlock: $$\\int_0^\\infty e^{-x} dx$$'));

console.log("\n=== Code Test ===");
console.log(renderMarkdown('```javascript\nconsole.log("test");\n```'));

console.log("\n=== Mermaid Test ===");
console.log(renderMarkdown('```mermaid\ngraph TD\nA-->B\n```'));

console.log("\n=== Graphviz Test ===");
console.log(renderMarkdown('```dot\ndigraph G { A -> B; }\n```'));

console.log("\n=== Table Test ===");
console.log(renderMarkdown('| A | B |\n|---|---|\n| 1 | 2 |'));

console.log("\n=== Task List Test ===");
console.log(renderMarkdown('- [x] Done\n- [ ] Todo'));

console.log("\n=== Footnote Test ===");
console.log(renderMarkdown('Text[^1]\n\n[^1]: Note'));

console.log("\n=== Strikethrough Test ===");
console.log(renderMarkdown('~~deleted~~'));

console.log("\n=== HTML Blocking Test ===");
console.log(renderMarkdown('<script>alert("XSS")</script>\n\n# Safe'));
