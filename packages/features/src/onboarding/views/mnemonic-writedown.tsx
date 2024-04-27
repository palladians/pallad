import { SecurityCheck } from "@/components/security-check"
import { WizardLayout } from "@/components/wizard-layout"
import { cn } from "@/lib/utils"

type MnemonicWritedownViewProps = {
  onConfirm: () => void
  onSafetyConfirmed: (value: boolean) => void
  safetyConfirmed: boolean
  mnemonicWords: string[]
  mnemonicWritten: boolean
  setMnemonicWritten: (value: boolean) => void
}

export const MnemonicWritedownView = ({
  onConfirm,
  onSafetyConfirmed,
  safetyConfirmed,
  mnemonicWords,
  mnemonicWritten,
  setMnemonicWritten,
}: MnemonicWritedownViewProps) => (
  <WizardLayout
    title="Mnemonic Backup"
    backButtonPath={-1}
    footer={
      <button
        type="button"
        className={cn([
          "flex-1 transition-opacity opacity-50",
          mnemonicWritten && "opacity-100",
        ])}
        disabled={!mnemonicWritten}
        onClick={onConfirm}
        data-testid="onboarding__nextButton"
      >
        Next
      </button>
    }
  >
    <div className="flex flex-col flex-1 gap-8">
      {safetyConfirmed ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-col gap-4 p-4">
          <label>Back up the mnemonic</label>
          <div className="grid grid-cols-3 gap-2">
            {mnemonicWords.map((word, i) => (
              <div
                // biome-ignore lint: won't update
                key={i}
                data-testid="onboarding__mnemonicWord"
                className="badge"
              >
                {word}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="mnemonicWrittenCheckbox"
              checked={mnemonicWritten}
              onClick={() => setMnemonicWritten(!mnemonicWritten)}
              data-testid="onboarding__mnemonicWrittenCheckbox"
            />
            <label htmlFor="mnemonicWrittenCheckbox" className="leading-5">
              I have backed up the mnemonic and acknowledge that it will not be
              shown to me again.
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-2 p-4">
          <SecurityCheck onConfirm={() => onSafetyConfirmed(true)} />
        </div>
      )}
    </div>
  </WizardLayout>
)
