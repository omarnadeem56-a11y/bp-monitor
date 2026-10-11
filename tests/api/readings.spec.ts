import { test, expect } from '@playwright/test'

// ─── Story 1.1: Log a reading ────────────────────────────────────────────────

test.describe('Story 1.1 — Log a reading', () => {

  test.beforeEach(async ({ request }) => {
    await request.post('/api/test/reset')
  })

  // AC1 + AC2: POST with valid data returns 201 and a body containing an id
  test('creates a reading', async ({ request }) => {
    // Arrange: nothing to set up — a POST needs no prior data

    // Act
    const response = await request.post('/api/readings', {
      data: { systolic: 120, diastolic: 80, pulse: 70 }
    })

    // Assert
    expect(response.status()).toBe(201)       // AC1
    const body = await response.json()
    expect(body).toHaveProperty('id')         // AC2
  })

  // AC3: POST with missing systolic returns 400
  test('rejects missing systolic', async ({ request }) => {
    const response = await request.post('/api/readings', {
      data: { diastolic: 80, pulse: 70 }
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

// ─── Story 1.2: View all readings ────────────────────────────────────────────

test.describe('Story 1.2 — View all readings', () => {

  test.beforeEach(async ({ request }) => {
    await request.post('/api/test/reset')
  })

  test('returns readings list', async ({ request }) => {
    const response = await request.get('/api/readings')

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toEqual([])
  })

  test('saved reading appears in list', async ({ request }) => {
    // Arrange
    await request.post('/api/readings', {
      data: { systolic: 120, diastolic: 80, pulse: 70 }
    })

    // Act
    const response = await request.get('/api/readings')
    const body = await response.json()

    // Assert
    expect(body).toHaveLength(1)
  })

  test('deletes a reading', async ({ request }) => {
    // Arrange
    const postResponse = await request.post('/api/readings', {
      data: { systolic: 120, diastolic: 80, pulse: 70 }
    })
    const created = await postResponse.json()

    // Act
    const response = await request.delete(`/api/readings/${created.id}`)

    // Assert
    expect(response.status()).toBe(204)
  })

  test('returns 404 for unknown id', async ({ request }) => {
    const response = await request.delete('/api/readings/9999')

    expect(response.status()).toBe(404)
  })

})
