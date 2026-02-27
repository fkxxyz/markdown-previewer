import { renderMarkdown } from './renderer.ts';

console.log('=== Test 1: Block math on separate lines ===');
const test1 = `Block math:
$$
\\int_0^\\infty e^{-x} dx = 1
$$`;
console.log(renderMarkdown(test1));

console.log('\n=== Test 2: Block math inline with text ===');
const test2 = `Block: $$\\int_0^\\infty e^{-x} dx$$`;
console.log(renderMarkdown(test2));

console.log('\n=== Test 3: Block math with blank lines ===');
const test3 = `Text before

$$
\\int_0^\\infty e^{-x} dx = 1
$$

Text after`;
console.log(renderMarkdown(test3));

console.log('\n=== Test 4: Multiple block math ===');
const test4 = `First equation:
$$
E = mc^2
$$

Second equation:
$$
F = ma
$$`;
console.log(renderMarkdown(test4));
