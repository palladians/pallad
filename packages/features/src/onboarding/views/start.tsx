import HardwareIcon from "@/common/assets/hardware.svg?react"
import Logo from "@/common/assets/logo.svg?react"
import Plus from "@/common/assets/plus.svg?react"
import Restore from "@/common/assets/restore.svg?react"
import { WizardLayout } from "@/components/wizard-layout"
import clsx from "clsx"

type OptionCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  disabled?: boolean
  onClick: () => void
}

const OptionCard = ({
  title,
  description,
  icon,
  disabled,
  onClick,
}: OptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "card card-compact card-side items-center px-4 py-6 gap-4 cursor-pointer border-2 border-secondary",
        disabled ? "bg-neutral" : "bg-secondary",
      )}
    >
      <div className="btn btn-circle bg-neutral">{icon}</div>
      <div className="flex flex-col items-start">
        {disabled && <p className="text-sm text-mint">Coming soon!</p>}
        <p>{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </button>
  )
}

type StartViewProps = {
  onRestoreClicked: () => void
  onCreateClicked: () => void
}

export const StartView = ({
  onRestoreClicked,
  onCreateClicked,
}: StartViewProps) => (
  <WizardLayout>
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
      <div className="flex flex-col justify-center items-center gap-6">
        <Logo width={84} height={84} />
        <p className="text-mint">Your gateway to the Minaverse.</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <OptionCard
          title="Create a new wallet"
          description="Get a fresh address"
          icon={<Plus />}
          onClick={onCreateClicked}
        />
        <OptionCard
          title="Add existing wallet"
          description="With a seed phrase"
          icon={<Restore />}
          onClick={onRestoreClicked}
        />
        <OptionCard
          title="Hardware wallet"
          description="Connect your device"
          icon={<HardwareIcon />}
          onClick={() => console.log("Hardware Wallet")}
          disabled
        />
      </div>
    </div>
  </WizardLayout>
)
