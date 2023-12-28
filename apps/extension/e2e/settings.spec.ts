import { expect, test } from './extension'
import { OnboardingPom } from './pom/onboarding'

test('restart wallet', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId('bottomNavigation__menu').click()
  await page.getByTestId('commandMenu__settings').click()
  await page.getByTestId('settings__restartWallet').click()
  await page.getByTestId('restartWallet__confirm').click()
  expect(await page.getByTestId('appLayout').count()).toEqual(0)
})
