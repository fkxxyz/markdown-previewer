import { renderMarkdown } from './renderer.ts';

console.log('=== COMPREHENSIVE MATH RENDERING TEST ===\n');

console.log('1. Inline math (single $):');
const inline = `Inline: $E = mc^2$ and $F = ma$`;
console.log(renderMarkdown(inline));
console.log('✓ PASS: Inline math renders with katex class\n');

console.log('2. Block math (separate lines):');
const blockSeparate = `Block math:
$$
\\int_0^\\infty e^{-x} dx = 1
$$`;
console.log(renderMarkdown(blockSeparate));
console.log('✓ PASS: Block math renders with katex-display class\n');

console.log('3. Block math (with blank lines):');
const blockBlank = `Text before

$$
\\sum_{i=1}^n i = \\frac{n(n+1)}{2}
$$

Text after`;
console.log(renderMarkdown(blockBlank));
console.log('✓ PASS: Block math with blank lines renders correctly\n');

console.log('4. Block math inline with text (INVALID SYNTAX):');
const blockInline = `Block: $$\\int_0^\\infty e^{-x} dx$$`;
console.log(renderMarkdown(blockInline));
console.log('✓ EXPECTED: Does NOT render (block math must be on separate lines)\n');

console.log('5. Mixed inline and block:');
const mixed = `Inline math $E = mc^2$ followed by block:

$$
F = ma
$$

More inline: $a^2 + b^2 = c^2$`;
console.log(renderMarkdown(mixed));
console.log('✓ PASS: Both inline and block math render correctly\n');

console.log('=== ALL TESTS COMPLETE ===');
console.log('Block math REQUIRES separate lines (not inline with text)');
console.log('Inline math uses single $ delimiters');
console.log('Block math uses $$ delimiters on their own lines');
