import { join } from 'path';
import { existsSync, readFileSync, statSync } from 'fs';

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
