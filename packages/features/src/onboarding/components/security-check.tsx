import { useTranslation } from "react-i18next"

import NoLookIcon from "@/common/assets/nolook.svg?react"
import { WizardLayout } from "@/components/wizard-layout"

type SecurityCheckProps = {
  title: string
  onConfirm: () => void
}

export const SecurityCheck = ({ title, onConfirm }: SecurityCheckProps) => (
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
        {useTranslation().t("confirm")}
      </button>
    }
  >
    <div className="flex flex-1 flex-col justify-center items-center gap-4 text-center">
      <NoLookIcon />
      <h1 className="text-2xl max-w-[260px]">
        {useTranslation().t("youreAlone")}
      </h1>
      <p className="max-w-[260px]">
        {useTranslation().t("screenNotRecording")}
      </p>
    </div>
  </WizardLayout>
)
