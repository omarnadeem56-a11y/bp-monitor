// playwright.config.js — Playwright configuration
//
// This file controls how Playwright runs your tests.
// Key concepts explained below.

const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  // Where to look for test files (relative to this config file)
  testDir: '.',

  // Output test results as a plain list in the terminal.
  // Without this, Playwright tries to open an HTML report in a browser window
  // after each run, which hangs in Git Bash on Windows.
  reporter: 'list',

  // Run tests one at a time (easier to follow when learning)
  // Change to workers: 4 later when you want speed
  workers: 1,

  // How long a single test can run before it times out (10 seconds)
  timeout: 10000,

  use: {
    // The base URL for all requests in tests.
    // When you write request.get('/api/readings') in a test,
    // Playwright prepends this, making it http://127.0.0.1:3000/api/readings
    baseURL: 'http://127.0.0.1:3000',
    // Record a trace for every test. View it after a run with:
    //   npx playwright show-trace test-results/<test-name>/trace.zip
    trace: 'on'
  },

  // webServer: Playwright starts this command before running tests,
  // and shuts it down when tests finish.
  // This means you don't have to manually start the API in a separate terminal.
  webServer: {
    command: 'node ../api/src/index.js',
    // Use port instead of url — Playwright just checks if the TCP port is open,
    // which is more reliable than making an HTTP request to detect readiness.
    port: 3000,
    // If the server is already running (e.g. you started it manually),
    // Playwright will reuse it instead of starting a new one.
    reuseExistingServer: true,
    // Set NODE_ENV=test so the /api/test/reset endpoint is available
    env: {
      NODE_ENV: 'test'
    },
    // Pipe server output so Playwright can detect when it is ready
    // and so errors from the server are visible in the terminal
    stdout: 'pipe',
    stderr: 'pipe',
    // Give up after 30 seconds if the server never starts
    timeout: 30000
  }
})
