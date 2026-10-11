import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  reporter: 'list',
  workers: 1,
  timeout: 10000,

  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on',
  },

  webServer: {
    command: 'node ../api/src/index.js',
    port: 3000,
    reuseExistingServer: true,
    env: { NODE_ENV: 'test' },
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 30000,
  },
})
