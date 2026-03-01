import React, { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import { instance } from '@viz-js/viz'
import './styles.css'

interface ApiResponse {
  path: string
  basePath: string
  content: string
}

interface ApiError {
  error: string
}

export function MarkdownViewer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [basePath, setBasePath] = useState<string | null>(null)
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    // Detect system theme preference
    const updateTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }

    // Initial theme detection
    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => updateTheme()
    mediaQuery.addEventListener('change', handleChange)

    // Load external CSS for KaTeX and highlight.js
    const katexLink = document.createElement('link')
    katexLink.rel = 'stylesheet'
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css'
    document.head.appendChild(katexLink)

    const highlightLink = document.createElement('link')
    highlightLink.rel = 'stylesheet'
    highlightLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
    document.head.appendChild(highlightLink)

    const highlightDarkLink = document.createElement('link')
    highlightDarkLink.rel = 'stylesheet'
    highlightDarkLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
    highlightDarkLink.media = '(prefers-color-scheme: dark)'
    document.head.appendChild(highlightDarkLink)

    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: true })

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      document.head.removeChild(katexLink)
      document.head.removeChild(highlightLink)
      document.head.removeChild(highlightDarkLink)
    }
  }, [])

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        // Parse URL query parameter
        const params = new URLSearchParams(window.location.search)
        const path = params.get('path')

        if (!path) {
          setError('No file path provided. Example: ?path=/path/to/file.md')
          setLoading(false)
          return
        }

        // Fetch from backend
        const backendUrl = import.meta.env.DEV ? 'http://127.0.0.1:3000' : '';
        const response = await fetch(`${backendUrl}/?path=${encodeURIComponent(path)}`, {
          headers: {
            'Accept': 'application/json',
          },
        })
        
        if (!response.ok) {
          const errorData: ApiError = await response.json()
          setError(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
          setLoading(false)
          return
        }

        const data: ApiResponse = await response.json()
        setFilePath(data.path)
        setBasePath(data.basePath)
        setHtmlContent(data.content)
        setLoading(false)

        // Re-run Mermaid after content is loaded
        setTimeout(async () => {
          mermaid.contentLoaded()
          
          // Render Graphviz diagrams
          const graphvizElements = document.querySelectorAll('.graphviz')
          const viz = await instance()
          
          graphvizElements.forEach((element) => {
            const dotCode = element.getAttribute('data-dot')
            if (dotCode) {
              try {
                const svg = viz.renderSVGElement(dotCode)
                element.innerHTML = ''
                element.appendChild(svg)
              } catch (err) {
                element.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red;">Graphviz Error: ${err instanceof Error ? err.message : 'Unknown error'}</div>`
              }
            }
          })
        }, 100)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error occurred')
        setLoading(false)
      }
    }

    fetchMarkdown()
  }, [])

  // Handle relative path link clicks
  useEffect(() => {
    if (!basePath) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hasAttribute('data-relative-path')) {
        e.preventDefault();
        const relativePath = link.getAttribute('data-relative-path');
        if (relativePath) {
          // Resolve relative path based on current file's directory
          const newPath = `${basePath}/${relativePath}`;
          // Navigate to new path
          window.location.href = `${window.location.pathname}?path=${encodeURIComponent(newPath)}`;
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [basePath]);

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          borderRadius: '4px',
          padding: '16px',
          color: 'var(--error-text)'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* File path display */}
      <div style={{
        backgroundColor: 'var(--bg-tertiary)',
        padding: '12px 20px',
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: '14px',
        color: 'var(--text-tertiary)',
        borderBottom: '1px solid var(--border-secondary)'
      }}>
        {filePath}
      </div>

      {/* Rendered markdown content */}
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
