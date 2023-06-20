import { getTestId } from '../utils'
import { BasePom } from './base'

const TestId = {
  RESTORE_WALLET_BUTTON: 'onboarding__restoreWalletButton',
  CREATE_WALLET_BUTTON: 'onboarding__createWalletButton',
  WALLET_NAME_INPUT: 'onboarding__walletNameInput',
  SPENDING_PASSWORD_INPUT: 'onboarding__spendingPasswordInput',
  TOS_CHECKBOX: 'onboarding__tosCheckbox',
  NEXT_BUTTON: 'onboarding__nextButton',
  BACK_BUTTON: 'onboarding__backButton',
  CONFIRM_ALONE: 'onboarding__confirmAlone',
  YOUR_MNEMONIC_TEXTAREA: 'onboarding__yourMnemonicTextarea',
  ADDRESS_TRUNCATED: 'dashboard__addressTruncated',
  MINA_BALANCE: 'dashboard__minaBalance',
  MNEMONIC_WORD: 'onboarding__mnemonicWord',
  MNEMONIC_WRITTEN_CHECKBOX: 'onboarding__mnemonicWrittenCheckbox',
  MNEMONIC_WRITEDOWN_INDEX: 'onboarding__writedownIndex',
  MNEMONIC_CONFIRMATION_INPUT: 'onboarding__mnemonicConfirmationInput'
} as const

export class OnboardingPom extends BasePom {
  goto() {
    return this.page.goto('/')
  }
  async startRestoring() {
    const restoreWalletButton = await this.page.locator(
      getTestId(TestId.RESTORE_WALLET_BUTTON)
    )
    return restoreWalletButton.click()
  }
  async startCreating() {
    const createWalletButton = await this.page.locator(
      getTestId(TestId.CREATE_WALLET_BUTTON)
    )
    return createWalletButton.click()
  }
  async fillWalletName(walletName: string) {
    const walletNameInput = await this.page.locator(
      getTestId(TestId.WALLET_NAME_INPUT)
    )
    return walletNameInput.fill(walletName)
  }
  async fillSpendingPassword(spendingPassword: string) {
    const spendingPasswordInput = await this.page.locator(
      getTestId(TestId.SPENDING_PASSWORD_INPUT)
    )
    return spendingPasswordInput.fill(spendingPassword)
  }
  async toggleTos() {
    const tosCheckbox = await this.page.locator(getTestId(TestId.TOS_CHECKBOX))
    return tosCheckbox.click()
  }
  async goNext() {
    const nextButton = await this.page.locator(getTestId(TestId.NEXT_BUTTON))
    return nextButton.click()
  }
  async goBack() {
    const backButton = await this.page.locator(getTestId(TestId.BACK_BUTTON))
    return backButton.click()
  }
  async confirmAlone() {
    const backButton = await this.page.locator(getTestId(TestId.CONFIRM_ALONE))
    return backButton.click()
  }
  async fillMnemonic(mnemonic: string) {
    const mnemonicTextarea = await this.page.locator(
      getTestId(TestId.YOUR_MNEMONIC_TEXTAREA)
    )
    return mnemonicTextarea.fill(mnemonic)
  }
  async getAddressTruncated() {
    const addressTruncated = await this.page.locator(
      getTestId(TestId.ADDRESS_TRUNCATED)
    )
    return addressTruncated.textContent()
  }
  async getMnemonicWords() {
    const mnemonicWords = await this.page
      .locator(getTestId(TestId.MNEMONIC_WORD))
      .all()
    return await Promise.all(mnemonicWords.map((word) => word.innerText()))
  }
  async toggleMnemonicWritten() {
    const mnemonicWritten = await this.page.locator(
      getTestId(TestId.MNEMONIC_WRITTEN_CHECKBOX)
    )
    return mnemonicWritten.click()
  }
  async getMnemonicConfirmationIndex() {
    const inputLabel = await this.page
      .getByTestId(TestId.MNEMONIC_WRITEDOWN_INDEX)
      .innerText()
    const [, confirmationIndex] = await inputLabel.split('#')
    return parseInt(confirmationIndex) - 1
  }
  async fillMnemonicConfirmation(specificWord: string) {
    const mnemonicConfirmationInput = await this.page.getByTestId(
      TestId.MNEMONIC_CONFIRMATION_INPUT
    )
    return mnemonicConfirmationInput.fill(specificWord)
  }
  async getMinaBalance() {
    const minaBalance = await this.page.getByTestId(TestId.MINA_BALANCE)
    return minaBalance.innerText()
  }
}
