## Task 2: Backend HTTP Server with Bun

### Bun.serve API
- Bun.serve() is the core HTTP server API - simple and performant
- Takes config object with `host`, `port`, and `fetch` handler
- fetch handler receives Request object and returns Response
- No need for external HTTP libraries - built-in to Bun runtime

### CLI Argument Parsing
- Manual parsing via process.argv.slice(2) is sufficient for simple args
- Loop through args array looking for flag names (--host, --port)
- Parse port as integer with parseInt(value, 10)
- Default values (127.0.0.1:3000) applied if args not provided

### CORS Headers
- Minimal CORS setup: Access-Control-Allow-Origin, Methods, Headers
- Handle OPTIONS preflight requests with 204 No Content response
- Include CORS headers in all responses for frontend compatibility
- Wildcard "*" for Allow-Origin works for local development

### Project Structure
- backend/package.json separate from root package.json
- Root uses workspaces to manage backend and frontend
- Each workspace has own scripts (start, dev)
- npm start in root runs start script recursively across workspaces

### Testing Approach
- Use timeout wrapper to prevent server hanging during tests
- Background process with & and pkill for cleanup
- curl with -w flag to capture HTTP status codes
- 2 second sleep ensures server is ready before health check

### Evidence Files
- Created .sisyphus/evidence/ directory for test outputs
- Document test commands, outputs, and pass/fail status
- Useful for verification and debugging later

## Task 3: Frontend React + TypeScript + Vite Setup

### React + TypeScript + Vite Configuration
- Vite is lightweight and fast for React development
- vite.config.ts uses @vitejs/plugin-react for JSX support
- Build output goes to dist/ directory by default
- TypeScript compilation happens before Vite bundling (tsc && vite build)

### TypeScript Configuration Inheritance
- Frontend tsconfig.json extends root tsconfig.json
- Must override rootDir to "./src" in frontend tsconfig to avoid path conflicts
- Without rootDir override, TypeScript looks for src/ in root directory
- Include pattern "src/**/*" must match actual file locations

### Frontend Package Structure
- Separate package.json for frontend workspace
- React 18.2.0 and react-dom 18.2.0 as dependencies
- Vite and TypeScript as devDependencies
- Scripts: dev (vite), build (tsc && vite build), preview (vite preview)

### Static File Serving in Bun
- Use statSync() to check if path is directory before reading
- readFileSync() on directory throws EISDIR error - must validate first
- Try-catch wrapper prevents server crashes on file read errors
- MIME type mapping needed for correct Content-Type headers
- Fallback to index.html for SPA routing (all non-existent paths)

### Frontend Build Output
- Vite generates dist/index.html and dist/assets/index-*.js
- HTML file is small (~391 bytes) with script tag pointing to bundled JS
- JavaScript bundle includes React, ReactDOM, and app code (~142 kB)
- Build completes in ~680ms with 30 modules transformed

### Integration Testing
- Backend successfully serves frontend HTML from dist/
- React app entry point loads correctly
- CORS headers allow frontend to communicate with backend
- SPA routing works - all paths serve index.html

## Task 4: Secure File Reading API

### Path Security Validation
- Use path.normalize() and path.resolve() to prevent path traversal attacks
- Always resolve symlinks with fs.realpathSync() before extension validation
- Check file extension on RESOLVED path, not requested path (critical for symlink security)
- Symlink to /etc/passwd named "bad.md" correctly rejected after resolution

### File System Security Checks
- Validate file exists with existsSync() before attempting to read
- Use statSync() to verify path is a file, not a directory
- Check extension with extname() on the real path after symlink resolution
- Wrap all file operations in try-catch to prevent server crashes

### API Response Format
- Return JSON with both resolved path and content: { path, content }
- Use 404 status for all security violations (non-.md, traversal, non-existent)
- Include descriptive error messages in JSON: { error: "message" }
- Always include CORS headers in responses

