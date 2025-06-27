import { createRequire } from 'module'
import path from 'path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
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

export default defineConfig(({ mode }) => {
  const plugins = [react(), imagetools()]
  if (compressPlugin) plugins.push(compressPlugin())
  if (mode === 'analyze')
    plugins.push(visualizer({ open: true, gzipSize: true, brotliSize: true }))

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
      open: true
    }
  }
})
