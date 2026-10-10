// readings.spec.js — Playwright API tests for the /api/readings endpoints
//
// Sprint 1: no browser, just HTTP requests and responses.
// Every test maps to one acceptance criterion from the sprint board.

const { test, expect } = require('@playwright/test')

// ─── Story 1.1: Log a reading ────────────────────────────────────────────────

test.describe('Story 1.1 — Log a reading', () => {

  // beforeEach runs before EVERY test in this describe block.
  // It calls our test-only reset endpoint to wipe the database,
  // so each test starts with zero readings. Tests must not share state.
  test.beforeEach(async ({ request }) => {
    await request.post('/api/test/reset')
  })

  // AC1 + AC2: POST with valid data returns 201 and a body containing an id
  test('creates a reading', async ({ request }) => {
    // Arrange: nothing to set up — a POST needs no prior data

    // Act: send the request
    const response = await request.post('/api/readings', {
      data: { systolic: 120, diastolic: 80, pulse: 70 }
    })

    // Assert: check the ACs
    expect(response.status()).toBe(201)           // AC1
    const body = await response.json()
    expect(body).toHaveProperty('id')             // AC2
  })

  // AC3: POST with missing systolic returns 400
  test('rejects missing systolic', async ({ request }) => {
    const response = await request.post('/api/readings', {
      data: { diastolic: 80, pulse: 70 }          // systolic intentionally missing
    })

    expect(response.status()).toBe(400)
  })

  // AC4: POST with non-numeric values returns 400
  test('rejects invalid values', async ({ request }) => {
    const response = await request.post('/api/readings', {
      data: { systolic: 'abc', diastolic: 80, pulse: 70 }
    })

    expect(response.status()).toBe(400)
  })

})
                                                                                                                                                                                                     
test.describe('Story 1.2 — View all readings', () => {                                                                                                                                                 
                                                                                                                                                                                                         
    test.beforeEach(async ({ request }) => {                                                                                                                                                             
      await request.post('/api/test/reset')                                                                                                                                                            
    })

    test('returns readings list', async ({ request }) => {
      // Act
      const response = await request.get('/api/readings')

      // Assert
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(Array.isArray(body)).toBe(true)                                                                                                                                                                 
      expect(body).toEqual([])   
    })

 test('saved reading appears in list', async ({ request }) => {
    // Arrange: create a reading first
    const postResponse = await request.post('/api/readings', {
      data: { systolic: 120, diastolic: 80, pulse: 70 }
    })

    // Act: get the list
    const response = await request.get('/api/readings')
    const body = await response.json()

    // Assert: the reading we posted is now in the list
    expect(body).toHaveLength(1)
  })

   test('deletes a reading', async ({ request }) => {
    // Arrange: create a reading so we have an id to delete
    const postResponse = await request.post('/api/readings', {                                                                                                                                           
      data: { systolic: 120, diastolic: 80, pulse: 70 }
    })                                                                                                                                                                                                   
    const created = await postResponse.json()      

    // Act: delete it using the id from the response
    const response = await request.delete('/api/readings/' + created.id)

    // Assert
    expect(response.status()).toBe(204)
  })

   test('returns 404 for unknown id', async ({ request }) => {                                                                                                                                            
    // Act: try to delete an id that does not exist                                                                                                                                                    
    const response = await request.delete('/api/readings/9999')                                                                                                                                          
    console.log(await response.text())
    // Assert                                                                                                                                                                                            
    expect(response.status()).toBe(404)                                                                                                                                               
  })



  })