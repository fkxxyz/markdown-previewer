# FRONTEND

React + Vite SPA for markdown preview. Fetches rendered HTML from backend, post-processes Mermaid and Graphviz diagrams.

## STRUCTURE

```
frontend/
├── src/
│   ├── main.tsx              # Entry point, React.StrictMode wrapper
│   ├── App.tsx               # Root component (simple pass-through)
│   ├── MarkdownViewer.tsx    # Main component with all state and logic
│   └── styles.css            # Global styles
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies: React 18, Mermaid, @viz-js/viz
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add diagram renderer | MarkdownViewer.tsx:76-95 | Post-processing after content load |
| API calls | MarkdownViewer.tsx:57-73 | Fetch to backend with error handling |
| State management | MarkdownViewer.tsx:18-19 | useState for loading, error, filePath, htmlContent |
| External library loading | MarkdownViewer.tsx:21-40 | Dynamic CSS injection for KaTeX, highlight.js |
| URL param parsing | MarkdownViewer.tsx:46-53 | Reads `?path=` from window.location.search |

## CONVENTIONS

- **Flat component hierarchy** — main.tsx → App.tsx → MarkdownViewer.tsx (no prop drilling)
- **Self-contained components** — MarkdownViewer reads URL params directly, no props
- **useEffect with empty deps** — Run-once initialization pattern
- **dangerouslySetInnerHTML** — Safe because backend sanitizes HTML
- **Deferred diagram rendering** — setTimeout(0) to wait for DOM updates before Mermaid/Graphviz

## ANTI-PATTERNS

- **Don't add state to App.tsx** — Keep it as a pass-through wrapper
- **Don't skip error handling** — Always catch fetch errors and display to user
- **Don't render diagrams synchronously** — Use setTimeout to defer after DOM updates

## NOTES

- **No tests** — Zero testing infrastructure (Vitest recommended)
- **CDN dependencies** — KaTeX and highlight.js loaded from CDN, not bundled
- **API endpoint** — Hardcoded to `http://127.0.0.1:3000` in dev, same-origin in prod
- **Mermaid initialization** — `mermaid.initialize({ startOnLoad: false })` for manual control
- **Graphviz rendering** — Uses `@viz-js/viz` with error handling for invalid DOT syntax
