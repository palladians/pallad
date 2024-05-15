import { expect, test } from "./extension"
import { devnetWallet } from "./fixtures"
import { OnboardingPom } from "./pom/onboarding"

const RECEIVER = "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

test("sends a berkeley transaction", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId("dashboard/send").click()
  await page.getByTestId("send/to").fill(RECEIVER)
  await page.getByTestId("send/amount").fill("1")
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
