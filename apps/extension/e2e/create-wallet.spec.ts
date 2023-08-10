import { expect, test } from './extension'
import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

test('create new wallet', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
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
  const pageTitle = page.getByText('Stay Connected')
  await pageTitle.waitFor()
  await onboardingPom.goNext()
  expect(await onboardingPom.getMinaBalance()).toEqual('MINA')
})
