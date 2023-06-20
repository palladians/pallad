// https://playwright.dev/docs/pom
import { Page } from '@playwright/test'

export class BasePom {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
