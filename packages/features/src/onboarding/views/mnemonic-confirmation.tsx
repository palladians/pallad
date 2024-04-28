import { Loader2Icon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { ButtonArrow } from "@/components/button-arrow"
import { WizardLayout } from "@/components/wizard-layout"
import { cn } from "@/lib/utils"

import type { MnemonicConfirmationData } from "../types"

type MnemonicConfirmationViewProps = {
  onSubmit: () => unknown
  form: UseFormReturn<MnemonicConfirmationData, any, undefined>
  restoring: boolean
  confirmationIndex: number
  confirmationValid: boolean
}

export const MnemonicConfirmationView = ({
  onSubmit,
  form,
  restoring,
  confirmationIndex,
  confirmationValid,
}: MnemonicConfirmationViewProps) => (
  <WizardLayout
    title="Confirm The Mnemonic"
    backButtonPath={-1}
    footer={
      <button
        type="submit"
        form="mnemonicConfirmationForm"
        className={cn([
          "flex-1 opacity-50 transition-opacity gap-2 group",
          confirmationValid && "opacity-100",
        ])}
        disabled={!confirmationValid || restoring}
        data-testid="onboarding__nextButton"
      >
        {restoring && <Loader2Icon size={16} className="animate-spin" />}
        <span>Next</span>
      </button>
    }
  >
    <form
      className="flex flex-col flex-1 gap-4 p-4"
      id="mnemonicConfirmationForm"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <label data-testid="onboarding__writedownIndex">
        Type in the word #{confirmationIndex + 1}
      </label>
      <input
        data-testid="onboarding__mnemonicConfirmationInput"
        {...form.register("mnemonicWord")}
      />
    </form>
  </WizardLayout>
)
