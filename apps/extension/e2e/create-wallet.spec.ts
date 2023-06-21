import { expect, test } from '@playwright/test'

import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

test('create new wallet', async ({ page }) => {
  const onboardingPom = new OnboardingPom(page)
  await onboardingPom.goto()
  await onboardingPom.startCreating()
  await onboardingPom.fillWalletName(devnetWallet.walletName)
  await onboardingPom.fillSpendingPassword(devnetWallet.spendingPassword)
  await onboardingPom.toggleTos()
  await onboardingPom.goNext()
  await onboardingPom.confirmAlone()
  const mnemonicWords = await onboardingPom.getMnemonicWords()
  await onboardingPom.toggleMnemonicWritten()
  await onboardingPom.goNext()
  const confirmationIndex = await onboardingPom.getMnemonicConfirmationIndex()
  await onboardingPom.fillMnemonicConfirmation(mnemonicWords[confirmationIndex])
  await onboardingPom.goNext()
  await expect(await onboardingPom.getMinaBalance()).toEqual('0 MINA')
})
