import HardwareIcon from "@/common/assets/hardware.svg?react"
import Logo from "@/common/assets/logo.svg?react"
import Plus from "@/common/assets/plus.svg?react"
import Restore from "@/common/assets/restore.svg?react"
import { WizardLayout } from "@/components/wizard-layout"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

type OptionCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  disabled?: boolean
  onClick: () => void
  testId: string
}

const OptionCard = ({
  title,
  description,
  icon,
  disabled,
  onClick,
  testId,
}: OptionCardProps) => {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "card card-compact card-side items-center px-4 py-6 gap-4 cursor-pointer border-2 border-secondary",
        disabled ? "bg-neutral" : "bg-secondary",
      )}
      data-testid={testId}
    >
      <div className="btn btn-circle bg-neutral">{icon}</div>
      <div className="flex flex-col items-start">
        {disabled && <p className="text-sm text-mint">{t("comingSoon")}</p>}
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
}: StartViewProps) => {
  const { t } = useTranslation()
  return (
    <WizardLayout headerShown={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
        <div className="flex flex-col justify-center items-center gap-6">
          <Logo width={84} height={84} />
          <p className="text-mint">{t("onboarding.yourGateway")}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <OptionCard
            title="Create a new wallet"
            description="Get a fresh address"
            icon={<Plus />}
            onClick={onCreateClicked}
            testId="onboarding/createWalletButton"
          />
          <OptionCard
            title="Add existing wallet"
            description="With a seed phrase"
            icon={<Restore />}
            onClick={onRestoreClicked}
            testId="onboarding/restoreWalletButton"
          />
          <OptionCard
            title="Hardware wallet"
            description="Connect your device"
            icon={<HardwareIcon />}
            onClick={() => console.log("Hardware Wallet")}
            testId="onboarding/hardwareWalletButton"
            disabled
          />
        </div>
      </div>
    </WizardLayout>
  )
}
