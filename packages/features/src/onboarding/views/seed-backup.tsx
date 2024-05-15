import { WizardLayout } from "@/components/wizard-layout"

type MnemonicWritedownViewProps = {
  onConfirm: () => void
  mnemonicWords: string[]
  mnemonicWritten: boolean
  setMnemonicWritten: (value: boolean) => void
}

export const SeedBackupView = ({
  onConfirm,
  mnemonicWords,
  mnemonicWritten,
  setMnemonicWritten,
}: MnemonicWritedownViewProps) => (
  <WizardLayout
    title="Seed backup"
    backButtonPath={-1}
    footer={
      <button
        type="button"
        className="btn btn-primary max-w-48 w-full"
        disabled={!mnemonicWritten}
        onClick={onConfirm}
        data-testid="formSubmit"
      >
        I saved it
      </button>
    }
  >
    <div className="flex flex-col justify-center items-center flex-1 gap-8">
      <p className="text-mint text-center max-w-[240px]">
        Keep this in a safe place, never share them with anyone
      </p>
      <div className="grid grid-cols-3 gap-2">
        {mnemonicWords.map((word, i) => (
          <div
            // biome-ignore lint: won't update
            key={i}
            data-testid="onboarding/mnemonicWord"
            className="btn btn-sm bg-[#413E5E]"
          >
            {word}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          id="mnemonicWrittenCheckbox"
          className="checkbox rounded-md"
          checked={mnemonicWritten}
          onClick={() => setMnemonicWritten(!mnemonicWritten)}
          data-testid="onboarding/mnemonicWrittenCheckbox"
        />
        <label htmlFor="mnemonicWrittenCheckbox" className="leading-5">
          I have backed up the seed phrase and acknowledge they will not be
          shown to me again
        </label>
      </div>
    </div>
  </WizardLayout>
)
