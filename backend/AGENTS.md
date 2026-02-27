# BACKEND

Bun HTTP server with markdown-it rendering engine. Handles file serving, markdown processing, and security validation.

## STRUCTURE

```
backend/
├── server.ts         # HTTP server, routing, static file serving
├── renderer.ts       # markdown-it engine with plugin chain
├── test-*.ts         # Manual test files (no test framework)
└── package.json      # Dependencies: markdown-it ecosystem, KaTeX, Mermaid
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add markdown plugin | renderer.ts:31-34 | `md.use(plugin)` chain |
| Add diagram type | renderer.ts:37-51 | Custom fence renderer |
| Path validation | server.ts:120-149 | Security-critical: normalize → resolve → realpath |
| CORS config | server.ts:27-31 | Wide-open (`*`), consider restricting |
| Static file serving | server.ts:37-68 | MIME type mapping |
| Error responses | server.ts:150-161 | All return `{ error: string }` with 404 |

## CONVENTIONS

- **Bun runtime** — Use `bun` commands, not node
- **ESM only** — `type: "module"` in package.json
- **Security layers** — Path normalization → symlink resolution → extension check → file type check
- **HTML disabled** — `html: false` in markdown-it config (prevents XSS)
- **Escape all user content** — Use `md.utils.escapeHtml()` for code blocks and diagram data

## ANTI-PATTERNS

- **Don't bypass path validation** — Always use the full validation chain
- **Don't enable HTML rendering** — Keep `html: false` to prevent XSS
- **Don't trust file extensions** — Validate after symlink resolution

## NOTES

- **No tests** — Manual test files exist but no framework configured
- **Plugin order matters** — KaTeX must run before custom fence renderer
- **Mermaid/Graphviz** — Backend wraps in divs, frontend renders asynchronously
- **CLI args** — `--host` and `--port` supported via parseArgs()