### Security Test Results
- Valid .md file: Returns JSON with path and content ✓
- Non-.md file (/etc/passwd): Rejected with "Only .md files are allowed" ✓
- Path traversal (../../etc/passwd): Rejected with "File not found" ✓
- Symlink to .md: Works correctly, returns resolved path ✓
- Symlink to non-.md: Rejected after symlink resolution ✓
- Non-existent file: Rejected with "File not found" ✓

### Query Parameter Handling
- Use url.searchParams.has() to check for query parameter existence
- Use url.searchParams.get() to retrieve parameter value
- Validate parameter is not null/empty before processing

## Task 5: Markdown Rendering Engine Configuration

### markdown-it Core Configuration
- html: false is MANDATORY for security - prevents XSS attacks
- linkify: true automatically converts URLs to links
- typographer: true enables smart quotes and other typographic replacements
- highlight function integrates highlight.js for syntax highlighting

### Plugin Installation
- markdown-it-katex: Math rendering with KaTeX (inline $ and block $$)
- markdown-it-footnote: Footnote support with [^1] syntax
- markdown-it-task-lists: GitHub-style task lists with - [ ] and - [x]
- markdown-it-anchor: Automatic heading anchors for navigation
- highlight.js: Code syntax highlighting for 190+ languages
- mermaid: Diagram rendering (client-side, wrapped in div)
- @aduh95/viz.js: Graphviz DOT diagram support (client-side, wrapped in div)
- katex: Math typesetting library (peer dependency for markdown-it-katex)

### GFM (GitHub Flavored Markdown) Features
- Tables: Built-in to markdown-it, enabled by default
- Strikethrough: Built-in, enabled with md.enable(['strikethrough'])
- Task lists: Requires markdown-it-task-lists plugin
- Footnotes: Requires markdown-it-footnote plugin

### Custom Fence Renderer
- Override md.renderer.rules.fence to handle special code blocks
- Detect language from token.info.trim()
- Mermaid blocks: Wrap in <div class="mermaid"> for client-side rendering
- Graphviz blocks (dot/graphviz): Wrap in <div class="graphviz" data-dot="...">
- Use md.utils.escapeHtml() to prevent XSS in diagram content
- Fall back to default fence renderer for normal code blocks

### Security Validation
- HTML tags are escaped: <script> becomes &lt;script&gt;
- Prevents XSS attacks through markdown content
- All user content is sanitized before rendering
- Diagram content is escaped and stored in data attributes

### Error Handling
- Wrap md.render() in try-catch to prevent crashes
- Return error div with message on rendering failure
- Log errors to console for debugging
- Graceful degradation ensures server stays responsive

### Testing Results
- Math: Both inline ($) and block ($$) render correctly with KaTeX HTML
- Code: Syntax highlighting works with hljs classes
- Mermaid: Wrapped in div with escaped content for client-side rendering
- Graphviz: Wrapped in div with data-dot attribute for client-side rendering
- Tables: Proper HTML table structure with thead/tbody
- Task lists: Checkboxes with checked/disabled attributes
- Footnotes: Superscript references with footnotes section at bottom
- Strikethrough: Renders as <s> tag
- HTML blocking: All HTML tags escaped, XSS prevented

### Block Math Syntax Requirements (CRITICAL)
- Block math MUST have $$ delimiters on separate lines (not inline with text)
- VALID: `$$\n\int_0^\infty\n$$` (separate lines)
- INVALID: `Block: $$\int_0^\infty$$` (inline with text)
- Inline math uses single $ delimiters: `$E = mc^2$`
- Block math uses double $$ delimiters on their own lines
- markdown-it-katex correctly rejects invalid inline block math syntax
- When $$ appears inline with text, it renders as literal text (expected behavior)

### Math Rendering Verification
- Inline math: Renders with `<span class="katex">` wrapper
- Block math: Renders with `<span class="katex-display">` wrapper
- Both produce full KaTeX HTML with mathml and visual rendering
- Mixed inline and block math work correctly in same document
- Multiple block math equations can appear in sequence
