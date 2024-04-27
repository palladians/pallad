import { ButtonArrow } from "@/components/button-arrow"
import { WizardLayout } from "@/components/wizard-layout"

type StartViewProps = {
  onRestoreClicked: () => void
  onCreateClicked: () => void
}

export const StartView = ({
  onRestoreClicked,
  onCreateClicked,
}: StartViewProps) => (
  <WizardLayout
    title="Pallad"
    footer={
      <div className="flex flex-1 flex-col gap-2">
        <button
          type="button"
          className="flex-1 gap-2 group"
          onClick={onRestoreClicked}
          data-testid="onboarding__restoreWalletButton"
        >
          <span>Restore an existing wallet</span>
          <ButtonArrow />
        </button>
        <button
          type="button"
          className="flex-1 gap-2 group"
          onClick={onCreateClicked}
          data-testid="onboarding__createWalletButton"
        >
          <span>Create a new wallet</span>
          <ButtonArrow />
        </button>
      </div>
    }
  >
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
      <img src="/intro.png" className="w-[220px]" alt="Welcome to Pallad" />
      <p className="leading-7 text-muted-foreground">
        Your gateway to the Minaverse.
      </p>
    </div>
  </WizardLayout>
)
