# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

A blood pressure monitor app used as a hands-on vehicle for learning Playwright automation testing. Every sprint produces working code **and** Playwright tests. Each test maps directly to one acceptance criterion. See the sprint board at https://claude.ai/artifact/K1MD4C4Dd9QM3DoCo1E5YJ

## Commands

### API server (run from `api/`)
```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start without auto-restart
```

### Tests (run from `tests/`)
```bash
npm test                                      # Run all tests
npx playwright test api/readings.spec.js      # Run a single spec file
npx playwright test -g "creates a reading"    # Run a single test by name
npx playwright test --reporter=line           # Compact output
```

The Playwright config auto-starts the API server via `node ../api/src/index.js` with `NODE_ENV=test`. If the server is already running, it reuses it.

## Architecture

Two independent packages — `api/` and `tests/` — each with their own `package.json` and `node_modules`. They are not a monorepo; install dependencies separately in each folder.

### `api/src/`
- **`index.js`** — Express app, mounts `/api/readings`, exposes `POST /api/test/reset` when `NODE_ENV=test`, exports both `app` and `server`.
- **`store.js`** — In-memory array store (no database in Sprint 1). Methods: `getAll()`, `create()`, `delete(id)`, `reset()`. Each reading has `id`, `systolic`, `diastolic`, `pulse`, `timestamp` (ISO 8601).
- **`routes/readings.js`** — Three endpoints: `POST /api/readings` (201), `GET /api/readings` (200), `DELETE /api/readings/:id` (204/404).

### `tests/`
- **`playwright.config.js`** — `baseURL: http://localhost:3000`, single worker, 10 s timeout, auto-starts the server.
- **`api/readings.spec.js`** — API tests (no browser). Each `beforeEach` calls `/api/test/reset` to guarantee clean state.

### Test reset pattern
Tests call `POST /api/test/reset` in `beforeEach` to clear the store. This endpoint only exists when `NODE_ENV=test` (set automatically by the Playwright config).

## Definition of Done

A story is done when: code runs without errors, all ACs are manually verified, a Playwright test exists for each AC, all tests pass, and the developer can explain what each test does.
