import { expect, test } from "./extension"
import { OnboardingPom } from "./pom/onboarding"

const PUBLIC_KEY = "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"

test("creates and deletes contact", async ({ page, extensionId }) => {
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()
  await page.getByTestId("menu/open").click()
  await page.getByTestId("menu/addressBook").click()
  await page.getByTestId("addressBook/addAddressButton").click()
  await page.getByTestId("newAddress/nameInput").fill("New Contact")
  await page.getByTestId("newAddress/addressInput").fill(PUBLIC_KEY)
  await page.getByTestId("submitForm").click()
  const contactsAfterCreation = await page
    .getByTestId("addressBook/contact")
    .all()
  // 2 including donate Pallad option.
  expect(contactsAfterCreation.length).toEqual(1)
  await page.getByTestId("addressBook/contact").hover()
  await page.getByTestId("addressBook/removeAddress").click()
  const contactsAfterDeletion = await page
    .getByTestId("addressBook/contact")
    .all()
  expect(contactsAfterDeletion.length).toEqual(0)
})
