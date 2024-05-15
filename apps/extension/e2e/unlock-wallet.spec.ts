import { expect, test } from "./extension"
import { devnetWallet } from "./fixtures"
import { OnboardingPom } from "./pom/onboarding"

test("locks and unlocks existing wallet", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId("menu/open").click()
  await page.getByTestId("menu/settings").click()
  await page.getByTestId("settings/logOut").click()
  await page.getByTestId("unlockWallet/password").fill("Wrong Password")
  const unlockWalletButton = page.getByTestId("submitForm")
  expect(unlockWalletButton.isDisabled).toBeTruthy()
  await page
    .getByTestId("unlockWallet/password")
    .fill(devnetWallet.spendingPassword)
  await unlockWalletButton.click()
  const portfolioLabel = page.getByText("Portfolio value")
  await portfolioLabel.waitFor()
})
