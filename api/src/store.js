// store.js — in-memory data store
//
// In a real app this would be a database. For Sprint 1 we use a plain array
// so we can focus on the API routes and Playwright tests without any DB setup.
//
// The reset() function is called by our tests before each test runs,
// ensuring every test starts with a clean slate (no leftover data).

let readings = []
let nextId = 1

module.exports = {
  // Return a copy of all readings
  getAll() {
    return [...readings]
  },

  // Create a new reading and return it with its assigned id
  create({ systolic, diastolic, pulse }) {
    const reading = {
      id: nextId++,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: Number(pulse),
      timestamp: new Date().toISOString()
    }
    readings.push(reading)
    return reading
  },

  // Delete a reading by id — returns true if found, false if not
  delete(id) {
    const index = readings.findIndex(r => r.id === id)
    if (index === -1) return false
    readings.splice(index, 1)
    return true
  },

  // Wipe all data — used by tests only
  reset() {
    readings = []
    nextId = 1
  }
}
