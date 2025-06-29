import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: [
      './tests/setup/integration-setup.ts',
      './tests/setup/service-worker-mock.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/lib/**/*.ts',
        'src/server.ts',
        'src/server/**/*.ts'
      ],
      exclude: ['src/components/ui/index.ts'],
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80
    }
  }
})
