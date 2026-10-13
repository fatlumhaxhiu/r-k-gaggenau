import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests', testMatch: 'consent-leads.spec.ts', workers: 1, timeout: 90000,
  use: { baseURL: 'http://127.0.0.1:3117', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  outputDir: '.local-tests/tracking-results',
  reporter: [['list'], ['html', { outputFolder: '.local-tests/tracking-report', open: 'never' }]],
})
