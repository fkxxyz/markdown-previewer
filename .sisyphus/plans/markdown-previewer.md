# Markdown Previewer - Local File Viewer

## TL;DR

> **Quick Summary**: Build a local web application that renders markdown files from anywhere on the filesystem via URL query parameters, with rich rendering support for math (KaTeX), code highlighting, and diagrams (Mermaid + Graphviz).
> 
> **Deliverables**:
> - Bun + TypeScript backend server with secure file reading
> - React + TypeScript frontend with markdown rendering
> - GitHub-style CSS
> - CLI with configurable host/port
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Project Setup → Backend Security → Frontend Rendering → Integration

---

## Context

### Original Request
User wants to build a markdown previewer web application using markdown-it, with support for formulas, code highlighting, and diagrams.

### Interview Summary
**Key Discussions**:
- Project type: Local web application (not CLI tool or static site generator)
- Access method: URL query parameter `?path=/path/to/file.md`
- Technology: Bun + TypeScript (backend), React + TypeScript (frontend)
- Rendering: markdown-it + KaTeX + highlight.js + Mermaid + Graphviz
- Security: Only .md files, symlink resolution, path traversal prevention
- Configuration: CLI arguments for host/port
- No tests required - just needs to compile

**Research Findings**:
- markdown-it has mature plugin ecosystem for all required features
- Bun has native TypeScript support (no transpilation needed)
- Graphviz requires external binary or viz.js library

### Metis Review
**Identified Gaps** (addressed):
- Project structure: Monorepo with frontend/ and backend/ folders
- URL format: `?path=/path/to/file.md`
- Error handling: Simple 404 page
- HTML sanitization: Completely block HTML in markdown
- Markdown extensions: Full GitHub Flavored Markdown support
- Configuration: CLI arguments (`--host`, `--port`)

---

## Work Objectives

### Core Objective
Build a secure, local markdown previewer that can render any .md file on the filesystem with rich formatting support (math, code, diagrams) and GitHub-style appearance.

### Concrete Deliverables
- Monorepo project structure with TypeScript configuration
- Backend API endpoint that reads and validates .md files
- Frontend React app that displays file path and rendered content
- markdown-it configured with KaTeX, highlight.js, Mermaid, Graphviz, and GFM plugins
- CLI with `--host` and `--port` arguments
- GitHub-style CSS for rendered markdown
- Security: path traversal prevention, symlink resolution, .md extension validation

### Definition of Done
- [ ] `bun install` completes without errors
- [ ] `bun run build` compiles TypeScript without errors
- [ ] `bun run start --host 127.0.0.1 --port 3000` starts server successfully
- [ ] Can render markdown file with math, code, Mermaid, and Graphviz
- [ ] Rejects non-.md files with 404 page
- [ ] Blocks path traversal attempts (e.g., `../../etc/passwd`)
- [ ] Resolves symlinks and validates real file extension

### Must Have
- Monorepo structure (frontend/ and backend/ folders)
- Secure file reading with validation
- URL format: `?path=/absolute/path/to/file.md`
- Display file path at top of page
- Render markdown with KaTeX, highlight.js, Mermaid, Graphviz
- GitHub Flavored Markdown support (tables, footnotes, task lists, strikethrough)
- Block all HTML in markdown (security)
- Simple 404 page for errors
- CLI arguments for host/port configuration

### Must NOT Have (Guardrails)
- File browser or directory listing UI
- File editing, saving, or modification capabilities
- File upload functionality
- Authentication or authorization
- Database or persistence layer
- File search or indexing
- Markdown export to other formats
- Diagram types beyond Mermaid + Graphviz
- UI features beyond file path + rendered content (no TOC, search, copy buttons)
- Caching layer
- Pixel-perfect GitHub UI recreation (just GitHub-style markdown rendering)
- Auto-refresh when file changes on disk
- Multiple file preview or split view

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO - user specified "just needs to compile"
- **Framework**: None
- **Verification method**: Compilation check only

### QA Policy
Since user specified "no automated tests, just needs to compile", acceptance criteria focus on successful compilation and build. Manual testing steps are documented for user to perform after delivery.

Each task includes agent-executed QA scenarios using curl, browser automation, or compilation checks.

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.
> Target: 5-8 tasks per wave. Fewer than 3 per wave (except final) = under-splitting.

