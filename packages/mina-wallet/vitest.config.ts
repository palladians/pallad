import { baseVitestConfig } from '@palladxyz/common'
import { defineConfig } from 'vitest/config' // eslint-disable-line import/no-extraneous-dependencies

export default defineConfig({
  ...baseVitestConfig,
  test: {
    environment: 'happy-dom',
    testTimeout: 10000,
    globals: true,
    threads: false
  }
})
