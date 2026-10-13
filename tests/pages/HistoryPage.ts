import { Page, Locator } from '@playwright/test'

export class HistoryPage {
  readonly page: Page
  readonly readingList: Locator

  constructor(page: Page) {
    this.page = page
    this.readingList = page.locator('#reading-list')
  }

  // All reading items — chain expect() directly on this
  readings(): Locator {
    return this.page.locator('.reading-item')
  }

  // One reading by zero-based index
  readingAt(index: number): Locator {
    return this.readings().nth(index)
  }

  readingListIsVisible(): Promise<boolean> {
    return this.page.locator('#reading-list').isVisible()
  }
}
