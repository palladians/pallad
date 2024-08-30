import { Loader2Icon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { WizardLayout } from "@/components/wizard-layout"

import type { MnemonicConfirmationData } from "../types"

type SeedBackupConfirmationViewProps = {
  onSubmit: () => unknown
  form: UseFormReturn<MnemonicConfirmationData, any, undefined>
  restoring: boolean
  confirmationIndex: number
  confirmationValid: boolean
}

export const SeedBackupConfirmationView = ({
  onSubmit,
  form,
  restoring,
  confirmationIndex,
  confirmationValid,
}: SeedBackupConfirmationViewProps) => (
  <WizardLayout
    title="Seed backup"
    backButtonPath={-1}
    footer={
      <button
        type="submit"
        form="mnemonicConfirmationForm"
        className="btn btn-primary max-w-48 w-full"
        disabled={!confirmationValid || restoring}
        data-testid="formSubmit"
      >
        {restoring && <Loader2Icon size={16} className="animate-spin" />}
        <span>{useTranslation().t("next")}</span>
      </button>
    }
  >
    <form
      className="flex flex-col flex-1 gap-1"
      id="mnemonicConfirmationForm"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <label
        htmlFor="confirmation"
        className="label"
        data-testid="onboarding/writedownIndex"
        data-word-index={confirmationIndex}
      >
        {useTranslation().t("word-number")} {confirmationIndex + 1}
      </label>
      <input
        id="confirmation"
        className="input"
        placeholder="Enter the word"
        data-testid="onboarding/mnemonicConfirmationInput"
        {...form.register("mnemonicWord")}
      />
      <p className="text-mint mt-4">
        {useTranslation().t("confirm-saved-seed")}
      </p>
    </form>
  </WizardLayout>
)
