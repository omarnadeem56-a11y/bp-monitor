// routes/readings.js — the blood pressure reading endpoints
//
// This file defines three routes:
//   POST   /api/readings       — Story 1.1: log a reading
//   GET    /api/readings       — Story 1.2: get all readings
//   DELETE /api/readings/:id   — Story 1.3: delete a reading
//
// Each route maps directly to user stories in the sprint board.

const express = require('express')
const store = require('../store')

const router = express.Router()

// ─── Story 1.1: Log a reading ────────────────────────────────────────────────
//
// POST /api/readings
// Body: { systolic, diastolic, pulse }
//
// Returns 201 + the saved reading on success
// Returns 400 if required fields are missing or not numbers

router.post('/', (req, res) => {
  const { systolic, diastolic, pulse } = req.body

  // AC3: reject if any field is missing
  if (systolic == null || diastolic == null || pulse == null) {
    return res.status(400).json({
      error: 'systolic, diastolic and pulse are required'
    })
  }

  // AC4: reject if any field is not a valid number
  if (isNaN(Number(systolic)) || isNaN(Number(diastolic)) || isNaN(Number(pulse))) {
    return res.status(400).json({
      error: 'systolic, diastolic and pulse must be numbers'
    })
  }
  // AC1 + AC2: create the reading and return it with 201 Created
  const reading = store.create({ systolic, diastolic, pulse })
  return res.status(201).json(reading)
})

// ─── Story 1.2: View all readings ────────────────────────────────────────────
//
// GET /api/readings
//
// Returns 200 + array of all readings (empty array if none exist)

router.get('/', (req, res) => {
  return res.status(200).json(store.getAll())
})

// ─── Story 1.3: Delete a reading ─────────────────────────────────────────────
//
// DELETE /api/readings/:id
// :id is the reading id in the URL, e.g. /api/readings/3
//
// Returns 204 No Content on success (no body — nothing to return after delete)
// Returns 404 if the reading doesn't exist

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const deleted = store.delete(id)

  if (!deleted) {
    return res.status(404).json({ error: 'Reading not found' })
  }

  return res.status(204).send()
})

module.exports = router
