# MARKDOWN PREVIEWER

**Generated:** 2026-02-27 16:54:31
**Commit:** f127f82
**Branch:** master

## OVERVIEW

Local markdown previewer with KaTeX math, Mermaid diagrams, and Graphviz rendering. Bun monorepo: React/Vite frontend + markdown-it backend.

## STRUCTURE

```
markdown-previewer/
├── backend/          # Bun HTTP server + markdown-it rendering engine
├── frontend/         # React + Vite SPA
├── package.json      # Monorepo root (workspaces: frontend, backend)
└── tsconfig.json     # Base TypeScript config
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add markdown plugin | backend/renderer.ts | Plugin chain via `md.use()` |
| Add diagram type | backend/renderer.ts:37-51 | Custom fence renderer |
| Security validation | backend/server.ts:120-149 | Path normalization + symlink resolution |
| Frontend post-processing | frontend/src/MarkdownViewer.tsx:76-95 | Mermaid/Graphviz async rendering |
| API endpoint | backend/server.ts:74-211 | Main fetch handler |
| Component hierarchy | frontend/src/ | main.tsx → App.tsx → MarkdownViewer.tsx |

## CONVENTIONS

- **No linting/formatting configs** — TypeScript strict mode only
- **Bun-first** — Use `bun` commands, not npm/yarn
- **Monorepo scripts** — `bun run --filter '*' dev` runs all workspaces
- **Security-first** — Multi-layer path validation (normalize → resolve → realpath → extension check)
- **HTML disabled** — markdown-it configured with `html: false` to prevent XSS
- **CORS wide-open** — `Access-Control-Allow-Origin: *` (consider restricting in production)

## ANTI-PATTERNS

None documented. Codebase is clean with no forbidden patterns.

## UNIQUE STYLES

- **Two-stage rendering** — Backend renders markdown-it HTML, frontend post-processes Mermaid/Graphviz
- **Content negotiation** — API returns JSON for `Accept: application/json`, HTML for browser navigation
- **Deferred diagram init** — setTimeout workaround for Mermaid/Graphviz after DOM updates
- **No shared types** — Frontend/backend use implicit contracts (opportunity for consolidation)

## COMMANDS

```bash
# Development (both workspaces)
bun run dev

# Build frontend only
bun run build

# Production backend
bun backend/server.ts --host 0.0.0.0 --port 8080

# Health check
curl http://127.0.0.1:3000/health
```

## NOTES

- **No tests** — Zero testing infrastructure (Vitest recommended for both workspaces)
- **No CI/CD** — Missing GitHub Actions workflows
- **Largest file** — server.ts (214 lines), well-modularized
- **Extension points** — Add plugins in renderer.ts, extend fence renderer for new diagram types
- **Security** — Only `.md` files allowed, symlink resolution prevents escapes
- **dangerouslySetInnerHTML** — Safe because backend sanitizes via `html: false`
