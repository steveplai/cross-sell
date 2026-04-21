import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/internal/playwright',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node scripts/serve-static.mjs 4174',
    url: 'http://127.0.0.1:4174/examples/web-component/demo-product-banner.basic.html',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
