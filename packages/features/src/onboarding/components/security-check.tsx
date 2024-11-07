import NoLookIcon from "@/common/assets/nolook.svg?react"
import { WizardLayout } from "@/components/wizard-layout"

import { useTranslation } from "react-i18next"

type SecurityCheckProps = {
  title: string
  onConfirm: () => void
}

export const SecurityCheck = ({ title, onConfirm }: SecurityCheckProps) => {
  const { t } = useTranslation()
  return (
    <WizardLayout
      title={title}
      backButtonPath={-1}
      footer={
        <button
          type="button"
          className="btn btn-primary max-w-48 w-full"
          onClick={onConfirm}
          data-testid="formSubmit"
        >
          {t("onboarding.confirm")}
        </button>
      }
    >
      <div className="flex flex-1 flex-col justify-center items-center gap-4 text-center">
        <NoLookIcon />
        <h1 className="text-2xl max-w-[260px]">{t("onboarding.youreAlone")}</h1>
        <p className="max-w-[260px]">{t("onboarding.screenNotRecording")}</p>
      </div>
    </WizardLayout>
  )
}
