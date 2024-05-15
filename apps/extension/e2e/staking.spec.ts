import { expect, test } from "./extension"
import { devnetWallet } from "./fixtures"
import { OnboardingPom } from "./pom/onboarding"

const VALIDATOR = "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

test("delegate to self", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId("menu/open").click()
  await page.getByTestId("menu/staking").click()
  await page.getByTestId("staking/start").click()
  await page.getByTestId("delegate/to").fill(VALIDATOR)
  await page.getByTestId("formSubmit").click()
  await page
    .getByTestId("confirm/spendingPassword")
    .fill(devnetWallet.spendingPassword)
  await page.getByTestId("formSubmit").click()
  await page.getByTestId("formSubmit").click()
  await expect(
    page.getByTestId("transactions/pendingTransactions").first(),
  ).toBeVisible()
})
