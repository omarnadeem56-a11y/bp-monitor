import { test, expect } from '@playwright/test'
import { LogPage } from '../pages/LogPage'
import { HistoryPage } from '../pages/HistoryPage'

// ─── Story 2.1: Log a reading via form ───────────────────────────────────────

test.describe('Story 2.1 — Log a reading via form', () => {
  let log: LogPage

  test.beforeEach(async ({ request, page }) => {
    await request.post('/api/test/reset')
    log = new LogPage(page)
    await log.goto()
  })

  test('has input fields for systolic, diastolic and pulse', async ({ page }) => {
    await expect(log.systolicInput).toBeVisible()
    await expect(log.diastolicInput).toBeVisible()
    await expect(log.pulseInput).toBeVisible()
  })

  test('shows success on valid submission', async ({ page }) => {
    await log.logReading(120, 80, 70)
    await expect(log.successMessage).toBeVisible()
  })

  test('shows error on empty submit', async ({ page }) => {
    await log.submit()
    await expect(log.errorMessage).toBeVisible()
  })

  test('form clears after successful submission', async ({ page }) => {
    await log.fillForm(120, 80, 70)
    await log.submit()

    await expect(log.systolicInput).toHaveValue('')
    await expect(log.diastolicInput).toHaveValue('')
    await expect(log.pulseInput).toHaveValue('')
  })
})

// ─── Story 2.2: View reading history ─────────────────────────────────────────

test.describe('Story 2.2 — View reading history', () => {
  let log: LogPage
  let historyPage: HistoryPage

  test.beforeEach(async ({ request, page }) => {
    await request.post('/api/test/reset')
    log = new LogPage(page)
    historyPage = new HistoryPage(page)
    await log.goto()
  })

  test('history list shows after page loads', async ({ page }) => {
      await expect(historyPage.readingList).toBeAttached()
  })

  test('new reading appears in history after submission', async ({ page }) => {
    await log.fillForm(120, 80, 70)
    await log.submit()

      await expect(historyPage.readings()).toHaveCount(1)
  })

  test('reading contains text for systolic, diastolic and pulse', async ({ page }) => {
    await log.fillForm(120, 80, 70);
    await log.submit()

    await expect(historyPage.readingAt(0)).toContainText('120/80')
    await expect(historyPage.readingAt(0)).toContainText('70')
  })
})

// ─── Story 2.3: Reading categories ───────────────────────────────────────────

 test.describe('Story 2.3 — Reading categories', () => {
    let log: LogPage
    let historyPage: HistoryPage                                                                                                                                                                         
   
    test.beforeEach(async ({ request, page }) => {                                                                                                                                                       
      await request.post('/api/test/reset')                                                                                                                                                            
      log = new LogPage(page)
      historyPage = new HistoryPage(page)
      await log.goto()
    })

    test('optimal reading', async () => {
      await log.logReading(110, 70, 70)
      await expect(historyPage.readingAt(0)).toHaveClass('reading-item category-optimal')
    })

    test('normal reading', async () => {
      await log.logReading(125, 82, 70)
      await expect(historyPage.readingAt(0)).toHaveClass('reading-item category-normal')
    })

    test('high normal reading', async () => {
      await log.logReading(132, 86, 70)
      await expect(historyPage.readingAt(0)).toHaveClass('reading-item category-high-normal')
    })

    test('stage 1 hypertension', async () => {
      await log.logReading(145, 92, 70)
      await expect(historyPage.readingAt(0)).toHaveClass('reading-item category-stage1')
    })

    test('stage 2 hypertension', async () => {
      await log.logReading(165, 105, 70)
      await expect(historyPage.readingAt(0)).toHaveClass('reading-item category-stage2')
    })

    test('severe hypertension', async () => {
      await log.logReading(185, 125, 70)
      await expect(historyPage.readingAt(0)).toHaveClass('reading-item category-severe')
    })
  })