import { renderMarkdown } from './renderer';

const markdown = `Inline math: $E = mc^2$

Block math on separate lines:

$$
\\int_0^\\infty e^{-x} dx = 1
$$

More text after.`;

console.log(renderMarkdown(markdown));
