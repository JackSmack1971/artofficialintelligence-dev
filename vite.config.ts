import { randomBytes } from 'crypto'
import { createRequire } from 'module'
import path from 'path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { type Plugin, defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import { VitePWA } from 'vite-plugin-pwa'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
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
      `script-src 'self' 'nonce-${nonce}'`,
      `script-src-elem 'self' https://cdn.jsdelivr.net https://plausible.io 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.artofficial-intelligence.com ws:",
      "require-sri-for script style"
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
  const plugins = [
    react(),
    imagetools(),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      injectRegister: false,
      workbox: { cacheId: `aio-${pkg.version}`, cleanupOutdatedCaches: true },
      manifest: {
        name: 'ArtOfficial Intelligence',
        short_name: 'AI News',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#111827'
      }
    })
  ]
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
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
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
