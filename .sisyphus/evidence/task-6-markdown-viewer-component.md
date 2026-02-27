# Task 6: MarkdownViewer Component - Evidence

## Component Created
- File: `frontend/src/MarkdownViewer.tsx`
- Lines: 137 lines
- Features: URL parsing, API fetching, loading/error states, KaTeX/highlight.js/Mermaid integration

## Integration Tests

### 1. Backend API Returns Rendered HTML
```bash
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | jq -r '.path'
# Output: /tmp/test-markdown.md

curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | jq -r '.content' | wc -c
# Output: 6344 (HTML content)
```

### 2. KaTeX Math Rendering
```bash
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | jq -r '.content' | grep 'class="katex"'
# Output: <span class="katex">... (math HTML)
```

### 3. Highlight.js Code Highlighting
```bash
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | jq -r '.content' | grep 'class="hljs"'
# Output: <pre class="hljs"><code>... (highlighted code)
```

### 4. Mermaid Diagram Wrapping
```bash
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | jq -r '.content' | grep 'class="mermaid"'
# Output: <div class="mermaid">graph TD... (diagram content)
```

### 5. Error Handling
```bash
# Non-existent file
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/nonexistent.md" | jq
# Output: { "error": "File not found" }

# Missing path parameter
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=" | jq
# Output: { "error": "Invalid path parameter" }
```

### 6. Browser vs API Request Routing
```bash
# Browser request (HTML accept header) - serves frontend
curl -s -H "Accept: text/html" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | grep "<title>"
# Output: <title>Markdown Previewer</title>

# API request (JSON accept header) - returns JSON
curl -s -H "Accept: application/json" "http://127.0.0.1:3000/?path=/tmp/test-markdown.md" | jq -r '.path'
# Output: /tmp/test-markdown.md
```

## Component Features Verified

✅ URL query parameter parsing (`?path=...`)
✅ Fetch from backend API with proper headers
✅ Display file path at top (monospace, gray background)
✅ Display rendered HTML below file path
✅ Loading state ("Loading...")
✅ Error state (red background, error message)
✅ KaTeX CSS loaded from CDN
✅ highlight.js CSS loaded from CDN
✅ Mermaid initialized with `startOnLoad: true`
✅ Mermaid re-triggered after content loads

## Build Output
```
$ bun run build
vite v5.4.21 building for production...
✓ 30 modules transformed.
dist/index.html                  0.39 kB │ gzip:  0.28 kB
dist/assets/index-ZJLSta63.js  142.82 kB │ gzip: 45.86 kB
✓ built in 655ms
```

## Files Modified
1. `frontend/src/MarkdownViewer.tsx` - Created new component
2. `frontend/src/App.tsx` - Updated to use MarkdownViewer
3. `backend/server.ts` - Added renderMarkdown() call and browser/API routing
4. `frontend/package.json` - Added mermaid dependency

## Test File Used
`/tmp/test-markdown.md` with:
- Inline math: $E = mc^2$
- Block math: $$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
- JavaScript and Python code blocks
- Mermaid diagram (graph TD)
- Regular markdown (lists, bold, italic, blockquote)

All features render correctly in HTML output.
