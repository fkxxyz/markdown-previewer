import { join, resolve, normalize, extname, dirname } from 'path';
import { existsSync, readFileSync, statSync, realpathSync } from 'fs';
import { renderMarkdown } from './renderer';

// Parse CLI arguments
function parseArgs(): { host: string; port: number } {
  const args = process.argv.slice(2);
  let host = "127.0.0.1";
  let port = 3000;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--host" && args[i + 1]) {
      host = args[i + 1];
      i++;
    } else if (args[i] === "--port" && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { host, port };
}

const { host, port } = parseArgs();

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Get frontend dist path
const frontendDistPath = join(import.meta.dir, '../frontend/dist');

// Serve static file
function serveStatic(filePath: string): Response | null {
  if (!existsSync(filePath)) return null;
  
  try {
    const stat = statSync(filePath);
    if (stat.isDirectory()) return null;
    
    const file = readFileSync(filePath);
    const ext = filePath.split('.').pop() || '';
    
    const mimeTypes: Record<string, string> = {
      'html': 'text/html',
      'js': 'application/javascript',
      'css': 'text/css',
      'json': 'application/json',
      'svg': 'image/svg+xml',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'gif': 'image/gif',
    };
    
    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        ...corsHeaders,
      },
    });
  } catch {
    return null;
  }
}

// HTTP server
const server = Bun.serve({
  host,
  port,
  fetch(req: Request) {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === "/health") {
      return new Response("OK", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          ...corsHeaders,
        },
      });
    }

    // File reading endpoint with security validation
    if (url.searchParams.has('path')) {
      // Check if this is an API request (fetch) vs browser navigation
      const acceptHeader = req.headers.get('accept') || '';
      const isApiRequest = acceptHeader.includes('application/json') || !acceptHeader.includes('text/html');
      
      // If browser navigation, serve frontend HTML
      if (!isApiRequest) {
        const response = serveStatic(join(frontendDistPath, 'index.html'));
        if (response) return response;
      }
      
      // API request - return JSON
      const requestedPath = url.searchParams.get('path');
      if (!requestedPath) {
        return new Response(JSON.stringify({ error: 'Invalid path parameter' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      try {
        // Normalize and resolve path to prevent traversal
        const normalizedPath = normalize(requestedPath);
        const resolvedPath = resolve(normalizedPath);

        // Check if file exists
        if (!existsSync(resolvedPath)) {
          return new Response(JSON.stringify({ error: 'File not found' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }

        // Resolve symlinks to get real path
        const realPath = realpathSync(resolvedPath);

        // Check extension on RESOLVED path (after symlink resolution)
        const ext = extname(realPath);
        if (ext !== '.md') {
          return new Response(JSON.stringify({ error: 'Only .md files are allowed' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }

        // Check if it's a file (not directory)
        const stat = statSync(realPath);
        if (!stat.isFile()) {
          return new Response(JSON.stringify({ error: 'Path is not a file' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }

        // Read file content
        const content = readFileSync(realPath, 'utf-8');

        // Render markdown to HTML
        const htmlContent = renderMarkdown(content);

        // Return JSON with resolved path and rendered HTML
        return new Response(JSON.stringify({ path: realPath, basePath: dirname(realPath), content: htmlContent }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (error) {
        // Catch any file system errors
        return new Response(JSON.stringify({ error: 'Failed to read file' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    }

    // Serve frontend static files
    let filePath = join(frontendDistPath, url.pathname);
    
    // Try exact file first
    let response = serveStatic(filePath);
    if (response) return response;
    
    // If directory, try index.html
    if (url.pathname === '/' || url.pathname.endsWith('/')) {
      response = serveStatic(join(frontendDistPath, 'index.html'));
      if (response) return response;
    }
    
    // Fallback to index.html for SPA routing
    response = serveStatic(join(frontendDistPath, 'index.html'));
    if (response) return response;

    // 404 for other routes
    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
});

console.log(`Server running at http://${host}:${port}`);
