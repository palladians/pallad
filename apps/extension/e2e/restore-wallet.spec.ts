import { expect, test } from '@playwright/test'

import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

test('restores existing wallet', async ({ page }) => {
  const onboardingPom = new OnboardingPom(page)
  await onboardingPom.goto()
  await onboardingPom.startRestoring()
  await onboardingPom.fillWalletName(devnetWallet.walletName)
  await onboardingPom.fillSpendingPassword(devnetWallet.spendingPassword)
  await onboardingPom.toggleTos()
  await onboardingPom.goNext()
  await onboardingPom.confirmAlone()
  await onboardingPom.fillMnemonic(devnetWallet.mnemonic)
  await onboardingPom.goNext()
  await expect(await onboardingPom.getAddressTruncated()).toEqual(
    devnetWallet.addressTruncated
  )
})