```
Wave 1 (Start Immediately — foundation):
├── Task 1: Project scaffolding + monorepo structure [quick]
├── Task 2: Backend server setup with CLI args [quick]
└── Task 3: Frontend React app setup [quick]

Wave 2 (After Wave 1 — core implementation):
├── Task 4: Backend file reading with security validation [deep]
├── Task 5: markdown-it configuration with all plugins [unspecified-high]
└── Task 6: Frontend markdown display component [visual-engineering]

Wave 3 (After Wave 2 — integration):
├── Task 7: GitHub-style CSS [visual-engineering]
├── Task 8: Error handling (404 page) [quick]
└── Task 9: Integration testing and build verification [unspecified-high]

Critical Path: Task 1 → Task 2 → Task 4 → Task 5 → Task 6 → Task 9
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 3 (all waves)
```

### Dependency Matrix

- **1**: — → 2, 3
- **2**: 1 → 4
- **3**: 1 → 6
- **4**: 2 → 5, 9
- **5**: 4 → 6, 9
- **6**: 3, 5 → 7, 9
- **7**: 6 → 9
- **8**: 3 → 9
- **9**: 4, 5, 6, 7, 8 → —

### Agent Dispatch Summary

- **Wave 1**: 3 tasks — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **Wave 2**: 3 tasks — T4 → `deep`, T5 → `unspecified-high`, T6 → `visual-engineering`
- **Wave 3**: 3 tasks — T7 → `visual-engineering`, T8 → `quick`, T9 → `unspecified-high`

---

## TODOs

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 3 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check code). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build`. Review all files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Security Review** — `deep`
  Review backend file reading code for: path traversal prevention (path.resolve + path.normalize), symlink resolution (fs.realpath), extension validation on resolved path, file size limits. Test with malicious paths: `../../etc/passwd`, `../../../home/user/.ssh/id_rsa`, symlink to non-.md file.
  Output: `Security Checks [N/N pass] | Vulnerabilities [NONE/N found] | VERDICT`

---

## Commit Strategy

- **Wave 1**: `feat(init): initialize monorepo with backend and frontend scaffolding` — package.json, tsconfig.json, frontend/, backend/
- **Wave 2**: `feat(core): implement secure file reading and markdown rendering` — backend/server.ts, frontend/MarkdownViewer.tsx
- **Wave 3**: `feat(ui): add GitHub-style CSS and error handling` — frontend/styles.css, frontend/ErrorPage.tsx
- **Final**: `chore(verify): final verification and build check` — (no files, verification only)

---

## Success Criteria

### Verification Commands
```bash
# Install dependencies
cd /path/to/project && bun install
# Expected: Exit code 0, all dependencies installed

# Build project
bun run build
# Expected: Exit code 0, no TypeScript errors, frontend built successfully

# Start server
bun run start --host 127.0.0.1 --port 3000 &
# Expected: Server starts on http://127.0.0.1:3000

# Test file rendering (requires test .md file)
echo "# Test\n\n\$\$E = mc^2\$\$\n\n\`\`\`js\nconsole.log('test');\n\`\`\`" > /tmp/test.md
curl -s "http://127.0.0.1:3000/?path=/tmp/test.md" | grep -q "<html>"
# Expected: Returns HTML with rendered markdown

# Test security: reject non-.md file
curl -s "http://127.0.0.1:3000/?path=/etc/passwd" | grep -q "404"
# Expected: Returns 404 page

