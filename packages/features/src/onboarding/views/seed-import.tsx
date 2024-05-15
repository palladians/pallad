import { wordlist } from "@palladxyz/key-management"
import { Loader2Icon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Autocomplete } from "@/components/autocomplete"
import { WizardLayout } from "@/components/wizard-layout"

import type { MnemonicInputData } from "../types"

const MNEMONIC_LENGTH = 12
const mnemonicIterator = Array.from(
  { length: MNEMONIC_LENGTH },
  (_, i) => i + 1,
)

type MnemonicInputViewProps = {
  form: UseFormReturn<MnemonicInputData, any, undefined>
  onSubmit: (data: any) => unknown
  mnemonicValid: boolean
  restoring: boolean
}

export const SeedImportView = ({
  form,
  onSubmit,
  mnemonicValid,
  restoring,
}: MnemonicInputViewProps) => (
  <WizardLayout
    title="Seed import"
    backButtonPath={-1}
    footer={
      <button
        type="button"
        className="btn btn-primary max-w-48 w-full"
        disabled={!mnemonicValid || restoring}
        onClick={form.handleSubmit(onSubmit)}
        data-testid="formSubmit"
      >
        {restoring && <Loader2Icon size={16} className="animate-spin" />}
        <span>Next</span>
      </button>
    }
  >
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-mint">
        Enter your 12-word seed phrase in in the right order in the inputs below
      </p>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {mnemonicIterator.map((wordLabel, i) => (
          <Autocomplete
            // biome-ignore lint: hardcoded
            key={i}
            placeholder={`${wordLabel}.`}
            options={wordlist}
            value={form.watch(`mnemonic.${i}`)}
            autoFocus={i === 0}
            onPaste={(event) => {
              if (i !== 0) return
              const value = event.clipboardData.getData("Text")
              event.currentTarget.blur()
              const mnemonic = value.split(" ")
              if (mnemonic.length !== 12) return
              mnemonic.forEach((word, i) => {
                form.setValue(`mnemonic.${i}`, word)
              })
            }}
            testId={`onboarding/mnemonicField.${i}`}
            {...form.register(`mnemonic.${i}`)}
            onChange={(value) => {
              form.setValue(`mnemonic.${i}`, value)
            }}
          />
        ))}
      </div>
    </div>
  </WizardLayout>
)
