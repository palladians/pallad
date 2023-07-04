import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    testTimeout: 30000,
    globals: true
  }
})
