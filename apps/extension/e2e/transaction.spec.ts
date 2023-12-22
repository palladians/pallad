import { expect, test } from './extension'
import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

const RECEIVER = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

test('sends a berkeley transaction', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId('bottomNavigation__menu').click()
  await page.getByTestId('commandMenu__send').click()
  await page.getByTestId('send__to').fill(RECEIVER)
  await page.getByTestId('send__amount').fill('1')
  await page.getByTestId('send__nextButton').click()
  await page
    .getByTestId('confirm__spendingPassword')
    .fill(devnetWallet.spendingPassword)
  await page.getByTestId('confirm__nextButton').click()
  await page.getByTestId('transactionResult__nextButton').click()
  await expect(
    page.getByTestId('transactions__pendingTransactions').first()
  ).toBeVisible()
})
