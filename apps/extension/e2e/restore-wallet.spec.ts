import { expect, test } from './extension'
import { devnetWallet } from './fixtures'
import { OnboardingPom } from './pom/onboarding'

test('restores existing wallet', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  expect(await onboardingPom.getAddressTruncated()).toEqual(
    devnetWallet.addressTruncated
  )
})
