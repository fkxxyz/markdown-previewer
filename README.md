# Markdown Previewer

本地 Markdown 预览器，支持数学公式、流程图、Graphviz 等扩展语法。

## 功能特性

- **数学公式渲染**：支持 KaTeX 行内和块级公式
- **流程图支持**：Mermaid 图表（流程图、时序图、甘特图等）
- **Graphviz 渲染**：DOT 语言图形可视化
- **代码高亮**：基于 highlight.js
- **扩展语法**：任务列表、脚注、锚点等
- **安全设计**：路径遍历保护，仅允许读取 .md 文件

## 技术栈

- **前端**：React + Vite + TypeScript
- **后端**：Bun + markdown-it
- **渲染引擎**：
  - KaTeX（数学公式）
  - Mermaid（流程图）
  - @viz-js/viz（Graphviz）
  - highlight.js（代码高亮）

## 安装

```bash
# 安装依赖
bun install
```

## 开发模式

```bash
# 启动开发服务器（前端 + 后端）
bun run dev
```

前端运行在 `http://localhost:5173`，后端运行在 `http://127.0.0.1:3000`。

访问示例：
```
http://localhost:5173/?path=/path/to/your/file.md
```

## 生产模式

```bash
# 构建前端
bun run build

# 启动后端服务器
bun backend/server.ts

# 自定义端口和主机
bun backend/server.ts --host 0.0.0.0 --port 8080
```

访问示例：
```
http://127.0.0.1:3000/?path=/path/to/your/file.md
```

## 使用说明

通过 URL 参数 `path` 指定要预览的 Markdown 文件路径：

```
http://localhost:5173/?path=/absolute/path/to/file.md
```

### 支持的语法

**数学公式**：
```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**Mermaid 流程图**：
````markdown
```mermaid
graph TD
    A[开始] --> B{判断}
    B -->|是| C[执行]
    B -->|否| D[结束]
```
````

**Graphviz 图形**：
````markdown
```dot
digraph G {
  A -> B;
  B -> C;
  C -> A;
}
```
````

**任务列表**：
```markdown
- [x] 已完成任务
- [ ] 未完成任务
```

## 项目结构

```
markdown-previewer/
├── backend/              # 后端服务
│   ├── server.ts        # HTTP 服务器
│   └── renderer.ts      # Markdown 渲染引擎
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── App.tsx
│   │   ├── MarkdownViewer.tsx
│   │   └── styles.css
│   └── dist/           # 构建输出
├── package.json        # 根配置（monorepo）
└── README.md
```

## API 端点

### `GET /?path={filepath}`

渲染指定路径的 Markdown 文件。

**请求头**：
- `Accept: application/json` - 返回 JSON 格式
- `Accept: text/html` - 返回前端 HTML（浏览器访问）

**响应**（JSON）：
```json
{
  "path": "/absolute/path/to/file.md",
  "content": "<h1>Rendered HTML</h1>..."
}
```

**错误响应**：
```json
{
  "error": "Error message"
}
```

### `GET /health`

健康检查端点，返回 `OK`。

## 安全说明

- 仅允许读取 `.md` 扩展名的文件
- 自动解析符号链接并验证真实路径
- 防止路径遍历攻击
- CORS 已启用，支持跨域访问

## 许可证

MIT
