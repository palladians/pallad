import { expect, test } from "./extension"
import { devnetWallet } from "./fixtures"
import { OnboardingPom } from "./pom/onboarding"

test("restores existing wallet", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  expect(await onboardingPom.getAddressTruncated()).toEqual(
    devnetWallet.addressTruncated,
  )
})

test("validates restore wallet data", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.goto()
  await onboardingPom.startRestoring()
  await onboardingPom.assertNextDisabled()
  await onboardingPom.fillWalletName(devnetWallet.walletName)
  // Password has to be at least 4 characters long
  await onboardingPom.fillSpendingPassword("ASD")
  await onboardingPom.toggleTos()
  await onboardingPom.goNext()
  const errors = await page.getByTestId("form__error").all()
  expect(errors.length).toEqual(1)
})
