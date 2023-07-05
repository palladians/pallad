// https://playwright.dev/docs/pom
import { Page } from '@playwright/test'

export class BasePom {
  readonly page: Page
  readonly extensionId: string

  constructor({ page, extensionId }: { page: Page; extensionId: string }) {
    this.page = page
    this.extensionId = extensionId
  }
}
