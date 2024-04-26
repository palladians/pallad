import { expect } from "../extension"
import { devnetWallet } from "../fixtures"
import { BasePom } from "./base"

const TestId = {
  RESTORE_WALLET_BUTTON: "onboarding__restoreWalletButton",
  CREATE_WALLET_BUTTON: "onboarding__createWalletButton",
  WALLET_NAME_INPUT: "onboarding__walletNameInput",
  SPENDING_PASSWORD_INPUT: "onboarding__spendingPasswordInput",
  TOS_CHECKBOX: "onboarding__tosCheckbox",
  NEXT_BUTTON: "onboarding__nextButton",
  BACK_BUTTON: "onboarding__backButton",
  CONFIRM_ALONE: "onboarding__confirmAlone",
  MNEMONIC_FIELD: "onboarding__mnemonicField",
  ADDRESS_TRUNCATED: "dashboard__addressTruncated",
  MINA_BALANCE: "dashboard__minaBalance",
  MNEMONIC_WORD: "onboarding__mnemonicWord",
  MNEMONIC_WRITTEN_CHECKBOX: "onboarding__mnemonicWrittenCheckbox",
  MNEMONIC_WRITEDOWN_INDEX: "onboarding__writedownIndex",
  MNEMONIC_CONFIRMATION_INPUT: "onboarding__mnemonicConfirmationInput",
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
    const confirmAloneButton = this.page.getByTestId(TestId.CONFIRM_ALONE)
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
    const inputLabel = await this.page
      .getByTestId(TestId.MNEMONIC_WRITEDOWN_INDEX)
      .innerText()
    const [, confirmationIndex] = inputLabel.split("#")
    return Number.parseInt(confirmationIndex) - 1
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
    const pageTitle = this.page.getByText("Stay Connected")
    await pageTitle.waitFor()
    await this.goNext()
  }
}
