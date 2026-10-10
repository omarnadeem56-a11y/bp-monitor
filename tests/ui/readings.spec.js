const { test, expect } = require('@playwright/test')

// ─── Story 2.1: Log a reading via form ───────────────────────────────────────

test.describe('Story 2.1 — Log a reading via form', () => {
  test.beforeEach(async ({ request, page }) => {
    await request.post('/api/test/reset')
    await page.goto('/')
  })

  test('has input fields for systolic, diastolic and pulse', async ({ page }) => {
    await expect(page.locator('#systolic')).toBeVisible()
    await expect(page.locator('#diastolic')).toBeVisible()
    await expect(page.locator('#pulse')).toBeVisible()
  })

  test('shows success on valid submission', async ({ page }) => {
    await page.fill('#systolic', '120')
    await page.fill('#diastolic', '80')
    await page.fill('#pulse', '70')
    await page.click('button[type="submit"]')

    await expect(page.locator('#success-message')).toBeVisible()
  })

  test('shows error on empty submit', async ({ page }) => {
    await page.click('button[type="submit"]')

    await expect(page.locator('#error-message')).toBeVisible()
  })

  test('form clears after successful submission', async ({ page }) => {
    await page.fill('#systolic', '120')
    await page.fill('#diastolic', '80')
    await page.fill('#pulse', '70')
    await page.click('button[type="submit"]')

    await expect(page.locator('#systolic')).toHaveValue('')
    await expect(page.locator('#diastolic')).toHaveValue('')
    await expect(page.locator('#pulse')).toHaveValue('')
  })
})

// ─── Story 2.2: View reading history ─────────────────────────────────────────

test.describe('Story 2.2 — View reading history', () => {
  test.beforeEach(async ({ request, page }) => {
    await request.post('/api/test/reset')
    await page.goto('/')
  })

  test('history list shows after page loads', async ({ page }) => {
    await expect(page.locator('#reading-list')).toBeAttached()
  })

  test('new reading appears in history after submission', async ({ page }) => {
    await page.fill('#systolic', '120')
    await page.fill('#diastolic', '80')
    await page.fill('#pulse', '70')
    await page.click('button[type="submit"]')

    await expect(page.locator('.reading-item')).toHaveCount(1)
  })

  test('reading contains text for systolic, diastolic and pulse', async ({ page }) => {
    const systolic = '120'
    const diastolic = '80'
    const pulse = '70'

    await page.fill('#systolic', systolic)
    await page.fill('#diastolic', diastolic)
    await page.fill('#pulse', pulse)
    await page.click('button[type="submit"]')

    await expect(page.locator('.reading-item')).toContainText(`${systolic}/${diastolic}`)
    await expect(page.locator('.reading-item')).toContainText(`pulse ${pulse}`)
  })

})
  
 test.describe('Story 2.3 — Reading categories', () => {                                                                                                                                                
                                                                                                                                                                                                       
    test.beforeEach(async ({ request, page }) => {                                                                                                                                                       
      await request.post('/api/test/reset')
      await page.goto('/')                                                                                                                                                                               
    })                                                                                                                                                                                                 

    test('normal reading is green', async ({ page }) => {
      await page.fill('#systolic', '110')
      await page.fill('#diastolic', '70')
      await page.fill('#pulse', '70')
      await page.click('button[type="submit"]')

      await expect(page.locator('.reading-item')).toHaveClass('reading-item category-normal')
    })

    test('elevated reading is yellow', async ({ page }) => {
      await page.fill('#systolic', '125')
      await page.fill('#diastolic', '70')                                                                                                                                                                  
      await page.fill('#pulse', '70')                                                                                                                                                                    
      await page.click('button[type="submit"]')

      await expect(page.locator('.reading-item')).toHaveClass('reading-item category-elevated')
    })

    test('elevated reading is red', async ({ page }) => {
    await page.fill('#systolic', '140')                                                                                                                                                                
    await page.fill('#diastolic', '90')                                                                                                                                                                  
    await page.fill('#pulse', '70')
    await page.click('button[type="submit"]')                                                                                                                                                            
                                                                                                                                                                                                       
    await expect(page.locator('.reading-item')).toHaveClass('reading-item category-high')


  })
 })
  



