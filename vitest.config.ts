import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.ts'],
      exclude: []
    }
  }
})
