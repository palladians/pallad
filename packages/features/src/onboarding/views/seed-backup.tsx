import { WizardLayout } from "@/components/wizard-layout"
import { useTranslation } from "react-i18next"

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
}: MnemonicWritedownViewProps) => {
  const { t } = useTranslation()
  return (
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
          {t("savedIt")}
        </button>
      }
    >
      <div className="flex flex-col justify-center items-center flex-1 gap-8">
        <p className="text-mint text-center max-w-[240px]">
          {t("keepThisSafe")}
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
            {t("backedUp")}
          </label>
        </div>
      </div>
    </WizardLayout>
  )
}
