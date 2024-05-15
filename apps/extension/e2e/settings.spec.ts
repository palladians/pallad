import { test } from "./extension"
import { OnboardingPom } from "./pom/onboarding"

// TODO: uncomment when we add wallet management functions
test.skip("restart wallet", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId("bottomNavigation/menu").click()
  await page.getByTestId("commandMenu/settings").click()
  await page.getByTestId("settings/restartWallet").click()
  await page.getByTestId("restartWallet/confirm").click()
})
