import { TransactionFee } from "@/common/lib/const"
import { clsx } from "clsx"
import { useTranslation } from "react-i18next"
type TransactionFeeShortProps = {
  feeValue: keyof typeof TransactionFee
  onClick: () => void
}

export const TransactionFeeShort = ({
  feeValue,
  onClick,
}: TransactionFeeShortProps) => {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      className="btn btn-link text-base-content no-underline hover:no-underline"
      onClick={onClick}
    >
      <span className="underline">{t("components.transactionFee")}</span>
      <span>{TransactionFee[feeValue]} MINA</span>
    </button>
  )
}

type FeePickerProps = {
  feeValue: keyof typeof TransactionFee
  setValue: (key: any, value: string) => void
}

export const FeePicker = ({ feeValue, setValue }: FeePickerProps) => {
  const { t } = useTranslation()
  return (
    <div className="join w-full">
      <button
        type="button"
        className={clsx(
          "btn flex-1 flex-col join-item flex-nowrap",
          feeValue === "slow" ? "btn-primary" : "btn-secondary",
        )}
        onClick={() => setValue("fee", "slow")}
      >
        <div>{t("onboarding.slow")}</div>
        <div className="text-nowrap">{TransactionFee.slow} MINA</div>
      </button>
      <button
        type="button"
        className={clsx(
          "btn flex-1 flex-col join-item flex-nowrap",
          feeValue === "default" ? "btn-primary" : "btn-secondary",
        )}
        onClick={() => setValue("fee", "default")}
      >
        <div>{t("onboarding.normal")}</div>
        <div className="text-nowrap">{TransactionFee.default} MINA</div>
      </button>
      <button
        type="button"
        className={clsx(
          "btn flex-1 flex-col join-item flex-nowrap",
          feeValue === "fast" ? "btn-primary" : "btn-secondary",
        )}
        onClick={() => setValue("fee", "fast")}
      >
        <div>{t("onboarding.fast")}</div>
        <div className="text-nowrap">{TransactionFee.fast} MINA</div>
      </button>
    </div>
  )
}
