import { Page, Locator } from '@playwright/test'

// Page — the Playwright type for a browser tab
// Locator — the type for a selector (what page.locator() returns)
// TypeScript forces us to declare what type each property is up front,
// which means your editor knows what methods are available on each one.

export class LogPage {
  readonly page: Page

  readonly systolicInput: Locator
  readonly diastolicInput: Locator
  readonly pulseInput: Locator
  readonly submitButton: Locator
  readonly successMessage: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page

    this.systolicInput  = page.locator('#systolic')
    this.diastolicInput = page.locator('#diastolic')
    this.pulseInput     = page.locator('#pulse')
    this.submitButton   = page.locator('button[type="submit"]')
    this.successMessage = page.locator('#success-message')
    this.errorMessage   = page.locator('#error-message')
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  // Fill the three inputs without submitting.
  async fillForm(systolic: number, diastolic: number, pulse: number): Promise<void> {
    await this.systolicInput.fill(String(systolic))
    await this.diastolicInput.fill(String(diastolic))
    await this.pulseInput.fill(String(pulse))
  }

  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  // Fill + submit in one call — what most tests want.
  async logReading(systolic: number, diastolic: number, pulse: number): Promise<void> {
    await this.fillForm(systolic, diastolic, pulse)
    await this.submit()
  }
}
