import { expect, test } from './extension'
import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

test('locks and unlocks existing wallet', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId('bottomNavigation__menu').click()
  await page.getByTestId('commandMenu__lockWallet').click()
  await page
    .getByTestId('unlockWallet__password')
    .fill(devnetWallet.spendingPassword)
  await page.getByTestId('unlockWallet__unlockButton').click()
  expect(await onboardingPom.getMinaBalance()).toEqual('0 MINA')
})
