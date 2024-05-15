import { expect } from "../extension"
import { devnetWallet } from "../fixtures"
import { BasePom } from "./base"

const TestId = {
  RESTORE_WALLET_BUTTON: "onboarding/restoreWalletButton",
  CREATE_WALLET_BUTTON: "onboarding/createWalletButton",
  WALLET_NAME_INPUT: "onboarding/walletNameInput",
  SPENDING_PASSWORD_INPUT: "onboarding/spendingPasswordInput",
  TOS_CHECKBOX: "onboarding/tosCheckbox",
  NEXT_BUTTON: "formSubmit",
  BACK_BUTTON: "onboarding/backButton",
  MNEMONIC_FIELD: "onboarding/mnemonicField",
  ADDRESS_TRUNCATED: "dashboard/addressTruncated",
  MINA_BALANCE: "dashboard/minaBalance",
  MNEMONIC_WORD: "onboarding/mnemonicWord",
  MNEMONIC_WRITTEN_CHECKBOX: "onboarding/mnemonicWrittenCheckbox",
  MNEMONIC_WRITEDOWN_INDEX: "onboarding/writedownIndex",
  MNEMONIC_CONFIRMATION_INPUT: "onboarding/mnemonicConfirmationInput",
} as const

export class OnboardingPom extends BasePom {
  goto() {
    return this.page.goto(`chrome-extension://${this.extensionId}/index.html`)
  }
  startRestoring() {
    const restoreWalletButton = this.page.getByTestId(
      TestId.RESTORE_WALLET_BUTTON,
    )
    return restoreWalletButton.click()
  }
  startCreating() {
    const createWalletButton = this.page.getByTestId(
      TestId.CREATE_WALLET_BUTTON,
    )
    return createWalletButton.click()
  }
  fillWalletName(walletName: string) {
    const walletNameInput = this.page.getByTestId(TestId.WALLET_NAME_INPUT)
    return walletNameInput.fill(walletName)
  }
  fillSpendingPassword(spendingPassword: string) {
    const spendingPasswordInput = this.page.getByTestId(
      TestId.SPENDING_PASSWORD_INPUT,
    )
    return spendingPasswordInput.fill(spendingPassword)
  }
  toggleTos() {
    const tosCheckbox = this.page.getByTestId(TestId.TOS_CHECKBOX)
    return tosCheckbox.click()
  }
  goNext() {
    const nextButton = this.page.getByTestId(TestId.NEXT_BUTTON)
    return nextButton.click()
  }
  assertNextDisabled() {
    const nextButton = this.page.getByTestId(TestId.NEXT_BUTTON)
    expect(nextButton.isDisabled).toBeTruthy()
  }
  goBack() {
    const backButton = this.page.getByTestId(TestId.BACK_BUTTON)
    return backButton.click()
  }
  confirmAlone() {
    const confirmAloneButton = this.page.getByTestId(TestId.NEXT_BUTTON)
    return confirmAloneButton.click()
  }
  async fillMnemonic(mnemonic: string[]) {
    for (let i = 0; i < mnemonic.length; i++) {
      const field = this.page.getByTestId(`${TestId.MNEMONIC_FIELD}.${i}`)
      await field.fill(mnemonic[i])
    }
  }
  getAddressTruncated() {
    const addressTruncated = this.page.getByTestId(TestId.ADDRESS_TRUNCATED)
    return addressTruncated.textContent()
  }
  async getMnemonicWords() {
    const mnemonicWords = await this.page
      .getByTestId(TestId.MNEMONIC_WORD)
      .all()
    return await Promise.all(mnemonicWords.map((word) => word.innerText()))
  }
  toggleMnemonicWritten() {
    const mnemonicWritten = this.page.getByTestId(
      TestId.MNEMONIC_WRITTEN_CHECKBOX,
    )
    return mnemonicWritten.click()
  }
  async getMnemonicConfirmationIndex() {
    const wordIndex = await this.page
      .getByTestId(TestId.MNEMONIC_WRITEDOWN_INDEX)
      .getAttribute("data-word-index")
    return Number.parseInt(wordIndex)
  }
  fillMnemonicConfirmation(specificWord: string) {
    const mnemonicConfirmationInput = this.page.getByTestId(
      TestId.MNEMONIC_CONFIRMATION_INPUT,
    )
    return mnemonicConfirmationInput.fill(specificWord)
  }
  getMinaBalance() {
    const minaBalance = this.page.getByTestId(TestId.MINA_BALANCE)
    return minaBalance.innerText()
  }

  async restoreTestWallet() {
    await this.goto()
    await this.startRestoring()
    await this.fillWalletName(devnetWallet.walletName)
    await this.fillSpendingPassword(devnetWallet.spendingPassword)
    await this.toggleTos()
    await this.goNext()
    await this.confirmAlone()
    await this.fillMnemonic(devnetWallet.mnemonic)
    await this.goNext()
    const pageTitle = this.page.getByText("All done!")
    await pageTitle.waitFor()
    await this.goNext()
  }
}
