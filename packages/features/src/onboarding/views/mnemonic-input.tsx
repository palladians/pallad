import { wordlist } from "@palladxyz/key-management"
import { Loader2Icon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Autocomplete } from "@/components/autocomplete"
import { SecurityCheck } from "@/components/security-check"
import { WizardLayout } from "@/components/wizard-layout"
import { cn } from "@/lib/utils"

import type { MnemonicInputData } from "../types"

const MNEMONIC_LENGTH = 12
const mnemonicIterator = Array.from(
  { length: MNEMONIC_LENGTH },
  (_, i) => i + 1,
)

type MnemonicInputViewProps = {
  onSafetyConfirmed: (value: boolean) => void
  safetyConfirmed: boolean
  form: UseFormReturn<MnemonicInputData, any, undefined>
  onSubmit: (data: any) => unknown
  mnemonicValid: boolean
  restoring: boolean
}

export const MnemonicInputView = ({
  onSafetyConfirmed,
  safetyConfirmed,
  form,
  onSubmit,
  mnemonicValid,
  restoring,
}: MnemonicInputViewProps) => (
  <WizardLayout
    title="Restore from Mnemonic"
    backButtonPath={-1}
    footer={
      <button
        type="button"
        className={cn([
          "flex-1 transition-opacity opacity-50 gap-2 group",
          mnemonicValid && "opacity-100",
        ])}
        disabled={!mnemonicValid || restoring}
        onClick={form.handleSubmit(onSubmit)}
        data-testid="onboarding__nextButton"
      >
        {restoring && <Loader2Icon size={16} className="animate-spin" />}
        <span>Next</span>
      </button>
    }
  >
    <div className="flex flex-1 flex-col gap-4">
      {safetyConfirmed ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-1 flex-col gap-4 p-4">
          <label htmlFor="mnemonicTextarea">Mnemonic</label>
          <div className="grid grid-cols-3 gap-2">
            {mnemonicIterator.map((wordLabel, i) => (
              <Autocomplete
                // biome-ignore lint: hardcoded
                key={i}
                placeholder={wordLabel.toString()}
                options={wordlist}
                value={form.watch(`mnemonic.${i}`)}
                autoFocus={i === 0}
                // onPaste={(event) => {
                //   if (i !== 0) return;
                //   const value = event.clipboardData.getData("Text");
                //   event.currentTarget.blur();
                //   const mnemonic = value.split(" ");
                //   if (mnemonic.length !== 12) return;
                //   mnemonic.forEach((word, i) => {
                //     form.setValue(`mnemonic.${i}`, word);
                //   });
                // }}
                data-testid={`onboarding__mnemonicField.${i}`}
                {...form.register(`mnemonic.${i}`)}
                onChange={(value) => {
                  form.setValue(`mnemonic.${i}`, value)
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 p-4">
          <SecurityCheck onConfirm={() => onSafetyConfirmed(true)} />
        </div>
      )}
    </div>
  </WizardLayout>
)
