// index.js — application entry point
//
// This file:
//   1. Creates the Express app
//   2. Registers middleware (express.json parses request bodies)
//   3. Mounts the readings routes at /api/readings
//   4. Adds a test-only reset endpoint (only active when NODE_ENV=test)
//   5. Starts the server

const express = require('express')
const cors = require('cors')
const readingsRouter = require('./routes/readings')
const store = require('./store')

const app = express()

// Allow requests from Expo Web (port 8081) and the web UI (same origin).
// Without this the browser blocks cross-origin fetch calls.
app.use(cors())

// Parse incoming JSON request bodies
// Without this, req.body would be undefined
app.use(express.json())

// Serve the web UI from the public/ folder
app.use(express.static(require('path').join(__dirname, '../public')))

// Mount the readings routes
// All routes in readings.js are now prefixed with /api/readings
app.use('/api/readings', readingsRouter)

// ─── Test-only reset endpoint ─────────────────────────────────────────────────
//
// POST /api/test/reset
//
// Playwright tests call this in beforeEach to wipe all data before each test.
// This ensures tests are isolated — one test's data can't affect another.
//
// Only available when NODE_ENV=test so it can never be used in production.

if (process.env.NODE_ENV === 'test') {
  app.post('/api/test/reset', (req, res) => {
    store.reset()
    return res.status(200).json({ ok: true })
  })
}

// Start the server
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

// Export both app and server so Playwright can start/stop the server in tests
module.exports = { app, server }