# Test security: block path traversal
curl -s "http://127.0.0.1:3000/?path=../../etc/passwd" | grep -q "404"
# Expected: Returns 404 page
```

### Final Checklist
- [ ] All "Must Have" features present
- [ ] All "Must NOT Have" features absent
- [ ] TypeScript compiles without errors
- [ ] Server starts with CLI arguments
- [ ] Can render markdown with math, code, diagrams
- [x] 1. Project Scaffolding + Monorepo Structure

  **What to do**:
  - Create monorepo structure with `frontend/` and `backend/` folders
  - Initialize `package.json` with Bun workspace configuration
  - Set up TypeScript configuration for both frontend and backend
  - Create `.gitignore` with node_modules, dist, build folders
  - Add npm scripts: `build`, `start`, `dev`

  **Must NOT do**:
  - Do not add test framework or test configuration
  - Do not add linting configuration (ESLint, Prettier)
  - Do not add CI/CD configuration

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward project initialization with standard structure
  - **Skills**: []
    - No specialized skills needed for basic scaffolding

  **Parallelization**:
  - **Can Run In Parallel**: NO (other tasks depend on this)
  - **Parallel Group**: Wave 1 (start immediately)
  - **Blocks**: Tasks 2, 3 (need project structure)
  - **Blocked By**: None (can start immediately)

  **References**:

  **External References**:
  - Bun workspaces: `https://bun.sh/docs/install/workspaces` - Workspace configuration syntax
  - TypeScript project references: `https://www.typescriptlang.org/docs/handbook/project-references.html` - Multi-project setup

  **Acceptance Criteria**:
  - [ ] Directory structure exists: `frontend/`, `backend/`, root `package.json`
  - [ ] `bun install` completes without errors
  - [ ] TypeScript configuration files present: `tsconfig.json` (root), `frontend/tsconfig.json`, `backend/tsconfig.json`

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project structure is valid
    Tool: Bash
    Preconditions: Project directory exists
    Steps:
      1. Run `ls -la` in project root
      2. Verify `frontend/`, `backend/`, `package.json`, `tsconfig.json` exist
      3. Run `bun install` in project root
      4. Assert exit code 0
    Expected Result: All directories and files present, dependencies install successfully
    Failure Indicators: Missing directories, bun install fails
    Evidence: .sisyphus/evidence/task-1-structure-valid.txt

  Scenario: TypeScript configuration is valid
    Tool: Bash
    Preconditions: Project initialized
    Steps:
      1. Run `bun tsc --noEmit` in project root
      2. Assert exit code 0 (no TypeScript errors)
    Expected Result: TypeScript compiles without errors
    Failure Indicators: TypeScript compilation errors
    Evidence: .sisyphus/evidence/task-1-typescript-valid.txt
  ```

  **Commit**: YES
  - Message: `feat(init): initialize monorepo with backend and frontend scaffolding`
  - Files: `package.json`, `tsconfig.json`, `frontend/`, `backend/`, `.gitignore`
  - Pre-commit: `bun install`

- [x] 2. Backend Server Setup with CLI Args

  **What to do**:
  - Create `backend/server.ts` with basic HTTP server using Bun.serve
  - Parse CLI arguments for `--host` and `--port` (default: 127.0.0.1:3000)
  - Add health check endpoint `/health` that returns 200 OK
  - Configure CORS to allow frontend requests
  - Add npm script `start` that runs `bun backend/server.ts`

  **Must NOT do**:
  - Do not implement file reading logic yet (that's Task 4)
  - Do not add authentication or authorization
  - Do not add logging framework

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Basic server setup with standard Bun.serve API
  - **Skills**: []
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3)
  - **Parallel Group**: Wave 1 (after Task 1)
  - **Blocks**: Task 4 (file reading needs server)
  - **Blocked By**: Task 1 (needs project structure)

  **References**:

  **External References**:
  - Bun.serve API: `https://bun.sh/docs/api/http` - HTTP server API
  - Node.js process.argv: `https://nodejs.org/docs/latest/api/process.html#processargv` - CLI argument parsing

  **Acceptance Criteria**:
  - [ ] `backend/server.ts` exists
  - [ ] Server starts with `bun backend/server.ts --host 127.0.0.1 --port 3000`
  - [ ] Health check endpoint responds: `curl http://127.0.0.1:3000/health` returns 200

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Server starts with default arguments
    Tool: Bash
    Preconditions: backend/server.ts exists
    Steps:
      1. Run `bun backend/server.ts --host 127.0.0.1 --port 3000 &` (background)
      2. Wait 2 seconds for server to start
      3. Run `curl -s http://127.0.0.1:3000/health`
      4. Assert response contains "OK" or status 200
      5. Kill background process
    Expected Result: Server starts and health check responds
    Failure Indicators: Server fails to start, health check times out
    Evidence: .sisyphus/evidence/task-2-server-starts.txt

  Scenario: Server respects custom host/port
    Tool: Bash
    Preconditions: backend/server.ts exists
    Steps:
      1. Run `bun backend/server.ts --host 0.0.0.0 --port 8080 &`
      2. Wait 2 seconds
      3. Run `curl -s http://0.0.0.0:8080/health`
      4. Assert response success
      5. Kill background process
    Expected Result: Server starts on custom host/port
    Failure Indicators: Server ignores CLI arguments
    Evidence: .sisyphus/evidence/task-2-custom-port.txt
  ```

  **Commit**: NO (groups with Task 1)

- [x] 3. Frontend React App Setup

  **What to do**:
  - Create `frontend/` with React + TypeScript setup
  - Initialize with Vite or Bun's built-in bundler
  - Create `frontend/src/App.tsx` with basic component structure
  - Create `frontend/index.html` entry point
  - Add npm script `build:frontend` that builds the React app
  - Configure backend to serve frontend static files

  **Must NOT do**:
  - Do not implement markdown rendering yet (that's Task 6)
  - Do not add UI component libraries (Material-UI, Ant Design, etc.)
  - Do not add state management (Redux, Zustand, etc.)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard React + TypeScript setup
  - **Skills**: []
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Parallel Group**: Wave 1 (after Task 1)
  - **Blocks**: Task 6 (markdown display needs React app)
  - **Blocked By**: Task 1 (needs project structure)

  **References**:

  **External References**:
  - Vite React TypeScript: `https://vitejs.dev/guide/#scaffolding-your-first-vite-project` - Project setup
  - Bun bundler: `https://bun.sh/docs/bundler` - Alternative to Vite

  **Acceptance Criteria**:
  - [ ] `frontend/src/App.tsx` exists
  - [ ] `bun run build:frontend` completes without errors
  - [ ] Frontend build output exists in `frontend/dist/` or similar

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Frontend builds successfully
    Tool: Bash
    Preconditions: frontend/ directory exists
    Steps:
      1. Run `cd frontend && bun install`
      2. Run `bun run build`
      3. Assert exit code 0
      4. Check `dist/` or `build/` directory exists
      5. Check `dist/index.html` exists
    Expected Result: Frontend builds without errors, output files present
    Failure Indicators: Build fails, missing output files
    Evidence: .sisyphus/evidence/task-3-frontend-builds.txt

  Scenario: Frontend serves from backend
    Tool: Bash
    Preconditions: Backend running, frontend built
    Steps:
      1. Start backend server
      2. Run `curl -s http://127.0.0.1:3000/`
      3. Assert response contains "<html>" or "<!DOCTYPE html>"
      4. Kill server
    Expected Result: Backend serves frontend HTML
    Failure Indicators: 404 error, empty response
    Evidence: .sisyphus/evidence/task-3-frontend-serves.txt
  ```

  **Commit**: NO (groups with Task 1)

- [ ] Security checks pass (path traversal, extension validation)
- [x] 4. Backend File Reading with Security Validation
  **What to do**:
  - Create API endpoint `GET /?path=/path/to/file.md`
  - Parse query parameter `path` from URL
  - Implement security validation:
    - Use `path.resolve()` and `path.normalize()` to prevent path traversal
    - Use `fs.realpath()` to resolve symlinks
    - Check file extension is `.md` on resolved path
    - Check file exists and is readable
  - Read file content using `fs.readFile()`
  - Return file content and resolved path to frontend
  - Return 404 for invalid files (non-.md, non-existent, path traversal attempts)
  **Must NOT do**:
  - Do not implement markdown rendering (that's Task 5)
  - Do not add file size limits yet (can be added later if needed)
  - Do not add caching
  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Security-critical code requiring careful validation logic
  - **Skills**: []
    - No specialized skills needed
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Task 2)
  - **Blocks**: Task 5 (markdown rendering needs file content)
  - **Blocked By**: Task 2 (needs server)
  **References**:
  **External References**:
  - Node.js path module: `https://nodejs.org/api/path.html` - path.resolve, path.normalize
  - Node.js fs module: `https://nodejs.org/api/fs.html` - fs.realpath, fs.readFile
  - OWASP Path Traversal: `https://owasp.org/www-community/attacks/Path_Traversal` - Security patterns
  **Acceptance Criteria**:
  - [ ] Endpoint `GET /?path=/path/to/file.md` returns file content
  - [ ] Rejects non-.md files: `/?path=/etc/passwd` returns 404
  - [ ] Blocks path traversal: `/?path=../../etc/passwd` returns 404
  - [ ] Resolves symlinks and validates real file extension
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Valid .md file is read successfully
    Tool: Bash
    Preconditions: Test file /tmp/test.md exists with content "# Test"
    Steps:
      1. Create test file: `echo "# Test" > /tmp/test.md`
      2. Start server in background
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/test.md"`
      4. Assert response contains "# Test" or file content
      5. Kill server
    Expected Result: File content returned successfully
    Failure Indicators: 404 error, empty response
    Evidence: .sisyphus/evidence/task-4-valid-file.txt
  Scenario: Non-.md file is rejected
    Tool: Bash
    Preconditions: Server running
    Steps:
      1. Start server
      2. Run `curl -s "http://127.0.0.1:3000/?path=/etc/passwd"`
      3. Assert response contains "404" or error message
      4. Kill server
    Expected Result: 404 error returned
    Failure Indicators: File content returned (security breach)
    Evidence: .sisyphus/evidence/task-4-reject-non-md.txt
  Scenario: Path traversal is blocked
    Tool: Bash
    Preconditions: Server running
    Steps:
      1. Start server
      2. Run `curl -s "http://127.0.0.1:3000/?path=../../etc/passwd"`
      3. Assert response contains "404" or error message
      4. Run `curl -s "http://127.0.0.1:3000/?path=../../../etc/passwd"`
      5. Assert response contains "404" or error message
      6. Kill server
    Expected Result: All path traversal attempts blocked
    Failure Indicators: File content rurity breach)
    Evidence: .sisyphus/evidence/task-4-block-traversal.txt
  Scenario: Symlink resolution with extension check
    Tool: Bash
    Preconditions: Test symlink exists
    Steps:
      1. Create test file: `echo "# Real" > /tmp/real.md`
      2. Create symlink: `ln -s /tmp/real.md /tmp/link.md`
      3. Create bad symlink: `ln -s /etc/passwd /tmp/bad.md`
      4. Start server
      5. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/link.md"`
      6. Assert response contains "# Real" (symlink to .md works)
      7. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/bad
      8. Assert response contains "404" (symlink to non-.md blocked)
      9. Kill server
    Expected Result: Symlink to .md works, symlink to non-.md blocked
    Failure Indicators: Bad symlink allowed (security breach)
    Evidence: .sisyphus/evidence/task-4-symlink-check.txt
  ```
  **Commit**: NO (groups with Task 5)
- [ ] 5. markdown-it Configuration with All Plugins
  **What to do**:
  - Install dependencies: `markdown-it`, `markdown-it-katex`, `highlight.js`, `mermaid`, `viz.js` or `@aduh95/viz.js`
  - Install GFM plugins: `markdown-it-table`, `markdown-it-footnote`, `markdown-it-task-lists`, `markdown-it-strikethrough` (or use `markdown-it-github-flavored`)
  - Configure markdown-it with:
    - HTML disabled (security: `html: false`)
    - KaTeX for math rendering
    - highlight.js for code syntax highlighting
    - Mermaid for diagrams
    - Graphviz/viz.js for DOT diagrams
    - All GFM extensions (tables, footnotes, task lists, strikethrough)
  - Create rendering function that takes markdown string and returns HTML
  - Handle rendering errors gracefully (invalid syntax in math/diagrams)
  **Must NOT do**:
  - Do not allow HTML in markdown (security risk)
  - Do not add diagram types beyond Mermaid + Graphviz
  - Do not add custom markdown extensions
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex plugin configuration requiring careful integration
  - **Skills**: []
    - No specialized skills needed
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Task 4)
  - **Blocks**: Task 6 (frontend needs rendering function)
  - **Blocked By**: Task 4 (needs file content)
  **References**:
  **External References**:
  - markdown-it: `https://github.com/markdown-it/markdown-it` - Core API and configuration
  - markdown-it-katex: `https://github.com/waylonflinn/markdown-it-katex` - Math rendering setup
  - highlight.js: `https://highlightjs.org/usage/` - Code highlighting integration
  - mermaid: `https://mermaid.js.org/intro/` - Diagram rendering
  - viz.js: `https://github.com/mdaines/viz-js` - Graphviz rendering
  - markdown-it security: `https://github.com/markdown-it/markdown-it/blob/master/docs/security.md` - HTML sanitization
  **Acceptance Criteria**:
  - [ ] markdown-it configured with all required plugins
  - [ ] HTML disabled in markdown-it configuration
  - [ ] Can render math: `$E = mc^2$` and `$$\int_0^\infty$$`
  - [ ] Can render code with syntax highlighting
  - [ ] Can render Mermaid diagrams
  - [ ] Can render Graphviz DOT diagrams
  - [ ] Can render GFM features (tables, footnotes, task lists, strikethrough)
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Math rendering with KaTeX
    Tool: Bash
    Preconditions: Rendering function exists
    Steps:
      1. Create test file with math: `echo "Inline: \$E = mc^2\$\n\nBlock: \$\$\\int_0^\\infty e^{-x} dx\$\$" > /tmp/math.md`
      2. Start server
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/math.md"`
      4. Assert response contains KaTeX HTML (class="katex" or similar)
      5. Kill server
    Expected Result: Math formulas rendered with KaTeX
    Failure Indicators: Raw LaTeX in output, no KaTeX classes
    Evidence: .sisyphus/evidence/task-5-math-rendering.txt
  Scenario: Code syntax highlighting
    Tool: Bash
    Preconditions: Rendering function exists
    Steps:
      1. Create test file: `echo '```javascript\nconsole.log("test");\n```' > /tmp/code.md`
      2. Start server
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/code.md"`
      4. Assert response contains highlight.js classes (hljs or language-javascript)
      5. Kill server
    Expected Result: Code block has syntax highlighting classes
    Failure Indicators: Plain <pre><code> without highlighting
    Evidence: .sisyphus/evidence/task-5-code-highlight.txt
  Scenario: Mermaid diagram rendering
    Tool: Bash
    Preconditions: Rendering function exists
    Steps:
      1. Create test file: `echo '```mermaid\ngraph TD\nA-->B\n```' > /tmp/mermaid.md`
      2. Start server
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/mermaid.md"`
      4. Assert response contains mermaid class or data attribute
      5. Kill server
    Expected Result: Mermaid diagram markup present
    Failure Indicators: Plain code block, no mermaid classes
    Evidence: .sisyphus/evidence/task-5-mermaid.txt
  Scenario: HTML is blocked
    Tool: Bash
    Preconditions: Rendering function exists
    Steps:
      1. Create test file: `echo '<script>alert("XSS")</script>\n\n# Test' > /tmp/html.md`
      2. Start server
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/html.md"`
      4. Assert response does NOT contain "<script>" tag (should be escaped or removed)
      5. Kill server
    Expected Result: HTML tags blocked/escaped
    Failure Indicators: Raw <script> tag in output (XSS vulnerability)
    Evidence: .sisyphus/evidence/task-5-html-blocked.txt
  ```
  **Commit**: YES
  - Message: `feat(core): implement secure file reading and markdown rendering`
  - Files: `backend/server.ts`, `backend/renderer.ts` (or similar)
  - Pre-commit: `bun run build`
- [ ] 6. Frontend Markdown Display Component
  **What to do**:
  - Create React component `MarkdownViewer.tsx`
  - Parse URL query parameter `?path=...` to get file path
  - Fetch markdown content from backend API
  - Display file path at top of page
  - Display rendered HTML below file path
  - Handle loading state while fetching
  - Handle error state (404, network errors)
  - Load KaTeX CSS for math rendering
  - Load highlight.js CSS for code highlighting
  - Initialize Mermaid library for diagram rendering
  **Must NOT do**:
  - Do not add file path input field (URL-only access)
  - Do not add navigation or file browser
  - Do not add editing capabilities
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Frontend UI component with rendering logic
  - **Skills**: []
    - No specialized skills needed
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Tasks 3, 5)
  - **Blocks**: Task 7 (CSS styling needs component structure)
  - **Blocked By**: Task 3 (needs React app), Task 5 (needs rendering)
  **References**:
  **External References**:
  - React hooks: `https://react.dev/reference/react` - useState, useEffect for data fetching
  - KaTeX CSS: `https://katex.org/docs/browser.html` - Stylesheet inclusion
  - highlight.js themes: `https://highlightjs.org/static/demo/` - CSS theme selection
  - Mermaid initialization: `https://mermaid.js.org/config/setup/modules/mermaidAPI.html` - Browser setup
  **Acceptance Criteria**:
  - [ ] Component fetches file content from backend
  - [ ] Displays file path at top
  - [ ] Displays rendered markdown below
  - [ ] Shows loading state while fetching
  - [ ] Shows error message on failure
  - [ ] KaTeX CSS loaded
  - [ ] highlight.js CSS loaded
  - [ ] Mermaid initialized
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Component displays file path and content
    Tool: Bash (with curl to check HTML structure)
    Preconditions: Backend running, test file exists
    Steps:
      1. Create test file: `echo "# Test Content" > /tmp/display-test.md`
      2. Start server
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/display-test.md"`
      4. Assert response contains file path "/tmp/display-test.md"
      5. Assert response contains rendered content ("<h1>" or "Test Content")
      6. Kill server
    Expected Result: Both file path and rendered content visible in HTML
    Failure Indicators: Missing file path, missing content
    Evidence: .sisyphus/evidence/task-6-display-content.txt
  Scenario: Error handling for missing file
    Tool: Bash
    Preconditions: Backend running
    Steps:
      1. Start server
      2. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/nonexistent.md"`
      3. Assert response contains error message or 404
      4. Kill server
    Expected Result: Error displayed gracefully
    Failure Indicators: Blank page, crash
    Evidence: .sisyphus/evidence/task-6-error-handling.txt
  ```
  **Commit**: NO (groups with Task 7)
- [ ] 7. GitHub-Style CSS
  **What to do**:
  - Add CSS for GitHub-style markdown render - Style headings, paragraphs, lists, blockquotes
  - Style code blocks with proper padding and background
  - Style tables with borders
  - Style task lists with checkboxes
  - Add responsive layout (max-width, padding)
  - Ensure KaTeX formulas are properly styled
  - Ensure Mermaid diagrams are properly sized
  - Add file path styling at top (monospace font, gray background)
  **Must NOT do**:
  - Do not recreate entire GitHub UI (header, sidebar, etc.)
  - Do not add dark mode toggle
  - Do not add custom themes
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS styling for markdown content
  - **Skills**: []
    - No specialized skills needed
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 8)
  - **Parallel Group**: Wave 3 (after Task 6)
  - **Blocks**: Task 9 (final verification needs complete UI)
  - **Blocked By**: Task 6 (needs component structure)
  **References**:
  **External References**:
  - GitHub markdown CSS: `https://github.com/sindresorhus/github-markdown-css` - Reference styles
  - Primer CSS: `https://primer.style/css/` - GitHub's design system
  **Acceptance Criteria**:
  - [ ] Markdown content has GitHub-style appearance
  - [ ] Code blocks have proper styling
  - [ ] Tables have borders
  - [ ] File path has distinct styling
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Visual styling matches GitHub style
    Tool: Bash (check CSS classes/styles in HTML)
    Preconditions: Frontend built with CSS
    Steps:
      1. Create test file with various elements: headings, code, table
      2. Start server
      3. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/style-test.md"`
      4. Assert response contains CSS classes or inline styles
      5. Assert response contains stylesheet link or <style> tag
      6. Kill server
    Expected Result: HTML includes styling
    Failure Indicators: No CSS, unstyled content
    Evidence: .sisyphus/evidence/task-7-styling.txt
  ```
  **Commit**: YES
  - Message: `feat(ui): add GitHub-style CSS and markdown display component`
  - Files: `frontend/src/MarkdownViewer.tsx`, `frontend/src/styles.css`
  - Pre-commit: `bun run build:frontend`
- [ ] 8. Error Handling (404 Page)
  **What to do**:
  - Create simple 404 error page component
  - Display when file not found, invalid path, or non-.md file
  - Show clear error message explaining the issue
  - Include example of correct URL format
  - Style consistently with main app
  **Must NOT do**:
  - Do not add complex error tracking or logging
  - Do not add "report error" functionality
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple error page component
  - **Skills**: []
    - No specialized skills needed
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 7)
  - **Parallel Group**: Wave 3 (after Task 3)
  - **Blocks**: Task 9 (final verification needs error handling)
  - **Blocked By**: Task 3 (needs React app)
  **References**:
  **External References**:
  - HTTP status codes: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404` - 404 semantics
  **Acceptance Criteria**:
  - [ ] 404 page displays for invalid files
  - [ ] Error message is clear and helpful
  - [ ] Includes example URL format
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: 404 page displays for invalid file
    Tool: Bash
    Preconditions: Server running
    Steps:
      1. Start server
      2. Run `curl -s "http://127.0.0.1:3000/?path=/tmp/nonexistent.md"`
      3. Assert response contains "404" or "not found"
      4. Assert response contains helpful error message
      5. Kill server
    Expected Result: Clear 404 error page
    Failure Indicators: Blank page, generic error
    Evidence: .sisyphus/evidence/task-8-404-page.txt
  ```
  **Commit**: NO (groups with Task 7)
- [ ] 9. Integration Testing and Build Verification
  **What to do**:
  - Create comprehensive test markdown file with all features:
    - Headings (H1-H6)
    - Inline and block math formulas
    - Code blocks in multiple languages (JavaScript, Python, Bash)
    - Mermaid flowchart diagram
    - Graphviz DOT diagram
    - Table
    - Task list
    - Footnotes
    - Strikethrough
  - Test all security scenarios:
    - Path traversal attempts
    - Non-.md file access
    - Symlink to .md file (should work)
    - Symlink to non-.md file (should block)
  - Verify build process:
    - `bun install` succeeds
    - `bun run build` succeeds
    - `bun run start` succeeds with CLI args
  - Document any issues found and fix them
  **Must NOT do**:
  - Do not create automated test framework
  - Do not add CI/CD pipeline
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Comprehensive integration testing requiring thorough verification
  - **Skills**: []
    - No specialized skills needed
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after all implementation tasks)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: Tasks 4, 5, 6, 7, 8 (needs complete implementation)
  **References**:
  **External References**:
  - None (integration testing uses all previous work)
  **Acceptance Criteria**:
  - [ ] Test file with all features renders correctly
  - [ ] All security checks pass
  - [ ] Build process completes without errors
  - [ ] Server starts with custom host/port
  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Comprehensive feature test
    Tool: Bash
    Preconditions: Complete implementation
    Steps:
      1. Create comprehensive test file with all markdown features
      2. Start server
      3. Fetch rendered content: `curl -s "http://127.0.0.1:3000/?path=/tmp/comprehensive.md"`
      4. Assert math rendered (KaTeX classes present)
      5. Assert code highlighted (hljs classes present)
      6. Assert Mermaid diagram present
      7. Assert table rendered
      8. Assert task list rendered
      9. Kill server
    Expected Result: All features render correctly
    Failure Indicators: Any feature missing or broken
    Evidence: .sisyphus/evidence/task-9-comprehensive.txt
  Scenario: Security validation
    Tool: Bash
    Preconditions: Server running
    Steps:
      1. Test path traversal: `curl -s "http://127.0.0.1:3000/?path=../../etc/passwd"`
      2. Assert 404 response
      3. Test non-.md file: `curl -s "http://127.0.0.1:3000/?path=/etc/hosts"`
      4. Assert 404 response
      5. Create symlink to .md: `ln -s /tmp/real.md /tmp/link.md`
      6. Test symlink: `curl -s "http://127.0.0.1:3000/?path=/tmp/link.md"`
      7. Assert success (symlink to .md works)
      8. Create bad symlink: `ln -s /etc/passwd /tmp/bad.md`
      9. Test bad symlink: `curl -s "http://127.0.0.1:3000/?path=/tmp/bad.md"`
      10. Assert 404 (symlink to non-.md blocked)
    Expected Result: All security checks pass
    Failure Indicators: Any security check fails
    Evidence: .sisyphus/evidence/task-9-security.txt
  Scenario: Build verification
    Tool: Bash
    Preconditions: Complete codebase
    Steps:
      1. Run `bun install` in project root
      2. Assert exit code 0
      3. Run `bun run build`
      4. Assert exit code 0, no TypeScript errors
      5. Run `bun run start --host 0.0.0.0 --port 8080 &`
      6. Wait 2 seconds
      7. Run `curl -s http://0.0.0.0:8080/health`
      8. Assert success
      9. Kill server
    Expected Result: Build and start succeed
    Failure Indicators: Build fails, server doesn't start
    Evidence: .sisyphus/evidence/task-9-build.txt
  ```
  **Commit**: YES
  - Message: `chore(verify): integration testing and build verification complete`
  - Files: None (verification only, may include test files in /tmp)
  - Pre-commit: `bun run build`
