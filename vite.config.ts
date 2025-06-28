import { createRequire } from 'module'
import path from 'path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type Plugin } from 'vite'
import { imagetools } from 'vite-imagetools'
import { randomBytes } from 'crypto'
const require = createRequire(import.meta.url)
let compressPlugin: (() => unknown) | null = null
if (process.env.USE_COMPRESS_PLUGIN === 'true') {
  try {
    compressPlugin = require('vite-plugin-compress').default
  } catch {
    compressPlugin = null
  }
}

const manualChunks = (id: string) =>
  id.includes('node_modules') ? 'vendor' : undefined

export function createDevHeaders(nonce: string) {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' https://cdn.jsdelivr.net 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.artofficial-intelligence.com ws:"
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000'
  } as const
}

export function createDevNoncePlugin(nonce: string): Plugin {
  return {
    name: 'dev-html-nonce',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace(/__CSP_NONCE__/g, nonce)
    }
  }
}

export default defineConfig(({ mode }) => {
  const plugins = [react(), imagetools()]
  if (compressPlugin) plugins.push(compressPlugin())
  if (mode === 'analyze')
    plugins.push(visualizer({ open: true, gzipSize: true, brotliSize: true }))

  let headers: Record<string, string> | undefined
  if (mode === 'development') {
    const nonce = randomBytes(16).toString('base64')
    headers = createDevHeaders(nonce)
    plugins.push(createDevNoncePlugin(nonce))
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks
        }
      }
    },
    server: {
      port: 3000,
      open: true,
      ...(headers ? { headers } : {})
    }
  }
})
