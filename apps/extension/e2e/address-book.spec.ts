import { expect, test } from './extension'
import { OnboardingPom } from './pom/onboarding'

const PUBLIC_KEY = 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS'

test('creates and deletes contact', async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId('bottomNavigation__addressBook').click()
  await page.getByTestId('addressBook__addAddressButton').click()
  await page.getByTestId('newAddress__nameInput').fill('New Contact')
  await page.getByTestId('newAddress__addressInput').fill(PUBLIC_KEY)
  await page.getByTestId('newAddress__createButton').click()
  await page.getByTestId('bottomNavigation__addressBook').click()
  const contacts = await page.getByTestId('addressBook__contact').all()
  // 2 including donate Pallad option.
  expect(contacts.length).toEqual(2)
})
