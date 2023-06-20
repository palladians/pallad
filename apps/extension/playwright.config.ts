import { defineConfig, devices } from '@playwright/test'

const BASE_URL = 'http://localhost:4173/'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 400,
          height: 600
        }
      }
    }
  ],
  webServer: {
    command: 'yarn preview',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI
  }
})
