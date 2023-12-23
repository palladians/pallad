import { expect, test } from './extension'
import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

const VALIDATOR = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

test('delegate to self', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId('bottomNavigation__menu').click()
  await page.getByTestId('commandMenu__delegate').click()
  await page.getByTestId('delegate__to').fill(VALIDATOR)
  await page.getByTestId('delegate__nextButton').click()
  await page
    .getByTestId('confirm__spendingPassword')
    .fill(devnetWallet.spendingPassword)
  await page.getByTestId('confirm__nextButton').click()
  await page.getByTestId('transactionResult__nextButton').click()
  await expect(
    page.getByTestId('transactions__pendingTransactions').first()
  ).toBeVisible()
})
